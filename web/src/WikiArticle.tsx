import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Castle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crown,
  Feather,
  Map,
  MapPin,
  ScrollText,
  Share2,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import {
  articleById,
  historyArticle,
  locationById,
  loreArticles,
  loreKindLabels,
  places,
  regionById,
  subregions,
} from "./data";
import type { LoreArticle, Place, Region, Section, Subregion } from "./data";
import { featureById } from "./map-features";
import { artFor, dossiers } from "./presentation";
import { PowerMeter } from "./DiscoveryCard";
import MediaGallery, { ArtworkButton, ImageViewer } from "./MediaGallery";
import { artworkFor, faunaArt, galleryFor, portraitFor } from "./media";
import { characterById } from "./lore/characters";
import HistoryExperience from "./HistoryExperience";
import ReadingProgress from './ReadingProgress';
import CharacterCard from './CharacterCard';
import { worldBooks } from './lore/books';
import { institutionRosters } from './lore/danstsud-roster';
import InstitutionRoster, { CityInstitutions, membersOf } from './InstitutionRoster';
import './reading-experience.css';

type ChapterTopic = 'overview' | 'life' | 'authority' | 'nature';
const chapterTopicLabels: Record<ChapterTopic, string> = {
  overview: 'Hikâye & hafıza', life: 'Sokak & yaşam', authority: 'Güç & düzen', nature: 'Doğa & coğrafya',
};
function chapterTopic(section: Section): ChapterTopic {
  if (section.scene) return 'life';
  const title = section.title.toLocaleLowerCase('tr-TR');
  if (/ordu|asker|muhafız|paladin|rahip|lonca|makam|taht|yasa|hukuk|madde|vergi|hanedan|güç|yönet|meclis|ruhsat|idare|mühür|siyas/.test(title)) return 'authority';
  if (/hayvan|canlı|yaratık|zirve|nehir|deniz|göl|iklim|orman|dağ|cevher|maden|otlak|beslen|beden|yuva|tür|duyu/.test(title)) return 'nature';
  if (/gündelik|ticaret|geçim|mahalle|liman|pazar|zanaat|hayat|yaşam|ekmek|ev|kültür|yol/.test(title)) return 'life';
  return 'overview';
}

