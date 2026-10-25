import { broadcastAssets, type BroadcastAsset } from './BroadcastLibrary'
import type { MapCamera, MapStroke, MapToken } from './BroadcastMap'
import type { BroadcastRoll } from './BroadcastDice'
import type { PowerTier } from './character-card-profiles'
import { DICE_SIDES } from './broadcast-dice-engine'
import { artworks } from './media'
import { publicStudio } from './studio/protocol.mjs'
import type { StudioPublic } from './studio/types'

export type StageActor = {
  id: string
  name: string
  src: string
  assetId?: string
  kind: 'portrait' | 'image'
  x: number
  y: number
  w: number
  h: number
  hidden: boolean
  locked?: boolean
  group?: string
  tier?: PowerTier
}

export type BroadcastState = {
  studio?: StudioPublic
  version: 1
  mode: 'map' | 'scene'
  scene: BroadcastAsset
  sceneZoom: number
  actors: StageActor[]
  tokens: MapToken[]
  strokes: MapStroke[]
  camera: MapCamera | null
  customAssets: BroadcastAsset[]
  roll: BroadcastRoll | null
  intermission?: boolean
  breakMessage?: string
  blackout: boolean
  title: string
  cameraLane: boolean
  showNames: boolean
}

const MAX_STATE_BYTES = 30 * 1024 * 1024
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_PIXELS = 40_000_000
const DATABASE = 'aruzahr-broadcast'
const STORE = 'state'
const knownImages = new Set([...broadcastAssets.map(asset => asset.src), ...Object.values(artworks).map(art => art.src)])
type RecordValue = Record<string, unknown>

function invalid(message: string): never { throw new Error(`Yayın dosyası geçersiz: ${message}`) }
function record(value: unknown, label: string): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(`${label} bir nesne olmalı.`)
  return value as RecordValue
}
function text(value: unknown, label: string, max = 160, allowEmpty = false): string {
  if (typeof value !== 'string' || value.length > max || (!allowEmpty && !value.trim()) || /[\u0000-\u001f\u007f]/.test(value)) invalid(`${label} geçerli bir metin olmalı (en çok ${max} karakter).`)
  return value
}
function number(value: unknown, label: string, min: number, max: number, integer = false): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isSafeInteger(value))) invalid(`${label} ${min} ile ${max} arasında ${integer ? 'bir tam sayı' : 'bir sayı'} olmalı.`)
  return value
}
function boolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') invalid(`${label} doğru veya yanlış olmalı.`)
  return value
}
function option<T extends string>(value: unknown, choices: readonly T[], label: string): T {
  if (typeof value !== 'string' || !choices.includes(value as T)) invalid(`${label} tanınmıyor.`)
  return value as T
}
function list(value: unknown, label: string, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) invalid(`${label} en çok ${max} kayıt içermeli.`)
  return value
}
function optionalText(value: unknown, label: string): string | undefined {
  return value === undefined || value === '' ? undefined : text(value, label)
}
function uniqueIds<T extends { id: string }>(values: T[], label: string): T[] {
  if (new Set(values.map(value => value.id)).size !== values.length) invalid(`${label} içinde aynı kimlik iki kez kullanılamaz.`)
  return values
}

function matchesImageSignature(bytes: Uint8Array, mime: string) {
  if (mime === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)
  if (mime === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
  if (mime === 'image/gif') return ['GIF87a', 'GIF89a'].includes(String.fromCharCode(...bytes.slice(0, 6)))
  return mime === 'image/webp' && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
}

function imageSource(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 64) invalid(`${label} desteklenen boyutta bir görsel olmalı.`)
  if (/^\/__aruzahr-broadcast\/asset\/[a-f0-9]{64}$/.test(value)) return value
  if (/^\/illustrations\/[a-z\d][a-z\d_.-]*\.(webp|png|jpe?g)$/i.test(value) && !value.includes('..') && knownImages.has(value)) return value
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value)
  if (!match || match[2].length % 4 !== 0) invalid(`${label} yalnızca bilinen yerel çizim veya PNG, JPEG, WebP, GIF verisi olabilir.`)
  const payload = match[2]
  const decodedLength = payload.length * 3 / 4 - (payload.endsWith('==') ? 2 : payload.endsWith('=') ? 1 : 0)
  if (decodedLength > MAX_IMAGE_BYTES) invalid(`${label} 8 MB sınırını aşıyor.`)
  let header: Uint8Array
  try { header = Uint8Array.from(atob(payload.slice(0, 64)), character => character.charCodeAt(0)) } catch { return invalid(`${label} görsel verisi okunamadı.`) }
  if (!matchesImageSignature(header, match[1])) invalid(`${label} içeriği görsel türüyle eşleşmiyor.`)
  return value
}

