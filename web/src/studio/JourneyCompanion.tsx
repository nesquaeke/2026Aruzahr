import { useState } from 'react'
import { Check, Download, Eye, Pin, RotateCcw, Users, X } from 'lucide-react'
import { broadcastAssets } from '../BroadcastLibrary'
import type {
  DMPack,
  DMProgress,
  DMQuest,
  DMScene,
  DMSideEvent,
} from '../dm-guide'
import './journey-companion.css'

type Props = {
  mode: 'events' | 'people' | 'summary'
  pack: DMPack
  quest: DMQuest
  sceneId: string
  opening: boolean
  progress: DMProgress
  onProgress: (next: DMProgress) => void
  onShow?: (scene: DMScene, questId: string) => Promise<string | null>
  canShow?: boolean
}

const asset = (id?: string) => broadcastAssets.find((item) => item.id === id)

/** The operator-only dossier never travels with the public scene cue. */
function eventCue(event: DMSideEvent): DMScene | undefined {
  const background = asset(event.backgroundId)
  if (!background || background.kind !== 'scene') return
  return {
    id: 'journey-event:' + event.id,
    title: background.name,
    publicTitle: background.name,
    backgroundId: background.id,
    portraitIds: event.castIds.filter((id) => asset(id)?.kind === 'portrait'),
    summary: '',
    readAloud: '',
    checks: [],
    actions: [],
    choices: [],
  }
}

