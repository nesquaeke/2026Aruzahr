import { useEffect, useState } from 'react'
import type { StudioPublic } from './studio/types'
import './broadcast-director.css'
export default function BroadcastBreak({ message, info }: { message: string; info?: StudioPublic['break'] }) {
  const [now,setNow]=useState(Date.now)
  useEffect(()=>{if(!info?.until)return;const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[info?.until])
  const remaining=info?.paused ?? (info?.until ? Math.max(0, info.until-now) : null)
  return <div className="broadcast-break" data-testid="broadcast-break"><div className="broadcast-break-map" /><div className="broadcast-break-mist" /><div className="broadcast-break-grain" /><div className="broadcast-break-copy"><span>ARUZAHR</span><i /><h2>Kısa bir mola</h2><p>{message || 'Ateşi canlı tut. Hikâye birazdan devam edecek.'}</p>{remaining!==null&&<strong className="studio-break-countdown">{Math.floor(remaining/60000).toString().padStart(2,'0')}:{Math.floor(remaining%60000/1000).toString().padStart(2,'0')}{info?.paused!==null&&' · duraklatıldı'}</strong>}{info?.summary&&<p>{info.summary}</p>}<small>{info?.campaign || 'YOLCULUK DEVAM EDECEK'}</small></div></div>
}
