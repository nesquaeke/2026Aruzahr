import { useEffect, useState } from 'react'
import { broadcastAssets } from '../BroadcastLibrary'
import type { NightEncounter } from '../night-encounters'
import { placeById } from '../data'
import { useStudio } from './context'
import {
  StudioFinder,
  useStudioDirectory,
  type DirectoryEntry,
} from './StudioFinder'

export type BattleFighterDraft = {
  castId: string
  name: string
  hp: number
  ac: number
  initiative: number
  hidden: boolean
  notes: string
  group: string
}
type BattleProfile = {
  id: string
  title: string
  arrival: string
  locationId: string
  portraitId?: string
  visibleName: string
  combat: NonNullable<NightEncounter['combat']>
  source: string
}

export default function BattlePreparation({
  onAdd,
}: {
  onAdd: (fighters: BattleFighterDraft[]) => void
}) {
  const { p, addPerson, notify, addAsset } = useStudio()
  const { entries, cards, error } = useStudioDirectory()
  const [selected, setSelected] = useState<DirectoryEntry>()
  const [profileId, setProfileId] = useState('')
  const [requestId, setRequestId] = useState(
    () => sessionStorage.getItem('aruzahr-combat-card-request') || '',
  )
  const [hp, setHp] = useState(10)
  const [ac, setAc] = useState(10)
  const [side, setSide] = useState<'enemy' | 'ally'>('enemy')
  useEffect(() => {
    const requested = () =>
      setRequestId(sessionStorage.getItem('aruzahr-combat-card-request') || '')
    window.addEventListener('studio-night-combat', requested)
    return () => window.removeEventListener('studio-night-combat', requested)
  }, [])
  useEffect(() => {
    if (!requestId || !cards.length) return
    const card = cards.find((card) => card.id === requestId && card.combat)
    if (card) {
      setProfileId(card.id)
      sessionStorage.removeItem('aruzahr-combat-card-request')
      setRequestId('')
    }
  }, [cards, requestId])
  const profiles: BattleProfile[] = [
    ...cards
      .filter((card) => card.combat)
      .map((card) => ({
        ...card,
        combat: card.combat!,
        source: 'Gece ve Yol · isteğe bağlı karşılaşma',
      })),
    ...entries
      .filter((entry) => entry.encounter && entry.encounter.units.length)
      .map((entry) => {
        const encounter = entry.encounter!
        return {
          id: entry.id,
          title: entry.name,
          arrival: encounter.trigger,
          locationId: entry.locationId || '',
          portraitId:
            entry.asset?.kind === 'portrait' ? entry.asset.id : undefined,
          visibleName: entry.asset?.kind === 'portrait' ? entry.asset.name : '',
          source: entry.source,
          combat: {
            danger: encounter.scale,
            enemyGoal: encounter.goal,
            telegraph: encounter.space,
            tactics: encounter.rounds,
            escape: encounter.exits.join(' '),
            morale: encounter.units
              .map((unit) => `${unit.name}: ${unit.morale}`)
              .join(' '),
            combatants: encounter.units.map((unit, index) => ({
              id: `unit-${index}`,
              name: unit.name,
              count: unit.count,
              hp: unit.hp,
              ac: unit.ac,
              initiative: 0,
              attack: unit.attack,
            })),
          },
        }
      }),
  ]
  const profile = profiles.find((card) => card.id === profileId)
  const profilePortrait = broadcastAssets.find(a => a.id ===
    (profile?.combat.combatants.find(enemy => enemy.portraitId)?.portraitId || profile?.portraitId))
  function choose(entry: DirectoryEntry) {
    setSelected(entry)
    if (entry.night?.combat) setProfileId(entry.night.id)
    else if (entry.encounter?.units.length) setProfileId(entry.id)
    else setProfileId('')
    const existing = p.cast.find(
      (person) => person.sourceId === entry.asset?.id,
    )
    setHp(existing?.maxHp || 10)
    setAc(existing?.ac || 10)
  }
  function addProfile(card: BattleProfile) {
    if (!card.combat) return
    const group = card.title
    const notes = [
      card.combat.enemyGoal,
      ...card.combat.tactics,
      `Moral: ${card.combat.morale}`,
      `Kaçış: ${card.combat.escape}`,
    ].join('\n')
    const fighters: BattleFighterDraft[] = []
    for (const enemy of card.combat.combatants) {
      const portraitId =
        enemy.portraitId ||
        (enemy.name === card.visibleName ? card.portraitId : '')
      const asset = broadcastAssets.find((asset) => asset.id === portraitId)
      for (let index = 0; index < enemy.count; index++) {
        const name = `${enemy.name}${enemy.count > 1 ? ` ${index + 1}` : ''}`
        const person = asset
          ? addPerson({ ...asset, name }, 'enemy')
          : undefined
        fighters.push({
          castId: person?.id || '',
          name,
          hp: enemy.hp,
          ac: enemy.ac,
          initiative: enemy.initiative,
          hidden: true,
          group,
          notes: `${enemy.attack}\n${notes}`,
        })
      }
    }
    onAdd(fighters)
    notify(
      `${fighters.length} düşman listeye gizli eklendi. Oyuncular görmeden hazırlayabilirsin.`,
    )
  }
  return (
    <section className="st-battle-preparation" data-testid="battle-preparation">
      <div className="st-battle-start">
        <span className="st-finder-eyebrow">1 · KARŞILAŞMAYI HAZIRLA</span>
        <h3>Önce kimler var?</h3>
        <p>
          Hazır bir yol karşılaşması seç veya aşağıdan bir kişi / yaratık bul.
          Kayıtları önceden “Kişiler” menüsüne eklemen gerekmez.
        </p>
      </div>
      <label className="st-field">
        <span>Hazır pusu ve canavar karşılaşmaları</span>
        <select
          value={profileId}
          onChange={(event) => setProfileId(event.target.value)}
        >
          <option value="">Bir karşılaşma seç…</option>
          <optgroup label="Hikâyenin içindeki karşılaşmalar">
            {profiles
              .filter((card) => card.id.startsWith('encounter-'))
              .map((card) => (
                <option key={card.id} value={card.id}>
                  {card.title} · {card.source}
                </option>
              ))}
          </optgroup>
          <optgroup label="Gece ve Yol · pusular / canavarlar">
            {profiles
              .filter((card) => !card.id.startsWith('encounter-'))
              .map((card) => (
                <option key={card.id} value={card.id}>
                  {card.title} ·{' '}
                  {placeById(card.locationId)?.name || 'Hardlane'}
                </option>
              ))}
          </optgroup>
        </select>
      </label>
      {error && (
        <p className="st-finder-warning">
          {error} Aşağıdan elle katılımcı ekleyebilirsin.
        </p>
      )}
      {profile?.combat && (
        <article className="st-battle-profile" data-testid="battle-profile">
          <div className="st-battle-profile-heading">
            {profilePortrait && (
              <img
                src={profilePortrait.src}
                alt=""
              />
            )}
            <div>
              <span className="st-finder-eyebrow">
                3 OYUNCU · 1. SEVİYE İÇİN DM KARTI
              </span>
              <h3>{profile.title}</h3>
              <p>{profile.combat.danger}</p>
              <small>{profile.source}</small>
            </div>
          </div>
          <dl>
            <div>
              <dt>Nerede / nasıl başlar?</dt>
              <dd>{profile.arrival}</dd>
            </div>
            <div>
              <dt>Oyuncular neyi fark edebilir?</dt>
              <dd>{profile.combat.telegraph}</dd>
            </div>
            <div>
              <dt>Düşman ne istiyor?</dt>
              <dd>{profile.combat.enemyGoal}</dd>
            </div>
          </dl>
          <ul>
            {profile.combat.combatants.map((enemy) => (
              <li key={enemy.id}>
                <strong>
                  {enemy.count} × {enemy.name}
                </strong>{' '}
                · Can {enemy.hp} · Zırh {enemy.ac}
                <small>{enemy.attack}</small>
              </li>
            ))}
          </ul>
          <details>
            <summary>DM için tur planı, moral ve çıkış yolları</summary>
            <ol>
              {profile.combat.tactics.map((tactic, index) => (
                <li key={index}>{tactic}</li>
              ))}
            </ol>
            <p>
              <strong>Geri çekilme / teslim:</strong> {profile.combat.morale}
            </p>
            <p>
              <strong>Partinin kaçışı:</strong> {profile.combat.escape}
            </p>
          </details>
          <button
            className="st-battle-primary"
            onClick={() => addProfile(profile)}
          >
            Karşılaşmanın düşmanlarını ekle · gizli
          </button>
        </article>
      )}
      <details className="st-battle-find" open={!profile}>
        <summary>İsmiyle kişi veya yaratık bul</summary>
        <StudioFinder
          entries={entries}
          onChoose={choose}
          peopleOnly
          label="Savaşa katılacak kişi veya yaratığı bul"
        />
      </details>
      {selected?.asset && !selected.night?.combat && !selected.encounter && (
        <article className="st-battle-selection">
          <img src={selected.asset.src} alt="" />
          <div>
            <h4>{selected.name}</h4>
            <p>
              {selected.who} · {selected.where}
            </p>
            <p className="st-muted">
              Aşağıdakiler düzenlenebilir başlangıç değerleridir; karaktere
              resmî bir savaş gücü atamaz.
            </p>
            <div className="st-three">
              <label className="st-field">
                <span>Başlangıç canı</span>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={hp}
                  onChange={(e) =>
                    setHp(
                      Math.max(1, Math.min(9999, Number(e.target.value) || 1)),
                    )
                  }
                />
              </label>
              <label className="st-field">
                <span>Zırh</span>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={ac}
                  onChange={(e) =>
                    setAc(
                      Math.max(1, Math.min(40, Number(e.target.value) || 1)),
                    )
                  }
                />
              </label>
              <label className="st-field">
                <span>Taraf</span>
                <select
                  value={side}
                  onChange={(e) => setSide(e.target.value as typeof side)}
                >
                  <option value="enemy">Düşman</option>
                  <option value="ally">Dost / NPC</option>
                </select>
              </label>
            </div>
            <div className="st-directory-actions">
              <button
                onClick={() => {
                  const existing = p.cast.find(
                    (c) => c.sourceId === selected.asset!.id,
                  )
                  const person = existing || addPerson(selected.asset!, side)
                  onAdd([
                    {
                      castId: person.id,
                      name: person.knownName || selected.name,
                      hp,
                      ac,
                      initiative: 0,
                      hidden: side === 'enemy',
                      notes: '',
                      group: side === 'enemy' ? 'Düşmanlar' : 'Dostlar',
                    },
                  ])
                  notify(`${selected.name} savaş listesine eklendi.`)
                }}
              >
                Katılımcıyı ekle{side === 'enemy' ? ' · gizli' : ''}
              </button>
              <button
                onClick={() => {
                  addAsset(selected.asset!, 'portrait')
                  notify('Portre hazırlık ekranına eklendi.')
                }}
              >
                Portreyi hazırlığa ekle
              </button>
            </div>
          </div>
        </article>
      )}
      {!!p.cast.filter((person) => person.kind === 'party').length && (
        <div className="st-battle-party">
          <h4>Oyuncu karakterlerin</h4>
          <div>
            {p.cast
              .filter((person) => person.kind === 'party')
              .map((person) => (
                <button
                  key={person.id}
                  disabled={p.encounter.items.some(
                    (item) => item.castId === person.id,
                  )}
                  onClick={() =>
                    onAdd([
                      {
                        castId: person.id,
                        name: person.knownName || 'Oyuncu',
                        hp: person.hp,
                        ac: person.ac,
                        initiative: 0,
                        hidden: false,
                        notes: '',
                        group: 'Parti',
                      },
                    ])
                  }
                >
                  {person.src && <img src={person.src} alt="" />}
                  {person.knownName || 'Oyuncu'}{' '}
                  {p.encounter.items.some((item) => item.castId === person.id)
                    ? '· listede'
                    : '· ekle'}
                </button>
              ))}
          </div>
        </div>
      )}
    </section>
  )
}