function recordLabel(entry: Region | Place | Subregion | LoreArticle) {
  if (
    "kind" in entry &&
    entry.kind &&
    entry.kind !== "settlement" &&
    entry.kind !== "subregion"
  )
    return loreKindLabels[entry.kind];
  if ("kind" in entry && entry.kind === "subregion") return "Danstsud bölgesi";
  if ("major" in entry && entry.major) return "Başlıca şehir";
  return "region" in entry ? "Yerleşim" : entry.subtitle;
}
const preview = (text: string) => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences
    .slice(0, sentences[0]?.length < 130 ? 2 : 1)
    .join(" ")
    .trim();
};
function SectionProse({ section, manuscript }: { section: Section; manuscript: boolean }) {
  const first = section.paragraphs[0] || '';
  const match = first.match(/^(.+?[.!?])(?:\s+|$)/);
  const opening = !manuscript && match && match[1].length <= 230 ? match[1] : '';
  const remainder = opening ? first.slice(opening.length).trim() : first;
  return <div className="section-prose">
    {opening && <p className="section-opening">{opening}</p>}
    {remainder && <p>{remainder}</p>}
    {section.paragraphs.slice(1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
  </div>;
}
function LoreTable({ section }: { section: Section }) {
  if (!section.table) return null;
  return (
    <div
      className="lore-table-scroll"
      role="region"
      aria-label={`${section.title} tablosu`}
      tabIndex={0}
    >
      <table className="lore-table">
        <caption>{section.title}</caption>
        <thead>
          <tr>
            {section.table.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.table.rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={i}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Props = {
  id: string;
  saved: boolean;
  toggleSaved: () => void;
  share: () => void;
  navigate: (route: string) => void;
  backToMap: string;
  reducedMotion: boolean;
};
export default function WikiArticle({
  id,
  saved,
  toggleSaved,
  share,
  navigate,
  backToMap,
  reducedMotion,
}: Props) {
  const [fullReading, setFullReading] = useState(false);
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [topic, setTopic] = useState<'all' | ChapterTopic>('all');
  const [activeChapter, setActiveChapter] = useState(0);
  const [quietReading, setQuietReading] = useState(false);
  const region = regionById(id);
  const place = locationById(id);
  const record = articleById(id);
  const entry = place || record;
  const history = id === historyArticle.id;
  const context = region || regionById(entry?.region || "");
  const name =
    region?.name || entry?.name || (history ? historyArticle.name : "");
  const sections: Section[] =
    region?.sections ||
    entry?.sections ||
    (history
      ? historyArticle.sections
      : place
        ? [
            {
              title: "Yerleşim kaydı",
              paragraphs: [
                place.summary ||
                  `${place.name}, ${context?.name} haritasındaki yerleşimlerdendir.`,
                context?.summary || "",
              ],
            },
          ]
        : []);
  const profile = dossiers[id];
  const cityInstitutions = institutionRosters.filter(roster => roster.city === id);
  const institutionRoster = institutionRosters.find(roster => roster.id === id);
  const character = characterById(id);
  const portrait = portraitFor(character?.portrait || id);
  const [imageIndex, setImageIndex] = useState<number | null>(null);
  const summary =
    region?.summary ||
    entry?.summary ||
    (history
      ? historyArticle.summary
      : `${name}, ${context?.name} coğrafyasındaki yerleşimlerdendir.`);
  const kind = history
    ? "Tarih & efsaneler"
    : record
      ? loreKindLabels[record.kind]
      : place?.kind === "subregion"
        ? "Danstsud bölgeleri"
        : place
          ? "Yerleşimler"
          : region?.id === "danstsud"
            ? "Krallıklar"
            : "Bölgeler";
  const related = entry
    ? [...new Set([entry.region, place?.subregion, ...(entry.related || [])])]
        .filter((value): value is string => !!value && value !== id)
        .map(
          (value) =>
            regionById(value) || locationById(value) || articleById(value),
        )
        .filter(
          (value): value is Region | Place | Subregion | LoreArticle => !!value,
        )
    : places.filter((value) => value.region === context?.id);
  const regionAreas = region
    ? subregions.filter((area) => area.region === region.id)
    : [];
  const regionLore = region
    ? loreArticles.filter((article) => article.region === region.id)
    : [];
  const mapTarget = featureById(id) ? id : record ? record.mapLocation : place?.point === null ? undefined : id;
  const wordCount = sections
    .flatMap((section) => section.paragraphs)
    .join(" ")
    .split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 180));
  const book = worldBooks.find(value => value.id === id);
  const chapterTopics = sections.map(chapterTopic);
  const availableTopics = (Object.keys(chapterTopicLabels) as ChapterTopic[]).filter(value => chapterTopics.includes(value));
  const visibleCount = topic === 'all' ? sections.length : chapterTopics.filter(value => value === topic).length;
  const sources =
    region?.sources ||
    entry?.sources ||
    (history
      ? historyArticle.sources
      : ["Aruzahr 8k (1).jpg"]);

  const galleryBase = galleryFor(id, context?.id || "lakbar", artFor(id, context?.id || "lakbar"));
  const rosterPortraits = institutionRoster ? membersOf(institutionRoster).map(person => portraitFor(person.portrait)) : [];
  const gallery = [...galleryBase, ...(profile?.people || []).map(p => portraitFor(p.portrait || '')), ...rosterPortraits].filter((p): p is NonNullable<typeof p> => !!p).filter((item, i, all) => all.findIndex(a => a.id === item.id) === i);
  const cover = portrait ? artFor(mapTarget || context?.id || "danstsud", context?.id) : artFor(id, context?.id || "lakbar");
  function openArtwork(key: string) { const canonicalKey = portraitFor(key)?.id || key; const index = gallery.findIndex(item => item.id === canonicalKey); if (index >= 0) setImageIndex(index); }

  useEffect(() => {
    setTopic('all'); setActiveChapter(0); setQuietReading(false); setFullReading(false); setPeopleExpanded(false);
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(value => value.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActiveChapter(Number(visible[0].target.getAttribute('data-chapter-index')));
    }, { rootMargin: '-100px 0px -45% 0px', threshold: 0 });
    document.querySelectorAll('.wiki-article .lore-section-card').forEach(value => observer.observe(value));
    return () => observer.disconnect();
  }, [id, topic, fullReading]);

  function goToSection(index: number) {
    document
      .querySelector("details.mobile-article-contents")
      ?.removeAttribute("open");
    setTopic('all');
    setActiveChapter(index);
    requestAnimationFrame(() => {
      const section = document.getElementById(`article-section-${index}`);
      section?.querySelector("details")?.setAttribute("open", "");
      section?.scrollIntoView({
        behavior: reducedMotion ? "instant" : "smooth",
        block: "start",
      });
    });
  }
  function relatedCards(
    records: (Region | Place | Subregion | LoreArticle)[],
    testId: string,
    title: string,
  ) {
    return records.length ? (
      <section className="related-places visual-related" data-testid={testId}>
        <div className="section-heading">
          <span className="eyebrow">KEŞFİ SÜRDÜR</span>
          <h2>{title}</h2>
        </div>
        <div className="related-grid">
          {records.map((value) => (
            <button
              key={value.id}
              onClick={() => navigate(`/wiki/${value.id}`)}
            >
              {dossiers[value.id]?.art ? (
                <img src={artFor(value.id)} alt="" loading="lazy" />
              ) : (
                <span className="related-symbol">
                  {articleById(value.id) ? (
                    <BookOpen size={20} />
                  ) : (
                    <MapPin size={20} />
                  )}
                </span>
              )}
              <span className="related-name">
                {value.name}
                <small>{recordLabel(value)}</small>
              </span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </section>
    ) : null;
  }
  if (!name)
    return (
      <div className="not-found">
        <Compass size={40} />
        <h1>Kayıt bulunamadı.</h1>
        <p>Bu sayfanın izleri atlasın dışında kalmış olabilir.</p>
        <button className="gold-button" onClick={() => navigate("/wiki")}>
          Ansiklopediye dön
          <ArrowRight size={16} />
        </button>
      </div>
    );

  return (
    <article
      className={`wiki-article visual-article story-article ${profile ? "city-article" : ""} ${record ? "lore-article" : ""} ${record?.kind === "chronicle" ? "manuscript-article" : ""} ${record?.kind === "law" ? "law-article" : ""} ${fullReading ? "reading-full" : "reading-cards"} ${quietReading ? 'quiet-reading' : ''}`}
    >
      <ReadingProgress id={id} />
      {place?.positionStatus === 'unlocated' && <p className="position-note">Haritadaki konumu henüz doğrulanmadı.</p>}
      <div className="article-topline">
        <div className="article-breadcrumbs">
          <button onClick={() => navigate(backToMap)}>
            <ArrowLeft size={16} />
            Haritaya dön
          </button>
          <button onClick={() => navigate("/wiki")}>Ansiklopedi</button>
          {book && <button onClick={() => navigate('/books')}>Kitaplık</button>}
          {context && (
            <button onClick={() => navigate(`/wiki/${context.id}`)}>
              {context.name}
            </button>
          )}
        </div>
        <div>
          {!history && mapTarget && (
            <button
              className="article-map-shortcut"
              onClick={() => navigate(`/atlas/${mapTarget}`)}
              aria-label="Haritada bul"
            >
              <MapPin size={16} />
              <span>Haritada bul</span>
            </button>
          )}
          <button
            className={`icon-button ${saved ? "toggled" : ""}`}
            aria-label={saved ? "Kaydı kaldır" : "Kaydı kaydet"}
            onClick={toggleSaved}
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            className="icon-button"
            aria-label="Wiki bağlantısını kopyala"
            onClick={share}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
      <div
        className="article-cover"
        style={{
          backgroundImage: `linear-gradient(0deg,#0c1215 0%,#0c121555 55%,#0c121510),url(${cover})`,
        }}
      >
        <div className="article-title">
          <span className="eyebrow">
            VALHUNAR ANSİKLOPEDİSİ <span>/</span>{" "}
            {kind.toLocaleUpperCase("tr-TR")}
          </span>
          <div className="hero-badges">
            <span>{profile?.badge || kind}</span>
            <span>{readTime} dk okuma</span>
          </div>
          <h1>{name}</h1>
          <p>
            {profile?.motto ||
              region?.subtitle ||
              entry?.subtitle ||
              historyArticle.subtitle}
          </p>
        </div>
        {portrait && !profile && !book && <button className="hero-portrait-button" aria-label={`${name} portresini büyüt`} onClick={() => openArtwork(portrait.id)}><CharacterCard id={character?.id} src={portrait.src} name={name} role={character?.role} eager /></button>}
        <div className="article-cover-actions"><button className="article-read-shortcut" onClick={() => goToSection(0)}><Feather size={15} />Okumaya başla<ArrowRight size={16} /></button><button className="cover-gallery-button" onClick={() => setImageIndex(0)}>Görselleri aç <span>{gallery.length}</span></button></div>
      </div>
      {profile && (
        <div className="city-passport" data-testid="city-passport">
          <div className="passport-facts">
            <div>
              <Users size={19} />
              <span>
                Tahmini nüfus<strong>{profile.population}</strong>
                <small>{profile.populationNote}</small>
              </span>
            </div>
            <div>
              <Crown size={19} />
              <span>
                Yönetici<strong>{profile.ruler}</strong>
                <small>{profile.government}</small>
              </span>
            </div>
            <div>
              <Waves size={19} />
              <span>
                İklim & konum<strong>{profile.climate}</strong>
                <small>
                  {place?.subregion === "hardlane"
                    ? "Hardlane · Danstsud"
                    : context?.name || "Danstsud"}
                </small>
              </span>
            </div>
          </div>
          <PowerMeter profile={profile} />
          <div className="passport-trade">
            <span>Geçim & ticaret</span>
            <div>
              {profile.exports.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      {character && <div className="character-passport" data-testid="character-passport"><div><span>Rol</span><strong>{character.role}</strong></div><div><span>Bağlılık</span><strong>{character.affiliation}</strong></div><div><span>İlgili yer</span><button onClick={() => navigate(`/wiki/${character.city}`)}>{locationById(character.city)?.name || character.city}<ArrowRight size={14} /></button></div><div className="character-traits">{character.traits.map(trait => <span key={trait}>{trait}</span>)}</div></div>}
      <nav className="article-local-navigation" aria-label="Wiki keşif alanları"><button onClick={() => goToSection(0)}><Feather size={15} />Hikâye<span>{sections.length}</span></button>{profile?.people?.length ? <button onClick={() => document.querySelector('.wiki-article .people-section')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block:'start' })}><Users size={15} />Yüzler<span>{profile.people.length}</span></button> : null}<button onClick={() => setImageIndex(0)}><Sparkles size={15} />Galeri<span>{gallery.length}</span></button>{book && <button onClick={() => navigate('/books')}><BookOpen size={15} />Kitaplık<ArrowRight size={14} /></button>}</nav>
      {history && <HistoryExperience jump={goToSection} />}
      {context?.id === "danstsud" && (
        <p className="article-period">
          ERYNDORN’UN HÜKÜMDARLIĞI · DARBE ÖNCESİ
        </p>
      )}
      {profile?.hooks.length ? (
        <div className="story-hooks">
          {profile.hooks.map((hook, index) => (
            <div key={hook.title}>
              <span className="hook-number">0{index + 1}</span>
              <Sparkles size={18} />
              <h2>{hook.title}</h2>
              <p>{hook.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="visual-intro">{summary}</p>
      )}
      <CityInstitutions rosters={cityInstitutions} navigate={navigate} />
      {institutionRoster && <InstitutionRoster roster={institutionRoster} navigate={navigate} openPortrait={openArtwork} />}
      {profile?.people?.length ? (
        <section className="people-section">
          <div className="section-heading">
            <span className="eyebrow">EVRENİN YÜZLERİ</span>
            <h2>Şehirde söz sahibi olanlar</h2>
          </div>
          <div className="people-grid">
            {(peopleExpanded ? profile.people : profile.people.slice(0, 6)).map((person) => (
              <div className={`person-card ${person.portrait ? 'framed-person' : ''}`} key={person.name}>
                {person.portrait ? (
                  <button className="person-image-button" aria-label={`${person.name} portresini büyüt`} onClick={() => openArtwork(person.portrait!)}><CharacterCard id={person.article} src={portraitFor(person.portrait)?.src || `/illustrations/${person.portrait}.webp`} name={person.name} role={person.role} /></button>
                ) : (
                  <span className="person-seal">
                    <Crown size={28} />
                  </span>
                )}
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                  {person.article && (
                    <button onClick={() => navigate(`/wiki/${person.article}`)}>
                      Tanı
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {profile.people.length > 6 && <button className="gallery-more" aria-expanded={peopleExpanded} onClick={() => setPeopleExpanded(!peopleExpanded)}>{peopleExpanded ? 'Kadroyu daralt' : `Bütün yüzleri tanı (${profile.people.length})`}<ArrowRight size={15} /></button>}
        </section>
      ) : null}
      <MediaGallery items={gallery} open={setImageIndex} />
      <div className="reading-toolbar">
        <div>
          <span className="eyebrow">
            {record?.kind === "chronicle" ? "KIYI DEFTERİ" : "DAHA YAKINDAN"}
          </span>
          <h2>
            {record?.kind === "chronicle"
              ? "Yaprakları çevir."
              : character ? `${name} · hayatı ve bağları` : `${name} · yakından`}
          </h2>
        </div>
        <div className="reading-switch" aria-label="Okuma düzeni">
          <button
            aria-pressed={!fullReading}
            onClick={() => { setFullReading(false); setQuietReading(false); }}
          >
            <Castle size={15} />
            Kartlar
          </button>
          <button
            aria-pressed={fullReading}
            onClick={() => { setFullReading(true); setTopic('all'); }}
          >
            <ScrollText size={15} />
            Tam lore
          </button>
        </div>
      </div>
      <div className="chapter-navigation" aria-label="Okuma araçları">
        <div className="chapter-navigation-title"><BookOpen size={16} /><span><strong>{sections.length} bölüm</strong><small>{readTime} dakika · {wordCount.toLocaleString('tr-TR')} sözcük</small></span></div>
        <div className="chapter-steppers"><button aria-label="Önceki wiki bölümü" disabled={activeChapter === 0} onClick={() => goToSection(activeChapter - 1)}><ChevronLeft size={18} /></button><span>{String(activeChapter + 1).padStart(2, '0')}<small> / {String(sections.length).padStart(2, '0')}</small></span><button aria-label="Sonraki wiki bölümü" disabled={activeChapter >= sections.length - 1} onClick={() => goToSection(activeChapter + 1)}><ChevronRight size={18} /></button></div>
        <button className="quiet-reading-toggle" aria-pressed={quietReading} onClick={() => { setQuietReading(!quietReading); if (!quietReading) { setFullReading(true); setTopic('all'); goToSection(activeChapter); } }}><Feather size={16} />{quietReading ? 'Görsel görünüme dön' : 'Sakin okuma'}</button>
      </div>
      {availableTopics.length > 1 && <div className="chapter-topic-filters" aria-label="Bölüm konuları"><button aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>Bütün bölümler<span>{sections.length}</span></button>{availableTopics.map(value => <button key={value} aria-pressed={topic === value} onClick={() => setTopic(value)}>{chapterTopicLabels[value]}<span>{chapterTopics.filter(item => item === value).length}</span></button>)}</div>}
      <details
        className="mobile-article-contents"
        data-testid="mobile-article-contents"
      >
        <summary>
          İçindekiler<span>{sections.length} bölüm</span>
        </summary>
        <nav aria-label="Sayfa bölümleri">
          {sections.map((section, index) => (
            <button key={section.title} onClick={() => goToSection(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.title}
            </button>
          ))}
        </nav>
      </details>
      <div className="article-layout">
        <div className="article-content">
          <div className="reading-editorial-lead"><span className="eyebrow">{book ? 'NÜSHANIN HİKÂYESİ' : character ? 'PORTRENİN ARDINDA' : 'BİR BAKIŞTA'}</span><p className="article-lead">{summary}</p></div>
          {(region || history) && (
            <blockquote className="article-quote">
              “{region?.quote || historyArticle.quote}”
            </blockquote>
          )}
          <div className="lore-section-grid">
            {sections.map((section, index) => (
              <section
                className={`lore-section-card ${section.table ? "has-table" : ""} ${section.scene ? 'daily-scene' : ''} ${book ? 'book-lore-chapter' : ''}`}
                id={`article-section-${index}`}
                key={section.title}
                data-chapter-index={index}
                hidden={topic !== 'all' && chapterTopics[index] !== topic}
              >
                <header>
                  <span className="section-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2>{section.title}</h2>
                  <span className="chapter-reading-time">{Math.max(1, Math.round(section.paragraphs.join(' ').split(/\s+/).length / 180))} dk</span>
                </header>
                {section.scene && <><div className="scene-label">SOKAKTAN BİR SAHNE</div><img className="scene-picture" src={artFor(id, context?.id)} alt="" loading="lazy" /></>}
                {id === "karlan-canlilari" && faunaArt[index] && <ArtworkButton item={faunaArt[index]} className="section-artwork" onClick={() => openArtwork(faunaArt[index].id)} />}
                {id === "hardlane-otlak-hayvanlari" && ["tervan", "norruk", "velkir"][index] && artworkFor(["tervan", "norruk", "velkir"][index]) && <ArtworkButton item={artworkFor(["tervan", "norruk", "velkir"][index])!} className="section-artwork" onClick={() => openArtwork(artworkFor(["tervan", "norruk", "velkir"][index])!.id)} />}
                {!fullReading && (
                  <p className="section-preview">
                    {preview(section.paragraphs[0] || "")}
                  </p>
                )}
                <details
                  className="section-detail"
                  open={fullReading || undefined}
                >
                  <summary>
                    <BookOpen size={14} />
                    {record?.kind === "chronicle"
                      ? "Bu yaprağı oku"
                      : "Bölümü aç"}
                    <ChevronDown size={15} />
                  </summary>
                  <SectionProse section={section} manuscript={record?.kind === 'chronicle'} />
                </details>
                <LoreTable section={section} />
              </section>
            ))}
          </div>
          {topic !== 'all' && <button className="restore-chapters" onClick={() => setTopic('all')}><Check size={15} />{visibleCount} bölüm gösteriliyor · bütün {sections.length} bölüme dön<ArrowRight size={15} /></button>}
          {regionAreas.length > 0 && (
            <section
              className="related-places visual-related"
              data-testid="subregion-links"
            >
              <div className="section-heading">
                <span className="eyebrow">ÜÇ AYRI HAYAT</span>
                <h2>Danstsud’un bölgeleri</h2>
              </div>
              <div className="area-cards">
                {regionAreas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => navigate(`/wiki/${area.id}`)}
                    style={{
                      backgroundImage: `linear-gradient(0deg,#101719f5,#10171920),url(${artFor(area.id)})`,
                    }}
                  >
                    <span>
                      {area.name}
                      <small>{area.subtitle}</small>
                    </span>
                    <ArrowRight size={18} />
                  </button>
                ))}
              </div>
            </section>
          )}
          {relatedCards(
            related,
            "related-locations",
            entry ? "Bağlantılı kayıtlar" : "Haritadaki yerleşimler",
          )}
          {relatedCards(regionLore, "lore-links", `${context?.name || 'Valhunar'} lore kayıtları`)}
          <details className="article-sources">
            <summary>
              <BookOpen size={15} />
              Kaynaklar & notlar
            </summary>
            <p>{sources.join(" · ")}</p>
            <small>
              Genel dünya bilgisi · Kampanya sırları bu ansiklopedide
              yayımlanmaz.
            </small>
          </details>
        </div>
        <aside className="article-toc">
          <span className="eyebrow">BU SAYFADA</span>
          {sections.map((section, index) => (
            <button key={section.title} onClick={() => goToSection(index)} aria-current={index === activeChapter ? 'location' : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.title}
            </button>
          ))}
          {book && <button className="toc-bookshelf" onClick={() => navigate('/books')}><BookOpen size={16} />Kitaplığa dön</button>}
          {!history && mapTarget && (
            <button
              className="gold-button"
              onClick={() => navigate(`/atlas/${mapTarget}`)}
            >
              <Map size={15} />
              {record ? "İlgili yeri haritada göster" : "Haritada göster"}
            </button>
          )}
          <div className="toc-note">
            <Compass size={26} />
            <p>Bir ayrıntı seç. Yeni bir hikâyeye açıl.</p>
          </div>
        </aside>
      </div>
      <ImageViewer items={gallery} index={imageIndex} setIndex={setImageIndex} />
    </article>
  );
}
