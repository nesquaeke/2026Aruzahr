import { useId } from 'react'

/** Original line ornaments for the manuscript sheet; all labels remain HTML. */
export function PageOrnaments({grimoire=false}:{grimoire?:boolean}) {
  const id='manuscript-'+useId().replace(/[^a-z0-9_-]/gi,'')
  return <svg className={'sheet-page-ornaments'+(grimoire?' grimoire-ornaments':'')} viewBox="0 0 794 1123" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <g id={id+'-leaf'}><path d="M0 0C-15-4-19-18-12-30 0-24 5-11 0 0ZM0 0C12-7 24-5 28 5 16 14 5 10 0 0Z"/><path d="m0 0-10-22M0 0l20 5" className="ornament-fine"/></g>
      <g id={id+'-beast'}>
        <path d="M8 90C-1 74 3 56 15 43L19 28 33 17 40 4 45 20 58 12 57 28 74 36 91 34 84 47 69 55 58 53 65 64 56 76 53 96 39 108 23 105 19 93"/>
        <path d="M17 46C12 31 13 14 27 4L28 25M34 25C25 18 22 7 26 0M45 32l13 3-8 8-12-3Z"/>
        <path d="m69 45 12-2m-11 5 6 3M37 53C18 62 16 82 29 87 40 91 48 79 39 72 35 69 30 73 33 77M50 53C47 61 53 65 58 64M17 88C5 88-1 101 10 108 21 115 25 100 18 101"/>
        <path d="M27 96C33 106 46 101 47 90M26 52l-6 10m9-5-7 10m11-5-7 10m10-6-7 10m19 8-7 6m5-2-4 7" className="ornament-fine"/>
        <circle cx="47" cy="36" r="1.7" className="ornament-dark"/>
        <path d="m39 108-6 12-12-2 5-9m27-13 9 9-5 12-11-5"/>
      </g>
      <g id={id+'-flourish'}><path d="M0 0c26-23 51-4 41 9-8 12-25 1-16-7C42-5 63 14 85 0M0 0C-26-23-51-4-41 9-33 21-16 10-25 2-42-5-63 14-85 0"/><path d="m-9 0 9-13L9 0 0 9Z"/></g>
    </defs>
    <path className="ornament-outer" d="M40 18H754M776 40V1083M754 1105H40M18 1083V40"/>
    <path className="ornament-inner" d="M45 27H749M767 45V1078M749 1096H45M27 1078V45"/>
    <g className="ornament-vines">
      <path d="M23 113c-14 47 12 70 0 111s13 70 0 111 12 70 0 111 13 70 0 111 12 70 0 111 13 70 0 111 12 70 0 111 13 70 0 111M31 112c9 46-14 73-5 115s-13 69-4 109-8 72 1 113-10 69-1 109-7 73 2 112-9 71 0 112-9 69 0 110 0 67 2 101"/>
      <path d="M771 113c14 47-12 70 0 111s-13 70 0 111-12 70 0 111-13 70 0 111-12 70 0 111-13 70 0 111-12 70 0 111-13 70 0 111M763 112c-9 46 14 73 5 115s13 69 4 109 8 72-1 113 10 69 1 109 7 73-2 112 9 71 0 112 9 69 0 110 0 67-2 101"/>
      {Array.from({length:12},(_,i)=><g key={i}>
        <use href={'#'+id+'-leaf'} transform={`translate(25 ${150+i*76}) scale(.28) rotate(${i%2?160:10})`}/>
        <use href={'#'+id+'-leaf'} transform={`translate(769 ${150+i*76}) scale(-.28 .28) rotate(${i%2?160:10})`}/>
      </g>)}
    </g>
    <g className="ornament-beasts">
      <use href={'#'+id+'-beast'} transform="translate(7 14) scale(.33)"/>
      <use href={'#'+id+'-beast'} transform="translate(787 14) scale(-.33 .33)"/>
      <use href={'#'+id+'-beast'} transform="translate(7 1109) scale(.33 -.33)"/>
      <use href={'#'+id+'-beast'} transform="translate(787 1109) scale(-.33 -.33)"/>
    </g>
    <g className="ornament-head-tail"><use href={'#'+id+'-flourish'} transform="translate(397 22) scale(.6)"/><use href={'#'+id+'-flourish'} transform="translate(397 1100) scale(.6 -.6)"/></g>
    <g className="ornament-knots">{[75,145,215,285,355,439,509,579,649,719].map(x=><path key={x} d={`m${x-3} 18 3-4 3 4-3 4Zm0 1087 3-4 3 4-3 4Z`}/>)}</g>
  </svg>
}

export function AbilityMedallion() {
  return <svg className="sheet-ability-ornament" viewBox="0 0 112 88" preserveAspectRatio="none" aria-hidden="true"><path d="M20 12Q56 3 92 12L100 25 97 70Q56 88 15 70L12 25Z"/><path d="M23 16Q56 8 89 16L95 27 92 67Q56 82 20 67L17 27Z"/><path d="M16 30c-11-11-15 7-5 10 8 2 7-10 2-8M96 30c11-11 15 7 5 10-8 2-7-10-2-8M36 76c10-10 14 6 20 6s10-16 20-6"/><circle cx="56" cy="45" r="25"/><path d="m48 15 8-8 8 8m-9 61 1 6 1-6M22 51l-7 4m75-4 7 4M25 59l-7 5m69-5 7 5" className="ornament-fine"/></svg>
}

export function AnatomyWell() {
  return <svg className="sheet-anatomy-well" viewBox="0 0 160 140" aria-hidden="true"><ellipse cx="80" cy="67" rx="57" ry="61"/><ellipse cx="80" cy="67" rx="51" ry="55"/><path d="M80 3v128M18 67h124M33 23l93 91M127 23l-94 91" className="anatomy-guide"/><circle cx="80" cy="27" r="10"/><path d="M73 37l-3 6-18 7-16 38 6 3 18-31 4 25 6 11-8 34 9 2 9-32 9 32 9-2-8-34 6-11 4-25 18 31 6-3-16-38-18-7-3-6M70 47q10 8 20 0M65 58q15 9 30 0M66 64q14 8 28 0M67 70q13 7 26 0M69 78q11 6 22 0M80 45v44m-10 5 10-5 10 5"/><path d="m80 51 4 8-4 6-4-6Zm0 24 3 5-3 4-3-4Z" className="ornament-filled"/><path d="m21 19 5-3 3 6m105-3-5-3-3 6M18 103l5 4 4-5m115 1-5 4-4-5M48 9l3 7m61-7-3 7M47 127l4-8m62 8-4-8"/></svg>
}

export function ArcaneWell() {
  return <svg className="sheet-arcane-well" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="45"/><circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="26"/><path d="m50 8 36 63H14Zm0 84L14 29h72ZM50 22v56M22 50h56"/><path d="m50 36 10 14-10 14-10-14Zm0-32v8m0 76v8M4 50h8m76 0h8M17 17l6 6m54 54 6 6m0-66-6 6M23 77l-6 6"/><circle cx="50" cy="50" r="4" className="ornament-filled"/><path d="m34 10 2 7m28-7-2 7M10 34l7 2m-7 28 7-2m66-26 7-2m-7 28 7 2M34 90l2-7m28 7-2-7" className="ornament-fine"/></svg>
}
