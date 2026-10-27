import { useEffect, useRef, useState } from 'react'
import { useStudio } from './context'
import { loadSound } from './media'
import './elevenlabs-panel.css'

type Voice = { id: string; name: string; description: string }
type Clip = { url: string; blob: Blob; name: string }
const headers = { 'X-Aruzahr-Voice': '1' }
async function voiceRequest(route: string, body?: unknown) {
  const response = await fetch('/__aruzahr-voices/' + route, {
    headers: { ...headers, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { method: 'POST', body: JSON.stringify(body) } : {}),
  })
  if (!response.ok) {
    const value = await response.json().catch(() => ({}))
    throw new Error(value.error || 'Yerel ses sunucusuna ulaşılamadı.')
  }
  return response
}

export default function ElevenLabsPanel() {
  const { p, change, notify } = useStudio()
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [voices, setVoices] = useState<Voice[]>([])
  const [voiceId, setVoiceId] = useState('')
  const [query, setQuery] = useState('')
  const [text, setText] = useState('')
  const [name, setName] = useState('Karakter konuşması')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [clip, setClip] = useState<Clip | null>(null)
  const [added, setAdded] = useState(false)
  const clipRef = useRef<Clip | null>(null)
  useEffect(() => {
    let cancelled = false
    voiceRequest('status').then(r => r.json()).then(value => {
      if (!cancelled) setConfigured(value.configured === true)
    }).catch(e => { if (!cancelled) setError((e as Error).message) })
    return () => { cancelled = true; if (clipRef.current) URL.revokeObjectURL(clipRef.current.url) }
  }, [])
  async function getVoices() {
    setBusy(true); setError('')
    try {
      const value = await (await voiceRequest('voices')).json()
      setVoices(value.voices)
      if (!voiceId && value.voices[0]) setVoiceId(value.voices[0].id)
    } catch (e) { setError((e as Error).message) }
    finally { setBusy(false) }
  }
  async function generate() {
    setBusy(true); setError('')
    try {
      const value = await (await voiceRequest('generate', { text, voiceId })).json()
      const blob = await (await voiceRequest('audio/' + value.id)).blob()
      if (clipRef.current) URL.revokeObjectURL(clipRef.current.url)
      const next = { blob, url: URL.createObjectURL(blob), name: name.trim() || 'Karakter konuşması' }
      clipRef.current = next; setClip(next); setAdded(false)
    } catch (e) { setError((e as Error).message) }
    finally { setBusy(false) }
  }
  async function addClip() {
    if (!clip) return
    setBusy(true); setError('')
    try {
      const asset = await loadSound(new File([clip.blob], clip.name + '.mp3', { type: 'audio/mpeg' }), 'effect')
      if (p.audioAssets.length >= 64 && !p.audioAssets.some(a => a.id === asset.id)) throw new Error('Ses kütüphanesi dolu. Kullanmadığın bir kaydı kaldır.')
      change(p => {
        return { ...p, audioAssets: [...p.audioAssets.filter(a => a.id !== asset.id), { ...asset, license: 'ElevenLabs üretimi · kullanım koşulları hesabına bağlıdır' }] }
      })
      setAdded(true)
      notify('Konuşma ses kütüphanesine eklendi. Tek seferlik efekt listesinden seçip hazırlayabilirsin.')
    } catch (e) { setError((e as Error).message) }
    finally { setBusy(false) }
  }
  const visibleVoices = voices.filter(v => (v.name + ' ' + v.description).toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')))
  return (
    <details className="st-elevenlabs" data-testid="elevenlabs-panel">
      <summary>Karakterlere ses ver · ElevenLabs</summary>
      <p>Yalnız okunmasını istediğin konuşmayı yaz. <strong>Ses üret</strong>, bu metni ElevenLabs’a gönderir ve hesabındaki krediyi kullanır. Hazırlamak veya dinlemek kendiliğinden yayına göndermez.</p>
      {configured === false && (
        <div className="st-voice-setup" role="status">
          <strong>API anahtarı henüz eklenmedi.</strong>
          <p><code>web/.env.local.example</code> dosyasını <code>web/.env.local</code> adıyla kopyala. İçine <code>ELEVENLABS_API_KEY=anahtarın</code> yaz; yerel sunucuyu kapatıp tekrar başlat.</p>
          <p>Anahtarı sohbet, GitHub veya <code>VITE_</code> değişkenine yazma. Anahtar sunucuda kalır.</p>
        </div>
      )}
      {configured === null && !error && <p role="status">Yerel ses bağlantısı kontrol ediliyor…</p>}
      {configured && <>
        <button disabled={busy} onClick={getVoices}>{voices.length ? 'Ses listesini yenile' : 'ElevenLabs seslerimi getir'}</button>
        {voices.length > 0 && <>
          <label className="st-field"><span>Ses ara</span><input value={query} maxLength={100} placeholder="Sesin adı veya açıklaması" onChange={e => setQuery(e.target.value)} /></label>
          <label className="st-field"><span>Konuşacak ses</span><select value={voiceId} onChange={e => setVoiceId(e.target.value)}>{!visibleVoices.some(v => v.id === voiceId) && <option value={voiceId}>{voices.find(v => v.id === voiceId)?.name || 'Bir ses seç'}</option>}{visibleVoices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
          <p className="st-muted">{voices.find(v => v.id === voiceId)?.description || 'Türkçe için çok dilli model kullanılır.'}</p>
        </>}
        <label className="st-field"><span>Kayıt adı · örneğin Ulven’in uyarısı</span><input value={name} maxLength={100} onChange={e => setName(e.target.value)} /></label>
        <label className="st-field"><span>Yüksek sesle okunacak sözler</span><textarea rows={5} maxLength={2500} value={text} onChange={e => setText(e.target.value)} placeholder="Karakterin oyunculara söyleyeceği sözleri buraya yaz." /></label>
        <small>{text.length}/2500 karakter · DM sırları otomatik eklenmez.</small>
        <button disabled={busy || !voiceId || !text.trim()} onClick={generate}>{busy ? 'Ses isteği işleniyor…' : 'Ses üret · ElevenLabs'}</button>
      </>}
      {error && <p className="st-voice-error" role="alert">{error}</p>}
      {clip && <div className="st-voice-result">
        <strong>{clip.name}</strong>
        <audio controls src={clip.url} aria-label="Üretilen konuşmayı önceden dinle" />
        <div><a href={clip.url} download={clip.name + '.mp3'}>MP3 indir</a><button disabled={busy || added} onClick={addClip}>{added ? 'Ses kütüphanesine eklendi' : 'Ses kütüphanesine ekle'}</button></div>
        <p>Dinlemeden sonra kütüphaneye ekle. Aşağıdaki <strong>Tek seferlik efekt</strong> listesinden bu adı seç; hazırlayıp yayına al. Bu ekrandan çıkmadan indirmediğin veya eklemediğin önizleme geçicidir.</p>
      </div>}
    </details>
  )
}
