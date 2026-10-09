import type { LoreArticle } from '../data'

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
}

export const bookConditionLabels: Record<BookCondition, string> = {
  eski: 'Eski kitap', yasakli: 'Yasaklı kitap', kayip: 'Kayıp yapraklar',
}

// The six new texts are original public world writing, rather than quotations
// from the uploaded sources. "Lost" refers to missing folios, not a hidden
// adventure destination. The censored pamphlet contains no ritual instructions.
export const worldBooks: WorldBook[] = [
  {
    id: 'bryndon-kiyi-defteri', title: 'Kıştan Önceki Taşlar', subtitle: 'Bryndon’un Kıyı Defteri', author: 'Kâtip Bryndon', condition: 'eski', color: '#697b83', motif: 'window', place: 'Frostbay', existing: true,
    note: 'Theramisli bir kâtibin saha defteri. Yuvarlak taş duvarların, değirmen yuvalarının ve daha uzun bir yaz ihtimalinin peşinde.',
    excerpt: ['Bana Frostbay’in eski olduğunu söylediler. Oraya vardığımda eski kelimesinin ne kadar küçük olduğunu anladım.', 'Okuyana borcum, bilmediğimi saklamamaktır. Bir duvarın yaşlı olması onu bildiğimiz en eski halkın işi kılmaz. Bir yaprağın taşta izi bulunması da bütün kıyının orman olduğunu ispat etmez. Yine de bir insan her şüpheyi susturmadan bakabilir. Bu defteri, bakmayı bırakmamak için tuttum.'],
  },
  {
    id: 'buyuk-kirilma', title: 'Büyük Kırılma', subtitle: 'Ateş, ışık ve yitirilen bir dünya', author: 'Halk anlatıları derlemesi', condition: 'eski', color: '#865343', motif: 'sun', place: 'Valhunar', existing: true,
    note: 'Danstsud’un Işığın Savaşı ile Honud’un Kan Yarıldığında anlatısı yan yana. Aynı felaket, farklı hafızalar.',
    excerpt: ['“Bizi buz değil, iki büyük çocuğun kavgası öldürdü.”', 'Kadim imparatorluğun limanları artık aynı kıyıya açılmaz. Danstsud’da Bakır Ana’ya edilen dua, bir evin ateşten korunmasını ister; Honud’da söylenen ağıt, kendilerini dünyadan büyük gören iki hükümdarı da sorgular. Bu iki sesin arasında kaybolan, yalnız bir saltanat değildir. İnsanların yarına duyduğu güven de kırılmıştır.'],
  },
  {
    id: 'kitap-bes-duvar', title: 'Beş Duvarın Gölgesinde', subtitle: 'Bir duvar ustasının şehir defteri', author: 'Usta Erhan Telis', condition: 'eski', color: '#79596b', motif: 'wall', place: 'Valdareth',
    note: 'Başkentte bir duvarın kime güven, kime gölge verdiğini anlatan kısa bir zanaat defteri.',
    excerpt: ['Babam ilk duvarı onarırken merdivenini bir soylunun avlusuna dayamış. Ben aynı taşı aradığımda orada bir fırının arka odası vardı. Sahibine eski avluyu sordum. “Hamur burada iyi kabarır,” dedi. Bir başkentin geçmişini bazen kapılardan değil, ekmekten öğrenirsiniz.', 'Maviyle mor arasında kalan kiremit, gün batımında kralın çatısına benzer. Fakat aşağı mahallede o kiremidin altında yağmuru tutan şey eski bir yelken olabilir. Saraya taş taşıyan ustanın evi, saray gibi görünmek zorunda değildir.', 'Duvarların sayısını bilen çoktur. Hangi kapıda durmanız gerektiğini bilenler ise sayıyı bir daha sormaz. Beşinci duvarın içinde büyüyen bir çocuğa şehir dedikleri, birinci duvarın gölgesinde büyüyenin bildiği şehirden başkadır.'],
  },
  {
    id: 'kitap-kirik-muhur', title: 'Kırık Mühür Risalesi', subtitle: 'Makama itiraz üzerine üç sayfa', author: 'Adını saklayan bir yazıcı', condition: 'yasakli', color: '#74474b', motif: 'seal', place: 'Danstsud',
    note: 'Bazı lordluklarda çoğaltılması engellenen siyasi bir risale. Yasak konusu büyü değil, hüküm ile hesap verme arasındaki ilişkidir.',
    excerpt: ['Mühür, bir hükmün kimin elinden çıktığını söyler. Hükmün doğru olduğunu söylemez. Köyün köprüsü yıkıldığında mührü taşıyan kese kuru kalıyor, çiftçinin arabası suya düşüyorsa iki taraf aynı kanunu yaşamamıştır.', 'Bir makamın alınabileceğini herkes bilir. Fakat bir halkın alışkanlığı bir emirle alınamaz. Lordu değiştirip ölçüyü, borcu ve kışlık payı aynı bırakan yönetim, yeni bir yüzle eski kapıyı açmış olur.', 'Son sayfanın kenarı kesilmiştir. Kopyacının bıraktığı kısa not okunur: “İtiraz, bağlılığın sonu olmak zorunda değildir.” Bu sözün altında isim yoktur.'],
  },
  {
    id: 'kitap-cevherin-hakki', title: 'Cevherin Hakkı', subtitle: 'Ocak, örs ve pazar defteri', author: 'Marhaldenli bir lonca kâtibi', condition: 'eski', color: '#687568', motif: 'anvil', place: 'Marhalden',
    note: 'Kazanın, biçim verenin ve satanın payını tartışan bir çalışma defteri. Değerli cevherin bedelini insanların emeğinde arar.',
    excerpt: ['Terazinin üstüne üç el kondu. Ocak sahibi karanlıkta kazılan yükü, demirci ateşte kaybedilen parçayı, tüccar geçitte ödenen masrafı söyledi. Üçü de aynı külçeyi gösteriyordu. Kâtip olarak benim işim dördüncü bir el uzatmak değildi; hangi elin neyi eksilttiğini yazmaktı.', 'Marhalden’de en pahalı metalin hafifliğinden söz edilir. Onu taşıyan sırtta hafif olan bir şey yoktur. Bir yükün ocaktan çıkması, doğru tartılması ve bahar kapanmadan doğuya inmesi ayrı ayrı emektir.', 'Baş lonca değiştiğinde eski defteri yakmayın. Yeni başın dürüstlüğü, kendinden önceki hesabı okuyabilmesinden başlar.'],
  },
  {
    id: 'kitap-iki-kiyi', title: 'İki Kıyının Ezgileri', subtitle: 'Eksik bir ağıt derlemesi', author: 'Derleyenin adı silinmiş', condition: 'kayip', color: '#526a83', motif: 'sea', place: 'Honud · Hardlane',
    note: 'Aynı sözcüğün iki halkta farklı hatıralara açıldığı küçük bir ağıt derlemesi. İlk ve son yaprakları kayıptır.',
    excerpt: ['Batıdan gelen kadın şarkının ikinci dizesini bilmiyordu. Hanın kapısında bekleyen adam, dizeyi başka bir adla tamamladı. İkisi aynı ezgiyi söylediklerini anlayınca tartışmayı bıraktı. Şarkı, onların konuştuğu dillerden daha eski değildi belki; ama o akşam ikisinden de daha sabırlıydı.', 'Bir kıyıda ana kelimesi koruyanın adıydı. Öteki kıyıda aynı söz, kar altında bekleyenin. Derleyici iki dize arasına bir hüküm koymamış. Kâğıdın ortasında boşluk bırakmış.', 'Bu yaprakta müzik işaretleri yoktur. Son satır, kenara küçük yazılmıştır: “Bir ağıdı duymak, onu söyleyenin kaybını devralmak değildir; yine de sesini kesmemeyi öğretir.”'],
  },
  {
    id: 'kitap-sicak-taslar', title: 'Sıcak Taşların Yolcusu', subtitle: 'Rydorn’dan kalan dört varak', author: 'Yolcu Ivena Sarell', condition: 'kayip', color: '#687965', motif: 'stone', place: 'Ternhaven · Rydorn Sırtı',
    note: 'Sıcak suyun çevresindeki hayatı kaydeden bir yolcu. Harabe hakkında hüküm vermektense orada yaşayanlara kulak verir.',
    excerpt: ['Taşa avucumu koydum; hava soğuktu, taş değil. Ternhaven’de ilk öğrendiğim şey bu oldu. Aynı suyun başında bir çocuk çamaşır duruluyor, yaşlı bir adam çatlamış elini ısıtıyordu. İkisinin de suyu açıklayan bir söylenceye ihtiyacı yoktu.', 'Harabeye bakınca bir saray görmek kolaydır. Taşın yanında diz çökmüş kadını görünce yolcu başka bir soru sorar: Bu taş bugün kimin işine yarıyor? Kadın, oyuntuda biriktirdiği ılık suyla kırık kabını yıkıyordu.', 'Dördüncü varağın yarısı kopmuş. Kalan satırda bir yol projesinin adı geçer; Cevher Çizgisi. Çizilmiş bir yolun kâğıtta sıcak suya ulaşması, arabaların da ulaşacağı anlamına gelmiyor.'],
  },
  {
    id: 'kitap-kisa-pay', title: 'Kışa Pay Ayırmak', subtitle: 'Kıyı hanesinin küçük takvimi', author: 'Çoban Sella Vorn', condition: 'eski', color: '#8d764d', motif: 'grain', place: 'Frostbay',
    note: 'Bir sürünün, bir sobanın ve birbirine yardım eden hanelerin kışlık hesabı. Hayatta kalmayı kahramanlıktan önce hazırlıkta arar.',
    excerpt: ['Tervanın boynuzu ince donu kaldırır. Kalın buzu kaldıramaz. Bunu bilmeyen, hayvanı güçlü sanıp yemini azaltır; sonra kendi bilgisizliğine hayvanın açlığını ekler. İlk payı hayvana ayırmamın sebebi şefkatten önce hesaptır.', 'Dar Soba’da bir evin ateşi sönerse komşunun odunu hemen azalmaz. Önce kapısı açılır. İçeri gelenler ısınır, ertesi sabah ağ onarır, su taşır ya da çocuklara bakar. Borç her zaman keseyle dönmez.', 'Takvimimin boş günleri var. Fırtına yüzünden yapamadığımız işler için boş bıraktım. Gelecek yıl aynı boşluğu gördüğümüzde neyi erkenden bitirmemiz gerektiğini hatırlayalım diye.'],
  },
]

