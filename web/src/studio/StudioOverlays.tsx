import { useEffect, useState } from 'react'
import type { StudioPublic, StudioRoll } from './types'
import { StudioDie } from '../BroadcastDice'
export function StudioRollDisplay({ roll }: { roll: StudioRoll }) {
  const [settled, setSettled] = useState('')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    const t = setTimeout(() => setSettled(roll.id), reduced ? 0 : 1150)
    return () => clearTimeout(t)
  }, [roll.id, reduced])
  const rolling = !reduced && settled !== roll.id && Date.now() - roll.at < 1200
  const natural =
    roll.terms.length === 1 &&
    roll.terms[0].sides === 20 &&
    (roll.terms[0].values.length === 1 || roll.terms[0].used !== null)
      ? roll.terms[0].used === null
        ? roll.terms[0].values[0]
        : roll.terms[0].values[roll.terms[0].used]
      : null
  return (
    <div
      className="studio-roll"
      data-testid="studio-roll"
      data-roll-id={roll.id}
    >
      <span>
        {roll.who}
        {roll.who && roll.label ? ' · ' : ''}
        {roll.label}
      </span>
      {!roll.onlyTotal && (
        <>
          <div className="studio-roll-dice">
            {roll.terms.flatMap((term, t) =>
              term.values.map((value, i) => (
                <div
                  key={`${t}-${i}`}
                  className={
                    term.used !== null && term.used !== i ? 'discarded' : ''
                  }
                >
                  <StudioDie
                    sides={term.sides}
                    value={value}
                    rolling={rolling}
                    index={i}
                  />
                </div>
              )),
            )}
          </div>
          <small>
            {roll.expression}{' '}
            {roll.mode === 'advantage'
              ? '· Avantaj'
              : roll.mode === 'disadvantage'
                ? '· Dezavantaj'
                : ''}
          </small>
        </>
      )}
      <strong>{rolling ? '…' : roll.total}</strong>
      {!rolling && roll.critical && (natural === 20 || natural === 1) && (
        <em>Doğal {natural}</em>
      )}
    </div>
  )
}
export default function StudioOverlays({ studio }: { studio?: StudioPublic }) {
  if (!studio) return null
  return (
    <>
      {studio.weather !== 'none' && (
        <div
          className={`studio-weather ${studio.weather}`}
          aria-hidden="true"
        />
      )}
      {studio.cameraSlots > 0 && (
        <div
          className={`studio-camera-slots layout-${studio.layout}`}
          aria-hidden="true"
        >
          {Array.from({ length: studio.cameraSlots }, (_, i) => (
            <div key={i}>
              <span />
            </div>
          ))}
        </div>
      )}
      {studio.combat && (
        <div
          className="studio-combat-overlay"
          data-testid="studio-combat-overlay"
        >
          {studio.combat.showRound && <span>Tur {studio.combat.round}</span>}
          {studio.combat.items
            .filter((i) => studio.combat!.showOrder || i.active)
            .map((item) => (
              <div key={item.id} className={item.active ? 'active' : ''}>
                <strong>{item.name}</strong>
                {item.hpText && <small>{item.hpText}</small>}
                {item.percent !== undefined && (
                  <meter value={item.percent} min="0" max="100" />
                )}
                {item.conditions.length > 0 && (
                  <small>{item.conditions.join(' · ')}</small>
                )}
                {item.concentration && <small>Konsantrasyon</small>}
              </div>
            ))}
        </div>
      )}
      {studio.roll && <StudioRollDisplay roll={studio.roll} />}{' '}
      {studio.reveal && (
        <div className="studio-image-reveal" data-testid="studio-image-reveal">
          <img src={studio.reveal.src} alt={studio.reveal.name} />
          <span>{studio.reveal.name}</span>
        </div>
      )}
      {studio.poll && (
        <div className="studio-poll-overlay">
          <strong>{studio.poll.title}</strong>
          {studio.poll.options.map((o) => (
            <div key={o.id}>
              <span>{o.label}</span>
              <b>{o.votes}</b>
            </div>
          ))}
          <small>{studio.poll.open ? 'Oylama açık' : 'Oylama kapandı'}</small>
        </div>
      )}
    </>
  )
}
