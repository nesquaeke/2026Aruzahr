import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Download, ExternalLink, Film, ArrowLeft } from 'lucide-react'
import { drawSlate, slateArt, slateDuration, type SlateKind } from './slate-renderer'
import './broadcast-slates.css'

declare global { interface Window { __aruzahrSlate?: { ready: boolean; draw: (seconds: number) => void; duration: number } } }
export default function BroadcastSlate({ kind }: { kind: SlateKind }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let stopped = false, frame = 0
    const capture = new URLSearchParams(window.location.hash.split('?')[1] || '').get('capture') === '1'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const art = new Image(); art.src = slateArt(kind)
    let width = 1920, height = 1080
    const draw = (seconds: number) => {
      if (!canvas.current || !art.complete || !art.naturalWidth) return
      if (canvas.current.width !== width) canvas.current.width = width
      if (canvas.current.height !== height) canvas.current.height = height
      const ctx = canvas.current.getContext('2d', { alpha: false }); if (ctx) drawSlate(ctx, art, kind, seconds)
    }
    const resize = () => {
      width = capture ? 1920 : Math.min(3840, Math.max(1920, window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)))
      height = Math.round(width * 9 / 16)
    }
    resize(); window.addEventListener('resize', resize)
    let last = -Infinity, start = 0
    const animate = (now: number) => {
      if (stopped) return
      if (!start) start = now
      if (now - last >= 1000 / 30) { draw(reduced.matches ? 0 : (now - start) / 1000); last = now }
      frame = requestAnimationFrame(animate)
    }
    art.onerror = () => setError(true)
    Promise.all([art.decode(), document.fonts.load('400 106px "Cormorant Garamond"'), document.fonts.load('400 17px "DM Sans"')]).then(() => {
      if (stopped) return
      draw(0)
      if (capture) window.__aruzahrSlate = { ready: true, draw, duration: slateDuration }
      else frame = requestAnimationFrame(animate)
    }).catch(() => { if (!stopped) setError(true) })
    return () => { stopped = true; cancelAnimationFrame(frame); window.removeEventListener('resize', resize); if (capture) delete window.__aruzahrSlate }
  }, [kind])
  return <main className="broadcast-slate" data-testid={'broadcast-slate-' + kind} aria-label={kind === 'starting' ? 'Aruzahr · Yayın başlıyor' : 'Aruzahr · Yayın sona erdi'}>
    <canvas ref={canvas} width={1920} height={1080} role="img" aria-label={kind === 'starting' ? 'Marhalden gözetleme odası. Yayın başlıyor.' : 'Karlan yol evinde kapalı defter. Yayın sona erdi.'} />
    {error && <div className="slate-error" role="alert">Yayın tablosu yüklenemedi. Sayfayı yenile veya indirdiğin MP4 dosyasını OBS’de aç.</div>}
  </main>
}

export function BroadcastSlateLibrary() {
  const [copied, setCopied] = useState('')
  async function copy(kind: SlateKind) { try { const url = new URL(window.location.href); url.hash = '/broadcast/' + kind; await navigator.clipboard.writeText(url.href); setCopied(kind) } catch { setCopied('error') } }
  return <main className="slate-library">
    <header><a href="#/broadcast"><ArrowLeft size={15} /> Yayın Masası</a><span>ARUZAHR · YAYIN KOLEKSİYONU</span><h1>Hikâyenin iki eşiği.</h1><p>Açılışta bekleyiş, kapanışta sessizlik. İki bağımsız tablo; dışarıda yavaş kar, odada kandil ışığı. Oyun kayıtların ve canlı sahnen bu ekrandan değiştirilmez.</p></header>
    <section className="slate-library-grid">{(['starting', 'ending'] as const).map(kind => <article key={kind}><a className="slate-preview" href={'#/broadcast/' + kind} target="_blank" rel="noreferrer"><img src={slateArt(kind)} alt={kind === 'starting' ? 'Marhalden gözetleme odası' : 'Karlan yol evinde gece'} /><span><Film size={18} /> Hareketli önizlemeyi aç</span></a><div><small>{kind === 'starting' ? '01 · YOL HAZIR' : '02 · DEFTER KAPANIR'}</small><h2>{kind === 'starting' ? 'Yayın başlıyor.' : 'Bu gecelik son sayfa.'}</h2><p>20 saniyelik kesintisiz döngü · 1920×1080 · 30 FPS · sessiz MP4</p><div className="slate-library-actions"><a href={'/downloads/Aruzahr-' + (kind === 'starting' ? 'Yayin-Basliyor' : 'Yayin-Sona-Erdi') + '-1080p.mp4'} download><Download size={15} /> MP4 indir</a><button onClick={() => void copy(kind)}>{copied === kind ? <Check size={15} /> : <Copy size={15} />}{copied === kind ? 'Kopyalandı' : 'OBS adresini kopyala'}</button><a href={'#/broadcast/' + kind} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Ekranı aç</a></div></div></article>)}</section>
    {copied === 'error' && <p role="status">Adres kopyalanamadı. Önizlemeyi açıp tarayıcının adres çubuğundan kopyalayabilirsin.</p>}
    <section className="slate-howto"><h2>OBS’ye iki ayrı sahne olarak ekle.</h2><p><strong>En kolay:</strong> OBS’de “Açılış” sahnesi oluştur → Medya Kaynağı → indirdiğin MP4 → <strong>Döngü</strong> açık. Aynısını “Kapanış” için yap. Kendi müziğini ayrı bir ses kaynağı olarak ekle. Videolarda zorunlu ses yoktur.</p><p><strong>Tarayıcı seçeneği:</strong> Kopyaladığın adresi 1920×1080 Tarayıcı Kaynağına yapıştır. Bu iki ekran yerel yayın rölesi istemez; sitedeki barındırılmış adresinde de çalışır. Asıl oyun yayını için yerel <code>/#/broadcast/live</code> adresini kullan.</p><p>30 FPS dosyalar ayrı tablolardan hazırlanmış hareketli kompozitlerdir; mimariyi dönüştüren üretken video değildir. Kaynak tabloların doğal çözünürlüğü 1672×941’dir. OBS’de 1080p çıktı için ölçeklenir.</p><a href="/downloads/Aruzahr-OBS-Kurulum-Rehberi.md" download>Kamera, müzik ve yayın kontrol listesini indir</a></section>
  </main>
}
