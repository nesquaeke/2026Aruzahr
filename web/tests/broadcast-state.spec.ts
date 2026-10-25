import { expect, test } from '@playwright/test'

// Import in the browser: the public asset catalogue includes React components
// and CSS, which Vite serves in the same way as the actual workbench.
test.beforeEach(async ({ page }) => {
  await page.goto('/#/wiki')
})

test('yayın ilk açılışta haritayla ve varsayılmış oyuncular olmadan başlar', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { newBroadcastState, validateBroadcastState, freshId } = await import(modulePath)
    const initial = newBroadcastState()
    const checked = validateBroadcastState(initial)
    return { initial, checked, ids: [freshId('test'), freshId('test')] }
  })
  expect(result.checked).toEqual(result.initial)
  expect(result.initial).toMatchObject({
    version: 1, mode: 'map', sceneZoom: 1,
    actors: [], tokens: [], strokes: [], customAssets: [],
    roll: null, camera: null, blackout: false, cameraLane: false, showNames: true,
    title: 'Marhalden’den Hardlane’e',
  })
  expect(result.initial.scene.src).toMatch(/^\/illustrations\/.+\.(webp|png|jpe?g)$/i)
  expect(result.ids[0]).not.toBe(result.ids[1])
  expect(result.ids.every((id: string) => id.startsWith('test') && id.length >= 32)).toBe(true)
})

test('dış adresler, SVG, geçersiz veri ve dizin aşımı yayın görseli olamaz', async ({ page }) => {
  const rejected = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { newBroadcastState, validateBroadcastState } = await import(modulePath)
    const sources = [
      'https://example.com/portrait.webp', '//example.com/portrait.png',
      'javascript:alert(1)', 'data:image/svg+xml;base64,PHN2Zy8+',
      'data:image/png;base64,%%%%', '/illustrations/../private.png',
      '/illustrations/%2e%2e/private.png', '/illustrations/not-a-real-public-asset.webp',
    ]
    return sources.map(src => {
      const state = newBroadcastState()
      state.scene = { ...state.scene, src }
      try { validateBroadcastState(state); return false } catch (error) { return error instanceof Error && !!error.message }
    })
  })
  expect(rejected).toEqual(Array(8).fill(true))
})

test('sahne ve harita koordinatları, yakınlaştırma ve çizim sınırları doğrulanır', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { newBroadcastState, validateBroadcastState } = await import(modulePath)
    const initial = newBroadcastState()
    const actor = { id: 'actor-test', name: 'Sahne görseli', src: initial.scene.src, kind: 'image', x: 50, y: 50, w: 20, h: 30, hidden: false }
    const token = { id: 'token-test', name: 'Grup', kind: 'party', x: 0.5, y: 0.5, size: 48 }
    const stroke = { id: 'stroke-test', kind: 'pen', color: '#d5b16d', width: 12, points: [[0, 0], [1, 1]] }
    const valid = { ...initial, actors: [actor], tokens: [token], strokes: [stroke], camera: { x: -0.5, y: 1.5, zoom: 4 } }
    validateBroadcastState(valid)
    const invalid = [
      { ...valid, actors: [{ ...actor, x: -1 }] },
      { ...valid, actors: [{ ...actor, h: 101 }] },
      { ...valid, actors: [{ ...actor, w: 1 }] },
      { ...valid, tokens: [{ ...token, x: 1.01 }] },
      { ...valid, tokens: [{ ...token, y: Number.NaN }] },
      { ...valid, camera: { x: 0, y: 0, zoom: 0.4 } },
      { ...valid, camera: { x: 0, y: 3, zoom: 1 } },
      { ...valid, sceneZoom: Number.POSITIVE_INFINITY },
      { ...valid, strokes: [{ ...stroke, width: 81 }] },
      { ...valid, strokes: [{ ...stroke, color: 'url(https://example.com)' }] },
      { ...valid, strokes: [{ ...stroke, points: [[0, 1.01]] }] },
    ]
    return { count: invalid.length, rejected: invalid.filter(state => {
      try { validateBroadcastState(state); return false } catch { return true }
    }).length }
  })
  expect(result.rejected).toBe(result.count)
})

