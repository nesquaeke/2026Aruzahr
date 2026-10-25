import { attachStudio } from './studio-relay.mjs'
import { publicStudio } from '../src/studio/protocol.mjs'
const PREFIX = '/__aruzahr-broadcast'
const MAX_BODY = 30 * 1024 * 1024
const PRESENCE_MS = 10_000

function badRequest(message) { throw Object.assign(new Error(message), { status: 400 }) }
function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) badRequest(`${label} bir nesne olmalı.`)
  return value
}
function pick(value, fields, label) {
  const source = object(value, label)
  return Object.fromEntries(fields.filter(field => source[field] !== undefined).map(field => [field, source[field]]))
}
function array(value, max, label) {
  if (!Array.isArray(value) || value.length > max) badRequest(`${label} en çok ${max} öğe içermeli.`)
  return value
}
function finite(value, min, max, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) badRequest(`${label} sınırların dışında.`)
}
function text(value, max, label, empty = false) {
  if (typeof value !== 'string' || value.length > max || !empty && !value.trim() || /[\u0000-\u001f\u007f]/.test(value)) badRequest(`${label} geçerli bir metin olmalı.`)
}
function image(value) {
  if (typeof value === 'string' && /^\/__aruzahr-broadcast\/asset\/[a-f0-9]{64}$/.test(value)) return value

  // The browser's full validator additionally checks the actual catalogue and
  // raster signatures before displaying the received state.
  if (typeof value !== 'string' || value.length > 12 * 1024 * 1024 || !( /^\/illustrations\/[a-z\d][a-z\d_.-]*\.(webp|png|jpe?g)$/i.test(value) && !value.includes('..') || /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(value))) badRequest('Görsel yalnızca yerel bir çizim veya desteklenen raster verisi olabilir.')
}
function asset(value) {
  const result = pick(value, ['id', 'name', 'src', 'kind', 'locationId'], 'Görsel')
  text(result.id, 160, 'Görsel kimliği'); text(result.name, 160, 'Görsel adı'); image(result.src)
  if (!['scene', 'portrait', 'image'].includes(result.kind)) badRequest('Görsel türü tanınmıyor.')
  if (result.locationId !== undefined) text(result.locationId, 160, 'Görsel konumu')
  return result
}

