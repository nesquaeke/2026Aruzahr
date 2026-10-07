import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Castle,
  ChevronDown,
  Compass,
  Crown,
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
const portraits: Record<string, string> = {
  eryndorn: "eryndorn",
  "nera-veld": "nera-veld",
  "edran-korr": "edran-korr",
  "bryndon-kiyi-defteri": "bryndon",
};
const preview = (text: string) => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences
    .slice(0, sentences[0]?.length < 130 ? 2 : 1)
    .join("")
    .trim();
};
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
  const mapTarget = featureById(id) ? id : record ? record.mapLocation : id;
  const wordCount = sections
    .flatMap((section) => section.paragraphs)
    .join(" ")
    .split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 180));
  const sources =
    region?.sources ||
    entry?.sources ||
    (history
      ? ["Valhunar.pdf — genel kültürel anlatılar"]
      : ["Aruzahr 8k (1).jpg"]);

  function goToSection(index: number) {
    document
      .querySelector("details.mobile-article-contents")
      ?.removeAttribute("open");
    const section = document.getElementById(`article-section-${index}`);
    section?.querySelector("details")?.setAttribute("open", "");
    requestAnimationFrame(() =>
      section?.scrollIntoView({
        behavior: reducedMotion ? "instant" : "smooth",
        block: "start",
      }),
    );
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
      className={`wiki-article visual-article ${profile ? "city-article" : ""} ${record ? "lore-article" : ""} ${record?.kind === "chronicle" ? "manuscript-article" : ""} ${record?.kind === "law" ? "law-article" : ""} ${fullReading ? "reading-full" : "reading-cards"}`}
    >
      <div className="article-topline">
        <div className="article-breadcrumbs">
          <button onClick={() => navigate(backToMap)}>
            <ArrowLeft size={16} />
            Haritaya dön
          </button>
          <button onClick={() => navigate("/wiki")}>Ansiklopedi</button>
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
          backgroundImage: `linear-gradient(0deg,#0c1215 0%,#0c121555 55%,#0c121510),url(${artFor(id, context?.id || "lakbar")})`,
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
        {portraits[id] && !profile && (
          <img
            className="hero-portrait"
            src={`/illustrations/${portraits[id]}.webp`}
            alt={name}
          />
        )}
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
                    : "Danstsud"}
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
      {profile?.people?.length ? (
        <section className="people-section">
          <div className="section-heading">
            <span className="eyebrow">EVRENİN YÜZLERİ</span>
            <h2>Şehirde söz sahibi olanlar</h2>
          </div>
          <div className="people-grid">
            {profile.people.map((person) => (
              <div className="person-card" key={person.name}>
                {person.portrait ? (
                  <img
                    src={`/illustrations/${person.portrait}.webp`}
                    alt={person.name}
                    loading="lazy"
                  />
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
        </section>
      ) : null}
      <div className="reading-toolbar">
        <div>
          <span className="eyebrow">
            {record?.kind === "chronicle" ? "KIYI DEFTERİ" : "DAHA YAKINDAN"}
          </span>
          <h2>
            {record?.kind === "chronicle"
              ? "Yaprakları çevir."
              : "Hikâyenin katmanları."}
          </h2>
        </div>
        <div className="reading-switch" aria-label="Okuma düzeni">
          <button
            aria-pressed={!fullReading}
            onClick={() => setFullReading(false)}
          >
            <Castle size={15} />
            Kartlar
          </button>
          <button
            aria-pressed={fullReading}
            onClick={() => setFullReading(true)}
          >
            <ScrollText size={15} />
            Tam lore
          </button>
        </div>
      </div>
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
          <p className="article-lead">{summary}</p>
          {(region || history) && (
            <blockquote className="article-quote">
              “{region?.quote || historyArticle.quote}”
            </blockquote>
          )}
          <div className="lore-section-grid">
            {sections.map((section, index) => (
              <section
                className={`lore-section-card ${section.table ? "has-table" : ""}`}
                id={`article-section-${index}`}
                key={section.title}
              >
                <header>
                  <span className="section-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2>{section.title}</h2>
                </header>
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
                  <div className="section-prose">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </details>
                <LoreTable section={section} />
              </section>
            ))}
          </div>
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
          {relatedCards(regionLore, "lore-links", "Danstsud lore kayıtları")}
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
            <button key={section.title} onClick={() => goToSection(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.title}
            </button>
          ))}
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
    </article>
  );
}
