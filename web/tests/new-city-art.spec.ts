import { expect, test } from '@playwright/test'

test('seven new city paintings are wiki covers, expandable pictures and named broadcast backgrounds', async ({page}) => {
  for (const id of ['valdareth','morihael','marhalden','elorwyn','theramis','dorvenhall','lirendil']) {
    await page.goto('/#/wiki/' + id)
    await expect(page.locator('.article-cover')).toHaveCSS('background-image',new RegExp('city-oil-' + id))
    const image = page.getByTestId('article-gallery').locator(`img[src$="city-oil-${id}.webp"]`)
    await expect(image).toBeVisible()
    await image.scrollIntoViewIfNeeded()
    await expect.poll(()=>image.evaluate((img: HTMLImageElement)=>img.complete && img.naturalWidth>=1600)).toBe(true)
    await image.click()
    await expect(page.getByRole('dialog',{name:'Görsel galerisi'})).toBeVisible()
    await page.keyboard.press('Escape')
  }
  const library = await page.evaluate(async()=> {
    const {broadcastAssets} = await import('/src/BroadcastLibrary.tsx')
    return broadcastAssets.filter((a:any)=>['valdareth','morihael','marhalden','elorwyn','theramis','dorvenhall','lirendil'].includes(a.id))
  })
  expect(library).toHaveLength(7)
  for (const asset of library) expect(asset.src).toContain('city-oil-' + asset.id)
})

test('the new predator is findable in the creature gallery without loading the private encounter book', async ({page})=>{
  const privateRequests:string[]=[]
  page.on('request',r=>{if(r.url().includes('/dm/'))privateRequests.push(r.url())})
  await page.goto('/#/gallery')
  await page.getByRole('group',{name:'Galeri kategorileri'}).getByRole('button',{name:/Canlılar/}).click()
  await page.getByLabel('Görsellerde ara').fill('Uçurum Dinleyicisi')
  await expect(page.locator('.gallery-collection article')).toHaveCount(1)
  await page.getByRole('button',{name:'Uçurum Dinleyicisi görselini büyüt',exact:true}).click()
  await expect(page.getByRole('dialog',{name:'Görsel galerisi'}).getByRole('heading',{name:'Uçurum Dinleyicisi'})).toBeVisible()
  expect(privateRequests).toEqual([])
})
