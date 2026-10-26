import type { Artwork } from './media'
export const livingPeople = [
  ['eren-keld', 'Eren Keld'],
  ['ekin-sar', 'Ekin Sar'],
  ['kesra-venn', 'Kesra Venn'],
  ['haldor-pell', 'Haldor Pell'],
  ['veyra-senn', 'Veyra Senn'],
  ['orsa-dren', 'Orsa Dren'],
  ['dalen-marr', 'Dalen Marr'],
  ['ressa-korr', 'Ressa Korr'],
]
export const livingArtworks: Artwork[] = [
  ...livingPeople.map(
    ([id, title]): Artwork => ({
      id: `living-${id}`,
      src: `/illustrations/living-${id}.webp`,
      title,
      caption:
        'Yaşayan yolculuk · 26 Ekim 2026 bağımsız karanlık yağlıboya kişi portresi',
      relatedId: id,
      origin: 'generated',
      painted: true,
      portrait: true,
      category: 'portrait',
    }),
  ),
  ...[
    ['isci-sofrasi', 'Marhalden · İşçilerin ortak sofrası', 'marhalden'],
    ['gecit-siginagi', 'Harven · Yol sığınağı', 'harven'],
    ['frostbay-pazar', 'Frostbay · Kapalı kıyı pazarı', 'frostbay'],
    ['ternhaven-savak', 'Ternhaven · Sıcak su savağı', 'ternhaven'],
  ].map(
    ([id, title, relatedId]): Artwork => ({
      id: `living-${id}`,
      src: `/illustrations/living-${id}.webp`,
      title,
      caption:
        'Yaşayan yolculuk · 26 Ekim 2026 bağımsız geniş kadrajlı karanlık yağlıboya; koşullu görev sonucu değildir',
      relatedId,
      origin: 'generated',
      painted: true,
      category: 'scene',
    }),
  ),
]
export const winterPeople = [
  ['sena-erven', 'Sena Erven'],
  ['miren-aska', 'Miren Aska'],
  ['bera-hald', 'Bera Hald'],
  ['iven-rusk', 'Iven Rusk'],
  ['elda-sorren', 'Elda Sorren'],
  ['neris-vel', 'Neris Vel'],
  ['maeron-vesk', 'Yüzbaşı Maeron Vesk'],
  ['taren-olt', 'Taren Olt'],
  ['ravel-dorr', 'Ravel Dorr'],
]
const sceneRows = [
  ['ilac', 'Marhalden · İki yatak', 'marhalden'],
  ['kopru', 'Batı geçidindeki yük köprüsü', 'marhalden'],
  ['ekmek', 'Harven · Küçük fırın', 'harven'],
  ['varkul', 'Mavric · Varkul ini', 'mavric'],
  ['uyku', 'Frostbay · Eski taş salon', 'frostbay'],
  ['baba', 'Frostbay · Kıyı odası', 'frostbay'],
  ['kayik', 'Frostbay · Fırtına kıyısı', 'frostbay'],
  ['bahce', 'Ternhaven · Sıcak su bahçesi', 'ternhaven'],
  ['ambar', 'Dranthol · İkmal avlusu', 'dranthol'],
  ['kul', 'Kömürcü evlerinin kalıntıları', 'dranthol'],
  ['marhalden', 'Marhalden · Aldara ve iki kale', 'marhalden'],
  ['kamp', 'Hardlane · Akşam kampı', 'hardlane'],
]
export const winterArtworks: Artwork[] = [
  ...livingArtworks,
  {
    id: 'winter-galeri-kiskaci',
    src: '/illustrations/winter-galeri-kiskaci.webp',
    title: 'Galeri Kıskacı',
    caption:
      'Marhalden sıcak su galerilerinin kabuklu canlısı · bağımsız karanlık yağlıboya, 26 Ekim 2026',
    relatedId: 'galeri-kiskaci',
    origin: 'generated',
    painted: true,
    category: 'fauna',
  },
  ...[
    ['ocak-gecesi', 'Marhalden · Avluda son akşam', 'marhalden'],
    ['kok-sarnici', 'Marhalden · Kök sarnıcı', 'marhalden'],
    ['aldara-halati', 'Batı Aldara · Alt bakım iskelesi', 'marhalden'],
    ['harven-kirec', 'Harven · Eski kireç ocağı', 'harven'],
    ['mavric-avkampi', 'Mavric · Terk edilmiş av kampı', 'mavric'],
    ['frostbay-cark', 'Frostbay · Savak çarkı', 'frostbay'],
    ['borc-odasi', 'Frostbay · Rehberin odası', 'frostbay'],
    ['firtina-yarigi', 'Frostbay · Yarılmış iskele', 'frostbay'],
    ['ternhaven-buhar', 'Ternhaven · Buhar kanalı', 'ternhaven'],
    ['kul-tanigi', 'Dranthol · Kül evlerinin tanığı', 'dranthol'],
    ['yuk-avlusu', 'Marhalden · Yük avlusu', 'marhalden'],
    ['buzlu-galeri', 'Marhalden · Eski sıcak su galerisi', 'marhalden'],
    ['un-ambari', 'Harven · Fırının arka kapısı', 'harven'],
    ['odun-yolu', 'Mavric · Kapalı odun yolu', 'mavric'],
    ['su-kapisi', 'Frostbay · Eski su kapısı', 'frostbay'],
    ['iskele', 'Frostbay · Alçak iskele', 'frostbay'],
    ['ocak-bahcesi', 'Ternhaven · Bahçe kayıt odası', 'ternhaven'],
    ['iki-depo', 'Dranthol · İki depo', 'dranthol'],
  ].map(
    ([id, title, relatedId]): Artwork => ({
      id: `winter-${id}`,
      src: `/illustrations/winter-${id}.webp`,
      title,
      caption:
        'On Kış Kararı · sahne akışı için bağımsız üretilmiş karanlık, ayrıntılı yağlıboya; koşullu sonuçları göstermez',
      relatedId,
      origin: 'generated',
      painted: true,
      category: 'scene',
    }),
  ),
  ...sceneRows.map(
    ([id, title, relatedId]): Artwork => ({
      id: `winter-${id}`,
      src: `/illustrations/winter-${id}.webp`,
      title,
      caption:
        'On Kış Kararı · bağımsız geniş kadrajlı karanlık yağlıboya, 25 Ekim yeniden üretimi; görev sonucu veya kesin harita noktası değildir',
      relatedId,
      origin: 'generated',
      painted: true,
      category: 'scene',
    }),
  ),
  ...winterPeople.map(
    ([id, name]): Artwork => ({
      id: `winter-${id}`,
      src: `/illustrations/winter-${id}.webp`,
      title: name,
      caption:
        'On Kış Kararı · karanlık yağlıboya kişi portresi, 25–26 Ekim üretimi',
      relatedId: id,
      origin: 'generated',
      painted: true,
      portrait: true,
      category: 'portrait',
    }),
  ),
]
export const winterAliases = {
  ...Object.fromEntries(winterPeople.map(([id]) => [id, `winter-${id}`])),
  ...Object.fromEntries(livingPeople.map(([id]) => [id, `living-${id}`])),
  'galeri-kiskaci': 'winter-galeri-kiskaci',
}