test('koleksiyon kotaları ve zar sonuçlarının bütünlüğü korunur', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { newBroadcastState, validateBroadcastState } = await import(modulePath)
    const initial = newBroadcastState()
    const actor = { id: 'actor-test', name: 'Görsel', src: initial.scene.src, kind: 'image', x: 50, y: 50, w: 20, h: 30, hidden: false }
    const token = { id: 'token-test', name: 'Grup', kind: 'party', x: 0.5, y: 0.5, size: 48 }
    const stroke = { id: 'stroke-test', kind: 'pen', color: '#d5b16d', width: 12, points: [[0, 0], [1, 1]] }
    const roll = { id: 'roll-test', sides: 20, count: 2, modifier: -3, values: [7, 20], total: 24, at: Date.now() }
    validateBroadcastState({ ...initial, roll })
    const invalid = [
      { ...initial, actors: Array.from({ length: 41 }, (_, index) => ({ ...actor, id: `actor-${index}` })) },
      { ...initial, tokens: Array.from({ length: 201 }, (_, index) => ({ ...token, id: `token-${index}` })) },
      { ...initial, strokes: Array.from({ length: 501 }, (_, index) => ({ ...stroke, id: `stroke-${index}` })) },
      { ...initial, strokes: [{ ...stroke, points: Array.from({ length: 2001 }, () => [0.5, 0.5]) }] },
      { ...initial, roll: { ...roll, total: 25 } },
      { ...initial, roll: { ...roll, values: [7, 21], total: 25 } },
      { ...initial, roll: { ...roll, count: 3 } },
      { ...initial, roll: { ...roll, sides: 19 } },
      { ...initial, roll: { ...roll, at: Number.NaN } },
      { ...initial, version: 2 },
    ]
    return { count: invalid.length, rejected: invalid.filter(state => {
      try { validateBroadcastState(state); return false } catch { return true }
    }).length }
  })
  expect(result.rejected).toBe(result.count)
})

test('yayın durumuna eklenen özel DM notları yeniden dışarı taşınmaz', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { newBroadcastState, validateBroadcastState } = await import(modulePath)
    const state = { ...newBroadcastState(), dmNotes: 'Sadece DM için görev sırrı' }
    try {
      const checked = validateBroadcastState(state)
      return !Object.prototype.hasOwnProperty.call(checked, 'dmNotes') && !JSON.stringify(checked).includes('görev sırrı')
    } catch { return true }
  })
  expect(result).toBe(true)
})

test('IndexedDB tam sahneyi ve yerel görselleri kaydeder, sonraki kayıt öncekinin yerini alır', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { newBroadcastState, validateBroadcastState, saveBroadcast, loadBroadcast } = await import(modulePath)
    const canvas = document.createElement('canvas')
    canvas.width = 2; canvas.height = 2
    const asset = { id: 'local-test', name: 'Yerel görsel', src: canvas.toDataURL('image/png'), kind: 'image' }
    const initial = newBroadcastState()
    const state = validateBroadcastState({
      ...initial, mode: 'scene', title: 'Kaydedilen sahne', sceneZoom: 1.5,
      customAssets: [asset], actors: [{ id: 'uploaded-actor', name: asset.name, src: asset.src, assetId: asset.id, kind: 'image', x: 35, y: 65, w: 25, h: 35, hidden: false }],
      camera: { x: 0.4, y: 0.6, zoom: 2 },
    })
    await saveBroadcast(state)
    const first = await loadBroadcast()
    await saveBroadcast({ ...state, title: 'Güncel sahne', blackout: true })
    const second = await loadBroadcast()
    return { state, first, second }
  })
  expect(result.first).toEqual(result.state)
  expect(result.second).toEqual({ ...result.state, title: 'Güncel sahne', blackout: true })
})

test('JSON içe aktarma doğrulanır ve dosya boyutu okuma öncesinde sınırlanır', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { newBroadcastState, parseBroadcastFile } = await import(modulePath)
    const initial = newBroadcastState()
    const imported = await parseBroadcastFile(new File([JSON.stringify(initial)], 'oturum.aruzahr.json', { type: 'application/json' }))
    const invalidFiles = [
      new File(['{broken'], 'bozuk.json', { type: 'application/json' }),
      new File([JSON.stringify({ ...initial, mode: 'unknown' })], 'gecersiz.json', { type: 'application/json' }),
      new File([new Uint8Array(30 * 1024 * 1024 + 1)], 'buyuk.json', { type: 'application/json' }),
    ]
    const rejected: boolean[] = []
    for (const file of invalidFiles) {
      try { await parseBroadcastFile(file); rejected.push(false) } catch (error) { rejected.push(error instanceof Error && !!error.message) }
    }
    return { initial, imported, rejected }
  })
  expect(result.imported).toEqual(result.initial)
  expect(result.rejected).toEqual([true, true, true])
})