function asset(value: unknown, label: string): BroadcastAsset {
  const source = record(value, label)
  const locationId = optionalText(source.locationId, `${label} konumu`)
  return {
    id: text(source.id, `${label} kimliği`), name: text(source.name, `${label} adı`), src: imageSource(source.src, label),
    kind: option(source.kind, ['scene', 'portrait', 'image'] as const, `${label} türü`),
    ...(locationId ? { locationId } : {}),
  }
}

function actor(value: unknown): StageActor {
  const source = record(value, 'Sahne öğesi')
  const assetId = optionalText(source.assetId, 'Sahne öğesi görsel kimliği')
  const tier = source.tier === undefined ? undefined : option(source.tier, ['ordinary', 'distinguished', 'powerful', 'supreme'] as const, 'Portre çerçevesi')
  return {
    id: text(source.id, 'Sahne öğesi kimliği'), name: text(source.name, 'Sahne öğesi adı'), src: imageSource(source.src, 'Sahne öğesi görseli'),
    kind: option(source.kind, ['portrait', 'image'] as const, 'Sahne öğesi türü'),
    x: number(source.x, 'Sahne yatay konumu', 0, 100), y: number(source.y, 'Sahne dikey konumu', 0, 100),
    w: number(source.w, 'Sahne öğesi genişliği', 2, 100), h: number(source.h, 'Sahne öğesi yüksekliği', 2, 100),
    hidden: boolean(source.hidden, 'Sahne öğesi görünürlüğü'), ...(source.locked === undefined ? {} : {locked: boolean(source.locked,'Kilit')}), ...(source.group === undefined ? {} : {group:text(source.group,'Grup')}), ...(assetId ? { assetId } : {}), ...(tier ? { tier } : {}),
  }
}

function token(value: unknown): MapToken {
  const source = record(value, 'Harita simgesi')
  const src = source.src === undefined || source.src === '' ? undefined : imageSource(source.src, 'Harita simgesi görseli')
  const assetId = optionalText(source.assetId, 'Harita simgesi görsel kimliği')
  return {
    id: text(source.id, 'Harita simgesi kimliği'), name: text(source.name, 'Harita simgesi adı'),
    kind: option(source.kind, ['party', 'ally', 'enemy'] as const, 'Harita simgesi türü'),
    x: number(source.x, 'Harita yatay konumu', 0, 1), y: number(source.y, 'Harita dikey konumu', 0, 1), size: number(source.size, 'Harita simgesi boyutu', 24, 160),
    ...(src ? { src } : {}), ...(assetId ? { assetId } : {}), ...(source.locked === undefined ? {} : {locked:boolean(source.locked,'Kilit')}), ...(source.group === undefined ? {} : {group:text(source.group,'Grup')}),
  }
}

function stroke(value: unknown): MapStroke {
  const source = record(value, 'Harita çizimi')
  if (typeof source.color !== 'string' || !/^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(source.color)) invalid('Çizim rengi bir onaltılık renk kodu olmalı.')
  const points = list(source.points, 'Çizim noktaları', 2000)
  if (!points.length) invalid('Çizim en az bir nokta içermeli.')
  return {
    id: text(source.id, 'Çizim kimliği'), kind: option(source.kind, ['pen', 'arrow'] as const, 'Çizim türü'), color: source.color,
    width: number(source.width, 'Çizgi kalınlığı', 1, 80),
    points: points.map(point => {
      if (!Array.isArray(point) || point.length !== 2) invalid('Her çizim noktası iki koordinat içermeli.')
      return [number(point[0], 'Çizim yatay konumu', 0, 1), number(point[1], 'Çizim dikey konumu', 0, 1)]
    }),
  }
}

