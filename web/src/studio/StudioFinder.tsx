import { useEffect, useMemo, useState } from 'react'
import { Search, MapPin, Users, Swords, X } from 'lucide-react'
import { broadcastAssets, type BroadcastAsset } from '../BroadcastLibrary'
import { normalize, locationById, regionById } from '../data'
import { characters } from '../lore/characters'
import { loadNightEncounters, type NightEncounter } from '../night-encounters'
import { readPrivatePack, type DMPack, type DMEncounter } from '../dm-guide'
import { loadBuiltinCampaign } from '../builtin-campaign'
import { useStudio } from './context'
import './studio-finder.css'

export type DirectoryEntry = {
  id: string
  name: string
  who: string
  where: string
  source: string
  asset?: BroadcastAsset
  locationId?: string
  type: 'person' | 'place' | 'encounter'
  search: string
  night?: NightEncounter
  questId?: string
  stepId?: string
  encounter?: DMEncounter
}

export function buildStudioDirectory(
  customAssets: BroadcastAsset[],
  cards: NightEncounter[] = [],
  campaign: DMPack | null = null,
): DirectoryEntry[] {
  const nightByPortrait = new Map(cards.map((card) => [card.portraitId, card]))
  const opponentPortraits = new Set(cards.flatMap(card =>
    (card.combat?.combatants || []).map(enemy => enemy.portraitId)
      .filter((id): id is string => !!id && !nightByPortrait.has(id))))
  const seen = new Set<string>()
  const entries: DirectoryEntry[] = [
    ...broadcastAssets,
    ...customAssets,
  ].flatMap((asset) => {
    if (seen.has(asset.id) || opponentPortraits.has(asset.id)) return []
    seen.add(asset.id)
    const person = characters.find((person) => person.id === asset.id)
    const card = nightByPortrait.get(asset.id)
    const city = locationById(
      card?.locationId || asset.locationId || person?.city || '',
    )
    const where =
      city?.name ||
      regionById(person?.region || '')?.name ||
      (asset.id.startsWith('night-')
        ? 'Hardlane · Kemiğe Basan Yol'
        : 'Yer atanmamış')
    const type =
      card || (asset.id.startsWith('night-') && asset.kind === 'portrait')
        ? 'encounter'
        : asset.kind === 'portrait'
          ? 'person'
          : 'place'
    const who =
      card?.title ||
      person?.role ||
      (type === 'encounter'
        ? 'Gece ve yol karşılaşması'
        : type === 'person'
          ? 'Portre · henüz bir göreve bağlanmamış'
          : asset.kind === 'scene'
            ? 'Şehir veya mekân sahnesi'
            : 'Yerel görsel')
    const source = card
      ? 'Gece ve Yol kartları · koşula bağlı karşılaşma'
      : person
        ? 'Karakter ansiklopedisi'
        : customAssets.some((a) => a.id === asset.id)
          ? 'Senin yüklediğin görsel'
          : type === 'encounter'
            ? 'Gece ve Yol kartları'
            : 'Aruzahr görsel arşivi'
    return [
      {
        id: asset.id,
        name: asset.name,
        who,
        where,
        source,
        asset,
        locationId: city?.id,
        type,
        night: card,
        search: normalize(
          [
            asset.name,
            who,
            where,
            source,
            person?.affiliation,
            card?.arrival,
            card?.continuation,
            card?.combat?.combatants.map((unit) => unit.name).join(' '),
          ]
            .filter(Boolean)
            .join(' '),
        ),
      } satisfies DirectoryEntry,
    ]
  })
  for (const card of cards) {
    for (const enemy of card.combat?.combatants || []) {
      if (enemy.name === card.visibleName) continue
      const asset = [...broadcastAssets, ...customAssets].find(
        (asset) => asset.id === enemy.portraitId,
      )
      const where =
        locationById(card.locationId)?.name || 'Hardlane · Kemiğe Basan Yol'
      const source = `Gece ve Yol → ${card.title}`
      entries.push({
        id: `night-opponent-${card.id}-${enemy.id}`,
        name: enemy.name,
        who: 'Yol karşılaşmasındaki düşman / yaratık',
        where,
        source,
        asset,
        locationId: locationById(card.locationId)?.id,
        type: 'encounter',
        night: card,
        search: normalize(
          `${enemy.name} ${card.title} ${where} pusu düşman yaratık`,
        ),
      })
    }
  }
  for (const [index, quest] of (campaign?.quests || []).entries()) {
    const where =
      locationById(quest.location || '')?.name || quest.location || 'Yolculuk'
    for (const dossier of quest.dossiers || []) {
      const asset = [...broadcastAssets, ...customAssets].find(
        (asset) => asset.id === dossier.portraitId,
      )
      const step = quest.steps?.find((step) =>
        step.portraitIds.includes(dossier.portraitId || ''),
      )
      const event = quest.events?.find(event=>event.castIds.includes(dossier.id))
      const eventStep = quest.steps?.find(step=>step.id === event?.at)
      const source = `Bölüm ${index + 1} · ${quest.title}${step ? ` → ${step.title}` : event ? ` → ${eventStep?.title || 'Yol üzerindeki olay'} → İsteğe bağlı: ${event.title}` : ' · bölüm kişi kartı'}`
      entries.push({
        id: `dossier-${quest.id}-${dossier.id}`,
        name: dossier.name,
        who: dossier.role,
        where,
        source,
        asset,
        locationId: locationById(quest.location || '')?.id,
        type: 'person',
        questId: quest.id,
        stepId: step?.id || event?.at,
        search: normalize(`${dossier.name} ${dossier.role} ${where} ${source}`),
      })
    }
    for (const step of quest.steps || []) {
      const background = [...broadcastAssets, ...customAssets].find(asset=>asset.id === step.backgroundId)
      const sceneSource = `Bölüm ${index + 1} · ${quest.title} → ${step.title}`
      entries.push({id:`scene-${quest.id}-${step.id}`,name:step.publicTitle || step.title,who:`Görev mekânı · ${step.title}`,where,source:sceneSource,asset:background,locationId:locationById(quest.location || '')?.id,type:'place',questId:quest.id,stepId:step.id,search:normalize(`${step.publicTitle} ${step.title} ${where} ${sceneSource}`)})
      const encounter = step.play?.encounter
      if (!encounter) continue
      const asset =
        [...broadcastAssets, ...customAssets].find(
          (asset) => asset.id === encounter.artId,
        ) ||
        [...broadcastAssets, ...customAssets].find(
          (asset) => asset.id === step.backgroundId,
        )
      const source = `Bölüm ${index + 1} · ${quest.title} → ${step.title}`
      entries.push({
        id: `encounter-${quest.id}-${step.id}`,
        name: encounter.name,
        who:
          encounter.kind === 'combat'
            ? 'Hikâyedeki savaş karşılaşması'
            : encounter.kind === 'pursuit'
              ? 'Hikâyedeki takip / kaçış'
              : 'Hikâyedeki çevre tehlikesi',
        where,
        source,
        asset,
        locationId: locationById(quest.location || '')?.id,
        type: 'encounter',
        questId: quest.id,
        stepId: step.id,
        encounter,
        search: normalize(
          `${encounter.name} ${encounter.units.map((unit) => unit.name).join(' ')} ${where} ${source}`,
        ),
      })
    }
    for(const event of quest.events || []){
      const asset=[...broadcastAssets,...customAssets].find(asset=>asset.id === event.backgroundId)
      const at=quest.steps?.find(step=>step.id === event.at)
      const source=`Bölüm ${index+1} · ${quest.title} → ${at?.title || 'Yolculuk'} → İsteğe bağlı: ${event.title}`
      entries.push({id:`event-${quest.id}-${event.id}`,name:event.title,who:'İsteğe bağlı yan olayın mekânı',where,source,asset,locationId:locationById(quest.location || '')?.id,type:'place',questId:quest.id,stepId:event.at,search:normalize(`${event.title} ${where} ${source}`)})
    }
  }
  return entries
}

