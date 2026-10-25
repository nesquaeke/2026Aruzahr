import { expect, test, type Page } from '@playwright/test'

// The relay deliberately retains one current frame in server RAM. Keep its
// isolated-profile cases sequential so one publisher cannot replace another.
test.describe.configure({ mode: 'serial', timeout: 60_000 })

type RelayWindow = Window & {
  __relaySource?: EventSource
  __relayStates?: Record<string, unknown>[]
  __relayPresence?: { online: boolean }[]
  __relayParseErrors?: string[]
}

async function connectAudience(page: Page) {
  await page.evaluate(async () => {
    const relay = window as RelayWindow
    relay.__relaySource?.close()
    relay.__relayStates = []
    relay.__relayPresence = []
    relay.__relayParseErrors = []
    const source = new EventSource('/__aruzahr-broadcast/events')
    relay.__relaySource = source
    source.addEventListener('state', event => {
      try { relay.__relayStates!.push(JSON.parse((event as MessageEvent).data)) }
      catch { relay.__relayParseErrors!.push('state') }
    })
    source.addEventListener('presence', event => {
      try { relay.__relayPresence!.push(JSON.parse((event as MessageEvent).data)) }
      catch { relay.__relayParseErrors!.push('presence') }
    })
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('Yayın olay akışı açılmadı.')), 10000)
      source.addEventListener('open', () => { window.clearTimeout(timer); resolve() }, { once: true })
      source.addEventListener('error', () => { window.clearTimeout(timer); reject(new Error('Yayın olay akışına bağlanılamadı.')) }, { once: true })
    })
  })
}