function roll(value: unknown): BroadcastRoll | null {
  if (value === null) return null
  const source = record(value, 'Zar atışı')
  const sides = number(source.sides, 'Zarın yüz sayısı', 4, 100, true)
  if (!DICE_SIDES.some(side => side === sides)) invalid('Zarın yüz sayısı tanınmıyor.')
  const count = number(source.count, 'Zar adedi', 1, 12, true)
  const modifier = number(source.modifier, 'Zar ek değeri', -99, 99, true)
  const values = list(source.values, 'Zar sonuçları', 12).map(value => number(value, 'Zar sonucu', 1, sides, true))
  if (values.length !== count) invalid('Zar sonuçlarının sayısı zar adediyle eşleşmiyor.')
  const total = number(source.total, 'Zar toplamı', -99, 1299, true)
  if (total !== values.reduce((sum, value) => sum + value, modifier)) invalid('Zar toplamı tek tek sonuçlarla eşleşmiyor.')
  return { id: text(source.id, 'Atış kimliği'), sides, count, modifier, values, total, at: number(source.at, 'Atış zamanı', 0, 8_640_000_000_000_000, true) }
}

export function freshId(prefix = 'broadcast'): string {
  if (!/^[a-z\d_-]{1,32}$/i.test(prefix)) throw new Error('Yeni öğe kimliği için geçerli bir önek gerekli.')
  const source = globalThis.crypto
  if (!source?.getRandomValues) throw new Error('Bu tarayıcı güvenli öğe kimliği oluşturamıyor.')
  const id = typeof source.randomUUID === 'function' ? source.randomUUID() : Array.from(source.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')
  return `${prefix}-${id}`
}

export function newBroadcastState(): BroadcastState {
  const scene = broadcastAssets.find(asset => asset.id === 'marhalden') ?? broadcastAssets.find(asset => asset.kind === 'scene')
  if (!scene) throw new Error('Yayın için başlangıç sahnesi bulunamadı.')
  return {
    version: 1, mode: 'map', scene: { ...scene }, sceneZoom: 1, actors: [], tokens: [], strokes: [], camera: null, customAssets: [], roll: null,
    intermission: false, breakMessage: '', blackout: false, title: 'Marhalden’den Hardlane’e', cameraLane: false, showNames: true,
  }
}

/** Rebuild only the public scene fields; operator notes never enter exports. */
export function validateBroadcastState(input: unknown): BroadcastState {
  let serialized: string | undefined
  try { serialized = JSON.stringify(input) } catch { return invalid('Veri JSON olarak okunamadı.') }
  if (!serialized || new TextEncoder().encode(serialized).byteLength > MAX_STATE_BYTES) invalid('Oturum 30 MB sınırını aşıyor veya boş.')
  const source = record(input, 'Oturum')
  if (source.version !== 1) invalid('Dosya sürümü desteklenmiyor.')
  const cameraSource = source.camera === null ? null : record(source.camera, 'Harita kamerası')
  return {
    ...(source.studio === undefined ? {} : {studio:publicStudio(source.studio,src=>imageSource(src,'Yayın katmanı'))}),
    version: 1, mode: option(source.mode, ['map', 'scene'] as const, 'Yayın görünümü'), scene: asset(source.scene, 'Arka plan'),
    sceneZoom: number(source.sceneZoom, 'Sahne yakınlaştırması', 1, 4),
    actors: uniqueIds(list(source.actors, 'Sahne öğeleri', 40).map(actor), 'Sahne öğeleri'),
    tokens: uniqueIds(list(source.tokens, 'Harita simgeleri', 200).map(token), 'Harita simgeleri'),
    strokes: uniqueIds(list(source.strokes, 'Harita çizimleri', 500).map(stroke), 'Harita çizimleri'),
    camera: cameraSource ? { x: number(cameraSource.x, 'Kamera yatay konumu', -1, 2), y: number(cameraSource.y, 'Kamera dikey konumu', -1, 2), zoom: number(cameraSource.zoom, 'Harita yakınlaştırması', 0.5, 100) } : null,
    customAssets: uniqueIds(list(source.customAssets, 'Yerel görseller', 100).map(value => asset(value, 'Yerel görsel')), 'Yerel görseller'),
    intermission: source.intermission === undefined ? false : boolean(source.intermission, 'Ara ekranı'), breakMessage: source.breakMessage === undefined ? '' : text(source.breakMessage, 'Ara mesajı', 160, true),
    roll: roll(source.roll), blackout: boolean(source.blackout, 'Karartma'), title: text(source.title, 'Yayın başlığı', 240, true),
    cameraLane: boolean(source.cameraLane, 'Kamera alanı'), showNames: boolean(source.showNames, 'Ad etiketleri'),
  }
}

function storageError(cause: unknown, action: string) {
  const quota = cause instanceof DOMException && cause.name === 'QuotaExceededError'
  return new Error(quota ? 'Tarayıcı depolama alanı doldu. Oturumu dosya olarak kaydedin veya eski yerel görselleri kaldırın.' : `${action} Tarayıcının yerel depolama iznini kontrol edin; oturumu dosya olarak da kaydedebilirsiniz.`)
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let factory: IDBFactory | undefined
    try { factory = globalThis.indexedDB } catch (cause) { reject(storageError(cause, 'Yerel kayıt açılamadı.')); return }
    if (!factory) { reject(new Error('Bu tarayıcı yerel kaydı desteklemiyor. Oturumu dosya olarak kaydedin.')); return }
    let settled = false
    let request: IDBOpenDBRequest
    try { request = factory.open(DATABASE, 1) } catch (cause) { reject(storageError(cause, 'Yerel kayıt açılamadı.')); return }
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE) }
    request.onerror = () => { settled = true; reject(storageError(request.error, 'Yerel kayıt açılamadı.')) }
    request.onblocked = () => { settled = true; reject(new Error('Yerel kayıt başka bir sekmede açık. Eski yayın sekmelerini kapatıp yeniden deneyin.')) }
    request.onsuccess = () => {
      const database = request.result
      if (settled) { database.close(); return }
      database.onversionchange = () => database.close()
      resolve(database)
    }
  })
}