export const bookArticles: LoreArticle[] = worldBooks.filter(book => !book.existing).map(book => ({
  id: book.id,
  name: book.title,
  kind: 'chronicle',
  region: 'danstsud',
  subtitle: `${book.subtitle} · ${book.author}`,
  summary: book.note,
  sources: ['Kitaplık — özgün halka açık dünya yazımı; kaynak belgelerden alıntı değildir'],
  mapLocation: book.id === 'kitap-bes-duvar' || book.id === 'kitap-kirik-muhur' ? 'valdareth' : book.id === 'kitap-cevherin-hakki' ? 'marhalden' : book.id === 'kitap-sicak-taslar' ? 'ternhaven' : 'frostbay',
  related: book.id === 'kitap-cevherin-hakki' ? ['marhalden', 'karlan-iscilik-ve-gecit'] : book.id === 'kitap-sicak-taslar' ? ['ternhaven', 'cevher-cizgisi', 'rydorn-sirti'] : book.id === 'kitap-iki-kiyi' ? ['honud', 'hardlane', 'buyuk-kirilma'] : book.id === 'kitap-bes-duvar' ? ['valdareth', 'danstsud-ekmek-ve-vergi'] : book.id === 'kitap-kirik-muhur' ? ['valdareth', 'danstsud-makam-ve-itiraz'] : ['frostbay', 'hardlane-otlak-hayvanlari'],
  sections: [
    { title: 'Kalan yaprak', paragraphs: book.excerpt },
    { title: 'Nüsha hakkında', paragraphs: [`${bookConditionLabels[book.condition]} · ${book.author}. ${book.note}`, book.condition === 'yasakli' ? 'Eldeki kopyada, risalenin kime gönderildiğini gösteren bir isim bulunmaz. Sayfa kenarındaki mühür silinmiştir. Yazarın makama itirazı kalmış; onu çoğaltan yazıcının adı kaybolmuştur.' : book.condition === 'kayip' ? 'Eksik varakların nerede olduğu bilinmez. Bu kayıt, kalan satırları bir araya getirir; kayıp bir sayfanın içeriği hakkında kesin hüküm vermez.' : 'Bu kısa nüsha, mesleğin veya kıyı hayatının içinde anlatılan bir tanıklıktır. Bir kâtibin yorumu ile bütün ülkenin tarihi aynı şey değildir.'] },
  ],
}))
