import { abilities, characterAbilities, modifierLabel } from './character-abilities'
import './characters.css'

export default function CharacterAbilities({ id, compact = false }: { id: string; compact?: boolean }) {
  const scores = characterAbilities[id]
  if (!scores) return null
  return <section className={`character-abilities ${compact ? 'abilities-compact' : ''}`} data-testid={`abilities-${id}`} aria-label="D&D nitelikleri">
    {!compact && <div className="abilities-heading"><span className="eyebrow">D&D OYUN TASLAĞI</span><p>Altı nitelik. Siyasi nüfuz ve kart çerçevesi ayrıca değerlendirilir.</p></div>}
    <dl>{abilities.map((ability,index) => <div key={ability.key} title={`${ability.name} · ${ability.use}`}><dt><abbr title={ability.name}>{ability.key}</abbr>{!compact && <span>{ability.name}</span>}</dt><dd><strong>{scores[index]}</strong><small aria-label={`${ability.name} değiştiricisi ${modifierLabel(scores[index])}`}>{modifierLabel(scores[index])}</small></dd></div>)}</dl>
    {!compact && <p className="ability-source">Oyun için önerilen değerlerdir. Oyuncu karakterlerinde gerçek karakter kâğıdı esas alınır; bu sayılar sınıf veya seviye belirtmez.</p>}
  </section>
}