export async function saveBroadcast(state: BroadcastState): Promise<void> {
  const checked = validateBroadcastState(state)
  const database = await openDatabase()
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE, 'readwrite')
      transaction.objectStore(STORE).put(checked, 'current')
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(storageError(transaction.error, 'Oturum kaydedilemedi.'))
      transaction.onabort = () => reject(storageError(transaction.error, 'Oturum kaydedilemedi.'))
    })
  } catch (cause) { throw cause instanceof DOMException || !(cause instanceof Error) ? storageError(cause, 'Oturum kaydedilemedi.') : cause } finally { database.close() }
}

export async function loadBroadcast(): Promise<BroadcastState | null> {
  const database = await openDatabase()
  try {
    const value = await new Promise<unknown>((resolve, reject) => {
      const transaction = database.transaction(STORE, 'readonly')
      const request = transaction.objectStore(STORE).get('current')
      transaction.oncomplete = () => resolve(request.result)
      transaction.onerror = () => reject(storageError(transaction.error, 'Oturum okunamadı.'))
      transaction.onabort = () => reject(storageError(transaction.error, 'Oturum okunamadı.'))
    })
    return value === undefined ? null : validateBroadcastState(value)
  } catch (cause) { throw cause instanceof DOMException || !(cause instanceof Error) ? storageError(cause, 'Oturum okunamadı.') : cause } finally { database.close() }
}

