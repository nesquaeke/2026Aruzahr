import assert from 'node:assert/strict'
import { readFile, access, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'
import sharp from 'sharp'

const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null }, appType: 'custom', logLevel: 'error' })
try {
  const { worldHouses, worldPolities, polityArticles, polityHouseArticleId } = await server.ssrLoadModule('/src/lore/world-polities.ts')
  const { regions, places, mapLocations, loreArticles, articleById } = await server.ssrLoadModule('/src/data.ts')
  const { primaryArtwork, galleryFor } = await server.ssrLoadModule('/src/media.ts')
  const { honudDemography } = await server.ssrLoadModule('/src/lore/honud-revision.ts')
  assert.equal(worldPolities.length, 8)
  assert.equal(new Set(worldPolities.map(p => p.region)).size, 8)
  assert.equal(worldHouses.length, 33)
  assert.equal(new Set(worldHouses.map(h => h.id)).size, worldHouses.length)
  assert.equal(new Set(loreArticles.map(a => a.id)).size, loreArticles.length, 'No duplicate wiki identities')
  assert.equal(places.filter(p => p.point).length, 95, 'No invented political pins')
  assert.equal(mapLocations.filter(p => p.id === 'hurnas-ithil').length, 0, 'Unlocated old capital remains unpinned')
  assert.equal(worldPolities.find(p => p.region === 'danstsud').capitalPopulation, 500000)
  assert.equal(worldPolities.find(p => p.region === 'murgul').capitalPopulation, 1000000)
  const honud = worldPolities.find(p => p.region === 'honud')
  assert.equal(honud.population, 500000)
  assert.equal(honud.capitalPopulation, 0)
  assert.equal(honud.capitalStatus, 'abandoned')
  assert.equal(Object.values(honudDemography.settlements).reduce((a, b) => a + b, 0), 158000)
  assert.equal(honudDemography.namedCoastalPopulation + honudDemography.coastalVillagePopulation + honudDemography.mobileCoastalPopulation, honud.population)
  assert.equal(articleById('hane-vaeranth').id, 'vaeranth-hanedani')
  assert.equal(articleById('hane-elorwynder').id, 'elorwynder-hanedani')
  const svgHashes = new Set()
  for (const polity of worldPolities) {
    assert(regions.some(r => r.id === polity.region))
    assert(worldHouses.some(h => h.region === polity.region))
    assert(polity.population >= polity.capitalPopulation)
    assert(polity.armed.standing + polity.armed.navalCrew + polity.armed.muster < polity.population / 10, 'Sustainable population scale')
    assert(polity.armed.elite + polity.armed.caster <= polity.armed.standing, 'Specialists are subsets')
    assert(polity.tiers.length >= 4)
    assert(polity.tiers.every(t => t.title && t.selection && t.limits))
    assert(articleById(polity.region + '-yonetim-ve-kuvvet'))
  }
  for (const house of worldHouses) {
    assert(articleById(polityHouseArticleId(house)))
    if (house.leaderId) assert(articleById(house.leaderId), 'Leader link resolves: ' + house.leaderId)
    for (const r of house.relations) assert(worldHouses.some(h => h.id === r.houseId), 'Relationship resolves')
    const crest = primaryArtwork(polityHouseArticleId(house))
    assert.equal(crest.id, house.crestId)
    assert(galleryFor(polityHouseArticleId(house), house.region, crest.src).some(a => a.id === house.crestId))
    const path = new URL('../public' + crest.src, import.meta.url)
    await access(path)
    const svg = await readFile(path, 'utf8')
    assert(svg.includes('data-motif="' + house.symbol + '"'))
    assert(svg.includes('--crest-ground:' + house.colors[0]))
    assert(!svg.includes('--crest-field'))
    assert(svg.includes('stroke:var(--crest-ground)'))
    svgHashes.add(createHash('sha256').update(svg).digest('hex'))
    const { info } = await sharp(Buffer.from(svg)).png().toBuffer({ resolveWithObject: true })
    assert.equal(info.width, 240)
    assert.equal(info.height, 300)
  }
  assert.equal(svgHashes.size, 33)
  const report = { countries: worldPolities.length, houses: worldHouses.length, publicArticles: polityArticles.length, uniqueRasterizableArms: svgHashes.size, settlementPins: places.filter(p => p.point).length, demography: '500k Valdareth / 1m Morihael / 500k country Honud / 0 old capital', status: 'pass' }
  const output = new URL('../test-results/polity-report.json', import.meta.url)
  await mkdir(new URL('.', output), { recursive: true })
  await writeFile(output, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally {
  await server.close()
}
