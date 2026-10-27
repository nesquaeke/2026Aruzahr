import type { DMBriefing, DMRunbook } from './dm-guide'
export function QuestBriefing({
  value,
  onPrepare,
  onReveal,
  ready,
}: {
  value: DMBriefing
  onPrepare: () => void
  onReveal: () => void
  ready: boolean
}) {
  return (
    <details className="dm-book-briefing" open>
      <summary>Bölümü buradan başlat · Nereden geldik, ne yapıyoruz?</summary>
      <div className="dm-book-context">
        <span>ÖNCEKİ OLAY</span>
        <p>{value.previous}</p>
        <span>BURAYA NASIL GELDİLER?</span>
        <p>{value.arrival}</p>
        <div className="dm-book-purpose">
          <strong>Partinin amacı</strong>
          <p>{value.purpose}</p>
        </div>
        <details>
          <summary>Bedel, kaynak ve zaman</summary>
          <p>{value.stakes}</p>
        </details>
      </div>
      <details className="dm-book-cast">
        <summary>Kim kimdir? · {value.cast.length} kişi / grup</summary>
        {value.cast.map((c) => (
          <article key={c.name}>
            <h4>{c.name}</h4>
            <p>{c.role}</p>
            <dl>
              <dt>Ne istiyor?</dt>
              <dd>{c.wants}</dd>
              <dt>Nasıl karşılaşılır?</dt>
              <dd>{c.meeting}</dd>
            </dl>
            <blockquote>{c.line}</blockquote>
          </article>
        ))}
      </details>
      <details className="dm-book-opening" open>
        <summary>Açılışta oyunculara oku</summary>
        <blockquote>{value.opening}</blockquote>
        {value.backgroundId && (
          <>
            <div className="dm-stage-actions">
              <button onClick={onPrepare}>Giriş manzarasını hazırla</button>
              <button disabled={!ready} onClick={onReveal}>
                Girişi oyunculara göster
              </button>
            </div>
            <small>
              Bu giriş, numaralı sahnelerden önce oynanır. Hazırlamak canlı yayını
              değiştirmez.
            </small>
          </>
        )}
      </details>
      <div className="dm-book-transition">
        <strong>İlk sahneye nasıl geçilir?</strong>
        <p>{value.transition}</p>
      </div>
    </details>
  )
}
export function SceneRunbook({
  value,
  actions,
  checks,
}: {
  value: DMRunbook
  actions: string[]
  checks: string[]
}) {
  return (
    <section className="dm-runbook" data-testid="dm-runbook">
      <div className="dm-book-entry">
        <strong>Sahnenin başlangıç durumu</strong>
        <p>{value.entry}</p>
      </div>
      <h4>Masada sırayla oynat</h4>
      <ol>
        {value.beats.map((b, i) => (
          <li key={i}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h5>{b.title}</h5>
              <p>{b.text}</p>
              {b.line && <blockquote>{b.line}</blockquote>}
            </div>
          </li>
        ))}
      </ol>
      {value.questions.length > 0 && (
        <details>
          <summary>Oyuncular sorarsa · hazır cevaplar</summary>
          {value.questions.map((q) => (
            <article key={q.question}>
              <strong>{q.question}</strong>
              <p>{q.answer}</p>
            </article>
          ))}
        </details>
      )}
      <details>
        <summary>Zarlar, karşılaşma ve ek DM notları</summary>
        <ul>
          {checks.map((c, i) => (
            <li key={'c' + i}>{c}</li>
          ))}
          {actions.map((a, i) => (
            <li key={'a' + i}>{a}</li>
          ))}
        </ul>
      </details>
      <div className="dm-book-transition">
        <strong>Bu sahneden sonra</strong>
        <p>{value.next}</p>
      </div>
    </section>
  )
}
