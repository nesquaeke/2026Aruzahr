import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine, BookOpen, Check, ChevronDown, CircleUserRound, Dices, Eraser, Eye, EyeOff, FileUp, Hand, Image as ImageIcon, LayoutPanelLeft, Map, MonitorPlay, MoveUpRight, Pencil, Plus, Radio, RotateCcw, Save, Trash2, Undo2, Users, X } from 'lucide-react'
import BroadcastStage from './BroadcastStage'
import type { BroadcastTool } from './BroadcastStage'
import BroadcastLibrary, { broadcastAssets } from './BroadcastLibrary'
import type { BroadcastAsset } from './BroadcastLibrary'
import BroadcastDice from './BroadcastDice'
import { newBroadcastState, saveBroadcast, loadBroadcast, freshId, imageAsset, downloadBroadcast, parseBroadcastFile, validateBroadcastState } from './broadcast-state'
import type { BroadcastState, StageActor } from './broadcast-state'
import type { MapToken } from './BroadcastMap'
import { powerFor } from './character-card-profiles'
import { placeById } from './data'
import BroadcastQuestDirector from './BroadcastQuestDirector'
import type { DMScene } from './dm-guide'
import { downloadPrivateNotes } from './dm-guide'
import { clearAruzahrData } from './broadcast-reset'
import { useBroadcastRelay, publicRelayState } from './useBroadcastRelay'
import './broadcast-workspace.css'