function downloadSummary(pack: DMPack, progress: DMProgress, opening: boolean) {
  const current = pack.quests.find((q) => q.id === progress.quest)
  const scene = opening
    ? undefined
    : current?.steps?.[progress.steps[progress.quest] || 0]
  const lines = [
    '# Özel DM oturum özeti',
    '',
    pack.title,
    '',
    `Kaldığın bölüm: ${current?.title || 'Henüz seçilmedi'}`,
    `Kaldığın adım: ${scene?.title || 'Bölüm başlangıcı'}`,
    '',
    'Bu dosya bölüm kararlarını ve yan olay notlarını içerir.',
    '',
  ]
  for (const q of pack.quests) {
    const events = (q.events || []).filter(
      (e) => progress.eventChoices?.[e.id] || progress.eventNotes?.[e.id],
    )
    if (
      !progress.decisions[q.id] &&
      !progress.done.includes(q.id) &&
      !events.length
    )
      continue
    lines.push(
      '## ' + q.title,
      '',
      progress.done.includes(q.id)
        ? 'Durum: tamamlandı olarak işaretli'
        : 'Durum: açık',
      '',
    )
    if (progress.decisions[q.id])
      lines.push('Bölüm kararı:', progress.decisions[q.id], '')
    for (const e of events) {
      const choice = e.choices.find(
        (c) => c.id === progress.eventChoices?.[e.id],
      )
      lines.push('### ' + e.title, '')
      if (choice)
        lines.push(
          'Kaydedilen seçim: ' + choice.label,
          '',
          choice.result,
          '',
          'Daha sonra: ' + choice.echo,
          '',
          'Hatırlatma: ' + e.followup.reminder,
          '',
        )
      if (progress.eventNotes?.[e.id])
        lines.push('DM notu:', progress.eventNotes[e.id], '')
    }
  }
  const people = pack.quests.flatMap((q) => q.dossiers || [])
  const pinned = people.filter(
    (p, i) =>
      progress.pinnedPeople?.includes(p.id) &&
      people.findIndex((other) => other.id === p.id) === i,
  )
  if (pinned.length)
    lines.push(
      '## El altında tutulan kişiler',
      '',
      ...pinned.map((p) => `- ${p.name} — ${p.role}`),
      '',
    )
  const url = URL.createObjectURL(
    new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = 'Aruzahr-Ozel-DM-Oturum-Ozeti.md'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function JourneyCompanion({
  mode,
  pack,
  quest,
  sceneId,
  opening,
  progress,
  onProgress,
  onShow,
  canShow = true,
}: Props) {
  const [selectedPerson, setSelectedPerson] = useState('')
  const [showing, setShowing] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    id: string
    message: string
  } | null>(null)
  const allEvents = pack.quests.flatMap((q) =>
    (q.events || []).map((event) => ({ event, source: q })),
  )
  const allPeople = pack.quests
    .flatMap((q) => q.dossiers || [])
    .filter(
      (p, i, people) => people.findIndex((other) => other.id === p.id) === i,
    )
  const visibleEvents = opening
    ? []
    : (quest.events || []).filter((e) => e.at === sceneId)
  const memories = allEvents.flatMap(({ event, source }) => {
    if (
      event.followup.questId !== quest.id ||
      (!opening && event.followup.sceneId !== sceneId)
    )
      return []
    const choice = event.choices.find(
      (c) => c.id === progress.eventChoices?.[event.id],
    )
    return choice ? [{ event, source, choice }] : []
  })
  const pinnedPeople = allPeople.filter((p) =>
    progress.pinnedPeople?.includes(p.id),
  )
  const localPeople = quest.dossiers || []
  const people = [...localPeople, ...pinnedPeople].filter(
    (p, i, items) => items.findIndex((other) => other.id === p.id) === i,
  )
  const currentScene = quest.steps?.find((step) => step.id === sceneId)
  const currentIds = new Set([
    ...(opening
      ? quest.briefing?.portraitIds || []
      : currentScene?.portraitIds || []),
    ...visibleEvents.flatMap((event) => event.castIds),
  ])
  const currentPeople = localPeople.filter((p) =>
    currentIds.has(p.portraitId || p.id),
  )
  const carriedPeople = pinnedPeople.filter(
    (p) => !currentPeople.some((current) => current.id === p.id),
  )
  const otherPeople = localPeople.filter(
    (p) =>
      !currentPeople.some((current) => current.id === p.id) &&
      !carriedPeople.some((carried) => carried.id === p.id),
  )
  const person = people.find((p) => p.id === selectedPerson)

  function choose(event: DMSideEvent, id?: string) {
    const eventChoices = { ...progress.eventChoices }
    if (id) eventChoices[event.id] = id
    else delete eventChoices[event.id]
    onProgress({ ...progress, eventChoices })
  }
  function pin(id: string) {
    const pinned = progress.pinnedPeople || []
    onProgress({
      ...progress,
      pinnedPeople: pinned.includes(id)
        ? pinned.filter((p) => p !== id)
        : [...pinned, id],
    })
  }
  async function show(event: DMSideEvent) {
    const cue = eventCue(event)
    if (!cue || !onShow || showing) return
    setShowing(event.id)
    setFeedback(null)
    try {
      const key = await onShow(cue, quest.id)
      setFeedback({
        id: event.id,
        message: key
          ? 'Olayın manzarası ve seçili portreleri gönderildi.'
          : 'Gösterilemedi. Yayın bağlantısını kontrol edip yeniden dene.',
      })
    } catch {
      setFeedback({
        id: event.id,
        message: 'Gösterilemedi. Yayın bağlantısını kontrol edip yeniden dene.',
      })
    } finally {
      setShowing(null)
    }
  }

  const renderPerson = (p: (typeof people)[number]) => {
    const portrait = asset(p.portraitId || p.id)
    return (
      <button
        type="button"
        key={p.id}
        className={selectedPerson === p.id ? 'active' : ''}
        aria-pressed={selectedPerson === p.id}
        onClick={() => setSelectedPerson(selectedPerson === p.id ? '' : p.id)}
      >
        {portrait ? (
          <img src={portrait.src} alt="" loading="lazy" />
        ) : (
          <span className="journey-person-placeholder">
            <Users size={20} />
          </span>
        )}
        <span>
          <strong>{p.name}</strong>
          <small>{p.role}</small>
        </span>
        {progress.pinnedPeople?.includes(p.id) && (
          <Pin className="journey-pin-indicator" size={11} />
        )}
      </button>
    )
  }

  if (mode === 'summary')
    return (
      <button
        type="button"
        className="journey-summary-button"
        onClick={() => downloadSummary(pack, progress, opening)}
      >
        <Download size={13} />
        Özel oturum özetini indir
      </button>
    )

  if (mode === 'people') {
    if (!people.length) return null
    return (
      <section
        className="journey-people"
        data-testid="journey-people"
        aria-label="Bölümün kişi rehberi"
      >
        <div className="journey-section-label">
          <Users size={14} />
          <span>KİM KİMDİR?</span>
          <small>Bu bölümde {localPeople.length} kişi</small>
        </div>
        <p className="journey-small">
          Birini seç; ne bildiği ve nasıl konuştuğu elinin altında olsun.
        </p>
        {currentPeople.length > 0 && (
          <div className="journey-person-group">
            <span>BU ADIMA BAĞLI KİŞİLER</span>
            <div className="journey-person-grid">
              {currentPeople.map(renderPerson)}
            </div>
          </div>
        )}
        {carriedPeople.length > 0 && (
          <div className="journey-person-group">
            <span>EL ALTINDA TUTTUKLARIN</span>
            <div className="journey-person-grid">
              {carriedPeople.map(renderPerson)}
            </div>
          </div>
        )}
        {otherPeople.length > 0 && (
          <details className="journey-other-people">
            <summary>Bölümdeki diğer kişiler · {otherPeople.length}</summary>
            <div className="journey-person-grid">
              {otherPeople.map(renderPerson)}
            </div>
          </details>
        )}
        {person && (
          <article
            className="journey-person-dossier"
            data-testid="journey-person-dossier"
            key={person.id}
          >
            <header>
              <h4>{person.name}</h4>
              <button
                type="button"
                aria-label="Kişi rehberini kapat"
                onClick={() => setSelectedPerson('')}
              >
                <X size={14} />
              </button>
            </header>
            <p>{person.appearance}</p>
            <dl>
              <dt>Ne istiyor?</dt>
              <dd>{person.wants}</dd>
              <dt>Ne biliyor?</dt>
              <dd>{person.knows}</dd>
              <dt>Nasıl konuştururum?</dt>
              <dd>{person.voice}</dd>
            </dl>
            <details>
              <summary>Sorarlarsa ne söyler?</summary>
              {person.lines.map((line, i) => (
                <div key={i}>
                  <strong>{line.cue}</strong>
                  <blockquote>{line.line}</blockquote>
                </div>
              ))}
            </details>
            <button
              type="button"
              className="journey-pin"
              aria-pressed={!!progress.pinnedPeople?.includes(person.id)}
              onClick={() => pin(person.id)}
            >
              <Pin size={12} />
              {progress.pinnedPeople?.includes(person.id)
                ? 'El altında tutuluyor · bırak'
                : 'Diğer bölümlerde de el altında tut'}
            </button>
          </article>
        )}
      </section>
    )
  }

  if (!visibleEvents.length && !memories.length) return null
  return (
    <section
      className="journey-events"
      data-testid="journey-events"
      aria-label="Yan olaylar ve önceki kararlar"
    >
      {memories.map(({ event, source, choice }) => (
        <details
          className="journey-memory"
          key={'memory:' + event.id}
          data-testid="journey-memory"
        >
          <summary>
            <span className="journey-memory-dot" />
            Önceki söz burada karşılık bulabilir<span>{source.title}</span>
          </summary>
          <p>
            <strong>{event.title}</strong> · {choice.label}
          </p>
          <p>{event.followup.reminder}</p>
          <p className="journey-echo">{choice.echo}</p>
          {progress.eventNotes?.[event.id] && (
            <blockquote>{progress.eventNotes[event.id]}</blockquote>
          )}
        </details>
      ))}
      {visibleEvents.map((event) => {
        const choice = event.choices.find(
          (c) => c.id === progress.eventChoices?.[event.id],
        )
        const scene = asset(event.backgroundId)
        return (
          <details
            className="journey-event"
            key={event.id}
            data-testid="journey-event"
          >
            <summary>
              <span>
                <small>İSTEĞE BAĞLI · {event.duration}</small>
                <strong>{event.title}</strong>
              </span>
              {choice && <Check size={16} />}
            </summary>
            <div className="journey-event-content">
              <p className="journey-event-hook">{event.hook}</p>
              <p className="journey-small">
                Vakit ve ilgi varsa oynat. Ana yolculuğa devam etmek için bunu
                tamamlamak gerekmez.
              </p>
              {scene && (
                <div className="journey-event-visual">
                  <img src={scene.src} alt={scene.name} loading="lazy" />
                  <div>
                    <strong>{scene.name}</strong>
                    {onShow && (
                      <button
                        type="button"
                        disabled={!canShow || !!showing}
                        onClick={() => void show(event)}
                      >
                        <Eye size={14} />
                        {showing === event.id
                          ? 'Gönderiliyor…'
                          : 'Olayın görselini göster'}
                      </button>
                    )}
                    <small>
                      Manzara ve portreler gönderilir; bu notlar görünmez.
                    </small>
                  </div>
                </div>
              )}
              {feedback?.id === event.id && (
                <p role="status" className="journey-event-feedback">
                  {feedback.message}
                </p>
              )}
              <span className="journey-read-label">OYUNCULARA OKU</span>
              <blockquote className="journey-event-speech">
                {event.readAloud}
              </blockquote>
              <ol className="journey-event-beats">
                {event.beats.map((beat, i) => (
                  <li key={i}>
                    <strong>{beat.title}</strong>
                    <p>{beat.text}</p>
                    {beat.line && <blockquote>{beat.line}</blockquote>}
                  </li>
                ))}
              </ol>
              {event.checks.length > 0 && (
                <details>
                  <summary>Zar gerekirse</summary>
                  {event.checks.map((check, i) => (
                    <p key={i}>{check}</p>
                  ))}
                </details>
              )}
              <div className="journey-event-choices">
                <h4>Masada hangi yol seçildi?</h4>
                <p className="journey-small">
                  Seçimi işaretlemek yalnızca DM kaydını tutar.
                </p>
                {event.choices.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    aria-pressed={choice?.id === c.id}
                    onClick={() => choose(event, c.id)}
                  >
                    {choice?.id === c.id && <Check size={13} />}
                    <span>{c.label}</span>
                  </button>
                ))}
                {choice && (
                  <div
                    className="journey-choice-result"
                    data-testid="journey-choice-result"
                  >
                    <p>{choice.result}</p>
                    <details>
                      <summary>Sonraki durağa yankısı</summary>
                      <p>{choice.echo}</p>
                    </details>
                    <button
                      type="button"
                      className="journey-choice-clear"
                      onClick={() => choose(event)}
                    >
                      <RotateCcw size={11} />
                      Seçimi temizle
                    </button>
                  </div>
                )}
              </div>
              <details className="journey-event-note">
                <summary>
                  Bu olaya özel not ekle
                  {progress.eventNotes?.[event.id] ? ' · kayıtlı' : ''}
                </summary>
                <label>
                  Senin masanda ne oldu?
                  <textarea
                    aria-label={event.title + ' DM notu'}
                    maxLength={6000}
                    value={progress.eventNotes?.[event.id] || ''}
                    onChange={(e) =>
                      onProgress({
                        ...progress,
                        eventNotes: {
                          ...progress.eventNotes,
                          [event.id]: e.target.value,
                        },
                      })
                    }
                  />
                </label>
              </details>
            </div>
          </details>
        )
      })}
    </section>
  )
}
