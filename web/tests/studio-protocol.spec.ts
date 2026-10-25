import { test, expect } from '@playwright/test'
import { createHash } from 'node:crypto'
import { bootStudio, panel, publicFrame, take } from './studio-fixtures'
const base = '/__aruzahr-broadcast/studio/'
test.describe.configure({ mode: 'serial', timeout: 45000 })
async function claim(page: any) {
  const r = await page.request.post(base + 'claim', {
    data: { id: 'protocol-' + Date.now(), force: true },
  })
  return r.json()
}
async function state(page: any) {
  await page.goto('/#/wiki')
  return page.evaluate(async () => {
    const path = '/src/studio/model.ts'
    const p = (await import(path)).newProject()
    return p.program
  })
}
test('yetkisiz, eski dönem ve eski sıra gönderimleri mevcut yayını değiştirmez', async ({
  page,
}) => {
  const s = await state(page),
    owner = await claim(page)
  s.studio.revision = 1
  s.title = 'Geçerli kare'
  const send = (data: any, key = owner.key) =>
    page.request.post(base + 'frame', {
      data,
      headers: { 'x-studio-owner': key },
    })
  expect((await send({ epoch: owner.epoch, state: s })).status()).toBe(200)
  expect((await send({ epoch: owner.epoch, state: s }, 'wrong')).status()).toBe(
    409,
  )
  expect(
    (
      await send({
        epoch: 'old',
        state: { ...s, studio: { ...s.studio, revision: 2 } },
      })
    ).status(),
  ).toBe(409)
  expect((await send({ epoch: owner.epoch, state: s })).status()).toBe(409)
  expect((await publicFrame(page)).title).toBe('Geçerli kare')
  await page.request.post(base + 'release', {
    data: {},
    headers: { 'x-studio-owner': owner.key },
  })
})
test('sunucu özel alanları ayıklar; iç içe grup, dış görsel ve eksik varlık reddedilir', async ({
  page,
}) => {
  const s = await state(page),
    owner = await claim(page),
    headers = { 'x-studio-owner': owner.key }
  s.studio.revision = 1
  s.secret = 'SECRET-ROOT'
  s.studio.secret = 'SECRET-EXTRAS'
  s.actors = [
    {
      id: 'visible',
      name: 'Yolcu',
      src: s.scene.src,
      kind: 'portrait',
      x: 5,
      y: 5,
      w: 10,
      h: 30,
      hidden: false,
      realName: 'SECRET-NAME',
      notes: 'SECRET-NOTE',
    },
    {
      id: 'secret',
      name: 'SECRET-HIDDEN',
      src: s.scene.src,
      kind: 'portrait',
      x: 20,
      y: 5,
      w: 10,
      h: 30,
      hidden: true,
    },
  ]
  let r = await page.request.post(base + 'frame', {
    data: { epoch: owner.epoch, state: s },
    headers,
  })
  expect(r.status()).toBe(200)
  expect(JSON.stringify(await publicFrame(page))).not.toContain('SECRET')
  for (const patch of [
    { actors: [{ ...s.actors[0], group: { secret: 'SECRET-GROUP' } }] },
    { scene: { ...s.scene, src: 'https://outside.invalid/picture.png' } },
  ]) {
    r = await page.request.post(base + 'frame', {
      data: {
        epoch: owner.epoch,
        state: { ...s, ...patch, studio: { ...s.studio, revision: 2 } },
      },
      headers,
    })
    expect(r.status()).toBe(400)
  }
  r = await page.request.post(base + 'frame', {
    data: {
      epoch: owner.epoch,
      state: {
        ...s,
        scene: {
          ...s.scene,
          src: '/__aruzahr-broadcast/asset/' + 'a'.repeat(64),
        },
        studio: { ...s.studio, revision: 3 },
      },
    },
    headers,
  })
  expect(r.status()).toBe(422)
  await page.request.post(base + 'release', { data: {}, headers })
})
test('yüklenen varlık yalnız yayımlandığında erişilir ve bütünlüğü denetlenir', async ({
  page,
}) => {
  const s = await state(page),
    owner = await claim(page),
    headers = { 'x-studio-owner': owner.key }
  const src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==',
    id = createHash('sha256').update(src).digest('hex')
  expect(
    (
      await page.request.post(base + 'asset', {
        data: { id: 'a'.repeat(64), src },
        headers,
      })
    ).status(),
  ).toBe(400)
  expect(
    (
      await page.request.post(base + 'asset', { data: { id, src }, headers })
    ).status(),
  ).toBe(200)
  expect(
    (await page.request.get('/__aruzahr-broadcast/asset/' + id)).status(),
  ).toBe(404)
  s.scene.src = '/__aruzahr-broadcast/asset/' + id
  s.studio.revision = 1
  expect(
    (
      await page.request.post(base + 'frame', {
        data: { epoch: owner.epoch, state: s },
        headers,
      })
    ).status(),
  ).toBe(200)
  const response = await page.request.get('/__aruzahr-broadcast/asset/' + id)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toBe('image/png')
  expect(
    (await response.body()).equals(Buffer.from(src.split(',')[1], 'base64')),
  ).toBe(true)
  await page.request.post(base + 'release', { data: {}, headers })
})
test('aynı resim ikinci yayına almada tekrar yüklenmez; gönderilen kare yalnız küçük referanslar taşır', async ({
  page,
}) => {
  const uploads: string[] = [],
    frames: string[] = []
  page.on('request', (r) => {
    if (r.url().endsWith(base + 'asset')) uploads.push(r.url())
    if (r.url().endsWith(base + 'frame')) frames.push(r.postData() || '')
  })
  await bootStudio(page)
  await take(page, 'HAZIRLIK: yeni')
  const count = uploads.length
  expect(count).toBeGreaterThan(0)
  await panel(page, 'Sahne')
  await page.getByLabel('Hazırlık sahne başlığı').fill('İkinci yayın')
  await take(page, 'İkinci yayın')
  expect(uploads.length).toBe(count)
  expect(frames.at(-1)).not.toContain('data:image')
  expect(frames.at(-1)!.length).toBeLessThan(6000)
})
test('eski yönetici anahtarı devralmadan sonra geçersizdir, telefon kodu ve komutları sınırlıdır', async ({
  page,
}) => {
  await state(page)
  const first = await claim(page),
    headers = { 'x-studio-owner': first.key }
  const pair = await (
    await page.request.post(base + 'pairing', {
      data: { scenes: [{ id: 'safe', name: 'Liman' }] },
      headers,
    })
  ).json()
  expect(
    (
      await page.request.post(base + 'pair', { data: { pin: 'wrong' } })
    ).status(),
  ).toBe(403)
  const phone = await (
    await page.request.post(base + 'pair', { data: { pin: pair.pin } })
  ).json()
  expect(
    (
      await page.request.post(base + 'remote', {
        data: {
          key: phone.key,
          command: { action: 'eval', value: 'alert(1)' },
        },
      })
    ).status(),
  ).toBe(400)
  expect(
    (
      await page.request.post(base + 'remote', {
        data: { key: phone.key, command: { action: 'prepare', value: 'safe' } },
      })
    ).status(),
  ).toBe(200)
  const heart = await (
    await page.request.post(base + 'heartbeat', { data: {}, headers })
  ).json()
  expect(heart.commands).toHaveLength(1)
  expect(heart.commands[0].action).toBe('prepare')
  expect(
    (
      await (
        await page.request.post(base + 'heartbeat', {
          data: { ack: heart.commands.map((c: any) => c.id) },
          headers,
        })
      ).json()
    ).commands,
  ).toEqual([])
  const second = await claim(page)
  expect(
    (
      await page.request.post(base + 'heartbeat', { data: {}, headers })
    ).status(),
  ).toBe(409)
  expect(
    (
      await page.request.post(base + 'remote', { data: { key: phone.key } })
    ).status(),
  ).toBe(403)
  await page.request.post(base + 'release', {
    data: {},
    headers: { 'x-studio-owner': second.key },
  })
})

