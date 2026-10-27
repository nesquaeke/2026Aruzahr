import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null }, appType: 'custom', logLevel: 'error' })
try {
  const { default: HeraldicCrest } = await server.ssrLoadModule('/src/HeraldicCrest.tsx')
  const { worldHouses } = await server.ssrLoadModule('/src/lore/world-polities.ts')
  const dir = new URL('../public/heraldry/', import.meta.url)
  await mkdir(dir, { recursive: true })
  const report = []
  for (const house of worldHouses) {
    let svg = renderToStaticMarkup(React.createElement(HeraldicCrest, { house }))
    if (!svg.includes('xmlns=')) svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
    svg = svg.replace('<svg ', `<svg style="--crest-ground:${house.colors[0]};color:${house.colors[1]}" `)
    const styles = '<style>.crest-cutline{fill:none;stroke:var(--crest-ground);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.crest-cutout{fill:var(--crest-ground);stroke:var(--crest-ground)}</style>'
    svg = svg.replace(/(<svg[^>]*>)/, '$1' + styles)
    await writeFile(new URL(house.id + '.svg', dir), svg + '\n')
    report.push({ id: house.crestId, src: '/heraldry/' + house.id + '.svg', title: house.name + ' · arması', caption: house.blazon, origin: 'generated', category: 'heraldry', relatedId: 'hane-' + house.id })
  }
  await writeFile(new URL('../src/heraldry-manifest.ts', import.meta.url), "import type { Artwork } from './media'\nexport const heraldryArtworks: Artwork[] = " + JSON.stringify(report, null, 2) + '\n')
  console.log('Generated', report.length, 'original SVG coats of arms')
} finally {
  await server.close()
}
