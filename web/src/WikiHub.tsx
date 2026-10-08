import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Crown,
  MapPin,
  ScrollText,
  Users,
  Waves,
  X,
} from "lucide-react";
import type { LoreArticle, Place, Region, Subregion } from "./data";
import { loreKindLabels, places, locationById, regionById, normalize } from "./data";
import { artFor, dossiers } from "./presentation";
import { characters } from "./lore/characters";
import { artworks, portraitFor } from "./media";
import { ImageViewer } from "./MediaGallery";
import { JourneyCollection } from './Journeys';
import type { JourneyId } from './Journeys';

type Props = {
  regions: Region[];
  places: (Place | Subregion)[];
  lore: LoreArticle[];
  query: string;
  savedOnly: boolean;
  navigate: (route: string) => void;
  clear: () => void;
  onStartJourney: (id: JourneyId) => void;
};
const filters = [
  { id: "all", name: "Tümü" },
  { id: "geography", name: "Denizler & yollar" },
  { id: "person", name: "İnsanlar" },
  { id: "fauna", name: "Canlılar" },
  { id: "law", name: "Kanunlar" },
  { id: "culture", name: "Gündelik hayat" },
  { id: "institution", name: "Kurumlar" },
  { id: "chronicle", name: "Anlatılar" },
];
export default function WikiHub({
  regions,
  places: matches,
  lore,
  query,
  savedOnly,
  navigate,
  clear,
  onStartJourney,
}: Props) {
  const [filter, setFilter] = useState("all");
  const [allCities, setAllCities] = useState(false);
  const [allPeople, setAllPeople] = useState(false);
  const [portraitIndex, setPortraitIndex] = useState<number | null>(null);
  const [personQuery, setPersonQuery] = useState('');
  const [personCity, setPersonCity] = useState('all');
  const [cityRegion, setCityRegion] = useState('danstsud');
  const extraPortraits = [artworks.ashara, artworks.lysandra, artworks.roddic];
  const shownCharacters = characters.filter(c => (!query && !savedOnly || lore.some(a => a.id === c.id)) && (personCity === 'all' || c.city === personCity) && normalize([c.name,c.role,c.affiliation].join(' ')).includes(normalize(personQuery)));
  const characterCities = [...new Set(characters.map(c => c.city))].map(id => ({id,name:locationById(id)?.name || regionById(id)?.name || id})).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  const cities =
    query || savedOnly
      ? matches
      : places.filter((place) => cityRegion === 'all' || place.region === cityRegion);
  const shownLore =
    filter === "all" ? lore : lore.filter((record) => record.kind === filter);
  const searching = !!query || savedOnly;
  return (
    <>
      <div className={`page-heading wiki-heading ${!searching ? 'library-hero' : ''}`}>
        <div>
          <div className="breadcrumb">VALHUNAR / KEŞİF KÜTÜPHANESİ</div>
          <h1>
            Haritanın ardındaki <em>hayat.</em>
          </h1>
          <p>Şehirleri tanı. Yüzleri hatırla. Haritada izlerini bul.</p>
          {!searching && <div className="hero-entry-links"><button className="gold-button" onClick={() => navigate('/atlas')}>Haritayı keşfet<ArrowRight size={16} /></button><a href="#/wiki/buyuk-kirilma">Bu dünya nasıl kırıldı?<ArrowRight size={15} /></a></div>}
        </div>
        <BookOpen className="heading-symbol" size={42} strokeWidth={0.8} />
      </div>
      {!searching && <nav className="library-jumps" aria-label="Ansiklopedi koleksiyonları">{[['library-kingdoms','Krallıklar'],['library-places','Yerleşimler'],['library-people','Karakterler'],['library-lore','Lore defterleri']].map(([id,label]) => <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>{label}<ArrowRight size={14} /></button>)}</nav>}
      {!searching && <JourneyCollection onStart={onStartJourney} />}
      {!searching && (
        <a
          className="library-feature"
          href="#/wiki/hardlane"
          style={{
            backgroundImage: `linear-gradient(90deg,#101719ef 5%,#10171944),url(${artFor("frostbay")})`,
          }}
        >
          <span className="eyebrow">BUZUN ARDINDAKİ HAYAT</span>
          <h2>
            Hardlane’in
            <br />
            <em>beş ayrı yüzü.</em>
          </h2>
          <p>
            Kadim taşlar, yeni kaleler ve kâğıtta kalan umutlar.
            <br />
            Bir kıyıya yaklaş. İçindeki dünyayı keşfet.
          </p>
          <span className="text-link">
            Bölgeyi keşfet
            <ArrowRight size={18} />
          </span>
        </a>
      )}
      {regions.length > 0 && (
        <section className="regions-collection" id="library-kingdoms">
          <div className="section-heading">
            <span className="eyebrow">SEKİZ TOPRAK</span>
            <h2>Kıtanın diğer hikâyeleri.</h2>
          </div>
          <div className="wiki-grid">
            {regions.map((region) => (
              <a
                href={`#/wiki/${region.id}`}
                className="wiki-card"
                key={region.id}
              >
                <div className="wiki-card-image">
                  <img
                    src={artFor(region.id, region.id)}
                    alt={`${region.name} illüstrasyonu`}
                    loading="lazy"
                  />
                  <span>
                    <Compass size={15} />
                    {region.climate}
                  </span>
                </div>
                <div className="wiki-card-body">
                  <h2>{region.name}</h2>
                  <p>{region.summary}</p>
                  <span className="text-link">
                    Hikâyesini oku
                    <ArrowRight size={15} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
      {(!searching || cities.length > 0) && (
        <section className="library-cities" id="library-places">
          <div className="section-heading">
            <span className="eyebrow">
              {searching ? "ARAMA DEFTERİ" : "ŞEHİR KOLEKSİYONU"}
            </span>
            <h2>
              {searching ? "Yerler ve bölgeler" : "Bir kapıdan içeri gir."}
            </h2>
          </div>
          {!searching && <label className="city-region-filter"><span>Hangi toprağın şehirleri?</span><select aria-label="Yerleşim koleksiyonunun bölgesi" value={cityRegion} onChange={e=>{setCityRegion(e.target.value);setAllCities(false)}}><option value="all">Bütün Valhunar</option>{regions.map(region=><option key={region.id} value={region.id}>{region.name}</option>)}</select><small>{cities.length} yerleşim</small></label>}
          <div className="city-collection">
            {(searching || allCities ? cities : cities.filter(c => c.positionStatus !== 'approximate')).map((city) => {
              const profile = dossiers[city.id];
              return (
                <a
                  href={`#/wiki/${city.id}`}
                  className="collection-card"
                  key={city.id}
                >
                  <div className="collection-art">
                    <img
                      src={artFor(city.id, city.region)}
                      alt={`${city.name} illüstrasyonu`}
                      loading="lazy"
                    />
                    <span>
                      {profile?.badge ||
                        (city.kind === "subregion" ? "Bölge" : "Yerleşim")}
                    </span>
                  </div>
                  <div className="collection-info">
                    <h3>{city.name}</h3>
                    <p>{profile?.motto || city.subtitle || city.summary}</p>
                    <div>
                      <span>
                        <Users size={13} />
                        {profile?.population || "Yerleşim kaydı"}
                      </span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          {!cities.length && <div className="collection-empty"><p>Bu bölge için adlandırılmış bir yerleşim kaydı bulunmuyor.</p><button onClick={()=>navigate(`/wiki/${cityRegion}`)}>Bölgenin hikâyesini keşfet<ArrowRight size={15} /></button></div>}
          {!searching && cities.some(c=>c.positionStatus === 'approximate') && <button className="gallery-more" aria-expanded={allCities} onClick={() => setAllCities(!allCities)}>{allCities ? 'Vergi köylerini gizle' : 'Vergi köylerini de keşfet (12)'}<ArrowRight size={15} /></button>}
        </section>
      )}
      {(shownCharacters.length > 0 || personQuery || personCity !== 'all') && (
        <section className="portrait-collection" id="library-people" data-testid="character-collection">
          <div className="section-heading">
            <span className="eyebrow">EVRENİN YÜZLERİ</span>
            <h2>Taşın ardında insanlar var.</h2>
          </div>
          <div className="character-finder"><label><span>Adı veya göreviyle bul</span><input type="search" aria-label="Karakter adı veya görevi" value={personQuery} onChange={e => setPersonQuery(e.target.value)} placeholder="Bir yüz, bir unvan…" /></label><label><span>İlgili yer</span><select aria-label="Karakterin ilgili olduğu yer" value={personCity} onChange={e => setPersonCity(e.target.value)}><option value="all">Bütün yerler</option>{characterCities.map(city => <option value={city.id} key={city.id}>{city.name}</option>)}</select></label><span aria-live="polite">{shownCharacters.length} karakter</span></div>
          <div className="portrait-grid">
            {(searching || allPeople || personQuery || personCity !== 'all' ? shownCharacters : shownCharacters.slice(0, 12)).map((person) => (
              <a href={`#/wiki/${person.id}`} key={person.id}>
                <img
                  src={portraitFor(person.portrait)?.src}
                  alt={person.name}
                  loading="lazy"
                />
                <span>
                  <strong>{person.name}</strong>
                  <small>{person.role}</small>
                </span>
                <ArrowRight size={17} />
              </a>
            ))}
            {!searching && !personQuery && personCity === 'all' && allPeople && extraPortraits.map((item, i) => <button key={item.id} onClick={() => setPortraitIndex(i)} className="ashara-gallery"><img src={item.src} alt={item.title} loading="lazy" /><span><strong>{item.title}</strong><small>Portre galerisi</small></span><ArrowRight size={17} /></button>)}
          </div>
          {!shownCharacters.length && <p className="no-category-results">Bu ad veya yerde eşleşen karakter yok. <button onClick={() => {setPersonQuery('');setPersonCity('all')}}>Filtreleri temizle</button></p>}
          {!searching && <button className="gallery-more" aria-expanded={allPeople} onClick={() => setAllPeople(!allPeople)}>{allPeople ? 'Kadroyu daralt' : `Bütün karakterler ve portreler (${characters.length + extraPortraits.length})`}<ArrowRight size={15} /></button>}
        </section>
      )}
      {lore.length > 0 && (
        <section
          className="wiki-place-results library-records" id="library-lore"
          data-testid="wiki-lore-results"
        >
          <div className="section-heading">
            <span className="eyebrow">KEŞİF DEFTERLERİ</span>
            <h2>Lore kayıtları</h2>
          </div>
          <div className="library-filters" aria-label="Lore türünü seç">
            {filters.map((item) => (
              <button
                key={item.id}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="lore-collection">
            {shownLore.map((record) => (
              <a
                href={`#/wiki/${record.id}`}
                key={record.id}
                aria-label={`${record.name} ${loreKindLabels[record.kind]}`}
              >
                <span className={`lore-kind-icon ${record.kind}`}>
                  {record.kind === "law" ? (
                    <ScrollText size={21} />
                  ) : record.kind === "person" || record.kind === "dynasty" ? (
                    <Crown size={21} />
                  ) : record.kind === "geography" ? (
                    <Waves size={21} />
                  ) : (
                    <BookOpen size={21} />
                  )}
                </span>
                <span>
                  <strong>{record.name}</strong>
                  <small>{loreKindLabels[record.kind]}</small>
                  <p>{record.summary}</p>
                </span>
                <ArrowRight size={16} />
              </a>
            ))}
          </div>
          {shownLore.length === 0 && (
            <p className="no-category-results">Bu türde eşleşen kayıt yok.</p>
          )}
        </section>
      )}
      {!regions.length && !cities.length && !lore.length && (
        <div className="empty-search">
          <MapPin size={35} />
          <h2>Kayıt bulunamadı.</h2>
          <p>Başka bir ad dene veya bütün dünyaya dön.</p>
          <button className="gold-button" onClick={clear}>
            Bütün bölgeleri göster
          </button>
        </div>
      )}
      {!searching && (
        <a className="wiki-history" href="#/wiki/buyuk-kirilma">
          <span className="history-symbol">✧</span>
          <div>
            <span className="eyebrow">DÜNYANIN HAFIZASI</span>
            <h2>Büyük Kırılma</h2>
            <p>Aynı geçmişin farklı halklarda bıraktığı izler.</p>
          </div>
          <ArrowRight size={24} />
        </a>
      )}
      <ImageViewer items={extraPortraits} index={portraitIndex} setIndex={setPortraitIndex} />
    </>
  );
}
