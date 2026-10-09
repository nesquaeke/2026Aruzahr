import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Crown,
  MapPin,
  Shield,
  Snowflake,
  Users,
  Waves,
  X,
} from "lucide-react";
import type { Place, Region, Subregion } from "./data";
import { placeById } from "./data";
import type { MapFeature } from "./map-features";
import { featureLabels } from "./map-features";
import { artFor, dossiers, powersFor } from "./presentation";
import type { Dossier } from "./presentation";
import { portraitFor } from './media';

export function PowerMeter({
  profile,
  compact = false,
}: {
  profile: Dossier;
  compact?: boolean;
}) {
  return (
    <div
      className={`power-meters ${compact ? "compact" : ""}`}
      aria-label="Şehrin göreli güç göstergeleri"
    >
      {powersFor(profile).map((power) => (
        <div className="power-row" key={power.label} title={power.note}>
          <span>{power.label}</span>
          <span
            className="power-segments"
            role="img"
            aria-label={`${power.label}: 5 üzerinden ${power.value}. ${power.note}`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <i className={i < power.value ? "filled" : ""} key={i} />
            ))}
          </span>
          <b>
            {power.value}
            <small>/5</small>
          </b>
        </div>
      ))}
      {!compact && (
        <small className="power-footnote">
          Atlas için göreli karşılaştırma
        </small>
      )}
    </div>
  );
}

type Props = {
  id: string;
  region: Region;
  entry?: Place | Subregion;
  feature?: MapFeature;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
  navigate: (route: string) => void;
};
export default function DiscoveryCard({
  id,
  region,
  entry,
  feature,
  saved,
  onSave,
  onClose,
  navigate,
}: Props) {
  const profile = dossiers[id];
  const name = entry?.name || feature?.name || region.name;
  const summary = entry?.summary || feature?.summary || region.summary;
  const firstPerson = profile?.people?.find((person) => person.portrait);
  const wikiId = feature?.article || id;
  return (
    <aside
      className={`detail-panel discovery-card ${profile?.tone || ""}`}
      aria-label={`${name} kısa bilgi`}
      data-testid="detail-panel"
    >
      <div className="detail-cover">
        <img src={artFor(id, region.id)} alt={`${name} illüstrasyonu`} />
        <div className="cover-shade" />
        <span className="card-badge">
          {profile?.badge ||
            (feature
              ? featureLabels[feature.kind]
              : entry?.kind === "subregion"
                ? "Bölge"
                : entry
                  ? "Yerleşim"
                  : "Ülke")}
        </span>
        <button
          className="detail-close icon-button"
          aria-label="Bilgi panelini kapat"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <span className="card-coordinate">
          <MapPin size={11} />
          {region.name} {entry?.subregion === "hardlane" ? " / Hardlane" : ""}
        </span>
      </div>
      <div className="detail-body">
        <div className="detail-heading">
          <h2>{name}</h2>
          <button
            className={`icon-button ${saved ? "toggled" : ""}`}
            aria-label={saved ? `${name} kaydını kaldır` : `${name} kaydet`}
            onClick={onSave}
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <span className="detail-subtitle">
          {entry?.subtitle || feature?.fact || region.subtitle}
        </span>
        {profile ? (
          <>
            <p className="card-motto">“{profile.motto}”</p>
            <div className="card-facts" data-testid="city-facts">
              <div>
                <Users size={16} />
                <span>
                  Nüfus<strong>{profile.population}</strong>
                </span>
              </div>
              <div>
                <Crown size={16} />
                <span>
                  Yönetim<strong>{profile.ruler}</strong>
                </span>
              </div>
            </div>
            <p className="government-note">{profile.government}</p>
            <PowerMeter profile={profile} compact />
            <div className="trade-chips">
              {profile.exports.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
            {firstPerson && (
              <button
                className="card-person"
                onClick={() =>
                  firstPerson.article &&
                  navigate(`/wiki/${firstPerson.article}`)
                }
                disabled={!firstPerson.article}
              >
                <img
                  src={portraitFor(firstPerson.portrait || '')?.src}
                  alt={firstPerson.name}
                />
                <span>
                  <strong>{firstPerson.name}</strong>
                  <small>{firstPerson.role}</small>
                </span>
                <ArrowRight size={14} />
              </button>
            )}
          </>
        ) : feature ? (
          <>
            <div className={`feature-condition ${feature.status || ""}`}>
              <Waves size={20} />
              <span>{feature.fact}</span>
            </div>
            <p className="feature-summary">{summary}</p>
            {feature.stops && <ol className="route-itinerary" aria-label="Yolun durakları">{feature.stops.map((stop, i) => <li key={stop}><span>{i + 1}</span><button onClick={() => navigate(`/wiki/${stop}`)}>{placeById(stop)?.name}<small>Yerleşimi tanı</small></button><ArrowRight size={14} /></li>)}</ol>}
            {feature.status === "planned" && (
              <p className="route-status">
                <Shield size={15} />
                Bu yol inşa edilmedi.
              </p>
            )}
            <p className="position-note">
              Yaklaşık etiket konumu
              {feature.kind === "route" ? " · şematik güzergâh" : ""}
            </p>
          </>
        ) : (
          <>
            <p className="feature-summary">{summary}</p>
            <div className="region-card-facts">
              <Snowflake size={16} />
              {region.climate}
            </div>
            <div className="trade-chips">
              {region.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </>
        )}
        {entry?.positionStatus === "approximate" && (
          <p className="position-note">≈ Haritadaki konum yaklaşık</p>
        )}
        {entry?.positionStatus === "unlocated" && (
          <p className="position-note">Haritadaki konumu henüz doğrulanmadı.</p>
        )}
      </div>
      <div className="detail-actions">
        <button
          className="gold-button"
          onClick={() => navigate(`/wiki/${wikiId}`)}
        >
          <BookOpen size={16} />
          Wiki sayfasını aç
          <ArrowRight size={16} />
        </button>
        {(entry || feature) && (
          <button
            className="detail-region-link"
            onClick={() => navigate(`/atlas/${region.id}`)}
          >
            {region.name} bölgesini keşfet
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </aside>
  );
}