export function downloadBroadcast(state: BroadcastState): void {
  const blob = new Blob([JSON.stringify(validateBroadcastState(state))], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `aruzahr-yayin-${new Date().toISOString().slice(0, 10)}.aruzahr.json`
  link.hidden = true
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function parseBroadcastFile(file: File): Promise<BroadcastState> {
  if (file.size > MAX_STATE_BYTES) throw new Error('Yayın dosyası en çok 30 MB olabilir.')
  let contents: unknown
  try { contents = JSON.parse(await file.text()) } catch { throw new Error('Yayın dosyası okunamadı. Geçerli bir .aruzahr.json dosyası seçin.') }
  return validateBroadcastState(contents)
}

function imageDimensions(bytes: Uint8Array, mime: string): [number, number] | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (mime === 'image/png' && bytes.length >= 24) return [view.getUint32(16), view.getUint32(20)]
  if (mime === 'image/gif' && bytes.length >= 10) return [view.getUint16(6, true), view.getUint16(8, true)]
  if (mime === 'image/webp') {
    const format = String.fromCharCode(...bytes.slice(12, 16))
    if (format === 'VP8X' && bytes.length >= 30) return [1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16)]
    if (format === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) return [1 + ((bytes[21] | bytes[22] << 8) & 0x3fff), 1 + ((bytes[22] >> 6 | bytes[23] << 2 | bytes[24] << 10) & 0x3fff)]
    if (format === 'VP8 ' && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 1 && bytes[25] === 0x2a) return [view.getUint16(26, true) & 0x3fff, view.getUint16(28, true) & 0x3fff]
  }
  if (mime === 'image/jpeg') {
    let offset = 2
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) break
      while (bytes[offset] === 0xff) offset++
      const marker = bytes[offset++]
      if (marker === 0xda || marker === 0xd9) break
      if (marker === 0x01 || marker >= 0xd0 && marker <= 0xd8) continue
      if (offset + 2 > bytes.length) break
      const length = view.getUint16(offset)
      if (length < 2 || offset + length > bytes.length) break
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && length >= 7) return [view.getUint16(offset + 5), view.getUint16(offset + 3)]
      offset += length
    }
  }
  return null
}

function checkDimensions(width: number, height: number) {
  if (!width || !height || !Number.isFinite(width * height) || width * height > MAX_PIXELS) throw new Error('Görsel en çok 40 milyon piksel olabilir. Daha küçük bir görsel seçin.')
}

export async function imageAsset(file: File): Promise<BroadcastAsset> {
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error('Görsel dosyası boş olmamalı ve en çok 8 MB olmalı.')
  const supported = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  const extension = file.name.split('.').pop()?.toLowerCase()
  const inferred = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : `image/${extension}`
  const mime = file.type || inferred
  if (!supported.includes(mime)) throw new Error('PNG, JPEG, WebP veya GIF görseli seçin.')
  const header = new Uint8Array(await file.slice(0, 1024 * 1024).arrayBuffer())
  if (!matchesImageSignature(header, mime)) throw new Error('Dosya geçerli bir görsel değil veya türü içeriğiyle eşleşmiyor.')
  const dimensions = imageDimensions(header, mime)
  if (dimensions) checkDimensions(...dimensions)
  let decoded: ImageBitmap | HTMLImageElement | null = null
  let objectUrl: string | null = null
  try {
    if (typeof createImageBitmap === 'function') decoded = await createImageBitmap(file)
    else {
      objectUrl = URL.createObjectURL(file)
      const image = new Image()
      image.src = objectUrl
      await image.decode()
      decoded = image
    }
    const width = 'naturalWidth' in decoded ? decoded.naturalWidth : decoded.width
    const height = 'naturalHeight' in decoded ? decoded.naturalHeight : decoded.height
    checkDimensions(width, height)
    const ratio = Math.min(1, 1600 / Math.max(width, height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * ratio))
    canvas.height = Math.max(1, Math.round(height * ratio))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Tarayıcı görseli işleyemedi.')
    context.drawImage(decoded, 0, 0, canvas.width, canvas.height)
    const src = canvas.toDataURL('image/webp', 0.88)
    imageSource(src, 'Yüklenen görsel')
    const name = file.name.replace(/\.[^.]+$/, '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 160) || 'Yerel görsel'
    return { id: freshId('image'), name, src, kind: 'image' }
  } catch (cause) {
    if (cause instanceof Error && /40 milyon|Tarayıcı|Yüklenen görsel/.test(cause.message)) throw cause
    throw new Error('Görsel açılamadı. Geçerli bir PNG, JPEG, WebP veya GIF dosyası seçin.')
  } finally {
    if (decoded && 'close' in decoded) decoded.close()
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }
}
