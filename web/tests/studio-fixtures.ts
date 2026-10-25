import { expect, type Page } from '@playwright/test'
export async function bootStudio(
  page: Page,
  fixture: Record<string, unknown> = {},
) {
  const claim = await page.request.post('/__aruzahr-broadcast/studio/claim', {
    data: { id: 'test-' + Date.now(), force: true },
  })
  const result = await claim.json()
  await page.request.post('/__aruzahr-broadcast/studio/release', {
    data: {},
    headers: { 'x-studio-owner': result.key },
  })
  await page.goto('/#/wiki')
  await page.evaluate(async (data) => {
    const model = '/src/studio/model.ts',
      library = '/src/BroadcastLibrary.tsx'
    const { newProject, storeProject } = await import(model),
      { broadcastAssets } = await import(library)
    const p = newProject()
    const scene = broadcastAssets.find((a: any) => a.id === 'marhalden')
    p.draft = { ...p.draft, mode: 'scene', scene, title: 'HAZIRLIK: yeni' }
    p.program = { ...p.program, mode: 'scene', scene, title: 'CANLI: eski' }
    Object.assign(p, data)
    await storeProject(p)
    for (const k of [
      'aruzahr-director-pack',
      'aruzahr-director-notes',
      'aruzahr-director-progress',
    ])
      localStorage.removeItem(k)
    // These suites exercise the retained advanced production desk.
    localStorage.setItem('aruzahr-studio-layout', 'advanced')
  }, fixture)
  await page.goto('/#/broadcast')
  await expect(page.getByTestId('studio-workspace')).toBeVisible()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  await expect
    .poll(async () => (await publicFrame(page)).title)
    .toBe('CANLI: eski')
  await expect(page.locator('.studio-save')).toHaveText('Kaydedildi')
}
export async function panel(page: Page, name: string) {
  await page
    .getByRole('navigation', { name: 'Studio araçları' })
    .getByRole('button', { name, exact: true })
    .click()
}
export async function publicFrame(page: Page): Promise<any> {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const s = new EventSource('/__aruzahr-broadcast/events')
        const t = setTimeout(() => {
          s.close()
          reject(new Error('Yayın durumu gelmedi.'))
        }, 7000)
        s.addEventListener('state', (e) => {
          clearTimeout(t)
          s.close()
          resolve(JSON.parse((e as MessageEvent).data))
        })
      }),
  )
}
export async function project(page: Page) {
  return page.evaluate(async () => {
    const path = '/src/studio/model.ts'
    return (await import(path)).loadProject()
  })
}
export async function chooseScene(page: Page, id: string, query: string) {
  await panel(page, 'Görsel')
  const library = page.getByTestId('broadcast-library')
  await library.getByRole('button', { name: /Sahneler/ }).click()
  await library.getByRole('searchbox').fill(query)
  await library
    .locator(`[data-asset-id="${id}"] .broadcast-asset-select`)
    .click()
}
export async function take(page: Page, title: string) {
  await page.getByTestId('studio-take').click()
  await expect.poll(async () => (await publicFrame(page)).title).toBe(title)
}
