import type { Artwork } from './media'
import { writerCharacters } from './lore/writers'

// Six original painted portraits generated on 10 October 2026. Each retains
// its own image; power-dependent frames and names remain separate UI elements.
export const writerArtworks: Artwork[] = writerCharacters.map(person => ({
  id: person.id, src: `/illustrations/${person.id}.webp`, title: person.name,
  caption: person.role, origin: 'generated', portrait: true, painted: true,
  category: 'portrait', relatedId: person.id,
}))
