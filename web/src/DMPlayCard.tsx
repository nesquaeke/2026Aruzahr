import type { DMPlay } from './dm-guide'
import { artworkFor } from './media'
import './dm-play.css'

export default function DMPlayCard({
  value,
  onGo,
}: {
  value: DMPlay
  onGo?: (id: string) => void
}) {
  const e = value.encounter
  const art = e?.artId ? artworkFor(e.artId) : undefined
  return (
    <section className="dm-play" data-testid="dm-play-card">
      <div className="dm-play-tempo">
        <span>MASADA {value.duration}</span>
        <p>{value.pressure}</p>
      </div>
      {e && (
        <section className="dm-encounter" data-testid="dm-encounter">
          <header>
            <span>
              {e.kind === 'combat'
                ? 'KARŞILAŞMA'
                : e.kind === 'pursuit'
                  ? 'TAKİP / KURTULMA'
                  : 'ÇEVRE TEHLİKESİ'}
            </span>
            <h3>{e.name}</h3>
          </header>
          <p className="dm-encounter-goal">
            <strong>Burada kazanmak:</strong> {e.goal}
          </p>
          <dl>
            <dt>Ne zaman başlar?</dt>
            <dd>{e.trigger}</dd>
            <dt>Mekânı kur</dt>
            <dd>{e.space}</dd>
          </dl>
          <details>
            <summary>Turlar, düşmanlar ve çıkış yolları</summary>
            {art && (
              <figure>
                <img src={art.src} alt={art.title} loading="lazy" />
                <figcaption>
                  {art.title} · görsel kütüphanesinde de bulunur
                </figcaption>
              </figure>
            )}
            <ol>
              {e.rounds.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            {e.units.map((u, i) => (
              <article className="dm-enemy" key={i}>
                <h4>
                  {u.count} × {u.name}
                </h4>
                <div className="dm-enemy-stats">
                  <span>
                    ZIRH <b>{u.ac}</b>
                  </span>
                  <span>
                    CAN <b>{u.hp}</b>
                  </span>
                  <span>
                    HIZ <b>{u.speed}</b>
                  </span>
                </div>
                <p>
                  <strong>Saldırı:</strong> {u.attack}
                </p>
                <p>
                  <strong>Nasıl davranır?</strong> {u.tactics}
                </p>
                <p>
                  <strong>Ne zaman bırakır?</strong> {u.morale}
                </p>
              </article>
            ))}
            <h4>Dövüş dışında</h4>
            <ul>
              {e.exits.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <p>
              <strong>İşler ters giderse:</strong> {e.failure}
            </p>
            <p className="dm-encounter-scale">{e.scale}</p>
          </details>
        </section>
      )}
      {value.dialogue.length > 0 && (
        <details className="dm-voices">
          <summary>Karakterler ne söyler?</summary>
          {value.dialogue.map((d, i) => (
            <article key={i}>
              <h4>{d.speaker}</h4>
              <p className="dm-voice-direction">{d.direction}</p>
              {d.exchanges.map((x, j) => (
                <div key={j}>
                  <strong>{x.cue}</strong>
                  <blockquote>{x.line}</blockquote>
                </div>
              ))}
            </article>
          ))}
        </details>
      )}
      <details className="dm-idle">
        <summary>Oyuncular duraksarsa</summary>
        <p>{value.ifIdle}</p>
      </details>
      <div className="dm-play-end">
        <strong>Bu sahne ne zaman biter?</strong>
        <p>{value.continueWhen}</p>
      </div>
      {value.paths.length > 0 && onGo && (
        <details className="dm-paths">
          <summary>Oyuncular başka bir yol seçtiyse</summary>
          <p>Seçilen sahneyi açar; yayını değiştirmez.</p>
          {value.paths.map((p) => (
            <button key={p.to} onClick={() => onGo(p.to)}>
              {p.label}
            </button>
          ))}
        </details>
      )}
    </section>
  )
}