test('yerel görseller doğrulanır, 1600 piksele küçültülür ve WebP olarak saklanır', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { imageAsset } = await import(modulePath)
    const canvas = document.createElement('canvas')
    canvas.width = 2000; canvas.height = 100
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('PNG oluşturulamadı')), 'image/png'))
    const asset = await imageAsset(new File([blob], 'Deneme görseli.png', { type: 'image/png' }))
    const image = new Image()
    image.src = asset.src
    await image.decode()
    const files = [
      new File(['<svg xmlns="http://www.w3.org/2000/svg"/>'], 'vektor.svg', { type: 'image/svg+xml' }),
      new File(['not-an-image'], 'sahte.png', { type: 'image/png' }),
      new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'buyuk.png', { type: 'image/png' }),
    ]
    const rejected: boolean[] = []
    for (const file of files) {
      try { await imageAsset(file); rejected.push(false) } catch (error) { rejected.push(error instanceof Error && !!error.message) }
    }
    return { asset, width: image.naturalWidth, height: image.naturalHeight, rejected }
  })
  expect(result.asset).toMatchObject({ name: 'Deneme görseli', kind: 'image' })
  expect(result.asset.src).toMatch(/^data:image\/webp;base64,/)
  expect(result.width).toBe(1600)
  expect(result.height).toBe(80)
  expect(result.rejected).toEqual([true, true, true])
})

test('40 milyon pikseli aşan PNG ve bütün WebP başlıkları bitmap ayrılmadan reddedilir', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const modulePath = '/src/broadcast-state.ts'
    const { imageAsset } = await import(modulePath)
    const width = 8000, height = 6000
    // Header-only fixtures must fail at the dimension check, before a decoder
    // could allocate their declared 48-million-pixel bitmap.
    const png = new Uint8Array(33)
    png.set([137, 80, 78, 71, 13, 10, 26, 10])
    png.set([73, 72, 68, 82], 12)
    const pngView = new DataView(png.buffer)
    pngView.setUint32(8, 13)
    pngView.setUint32(16, width)
    pngView.setUint32(20, height)

    const webp = (format: string, payloadLength: number) => {
      const bytes = new Uint8Array(30)
      bytes.set([82, 73, 70, 70], 0) // RIFF
      bytes.set([87, 69, 66, 80], 8) // WEBP
      bytes.set(Array.from(format, character => character.charCodeAt(0)), 12)
      const view = new DataView(bytes.buffer)
      view.setUint32(4, bytes.length - 8, true)
      view.setUint32(16, payloadLength, true)
      return bytes
    }
    const extended = webp('VP8X', 10)
    const write24 = (bytes: Uint8Array, offset: number, value: number) => {
      bytes[offset] = value & 0xff
      bytes[offset + 1] = value >>> 8 & 0xff
      bytes[offset + 2] = value >>> 16 & 0xff
    }
    write24(extended, 24, width - 1)
    write24(extended, 27, height - 1)
    const lossless = webp('VP8L', 5)
    lossless[20] = 0x2f
    new DataView(lossless.buffer).setUint32(21, (width - 1) | (height - 1) << 14, true)
    const lossy = webp('VP8 ', 10)
    lossy.set([0x9d, 0x01, 0x2a], 23)
    new DataView(lossy.buffer).setUint16(26, width, true)
    new DataView(lossy.buffer).setUint16(28, height, true)

    const originalBitmap = window.createImageBitmap
    let bitmapCalls = 0
    window.createImageBitmap = async () => {
      bitmapCalls++
      throw new Error('Bitmap ayırma aşamasına ulaşılmamalı')
    }
    try {
      const fixtures = [
        { name: 'PNG', bytes: png, mime: 'image/png' },
        { name: 'VP8X', bytes: extended, mime: 'image/webp' },
        { name: 'VP8L', bytes: lossless, mime: 'image/webp' },
        { name: 'VP8', bytes: lossy, mime: 'image/webp' },
      ]
      const errors: { format: string; message: string }[] = []
      for (const fixture of fixtures) {
        try {
          await imageAsset(new File([fixture.bytes], `${fixture.name}.gorsel`, { type: fixture.mime }))
          errors.push({ format: fixture.name, message: 'reddedilmedi' })
        } catch (error) {
          errors.push({ format: fixture.name, message: error instanceof Error ? error.message : String(error) })
        }
      }
      return { bitmapCalls, errors }
    } finally {
      window.createImageBitmap = originalBitmap
    }
  })
  expect(result.bitmapCalls).toBe(0)
  expect(result.errors.map(error => error.format)).toEqual(['PNG', 'VP8X', 'VP8L', 'VP8'])
  for (const error of result.errors) expect(error.message, error.format).toContain('40 milyon')
})