export function useStudioDirectory() {
  const { p } = useStudio()
  const [cards, setCards] = useState<NightEncounter[]>([])
  const [campaign, setCampaign] = useState<DMPack | null>(() =>
    readPrivatePack(),
  )
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    loadNightEncounters()
      .then((value) => {
        if (active) setCards(value)
      })
      .catch((error) => {
        if (active)
          setError(
            error instanceof Error ? error.message : 'Yol kartları açılamadı.',
          )
      })
    return () => {
      active = false
    }
  }, [])
  useEffect(() => {
    let active = true
    const refresh = () => {
      const saved = readPrivatePack()
      if (saved) setCampaign(saved)
    }
    window.addEventListener('studio-dm-change', refresh)
    if (!readPrivatePack())
      loadBuiltinCampaign()
        .then((pack) => {
          if (active) setCampaign(readPrivatePack() || pack)
        })
        .catch(() => {})
    return () => {
      active = false
      window.removeEventListener('studio-dm-change', refresh)
    }
  }, [])
  const entries = useMemo(
    () => buildStudioDirectory(p.imageAssets, cards, campaign),
    [p.imageAssets, cards, campaign],
  )
  return { entries, cards, campaign, error }
}

export function StudioFinder({
  entries,
  onChoose,
  peopleOnly = false,
  label = 'Kişi, yer ve karşılaşma bul',
}: {
  entries: DirectoryEntry[]
  onChoose: (entry: DirectoryEntry) => void
  peopleOnly?: boolean
  label?: string
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [limit, setLimit] = useState(12)
  const needle = normalize(query.trim())
  const words = needle.split(/\s+/).filter(Boolean)
  const relevance = (entry: DirectoryEntry) =>
    (needle && normalize(entry.name) === needle ? 100 : 0) +
    (needle && normalize(entry.name).startsWith(needle) ? 30 : 0) +
    (entry.questId ? 3 : 0) +
    (entry.type === 'encounter' ? 2 : 0)
  const matches = entries
    .filter(
      (entry) =>
        (!peopleOnly || entry.type !== 'place') &&
        (filter === 'all' || entry.type === filter) &&
        words.every((word) => entry.search.includes(word)),
    )
    .sort(
      (a, b) =>
        relevance(b) - relevance(a) || a.name.localeCompare(b.name, 'tr'),
    )
  return (
    <section
      className="st-finder"
      data-testid="studio-finder"
      aria-label={label}
    >
      <header>
        <span className="st-finder-eyebrow">TEK YERDEN BUL</span>
        <h3>{label}</h3>
        <p>
          İsim, şehir, görev veya yaratık yaz. Bir kartı seçerek kim olduğunu ve
          nerede kullanılacağını gör.
        </p>
      </header>
      <label className="st-finder-search">
        <Search size={17} />
        <input
          type="search"
          aria-label={label}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setLimit(12)
          }}
          placeholder="Ulven, Marhalden, nöbetçi, canavar…"
        />
        {query && (
          <button aria-label="Aramayı temizle" onClick={() => setQuery('')}>
            <X size={15} />
          </button>
        )}
      </label>
      <div className="st-finder-tabs" role="group" aria-label="Arama türü">
        {[
          ['all', 'Hepsi'],
          ['person', 'Kişiler'],
          ['encounter', 'Karşılaşmalar'],
          ...(!peopleOnly ? [['place', 'Yerler']] : []),
        ].map(([id, title]) => (
          <button
            key={id}
            aria-pressed={filter === id}
            onClick={() => {
              setFilter(id)
              setLimit(12)
            }}
          >
            {title}
          </button>
        ))}
      </div>
      <p className="st-finder-count" role="status">
        {matches.length} sonuç · seçim hazırlığı değiştirmez
      </p>
      <div className="st-finder-results">
        {matches.slice(0, limit).map((entry) => (
          <button
            key={entry.id}
            className="st-finder-result"
            data-directory-id={entry.id}
            onClick={() => onChoose(entry)}
          >
            {entry.asset ? (
              <img src={entry.asset.src} alt="" loading="lazy" />
            ) : (
              <span className="st-finder-initial">{entry.name.charAt(0)}</span>
            )}
            <span>
              <strong>{entry.name}</strong>
              <small>{entry.who}</small>
              <em>
                <MapPin size={11} />
                {entry.where}
              </em>
              {entry.questId && (
                <small className="st-finder-source">{entry.source}</small>
              )}
            </span>
            {entry.type === 'encounter' ? (
              <Swords size={15} />
            ) : entry.type === 'person' ? (
              <Users size={15} />
            ) : (
              <MapPin size={15} />
            )}
          </button>
        ))}
      </div>
      {!matches.length && (
        <p className="st-finder-empty">
          Bu adla bir kayıt bulunamadı. Filtreyi “Hepsi” yap veya daha kısa bir
          ad dene.
        </p>
      )}
      {matches.length > limit && (
        <button className="st-finder-more" onClick={() => setLimit(limit + 24)}>
          Diğer sonuçlar · {Math.min(limit, matches.length)} / {matches.length}
        </button>
      )}
    </section>
  )
}

