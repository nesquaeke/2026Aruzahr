import './broadcast-director.css'
export default function BroadcastBreak({ message }: { message: string }) {
  return <div className="broadcast-break" data-testid="broadcast-break"><div className="broadcast-break-map" /><div className="broadcast-break-mist" /><div className="broadcast-break-grain" /><div className="broadcast-break-copy"><span>ARUZAHR</span><i /><h2>Kısa bir mola</h2><p>{message || 'Ateşi canlı tut. Hikâye birazdan devam edecek.'}</p><small>YOLCULUK DEVAM EDECEK</small></div></div>
}
