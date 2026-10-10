import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Search, Users, X } from 'lucide-react'
import { characters } from './lore/characters'
import { normalize, placeById, regions } from './data'
import { artworks, portraitFor } from './media'
import CharacterCard, { CharacterFrameLegend } from './CharacterCard'
import CharacterAbilities from './CharacterAbilities'
import { ArtworkButton, ImageViewer } from './MediaGallery'
import './characters.css'

export default function CharactersHub({ navigate }: { navigate: (path: string) => void }) {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('all')
  const [city, setCity] = useState('all')
  const [affiliation, setAffiliation] = useState('all')
  const [limit, setLimit] = useState(24)
  const [imageIndex, setImageIndex] = useState<number | null>(null)
  const unknown = useMemo(() => {
    const known = new Set(characters.flatMap(person => [person.portrait, portraitFor(person.portrait)?.id]))
    return Object.values(artworks).filter(art => art.portrait && art.origin === 'author' && !known.has(art.id))
  }, [])
  const needle = normalize(query.trim())
  const cityOptions = [...new Set(characters.filter(person => country === 'all' || (person.region || 'danstsud') === country).map(person => person.city))].sort((a,b) => (placeById(a)?.name || a).localeCompare(placeById(b)?.name || b,'tr'))
  const affiliations = [...new Set(characters.map(person => person.affiliation))].sort((a,b) => a.localeCompare(b,'tr'))
  const matches = characters.filter(person => (country === 'all' || (person.region || 'danstsud') === country) && (city === 'all' || person.city === city) && (affiliation === 'all' || person.affiliation === affiliation) && (!needle || normalize([person.name,person.role,person.affiliation,person.origin,placeById(person.city)?.name,...person.traits].join(' ')).includes(needle)))
  const reset = () => {setQuery('');setCountry('all');setCity('all');setAffiliation('all');setLimit(24)}
  return <div className="characters-hub" data-testid="characters-hub">
    <header className="characters-intro"><div><span className="eyebrow"><Users size={15} /> VALHUNAR’IN İNSANLARI</span><h1>Her yüzün<br /><em>bir hikâyesi var.</em></h1><p>Tahtın çevresinden yol kenarındaki yazı tezgâhına. Birini tanı; bağlı olduğu yere ve hayatına yaklaş.</p></div><div className="character-tally"><strong>{characters.length}</strong><span>kişi · aynı dünyanın içinde</span></div></header>
    <div className="character-hub-tools"><label className="character-hub-search"><Search size={18} /><input type="search" aria-label="Karakter adı veya görevi" placeholder="Bir isim, meslek veya kurum…" value={query} onChange={event => {setQuery(event.target.value);setLimit(24)}} />{query && <button aria-label="Karakter aramasını temizle" onClick={() => setQuery('')}><X size={16} /></button>}</label>
      <div className="character-hub-filters"><label>Ülke<select aria-label="Karakterin ülkesi" value={country} onChange={event => {setCountry(event.target.value);setCity('all');setLimit(24)}}><option value="all">Bütün ülkeler</option>{regions.map(region => <option value={region.id} key={region.id}>{region.name}</option>)}</select></label>
      <label>Yer<select aria-label="Karakterin şehri" value={city} onChange={event => {setCity(event.target.value);setLimit(24)}}><option value="all">Bütün yerler</option>{cityOptions.map(id => <option value={id} key={id}>{placeById(id)?.name || regions.find(region => region.id === id)?.name || id}</option>)}</select></label>
      <label>Kurum<select aria-label="Karakterin kurumu" value={affiliation} onChange={event => {setAffiliation(event.target.value);setLimit(24)}}><option value="all">Bütün kurumlar ve çevreler</option>{affiliations.map(name => <option value={name} key={name}>{name}</option>)}</select></label></div>
    </div>
    <div className="character-results" role="status"><span>{matches.length} kişi bulundu · {Math.min(limit,matches.length)} gösteriliyor</span><button onClick={reset}>Filtreleri temizle</button></div>
    <CharacterFrameLegend />
    <p className="character-draft-note">STR, DEX, CON, INT, WIS ve CHA değerleri D&D oyun taslağıdır. İşlemeli çerçeve ise dövüş, büyü ve siyasi nüfuzun birleşik etkisini gösterir.</p>
    {matches.length ? <div className="character-hub-grid">{matches.slice(0,limit).map(person => {
      const portrait=portraitFor(person.portrait)
      return <article className="character-directory-entry" key={person.id} data-character-id={person.id}>
        <a href={`#/wiki/${person.id}`} onClick={event => {event.preventDefault();navigate(`/wiki/${person.id}`)}} aria-label={`${person.name} karakterini tanı`}>
          {portrait ? <CharacterCard id={person.id} src={portrait.src} name={person.name} role={person.role} /> : <div className="character-directory-placeholder"><Users size={36} /><strong>{person.name}</strong></div>}
        </a><div className="character-directory-info"><span>{placeById(person.city)?.name || regions.find(region => region.id === person.city)?.name}</span><p>{person.summary}</p><CharacterAbilities id={person.id} compact /><a href={`#/wiki/${person.id}`} onClick={event => {event.preventDefault();navigate(`/wiki/${person.id}`)}}><BookOpen size={14} /> Hayatı ve bağları <ArrowRight size={15} /></a></div>
      </article>
    })}</div> : <div className="character-directory-empty"><Users size={36} /><h2>Bu aramada kimse bulunamadı.</h2><button onClick={reset}>Bütün karakterlere dön</button></div>}
    {matches.length > limit && <div className="character-load-controls"><button onClick={() => setLimit(limit+24)}>Sonraki {Math.min(24,matches.length-limit)} kişiyi göster</button><button onClick={() => setLimit(matches.length)}>Bütün {matches.length} kişiyi göster</button></div>}
    {!!unknown.length && <details className="unidentified-portraits"><summary>Kimliği henüz açıklanmayan portreler · {unknown.length}</summary><p>Bu görseller arşivde korunur. Kimlik, görev veya D&D değeri atanmaz.</p><div>{unknown.map((art,index) => <ArtworkButton key={art.id} item={art} onClick={() => setImageIndex(index)} />)}</div></details>}
    <ImageViewer items={unknown} index={imageIndex} setIndex={setImageIndex} />
  </div>
}