const CHANNEL = 'aruzahr-broadcast-v1'
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export default function BroadcastWorkspace({ readOnly = false }: { readOnly?: boolean }) {
  const [state, setState] = useState<BroadcastState>(newBroadcastState)
  const [ready, setReady] = useState(false)
  const [panel, setPanel] = useState<'library' | 'party' | 'dice' | 'quests' | 'session'>(window.location.hash.endsWith('/reset') ? 'session' : 'library')
  const [tool, setTool] = useState<BroadcastTool>('pan')
  const [color, setColor] = useState('#e4bc74'), [brushWidth, setBrushWidth] = useState(14)
  const [kind, setKind] = useState<MapToken['kind']>('party')
  const [tokenName, setTokenName] = useState(''), [partyAsset, setPartyAsset] = useState('')
  const [message, setMessage] = useState(''), [storageStatus, setStorageStatus] = useState('Hazırlanıyor')
  const [audienceOnline, setAudienceOnline] = useState(false), [controllerOnline, setControllerOnline] = useState(false)
  const [relayOnline, setRelayOnline] = useState(false)
  const [resetDialog, setResetDialog] = useState(false), [resetWord, setResetWord] = useState(''), [resetBusy, setResetBusy] = useState(false)
  const [resolution, setResolution] = useState('3840×2160')
  const resetting = useRef(false)
  const stateRef = useRef(state); stateRef.current = state
  const readyRef = useRef(false), channel = useRef<BroadcastChannel | null>(null)
  const receivedRemote = useRef(false)
  const pendingRelay = useRef<BroadcastState | null>(null)
  const senderId = useRef(freshId('window')), publishFrame = useRef(0), lastPeer = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null), uploadRef = useRef<HTMLInputElement>(null)
  const saveQueue = useRef(Promise.resolve())
  const allAssets = [...broadcastAssets, ...state.customAssets]

  const update = useCallback((patch: Partial<BroadcastState>) => {
    if (readOnly) return
    if (patch.strokes && patch.strokes.length > 500) { setMessage('500 çizim sınırına ulaştın. Eski izleri silerek devam edebilirsin.'); return }
    if (patch.strokes?.some(stroke => stroke.points.length > 2000)) {
      patch = { ...patch, strokes: patch.strokes.map(stroke => {
        if (stroke.points.length <= 2000) return stroke
        const points = Array.from({ length: 2000 }, (_, i) => stroke.points[Math.round(i / 1999 * (stroke.points.length - 1))])
        return { ...stroke, points }
      }) }
    }
    setState(previous => ({ ...previous, ...patch }))
  }, [readOnly])
  const publish = useCallback(() => {
    try { channel.current?.postMessage({ type: 'state', sender: senderId.current, state: publicRelayState(stateRef.current) }) } catch { /* A name can be temporarily empty while it is being edited. */ }
  }, [])
  const receiveRelay = useCallback((next: BroadcastState) => {
    receivedRemote.current = true
    // The local channel is faster. An earlier HTTP request must not move the
    // audience backwards after a newer local drag/camera update has arrived.
    if (Date.now() - lastPeer.current < 5000) { pendingRelay.current = next; return }
    pendingRelay.current = null
    setState(next)
  }, [])
  useBroadcastRelay({ state, ready, readOnly, onState: receiveRelay, onConnection: setRelayOnline })

  useEffect(() => {
    let cancelled = false
    loadBroadcast().then(saved => { if (!cancelled) { if (saved && !(readOnly && receivedRemote.current)) setState(saved); if (!readOnly) setStorageStatus('Yerel kayıt hazır') } }).catch(error => { if (!cancelled) { setStorageStatus('Otomatik kayıt kullanılamıyor'); setMessage(String(error.message || error)) } }).finally(() => {
      if (cancelled) return
      readyRef.current = true; setReady(true)
      channel.current?.postMessage({ type: readOnly ? 'hello-audience' : 'hello-controller', sender: senderId.current })
    })
    return () => { cancelled = true }
  }, [readOnly])

  useEffect(() => {
    if (!('BroadcastChannel' in window)) { setMessage('Pencereler arası bağlantı bu tarayıcıda yok. Yönetim penceresini tam ekran yakalayabilirsin.'); return }
    const bus = new BroadcastChannel(CHANNEL); channel.current = bus
    bus.onmessage = event => {
      const data = event.data
      if (!data || data.sender === senderId.current) return
      if (readOnly && data.type === 'state') {
        try { const next = validateBroadcastState(data.state); receivedRemote.current = true; pendingRelay.current = null; setState(next); setControllerOnline(true); lastPeer.current = Date.now() } catch { /* An invalid scene is never displayed. */ }
      }
      if (data.type === 'hello-audience' && !readOnly) { setAudienceOnline(true); lastPeer.current = Date.now(); if (readyRef.current) publish() }
      if ((data.type === 'hello-controller' || data.type === 'controller-heartbeat') && readOnly) {
        setControllerOnline(true); lastPeer.current = Date.now()
        if (data.type === 'hello-controller') bus.postMessage({ type: 'hello-audience', sender: senderId.current })
      }
      if (data.type === 'audience-heartbeat' && !readOnly) { setAudienceOnline(true); lastPeer.current = Date.now() }
      if (data.type === 'goodbye-audience' && !readOnly) setAudienceOnline(false)
      if (data.type === 'goodbye-controller' && readOnly) { lastPeer.current = 0; pendingRelay.current = null; setControllerOnline(false) }
    }
    bus.postMessage({ type: readOnly ? 'hello-audience' : 'hello-controller', sender: senderId.current })
    const timer = window.setInterval(() => {
      bus.postMessage({ type: readOnly ? 'audience-heartbeat' : 'controller-heartbeat', sender: senderId.current })
      if (readOnly && Date.now() - lastPeer.current >= 5000 && pendingRelay.current) { setState(pendingRelay.current); pendingRelay.current = null }
      if (Date.now() - lastPeer.current > 10000) { if (readOnly) setControllerOnline(false); else setAudienceOnline(false) }
    }, 3000)
    return () => { window.clearInterval(timer); cancelAnimationFrame(publishFrame.current); bus.postMessage({ type: readOnly ? 'goodbye-audience' : 'goodbye-controller', sender: senderId.current }); bus.close(); channel.current = null }
  }, [readOnly, publish])

  useEffect(() => {
    if (!ready || readOnly || resetting.current) return
    cancelAnimationFrame(publishFrame.current)
    publishFrame.current = requestAnimationFrame(publish)
    setStorageStatus('Kaydediliyor')
    const timer = window.setTimeout(() => {
      if (resetting.current) return
      const snapshot = stateRef.current
      saveQueue.current = saveQueue.current.catch(() => {}).then(() => saveBroadcast(snapshot)).then(() => setStorageStatus('Kaydedildi')).catch(error => { setStorageStatus('Kayıt başarısız'); setMessage(error.message) })
    }, 450)
    return () => clearTimeout(timer)
  }, [state, ready, readOnly, publish])

  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(''), 6000); return () => clearTimeout(timer) }, [message])
  useEffect(() => {
    if (readOnly) return
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.matches('input,textarea,select,[contenteditable]')) return
      if (event.key.toLowerCase() === 'b') { event.preventDefault(); update({ blackout: !stateRef.current.blackout }) }
      if (event.key === 'Escape') setTool('pan')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [readOnly, update])

  function assetById(id: string) { return [...broadcastAssets, ...stateRef.current.customAssets].find(asset => asset.id === id) }
  function addActor(input: BroadcastAsset, point?: [number, number], reveal = false, asPortrait = false, displayName?: string) {
    const asset = assetById(input.id)
    if (!asset) return
    if (stateRef.current.actors.length >= 40) { setMessage('Sahnede en fazla 40 görsel tutabilirsin.'); return }
    const n = stateRef.current.actors.length, isImage = !asPortrait && (reveal || asset.kind !== 'portrait')
    const w = isImage ? 48 : 13, h = isImage ? 66 : 35
    const actor: StageActor = { id: freshId('actor'), assetId: asset.id, name: displayName?.trim() || asset.name, src: asset.src, kind: isImage ? 'image' : 'portrait', x: clamp(point ? point[0] * 100 : isImage ? 28 : 20 + n % 5 * 14, 0, 100 - w), y: clamp(point ? point[1] * 100 : isImage ? 14 : 58, 0, 100 - h), w, h, hidden: false, tier: powerFor(asset.id) }
    update({ actors: [...stateRef.current.actors, actor] })
  }
  function addToken(asset?: BroadcastAsset, x?: number, y?: number, name?: string) {
    if (stateRef.current.tokens.length >= 200) { setMessage('Haritada en fazla 200 taş tutabilirsin.'); return }
    const known = asset ? assetById(asset.id) : undefined
    const point = placeById('marhalden')!.point!, center = stateRef.current.camera
    const token: MapToken = { id: freshId('token'), name: name?.trim() || known?.name || 'Yeni yolcu', src: known?.src, assetId: known?.id, x: clamp(x ?? center?.x ?? point[0], 0, 1), y: clamp(y ?? center?.y ?? point[1], 0, 1), kind, size: 48 }
    update({ tokens: [...stateRef.current.tokens, token] }); setMessage(`${token.name} haritaya eklendi.`)
  }
  function dropAsset(input: BroadcastAsset, x: number, y: number) {
    const asset = assetById(input.id); if (!asset) return
    if (stateRef.current.mode === 'map') addToken(asset, x, y)
    else if (asset.kind === 'scene') update({ scene: asset, sceneZoom: 1 })
    else addActor(asset, [x, y])
  }
  async function upload(files: File[]) {
    const remaining = 40 - stateRef.current.customAssets.length
    if (files.length > remaining) { setMessage('En fazla 40 yerel görsel saklayabilirsin. Önce eskileri kaldır.'); return }
    const result: BroadcastAsset[] = []
    for (const file of files) { try { result.push(await imageAsset(file)) } catch (error) { setMessage((error as Error).message) } }
    if (result.length) { update({ customAssets: [...stateRef.current.customAssets, ...result] }); setPartyAsset(result[0].id); setMessage(`${result.length} görsel eklendi. Sahnede veya haritada kullanabilirsin.`) }
  }
  function arrange(vertical: boolean) {
    const portraits = stateRef.current.actors.filter(a => a.kind === 'portrait'), n = portraits.length
    if (!n) return
    const rows = Math.min(5, n), h = Math.min(23, 86 / rows - 1), w = h * .39
    const bottomRows = Math.ceil(n / 10), columns = Math.ceil(n / bottomRows), bottomWidth = Math.min(13, 90 / columns - 1), bottomHeight = bottomWidth * 2.55
    update({ actors: stateRef.current.actors.map(a => { const i = portraits.findIndex(p => p.id === a.id); return i < 0 ? a : vertical ? { ...a, x: (stateRef.current.cameraLane ? 20 : 3) + Math.floor(i / rows) * (w + 2), y: 5 + i % rows * (h + 1), w, h } : { ...a, x: 4 + i % columns * (bottomWidth + 1), y: 98 - (Math.floor(i / columns) + 1) * (bottomHeight + 1), w: bottomWidth, h: bottomHeight } }) })
  }
  async function importSession(file?: File) {
    if (!file) return
    try { const next = await parseBroadcastFile(file); setState(next); setMessage('Oturum yedeği açıldı. DM notların ayrı tutuldu.') } catch (error) { setMessage((error as Error).message) }
  }
  function prepareScene(cue: DMScene) {
    const background = assetById(cue.backgroundId), portraits = cue.portraitIds.map(assetById)
    if (!background || portraits.some(p => !p)) { setMessage('Bu sahnenin görselleri bulunamadı. Güncel site dosyalarını kullan.'); return false }
    const actors: StageActor[] = portraits.map((asset, i) => ({ id: freshId('actor'), assetId: asset!.id, name: asset!.name, src: asset!.src, kind: 'portrait', x: (stateRef.current.cameraLane ? 21 : 4) + (i % 4) * 16, y: portraits.length > 4 ? 10 + Math.floor(i / 4) * 44 : 56, w: 13, h: 38, hidden: false, tier: powerFor(asset!.id) }))
    update({ mode:'scene',scene:background,sceneZoom:1,actors,roll:null,blackout:true,intermission:false,title:cue.publicTitle })
    setMessage('Sahne perde arkasında hazır. Oyunculara göster ile aç.'); return true
  }
  function focusQuestCity(id:string) { const point=placeById(id)?.point; if(point)update({mode:'map',camera:{x:point[0],y:point[1],zoom:6},blackout:false,intermission:false,title:placeById(id)!.name}) }
  async function toggleFullscreen() { try {if(document.fullscreenElement) await document.exitFullscreen();else await document.documentElement.requestFullscreen()} catch {setMessage('Tam ekran açılamadı. Tarayıcıda F11 kullanabilirsin.')} }
  async function resetAll() {
    if(resetWord !== 'SIFIRLA' || resetBusy)return
    resetting.current=true;setResetBusy(true)
    // Unmount private editors before deleting storage so their effects cannot rewrite it.
    setPanel('session')
    try {await saveQueue.current.catch(()=>{});const clean=newBroadcastState();stateRef.current=clean;setState(clean);publish();
      await fetch('/__aruzahr-broadcast/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(publicRelayState(clean))}).catch(()=>{})
      await clearAruzahrData();window.location.hash='/broadcast/classic';window.location.reload()
    } catch(e) {resetting.current=false;setResetBusy(false);setMessage((e as Error).message)}
  }
  function changeToken(id: string, patch: Partial<MapToken>) { update({ tokens: stateRef.current.tokens.map(t => t.id === id ? { ...t, ...patch } : t) }) }
  function changeActor(id: string, patch: Partial<StageActor>) { update({ actors: stateRef.current.actors.map(a => a.id === id ? { ...a, ...patch } : a) }) }
  async function copyOBS() { const url = new URL(window.location.href); url.hash = '/broadcast/live'; try { await navigator.clipboard.writeText(url.href); setMessage(`OBS Tarayıcı Kaynağı adresi kopyalandı. OBS kaynak ve tuval ölçüsünü ${resolution} seç.`); } catch { setMessage(`OBS adresi: ${url.href}`) } }
  async function saveNow() { try { await saveQueue.current; await saveBroadcast(stateRef.current); setStorageStatus('Kaydedildi'); setMessage('Oturum bu tarayıcıya kaydedildi.') } catch (error) { setMessage((error as Error).message) } }

  useEffect(() => { const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement)?.matches('input,textarea,select,[contenteditable]'))return;if(e.key.toLowerCase()==='f'){e.preventDefault();void toggleFullscreen()}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[])
  if (!ready) return <div className="broadcast-loading" role="status">Yayın masası hazırlanıyor…</div>
  if (readOnly) return <main className="broadcast-live" data-testid="broadcast-live" aria-label="OBS yayın görüntüsü"><BroadcastStage state={state} readOnly /><button className="broadcast-fullscreen" onClick={toggleFullscreen}>Tam ekran · F</button>{!(controllerOnline || relayOnline) && <div className="broadcast-live-status">Yönetim penceresi bekleniyor · son kayıt gösteriliyor</div>}</main>

  return <main className={`broadcast-workspace ${panel === 'quests' ? 'has-quest-panel' : ''}`} data-testid="broadcast-workspace">
    <header className="broadcast-header"><a href="#/atlas" className="broadcast-back" aria-label="Atlasa dön"><ArrowLeft size={18} /></a><div className="broadcast-brand"><span>ARUZAHR</span><h1>Yayın masası</h1></div><span className="broadcast-header-note">Hikâyeyi yönet. Dünyayı göster.</span><span className="broadcast-save-indicator"><i />{storageStatus}</span><a data-testid="broadcast-open-live" className="broadcast-live-button" href="#/broadcast/live" target="_blank" rel="noopener"><MonitorPlay size={16} /> Yayın penceresi <MoveUpRight size={13} /></a></header>
    <div className="broadcast-layout">
      <section className="broadcast-director" aria-label="Sahne yönetimi">
        <div className="broadcast-scene-bar"><div className="broadcast-mode-switch"><button aria-pressed={state.mode === 'map'} onClick={() => update({ mode: 'map' })}><Map size={16} /> Harita</button><button aria-pressed={state.mode === 'scene'} onClick={() => update({ mode: 'scene' })}><ImageIcon size={16} /> Sahne</button></div><button data-testid="broadcast-break-toggle" aria-pressed={!!state.intermission} onClick={() => update({ intermission: !state.intermission })}>{state.intermission ? 'Moladan dön' : 'Ara ver'}</button><span className={`broadcast-connection ${audienceOnline ? 'online' : ''}`}><i />{audienceOnline ? 'Yayın penceresi bağlı' : 'OBS adresi hazır'}</span><button data-testid="broadcast-blackout" className={state.blackout ? 'is-on' : ''} aria-pressed={state.blackout} onClick={() => update({ blackout: !state.blackout })}><EyeOff size={15} />{state.blackout ? 'Perdeyi aç' : 'Perdeyi kapat'}<kbd>B</kbd></button></div>
        <div className="broadcast-stage-wrap" ref={stageRef}><BroadcastStage state={state} tool={tool} color={color} width={brushWidth} onChange={update} onAssetDrop={dropAsset} /></div>
        <div className="broadcast-edit-toolbar"><div className="broadcast-tool-group" aria-label="Harita çizim araçları">{([{ id: 'pan', label: 'Haritayı taşı', Icon: Hand }, { id: 'pen', label: 'Kalem', Icon: Pencil }, { id: 'arrow', label: 'Ok çiz', Icon: MoveUpRight }, { id: 'erase', label: 'Silgi', Icon: Eraser }] as const).map(({ id, label, Icon }) => <button key={id} aria-label={label} title={label} aria-pressed={tool === id} disabled={state.mode !== 'map'} onClick={() => setTool(id)}><Icon size={17} /></button>)}</div><label className="broadcast-color"><span>Renk</span><input type="color" aria-label="Kalem rengi" value={color} onChange={event => setColor(event.target.value)} /></label><label className="broadcast-brush"><span>İz</span><input aria-label="Kalem kalınlığı" type="range" min="3" max="40" value={brushWidth} onChange={event => setBrushWidth(Number(event.target.value))} /></label><button aria-label="Son çizimi geri al" disabled={!state.strokes.length} onClick={() => update({ strokes: state.strokes.slice(0, -1) })}><Undo2 size={16} /></button><button aria-label="Bütün çizimleri temizle" disabled={!state.strokes.length} onClick={() => update({ strokes: [] })}><Eraser size={16} /><small>Temizle</small></button><span className="broadcast-toolbar-spacer" /><label className="broadcast-token-kind"><Users size={15} /><select aria-label="Eklenecek harita taşının türü" value={kind} onChange={event => setKind(event.target.value as MapToken['kind'])}><option value="party">Parti</option><option value="ally">Dost</option><option value="enemy">Düşman</option></select><ChevronDown size={12} /></label></div>
        <div className="broadcast-director-footer"><p><span>16:9</span> OBS’de <strong>Yayın penceresi</strong>ni yakala. Kameralarını OBS’den ekle.</p><button aria-pressed={state.cameraLane} onClick={() => update({ cameraLane: !state.cameraLane })}><LayoutPanelLeft size={15} /> Kamera alanı</button><button aria-pressed={state.showNames} onClick={() => update({ showNames: !state.showNames })}><Eye size={15} /> İsimler</button></div>
        <div className="broadcast-break-controls"><label>Ara ekranı mesajı<input aria-label="Ara ekranı mesajı" maxLength={160} value={state.breakMessage || ''} onChange={e=>update({breakMessage:e.target.value})} placeholder="Birazdan buradayız · çayını al, ateşe yaklaş…"/></label><button onClick={toggleFullscreen}>Tam ekran · F</button></div><section className="broadcast-run-sheet"><div><span className="broadcast-kicker">SAHNE BAŞLIĞI</span><input aria-label="Yayındaki sahne başlığı" value={state.title} maxLength={120} onChange={event => update({ title: event.target.value })} /></div><div className="broadcast-scene-info"><span className="broadcast-kicker">{state.mode === 'map' ? 'VALHUNAR ATLASI' : 'ARKA PLAN'}</span><strong>{state.mode === 'map' ? 'Marhalden’den batıya' : state.scene.name}</strong>{state.mode === 'scene' && <label>Yakınlık <input type="range" min="1" max="3" step=".05" aria-label="Sahne görselini büyüt" value={state.sceneZoom} onChange={event => update({ sceneZoom: Number(event.target.value) })} /></label>}</div></section>
        <details className="broadcast-quick-help"><summary>Masayı ilk kez kullanıyorsan</summary><ol><li>Yayın penceresini aç; OBS’de bu pencereyi yakala.</li><li>Bir şehir arka planını seç. Birden fazla portre ekle; sürükle, köşesinden büyüt.</li><li>Haritada parti/dost/düşman türünü seç; portreyi haritaya bırak veya Parti panelinden taş oluştur.</li><li>Kalemle rota çiz. Zar panelinden sesli zar at. B tuşuyla perdeyi kapat.</li><li>Görev sırlarını DM defterinde tut. Yedeğini indirerek başka bilgisayara taşı.</li></ol></details>
      </section>
      <aside className="broadcast-sidebar" aria-label="Yayın araçları"><nav className="broadcast-panel-tabs" aria-label="Yönetim panelleri">{([{ id: 'library', label: 'Görseller', Icon: ImageIcon }, { id: 'party', label: 'Parti', Icon: Users }, { id: 'dice', label: 'Zar', Icon: Dices }, { id: 'quests', label: 'Görevler', Icon: BookOpen }, { id: 'session', label: 'Oturum', Icon: Save }] as const).map(({ id, label, Icon }) => <button key={id} onClick={() => setPanel(id)} aria-pressed={panel === id}><Icon size={17} /><span>{label}</span></button>)}</nav>
        <div className="broadcast-panel" hidden={panel !== 'library'}><BroadcastLibrary customAssets={state.customAssets} onScene={asset => update({ scene: asset, mode: 'scene', sceneZoom: 1 })} onPortrait={asset => addActor(asset)} onReveal={asset => addActor(asset, undefined, true)} onUpload={upload} /></div>
        <div className="broadcast-panel broadcast-party-panel" hidden={panel !== 'party'}><div className="broadcast-panel-heading"><span className="broadcast-kicker">MASANIN İNSANLARI</span><h2>Parti & sahne</h2><p>Parti henüz belli değil. İsim ve portreleri istediğin zaman ekle.</p></div><form onSubmit={event => { event.preventDefault(); addToken(assetById(partyAsset), undefined, undefined, tokenName) }}><label>Taşın adı<input aria-label="Parti üyesinin adı" maxLength={100} value={tokenName} onChange={event => setTokenName(event.target.value)} placeholder="Bir isim yaz…" /></label><label>Portre<select aria-label="Parti üyesinin portresi" value={partyAsset} onChange={event => setPartyAsset(event.target.value)}><option value="">Baş harfleri kullan</option>{allAssets.filter(a => a.kind !== 'scene').map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}</select></label><div className="broadcast-two-buttons"><button type="submit" data-testid="broadcast-add-party"><Plus size={15} /> Haritaya ekle</button><button type="button" onClick={() => uploadRef.current?.click()}><FileUp size={15} /> Portre yükle</button></div><button className="broadcast-wide-button" type="button" disabled={!partyAsset} onClick={() => { const asset = assetById(partyAsset); if (asset) addActor(asset, undefined, false, true, tokenName) }}><CircleUserRound size={15} /> Portreyi sahneye ekle</button><input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={event => { void upload([...event.target.files || []]); event.target.value = '' }} /></form><h3>Harita taşları <span>{state.tokens.length}</span></h3>{!state.tokens.length && <p className="broadcast-empty-note">Henüz kimse yola çıkmadı. Parti üyeleri, dostlar ve düşmanlar burada görünecek.</p>}<div className="broadcast-token-list">{state.tokens.map(token => <div key={token.id} className="broadcast-token-row">{token.src ? <img src={token.src} alt="" /> : <CircleUserRound size={28} />}<label><input aria-label={`${token.name} taşının adı`} value={token.name} maxLength={100} onChange={event => changeToken(token.id, { name: event.target.value })} onBlur={event => { if (!event.target.value.trim()) changeToken(token.id, { name: 'Yeni yolcu' }) }} /><select aria-label={`${token.name} taşının türü`} value={token.kind} onChange={event => changeToken(token.id, { kind: event.target.value as MapToken['kind'] })}><option value="party">Parti</option><option value="ally">Dost</option><option value="enemy">Düşman</option></select></label><button aria-label={`${token.name} taşını kaldır`} onClick={() => update({ tokens: state.tokens.filter(t => t.id !== token.id) })}><Trash2 size={14} /></button></div>)}</div><h3>Sahne katmanları <span>{state.actors.length}</span></h3><div className="broadcast-two-buttons"><button onClick={() => arrange(true)}>Sola diz</button><button onClick={() => arrange(false)}>Alta diz</button></div>{state.actors.map(actor => <div key={actor.id} className="broadcast-layer-row"><input aria-label={`${actor.name} katmanının adı`} value={actor.name} maxLength={100} onChange={event => changeActor(actor.id, { name: event.target.value })} onBlur={event => { if (!event.target.value.trim()) changeActor(actor.id, { name: 'Görsel' }) }} /><button aria-label={`${actor.name} ${actor.hidden ? 'göster' : 'gizle'}`} onClick={() => changeActor(actor.id, { hidden: !actor.hidden })}>{actor.hidden ? <EyeOff size={14} /> : <Eye size={14} />}</button><button aria-label={`${actor.name} üste getir`} onClick={() => update({ actors: [...state.actors.filter(a => a.id !== actor.id), actor] })}><ArrowUpFromLine size={14} /></button><button aria-label={`${actor.name} katmanını kaldır`} onClick={() => update({ actors: state.actors.filter(a => a.id !== actor.id) })}><X size={14} /></button></div>)}</div>
        <div className="broadcast-panel broadcast-dice-panel" hidden={panel !== 'dice'}><div className="broadcast-panel-heading"><span className="broadcast-kicker">ŞANSIN SESİ</span><h2>Zar masası</h2><p>Sonuç yayın ekranında da döner. Ses bu yönetim penceresinden gelir.</p></div><BroadcastDice onRoll={roll => update({ roll })} /><button className="broadcast-wide-button" disabled={!state.roll} onClick={() => update({ roll: null })}>Zarı sahneden kaldır</button></div>
        <div className="broadcast-panel broadcast-quest-panel" hidden={panel !== 'quests'}>{!resetBusy && <BroadcastQuestDirector onPrepare={prepareScene} onReveal={()=>update({blackout:false,intermission:false})} onMap={focusQuestCity} onMessage={setMessage}/>}</div>
        <div className="broadcast-panel broadcast-session-panel" hidden={panel !== 'session'}><div className="broadcast-panel-heading"><span className="broadcast-kicker">OTURUMA DEVAM ET</span><h2>Kaydet & taşı</h2><p>Harita taşların, çizimlerin, sahne katmanların ve yüklediğin portreler bu tarayıcıda saklanır.</p></div><label className="broadcast-resolution">OBS kaynak / tuval ölçüsü<select aria-label="OBS yayın çözünürlüğü" value={resolution} onChange={e=>setResolution(e.target.value)}><option>3840×2160</option><option>1920×1080</option><option>2560×1440</option></select></label><p>Monitörün 4K olabilir. OBS Tarayıcı Kaynağı ve yayın tuvali aynı 16:9 ölçüde olsun. Kaynağa sağ tık → Dönüştür → Ekrana sığdır.</p><button className="broadcast-wide-button" onClick={copyOBS}><MonitorPlay size={17} /> OBS adresini kopyala</button><button className="broadcast-wide-button" data-testid="broadcast-save-session" onClick={saveNow}><Save size={17} /> Şimdi kaydet</button><button className="broadcast-wide-button" onClick={() => { try { downloadBroadcast(stateRef.current) } catch (error) { setMessage((error as Error).message) } }}><ArrowDownToLine size={17} /> Oturum yedeğini indir</button><label className="broadcast-upload-label"><ArrowUpFromLine size={17} /> Oturum yedeği aç<input data-testid="broadcast-load-session" type="file" accept=".json,.aruzahr" onChange={event => { void importSession(event.target.files?.[0]); event.target.value = '' }} /></label><div className="broadcast-session-info"><Check size={17} /><p>DM notları ayrı kalır. Yayın penceresi yalnızca sahneyi alır. Bu araçlar aynı bilgisayar ve tarayıcıdaki pencereler arasında çalışır.</p></div><h3>Yerel görseller <span>{state.customAssets.length}</span></h3>{state.customAssets.map(asset => <div className="broadcast-layer-row" key={asset.id}><span>{asset.name}</span><button aria-label={`${asset.name} yerel görselini kaldır`} onClick={() => update({ customAssets: state.customAssets.filter(a => a.id !== asset.id) })}><Trash2 size={14} /></button></div>)}<button className="broadcast-reset" onClick={() => { if (window.confirm('Sahne, taşlar ve çizimler temizlensin mi? DM notların kalır.')) { setState(newBroadcastState()); setMessage('Yayın masası temizlendi.') } }}><RotateCcw size={15} /> Yeni oturum başlat</button><button className="broadcast-reset broadcast-danger" onClick={()=>{setResetWord('');setResetDialog(true)}}>Bu cihazdaki tüm Aruzahr verilerini sıfırla</button></div>
      </aside>
    </div>
    {resetDialog && <div className="broadcast-reset-overlay"><section role="dialog" aria-modal="true" aria-labelledby="reset-title"><h2 id="reset-title">Tüm yerel verileri sıfırla</h2><p>Bu tarayıcıdaki Aruzahr sahneleri, yüklenen portreler, harita çizimleri, taşlar, DM paketi, özel notlar, görev kararları, kitap işaretleri ve tercihler silinir. Kaynak lore ve site görselleri korunur.</p><div className="broadcast-two-buttons"><button onClick={()=>downloadBroadcast(stateRef.current)}>Sahne yedeğini indir</button><button onClick={downloadPrivateNotes}>Özel DM defterini indir</button></div><label>Devam etmek için SIFIRLA yaz<input autoFocus aria-label="Sıfırlama onayı" value={resetWord} onChange={e=>setResetWord(e.target.value)} /></label><div className="broadcast-two-buttons"><button disabled={resetBusy} onClick={()=>setResetDialog(false)}>Vazgeç</button><button className="broadcast-danger" disabled={resetWord!=='SIFIRLA' || resetBusy} onClick={resetAll}>{resetBusy?'Siliniyor…':'Her şeyi sıfırla'}</button></div></section></div>}
    {message && <div className="broadcast-toast" role="status">{message}</div>}
  </main>
}
