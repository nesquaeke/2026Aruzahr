import type { LoreArticle, RegionId } from '../data'
import { bookExpansions, bookDetails, researchBooks } from './book-manuscripts'
import { originalBooks } from './book-originals'

export type BookCondition = 'eski' | 'yasakli' | 'kayip'
export type WorldBook = {
  id: string
  title: string
  subtitle: string
  author: string
  condition: BookCondition
  color: string
  motif: 'window' | 'sun' | 'wall' | 'seal' | 'anvil' | 'sea' | 'stone' | 'grain'
  place: string
  note: string
  excerpt: string[]
  existing?: boolean
  authorId?: string
  period?: string
  category?: 'arastirma' | 'yolculuk' | 'tanıklık'
  placeId?: string
  region?: RegionId
  leafTitles?: string[]
  marginNotes?: string[]
}

export const bookConditionLabels: Record<BookCondition, string> = {
  eski: 'Eski kitap', yasakli: 'Yasaklı kitap', kayip: 'Kayıp yapraklar',
}

// The six new texts are original public world writing, rather than quotations
// from the uploaded sources. "Lost" refers to missing folios, not a hidden
// adventure destination. The censored pamphlet contains no ritual instructions.

export const worldBooks: WorldBook[] = [...originalBooks.map(book => ({...book, ...bookDetails[book.id], excerpt: bookExpansions[book.id] || book.excerpt})), ...researchBooks]

export const bookArticles: LoreArticle[] = worldBooks.filter(book => !book.existing).map(book => ({
  id: book.id,
  name: book.title,
  kind: 'chronicle',
  region: book.region || 'danstsud',
  subtitle: `${book.subtitle} · ${book.author}`,
  summary: book.note,
  sources: ['Kitaplık — özgün halka açık dünya yazımı; kaynak belgelerden alıntı değildir'],
  mapLocation: book.placeId,
  related: [...new Set([...(book.authorId ? [book.authorId] : []), ...(book.placeId ? [book.placeId] : []), ...(book.id === 'kitap-cevherin-hakki' ? ['marhalden', 'karlan-iscilik-ve-gecit'] : book.id === 'kitap-sicak-taslar' ? ['ternhaven', 'cevher-cizgisi', 'rydorn-sirti'] : book.id === 'kitap-iki-kiyi' ? ['honud', 'hardlane', 'buyuk-kirilma'] : book.id === 'kitap-bes-duvar' ? ['valdareth', 'danstsud-ekmek-ve-vergi'] : book.id === 'kitap-kirik-muhur' ? ['valdareth', 'danstsud-makam-ve-itiraz'] : [])])],
  sections: [
    { title: 'Kalan yaprak', paragraphs: book.excerpt },
    { title: 'Nüsha hakkında', paragraphs: [`${bookConditionLabels[book.condition]} · ${book.author}. ${book.note}`, book.condition === 'yasakli' ? 'Eldeki kopyada, risalenin kime gönderildiğini gösteren bir isim bulunmaz. Sayfa kenarındaki mühür silinmiştir. Yazarın makama itirazı kalmış; onu çoğaltan yazıcının adı kaybolmuştur.' : book.condition === 'kayip' ? 'Eksik varakların nerede olduğu bilinmez. Bu kayıt, kalan satırları bir araya getirir; kayıp bir sayfanın içeriği hakkında kesin hüküm vermez.' : 'Bu kısa nüsha, mesleğin veya kıyı hayatının içinde anlatılan bir tanıklıktır. Bir kâtibin yorumu ile bütün ülkenin tarihi aynı şey değildir.'] },
  ],
}))
