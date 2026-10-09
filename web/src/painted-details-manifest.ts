import type { Artwork } from './media'

const fauna = [
  ['tac-kecisi', 'Karlan Taç Keçisi', 'karlan-canlilari'], ['kar-kartali', 'Veyrakar Kar Kartalı', 'karlan-canlilari'], ['cig-kuzgunu', 'Tholkar Çığ Kuzgunu', 'karlan-canlilari'], ['orvak', 'Sırtyünlü Orvak', 'karlan-canlilari'], ['varkul', 'Buzyeleli Varkul', 'karlan-canlilari'], ['kharven', 'Körük Sırtlı Kharven', 'karlan-canlilari'], ['ulveth', 'Taşpençeli Ulveth', 'karlan-canlilari'], ['gumusalasi', 'Aldara Gümüşalası', 'karlan-canlilari'],
  ['tervan', 'Kırağı Boynuzlu Tervan', 'hardlane-otlak-hayvanlari'], ['norruk', 'Kütburunlu Norruk', 'hardlane-otlak-hayvanlari'], ['velkir', 'Saztırnaklı Velkir', 'hardlane-otlak-hayvanlari'],
]
const units = [
  ['mor-pelerin', 'Mor Pelerin · İç kapı nöbeti', 'mor-pelerin'], ['mavi-pelerin', 'Mavi Pelerin · Saha birliği', 'mavi-pelerin'], ['mor-donanma', 'Mor Donanma · Rilorn’da hazırlık', 'mor-donanma'], ['dorvenhall-koruculari', 'Dorvenhall · Orvel binekli korucular', 'dorvenhall-sinir-koruculari'], ['elorwyn-dini-kuvvetleri', 'Elorwyn · Paladin, rahip ve Siper Rahibeleri', 'elorwyn-adak-muhafizlari'], ['marhalden-zirhli-kuvvet', 'Marhalden · Akçelik geçit nöbeti', 'marhalden-akcelik'],
]
const villages = [
  ['pilorn', 'Pilorn · Tahıl havzası'], ['fehar', 'Fehar · Ova otlakları'], ['gaalmire', 'Gaalmire · Yol hanları'], ['naeron', 'Naeron · Nehir bahçeleri'], ['fevric', 'Fevric · Arpa değirmenleri'], ['theld', 'Theld · Hasat günü'], ['korhenden', 'Korhenden · Arabacı atölyeleri'], ['uldar', 'Uldar · Erzak pazarı'], ['tolvur', 'Tolvur · Doğu sürüleri'], ['toran', 'Toran · Yem ve yük'], ['harven', 'Harven · Av ve odun'], ['mavric', 'Mavric · Orman nöbeti'],
]
export const paintedDetailArtworks: Artwork[] = [
  ...fauna.map(([id, title, relatedId]): Artwork => ({ id: `${id}-painted`, src: `/illustrations/${id}-painted.webp`, title, relatedId, caption: 'Tür betimlemesine bağlı, boya dokulu canlı illüstrasyonu', origin: 'generated', painted: true, category: 'fauna' })),
  ...units.map(([id, title, relatedId]): Artwork => ({ id: `${id}-painted`, src: `/illustrations/${id}-painted.webp`, title, relatedId, caption: 'Kurumun sahadaki hayatı · yağlıboya ve guaj resim dili', origin: 'generated', painted: true, category: 'scene' })),
  ...villages.map(([id, title]): Artwork => ({ id: `${id}-painted`, src: `/illustrations/${id}-painted.webp`, title, relatedId: id, caption: 'Yerleşimin geçim düzeni · boya dokulu manzara', origin: 'generated', painted: true, category: 'landscape' })),
  { id: 'hardlane-grazers-painted', src: '/illustrations/hardlane-grazers-painted.webp', title: 'Hardlane · Çözülmüş otlak', relatedId: 'hardlane-otlak-hayvanlari', caption: 'Sıcak su çevresinde mevsimlik otlama · boya dokulu habitat', origin: 'generated', painted: true, category: 'scene' },
]
export const paintedDetailAliases: Record<string, string> = {
  ...Object.fromEntries([...fauna, ...villages].map(([id]) => [id, `${id}-painted`])),
  ...Object.fromEntries(units.map(([id, , relatedId]) => [relatedId, `${id}-painted`])),
}
