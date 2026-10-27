import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Crown,
  Search,
  Shield,
  Swords,
  Users,
  Waves,
  X,
} from 'lucide-react'
import {
  articleById,
  locationById,
  normalize,
  regionById,
  type RegionId,
} from './data'
import {
  worldHouses,
  worldPolities,
  type WorldHouse,
  type WorldPolity,
} from './lore/world-polities'
import HeraldicCrest from './HeraldicCrest'
import './realm-directory.css'

const number = (value: number) => new Intl.NumberFormat('tr-TR').format(value)
const kindLabel = { dynasty: 'Hanedan', clan: 'Klan', house: 'Hane' }
const capitalLabel = (p: WorldPolity) =>
  p.capitalStatus === 'abandoned'
    ? 'Eski başkent · terkedilmiş'
    : p.capitalStatus === 'assembly'
      ? 'Meclis merkezi'
      : p.capitalStatus === 'dispersed'
        ? 'Ortak merkez'
        : 'Başkent'
const statusLabel = (p: WorldPolity) =>
  p.capitalStatus === 'abandoned'
    ? 'Kalıcı nüfus yok'
    : p.capitalStatus === 'assembly'
      ? 'Mevsimlik meclis'
      : p.capitalStatus === 'dispersed'
        ? 'Dağıtılmış yönetim'
        : p.government

function WikiLink({
  id,
  children,
  navigate,
  className = '',
}: {
  id: string
  children: ReactNode
  navigate: (path: string) => void
  className?: string
}) {
  return (
    <a
      className={className}
      href={'#/wiki/' + id}
      onClick={(event) => {
        event.preventDefault()
        navigate('/wiki/' + id)
      }}
    >
      {children}
    </a>
  )
}
function houseArticleId(house: WorldHouse) {
  return (
    ['hane-' + house.id, house.id, house.id + '-hanedani'].find((id) =>
      articleById(id),
    ) || 'hane-' + house.id
  )
}

