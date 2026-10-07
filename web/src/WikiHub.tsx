import { useRef, useState } from "react";
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
import { loreKindLabels, places } from "./data";
import { artFor, dossiers } from "./presentation";

type Props = {
  regions: Region[];
  places: (Place | Subregion)[];
  lore: LoreArticle[];
  query: string;
  savedOnly: boolean;
  navigate: (route: string) => void;
  clear: () => void;
};
const filters = [
  { id: "all", name: "Tümü" },
  { id: "geography", name: "Denizler & yollar" },
  { id: "person", name: "İnsanlar" },
  { id: "fauna", name: "Canlılar" },
  { id: "law", name: "Kanunlar" },
  { id: "chronicle", name: "Anlatılar" },
];
const portraits = [
  { id: "eryndorn", name: "Eryndorn", role: "Vaeranth tacı", art: "eryndorn" },
  {
    id: "nera-veld",
    name: "Nera Veld",
    role: "Frostbay’in vekili",
    art: "nera-veld",
  },
  {
    id: "edran-korr",
    name: "Edran Korr",
    role: "Karlan’ın lordu",
    art: "edran-korr",
  },
  {
    id: "bryndon-kiyi-defteri",
    name: "Bryndon",
    role: "Kıyının kâtibi",
    art: "bryndon",
  },
];
export default function WikiHub({
  regions,
  places: matches,
  lore,
  query,
  savedOnly,
  navigate,
  clear,
}: Props) {
  const [filter, setFilter] = useState("all");
  const gallery = useRef<HTMLDialogElement>(null);
  const cities =
    query || savedOnly
      ? matches
      : places.filter((place) => dossiers[place.id]?.art);
  const shownLore =
    filter === "all" ? lore : lore.filter((record) => record.kind === filter);
  const searching = !!query || savedOnly;
  return (
    <>
      <div className="page-heading wiki-heading">
        <div>
          <div className="breadcrumb">VALHUNAR / KEŞİF KÜTÜPHANESİ</div>
          <h1>
            Bir hikâye <em>seç.</em>
          </h1>
          <p>Şehirleri tanı. Yüzleri hatırla. Haritada izlerini bul.</p>
        </div>
        <BookOpen className="heading-symbol" size={42} strokeWidth={0.8} />
      </div>
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
      {cities.length > 0 && (
        <section className="library-cities">
          <div className="section-heading">
            <span className="eyebrow">
              {searching ? "ARAMA DEFTERİ" : "ŞEHİR KOLEKSİYONU"}
            </span>
            <h2>
              {searching ? "Yerler ve bölgeler" : "Bir kapıdan içeri gir."}
            </h2>
          </div>
          <div className="city-collection">
            {cities.map((city) => {
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
        </section>
      )}
      {!searching && (
        <section className="portrait-collection">
          <div className="section-heading">
            <span className="eyebrow">EVRENİN YÜZLERİ</span>
            <h2>Taşın ardında insanlar var.</h2>
          </div>
          <div className="portrait-grid">
            {portraits.map((person) => (
              <a href={`#/wiki/${person.id}`} key={person.id}>
                <img
                  src={`/illustrations/${person.art}.webp`}
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
            <button
              onClick={() => gallery.current?.showModal()}
              className="ashara-gallery"
            >
              <img
                src="/illustrations/ashara.webp"
                alt="Ashara portresi"
                loading="lazy"
              />
              <span>
                <strong>Ashara</strong>
                <small>Portre galerisi</small>
              </span>
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      )}
      {regions.length > 0 && (
        <section className="regions-collection">
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
                    alt={`${region.name} haritası`}
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
      {lore.length > 0 && (
        <section
          className="wiki-place-results library-records"
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
      <dialog
        ref={gallery}
        className="portrait-dialog"
        aria-label="Ashara portresi"
      >
        <button
          className="icon-button"
          aria-label="Portreyi kapat"
          onClick={() => gallery.current?.close()}
          autoFocus
        >
          <X size={22} />
        </button>
        <img
          src="/illustrations/ashara.webp"
          alt="Ashara, kullanıcının özgün portresi"
        />
        <p>Ashara · Portre galerisi</p>
      </dialog>
    </>
  );
}
