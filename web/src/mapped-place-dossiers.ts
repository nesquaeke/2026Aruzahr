import type { Dossier } from './presentation'
import { newlyMappedPlaces } from './map-corrections'

// New fictional estimates for play, not numbers extracted from the author's
// documents or inferred mechanically from the size of a drawn house.
type Estimate = [string, string, string[]]
const estimates: Estimate[] = [
  ['orunq', '≈ 18.000', ['Kıyı yükü', 'Su hizmetleri', 'Kervan iaşesi']],
  ['vaelgrim', '≈ 2.700', ['Balık', 'Kışlık erzak', 'Kayık bakımı']],
  ['dravenspire', '≈ 4.600', ['Ağ ve halat', 'Balık', 'Deri işleri']],
  ['wolfcrag', '≈ 1.400', ['Av ürünleri', 'Post', 'Yol rehberliği']],
  ['boreals-end', '≈ 2.900', ['Köprü geçişi', 'Erzak', 'Ahşap bakım']],
  ['deadveil', 'Kalıcı nüfus bilinmiyor', ['Mevsimlik ziyaretler']],
  ['silent-cairn', '≈ 430', ['Av ürünleri', 'Odun', 'Ocak misafirliği']],
  ['skeldrun', '≈ 1.800', ['Balık', 'Kayık bakımı', 'Kışlık erzak']],
  ['hjorthal', '≈ 2.100', ['Ağ örme', 'Balık', 'Kıyı hizmeti']],
  ['winterhavn', '≈ 3.100', ['Kış ambarı', 'Balık', 'Tekne onarımı']],
  ['ashfrost', '≈ 350', ['Yakacak', 'Av ürünleri', 'Basit onarım']],
  ['white-woe', 'Kalıcı nüfus bilinmiyor', ['Anma ve ziyaret']],
  ['whisperhold', 'Kalıcı nüfus bilinmiyor', ['Anma ve ziyaret']],
  ['frostgrave', '≈ 680', ['Odun', 'Kış erzağı', 'Post']],
  ['yatesh', '≈ 760', ['Kıyı taşımacılığı', 'Balık', 'Erzak']],
  ['bleakmoor', '≈ 1.100', ['Odunculuk', 'Av ürünleri', 'Deri']],
  ['isenreach', '≈ 1.600', ['Kayıkçılık', 'Kıyı ikmali', 'Balık']],
  ['eirhollow', '≈ 1.250', ['Odun', 'Kışlık erzak', 'Balık']],
  ['varnskuld', '≈ 920', ['Kıyı emeği', 'Balık', 'Av ürünleri']],
  ['nivor', '≈ 560', ['Kışlık erzak', 'Odun', 'Kayık bakımı']],
  ['aelmar', '≈ 2.200', ['Kıyı pazarı', 'Balık', 'Ahşap işler']],
  ['thessar', '≈ 4.800', ['İskele hizmeti', 'Balık', 'Erzak pazarı']],
  ['morvail', '≈ 1.500', ['Tahıl', 'Bahçe ürünleri', 'Yerel iaşe']],
  ['yornhal', '≈ 1.300', ['Tarım', 'Sürü ürünleri', 'Araba bakımı']],
  ['vornic', '≈ 1.700', ['Bahçe ürünleri', 'Tahıl', 'Küçük zanaat']],
  ['frethar', '≈ 1.100', ['Tarım', 'Konaklama', 'Erzak']],
  ['tyelmar', '≈ 2.600', ['Değirmencilik', 'Tahıl', 'Kıyı pazarı']],
  ['arden', '≈ 1.900', ['Nehir ürünleri', 'Bahçecilik', 'Yerel yük']],
  ['nuvik', '≈ 1.050', ['Tarım', 'Odun', 'Sürü ürünleri']],
  ['telvai', '≈ 850', ['Tahıl', 'Ahşap işleri', 'Yerel iaşe']],
  ['velthar', '≈ 1.800', ['Yamaç otlakları', 'Kıyı pazarı', 'Erzak']],
  ['brolin', '≈ 1.100', ['Balık', 'Tekne bakımı', 'Kıyı yükü']],
  ['othmar', '≈ 1.650', ['Tahıl', 'Sürü ürünleri', 'Pazar iaşesi']],
  ['eldwen', '≈ 1.450', ['Bahçe ürünleri', 'Tarım', 'Odun']],
  ['thandor', '≈ 2.000', ['Köprü hizmeti', 'Tarım', 'Yerel ticaret']],
  ['cevan', '≈ 3.200', ['Kıyı yükü', 'Balık', 'Zanaat']],
  ['velyra', '≈ 1.150', ['Tarım', 'Hayvancılık', 'Yerel erzak']],
  ['rymar', '≈ 1.500', ['Tahıl', 'Değirmencilik', 'Sürü ürünleri']],
  ['lysmar', '≈ 1.300', ['Nehir pazarı', 'Bahçecilik', 'Tekne bakımı']],
  ['lurnvalf', '≈ 1.800', ['Tahıl', 'Odun', 'Yerel zanaat']],
  ['jathra', '≈ 2.100', ['Kıyı ticareti', 'Balık', 'Yerel erzak']],
  ['melthir', '≈ 2.450', ['Nehir yükü', 'Tarım', 'Değirmencilik']],
  ['orinhal', '≈ 3.600', ['Kıyı pazarı', 'Balık', 'Zanaat']],
  ['oren', '≈ 1.050', ['Tahıl', 'Bahçe ürünleri', 'Kıyı iaşesi']],
  ['cylwen', '≈ 1.250', ['Nehir ürünleri', 'Tarım', 'Kayık işleri']],
  ['halden', '≈ 1.900', ['Değirmencilik', 'Tahıl', 'Ahşap bakım']],
  ['lamden', '≈ 1.400', ['Bahçe ürünleri', 'Değirmencilik', 'Tahıl']],
  ['vossir', '≈ 1.300', ['Tarım', 'Nehir geçişi', 'Yerel erzak']],
  ['runeth', '≈ 1.700', ['Nehir pazarı', 'Tahıl', 'Sürü ürünleri']],
  ['teyla', '≈ 2.200', ['Değirmencilik', 'Kıyı yükü', 'Tahıl']],
  ['eroth', '≈ 1.000', ['Bahçe ürünleri', 'Tarım', 'Kıyı iaşesi']],
  ['janvar', '≈ 650', ['Nehir ürünleri', 'Tahıl', 'Yerel iaşe']],
]
const ruins = new Set(['deadveil', 'white-woe', 'whisperhold'])
export const mappedPlaceDossiers: Record<string, Dossier> = Object.fromEntries(estimates.map(([id, population, exports]) => {
  const place = newlyMappedPlaces.find(entry => entry.id === id)!
  const ruin = ruins.has(id), northern = place.region === 'honud', desert = place.region === 'xotar'
  return [id, {
    badge: ruin ? 'Eski yapı alanı' : northern ? 'Kış yerleşimi' : desert ? 'Kıyı ve kervan kenti' : 'Ova yerleşimi',
    population, populationNote: ruin ? 'Kaynakta kalıcı sayım bulunmuyor' : '9 Ekim 2026 yeni dünya yazımı · hane ve çevre tahmini; kaynak sayımı değil',
    ruler: ruin ? 'Etkin yerel idare doğrulanmadı' : northern ? 'Yerel ocak ve hane temsilcileri' : desert ? 'Su ve kıyı meclisi' : 'Yerel toprak idaresi',
    government: ruin ? 'Harabe alanı · düzenli idare kaydı yok' : northern ? 'Klan ve komşuluk düzeni' : desert ? 'Su hakkı ve kıyı toplantıları' : 'Feodal bağlılık · yerel görev dağılımı',
    climate: northern ? 'Uzun kış · kısa çalışma mevsimi' : desert ? 'Kurak kıyı · suya bağlı yaşam' : 'Ova ve kıyı · tarım ve yerel yollar',
    exports, powers: ruin ? [0, 0, 1, 0] : desert ? [3, 4, 3, 2] : northern ? [1, 2, 1, 1] : [2, 2, 2, 1],
    motto: ruin ? 'Eski eşik, yeni bir cevap vaat etmez.' : northern ? 'Bir ocağın dumanı, komşunun haberidir.' : desert ? 'İlk tas, pazarlıktan önce gelir.' : 'Büyük şehrin sofrası burada başlar.',
    hooks: [{ title: place.subtitle || 'Yerleşimin gündelik hayatı', text: place.summary || '' }],
    art: `${id}-atlas`,
  } satisfies Dossier]
}))
