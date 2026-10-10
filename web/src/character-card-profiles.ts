// Editorial frame tiers, combining public martial, magical and political
// influence as requested by the author. These are not combat statistics.
import { newWorldCharacters } from './lore/world-roster'
import { newDanstsudCharacters } from './lore/danstsud-roster'
import { writerCharacters } from './lore/writers'
export type PowerTier = 'ordinary' | 'distinguished' | 'powerful' | 'supreme'
export const powerTiers: Record<PowerTier, { label: string; ornament: number; description: string }> = {
  ordinary: { label: 'Olağan', ornament: 0, description: 'Gündelik hayattaki insanlar; sade bir çerçeve.' },
  distinguished: { label: 'Seçkin', ornament: 1, description: 'Yetenek, hizmet veya yerel etkiyle öne çıkan kişiler.' },
  powerful: { label: 'Kudretli', ornament: 2, description: 'Büyü ustaları, güçlü lordlar ve büyük kurumların başındaki kişiler.' },
  supreme: { label: 'Yüce', ornament: 3, description: 'Krallık ölçeğinde belirleyici güce ve nüfuza sahip kişiler.' },
}
const groups: Record<PowerTier, string[]> = {
  supreme: ['eryndorn'],
  powerful: ['alisande', 'maelis-dervan', 'tharion', 'damian', 'rovan-mereth', 'averen-dhal', 'elyas-theren', 'varlen-neth', 'vessa-thol', 'edran-korr', 'vardek', 'vaelcor', 'valerius', 'orren-vask', 'teren-halvek', 'solan'],
  distinguished: ['ilyenne', 'mirelda', 'aveline', 'rook', 'garran-veyl', 'mera-sorn', 'odran-vehl', 'nera-veld', 'bryndon-kiyi-defteri', 'kaelen', 'ellyn', 'ghorin', 'zylara', 'mrog', 'gil', 'jeremiah', 'volomiyr', 'rickon', 'varric', 'corvan', 'rina', 'grathor', 'varoxh', 'sera-neld', 'doran-kest', 'lethan-orve'],
  ordinary: ['seraphinia', 'tarb', 'yasli-kaelen'],
}
export const characterPower: Record<string, PowerTier> = Object.fromEntries([...Object.entries(groups).flatMap(([tier, ids]) => ids.map(id => [id, tier as PowerTier])), ...[...newDanstsudCharacters, ...newWorldCharacters, ...writerCharacters].filter(c => c.power).map(c => [c.id, c.power!])])
export const powerFor = (id?: string) => id ? characterPower[id] : undefined
