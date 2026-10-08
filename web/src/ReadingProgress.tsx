import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ReadingProgress({ id }: { id: string }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const article = document.querySelector<HTMLElement>('.wiki-article')
    if (!article) return
    let frame = 0
    const update = () => {
      frame = 0
      const top = article.getBoundingClientRect().top + window.scrollY
      const distance = Math.max(1, article.offsetHeight - window.innerHeight + 100)
      setProgress(Math.round(Math.max(0, Math.min(100, (window.scrollY - top + 80) / distance * 100))))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new ResizeObserver(schedule)
    observer.observe(article)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => { observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame) }
  }, [id])
  return <><div className="reading-progress" role="progressbar" aria-label="Okuma ilerlemesi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>{progress > 8 && <button className="reading-return" aria-label="Makalenin başına dön" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowUp size={18} /><span>{progress}%</span></button>}</>
}
