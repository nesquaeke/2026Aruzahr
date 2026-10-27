import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import BroadcastLibrary, {
  broadcastAssets,
  type BroadcastAsset,
} from '../BroadcastLibrary'
import { freshId, type BroadcastState } from '../broadcast-state'
import { characters } from '../lore/characters'
import { placeById, places } from '../data'
import { useStudio } from './context'
import { builtins } from './StudioAudio'
import { loadSound } from './media'
import {
  combatPublic,
  encounter,
  downloadFile,
  packageSummary,
  sceneCard,
} from './model'
import { rollExpression } from './dice'
import type {
  Combatant,
  Encounter,
  StudioPerson,
  StudioChannel,
  StudioProject,
} from './types'
import { StudioRollDisplay } from './StudioOverlays'
import { StudioDirectory } from './StudioFinder'
import BattlePreparation, { type BattleFighterDraft } from './BattlePreparation'
import ElevenLabsPanel from './ElevenLabsPanel'
const Field = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => {
  const id = useId()
  return (
    <label className="st-field" htmlFor={id}>
      <span>{label}</span>
      {Children.map(children, (child) =>
        isValidElement(child) &&
        typeof child.type === 'string' &&
        ['input', 'select', 'textarea'].includes(child.type)
          ? cloneElement(
              child as ReactElement<{ id?: string; 'aria-label'?: string }>,
              {
                id,
                'aria-label':
                  (child.props as { 'aria-label'?: string })['aria-label'] ||
                  label,
              },
            )
          : child,
      )}
    </label>
  )
}

const num = (v: string, min = 0, max = 100000) =>
  Math.min(max, Math.max(min, Number(v) || 0))
const Heading = ({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) => (
  <header className="st-panel-title">
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </header>
)
export function ScenePanel() {
  const { p, change, draft, extras, notify, obs } = useStudio(),
    s = p.draft.studio!,
    card = p.scenes.find((c) => c.id === p.activeScene)
  const actors = p.draft.actors,
    selected = actors.filter((a) => p.selectedActors.includes(a.id))
  function align(kind: string) {
    if (selected.length < 2) return
    const left = Math.min(...selected.map((a) => a.x)),
      top = Math.min(...selected.map((a) => a.y)),
      right = Math.max(...selected.map((a) => a.x + a.w))
    const sorted = [...selected].sort((a, b) => a.x - b.x)
    draft({
      actors: actors.map((a) => {
        if (!p.selectedActors.includes(a.id)) return a
        if (kind === 'left') return { ...a, x: left }
        if (kind === 'top') return { ...a, y: top }
        if (kind === 'size') return { ...a, w: selected[0].w, h: selected[0].h }
        if (kind === 'distribute') {
          const i = sorted.findIndex((s) => s.id === a.id),
            space =
              (right - left - sorted.reduce((n, a) => n + a.w, 0)) /
              (sorted.length - 1)
          return {
            ...a,
            x:
              left +
              sorted.slice(0, i).reduce((n, a) => n + a.w, 0) +
              i * space,
          }
        }
        return a
      }),
    })
  }
  function layout(value: string) {
    const n = actors.filter((a) => a.kind === 'portrait').length
    let i = 0
    draft({
      actors: actors.map((a) => {
        if (a.kind !== 'portrait') return a
        const k = i++
        if (value === 'bottom') {
          const w = Math.min(13, 90 / Math.max(n, 1) - 1)
          return { ...a, x: 5 + k * (w + 1), y: 64, w, h: 33 }
        }
        if (value === 'sides') {
          return {
            ...a,
            x: k % 2 ? 85 : 3,
            y: 5 + Math.floor(k / 2) * 28,
            w: 11,
            h: 26,
          }
        }
        return {
          ...a,
          x: 19,
          y: 4 + (k * 90) / Math.max(n, 1),
          w: 10,
          h: Math.min(31, 86 / Math.max(n, 1)),
        }
      }),
      cameraLane: value === 'left',
      studio: { ...s, layout: value as typeof s.layout },
    })
  }
  return (
    <>
      <Heading title="Sahne düzeni">
        Bu panel hazırlığı değiştirir. Yayındaki görüntü Yayına al düğmesine
        kadar korunur.
      </Heading>
      <Field label="Oyuncuların göreceği başlık">
        <input
          aria-label="Hazırlık sahne başlığı"
          maxLength={120}
          value={p.draft.title}
          onChange={(e) => draft({ title: e.target.value })}
        />
      </Field>
      <Field label="Yakınlık">
        <input
          type="range"
          min="1"
          max="4"
          step=".05"
          value={p.draft.sceneZoom}
          onChange={(e) => draft({ sceneZoom: +e.target.value })}
        />
      </Field>
      <div className="st-two">
        <Field label="Yatay odak">
          <input
            type="range"
            min="0"
            max="100"
            value={s.crop?.x ?? 50}
            onChange={(e) =>
              extras({
                crop: {
                  x: +e.target.value,
                  y: s.crop?.y ?? 50,
                  fit: s.crop?.fit || 'cover',
                },
              })
            }
          />
        </Field>
        <Field label="Dikey odak">
          <input
            type="range"
            min="0"
            max="100"
            value={s.crop?.y ?? 50}
            onChange={(e) =>
              extras({
                crop: {
                  x: s.crop?.x ?? 50,
                  y: +e.target.value,
                  fit: s.crop?.fit || 'cover',
                },
              })
            }
          />
        </Field>
      </div>
      <Field label="Resim yerleşimi">
        <select
          value={s.crop?.fit || 'cover'}
          onChange={(e) =>
            extras({
              crop: {
                x: s.crop?.x ?? 50,
                y: s.crop?.y ?? 50,
                fit: e.target.value as 'cover' | 'contain',
              },
            })
          }
        >
          <option value="cover">Alanı doldur</option>
          <option value="contain">Resmin tamamı</option>
        </select>
      </Field>
      <Field label="Atmosfer">
        <select
          value={s.weather}
          onChange={(e) =>
            extras({ weather: e.target.value as typeof s.weather })
          }
        >
          {[
            ['none', 'Efekt yok'],
            ['snow', 'Kar'],
            ['rain', 'Yağmur'],
            ['fog', 'Sis'],
          ].map(([id, n]) => (
            <option key={id} value={id}>
              {n}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Portre / kamera düzeni">
        <select value={s.layout} onChange={(e) => layout(e.target.value)}>
          {[
            ['left', 'Solda kamera ve portreler'],
            ['bottom', 'Altta oyuncular'],
            ['sides', 'İki yanda portreler'],
            ['scene', 'Yalnız anlatı'],
            ['map', 'Harita ağırlıklı'],
            ['combat', 'Savaş'],
          ].map(([id, n]) => (
            <option key={id} value={id}>
              {n}
            </option>
          ))}
        </select>
      </Field>
      <Field label="OBS kamera yuvası sayısı">
        <input
          type="number"
          min="0"
          max="8"
          value={s.cameraSlots}
          onChange={(e) => extras({ cameraSlots: num(e.target.value, 0, 8) })}
        />
      </Field>
      <label className="st-check">
        <input
          type="checkbox"
          checked={p.draft.showNames}
          onChange={(e) => draft({ showNames: e.target.checked })}
        />
        Portre adlarını göster
      </label>
      {card && (
        <details>
          <summary>Kayıtlı sahnenin özel bilgileri</summary>
          <Field label="Sahne adı">
            <input
              maxLength={100}
              value={card.name}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  scenes: p.scenes.map((c) =>
                    c.id === card.id ? { ...c, name: e.target.value } : c,
                  ),
                }))
              }
            />
          </Field>
          <Field label="Bölüm / görev etiketi">
            <input
              maxLength={100}
              value={card.tag}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  scenes: p.scenes.map((c) =>
                    c.id === card.id ? { ...c, tag: e.target.value } : c,
                  ),
                }))
              }
            />
          </Field>
          <Field label="Yalnız DM için hazırlık notu">
            <textarea
              maxLength={10000}
              value={card.notes}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  scenes: p.scenes.map((c) =>
                    c.id === card.id ? { ...c, notes: e.target.value } : c,
                  ),
                }))
              }
            />
          </Field>
          <Field label="Yayına alırken OBS sahnesi">
            <select
              value={card.obsScene}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  scenes: p.scenes.map((c) =>
                    c.id === card.id ? { ...c, obsScene: e.target.value } : c,
                  ),
                }))
              }
            >
              <option value="">OBS sahnesini değiştirme</option>
              {obs.scenes.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </Field>
        </details>
      )}
      <h3>Katmanlar</h3>
      <p className="st-muted">
        Birden çok katmanı kutularla veya Shift+tıklama ile seç.
      </p>
      <div className="st-two">
        <button disabled={selected.length < 2} onClick={() => align('left')}>
          Sola hizala
        </button>
        <button disabled={selected.length < 2} onClick={() => align('top')}>
          Üste hizala
        </button>
        <button disabled={selected.length < 2} onClick={() => align('size')}>
          Boyut eşitle
        </button>
        <button
          disabled={selected.length < 3}
          onClick={() => align('distribute')}
        >
          Eşit aralık
        </button>
        <button
          disabled={!selected.length}
          onClick={() => {
            const group = freshId('group')
            draft({
              actors: actors.map((a) =>
                p.selectedActors.includes(a.id) ? { ...a, group } : a,
              ),
            })
          }}
        >
          Birlikte taşı
        </button>
        <button
          disabled={!selected.length}
          onClick={() =>
            draft({
              actors: actors.map((a) =>
                p.selectedActors.includes(a.id)
                  ? { ...a, group: undefined }
                  : a,
              ),
            })
          }
        >
          Grubu çöz
        </button>
      </div>
      {actors.map((a) => (
        <details key={a.id} className="st-layer">
          <summary>
            <input
              aria-label={`${a.name} katmanını seç`}
              type="checkbox"
              checked={p.selectedActors.includes(a.id)}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  selectedActors: e.target.checked
                    ? [...p.selectedActors, a.id]
                    : p.selectedActors.filter((id) => id !== a.id),
                }))
              }
            />
            {a.name}
            {a.hidden ? ' · gizli' : ''}
            {a.locked ? ' · kilitli' : ''}
          </summary>
          <Field label="Oyunculara görünen ad">
            <input
              maxLength={100}
              value={a.name}
              onChange={(e) =>
                draft({
                  actors: actors.map((x) =>
                    x.id === a.id ? { ...x, name: e.target.value } : x,
                  ),
                })
              }
            />
          </Field>
          <div className="st-two">
            <button
              onClick={() =>
                draft({
                  actors: actors.map((x) =>
                    x.id === a.id ? { ...x, hidden: !x.hidden } : x,
                  ),
                })
              }
            >
              {a.hidden ? 'Göster' : 'Gizle'}
            </button>
            <button
              onClick={() =>
                draft({
                  actors: actors.map((x) =>
                    x.id === a.id ? { ...x, locked: !x.locked } : x,
                  ),
                })
              }
            >
              {a.locked ? 'Kilidi aç' : 'Kilitle'}
            </button>
            <button
              onClick={() =>
                draft({ actors: [...actors.filter((x) => x.id !== a.id), a] })
              }
            >
              Öne al
            </button>
            <button
              onClick={() =>
                draft({ actors: [a, ...actors.filter((x) => x.id !== a.id)] })
              }
            >
              Arkaya al
            </button>
            <button
              onClick={() =>
                extras({ highlight: s.highlight === a.id ? undefined : a.id })
              }
            >
              Konuşanı seç
            </button>
            <button
              onClick={() =>
                draft({ actors: actors.filter((x) => x.id !== a.id) })
              }
            >
              Kaldır
            </button>
          </div>
          {a.kind === 'image' && (
            <>
              <button
                onClick={() =>
                  extras({ reveal: { id: a.id, name: a.name, src: a.src } })
                }
              >
                Bu katmanı büyük göster
              </button>
              <h4>İpucu üzerini ört</h4>
              <p className="st-muted">
                Yayına alırken kapalı bölüm resmin piksellerinden çıkarılır.
              </p>
              <button
                onClick={() =>
                  change((p) => ({
                    ...p,
                    covers: {
                      ...p.covers,
                      [a.id]: [
                        ...(p.covers[a.id] || []),
                        { x: 0, y: 0, w: 100, h: 25 },
                      ],
                    },
                  }))
                }
              >
                Örtü ekle
              </button>
              {p.covers[a.id]?.map((r, i) => (
                <div key={i}>
                  <div className="st-four">
                    {(['x', 'y', 'w', 'h'] as const).map((k) => (
                      <Field key={k} label={k}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={r[k]}
                          onChange={(e) =>
                            change((p) => ({
                              ...p,
                              covers: {
                                ...p.covers,
                                [a.id]: p.covers[a.id].map((x, j) =>
                                  j === i
                                    ? { ...x, [k]: num(e.target.value, 0, 100) }
                                    : x,
                                ),
                              },
                            }))
                          }
                        />
                      </Field>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      change((p) => ({
                        ...p,
                        covers: {
                          ...p.covers,
                          [a.id]: p.covers[a.id].filter((_, j) => i !== j),
                        },
                      }))
                    }
                  >
                    Örtüyü kaldır
                  </button>
                </div>
              ))}
            </>
          )}
        </details>
      ))}
      {s.reveal && (
        <button onClick={() => extras({ reveal: undefined })}>
          Büyük görseli kapat
        </button>
      )}
    </>
  )
}
export function LibraryPanel() {
  const { p, change, addAsset, upload } = useStudio()
  const resolved = (src: string) => {
    const hash = src.match(/\/asset\/([a-f0-9]{64})$/)?.[1]
    return hash ? p.mediaVault[hash] : src
  }
  const used = (src: string) =>
    [
      p.draft,
      p.program,
      ...p.scenes.map((s) => s.state),
      ...p.trash.map((s) => s.state),
      ...(p.previous ? [p.previous] : []),
    ].some((s) =>
      [
        s.scene.src,
        ...s.actors.map((a) => a.src),
        ...s.tokens.map((t) => t.src || ''),
        s.studio?.reveal?.src || '',
      ].some((value) => resolved(value) === src),
    ) || p.cast.some((c) => c.src === src)
  return (
    <>
      <StudioDirectory />
      <BroadcastLibrary
        customAssets={p.imageAssets}
        onScene={(a) => addAsset(a, 'background')}
        onPortrait={(a) => addAsset(a, 'portrait')}
        onReveal={(a) => addAsset(a, 'reveal')}
        onUpload={upload}
      />
      <details className="st-media-management">
        <summary>Yerel görselleri yönet · {p.imageAssets.length}</summary>
        {p.imageAssets.map((a) => (
          <div key={a.id} className="st-row">
            <span>{a.name}</span>
            <button
              disabled={used(a.src)}
              onClick={() =>
                change((p) => {
                  const clean = (s: BroadcastState) => ({
                    ...s,
                    customAssets: s.customAssets.filter((x) => x.id !== a.id),
                  })
                  return {
                    ...p,
                    imageAssets: p.imageAssets.filter((x) => x.id !== a.id),
                    draft: clean(p.draft),
                    scenes: p.scenes.map((s) => ({
                      ...s,
                      state: clean(s.state),
                    })),
                    trash: p.trash.map((s) => ({
                      ...s,
                      state: clean(s.state),
                    })),
                  }
                })
              }
            >
              {used(a.src) ? 'Kullanımda' : 'Kaldır'}
            </button>
          </div>
        ))}
      </details>
    </>
  )
}