/** Both the endpoint and the hook project public fields independently. */
export function publicBroadcastState(value) {
  const source = object(value, 'Yayın durumu')
  if (source.version !== 1) badRequest('Yayın sürümü desteklenmiyor.')
  if (!['map', 'scene'].includes(source.mode)) badRequest('Yayın görünümü tanınmıyor.')
  for (const field of ['blackout', 'cameraLane', 'showNames']) if (typeof source[field] !== 'boolean') badRequest(`${field} doğru veya yanlış olmalı.`)
  if (source.intermission !== undefined && typeof source.intermission !== 'boolean') badRequest('Ara durumu geçersiz.')
  if (source.breakMessage !== undefined) text(source.breakMessage, 160, 'Ara mesajı', true)
  text(source.title, 240, 'Yayın başlığı', true)
  finite(source.sceneZoom, 1, 4, 'Sahne yakınlaştırması')
  const actors = array(source.actors, 40, 'Sahne öğeleri').flatMap(value => {
    const entry = object(value, 'Sahne öğesi')
    if (typeof entry.hidden !== 'boolean') badRequest('Sahne öğesi görünürlüğü geçersiz.')
    if (entry.hidden) return []
    const actor = pick(entry, ['id', 'name', 'src', 'assetId', 'kind', 'x', 'y', 'w', 'h', 'hidden', 'tier', 'locked', 'group'], 'Sahne öğesi')
    text(actor.id, 160, 'Sahne öğesi kimliği'); text(actor.name, 160, 'Sahne öğesi adı'); image(actor.src)
    if (!['portrait', 'image'].includes(actor.kind)) badRequest('Sahne öğesi türü geçersiz.')
    finite(actor.x, 0, 100, 'Sahne konumu'); finite(actor.y, 0, 100, 'Sahne konumu')
    finite(actor.w, 2, 100, 'Sahne genişliği'); finite(actor.h, 2, 100, 'Sahne yüksekliği')
    if(entry.locked!==undefined){if(typeof entry.locked!=='boolean')badRequest('Kilit geçersiz.');actor.locked=entry.locked}
    if(entry.group!==undefined){text(entry.group,160,'Grup');actor.group=entry.group}
    if (actor.assetId !== undefined) text(actor.assetId, 160, 'Görsel kimliği')
    if (actor.tier !== undefined && !['ordinary', 'distinguished', 'powerful', 'supreme'].includes(actor.tier)) badRequest('Çerçeve türü geçersiz.')
    return [actor]
  })
  const tokens = array(source.tokens, 200, 'Harita simgeleri').map(value => {
    const token = pick(value, ['id', 'name', 'src', 'assetId', 'x', 'y', 'kind', 'size', 'locked', 'group'], 'Harita simgesi')
    text(token.id, 160, 'Simge kimliği'); text(token.name, 160, 'Simge adı')
    if (!['party', 'ally', 'enemy'].includes(token.kind)) badRequest('Simge türü geçersiz.')
    finite(token.x, 0, 1, 'Simge konumu'); finite(token.y, 0, 1, 'Simge konumu'); finite(token.size, 24, 160, 'Simge boyutu')
    if(token.locked!==undefined&&typeof token.locked!=='boolean')badRequest('Kilit geçersiz.')
    if(token.group!==undefined)text(token.group,160,'Grup')
    if (token.src !== undefined && token.src !== '') image(token.src)
    if (token.assetId !== undefined) text(token.assetId, 160, 'Simge görsel kimliği')
    return token
  })
  const strokes = array(source.strokes, 500, 'Harita çizimleri').map(value => {
    const stroke = pick(value, ['id', 'kind', 'color', 'width'], 'Çizim')
    text(stroke.id, 160, 'Çizim kimliği')
    if (!['pen', 'arrow'].includes(stroke.kind) || typeof stroke.color !== 'string' || !/^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(stroke.color)) badRequest('Çizim türü veya rengi geçersiz.')
    finite(stroke.width, 1, 80, 'Çizgi kalınlığı')
    stroke.points = array(value.points, 2000, 'Çizim noktaları').map(point => {
      if (!Array.isArray(point) || point.length !== 2) badRequest('Çizim noktası geçersiz.')
      finite(point[0], 0, 1, 'Çizim konumu'); finite(point[1], 0, 1, 'Çizim konumu')
      return [point[0], point[1]]
    })
    if (!stroke.points.length) badRequest('Çizim en az bir nokta içermeli.')
    return stroke
  })
  const camera = source.camera === null ? null : pick(source.camera, ['x', 'y', 'zoom'], 'Harita kamerası')
  if (camera) { finite(camera.x, -1, 2, 'Kamera konumu'); finite(camera.y, -1, 2, 'Kamera konumu'); finite(camera.zoom, .5, 100, 'Kamera yakınlaştırması') }
  const roll = source.roll === null ? null : pick(source.roll, ['id', 'sides', 'count', 'modifier', 'values', 'total', 'at'], 'Zar atışı')
  if (roll) {
    text(roll.id, 160, 'Zar kimliği')
    if (![4, 6, 8, 10, 12, 20, 100].includes(roll.sides) || !Number.isInteger(roll.count) || roll.count < 1 || roll.count > 12 || !Number.isInteger(roll.modifier) || Math.abs(roll.modifier) > 99) badRequest('Zar türü, adedi veya ek değeri geçersiz.')
    roll.values = array(roll.values, 12, 'Zar sonuçları').map(value => {
      if (!Number.isInteger(value) || value < 1 || value > roll.sides) badRequest('Zar sonucu geçersiz.')
      return value
    })
    if (roll.values.length !== roll.count || roll.total !== roll.values.reduce((sum, value) => sum + value, roll.modifier)) badRequest('Zar toplamı geçersiz.')
    finite(roll.at, 0, 8_640_000_000_000_000, 'Atış zamanı')
  }
  return {
    ...(source.studio === undefined ? {} : {studio:publicStudio(source.studio,src=>{image(src);return src})}),
    version: 1, mode: source.mode, scene: asset(source.scene), sceneZoom: source.sceneZoom,
    actors, tokens, strokes, camera, customAssets: [], roll,
    intermission: source.intermission || false, breakMessage: source.breakMessage || '', blackout: source.blackout, title: source.title, cameraLane: source.cameraLane, showNames: source.showNames,
  }
}

function json(res, status, value) {
  if (res.writableEnded || res.destroyed) return
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(value))
}

function readJson(req, limit = MAX_BODY) {
  return new Promise((resolve, reject) => {
    let size = 0, done = false
    const chunks = []
    const finish = (error, value) => {
      if (done) return
      done = true
      clearTimeout(timer)
      chunks.length = 0
      if (error) { req.resume(); reject(error) } else resolve(value)
    }
    const timer = setTimeout(() => finish(Object.assign(new Error('İstek zaman aşımına uğradı.'), { status: 408 })), 15_000)
    if (Number(req.headers['content-length']) > limit) { finish(Object.assign(new Error('Yayın isteği 30 MB sınırını aşıyor.'), { status: 413 })); return }
    req.on('data', chunk => {
      if (done) return
      size += Buffer.byteLength(chunk)
      if (size > limit) { finish(Object.assign(new Error('Yayın isteği 30 MB sınırını aşıyor.'), { status: 413 })); return }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (done) return
      try { finish(null, JSON.parse(Buffer.concat(chunks).toString('utf8'))) } catch { finish(Object.assign(new Error('İstek geçerli JSON içermeli.'), { status: 400 })) }
    })
    req.on('aborted', () => finish(Object.assign(new Error('İstek yarıda kesildi.'), { status: 400 })))
    req.on('error', () => finish(Object.assign(new Error('İstek okunamadı.'), { status: 400 })))
  })
}