test('yayın zarı gerçek toplamı doğrular ve yalnız sonuç seçilince formülü ayıklar', async ({
  page,
}) => {
  const s = await state(page),
    owner = await claim(page),
    headers = { 'x-studio-owner': owner.key }
  const roll = await page.evaluate(async () => {
    const path = '/src/studio/dice.ts'
    return (await import(path)).rollExpression('2d6+1d4+3')
  })
  const send = (value: any, revision: number) =>
    page.request.post(base + 'frame', {
      data: {
        epoch: owner.epoch,
        state: { ...s, studio: { ...s.studio, revision, roll: value } },
      },
      headers,
    })
  expect((await send({ ...roll, total: roll.total + 1 }, 1)).status()).toBe(400)
  expect(
    (
      await send(
        {
          ...roll,
          terms: [{ ...roll.terms[0], values: [0, 99] }, roll.terms[1]],
        },
        2,
      )
    ).status(),
  ).toBe(400)
  expect((await send(roll, 3)).status()).toBe(200)
  expect((await publicFrame(page)).studio.roll.total).toBe(roll.total)
  expect((await send({ ...roll, onlyTotal: true }, 4)).status()).toBe(200)
  const projected = (await publicFrame(page)).studio.roll
  expect(projected.total).toBe(roll.total)
  expect(projected.expression).toBe('')
  expect(projected.terms).toEqual([])
  expect(projected.critical).toBe(false)
  await page.request.post(base + 'release', { data: {}, headers })
})