export function PeoplePanel() {
  const { p, change, addPerson, notify } = useStudio(),
    [query, setQuery] = useState(''),
    [name, setName] = useState(''),
    [asset, setAsset] = useState(''),
    [kind, setKind] = useState<StudioPerson['kind']>('party')
  const portraits = [...broadcastAssets, ...p.imageAssets].filter(
    (a) => a.kind !== 'scene',
  )
  const edit = (id: string, patch: Partial<StudioPerson>) =>
    change((p) => {
      const cast = p.cast.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        person = cast.find((c) => c.id === id)!,
        name = person.revealed
          ? person.realName
          : person.knownName || 'Bilinmeyen kişi'
      return {
        ...p,
        cast,
        draft: {
          ...p.draft,
          actors: p.draft.actors.map((a) => (a.id === id ? { ...a, name } : a)),
          tokens: p.draft.tokens.map((t) => (t.id === id ? { ...t, name } : t)),
        },
      }
    })
  function stage(c: StudioPerson, map = false) {
    const display = c.revealed ? c.realName : c.knownName || 'Bilinmeyen kişi'
    if (map) {
      const point = p.draft.camera || { x: 0.72, y: 0.72 }
      change((p) => ({
        ...p,
        draft: {
          ...p.draft,
          tokens: [
            ...p.draft.tokens.filter((t) => t.id !== c.id),
            {
              id: c.id,
              name: display,
              src: c.src,
              x: point.x,
              y: point.y,
              kind: c.kind,
              size: 48,
            },
          ],
        },
      }))
    } else
      change((p) => ({
        ...p,
        draft: {
          ...p.draft,
          actors: [
            ...p.draft.actors.filter((a) => a.id !== c.id),
            {
              id: c.id,
              name: display,
              src: c.src,
              kind: 'portrait',
              x: 5 + (p.draft.actors.length % 5) * 15,
              y: 56,
              w: 13,
              h: 38,
              hidden: false,
            },
          ],
        },
      }))
  }
  return (
    <>
      <Heading title="Masadaki kişiler">
        Gerçek kimlik ve amaçlar özel kayıttır. Sahneye yalnız oyuncuların
        bildiği ad taşınır.
      </Heading>
      <details className="st-people-directory"><summary>Hazır karakteri, yaratığı veya yerini bul</summary><StudioDirectory /></details>
      <Field label="Kişinin adı">
        <input
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Oyuncu karakteri veya yeni NPC"
        />
      </Field>
      <Field label="Portre">
        <select value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option value="">Portre seç</option>
          {portraits.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Grup">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
        >
          <option value="party">Oyuncu karakteri</option>
          <option value="ally">NPC / dost</option>
          <option value="enemy">Düşman / yaratık</option>
        </select>
      </Field>
      <button
        disabled={
          !asset ||
          (!name.trim() &&
            portraits.find((a) => a.id === asset)?.kind === 'image')
        }
        onClick={() => {
          const a = portraits.find((a) => a.id === asset)!
          const c = addPerson({ ...a, name: name.trim() || a.name }, kind)
          setName('')
          notify(`${c.realName} özel kişi listesine eklendi.`)
        }}
      >
        Kişiyi ekle
      </button>
      <Field label="Kişilerde ara">
        <input
          maxLength={100}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ad, şehir, görev…"
        />
      </Field>
      {(['party', 'ally', 'enemy'] as const).map((group) => (
        <section key={group}>
          <h3>
            {group === 'party'
              ? 'Oyuncu karakterleri'
              : group === 'ally'
                ? 'NPC ve dostlar'
                : 'Düşmanlar / canlılar'}
          </h3>
          {p.cast
            .filter(
              (c) =>
                c.kind === group &&
                `${c.realName} ${c.knownName} ${c.city} ${c.role}`
                  .toLocaleLowerCase('tr')
                  .includes(query.toLocaleLowerCase('tr')),
            )
            .map((c) => (
              <details key={c.id}>
                <summary>
                  <img className="st-small-portrait" src={c.src} alt="" />
                  {c.realName}
                  <small> · {c.revealed ? c.realName : c.knownName}</small>
                </summary>
                <Field label="Gerçek ad · özel">
                  <input
                    maxLength={100}
                    value={c.realName}
                    onChange={(e) => edit(c.id, { realName: e.target.value })}
                  />
                </Field>
                <Field label="Oyuncuların bildiği ad">
                  <input
                    maxLength={100}
                    value={c.knownName}
                    onChange={(e) => edit(c.id, { knownName: e.target.value })}
                  />
                </Field>
                <label className="st-check">
                  <input
                    type="checkbox"
                    checked={c.revealed}
                    onChange={(e) => edit(c.id, { revealed: e.target.checked })}
                  />
                  Kimlik oyunculara açık
                </label>
                {(
                  [
                    'role',
                    'city',
                    'affiliation',
                    'voice',
                    'aim',
                    'relationship',
                    'notes',
                  ] as const
                ).map((k, i) => (
                  <Field
                    key={k}
                    label={
                      [
                        'Görevi',
                        'Şehri',
                        'Kurumu',
                        'Konuşma tavrı · özel',
                        'Şimdiki amacı · özel',
                        'Partiyle ilişkisi · özel',
                        'Özel not',
                      ][i]
                    }
                  >
                    <textarea
                      maxLength={10000}
                      value={c[k]}
                      onChange={(e) => edit(c.id, { [k]: e.target.value })}
                    />
                  </Field>
                ))}
                <div className="st-four">
                  {(['hp', 'maxHp', 'ac'] as const).map((k) => (
                    <Field
                      key={k}
                      label={{ hp: 'Can', maxHp: 'Azami can', ac: 'Zırh' }[k]}
                    >
                      <input
                        type="number"
                        value={c[k]}
                        onChange={(e) =>
                          edit(c.id, {
                            [k]: num(e.target.value, k === 'maxHp' ? 1 : 0),
                          })
                        }
                      />
                    </Field>
                  ))}
                </div>
                <div className="st-two">
                  <button onClick={() => stage(c)}>
                    Portreyi hazırlığa ekle
                  </button>
                  <button onClick={() => stage(c, true)}>Haritaya ekle</button>
                  <button
                    onClick={() =>
                      change((p) => ({
                        ...p,
                        cast: p.cast.filter((x) => x.id !== c.id),
                      }))
                    }
                  >
                    Listeden kaldır
                  </button>
                </div>
              </details>
            ))}
        </section>
      ))}
    </>
  )
}
const audioUsed = (p: StudioProject, id: string) =>
  [
    p.draft,
    p.program,
    ...(p.previous ? [p.previous] : []),
    ...p.scenes.map((s) => s.state),
    ...p.trash.map((s) => s.state),
  ].some(
    (s) =>
      s.studio?.break?.ambientId === id ||
      (['music', 'ambience', 'effect'] as const).some(
        (c) => s.studio?.audio?.[c]?.id === id,
      ),
  )
export function SoundPanel() {
  const { p, extras, live, change, notify } = useStudio(),
    [type, setType] = useState<'music' | 'ambience' | 'effect'>('ambience'),
    config = p.draft.studio!.audio!,
    sounds = [...builtins, ...p.audioAssets]
  const upload = useRef<HTMLInputElement>(null)
  function patch(value: Partial<typeof config>) {
    extras({ audio: { ...config, ...value } })
  }
  return (
    <>
      <Heading title="Ses ve atmosfer">
        Hazırlık miksini sahneyle yayına al. Acil sessizlik anında canlı sesi
        durdurur.
      </Heading>
      <ElevenLabsPanel />
      <Field label="Sesin çıkacağı pencere">
        <select
          value={config.owner}
          onChange={(e) =>
            patch({ owner: e.target.value as typeof config.owner })
          }
        >
          <option value="operator">Yönetim tarayıcısı</option>
          <option value="audience">Ana OBS / izleyici kaynağı</option>
          <option value="off">Ses kapalı</option>
        </select>
      </Field>
      <Field label="Yumuşak geçiş süresi">
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={config.fadeMs}
          onChange={(e) => patch({ fadeMs: +e.target.value })}
        />
        <small>{config.fadeMs} ms</small>
      </Field>
      {(['music', 'ambience', 'effect'] as const).map((channel, i) => (
        <section className="st-sound-channel" key={channel}>
          <h3>{['Müzik', 'Ortam', 'Tek seferlik efekt'][i]}</h3>
          <select
            aria-label={`${channel} ses seçimi`}
            value={config[channel]?.id || ''}
            onChange={(e) => {
              const item = sounds.find((a) => a.id === e.target.value)
              patch({
                [channel]: item
                  ? {
                      id: item.id,
                      label: item.name,
                      volume: config[channel]?.volume ?? 0.35,
                      playing: true,
                      trigger: freshId('sound'),
                      at: Date.now(),
                      loop: channel !== 'effect',
                    }
                  : undefined,
              })
            }}
          >
            <option value="">Ses seçilmedi</option>
            {sounds
              .filter((s) => s.type === channel)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
          {config[channel] && (
            <>
              <input
                aria-label={`${channel} ses seviyesi`}
                type="range"
                min="0"
                max="1"
                step=".01"
                value={config[channel]!.volume}
                onChange={(e) =>
                  patch({
                    [channel]: { ...config[channel]!, volume: +e.target.value },
                  })
                }
              />
              <div className="st-two">
                <button
                  onClick={() =>
                    patch({
                      [channel]: {
                        ...config[channel]!,
                        playing: !config[channel]!.playing,
                        trigger: freshId('sound'),
                      },
                    })
                  }
                >
                  {config[channel]!.playing ? 'Durdur' : 'Başlat'}
                </button>
                {channel === 'effect' && (
                  <button
                    onClick={() => {
                      const c = {
                        ...config[channel]!,
                        playing: true,
                        trigger: freshId('sound'),
                        at: Date.now(),
                      }
                      patch({ effect: c })
                      live({
                        studio: {
                          ...p.program.studio!,
                          audio: { ...p.program.studio!.audio!, effect: c },
                        },
                      })
                    }}
                  >
                    Efekti canlı çal
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      ))}
      <button
        className="st-danger"
        onClick={() => {
          patch({ muted: true })
          live({
            studio: {
              ...p.program.studio!,
              audio: { ...p.program.studio!.audio!, muted: true },
            },
          })
        }}
      >
        Acil sessizlik
      </button>
      <button
        onClick={() => {
          patch({ muted: false })
          live({
            studio: {
              ...p.program.studio!,
              audio: { ...p.program.studio!.audio!, muted: false },
            },
          })
        }}
      >
        Canlı sesi yeniden aç
      </button>
      <h3>Yerel sesler</h3>
      <Field label="Yükleme kanalı">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
        >
          <option value="ambience">Ortam</option>
          <option value="music">Müzik</option>
          <option value="effect">Efekt</option>
        </select>
      </Field>
      <button onClick={() => upload.current?.click()}>
        Ses yükle · en çok 16 MB
      </button>
      <input
        ref={upload}
        type="file"
        hidden
        accept="audio/wav,audio/mpeg,audio/ogg,audio/webm"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (!f) return
          try {
            const a = await loadSound(f, type)
            if (p.audioAssets.length >= 64)
              throw new Error('En fazla 64 yerel ses.')
            change((p) => ({
              ...p,
              audioAssets: [...p.audioAssets.filter((x) => x.id !== a.id), a],
            }))
            notify('Ses kütüphaneye eklendi.')
          } catch (e) {
            notify((e as Error).message)
          }
        }}
      />
      {p.audioAssets.map((a) => (
        <details key={a.id}>
          <summary>{a.name}</summary>
          <Field label="Ses adı">
            <input
              maxLength={100}
              value={a.name}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  audioAssets: p.audioAssets.map((x) =>
                    x.id === a.id ? { ...x, name: e.target.value } : x,
                  ),
                }))
              }
            />
          </Field>
          <Field label="Kullanım izni / kaynak">
            <textarea
              maxLength={10000}
              value={a.license}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  audioAssets: p.audioAssets.map((x) =>
                    x.id === a.id ? { ...x, license: e.target.value } : x,
                  ),
                }))
              }
            />
          </Field>
          <button
            disabled={audioUsed(p, a.id)}
            onClick={() =>
              change((p) => ({
                ...p,
                audioAssets: p.audioAssets.filter((x) => x.id !== a.id),
              }))
            }
          >
            {audioUsed(p, a.id)
              ? 'Sahnede kullanımda · önce kanaldan çıkar'
              : 'Kütüphaneden kaldır'}
          </button>
        </details>
      ))}
      <p className="st-muted">
        Hazır ortamlar bu proje için kodla üretilmiş ses dokularıdır. Kendi
        müzik ve kayıtlarını da yükleyebilirsin. OBS’de yalnız seçilen
        pencerenin sesini yakala.
      </p>
    </>
  )
}
export function updateEncounter(p: StudioProject, e: Encounter): StudioProject {
  const combat = combatPublic(e),
    draft = {
      ...p.draft,
      studio: {
        ...p.draft.studio!,
        combat,
        highlight: combat?.activeId || undefined,
      },
    },
    program = p.combatOnAir
      ? {
          ...p.program,
          studio: {
            ...p.program.studio!,
            combat,
            highlight: combat?.activeId || undefined,
            revision: (p.program.studio?.revision || 0) + 1,
          },
        }
      : p.program
  return { ...p, encounter: e, draft, program }
}
export function CombatPanel() {
  const { p, change, notify, addAsset } = useStudio(),
    [name, setName] = useState(''),
    [cast, setCast] = useState(''),
    [damage, setDamage] = useState(1)
  const e = p.encounter
  const update = (patch: Partial<Encounter>) =>
    change((p) => updateEncounter(p, { ...p.encounter, ...patch }))
  const edit = (id: string, patch: Partial<Combatant>) =>
    update({
      items: e.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })
  const addFighters = (fighters: BattleFighterDraft[]) =>
    change((project) =>
      updateEncounter(project, {
        ...project.encounter,
        items: [
          ...project.encounter.items,
          ...fighters.map((fighter) => ({
            ...fighter,
            id: freshId('fighter'),
            maxHp: fighter.hp,
            tempHp: 0,
            conditions: [],
            concentration: false,
          })),
        ],
      }),
    )
  const adjustHealth = (id: string, amount: number) =>
    change((project) =>
      updateEncounter(project, {
        ...project.encounter,
        items: project.encounter.items.map((item) => {
          if (item.id !== id) return item
          if (amount >= 0)
            return { ...item, hp: Math.min(item.maxHp, item.hp + amount) }
          const absorbed = Math.min(item.tempHp, -amount)
          return {
            ...item,
            tempHp: item.tempHp - absorbed,
            hp: Math.max(0, item.hp + amount + absorbed),
          }
        }),
      }),
    )
  function next() {
    const count = e.items.length
    if (!count) return
    update({
      history: [...e.history, { active: e.active, round: e.round }].slice(-50),
      active: (e.active + 1) % count,
      round: e.round + (e.active === count - 1 ? 1 : 0),
    })
  }
  return (
    <>
      <Heading title="Karşılaşma masası">
        Düşmanı bul → katılımcıları ekle → sıra ve canları yönet. Eklenen
        düşmanlar önce gizlidir; canlıya çıkış senin kontrolündedir.
      </Heading>
      <BattlePreparation onAdd={addFighters} />
      <section className="st-battle-manual">
        <h3>Masadaki kişiden veya ismiyle ekle</h3>
        <Field label="Kişi listesinden ekle">
          <select value={cast} onChange={(x) => setCast(x.target.value)}>
            <option value="">Bağımsız katılımcı</option>
            {p.cast.map((c) => (
              <option key={c.id} value={c.id}>
                {c.realName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Görünen savaşçı adı">
          <input
            maxLength={100}
            value={name}
            onChange={(x) => setName(x.target.value)}
          />
        </Field>
        <button
          onClick={() => {
            const c = p.cast.find((c) => c.id === cast)
            update({
              items: [
                ...e.items,
                {
                  id: freshId('fighter'),
                  castId: c?.id || '',
                  name: name || c?.knownName || c?.realName || 'Yeni savaşçı',
                  initiative: 0,
                  hp: c?.hp || 10,
                  maxHp: c?.maxHp || 10,
                  tempHp: 0,
                  ac: c?.ac || 10,
                  conditions: [],
                  concentration: false,
                  hidden: false,
                  group: '',
                  notes: '',
                },
              ],
            })
            setName('')
          }}
        >
          Savaşa ekle
        </button>
      </section>
      <section className="st-battle-running" data-testid="battle-running">
        <div className="st-battle-start">
          <span className="st-finder-eyebrow">2 · TURU YÖNET</span>
          <h3>
            {e.items.length
              ? `${e.items.length} katılımcı hazır`
              : 'Savaş listesi henüz boş'}
          </h3>
          <p>
            İnisiyatifleri girip sırala. Hasar geçici canı önce tüketir;
            iyileştirme azami canı geçmez.
          </p>
        </div>
        <div className="st-two">
          <button
            disabled={!e.items.length}
            onClick={() => {
              const active = e.items[e.active]?.id,
                items = [...e.items].sort((a, b) => b.initiative - a.initiative)
              update({
                items,
                active: Math.max(
                  0,
                  items.findIndex((i) => i.id === active),
                ),
              })
            }}
          >
            İnisiyatife göre sırala
          </button>
          <button
            disabled={!e.items.length}
            onClick={() =>
              update({
                items: e.items.map((i) => ({
                  ...i,
                  initiative: rollExpression('1d20').total,
                })),
              })
            }
          >
            Herkese d20 at
          </button>
        </div>
        <div className="st-turn">
          <strong>Tur {e.round}</strong>
          <span>{e.items[e.active]?.name || 'Savaşçı ekle'}</span>
          <button
            onClick={() => {
              const h = e.history.at(-1)
              if (h)
                update({
                  active: h.active,
                  round: h.round,
                  history: e.history.slice(0, -1),
                })
            }}
            disabled={!e.history.length}
          >
            Önceki hamle
          </button>
          <button disabled={!e.items.length} onClick={next}>
            Sıradaki
          </button>
        </div>
        <div className="st-battle-health-controls">
          <label className="st-field">
            <span>Hasar / iyileştirme miktarı</span>
            <input
              aria-label="Hızlı can değişimi"
              type="number"
              min={1}
              max={9999}
              value={damage}
              onChange={(event) => setDamage(num(event.target.value, 1, 9999))}
            />
          </label>
          <span>Karttaki “Hasar” veya “İyileştir” düğmesine bas.</span>
        </div>
        <div className="st-battle-roster">
          {e.items.map((fighter, index) => {
            const person = p.cast.find((person) => person.id === fighter.castId)
            return (
              <article
                key={fighter.id}
                className={`st-battle-fighter ${index === e.active ? 'is-active' : ''} ${fighter.hp === 0 ? 'is-down' : ''}`}
                data-fighter-id={fighter.id}
              >
                <div className="st-battle-fighter-top">
                  {person?.src && <img src={person.src} alt="" />}
                  <div>
                    <strong>{fighter.name}</strong>
                    <small>
                      {fighter.hidden
                        ? 'İzleyiciden gizli'
                        : 'Yayın listesinde görünür'}{' '}
                      · {fighter.group || 'Grup yok'}
                    </small>
                  </div>
                  <button
                    aria-label={`${fighter.name}: sırayı buna getir`}
                    onClick={() => update({ active: index })}
                  >
                    {index === e.active ? 'Sırası' : 'Sıraya al'}
                  </button>
                </div>
                <div className="st-battle-stats">
                  <label>
                    İnisiyatif
                    <input
                      aria-label={`${fighter.name}: hızlı inisiyatif`}
                      type="number"
                      min={-100}
                      max={100}
                      value={fighter.initiative}
                      onChange={(event) =>
                        edit(fighter.id, {
                          initiative: num(event.target.value, -100, 100),
                        })
                      }
                    />
                  </label>
                  <span>
                    <strong>
                      {fighter.hp}/{fighter.maxHp}
                    </strong>{' '}
                    Can{fighter.tempHp ? ` +${fighter.tempHp} geçici` : ''}
                  </span>
                  <span>
                    Zırh <strong>{fighter.ac}</strong>
                  </span>
                </div>
                <meter
                  min={0}
                  max={fighter.maxHp}
                  value={fighter.hp}
                  aria-label={`${fighter.name}: can`}
                />
                <div className="st-directory-actions">
                  <button
                    aria-label={`${fighter.name}: ${damage} hasar`}
                    onClick={() => adjustHealth(fighter.id, -damage)}
                  >
                    −{damage} Hasar
                  </button>
                  <button
                    aria-label={`${fighter.name}: ${damage} iyileştir`}
                    onClick={() => adjustHealth(fighter.id, damage)}
                  >
                    +{damage} İyileştir
                  </button>
                  <button
                    onClick={() =>
                      edit(fighter.id, { hidden: !fighter.hidden })
                    }
                  >
                    {fighter.hidden ? 'Listede görünür yap' : 'Listeden gizle'}
                  </button>
                  {person?.src && (
                    <button
                      onClick={() =>
                        addAsset(
                          {
                            id: person.sourceId || person.id,
                            name: fighter.name,
                            src: person.src,
                            kind: 'portrait',
                          },
                          'portrait',
                        )
                      }
                    >
                      Portreyi hazırla
                    </button>
                  )}
                </div>
                {fighter.notes && (
                  <details>
                    <summary>Saldırı ve taktik · yalnız DM</summary>
                    <p className="st-battle-private">{fighter.notes}</p>
                  </details>
                )}
              </article>
            )
          })}
        </div>
      </section>
      <details className="st-battle-broadcast" open={p.combatOnAir}>
        <summary>3 · İzleyicinin göreceği savaş bilgisi</summary>
        <label className="st-check">
          <input
            type="checkbox"
            checked={p.combatOnAir}
            onChange={(x) =>
              change((p) => {
                const on = x.target.checked,
                  combat = on ? combatPublic(p.encounter) : undefined
                return {
                  ...p,
                  combatOnAir: on,
                  program: {
                    ...p.program,
                    studio: {
                      ...p.program.studio!,
                      combat,
                      highlight: combat?.activeId || undefined,
                    },
                  },
                }
              })
            }
          />
          Savaş bilgisini canlı göster
        </label>
        <div className="st-two">
          <label className="st-check">
            <input
              type="checkbox"
              checked={e.showOrder}
              onChange={(x) => update({ showOrder: x.target.checked })}
            />
            Sıra açık
          </label>
          <label className="st-check">
            <input
              type="checkbox"
              checked={e.showRound}
              onChange={(x) => update({ showRound: x.target.checked })}
            />
            Tur açık
          </label>
        </div>
        <Field label="İzleyiciye can gösterimi">
          <select
            value={e.hpDisplay}
            onChange={(x) =>
              update({ hpDisplay: x.target.value as Encounter['hpDisplay'] })
            }
          >
            <option value="none">Can gizli</option>
            <option value="status">İyi / yaralı / ağır yaralı</option>
            <option value="bar">Can çubuğu</option>
            <option value="number">Sayısal can</option>
          </select>
        </Field>
      </details>
      <details className="st-battle-advanced" open={!e.items.length}>
        <summary>
          Katılımcıların ayrıntılı değerleri, durumları ve özel notları
        </summary>
        {e.items.map((i, n) => (
          <details
            className={n === e.active ? 'st-active-fighter' : ''}
            key={i.id}
            open={n === e.active}
          >
            <summary>
              {n === e.active ? '▶ ' : ''}
              {i.name} · {i.initiative}
              {i.hidden ? ' · gizli' : ''}
            </summary>
            <Field label="Yayın adı">
              <input
                maxLength={100}
                value={i.name}
                onChange={(x) => edit(i.id, { name: x.target.value })}
              />
            </Field>
            <div className="st-four">
              {(['initiative', 'hp', 'maxHp', 'tempHp', 'ac'] as const).map(
                (k) => (
                  <Field
                    key={k}
                    label={
                      {
                        initiative: 'İnisiyatif',
                        hp: 'Can',
                        maxHp: 'Azami',
                        tempHp: 'Geçici',
                        ac: 'Zırh',
                      }[k]
                    }
                  >
                    <input
                      type="number"
                      value={i[k]}
                      onChange={(x) =>
                        edit(i.id, {
                          [k]: num(
                            x.target.value,
                            k === 'initiative' ? -100 : k === 'maxHp' ? 1 : 0,
                          ),
                        })
                      }
                    />
                  </Field>
                ),
              )}
            </div>
            <Field label="Durumlar · virgülle ayır">
              <input
                maxLength={100}
                value={i.conditions.join(', ')}
                onChange={(x) =>
                  edit(i.id, {
                    conditions: x.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .slice(0, 15),
                  })
                }
              />
            </Field>
            <label className="st-check">
              <input
                type="checkbox"
                checked={i.concentration}
                onChange={(x) =>
                  edit(i.id, { concentration: x.target.checked })
                }
              />
              Konsantrasyon
            </label>
            <label className="st-check">
              <input
                type="checkbox"
                checked={i.hidden}
                onChange={(x) => edit(i.id, { hidden: x.target.checked })}
              />
              İzleyiciden tamamen gizle
            </label>
            <Field label="Düşman grubu · özel">
              <input
                maxLength={100}
                value={i.group}
                onChange={(x) => edit(i.id, { group: x.target.value })}
              />
            </Field>
            <button
              disabled={!i.group}
              onClick={() =>
                update({
                  items: e.items.map((x) =>
                    x.group === i.group
                      ? { ...x, initiative: i.initiative }
                      : x,
                  ),
                })
              }
            >
              Grubun inisiyatifini eşitle
            </button>
            <Field label="Özel savaş notu">
              <textarea
                maxLength={10000}
                value={i.notes}
                onChange={(x) => edit(i.id, { notes: x.target.value })}
              />
            </Field>
            <button
              onClick={() =>
                update({
                  items: e.items.filter((x) => x.id !== i.id),
                  active: Math.max(0, Math.min(e.active, e.items.length - 2)),
                })
              }
            >
              Savaştan çıkar
            </button>
          </details>
        ))}
      </details>
      {!!e.items.length && <button className="st-battle-end" onClick={() => {
        if(!window.confirm('Savaş listesini ve bu savaşa ait notları temizleyeyim mi? Kişi listen ve görev ilerlemen korunur.'))return
        change(project=>({
          ...project,
          encounter:encounter(),
          combatOnAir:false,
          draft:{...project.draft,studio:{...project.draft.studio!,combat:undefined,highlight:undefined}},
          program:{...project.program,studio:{...project.program.studio!,combat:undefined,highlight:undefined}},
        }))
        notify('Savaş kapatıldı. Yeni bir karşılaşma hazırlayabilirsin.')
      }}>Savaşı bitir · listeyi temizle</button>}
    </>
  )
}
export function DicePanel() {
  const { p, change, live, notify } = useStudio()
  const [expression, setExpression] = useState('1d20'),
    [modifier, setModifier] = useState(0),
    [mode, setMode] = useState<'normal' | 'advantage' | 'disadvantage'>(
      'normal',
    ),
    [who, setWho] = useState(''),
    [label, setLabel] = useState(''),
    [secret, setSecret] = useState(false),
    [onlyTotal, setOnlyTotal] = useState(false),
    [critical, setCritical] = useState(true),
    [filter, setFilter] = useState('')
  const last = p.rolls[0]
  function roll() {
    try {
      const r = rollExpression(
        expression,
        mode,
        who,
        label,
        onlyTotal,
        critical,
      )
      r.total += modifier
      r.expression += modifier ? (modifier > 0 ? '+' : '') + modifier : ''
      change((p) => {
        const display = onlyTotal
          ? { ...r, expression: '', terms: [], critical: false }
          : r
        const audio = p.program.studio!.audio!
        return {
          ...p,
          rolls: [{ ...r, secret }, ...p.rolls].slice(0, 200),
          program: secret
            ? p.program
            : {
                ...p.program,
                roll: null,
                studio: {
                  ...p.program.studio!,
                  roll: display,
                  audio: {
                    ...audio,
                    effect: {
                      id: 'builtin-dice',
                      label: 'Zar',
                      volume: 0.35,
                      playing: true,
                      trigger: r.id,
                      at: Date.now(),
                      loop: false,
                    },
                  },
                },
              },
          journal: [
            ...p.journal,
            {
              id: freshId('entry'),
              at: Date.now(),
              kind: 'roll' as const,
              text: `${who} ${label}: ${r.expression} = ${r.total}${secret ? ' (gizli)' : ''}`,
              publicText: secret ? '' : `${who} ${label}: ${r.total}`,
              sceneId: p.activeScene,
            },
          ].slice(-1500),
        }
      })
    } catch (e) {
      notify((e as Error).message)
    }
  }
  return (
    <>
      <Heading title="Zar masası">
        Gizli atış ses veya yayın olayı üretmez. Diğer atışlar seçili ses
        kaynağında görünür.
      </Heading>
      <Field label="Atan kişi">
        <input
          maxLength={100}
          value={who}
          onChange={(e) => setWho(e.target.value)}
          list="studio-roll-people"
        />
        <datalist id="studio-roll-people">
          {p.cast.map((c) => (
            <option key={c.id}>{c.knownName || c.realName}</option>
          ))}
        </datalist>
      </Field>
      <Field label="Atış adı">
        <input
          maxLength={100}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </Field>
      <Field label="Zar ifadesi">
        <input
          aria-label="Zar ifadesi"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="2d6+1d4+3"
        />
      </Field>
      <div className="st-two">
        <Field label="Atış türü">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
          >
            <option value="normal">Normal</option>
            <option value="advantage">Avantaj · 1d20</option>
            <option value="disadvantage">Dezavantaj · 1d20</option>
          </select>
        </Field>
        <Field label="Ek değer">
          <input
            type="number"
            min="-999"
            max="999"
            value={modifier}
            onChange={(e) => setModifier(num(e.target.value, -999, 999))}
          />
        </Field>
      </div>
      <label className="st-check">
        <input
          type="checkbox"
          checked={secret}
          onChange={(e) => setSecret(e.target.checked)}
        />
        Gizli DM atışı
      </label>
      <label className="st-check">
        <input
          type="checkbox"
          checked={onlyTotal}
          onChange={(e) => setOnlyTotal(e.target.checked)}
        />
        Yalnız sonucu göster
      </label>
      <label className="st-check">
        <input
          type="checkbox"
          checked={critical}
          onChange={(e) => setCritical(e.target.checked)}
        />
        Doğal 20 / 1 vurgusu
      </label>
      <button className="st-primary" onClick={roll}>
        {secret ? 'Gizli at' : 'Zarları at'}
      </button>
      <div className="st-two">
        <button
          onClick={() =>
            change((p) => ({
              ...p,
              favorites: [...p.favorites, { who, label, expression }].slice(
                -40,
              ),
            }))
          }
        >
          Atışı kaydet
        </button>
        <button
          onClick={() =>
            live({
              roll: null,
              studio: { ...p.program.studio!, roll: undefined },
            })
          }
        >
          Sonucu yayından kaldır
        </button>
      </div>
      {last && (
        <div className="st-private-roll">
          <small>{last.secret ? 'YALNIZ DM' : 'SON ATIŞ'}</small>
          <StudioRollDisplay roll={last} />
        </div>
      )}
      <h3>Kayıtlı atışlar</h3>
      {p.favorites.map((f, i) => (
        <div className="st-row" key={i}>
          <button
            onClick={() => {
              setWho(f.who)
              setLabel(f.label)
              setExpression(f.expression)
            }}
          >
            {f.who} {f.label} · {f.expression}
          </button>
          <button
            onClick={() =>
              change((p) => ({
                ...p,
                favorites: p.favorites.filter((_, j) => i !== j),
              }))
            }
          >
            ×
          </button>
        </div>
      ))}
      <Field label="Atış geçmişinde kişi ara">
        <input
          maxLength={100}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Field>
      <ol className="st-roll-history">
        {p.rolls
          .filter((r) => r.who.toLowerCase().includes(filter.toLowerCase()))
          .map((r) => (
            <li key={r.id}>
              <strong>
                {r.who || 'DM'} · {r.total}
              </strong>
              <small>
                {r.label} {r.expression} {r.mode} {r.secret ? '· özel' : ''}
              </small>
            </li>
          ))}
      </ol>
      <p className="st-muted">
        Doğal 20 vurgusu otomatik başarı kararı vermez; kuralı DM uygular.
      </p>
    </>
  )
}
export function MapPanel() {
  const { p, change, draft, live, notify, perform } = useStudio(),
    [name, setName] = useState(''),
    [first, setFirst] = useState(''),
    [second, setSecond] = useState('')
  const a = p.mapMarkers.find((m) => m.id === first),
    b = p.mapMarkers.find((m) => m.id === second)
  const distance =
    a && b && p.mapScale
      ? Math.hypot(a.x - b.x, ((a.y - b.y) * 5668) / 8192) * p.mapScale
      : null
  return (
    <>
      <Heading title="Yol ve harita">
        Gezinme hazırlığı değiştirir. Oyuncu kamerasını ayrı düğmeyle taşı.
      </Heading>
      <button onClick={() => draft({ mode: 'map' })}>
        Haritayı hazırlığa aç
      </button>
      {p.draft.mode === 'map' && (
        <button onClick={() => perform('close-map')}>
          Haritayı kapat · sahneye dön
        </button>
      )}
      <Field label="Şehre odaklan">
        <select
          defaultValue=""
          onChange={(e) => {
            const city = placeById(e.target.value)
            e.currentTarget.value = ''
            e.currentTarget.blur()
            if (city?.point)
              draft({
                mode: 'map',
                camera: { x: city.point[0], y: city.point[1], zoom: 6 },
              })
          }}
        >
          <option value="">Yer seç</option>
          {places.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <button
        className="st-primary"
        onClick={() =>
          live({
            mode: 'map',
            camera: p.draft.camera,
            studio: {
              ...p.program.studio!,
              markers: p.mapMarkers.filter((m) => !m.hidden),
            },
          })
        }
      >
        Oyuncu kamerasını buraya getir
      </button>
      <h3>Kamera yer imleri</h3>
      <Field label="Yer imi adı">
        <input
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <button
        disabled={!p.draft.camera || !name.trim()}
        onClick={() => {
          change((p) => ({
            ...p,
            bookmarks: [
              ...p.bookmarks,
              {
                id: freshId('camera'),
                name: name.trim(),
                camera: p.draft.camera!,
                kmPerSourceWidth: p.mapScale,
              },
            ],
          }))
          setName('')
        }}
      >
        Bu görünümü kaydet
      </button>
      {p.bookmarks.map((m) => (
        <div className="st-row" key={m.id}>
          <button
            onClick={() => {
              draft({ mode: 'map', camera: m.camera })
              change((p) => ({ ...p, mapScale: m.kmPerSourceWidth }))
            }}
          >
            {m.name}
          </button>
          <button
            onClick={() =>
              change((p) => ({
                ...p,
                bookmarks: p.bookmarks.filter((b) => b.id !== m.id),
              }))
            }
          >
            ×
          </button>
        </div>
      ))}
      <h3>İşaretler ve yol etapları</h3>
      <p className="st-muted">
        Araç çubuğundaki Yer işareti ile haritaya tıkla. Yeni yer işareti önce
        yalnız DM’ye görünür.
      </p>
      {p.mapMarkers.map((m, i) => (
        <details key={m.id}>
          <summary>
            {m.label}
            {m.hidden ? ' · özel' : ''}
          </summary>
          <Field label="Etiket">
            <input
              maxLength={100}
              value={m.label}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  mapMarkers: p.mapMarkers.map((x) =>
                    x.id === m.id ? { ...x, label: e.target.value } : x,
                  ),
                }))
              }
            />
          </Field>
          <Field label="Tür">
            <select
              value={m.kind}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  mapMarkers: p.mapMarkers.map((x) =>
                    x.id === m.id
                      ? { ...x, kind: e.target.value as typeof m.kind }
                      : x,
                  ),
                }))
              }
            >
              <option value="place">Geçici yer</option>
              <option value="route">Yol etabı</option>
              <option value="ping">Dikkat halkası</option>
            </select>
          </Field>
          <label className="st-check">
            <input
              type="checkbox"
              checked={m.hidden}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  mapMarkers: p.mapMarkers.map((x) =>
                    x.id === m.id ? { ...x, hidden: e.target.checked } : x,
                  ),
                }))
              }
            />
            Yalnız DM’ye göster
          </label>
          <div className="st-two">
            <button
              disabled={i === 0}
              onClick={() =>
                change((p) => {
                  const rows = [...p.mapMarkers]
                  ;[rows[i - 1], rows[i]] = [rows[i], rows[i - 1]]
                  return { ...p, mapMarkers: rows }
                })
              }
            >
              Önceki etap
            </button>
            <button
              onClick={() =>
                change((p) => ({
                  ...p,
                  mapMarkers: p.mapMarkers.filter((x) => x.id !== m.id),
                }))
              }
            >
              Sil
            </button>
          </div>
        </details>
      ))}
      <Field label="Tamamlanan yol etabı sayısı">
        <input
          type="number"
          min="0"
          max={p.mapMarkers.filter((m) => m.kind === 'route').length}
          value={p.routeProgress}
          onChange={(e) =>
            change((p) => ({
              ...p,
              routeProgress: num(
                e.target.value,
                0,
                p.mapMarkers.filter((m) => m.kind === 'route').length,
              ),
            }))
          }
        />
      </Field>
      <h3>Harita taşları</h3>
      <div className="st-two">
        <button
          disabled={p.selectedTokens.length < 2}
          onClick={() => {
            const group = freshId('token-group')
            draft({
              tokens: p.draft.tokens.map((t) =>
                p.selectedTokens.includes(t.id) ? { ...t, group } : t,
              ),
            })
          }}
        >
          Seçilenleri grupla
        </button>
        <button
          onClick={() =>
            draft({
              tokens: p.draft.tokens.map((t) =>
                p.selectedTokens.includes(t.id)
                  ? { ...t, group: undefined }
                  : t,
              ),
            })
          }
        >
          Grubu çöz
        </button>
      </div>
      {p.draft.tokens.map((t) => (
        <details key={t.id}>
          <summary>
            <input
              aria-label={`${t.name} taşını seç`}
              type="checkbox"
              checked={p.selectedTokens.includes(t.id)}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  selectedTokens: e.target.checked
                    ? [...p.selectedTokens, t.id]
                    : p.selectedTokens.filter((id) => id !== t.id),
                }))
              }
            />
            {t.name}
          </summary>
          <Field label="Taş adı">
            <input
              maxLength={100}
              value={t.name}
              onChange={(e) =>
                draft({
                  tokens: p.draft.tokens.map((x) =>
                    x.id === t.id ? { ...x, name: e.target.value } : x,
                  ),
                })
              }
            />
          </Field>
          <Field label="Taş boyutu">
            <input
              type="range"
              min="24"
              max="160"
              value={t.size}
              onChange={(e) =>
                draft({
                  tokens: p.draft.tokens.map((x) =>
                    x.id === t.id ? { ...x, size: +e.target.value } : x,
                  ),
                })
              }
            />
          </Field>
          <button
            onClick={() =>
              draft({
                tokens: p.draft.tokens.map((x) =>
                  x.id === t.id ? { ...x, locked: !x.locked } : x,
                ),
              })
            }
          >
            {t.locked ? 'Taş kilidini aç' : 'Taşı kilitle'}
          </button>
          <button
            onClick={() =>
              draft({ tokens: p.draft.tokens.filter((x) => x.id !== t.id) })
            }
          >
            Taşı kaldır
          </button>
        </details>
      ))}
      <details>
        <summary>Mesafe ölçeği · isteğe bağlı</summary>
        <p>
          Ölçek verilmedikçe kilometre hesaplanmaz. Bu değer haritanın tüm yatay
          genişliğinin kaç kilometre olduğudur.
        </p>
        <Field label="8192 piksel yatay genişlik (km)">
          <input
            type="number"
            min=".001"
            step="1"
            value={p.mapScale ?? ''}
            onChange={(e) =>
              change((p) => ({
                ...p,
                mapScale: e.target.value
                  ? num(e.target.value, 0.001, 1000000)
                  : null,
              }))
            }
          />
        </Field>
        {[first, second].map((value, i) => (
          <Field key={i} label={i ? 'İkinci işaret' : 'İlk işaret'}>
            <select
              value={value}
              onChange={(e) => (i ? setSecond : setFirst)(e.target.value)}
            >
              <option value="">İşaret seç</option>
              {p.mapMarkers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>
        ))}
        <output>
          {distance === null
            ? 'Ölçek ve iki işaret gerekli.'
            : `${distance.toFixed(1)} km · kuş uçuşu`}
        </output>
      </details>
    </>
  )
}
export function JournalPanel() {
  const { p, change, extras, live } = useStudio(),
    [text, setText] = useState(''),
    [publicText, setPublic] = useState(''),
    [kind, setKind] = useState<
      'event' | 'decision' | 'promise' | 'delivery' | 'relation'
    >('event'),
    [privateSummary, setPrivateSummary] = useState(''),
    [publicSummary, setPublicSummary] = useState('')
  function summarize() {
    const entries = p.journal.map((j) => `- ${j.text}`).join('\n')
    const open = p.facts
      .filter((f) => f.enabled)
      .map((f) => `- ${f.label}: ${f.value}`)
      .join('\n')
    setPrivateSummary(
      `# ${p.name} — ${p.sessionName}\n\n## Yaşananlar\n${entries || 'Henüz kayıt yok.'}\n\n## Açık kalanlar\n${open || 'Henüz hatırlatma yok.'}\n\n## Sonraki oturum\n${p.scenes.find((s) => s.id === p.activeScene)?.name || p.draft.title}`,
    )
    setPublicSummary(
      p.journal
        .map((j) => j.publicText)
        .filter(Boolean)
        .map((t) => '• ' + t)
        .join('\n'),
    )
  }
  return (
    <>
      <Heading title="Oturum defteri">
        Özel not ve oyunculara açık özet ayrı alanlardır.
      </Heading>
      <Field label="Kayıt türü">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
        >
          {[
            ['event', 'Olay'],
            ['decision', 'Karar'],
            ['promise', 'Verilen söz'],
            ['delivery', 'Yük / teslim'],
            ['relation', 'İlişki'],
          ].map(([v, n]) => (
            <option key={v} value={v}>
              {n}
            </option>
          ))}
        </select>
      </Field>
      <Field label="DM kaydı">
        <textarea
          maxLength={10000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>
      <Field label="Oyunculara açık cümle · isteğe bağlı">
        <textarea
          maxLength={10000}
          value={publicText}
          onChange={(e) => setPublic(e.target.value)}
        />
      </Field>
      <button
        disabled={!text.trim()}
        onClick={() => {
          change((p) => ({
            ...p,
            journal: [
              ...p.journal,
              {
                id: freshId('entry'),
                at: Date.now(),
                kind,
                text,
                publicText,
                sceneId: p.activeScene,
              },
            ].slice(-1500),
          }))
          setText('')
          setPublic('')
        }}
      >
        Deftere ekle
      </button>
      <h3>Karar ve hatırlatmalar</h3>
      <button
        onClick={() =>
          change((p) => ({
            ...p,
            facts: [
              ...p.facts,
              {
                id: freshId('fact'),
                label: 'Yeni karar',
                value: '',
                sceneIds: [],
                questIds: [],
                enabled: true,
              },
            ],
          }))
        }
      >
        Hatırlatma ekle
      </button>
      {p.facts.map((f) => (
        <details key={f.id}>
          <summary>
            {f.label}
            {f.enabled ? '' : ' · kapalı'}
          </summary>
          <Field label="Karar / olay">
            <input
              maxLength={100}
              value={f.label}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  facts: p.facts.map((x) =>
                    x.id === f.id ? { ...x, label: e.target.value } : x,
                  ),
                }))
              }
            />
          </Field>
          <Field label="DM’ye hatırlatılacak sonuç">
            <textarea
              maxLength={10000}
              value={f.value}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  facts: p.facts.map((x) =>
                    x.id === f.id ? { ...x, value: e.target.value } : x,
                  ),
                }))
              }
            />
          </Field>
          <Field label="Görev kimlikleri · virgülle">
            <input
              maxLength={100}
              value={f.questIds.join(',')}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  facts: p.facts.map((x) =>
                    x.id === f.id
                      ? {
                          ...x,
                          questIds: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }
                      : x,
                  ),
                }))
              }
            />
          </Field>
          <Field label="Bağlı sahneler">
            <select
              multiple
              value={f.sceneIds}
              onChange={(e) => {
                const ids = [...e.target.selectedOptions].map((o) => o.value)
                change((p) => ({
                  ...p,
                  facts: p.facts.map((x) =>
                    x.id === f.id ? { ...x, sceneIds: ids } : x,
                  ),
                }))
              }}
            >
              {p.scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <label className="st-check">
            <input
              type="checkbox"
              checked={f.enabled}
              onChange={(e) =>
                change((p) => ({
                  ...p,
                  facts: p.facts.map((x) =>
                    x.id === f.id ? { ...x, enabled: e.target.checked } : x,
                  ),
                }))
              }
            />
            Hatırlatma etkin
          </label>
          <button
            onClick={() =>
              change((p) => ({
                ...p,
                facts: p.facts.filter((x) => x.id !== f.id),
              }))
            }
          >
            Hatırlatmayı kaldır
          </button>
        </details>
      ))}
      <h3>Oturum özeti</h3>
      <button onClick={summarize}>Kayıtlardan özet taslağı çıkar</button>
      <Field label="Özel DM özeti · düzenlenebilir">
        <textarea
          rows={10}
          value={privateSummary}
          onChange={(e) => setPrivateSummary(e.target.value)}
        />
      </Field>
      <button
        onClick={() =>
          downloadFile(
            'Aruzahr-DM-Oturum-Ozeti.md',
            privateSummary,
            'text/markdown',
          )
        }
      >
        Özel özeti indir
      </button>
      <Field label="Oyunculara açık özet · düzenlenebilir">
        <textarea
          maxLength={10000}
          value={publicSummary}
          onChange={(e) => setPublicSummary(e.target.value)}
        />
      </Field>
      <button
        onClick={() =>
          downloadFile(
            'Aruzahr-Oyuncu-Ozeti.md',
            publicSummary,
            'text/markdown',
          )
        }
      >
        Oyuncu özetini indir
      </button>
      <button
        onClick={() => {
          extras({
            break: {
              ...p.draft.studio!.break!,
              summary: publicSummary.slice(0, 1000),
            },
          })
          live({
            studio: {
              ...p.program.studio!,
              break: {
                ...p.program.studio!.break!,
                summary: publicSummary.slice(0, 1000),
              },
            },
          })
        }}
      >
        Açık özeti ara ekranına koy
      </button>
      <h3>Geçmiş</h3>
      {[...p.journal]
        .reverse()
        .slice(0, 100)
        .map((j) => (
          <details key={j.id}>
            <summary>
              {new Date(j.at).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              · {j.kind} · {j.text.slice(0, 60)}
            </summary>
            <Field label="Özel metin">
              <textarea
                maxLength={10000}
                value={j.text}
                onChange={(e) =>
                  change((p) => ({
                    ...p,
                    journal: p.journal.map((x) =>
                      x.id === j.id ? { ...x, text: e.target.value } : x,
                    ),
                  }))
                }
              />
            </Field>
            <Field label="Açık metin">
              <textarea
                maxLength={10000}
                value={j.publicText}
                onChange={(e) =>
                  change((p) => ({
                    ...p,
                    journal: p.journal.map((x) =>
                      x.id === j.id ? { ...x, publicText: e.target.value } : x,
                    ),
                  }))
                }
              />
            </Field>
            <button
              onClick={() =>
                change((p) => ({
                  ...p,
                  journal: p.journal.filter((x) => x.id !== j.id),
                }))
              }
            >
              Kaydı sil
            </button>
          </details>
        ))}
    </>
  )
}
export function BroadcastPanel() {
  const {
      p,
      change,
      extras,
      live,
      notify,
      request,
      obs,
      exportProject,
      importFile,
      perform,
      connection,
    } = useStudio(),
    [url, setUrl] = useState('ws://127.0.0.1:4455'),
    [password, setPassword] = useState(''),
    [pair, setPair] = useState<any>(null),
    [host, setHost] = useState(''),
    [pollTitle, setPollTitle] = useState('Sizce ne yapmalılar?'),
    [options, setOptions] = useState('Yola devam et\nÖnce araştır'),
    [minutes, setMinutes] = useState(10),
    [audioStatus, setAudioStatus] = useState('Henüz ses başlamadı')
  const file = useRef<HTMLInputElement>(null),
    config = p.draft.studio!.break!
  useEffect(() => {
    const status = (event: Event) => {
      const d = (event as CustomEvent<{ role: string; status: string }>).detail
      if (d.role === 'operator') setAudioStatus(d.status)
    }
    window.addEventListener('studio-audio-status', status)
    return () => window.removeEventListener('studio-audio-status', status)
  }, [])
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      notify('Adres kopyalandı.')
    } catch {
      notify(text)
    }
  }
  return (
    <>
      <Heading title="Yayın ve kampanya">
        Yerel sunucu ve yönetim masası yayın boyunca açık kalmalı.
      </Heading>
      <p className="st-status">
        {connection.online ? 'Yerel röle bağlı' : connection.error} · Son yayın:{' '}
        {connection.ack
          ? new Date(connection.ack).toLocaleTimeString('tr-TR')
          : 'henüz yok'}
      </p>
      <h3>Kampanya dosyası</h3>
      <button onClick={() => perform('new-campaign')}>
        Yeni kampanya oluştur
      </button>
      <p>{packageSummary(p)}</p>
      <button onClick={exportProject}>Özel kampanya paketini indir</button>
      <button onClick={() => file.current?.click()}>
        Kampanya veya eski oturum dosyası aç
      </button>
      <input
        type="file"
        ref={file}
        hidden
        accept=".json,.aruzahr"
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (f) void importFile(f)
        }}
      />
      <p className="st-status">
        Ses kaynağı:{' '}
        {p.program.studio?.audio?.owner === 'audience'
          ? `Ana yayın penceresi · ${connection.audio ? 'çalıyor' : 'ses başlamadı / bekleniyor'}`
          : p.program.studio?.audio?.owner === 'operator'
            ? `Yönetim penceresi · ${audioStatus}`
            : 'Ses kapalı'}
      </p>
      <h3>OBS kaynakları</h3>
      <p className="st-muted">
        Kaynak ve OBS tuvalini aynı ölçü seç: 1920×1080, 2560×1440 veya
        3840×2160. Şeffaf katmanlar ayrı kaynak olarak eklenebilir.
      </p>
      {[
        ['/broadcast/live', 'Ana sahne'],
        ['/broadcast/output/map', 'Yalnız harita'],
        ['/broadcast/output/portraits', 'Şeffaf portreler'],
        ['/broadcast/output/dice', 'Şeffaf zar'],
        ['/broadcast/output/initiative', 'Şeffaf inisiyatif'],
        ['/broadcast/output/break', 'Ara ekranı'],
      ].map(([route, title]) => (
        <div className="st-row" key={route}>
          <a href={'#' + route} target="_blank" rel="noopener">
            {title} ↗
          </a>
          <button onClick={() => copy(location.origin + '/#' + route)}>
            Adresi kopyala
          </button>
        </div>
      ))}
      <h3>Ara ekranı</h3>
      <Field label="Ara mesajı">
        <input
          maxLength={160}
          value={p.draft.breakMessage || ''}
          onChange={(e) => {
            const breakMessage = e.target.value
            change((p) => ({
              ...p,
              draft: { ...p.draft, breakMessage },
              program: { ...p.program, breakMessage },
            }))
          }}
        />
      </Field>
      <Field label="Ara ekranındaki kampanya adı">
        <input
          maxLength={100}
          value={config.campaign}
          onChange={(e) =>
            extras({ break: { ...config, campaign: e.target.value } })
          }
        />
      </Field>
      <Field label="Dakika">
        <input
          type="number"
          min="1"
          max="240"
          value={minutes}
          onChange={(e) => setMinutes(num(e.target.value, 1, 240))}
        />
      </Field>
      <div className="st-two">
        <button
          onClick={() => {
            const b = {
              ...config,
              until: Date.now() + minutes * 60000,
              paused: null,
            }
            extras({ break: b })
            live({
              intermission: true,
              studio: { ...p.program.studio!, break: b },
            })
          }}
        >
          Geri sayımla ara ver
        </button>
        <button
          onClick={() => {
            const b = p.program.studio?.break || config
            const next =
              b.paused !== null
                ? { ...b, until: Date.now() + b.paused, paused: null }
                : {
                    ...b,
                    paused: Math.max(0, (b.until || Date.now()) - Date.now()),
                    until: null,
                  }
            live({ studio: { ...p.program.studio!, break: next } })
          }}
        >
          Süreyi durdur / sürdür
        </button>
        <button
          onClick={() => {
            const b = p.program.studio?.break || config
            live({
              studio: {
                ...p.program.studio!,
                break:
                  b.paused !== null
                    ? { ...b, paused: b.paused + 300000 }
                    : { ...b, until: (b.until || Date.now()) + 300000 },
              },
            })
          }}
        >
          5 dakika ekle
        </button>
        <button onClick={() => live({ intermission: false })}>
          Moladan dön
        </button>
      </div>
      <Field label="Ara ortamı">
        <select
          value={config.ambientId || ''}
          onChange={(e) =>
            extras({
              break: { ...config, ambientId: e.target.value || undefined },
            })
          }
        >
          <option value="">Mevcut sesi hafiflet</option>
          {[...builtins, ...p.audioAssets]
            .filter((a) => a.type === 'ambience')
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
        </select>
      </Field>
      <h3>Telefon kumandası</h3>
      <p>
        Bilgisayarda yönetimi 127.0.0.1 adresinden aç. Telefon için aynı ağda
        LAN başlatıcısını kullan.
      </p>
      <button
        onClick={async () => {
          try {
            const r = await request('pairing', {
              scenes: p.scenes.map((s) => ({
                id: s.id,
                name: s.state.title || 'Sahne',
              })),
            })
            setPair(r)
            setHost(r.hosts[0] || location.hostname)
          } catch (e) {
            notify((e as Error).message)
          }
        }}
      >
        10 dakikalık eşleştirme kodu üret
      </button>
      {pair && (
        <>
          <strong className="st-pair-pin">{pair.pin}</strong>
          <Field label="Bilgisayarın yerel ağ adresi">
            <input
              maxLength={100}
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </Field>
          <button
            onClick={() =>
              copy(
                `${location.protocol}//${host}${location.port ? ':' + location.port : ''}/#/broadcast/remote?code=${pair.pin}`,
              )
            }
          >
            Telefon bağlantısını kopyala
          </button>
          <small>
            Kod bitse de eşleşen telefon kontrol bırakılana kadar çalışabilir.
            Kontrol devralındığında eşleşmeler kapanır.
          </small>
        </>
      )}
      <h3>İzleyici oylaması</h3>
      <Field label="Açık soru">
        <input
          maxLength={200}
          value={pollTitle}
          onChange={(e) => setPollTitle(e.target.value)}
        />
      </Field>
      <Field label="Seçenekler · her satıra bir tane">
        <textarea
          maxLength={10000}
          value={options}
          onChange={(e) => setOptions(e.target.value)}
        />
      </Field>
      <button
        onClick={async () => {
          try {
            const poll = await request('poll', {
              title: pollTitle,
              options: options
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 6),
            })
            live({ studio: { ...p.program.studio!, poll } })
            notify('Oylama açıldı. Bağlantıyı aşağıdan kopyala.')
          } catch (e) {
            notify((e as Error).message)
          }
        }}
      >
        Oylamayı aç
      </button>
      {p.program.studio?.poll && (
        <>
          <button
            onClick={() =>
              copy(
                location.origin +
                  '/#/broadcast/vote?code=' +
                  p.program.studio!.poll!.code,
              )
            }
          >
            Oylama bağlantısını kopyala
          </button>
          <button
            onClick={async () => {
              await request('poll', { close: true })
              live({
                studio: {
                  ...p.program.studio!,
                  poll: { ...p.program.studio!.poll!, open: false },
                },
              })
            }}
          >
            Oylamayı kapat
          </button>
          <button
            onClick={() =>
              live({ studio: { ...p.program.studio!, poll: undefined } })
            }
          >
            Oylamayı görüntüden kaldır
          </button>
        </>
      )}
      <p className="st-muted">
        Bağlantı izleyicinin erişebildiği bir sunucuda açılmalı. Yerel ağ dışına
        kendiliğinden yayımlanmaz; Twitch sohbeti entegrasyonu değildir.
      </p>
      <details>
        <summary>OBS WebSocket 5 · isteğe bağlı</summary>
        <p>
          OBS → Araçlar → WebSocket sunucusu. Şifre yalnız bu bağlantı formunda
          tutulur, kampanya paketine eklenmez.
        </p>
        <Field label="OBS WebSocket adresi">
          <input
            maxLength={100}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Field>
        <Field label="OBS WebSocket şifresi">
          <input
            type="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <button
          onClick={() =>
            obs.connect(url, password).catch((e) => notify(e.message))
          }
        >
          OBS’ye bağlan
        </button>
        <button onClick={obs.disconnect}>OBS bağlantısını kapat</button>
        <p>{obs.status}</p>
        {obs.connected && (
          <p>Sahne panelinde kayıtlı sahneye OBS sahnesi bağlayabilirsin.</p>
        )}
      </details>
      <details>
        <summary>Klavye ve hızlı panel</summary>
        {Object.entries(p.shortcuts).map(([key, binding]) => (
          <Field key={key} label={key}>
            <input
              maxLength={100}
              value={binding}
              onChange={(e) => {
                const v = e.target.value
                if (/^(F5|Escape|Control\+(r|w|l|t))$/i.test(v)) {
                  notify(
                    'Bu tarayıcı kısayolu korunuyor. Alt ile başlayan bir birleşim seç.',
                  )
                  return
                }
                change((p) => ({
                  ...p,
                  shortcuts: { ...p.shortcuts, [key]: v },
                }))
              }}
            />
          </Field>
        ))}
        <Field label="Sabit komutlar · her satır bir kimlik">
          <textarea
            maxLength={10000}
            value={p.quick.join('\n')}
            onChange={(e) =>
              change((p) => ({
                ...p,
                quick: e.target.value.split('\n').filter(Boolean).slice(0, 24),
              }))
            }
          />
        </Field>
        <p>
          take, break, mute, map, roll-d20, next, previous veya
          scene:SAHNE_KİMLİĞİ kullanılabilir. Komut menüsünden sahne kimliğini
          sabitleyebilirsin.
        </p>
      </details>
      <button className="st-danger" onClick={() => perform('reset')}>
        Bu cihazdaki tüm Aruzahr verilerini sıfırla
      </button>
    </>
  )
}
