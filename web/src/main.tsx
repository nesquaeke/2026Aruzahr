import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-ext-400.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-ext-500.css'
import '@fontsource/dm-sans/latin-400.css'
import '@fontsource/dm-sans/latin-ext-400.css'
import '@fontsource/dm-sans/latin-500.css'
import '@fontsource/dm-sans/latin-ext-500.css'
import '@fontsource/dm-sans/latin-600.css'
import '@fontsource/dm-sans/latin-ext-600.css'
import App from './App'
import './styles.css'
import './experience.css'
import './atlas-refresh.css'
import './remaster.css'
import './character-cards.css'
import './modern.css'
import './relief.css'

const BroadcastWorkspace = React.lazy(() => import('./BroadcastWorkspace'))
function Root() {
  const [route, setRoute] = React.useState(() => window.location.hash.slice(1))
  React.useEffect(() => {
    const changed = () => setRoute(window.location.hash.slice(1))
    window.addEventListener('hashchange', changed)
    return () => window.removeEventListener('hashchange', changed)
  }, [])
  return route.startsWith('/broadcast') ? <React.Suspense fallback={<div role="status" className="collection-loading">Yayın masası açılıyor…</div>}><BroadcastWorkspace key={route.endsWith('/live') ? 'live' : 'director'} readOnly={route.endsWith('/live')} /></React.Suspense> : <App />
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Root /></React.StrictMode>)
