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
const StudioWorkspace = React.lazy(()=>import('./studio/StudioWorkspace'))
const StudioOutput = React.lazy(()=>import('./studio/StudioOutput'))
const StudioRemote = React.lazy(()=>import('./studio/StudioRemote'))
const BroadcastSlate = React.lazy(()=>import('./studio/BroadcastSlate'))
const BroadcastSlateLibrary = React.lazy(()=>import('./studio/BroadcastSlate').then(module=>({default:module.BroadcastSlateLibrary})))
function Root() {
  const [route, setRoute] = React.useState(() => window.location.hash.slice(1))
  React.useEffect(() => {
    const changed = () => setRoute(window.location.hash.slice(1))
    window.addEventListener('hashchange', changed)
    return () => window.removeEventListener('hashchange', changed)
  }, [])
  if(!route.startsWith('/broadcast'))return <App />
  const path=route.split('?')[0]
  let screen:React.ReactNode
  if(path==='/broadcast/starting')screen=<BroadcastSlate kind="starting"/>
  else if(path==='/broadcast/ending')screen=<BroadcastSlate kind="ending"/>
  else if(path==='/broadcast/screens')screen=<BroadcastSlateLibrary/>
  else if(path==='/broadcast/live')screen=<StudioOutput kind="main"/>
  else if(path.startsWith('/broadcast/output/')){const kind=path.split('/').at(-1);screen=<StudioOutput kind={['map','portraits','dice','initiative','break'].includes(kind||'')?kind as 'map':'main'}/>}
  else if(path==='/broadcast/remote')screen=<StudioRemote/>
  else if(path==='/broadcast/vote')screen=<StudioRemote voting/>
  else if(path==='/broadcast/classic')screen=<BroadcastWorkspace/>
  else screen=<StudioWorkspace/>
  return <React.Suspense fallback={<div role="status" className="collection-loading">Yayın masası açılıyor…</div>}><React.Fragment key={path}>{screen}</React.Fragment></React.Suspense>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Root /></React.StrictMode>)
