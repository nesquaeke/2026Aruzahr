import { createHash, randomBytes } from 'node:crypto'
import { networkInterfaces } from 'node:os'
const BASE = '/__aruzahr-broadcast'
const token = () => randomBytes(24).toString('hex')
const fail = (message, status = 400) => {
  throw Object.assign(new Error(message), { status })
}
const obj = (v) =>
  v && typeof v === 'object' && !Array.isArray(v)
    ? v
    : fail('İstek biçimi geçersiz.')
const text = (v, n = 200) =>
  typeof v === 'string' && v.length <= n ? v : fail('İstek metni geçersiz.')
function json(res, status, value) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(value))
}
async function read(req, max = 25 * 1024 * 1024) {
  let size = 0
  const chunks = []
  for await (const c of req) {
    size += c.length
    if (size > max) fail('İstek boyutu sınırı aşıldı.', 413)
    chunks.push(c)
  }
  try {
    return obj(JSON.parse(Buffer.concat(chunks).toString()))
  } catch (e) {
    if (e.status) throw e
    fail('Geçerli JSON gerekli.')
  }
}
const loopback = (req) =>
  ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)
export function attachStudio(server, { publish, validate }) {
  let owner = null,
    epoch = token(),
    revision = -1,
    pair = null,
    poll = null,
    lastState = null,
    totalBytes = 0,
    audioLease = null
  const media = new Map(),
    retained = new Map(),
    published = new Set(),
    remotes = new Map(),
    commands = [],
    rates = new Map()
  const active = () => !!owner && owner.expires > Date.now()
  const auth = (req) => {
    if (!active() || req.headers['x-studio-owner'] !== owner.key)
      fail('Yönetim bu pencerede değil. Kontrolü devral.', 409)
    owner.expires = Date.now() + 12000
  }
  function limit(key, max) {
    const now = Date.now(),
      r = rates.get(key) || { at: now, n: 0 }
    if (now - r.at > 60000) {
      r.at = now
      r.n = 0
    }
    if (++r.n > max) fail('Çok fazla istek. Biraz bekle.', 429)
    rates.set(key, r)
  }
  const cleanup = setInterval(() => {
    for (const [k, v] of rates) if (Date.now() - v.at > 120000) rates.delete(k)
    for (const [k, v] of remotes) if (v.expires < Date.now()) remotes.delete(k)
  }, 30000)
  cleanup.unref?.()
  function markPublished(state) {
    for (const id of published) retained.set(id, Date.now() + 2000)
    for (const [id, until] of retained)
      if (until < Date.now()) retained.delete(id)
    published.clear()
    const visit = (v) => {
      if (typeof v === 'string') {
        const m = v.match(/^\/__aruzahr-broadcast\/asset\/([a-f0-9]{64})$/)
        if (m) published.add(m[1])
        if (/^[a-f0-9]{64}$/.test(v)) published.add(v)
      } else if (Array.isArray(v)) v.forEach(visit)
      else if (v && typeof v === 'object') Object.values(v).forEach(visit)
    }
    visit(state)
  }
  function wire(v) {
    if (typeof v === 'string' && v.startsWith('data:image/')) {
      const id = createHash('sha256').update(v).digest('hex')
      if (!media.has(id)) {
        const match = v.match(
          /^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/,
        )
        if (!match) fail('Resim verisi geçersiz.')
        const data = Buffer.from(match[2], 'base64')
        media.set(id, { data, type: match[1] })
        totalBytes += data.length
      }
      published.add(id)
      return `${BASE}/asset/${id}`
    }
    if (Array.isArray(v)) return v.map(wire)
    if (v && typeof v === 'object')
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, wire(x)]))
    return v
  }
  server.middlewares.use(async (req, res, next) => {
    const path = req.url?.split('?')[0]
    if (
      !path?.startsWith(BASE + '/studio/') &&
      !path?.startsWith(BASE + '/asset/')
    )
      return next()
    try {
      if (
        req.headers.origin &&
        new URL(req.headers.origin).host !== req.headers.host
      )
        fail('Aynı sunucudan bağlantı gerekli.', 403)
      if (path.startsWith(BASE + '/asset/')) {
        if (req.method !== 'GET') fail('GET gerekli.', 405)
        const id = path.slice((BASE + '/asset/').length),
          asset = media.get(id)
        if (!asset || (!published.has(id) && !(retained.get(id) > Date.now())))
          fail('Görsel/ses mevcut yayında yok.', 404)
        res.writeHead(200, {
          'Content-Type': asset.type,
          'Cache-Control': 'private, max-age=31536000, immutable',
          'X-Content-Type-Options': 'nosniff',
        })
        res.end(asset.data)
        return
      }
      const route = path.slice((BASE + '/studio/').length)
      if (route === 'status' && req.method === 'GET') {
        json(res, 200, {
          online: active(),
          revision,
          epoch,
          audioPlaying:
            audioLease?.expires > Date.now() && !!audioLease.playing,
          poll: poll
            ? {
                id: poll.id,
                options: poll.options.map((o) => ({
                  ...o,
                  votes: [...poll.voters.values()].filter((id) => id === o.id)
                    .length,
                })),
                open: poll.open,
              }
            : null,
        })
        return
      }
      if (req.method !== 'POST') fail('POST gerekli.', 405)
      if (!/^application\/json/.test(req.headers['content-type'] || ''))
        fail('JSON gerekli.', 415)
      const input = await read(req)
      if (route === 'claim') {
        if (!loopback(req))
          fail(
            'Ana yönetim masasını bu bilgisayarda 127.0.0.1 adresiyle aç.',
            403,
          )
        const id = text(input.id, 160)
        if (active() && owner.id !== id && !input.force)
          fail('Başka bir yönetim penceresi açık.', 409)
        if (!active() || owner.id !== id) {
          owner = { id, key: token(), expires: 0 }
          epoch = token()
          revision = -1
          pair = null
          remotes.clear()
          commands.length = 0
        }
        owner.expires = Date.now() + 12000
        json(res, 200, { key: owner.key, epoch, revision })
        return
      }
      if (route === 'audio-lease') {
        const id = text(input.id, 160)
        if (
          !audioLease ||
          audioLease.expires < Date.now() ||
          audioLease.id === id
        )
          audioLease = {
            id,
            expires: Date.now() + 7000,
            playing: audioLease?.id === id ? audioLease.playing : false,
          }
        if (
          audioLease.id === id &&
          ['playing', 'blocked', 'idle'].includes(input.status)
        )
          audioLease.playing = input.status === 'playing'
        json(res, 200, { granted: audioLease.id === id })
        return
      }
      if (route === 'pair') {
        limit(req.socket.remoteAddress + 'pair', 15)
        if (
          !active() ||
          !pair ||
          pair.expires < Date.now() ||
          input.pin !== pair.pin
        )
          fail('Eşleştirme kodu geçersiz veya süresi doldu.', 403)
        const key = token()
        remotes.set(key, { expires: Date.now() + 8 * 3600000 })
        json(res, 200, { key })
        return
      }
      if (route === 'remote') {
        const remote = remotes.get(text(input.key, 80))
        if (!active() || !remote || remote.expires < Date.now())
          fail('Telefon eşleştirmesini yeniden aç.', 403)
        remote.expires = Date.now() + 8 * 3600000
        if (input.command) {
          limit(input.key, 120)
          const c = obj(input.command)
          if (
            ![
              'take',
              'break',
              'mute',
              'next',
              'previous',
              'prepare',
              'sound',
              'map',
              'roll-d20',
            ].includes(c.action)
          )
            fail('Komut tanınmıyor.')
          if (commands.length >= 30) fail('Komut kuyruğu dolu.', 429)
          commands.push({
            id: token(),
            action: c.action,
            value: typeof c.value === 'string' ? c.value.slice(0, 160) : '',
          })
        }
        json(res, 200, {
          title: lastState?.title || '',
          online: true,
          scenes: pair?.scenes || [],
        })
        return
      }
      if (route === 'vote') {
        if (!poll || input.code !== poll.code)
          fail('Oylama kapalı veya kod geçersiz.', 404)
        if (input.option !== undefined) {
          if (!poll.open) fail('Oylama kapalı.', 409)
          limit(req.socket.remoteAddress + 'vote', 60)
          const voter = text(input.voter, 160)
          if (!voter || !poll.options.some((o) => o.id === input.option))
            fail('Oy seçimi geçersiz.')
          if (poll.voters.has(voter)) fail('Bu tarayıcıdan oy kullanıldı.', 409)
          poll.voters.set(voter, input.option)
        }
        json(res, 200, {
          id: poll.id,
          title: poll.title,
          open: poll.open,
          options: poll.options.map((o) => ({
            ...o,
            votes: [...poll.voters.values()].filter((id) => id === o.id).length,
          })),
        })
        return
      }
      auth(req)
      if (route === 'heartbeat') {
        if (Array.isArray(input.ack))
          for (let i = commands.length - 1; i >= 0; i--)
            if (input.ack.includes(commands[i].id)) commands.splice(i, 1)
        json(res, 200, {
          online: true,
          epoch,
          revision,
          commands: commands.slice(),
          audioPlaying:
            audioLease?.expires > Date.now() && !!audioLease.playing,
          poll: poll
            ? {
                id: poll.id,
                options: poll.options.map((o) => ({
                  ...o,
                  votes: [...poll.voters.values()].filter((id) => id === o.id)
                    .length,
                })),
                open: poll.open,
              }
            : null,
        })
        return
      }
      if (route === 'release') {
        owner = null
        pair = null
        remotes.clear()
        json(res, 200, { ok: true })
        return
      }
      if (route === 'asset') {
        const src = text(input.src, 24 * 1024 * 1024),
          id = createHash('sha256').update(src).digest('hex')
        if (input.id !== id) fail('Varlık bütünlüğü doğrulanamadı.')
        const match = src.match(
          /^data:((?:image\/(?:png|jpeg|webp|gif))|(?:audio\/(?:wav|x-wav|mpeg|mp3|ogg|webm)));base64,([A-Za-z0-9+/]+={0,2})$/,
        )
        if (!match) fail('Desteklenmeyen varlık.')
        if (!media.has(id)) {
          const data = Buffer.from(match[2], 'base64')
          if (data.length > 16 * 1024 * 1024)
            fail('Varlık 16 MB sınırını aşıyor.', 413)
          if (totalBytes + data.length > 200 * 1024 * 1024) {
            for (const [k, v] of media)
              if (!published.has(k)) {
                totalBytes -= v.data.length
                media.delete(k)
              }
          }
          if (totalBytes + data.length > 200 * 1024 * 1024)
            fail('Yayın varlık belleği dolu.', 413)
          media.set(id, { data, type: match[1] })
          totalBytes += data.length
        }
        json(res, 200, { id })
        return
      }
      if (route === 'frame') {
        if (input.epoch !== epoch) fail('Eski yönetim dönemi.', 409)
        const next = validate(input.state)
        const seq = next.studio?.revision
        if (!Number.isSafeInteger(seq) || seq <= revision)
          fail('Eski yayın karesi reddedildi.', 409)
        const check = (v) => {
          if (typeof v === 'string' && v.startsWith(BASE + '/asset/')) {
            if (!media.has(v.slice((BASE + '/asset/').length)))
              fail('Yayın varlığı eksik.', 422)
          } else if (Array.isArray(v)) v.forEach(check)
          else if (v && typeof v === 'object') Object.values(v).forEach(check)
        }
        check(next)
        for (const id of [
          ...['music', 'ambience', 'effect'].map(
            (name) => next.studio?.audio?.[name]?.id,
          ),
          next.studio?.break?.ambientId,
        ]) {
          if (id && /^[a-f0-9]{64}$/.test(id) && !media.has(id))
            fail('Ses varlığı eksik.', 422)
        }
        markPublished(next)
        lastState = wire(next)
        revision = seq
        publish(lastState)
        json(res, 200, { ok: true, revision })
        return
      }
      if (route === 'pairing') {
        pair = {
          pin: String(Math.floor(100000 + Math.random() * 900000)),
          expires: Date.now() + 600000,
          scenes: Array.isArray(input.scenes)
            ? input.scenes
                .slice(0, 150)
                .map((s) => ({ id: text(s.id, 160), name: text(s.name, 160) }))
            : [],
        }
        const hosts = Object.values(networkInterfaces())
          .flat()
          .filter((n) => n && n.family === 'IPv4' && !n.internal)
          .map((n) => n.address)
        json(res, 200, { pin: pair.pin, expires: pair.expires, hosts })
        return
      }
      if (route === 'poll') {
        if (input.close) {
          if (poll) poll.open = false
          json(res, 200, { ok: true })
          return
        }
        const options = Array.isArray(input.options)
          ? input.options
              .slice(0, 6)
              .map((label, i) => ({ id: String(i), label: text(label, 160) }))
          : []
        if (options.length < 2) fail('En az iki seçenek gerekli.')
        poll = {
          id: token(),
          code: randomBytes(5).toString('hex'),
          title: text(input.title, 200),
          options,
          voters: new Map(),
          open: true,
        }
        json(res, 200, {
          id: poll.id,
          code: poll.code,
          title: poll.title,
          options: options.map((o) => ({ ...o, votes: 0 })),
          open: true,
        })
        return
      }
      fail('Uç nokta bulunamadı.', 404)
    } catch (e) {
      json(res, e.status || 400, { error: e.message || 'İşlem tamamlanamadı.' })
    }
  })
  return {
    active,
    close() {
      clearInterval(cleanup)
      media.clear()
      retained.clear()
      remotes.clear()
      rates.clear()
      commands.length = 0
      owner = null
      pair = null
      audioLease = null
      poll = null
    },
  }
}
