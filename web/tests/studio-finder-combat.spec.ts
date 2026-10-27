import { expect, test } from '@playwright/test'
import { bootStudio, panel, project, publicFrame } from './studio-fixtures'

test.describe.configure({ mode: 'serial' })

test('kişi bulucu bağlamı gösterir ve kişinin ilk görev sahnesini açar', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Kişi / yer bul')
  const finder = page.locator('.studio-center').getByTestId('studio-directory')
  await finder
    .getByRole('searchbox', { name: 'Kişi, yer ve karşılaşma bul' })
    .fill('Eren Keld')
  await finder
    .locator('[data-directory-id="dossier-son-ilac-eren-keld"]')
    .click()
  const detail = finder.getByTestId('studio-directory-detail')
  await expect(detail).toContainText('Marhalden')
  await expect(detail).toContainText('Son İlaç')
  await expect(detail).toContainText('Eski su yollarının bakım ustası')
  const before = JSON.stringify(await publicFrame(page))
  await detail
    .getByRole('button', { name: 'İlgili görev sahnesini aç', exact: true })
    .click()
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}')
            .quest,
      ),
    )
    .toBe('son-ilac')
  const expected = await page.request
    .get('/dm/On-Kis-Karari-DM.json')
    .then((r) => r.json())
    .then((pack) =>
      pack.quests[0].steps.findIndex((step: any) =>
        step.portraitIds.includes('eren-keld'),
      ),
    )
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}')
            .steps?.['son-ilac'],
      ),
    )
    .toBe(expected)
  expect(JSON.stringify(await publicFrame(page))).toBe(before)
})

test('hikâyedeki canavarı önceden kişi eklemeden hazırlar; hasar ve iyileştirme sınırları korunur', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Savaş')
  await page
    .getByLabel('Hazır pusu ve canavar karşılaşmaları')
    .selectOption('encounter-son-ilac-son-ilac-2')
  await expect(page.getByTestId('battle-profile')).toContainText(
    'Galeri Kıskacı',
  )
  await page
    .getByRole('button', {
      name: 'Karşılaşmanın düşmanlarını ekle · gizli',
      exact: true,
    })
    .click()
  await expect
    .poll(async () => (await project(page)).encounter.items.length)
    .toBe(1)
  const fighter = (await project(page)).encounter.items[0]
  expect(fighter).toMatchObject({
    name: 'Galeri Kıskacı',
    hp: 9,
    maxHp: 9,
    ac: 12,
    hidden: true,
  })
  expect((await publicFrame(page)).studio.combat).toBeUndefined()
  await page.locator('.st-battle-advanced>summary').click()
  await page.locator('.st-active-fighter').getByLabel('Geçici', {exact:true}).fill('4')
  await page.getByLabel('Hızlı can değişimi').fill('6')
  await page.getByRole('button',{name:'Galeri Kıskacı: 6 hasar',exact:true}).click()
  await expect.poll(async()=>(await project(page)).encounter.items[0].hp).toBe(7)
  expect((await project(page)).encounter.items[0].tempHp).toBe(0)
  await page.getByLabel('Hızlı can değişimi').fill('30')
  await page
    .getByRole('button', { name: 'Galeri Kıskacı: 30 hasar', exact: true })
    .click()
  await expect
    .poll(async () => (await project(page)).encounter.items[0].hp)
    .toBe(0)
  await page
    .getByRole('button', { name: 'Galeri Kıskacı: 30 iyileştir', exact: true })
    .click()
  await expect
    .poll(async () => (await project(page)).encounter.items[0].hp)
    .toBe(9)
})

test('pusu kartının gizli düşmanları ve taktikleri açık yayın komutuna kadar özel kalır', async ({
  page,
}) => {
  const book = await page.request
    .get('/dm/Night-Road-Encounters.json')
    .then((r) => r.json())
  const card =
    book.cards.find(
      (card: any) => card.combat && card.id === 'yuzsuz-rehber',
    ) || book.cards.find((card: any) => card.combat)
  expect(card).toBeTruthy()
  await bootStudio(page)
  await panel(page, 'Savaş')
  await page
    .getByLabel('Hazır pusu ve canavar karşılaşmaları')
    .selectOption(card.id)
  await page
    .getByRole('button', {
      name: 'Karşılaşmanın düşmanlarını ekle · gizli',
      exact: true,
    })
    .click()
  await expect
    .poll(async () => (await project(page)).encounter.items.length)
    .toBe(
      card.combat.combatants.reduce(
        (total: number, unit: any) => total + unit.count,
        0,
      ),
    )
  expect(
    (await project(page)).encounter.items.every((unit: any) => unit.hidden),
  ).toBe(true)
  await page.locator('.st-battle-broadcast>summary').click()
  await page.getByLabel('Savaş bilgisini canlı göster').check()
  await expect
    .poll(async () => (await publicFrame(page)).studio.combat?.items)
    .toEqual([])
  await page
    .locator('.st-battle-fighter')
    .first()
    .getByRole('button', { name: 'Listede görünür yap', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.combat?.items.length)
    .toBe(1)
  const wire = JSON.stringify(await publicFrame(page))
  expect(wire).not.toContain(card.combat.enemyGoal)
  expect(wire).not.toContain(card.combat.escape)
  expect(wire).not.toContain('"ac":')
})