function PolityDetail({
  polity,
  navigate,
}: {
  polity: WorldPolity
  navigate: (path: string) => void
}) {
  const capital = locationById(polity.capitalId)
  const a = polity.armed
  return (
    <section
      className="realm-detail"
      data-testid="realm-detail"
      aria-label={polity.name + ' yönetimi ve kuvvetleri'}
    >
      <header className="realm-detail-heading">
        <div>
          <span className="realm-kicker">{polity.government}</span>
          <h2>{polity.name}</h2>
          <p>{polity.hegemony}</p>
        </div>
        <WikiLink
          id={polity.region}
          navigate={navigate}
          className="realm-inline-link"
        >
          Ülkeyi oku <ArrowUpRight size={15} />
        </WikiLink>
      </header>
      <dl className="realm-demography">
        <div>
          <dt>Ülkenin toplam nüfusu</dt>
          <dd>{number(polity.population)}</dd>
        </div>
        <div>
          <dt>{capitalLabel(polity)}</dt>
          <dd className="realm-capital-name">
            {capital ? (
              <WikiLink id={capital.id} navigate={navigate}>
                {capital.name}
              </WikiLink>
            ) : (
              polity.capitalName
            )}
          </dd>
        </div>
        <div>
          <dt>Merkezin nüfusu</dt>
          <dd>{number(polity.capitalPopulation)}</dd>
          <small>
            {polity.capitalStatus === 'abandoned'
              ? 'Eski merkez nüfusa eklenmez.'
              : statusLabel(polity)}
          </small>
        </div>
      </dl>
      <div className="realm-government-grid">
        <section
          className="realm-hierarchy"
          aria-label={polity.name + ' unvan sırası'}
        >
          <div className="realm-section-title">
            <Crown size={17} />
            <h3>Buyruğun yolu</h3>
          </div>
          <p className="realm-explainer">
            Unvanı seç; makama nasıl gelindiğini ve yetkinin nerede bittiğini
            gör.
          </p>
          <ol>
            {polity.tiers.map((tier, index) => (
              <li key={tier.title}>
                <span className="realm-rank-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <details>
                  <summary>
                    <strong>{tier.title}</strong>
                    <span>{tier.role}</span>
                  </summary>
                  <dl>
                    <dt>Makama geliş</dt>
                    <dd>{tier.selection}</dd>
                    <dt>Yetkinin sınırı</dt>
                    <dd>{tier.limits}</dd>
                  </dl>
                </details>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="realm-force"
          aria-label={polity.name + ' askerî gücü'}
        >
          <div className="realm-section-title">
            <Swords size={17} />
            <h3>Silahlı güç</h3>
          </div>
          <p className="realm-explainer">
            Daimî birlik ile çağrıldığında toplanabilen insan aynı mevcut
            değildir.
          </p>
          <dl className="realm-force-numbers">
            <div>
              <dt>Daimî kara ve şehir gücü</dt>
              <dd>{number(a.standing)}</dd>
              <small>Görevdeki düzenli personel</small>
            </div>
            <div>
              <dt>Çağrılabilir ek kuvvet</dt>
              <dd>{number(a.muster)}</dd>
              <small>Yerel yükümlüler ve yedekler</small>
            </div>
            <div>
              <dt>Donanma mürettebatı</dt>
              <dd>{number(a.navalCrew)}</dd>
              <small>Kara mevcudundan ayrı</small>
            </div>
            <div>
              <dt>Görev gemisi</dt>
              <dd>{number(a.ships)}</dd>
              <small>Gövde sayısı; mürettebat değildir</small>
            </div>
          </dl>
          <div className="realm-specialists">
            <span>
              <Shield size={14} />
              <strong>{number(a.elite)}</strong> seçkin personel
            </span>
            <span>
              <BookOpen size={14} />
              <strong>{number(a.caster)}</strong> görevli büyücü
            </span>
          </div>
          <p className="realm-count-note">
            Seçkin personel ve büyücüler daimî kara mevcuduna dahildir; toplama
            yeniden eklenmez.
          </p>
          <details className="realm-logistics">
            <summary>Bu güç nasıl ayakta kalır?</summary>
            <p>{a.logistics}</p>
            <p>{a.reservesNote}</p>
          </details>
        </section>
      </div>
      {!!polity.sections.length && (
        <div className="realm-reading-notes">
          {polity.sections.map((section) => (
            <details key={section.title}>
              <summary>{section.title}</summary>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {section.table && (
                <div className="realm-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {section.table.columns.map((column) => (
                          <th key={column}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, index) => (
                        <tr key={index}>
                          {row.map((cell, i) => (
                            <td key={i}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </details>
          ))}
        </div>
      )}
    </section>
  )
}

function HouseCard({
  house,
  navigate,
  onCrest,
}: {
  house: WorldHouse
  navigate: (path: string) => void
  onCrest: (house: WorldHouse) => void
}) {
  const seat = locationById(house.seatId)
  return (
    <article
      className="realm-house"
      data-testid="realm-house"
      data-house-id={house.id}
      style={{ '--house-color': house.colors[1] } as CSSProperties}
    >
      <button
        className="realm-crest-button"
        onClick={() => onCrest(house)}
        aria-label={house.name + ' armasını büyüt'}
      >
        <HeraldicCrest house={house} />
        <span>
          Armaya yakından bak <ArrowUpRight size={12} />
        </span>
      </button>
      <div className="realm-house-content">
        <span className="realm-house-kind">
          {kindLabel[house.kind]} · {regionById(house.region)?.name}
        </span>
        <h3>
          <WikiLink id={houseArticleId(house)} navigate={navigate}>
            {house.name}
          </WikiLink>
        </h3>
        <blockquote>“{house.motto}”</blockquote>
        <dl>
          <div>
            <dt>Merkez</dt>
            <dd>
              {seat ? (
                <WikiLink id={seat.id} navigate={navigate}>
                  {seat.name}
                </WikiLink>
              ) : (
                house.seatName || house.seatId
              )}
            </dd>
          </div>
          <div>
            <dt>Önde gelen kişi</dt>
            <dd>
              {house.leaderId ? (
                <WikiLink id={house.leaderId} navigate={navigate}>
                  {house.leaderName}
                </WikiLink>
              ) : (
                house.leaderName
              )}
            </dd>
          </div>
        </dl>
        <details className="realm-house-history">
          <summary>Armanın anlamı ve bağları</summary>
          <p className="realm-blazon">{house.blazon}</p>
          {house.history.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
          {!!house.relations.length && (
            <ul>
              {house.relations.map((relation) => {
                const other = worldHouses.find((h) => h.id === relation.houseId)
                return (
                  <li key={relation.houseId + '-' + relation.nature}>
                    <strong>
                      {other?.name || relation.houseId} · {relation.nature}
                    </strong>
                    <span>{relation.description}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </details>
        <WikiLink
          className="realm-house-read"
          id={houseArticleId(house)}
          navigate={navigate}
        >
          Hane kaydı <ArrowRight size={15} />
        </WikiLink>
      </div>
    </article>
  )
}

export default function RealmDirectory({
  navigate,
}: {
  navigate: (path: string) => void
}) {
  const [country, setCountry] = useState<RegionId | 'all'>('all')
  const [query, setQuery] = useState('')
  const [crest, setCrest] = useState<WorldHouse | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const dialogTitle = useId()
  const needle = normalize(query.trim())
  const matches = useMemo(
    () =>
      worldHouses.filter(
        (h) =>
          (country === 'all' || h.region === country) &&
          (!needle ||
            normalize(
              [
                h.name,
                h.motto,
                h.blazon,
                h.leaderName,
                h.seatName,
                locationById(h.seatId)?.name,
                regionById(h.region)?.name,
                ...h.history,
              ].join(' '),
            ).includes(needle)),
      ),
    [country, needle],
  )
  const active = worldPolities.find((p) => p.region === country)
  useEffect(() => {
    const target = dialog.current
    if (!target) return
    if (crest && !target.open) target.showModal()
    if (!crest && target.open) target.close()
  }, [crest])
  const reset = () => {
    setCountry('all')
    setQuery('')
  }
  const choose = (region: RegionId | 'all') => {
    setCountry(region)
    setQuery('')
  }
  return (
    <main className="realm-directory" data-testid="realm-directory">
      <header className="realm-intro">
        <div>
          <span className="realm-kicker">
            <Shield size={15} /> VALHUNAR’IN SİYASİ ATLASI
          </span>
          <h1>
            Haneler ve <em>yeminler.</em>
          </h1>
          <p>
            Bir armanın ardındaki insanları, bir unvanın sınırını ve verilen
            sözü ayakta tutan gücü tanı.
          </p>
        </div>
        <div className="realm-tally">
          <div>
            <strong>{worldPolities.length}</strong>
            <span>ülke</span>
          </div>
          <div>
            <strong>{worldHouses.length}</strong>
            <span>hane ve klan</span>
          </div>
        </div>
      </header>
      <nav className="realm-country-tabs" aria-label="Hanelerin ülkesi">
        <button onClick={() => choose('all')} aria-pressed={country === 'all'}>
          Bütün ülkeler<span>{worldHouses.length}</span>
        </button>
        {worldPolities.map((p) => (
          <button
            key={p.region}
            onClick={() => choose(p.region)}
            aria-pressed={country === p.region}
          >
            {p.name}
            <span>
              {worldHouses.filter((h) => h.region === p.region).length}
            </span>
          </button>
        ))}
      </nav>
      <label className="realm-search">
        <Search size={18} />
        <input
          type="search"
          aria-label="Hanelerde ara"
          placeholder="Bir hane, söz, yönetici veya merkez…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            aria-label="Hane aramasını temizle"
            onClick={() => setQuery('')}
          >
            <X size={17} />
          </button>
        )}
      </label>
      {country === 'all' && !needle && (
        <section
          className="realm-world-overview"
          aria-label="Sekiz ülkenin yönetimi"
        >
          {worldPolities.map((p) => (
            <button
              key={p.region}
              className={'realm-overview-card realm-overview-' + p.region}
              onClick={() => choose(p.region)}
            >
              <span>{p.government}</span>
              <h2>
                {p.name}
                <ArrowUpRight size={16} />
              </h2>
              <p>{p.hegemony}</p>
              <dl>
                <div>
                  <dt>Ülke nüfusu</dt>
                  <dd>{number(p.population)}</dd>
                </div>
                <div>
                  <dt>
                    {p.capitalStatus === 'abandoned' ? 'Eski merkez' : 'Merkez'}
                  </dt>
                  <dd>{p.capitalName}</dd>
                </div>
              </dl>
              <small>
                {p.capitalStatus === 'abandoned'
                  ? 'Kalıcı merkez nüfusu: 0'
                  : number(p.capitalPopulation) + ' merkez sakini'}{' '}
                · Yönetimi incele
              </small>
            </button>
          ))}
        </section>
      )}
      {active && <PolityDetail polity={active} navigate={navigate} />}
      <div className="realm-results" role="status">
        <span>
          {matches.length} hane ve klan{active ? ' · ' + active.name : ''}
        </span>
        <button onClick={reset}>Bütün ülkelere dön</button>
      </div>
      {matches.length ? (
        <div className="realm-house-groups">
          {worldPolities
            .filter((p) => matches.some((h) => h.region === p.region))
            .map((p) => (
              <section
                key={p.region}
                className="realm-house-group"
                aria-label={p.name + ' haneleri'}
              >
                {country === 'all' && (
                  <header>
                    <h2>{p.name}</h2>
                    <button onClick={() => choose(p.region)}>
                      Unvanlar ve silahlı güç <ArrowRight size={15} />
                    </button>
                  </header>
                )}
                <div className="realm-house-grid">
                  {matches
                    .filter((h) => h.region === p.region)
                    .map((h) => (
                      <HouseCard
                        key={h.id}
                        house={h}
                        navigate={navigate}
                        onCrest={setCrest}
                      />
                    ))}
                </div>
              </section>
            ))}
        </div>
      ) : (
        <section className="realm-empty">
          <Shield size={32} />
          <h2>Bu aramada bir hane bulunamadı.</h2>
          <p>Başka bir ad, söz veya merkez deneyebilirsin.</p>
          <button onClick={reset}>Aramayı temizle</button>
        </section>
      )}
      <p className="realm-source-note">
        Darbe öncesi dünya. Yeni haneler, arma yorumları ve kuvvet hesapları 27
        Ekim 2026 dünya kurma çalışmasıdır. Valdareth 500.000, Morihael
        1.000.000; Honud toplam 500.000, terkedilmiş başkent 0 kişidir.
      </p>
      <dialog
        ref={dialog}
        className="realm-crest-dialog"
        aria-labelledby={dialogTitle}
        onCancel={(event) => {
          event.preventDefault()
          setCrest(null)
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setCrest(null)
        }}
      >
        {crest && (
          <div>
            <button
              className="realm-dialog-close"
              onClick={() => setCrest(null)}
              aria-label="Arma görünümünü kapat"
            >
              <X size={20} />
            </button>
            <HeraldicCrest house={crest} />
            <span className="realm-house-kind">
              {kindLabel[crest.kind]} · {regionById(crest.region)?.name}
            </span>
            <h2 id={dialogTitle}>{crest.name}</h2>
            <blockquote>“{crest.motto}”</blockquote>
            <p>{crest.blazon}</p>
            <WikiLink
              id={houseArticleId(crest)}
              navigate={(path) => {
                setCrest(null)
                navigate(path)
              }}
              className="realm-inline-link"
            >
              Haneyi tanı <ArrowRight size={15} />
            </WikiLink>
          </div>
        )}
      </dialog>
    </main>
  )
}