/** In-memory, same-origin relay for localhost Vite development and preview. */
export function broadcastRelayPlugin() {
  let latestFrame = null, controllerSeen = 0, reportedOnline = false
  const clients = new Set()
  const cleanups = new Set()
  const online = () => controllerSeen > 0 && Date.now() - controllerSeen < PRESENCE_MS
  const frame = (event, data) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  function remove(client) { clients.delete(client); client.pendingState = null; client.pendingPresence = null }
  function flush(client) {
    if (client.res.destroyed || client.res.writableEnded) { remove(client); return }
    while (!client.blocked && (client.pendingPresence || client.pendingState)) {
      const key = client.pendingPresence ? 'pendingPresence' : 'pendingState'
      const payload = client[key]
      client[key] = null
      try { client.blocked = !client.res.write(payload) } catch { remove(client); client.res.end(); return }
    }
  }
  function send(client, event, payload) { client[event === 'state' ? 'pendingState' : 'pendingPresence'] = payload; flush(client) }
  function announcePresence() {
    const next = online()
    if (next === reportedOnline) return
    reportedOnline = next
    const payload = frame('presence', { online: next })
    for (const client of clients) send(client, 'presence', payload)
  }
  function attach(server) {
    const httpServer = server.httpServer
    let stopped = false
    const studio = attachStudio(server, {validate:publicBroadcastState,publish:state=>{latestFrame=frame('state',state);controllerSeen=Date.now();for(const client of clients)send(client,'state',latestFrame);announcePresence()}})
    const timer = setInterval(() => {
      announcePresence()
      for (const client of clients) {
        if (client.blocked) continue
        try { client.blocked = !client.res.write(': keep-alive\n\n') } catch { remove(client); client.res.end() }
      }
    }, 3000)
    timer.unref?.()
    const cleanup = () => {
      if (stopped) return
      stopped = true
      clearInterval(timer)
      studio.close()
      for (const client of clients) { remove(client); client.res.destroy() }
      latestFrame = null; controllerSeen = 0; reportedOnline = false
      cleanups.delete(cleanup)
      if (httpServer?.close === wrappedClose) httpServer.close = originalClose
    }
    // Node's close event waits for open SSE responses. End them before the
    // server starts waiting, including previewServer.httpServer.close().
    const originalClose = httpServer?.close
    const wrappedClose = function (...args) { cleanup(); return originalClose.apply(this, args) }
    if (httpServer) httpServer.close = wrappedClose
    cleanups.add(cleanup)
    httpServer?.once('close', cleanup)
    server.middlewares.use(async (req, res, next) => {
      const path = req.url?.split('?')[0]
      if (![`${PREFIX}/events`, `${PREFIX}/state`, `${PREFIX}/heartbeat`].includes(path)) { next(); return }
      if (stopped) { json(res, 503, { error: 'Yayın bağlantısı kapanıyor.' }); return }
      if (req.headers.origin) {
        try { if (new URL(req.headers.origin).host !== req.headers.host) { json(res, 403, { error: 'Yayın bağlantısı aynı sunucudan açılmalı.' }); return } } catch { json(res, 403, { error: 'Yayın kaynağı geçersiz.' }); return }
      }
      if (path === `${PREFIX}/events`) {
        if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); json(res, 405, { error: 'Bu uç nokta GET isteği bekliyor.' }); return }
        res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' })
        res.flushHeaders?.()
        const client = { res, blocked: false, pendingState: null, pendingPresence: null }
        clients.add(client)
        res.on('close', () => remove(client))
        res.on('error', () => remove(client))
        res.on('drain', () => { client.blocked = false; flush(client) })
        send(client, 'presence', frame('presence', { online: online() }))
        if (latestFrame) send(client, 'state', latestFrame)
        return
      }
      if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); json(res, 405, { error: 'Bu uç nokta POST isteği bekliyor.' }); return }
      if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) { json(res, 415, { error: 'İstek türü application/json olmalı.' }); return }
      try {
        const input = await readJson(req)
        if (path === `${PREFIX}/state`) {
          if(studio.active()){json(res,409,{error:'Yeni yönetmen masası etkin. Önce oradaki kontrolü bırak.'});return}
          latestFrame = frame('state', publicBroadcastState(input))
          for (const client of clients) send(client, 'state', latestFrame)
        } else object(input, 'Bağlantı işareti')
        controllerSeen = Date.now()
        announcePresence()
        json(res, 200, { ok: true, hasState: latestFrame !== null })
      } catch (error) { json(res, Number.isInteger(error?.status) ? error.status : 500, { error: error?.status ? error.message : 'Yayın bağlantısı işlenemedi.' }) }
    })
  }
  return {
    name: 'aruzahr-local-broadcast-relay',
    configureServer: attach,
    configurePreviewServer: attach,
    closeBundle() { for (const cleanup of [...cleanups]) cleanup() },
  }
}

export default broadcastRelayPlugin
