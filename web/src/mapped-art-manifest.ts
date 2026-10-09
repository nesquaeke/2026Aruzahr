import type { Artwork } from './media'
import { newlyMappedPlaces, mapSettlementAliases } from './map-corrections'

/** Mechanical details of the author's original 8K drawing; no new art claimed. */
export const mappedSettlementArtworks: Artwork[] = newlyMappedPlaces.map(place => ({
  id: `${place.id}-atlas`, src: `/illustrations/${place.id}-atlas.webp`, title: `${place.name} · Özgün harita ayrıntısı`, caption: `Yazarın 8K çizimindeki yerleşim ve yakın çevresi${place.id === 'frethar' ? ' · Fehar' : ''}`, origin: 'map', category: 'landscape', relatedId: mapSettlementAliases[place.id] || place.id,
}))
export const mappedSettlementAliases: Record<string, string> = Object.fromEntries(newlyMappedPlaces.map(place => [place.id, `${place.id}-atlas`]))
