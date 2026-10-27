import { randomBytes } from 'node:crypto'

const PREFIX = '/__aruzahr-voices/'
const MAX_AUDIO_BYTES = 12 * 1024 * 1024
const MAX_CACHE_BYTES = 40 * 1024 * 1024
const TTL = 60 * 60 * 1000
const failure = (message, status = 400) => {
  throw Object.assign(new Error(message), { status })
}
function json(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  res.end(JSON.stringify(value))
}
/** The server accepts only local, same-origin operator fetches. No API key is
 * ever returned, persisted in a project, or forwarded to the broadcast relay. */
export function validateVoiceRequest(req) {
  if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) failure('Ses üretimini bu bilgisayarda 127.0.0.1 adresinden aç.', 403)
  let host
  try { host = new URL(`http://${req.headers.host}`).hostname } catch { failure('Yerel adres gerekli.', 403) }
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(host)) failure('Yerel adres gerekli.', 403)
  if (req.headers.origin) {
    let origin
    try { origin = new URL(req.headers.origin) } catch { failure('Aynı sunucudan bağlantı gerekli.', 403) }
    if (!['http:', 'https:'].includes(origin.protocol) || origin.host !== req.headers.host) failure('Aynı sunucudan bağlantı gerekli.', 403)
  }
  if (req.headers['x-aruzahr-voice'] !== '1') failure('Yerel yönetim isteği gerekli.', 403)
}
async function body(req) {
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) failure('JSON gerekli.', 415)
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 16 * 1024) failure('Metin isteği çok büyük.', 413)
    chunks.push(chunk)
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) failure('Geçerli JSON gerekli.')
    return value
  } catch (error) { if (error.status) throw error; failure('Geçerli JSON gerekli.') }
}
export function validateVoiceInput(value) {
  if (typeof value?.text !== 'string' || !value.text.trim() || value.text.length > 2500 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value.text)) failure('Okunacak metin 1–2500 karakter olmalı.')
  if (typeof value.voiceId !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(value.voiceId)) failure('Bir ElevenLabs sesi seç.')
  return { text: value.text.trim(), voiceId: value.voiceId }
}
export function createVoiceMiddleware({ apiKey = '', fetchImpl = fetch, now = Date.now } = {}) {
  const cache = new Map()
  let busy = false, lastGeneration = -Infinity, epoch = 0
  const key = typeof apiKey === 'string' ? apiKey.trim() : ''
  function prune() {
    for (const [id, clip] of cache) if (now() - clip.created > TTL) cache.delete(id)
  }
  async function provider(path, options = {}) {
    let response
    try {
      response = await fetchImpl(`https://api.elevenlabs.io/v1/${path}`, {
        ...options,
        headers: { ...options.headers, 'xi-api-key': key },
        signal: AbortSignal.timeout(90_000),
      })
    } catch { failure('ElevenLabs bağlantısı tamamlanamadı. Bağlantını kontrol et.', 502) }
    if (!response.ok) {
      // Do not echo remote errors: they can include supplied text or credentials.
      if ([401, 403].includes(response.status)) failure('ElevenLabs anahtarı veya bu anahtarın ses yetkisi geçersiz.', 502)
      if (response.status === 429) failure('ElevenLabs kotası veya istek sınırı doldu. Hesabını kontrol et.', 429)
      failure('ElevenLabs isteği tamamlanamadı. Hesabını ve ses seçimini kontrol et.', 502)
    }
    return response
  }
  return async (req, res, next) => {
    const path = req.url?.split('?')[0]
    if (!path?.startsWith(PREFIX)) return next()
    try {
      validateVoiceRequest(req)
      prune()
      const route = path.slice(PREFIX.length)
      if (route === 'status' && req.method === 'GET') return json(res, 200, { configured: !!key, provider: 'ElevenLabs', model: 'eleven_multilingual_v2', maxCharacters: 2500 })
      if (route === 'reset' && req.method === 'POST') {
        await body(req)
        epoch++
        cache.clear()
        return json(res, 200, { cleared: true })
      }
      if (!key) failure('ElevenLabs anahtarı henüz ayarlanmamış. web/.env.local dosyasını doldurup yerel sunucuyu yeniden başlat.', 503)
      if (route === 'voices' && req.method === 'GET') {
        const response = await provider('voices')
        let value
        try { value = await response.json() } catch { failure('ElevenLabs ses listesi okunamadı.', 502) }
        const voices = (Array.isArray(value.voices) ? value.voices : []).slice(0, 500).flatMap(voice =>
          typeof voice.voice_id === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(voice.voice_id)
            ? [{ id: voice.voice_id, name: String(voice.name || 'Adsız ses').slice(0, 120), description: String(voice.description || '').slice(0, 300) }]
            : [])
        return json(res, 200, { voices })
      }
      if (route === 'generate' && req.method === 'POST') {
        const input = validateVoiceInput(await body(req))
        if (busy || now() - lastGeneration < 2000) failure('Önceki ses isteği bitince yeniden dene.', 429)
        busy = true; lastGeneration = now()
        const generationEpoch = epoch
        try {
          const response = await provider(`text-to-speech/${encodeURIComponent(input.voiceId)}?output_format=mp3_44100_128`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
            body: JSON.stringify({ text: input.text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: .55, similarity_boost: .75, style: .15, use_speaker_boost: true } }),
          })
          if (!/^audio\/(?:mpeg|mp3)(?:;|$)/i.test(response.headers.get('content-type') || '')) failure('ElevenLabs desteklenen MP3 sesi döndürmedi.', 502)
          if (Number(response.headers.get('content-length')) > MAX_AUDIO_BYTES) failure('Üretilen ses 12 MB sınırını aşıyor.', 502)
          const reader = response.body?.getReader()
          if (!reader) failure('ElevenLabs boş ses döndürdü.', 502)
          const chunks = []; let size = 0
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            size += value.byteLength
            if (size > MAX_AUDIO_BYTES) { await reader.cancel(); failure('Üretilen ses 12 MB sınırını aşıyor.', 502) }
            chunks.push(Buffer.from(value))
          }
          const data = Buffer.concat(chunks)
          if (!data.length) failure('ElevenLabs boş ses döndürdü.', 502)
          if (epoch !== generationEpoch) failure('Ses isteği sıfırlama nedeniyle iptal edildi.', 409)
          let total = [...cache.values()].reduce((sum, clip) => sum + clip.data.length, 0)
          for (const [id, clip] of cache) {
            if (total + data.length <= MAX_CACHE_BYTES) break
            cache.delete(id); total -= clip.data.length
          }
          const id = randomBytes(24).toString('hex')
          cache.set(id, { data, created: now() })
          return json(res, 200, { id, bytes: data.length, type: 'audio/mpeg' })
        } finally { busy = false }
      }
      const match = route.match(/^audio\/([a-f0-9]{48})$/)
      if (match && req.method === 'GET') {
        const clip = cache.get(match[1])
        if (!clip) failure('Bu geçici ses bulunamadı. Sesi yeniden üret veya indirdiğin dosyayı yükle.', 404)
        res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': clip.data.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
        return res.end(clip.data)
      }
      failure('Ses adresi veya istek yöntemi tanınmıyor.', 404)
    } catch (error) { if (!res.writableEnded) json(res, error.status || 500, { error: error.status ? error.message : 'Ses isteği tamamlanamadı.' }) }
  }
}
export default function elevenLabsVoicesPlugin(options = {}) {
  const middleware = createVoiceMiddleware(options)
  const attach = server => { server.middlewares.use(middleware) }
  return { name: 'aruzahr-elevenlabs-voices', configureServer: attach, configurePreviewServer: attach }
}