test('ayrı tarayıcı profilleri SSE üzerinden yalnızca herkese açık sahneyi ve bağlantı durumunu alır', async ({ browser }, testInfo) => {
  const baseURL = String(testInfo.project.use.baseURL || 'http://127.0.0.1:5173')
  const viewport = testInfo.project.use.viewport ?? { width: 1440, height: 1000 }
  // Separate contexts do not share local storage or BroadcastChannel. The
  // audience below listens only to the server's EventSource transport.
  const controllerContext = await browser.newContext({ baseURL, viewport })
  const audienceContext = await browser.newContext({ baseURL, viewport })
  try {
    const controller = await controllerContext.newPage()
    const audience = await audienceContext.newPage()
    await Promise.all([controller.goto('/#/wiki'), audience.goto('/#/wiki')])
    await controller.evaluate(() => localStorage.setItem('aruzahr-relay-profile-isolation', 'controller-only'))
    expect(await audience.evaluate(() => localStorage.getItem('aruzahr-relay-profile-isolation'))).toBeNull()
    await connectAudience(audience)

    const state = await controller.evaluate(async () => {
      const modulePath = '/src/broadcast-state.ts'
      const { newBroadcastState } = await import(modulePath)
      const initial = newBroadcastState()
      const privateMarker = 'PRIVATE_RELAY_TEST_SECRET'
      const canvas = document.createElement('canvas')
      canvas.width = 1; canvas.height = 1
      return {
        ...initial,
        mode: 'scene', title: `Ayrı profil yayını ${crypto.randomUUID()}`,
        scene: { ...initial.scene, dmNotes: `${privateMarker}_SCENE` },
        actors: [
          { id: 'relay-visible-actor', name: 'Görünür sahne öğesi', src: initial.scene.src, kind: 'image', x: 30, y: 40, w: 20, h: 40, hidden: false, dmNotes: `${privateMarker}_ACTOR` },
          { id: 'relay-hidden-actor', name: `${privateMarker}_HIDDEN`, src: initial.scene.src, kind: 'image', x: 60, y: 40, w: 20, h: 40, hidden: true },
        ],
        customAssets: [{ id: 'relay-private-upload', name: `${privateMarker}_UPLOAD`, kind: 'image', src: canvas.toDataURL('image/png') }],
        dmNotes: `${privateMarker}_ROOT`,
        dmPack: { quests: [{ title: 'Gizli görev', secret: `${privateMarker}_PACK` }] },
      }
    })
    const posted = await controller.evaluate(async value => {
      const response = await fetch('/__aruzahr-broadcast/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) })
      return { ok: response.ok, status: response.status }
    }, state)
    expect(posted.ok, `Durum gönderimi HTTP ${posted.status}`).toBe(true)

    await expect.poll(() => audience.evaluate(title => {
      const relay = window as RelayWindow
      return relay.__relayStates?.some(value => value.title === title) ?? false
    }, state.title)).toBe(true)
    const publicState = await audience.evaluate(title => {
      const relay = window as RelayWindow
      return relay.__relayStates!.find(value => value.title === title)!
    }, state.title)
    expect(publicState.actors).toEqual([
      expect.objectContaining({ id: 'relay-visible-actor', name: 'Görünür sahne öğesi', hidden: false }),
    ])
    expect(publicState.customAssets ?? []).toEqual([])
    const serialized = JSON.stringify(publicState)
    expect(serialized).not.toContain('PRIVATE_RELAY_TEST_SECRET')
    expect(serialized).not.toContain('relay-hidden-actor')
    expect(serialized).not.toContain('relay-private-upload')
    expect(serialized).not.toContain('"dmNotes"')
    expect(serialized).not.toContain('"dmPack"')

    const heartbeat = await controller.evaluate(async () => {
      const response = await fetch('/__aruzahr-broadcast/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      return { ok: response.ok, status: response.status }
    })
    expect(heartbeat.ok, `Bağlantı bildirimi HTTP ${heartbeat.status}`).toBe(true)
    await expect.poll(() => audience.evaluate(() => (window as RelayWindow).__relayPresence?.some(value => value.online === true) ?? false)).toBe(true)

    // A newly opened SSE connection receives the server's latest public state
    // without another controller state POST or shared-profile browser storage.
    await connectAudience(audience)
    await expect.poll(() => audience.evaluate(title => (window as RelayWindow).__relayStates?.some(value => value.title === title) ?? false, state.title)).toBe(true)
    expect(await audience.evaluate(() => (window as RelayWindow).__relayParseErrors)).toEqual([])
  } finally {
    await Promise.all([controllerContext.close(), audienceContext.close()])
  }
})

test('yayın rölesi bozuk JSON, bilinmeyen sürüm ve nesne olmayan durumları reddeder', async ({ request }) => {
  const bodies = ['{broken', JSON.stringify({ version: 999 }), 'null', '[]', '"sahne"']
  for (const body of bodies) {
    const response = await request.post('/__aruzahr-broadcast/state', {
      headers: { 'Content-Type': 'application/json' },
      data: body,
    })
    expect(response.status(), `Geçersiz içerik: ${body}`).toBe(400)
  }
})

test('OBS ayrı profilde gerçek yönetim sahnesini ve aynı çoklu zar sonucunu gösterir', async ({ browser }, testInfo) => {
  const baseURL = String(testInfo.project.use.baseURL || 'http://127.0.0.1:5173')
  const viewport = testInfo.project.use.viewport ?? { width: 1440, height: 1000 }
  const operatorContext = await browser.newContext({ baseURL, viewport })
  const obsContext = await browser.newContext({ baseURL, viewport })
  try {
    const operator = await operatorContext.newPage()
    const obs = await obsContext.newPage()
    // Prepare only local persistence, before mounting the director, so a map
    // camera initialization cannot race this scene-focused UI test.
    await operator.goto('/#/wiki')
    await operator.evaluate(async () => {
      const modulePath = '/src/broadcast-state.ts'
      const { newBroadcastState, saveBroadcast } = await import(modulePath)
      await saveBroadcast({ ...newBroadcastState(), mode: 'scene' })
    })
    await operator.goto('/#/broadcast')
    await expect(operator.getByTestId('broadcast-workspace')).toBeVisible()
    await obs.goto('/#/broadcast/live')
    await expect(obs.getByTestId('broadcast-live')).toBeVisible()

    const library = operator.getByTestId('broadcast-library')
    await library.getByRole('button', { name: /Sahneler/ }).click()
    await library.getByRole('searchbox').fill('Valdareth')
    await library.locator('[data-asset-id="valdareth"] .broadcast-asset-select').click()
    const title = `OBS profil testi ${Date.now()}`
    await operator.getByLabel('Yayındaki sahne başlığı').fill(title)
    await expect(obs.getByTestId('broadcast-scene').getByRole('img')).toHaveAttribute('alt', 'Valdareth')
    await expect(obs.getByText(title, { exact: true })).toBeVisible()
    await expect(obs.locator('.broadcast-live-status')).toHaveCount(0)
    await expect(obs.getByRole('navigation')).toHaveCount(0)
    await expect(obs.getByTestId('broadcast-dm-notes')).toHaveCount(0)

    await operator.getByRole('navigation', { name: 'Yönetim panelleri' }).getByRole('button', { name: 'Zar', exact: true }).click()
    await operator.getByRole('button', { name: 'd8 zarı', exact: true }).click()
    await operator.getByRole('spinbutton', { name: 'Zar adedi', exact: true }).fill('3')
    await operator.getByRole('spinbutton', { name: 'Ek değer', exact: true }).fill('-2')
    await operator.getByRole('button', { name: /Zarları at/ }).click()
    const savedRoll = () => operator.evaluate(async () => {
      const modulePath = '/src/broadcast-state.ts'
      const { loadBroadcast } = await import(modulePath)
      return (await loadBroadcast())?.roll ?? null
    })
    await expect.poll(async () => (await savedRoll())?.values.length).toBe(3)
    const roll = (await savedRoll())!
    expect(roll.sides).toBe(8)
    expect(roll.modifier).toBe(-2)
    expect(roll.values.every((value: number) => Number.isInteger(value) && value >= 1 && value <= 8)).toBe(true)
    const total = roll.values.reduce((sum: number, value: number) => sum + value, -2)
    expect(roll.total).toBe(total)
    await expect(operator.getByTestId('dice-total')).toHaveText(String(total))
    const obsRoll = obs.getByTestId('broadcast-dice-display')
    await expect(obsRoll).toHaveAttribute('data-roll-id', roll.id)
    await expect(obsRoll.locator('.bd-stage-total')).toHaveText(String(total))
    await expect(obsRoll.locator('.bd-stage-breakdown')).toContainText(roll.values.join(' + '))
    await expect(obsRoll.locator('.bd-stage-dice .bd-die-value')).toHaveText(roll.values.map(String))

    // Simulate an idle relay restart: the heartbeat succeeds, but its RAM cache
    // is empty. The director must resend its current frame without another edit.
    let simulatedCacheLoss = false
    const republished = operator.waitForRequest(request => simulatedCacheLoss && request.method() === 'POST' && new URL(request.url()).pathname === '/__aruzahr-broadcast/state')
    await operator.route('**/__aruzahr-broadcast/heartbeat', async route => {
      if (simulatedCacheLoss) { await route.continue(); return }
      simulatedCacheLoss = true
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, hasState: false }) })
    })
    const recovered = (await republished).postDataJSON()
    expect(simulatedCacheLoss).toBe(true)
    expect(recovered.title).toBe(title)
    expect(recovered.roll.id).toBe(roll.id)
    await expect(obsRoll).toHaveAttribute('data-roll-id', roll.id)
  } finally {
    await Promise.all([operatorContext.close(), obsContext.close()])
  }
})
