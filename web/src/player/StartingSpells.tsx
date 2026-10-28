import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { alwaysPreparedSpellIds, canSelectSpell, spellChoiceCounts, spellLimits } from './rules'
import type { ClassId, PlayerCharacter, PlayerSpell } from './types'
import './starting-spells.css'

const suggestions: Partial<Record<ClassId, string[]>> = {
  wizard: ['fire-bolt', 'mage-hand', 'light', 'magic-missile', 'mage-armor', 'shield', 'detect-magic', 'sleep', 'feather-fall'],
  sorcerer: ['fire-bolt', 'light', 'mage-hand', 'prestidigitation', 'magic-missile', 'shield'],
  warlock: ['eldritch-blast', 'mage-hand', 'charm-person', 'hellish-rebuke'],
  bard: ['vicious-mockery', 'minor-illusion', 'healing-word', 'sleep', 'charm-person', 'thunderwave'],
  cleric: ['sacred-flame', 'guidance', 'light', 'bless', 'healing-word', 'shield-of-faith', 'cure-wounds'],
  druid: ['produce-flame', 'guidance', 'entangle', 'healing-word', 'faerie-fire', 'thunderwave'],
}

export function startingSpellOptions(character: PlayerCharacter, spells: PlayerSpell[]) {
  return (suggestions[character.classId] || []).map(id => spells.find(s => s.id === id)).filter((spell): spell is PlayerSpell => !!spell && canSelectSpell(character, spell))
}

/** Fill only available choices. Existing spells, preparations and spent slots survive. */
export function addStartingSpells(character: PlayerCharacter, spells: PlayerSpell[]): Partial<PlayerCharacter> {
  const limits = spellLimits(character), always = new Set(alwaysPreparedSpellIds(character))
  const spellbook = [...character.spellbook]
  for (const spell of startingSpellOptions(character, spells)) {
    if (spellbook.includes(spell.id) || always.has(spell.id)) continue
    const prospective = { ...character, spellbook: [...spellbook, spell.id] }
    const counts = spellChoiceCounts(prospective, spells)
    if (counts.cantrips > limits.cantrips || limits.known !== null && counts.known > limits.known) continue
    spellbook.push(spell.id)
  }
  return { spellbook }
}

export default function StartingSpells({ character, spells, onChange }: { character: PlayerCharacter; spells: PlayerSpell[]; onChange: (patch: Partial<PlayerCharacter>) => void }) {
  const [applied, setApplied] = useState(false)
  const options = startingSpellOptions(character, spells)
  if (!options.length || character.level > 2) return null
  const always = new Set(alwaysPreparedSpellIds(character))
  const next = addStartingSpells(character, spells).spellbook || character.spellbook
  const additions = next.filter(id => !character.spellbook.includes(id)).length
  const selected = new Set([...character.spellbook, ...always])
  const limits = spellLimits(character)
  const prepared = character.preparedSpells.filter(id => !always.has(id)).length
  return <details className="pw-starting-spells" data-testid="starting-spells">
    <summary><Sparkles size={15} /><span>İlk büyülerini seçmekte zorlanıyor musun?<small>1. seviye için örnek bir başlangıç; seçimler sana ait.</small></span></summary>
    <div>
      <p>Bu küçük seçki, sınıfının birkaç farklı kullanımını denemek içindir. Mevcut büyülerini çıkarmaz, bilinen büyü ve basit büyü sınırlarını aşmaz. Daha yüksek seviye seçimlerini arşivden tamamla.</p>
      <ul>{options.map(spell => <li key={spell.id}><span>{spell.level === 0 ? 'Basit' : spell.level + '. derece'}</span><strong>{spell.name}</strong>{selected.has(spell.id) && <Check size={13} />}</li>)}</ul>
      <button type="button" disabled={!additions} onClick={() => { onChange(addStartingSpells(character, spells)); setApplied(true) }}>{additions ? `${additions} uygun öneriyi defterime ekle` : 'Uygun öneriler zaten defterinde'}</button>
      {applied && <p role="status">Uygun öneriler eklendi. Kullanmadan önce açıklamalarını arşivden açıp oku.</p>}
      {limits.prepared !== null && <p>Günlük hazırlık ayrı: şu anda {prepared} / {limits.prepared} normal büyü hazır. Arşivde seçtiğin büyünün <strong>Hazırla</strong> düğmesini kullan. Alan/yemin büyüleri ayrıca her zaman hazır olabilir.</p>}
    </div>
  </details>
}