export function StudioDirectory() {
  const { entries, error } = useStudioDirectory()
  const { addAsset, draft, setPanel, notify } = useStudio()
  const [selected, setSelected] = useState<DirectoryEntry>()
  const asset = selected?.asset
  return (
    <div className="st-directory" data-testid="studio-directory">
      <StudioFinder entries={entries} onChoose={setSelected} />
      {error && (
        <p className="st-finder-warning">
          {error} Görsel arşivinde arama yapabilirsin.
        </p>
      )}
      {selected && (
        <article
          className={`st-directory-detail${asset ? '' : ' no-art'}`}
          data-testid="studio-directory-detail"
        >
          {asset && <img src={asset.src} alt={selected.name} />}
          <div>
            <span className="st-finder-eyebrow">SEÇİLEN KAYIT</span>
            <h3>{selected.name}</h3>
            <p>{selected.who}</p>
            <dl>
              <div>
                <dt>Nerede?</dt>
                <dd>{selected.where}</dd>
              </div>
              <div>
                <dt>Nereden geliyor?</dt>
                <dd>{selected.source}</dd>
              </div>
            </dl>
            {selected.night && (
              <p className="st-directory-use">
                <strong>Ne zaman kullanılır?</strong> {selected.night.arrival}
              </p>
            )}
            {selected.encounter && (
              <p className="st-directory-use">
                <strong>Nasıl başlar?</strong> {selected.encounter.trigger}
              </p>
            )}
            <p className="st-muted">
              Bu düğmeler hazırlık ekranını değiştirir. İzleyiciler için üstteki
              “Yayına al” düğmesini kullan.
            </p>
            <div className="st-directory-actions">
              {asset && (
                <button
                  onClick={() => {
                    addAsset(
                      asset,
                      asset.kind === 'portrait' ? 'portrait' : 'background',
                    )
                    notify(`${asset.name} hazırlığa alındı.`)
                  }}
                >
                  {asset.kind === 'portrait'
                    ? 'Portreyi hazırlığa ekle'
                    : 'Mekânı hazırlığa al'}
                </button>
              )}
              {asset && (
                <button
                  onClick={() => {
                    addAsset(asset, 'reveal')
                    notify(
                      'Büyük görsel hazırlıkta açıldı; Yayına al ile yayınlanır.',
                    )
                  }}
                >
                  Büyük görseli hazırla
                </button>
              )}
              {selected.locationId && (
                <button
                  onClick={() => {
                    const city = locationById(selected.locationId!)
                    if (city?.point) {
                      draft({
                        mode: 'map',
                        camera: { x: city.point[0], y: city.point[1], zoom: 6 },
                      })
                      notify(`${city.name} haritada hazırlığa alındı.`)
                    }
                  }}
                >
                  Haritada konumu hazırla
                </button>
              )}
              {selected.night?.combat && (
                <button
                  onClick={() => {
                    sessionStorage.setItem(
                      'aruzahr-combat-card-request',
                      selected.night!.id,
                    )
                    setPanel('combat')
                  }}
                >
                  Savaş kartını aç
                </button>
              )}
              {selected.night && (
                <button
                  onClick={() => {
                    sessionStorage.setItem(
                      'aruzahr-night-card-request',
                      selected.night!.id,
                    )
                    setPanel('quests')
                    window.dispatchEvent(
                      new CustomEvent('studio-open-night-card', {
                        detail: { id: selected.night!.id },
                      }),
                    )
                  }}
                >
                  Gece ve Yol kartını aç
                </button>
              )}
              {selected.questId && (
                <button
                  onClick={() => {
                    const request = {
                      questId: selected.questId,
                      stepId: selected.stepId,
                    }
                    sessionStorage.setItem(
                      'aruzahr-dm-scene-request',
                      JSON.stringify(request),
                    )
                    setPanel('quests')
                    window.dispatchEvent(
                      new CustomEvent('studio-open-dm-scene', {
                        detail: request,
                      }),
                    )
                  }}
                >
                  İlgili görev sahnesini aç
                </button>
              )}
            </div>
          </div>
        </article>
      )}
    </div>
  )
}
