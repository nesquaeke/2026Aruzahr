import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import PlayerSheet, { BlankSpellPage } from './PlayerSheet'
import type { PlayerCharacter, PlayerSpell } from './types'
import sheetStyles from './player-sheet.css?inline'

const escaped = (text:string) => text.replace(/[&<>"']/g, value=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[value]!))

function fontAndStyleLinks() {
  return [...document.head.querySelectorAll('link[rel="stylesheet"],style')].map(element=>element.outerHTML).join('\n')
}

/** Opens synchronously to preserve the browser's user gesture, then awaits fonts/images. */
export async function printPlayerSheet(character?:PlayerCharacter,spells:PlayerSpell[]=[],blankMagic=false) {
  const popup=window.open('','_blank','width=1000,height=900')
  if(!popup)throw new Error('Yazdırma penceresi açılamadı. Bu site için açılır pencereye izin verip tekrar dene.')
  const markup=blankMagic
    ? `<div class="player-sheet-document">${renderToStaticMarkup(createElement(BlankSpellPage))}</div>`
    : renderToStaticMarkup(createElement(PlayerSheet,{character,spells}))
  const title=character?.name ? `${character.name} · Aruzahr Karakter Kâğıdı` : blankMagic ? 'Aruzahr · Büyü Defteri' : 'Aruzahr · Karakter Kâğıdı'
  popup.document.open()
  popup.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${escaped(document.baseURI)}"><title>${escaped(title)}</title>${fontAndStyleLinks()}<style>${sheetStyles}</style><style>body{margin:0;padding:0;background:#e1ddd2;color:#282724}body>.player-sheet-document{padding:0}.aruzahr-sheet-page{box-shadow:none;border:0}a{color:inherit}</style></head><body>${markup}</body></html>`)
  popup.document.close()
  try {
    const ready=Promise.all([
      popup.document.fonts.ready,
      Promise.all([...popup.document.images].map(image=>image.complete?Promise.resolve():new Promise<void>(resolve=>{image.onload=()=>resolve();image.onerror=()=>resolve()}))),
    ])
    // A stalled image request must not leave the print window waiting forever.
    await Promise.race([ready,new Promise(resolve=>setTimeout(resolve,6000))])
    if(!popup.closed){popup.focus();popup.print()}
  } catch {
    if(!popup.closed)popup.print()
  }
  return popup
}

export const printCharacterSheet=printPlayerSheet
