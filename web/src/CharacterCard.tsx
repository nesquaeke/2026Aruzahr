import { powerFor, powerTiers } from './character-card-profiles'

function Ornament({ richness, corner }: { richness: number; corner: string }) {
  return <svg className={`card-ornament corner-${corner}`} viewBox="0 0 50 50" fill="none" aria-hidden="true">
    <path d="M3 45V3H45M7 34V7H34" />
    {richness > 0 && <><path d="M7 27C21 28 29 19 27 7M10 24C8 15 15 8 24 10M12 19L19 12L22 19L19 22Z" /><circle cx="7" cy="7" r="2" /></>}
    {richness > 1 && <><path d="M4 41C12 40 16 36 14 30C13 26 8 28 10 31M41 4C40 12 36 16 30 14C26 13 28 8 31 10M18 30C27 31 31 27 30 18M24 30L29 36L34 29L29 24Z" /><path d="M4 18L1 12L4 6L7 12ZM18 4L12 1L6 4L12 7Z" /></>}
    {richness > 2 && <><path d="M7 45C24 42 44 22 45 7M16 41C17 33 26 34 27 30M41 16C33 17 34 26 30 27M32 40C37 37 40 32 42 27M27 42C32 40 37 37 40 32" /><circle cx="36" cy="36" r="3" /><path d="M33 36H39M36 33V39" /></>}
  </svg>
}

export default function CharacterCard({ id, src, name, role, eager = false }: { id?: string; src: string; name: string; role?: string; eager?: boolean }) {
  const tier = powerFor(id)
  const profile = tier ? powerTiers[tier] : null
  const richness = profile?.ornament || 0
  return <figure className={`character-card frame-${tier || 'unknown'}`} data-character-id={id} data-power-tier={tier || 'unknown'}>
    <div className="character-card-image"><img src={src} alt={name} loading={eager ? 'eager' : 'lazy'} />
      {richness > 1 && <svg className="card-crest" viewBox="0 0 100 30" fill="none" aria-hidden="true"><path d="M5 16C20 16 20 6 36 12L50 3L64 12C80 6 80 16 95 16M20 20H80M40 12L50 24L60 12" />{richness > 2 && <path d="M36 12L33 3L45 9L50 1L55 9L67 3L64 12M44 26H56" />}</svg>}
    </div>
    <figcaption className="character-nameplate"><strong>{name}</strong>{role && <small>{role}</small>}<span className="character-power-label">{profile?.label || 'Gücü bilinmiyor'}</span></figcaption>
    {['tl', 'tr', 'bl', 'br'].map(corner => <Ornament key={corner} richness={richness} corner={corner} />)}
  </figure>
}

export function CharacterFrameLegend() {
  return <details className="character-frame-legend"><summary>Çerçeveler ne anlatıyor?</summary><p>İşlemeler arttıkça karakterin dövüş, büyü ve siyasi nüfuzunun toplam etkisi yükselir. Bu, birebir düelloda kimin kazanacağını söylemez.</p><ul>{Object.entries(powerTiers).map(([tier, profile]) => <li key={tier}><i className={`legend-frame frame-${tier}`} /><span><strong>{profile.label}</strong>{profile.description}</span></li>)}</ul><p>Yalnızca portresi bilinen kişilere güç atanmaz; kartları “Gücü bilinmiyor” diye gösterilir.</p></details>
}
