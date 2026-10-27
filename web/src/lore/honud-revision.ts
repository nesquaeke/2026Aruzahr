import type { Place, Region, Section } from '../data'
import type { Dossier } from '../presentation'

export const demographySource = '27 Ekim 2026 · yazar nüfus ve Honud iklim kararı; dağılım ve gündelik yaşam yeni yazımı'

// People belong to exactly one bucket. Seasonal movement along the coast does
// not create a second resident in the port where that household winters.
export const honudDemography = {
  population: 500000,
  capitalId: 'hurnas-ithil',
  capitalPopulation: 0,
  namedCoastalPopulation: 158000,
  coastalVillagePopulation: 262000,
  mobileCoastalPopulation: 80000,
  settlements: {
    frostheimr: 45000,
    norrvar: 35000,
    skeldrun: 18000,
    hjorthal: 16000,
    vaelgrim: 14000,
    isenreach: 12000,
    varnskuld: 10000,
    nivor: 6000,
    ashfrost: 2000,
  } as Record<string, number>,
}

export const abandonedHonudPlaces = new Set([
  'skjornhvaldr', 'kaldryss', 'wolfcrag', 'boreals-end', 'deadveil',
  'silent-cairn', 'winterhavn', 'white-woe', 'whisperhold', 'frostgrave',
  'yatesh', 'bleakmoor', 'eirhollow',
])

const coastalNames: Record<string, string> = {
  frostheimr: 'Frostheimr', norrvar: 'Norrvar', skeldrun: 'Skeldrun',
  hjorthal: 'Hjorthal', vaelgrim: 'Vaelgrim', isenreach: 'Isenreach',
  varnskuld: 'Varnskuld', nivor: 'Nivor', ashfrost: 'Ashfrost',
}
const formerNames: Record<string, string> = {
  skjornhvaldr: 'Skjornhvaldr', kaldryss: 'Kaldryss', wolfcrag: 'Wolfcrag',
  'boreals-end': 'Boreal’s End', deadveil: 'Deadveil', 'silent-cairn': 'Silent Cairn',
  winterhavn: 'Winterhavn', 'white-woe': 'White Woe', whisperhold: 'Whisperhold',
  frostgrave: 'Frostgrave', yatesh: 'Yatesh', bleakmoor: 'Bleakmoor', eirhollow: 'Eirhollow',
}
const format = (n: number) => n.toLocaleString('tr-TR')

export const honudRegionRevision: Pick<Region, 'subtitle' | 'climate' | 'summary' | 'quote' | 'tags' | 'sections'> = {
  subtitle: 'Batıdan kapanan ülke, kıyıda süren hayat',
  climate: 'Batıdan doğuya ilerleyen kalıcı soğuk · yalnız kıyı şeridinde yaşam',
  quote: 'Evimiz kıyı değildir; şimdilik kıyı evimize yer verir.',
  summary: 'Honud’un toplam nüfusu 500.000’dir. İnsanlar donmuş kıyı şeridindeki limanlara, küçük ocaklara ve hareketli hanelere çekilmiştir. İç ülke kalıcı yaşama elverişsizdir; eski başkent Hurnas Ithíl’in nüfusu sıfırdır. Soğuk batıdan doğuya ilerlerken her kıyı topluluğu bir sonraki kışın sınırını yeniden ölçer.',
  tags: ['500.000 kişi', 'Kıyı ocakları', 'Boş başkent', 'Batı Kapanışı'],
  sections: [
    { title: 'Batı Kapanışı', paragraphs: [
      'Honudlular soğuğun doğuya ilerleyişine Batı Kapanışı der. Bu yalnız bir fırtınanın yönü değildir: geçmişte yazın çözülen zemin, bir sonraki yaz çözülmez; kapı eşikleri buzun altında kalır, sığınaklar arasında tutulan yol işaretleri işe yaramaz hâle gelir. Batıdaki bir ocaktan ayrılmak, doğudaki bir ocağın artık son durak olmadığını kabul etmektir.',
      'İç topraklarda sürekli yerleşim yoktur. Eski kentlerin surları, kuleleri ve ağaç kalıntıları ayaktadır; bunlar bugünkü açık pazarların veya yaşanabilir vadilerin işareti sayılmaz. İçeri yapılacak bir ziyaret, yakıtı ve dönüş süresi ayrı hesaplanan bir seferdir. Bir haritada ev çizilmiş olması, o evde hâlâ birinin yaşadığını göstermez.',
    ] },
    { title: 'Donmuş kıyı neden son sığınak?', paragraphs: [
      'Kıyı şeridi de soğuktur. Tuzlu suyun ve buz altındaki akıntının taşıdığı ısı, karaya göre daha küçük bir yaşama aralığı bırakır; kırılan buzun açtığı kanallar balıkçılığı sürdürür. Haneler bu aralığı taş duvar, alçak çatı ve ortak ocaklarla kullanır. Deniz buzuyla kapanır, fakat kıyıdaki her su aynı gün aynı kalınlıkta donmaz.',
      'Balık, tütsülenmiş et ve kıyı avı yiyeceği; yağ, kıyıya vuran kereste ve dışarıdan gelen yakıt ocağı besler. Kendi kendine yeten geniş tarım arazileri yoktur. Murgul’dan kereste ve erzak, başka kıyılardan tahıl gelmesi önemlidir; kötü bir sefer yalnız fiyatı artırmaz, kaç ocağın açık kalabileceğini de değiştirir.',
    ] },
    { title: 'Yarım milyon insan, tek kez sayılan haneler', paragraphs: [
      '500.000 sayısı Honud’un bütün nüfusudur; bir başkentin veya tek bir klanın nüfusu değildir. Aşağıdaki dağılım oyun dünyası için açık bir çalışma hesabıdır: adı kayıtlı dokuz kıyı merkezi 158.000, daha küçük kıyı köyleri ve ocakları 262.000, kıyı boyunca hareket eden haneler 80.000 kişi. İç ülkeye ayrıca nüfus eklenmez.',
      'Hareketli bir hane kışı bir limanda geçirirse hem liman sakini hem göçer olarak iki kez sayılmaz. Yerleşim kartları kent çekirdeğini, kıyı köyleri hanesi daha küçük ocakları gösterir. Bu ayrım vergi, erzak ve seferberlik hesabının aynı insanı tekrar tekrar kullanmasını önler.',
    ], table: { columns: ['Yerleşim / hane grubu', 'Nüfus', 'Kapsam'], rows: [
      ...Object.entries(honudDemography.settlements).map(([id, n]) => [coastalNames[id], format(n), 'Adı kayıtlı kıyı merkezi']),
      ['Küçük kıyı köyleri ve ocakları', '262.000', 'Yukarıdaki kent çekirdeklerinin dışında'],
      ['Hareketli kıyı haneleri', '80.000', 'Yerleşik sayıya yeniden eklenmez'],
      ['Hurnas Ithíl ve iç ülke', '0', 'Kalıcı nüfus yok'],
      ['Honud toplamı', '500.000', 'Ülkenin tamamı'],
    ] } },
    { title: 'Nüfusu olmayan başkent', paragraphs: [
      'Hurnas Ithíl, Donmuş Taç adıyla hatırlanan eski başkenttir. Kalıcı nüfusu sıfırdır. Atalara ve Donuk Ana’ya ilişkin anlatılar ona dönse de şehirde çalışan bir saray, vergi dairesi veya başkent garnizonu varsayılmaz. Taşınmış hanelerin sandıklarında onun mühürlerinin kopyaları bulunabilir; mühür taşımak orada yaşamak değildir.',
      'Eski başkentin kesin yeri doğrulanmamıştır. Kıyıdaki toplantılar bir kalıcı başkent sarayında yapılmaz; mevsime, ulaşılabilir limana ve klanların kabulüne göre kurulur. Eski bir şehrin adına yemin eden temsilci, o şehrin sokaklarında hükmeden bir yönetici sayılmaz.',
    ] },
    { title: 'Klan, kule ve taşınan ad', paragraphs: [
      'Klanlar kıyıya yalnız yiyecek taşımadı. Sözlü büyü öğretisi, ataların adları, evlilik bağları ve anlaşmazlıklar da taşındı. On beş kule geleneği, bugün on beş kulenin birden dolu ve erişilebilir olduğu anlamına gelmez; bir öğretmen kendi kulesinin adını bir kıyı salonunda yaşatabilir.',
      'Skjornhvaldr veya Kaldryss kökenli bir kayıkçı, eski yerleşimin bugünkü sakini olmak zorunda değildir. Hane adı, doğum yeri ve güncel kış ocağı ayrı kaydedilir. İnsanların bir gün geri dönme arzusu sürer; bu arzu, iç ülkenin şimdiden yaşanabilir olduğu iddiasına dönüşmez.',
    ] },
    { title: 'Kapanışın ölçüsü', paragraphs: [
      'Kıyı gözcüleri aynı taşlara her mevsim yeni çizikler açar. Bir koyda geçen yıl eriyen buzun bu yıl kalması, yanındaki ocağa taşınma isteği gönderir. Doğudaki limanlar bu haberi yalnız bir söylence gibi dinleyemez: yer, yakıt ve ağ paylaşımı şimdiden kararlaştırılmalıdır.',
      'Kimse Kapanış’ın kaynağını kesin olarak kanıtlamış değildir. Buz Ruhları, Büyük Kırılma ve Donuk Ana üzerine birbirinden farklı açıklamalar vardır. Kamusal lore bu inançları yan yana taşır; yakın bir ailenin hangi gece evini bırakmak zorunda kaldığı ise bütün açıklamalardan daha somut bir gerçektir.',
    ] },
  ],
}

export const capitalScaleSections: Record<string, Section[]> = {
  valdareth: [{ title: 'Yarım milyonluk başkentin hesabı', paragraphs: [
    'Valdareth’in şehir nüfusu 500.000 kişidir. Bu sayı beş sur kuşağındaki sürekli kent hayatını kapsar; uzaktaki vergi köyleri, bütün Manorveil veya Danstsud krallığı aynı sayıya dahil değildir. Düzensiz büyüme, içteki taş konaklarla dıştaki bostanlı ve ahşap mahalleleri aynı kent kaydında birleştirir.',
    'Serenith, Doğu Aldara ve Teyra’nın beslediği ova, bu büyüklükteki şehrin gündelik zorunluluğudur. Değirmenler ve nehir yükleri günlük yüzlerce tonluk yiyecek akışının bir parçasını taşır; kıyı sevkleri ve Rilorn’daki liman da stok açığını kapatır. Hasadın bolluğu tek başına yetmez: ambar, iskele, fırın, taşıyıcı ve su hizmeti aynı ölçekte çalışmalıdır.',
    'En içteki saray ve obsidyen kilise nüfusun küçük bir payına hizmet eder. Dış surlarda temiz suyu, yangın açıklığını ve atık taşınmasını sürdürmek daha büyük bir emek ister. Mahalle görevlileri kralın her sokakta şahsen bulunduğu bir düzenin yerine geçer; aynı başkentte hizmetin eşit dağılmaması beş surun toplumsal anlamını güçlendirir.',
  ] }],
  morihael: [{ title: 'İkiz başkentte bir milyon kişi', paragraphs: [
    'Morihael’in toplam kent nüfusu 1.000.000 kişidir. Kılıç ve Dal diye anılan iki kentsel yüzün birlikte sayısıdır; iki yarının her birine ayrıca bir milyon yazılmaz. Murgul’un bütün ada nüfusu da bu tek şehir sayısıyla aynı değildir.',
    'Böylesi bir başkent, tek meydanda toplanan yaşlıların yönettiği küçük bir liman olarak işlemez. Mahalle meclisleri, iskele masaları, su sorumluları ve tersane paydaşları günlük kararları dağıtır; Ilvara Senn’in ortak masası bu farklı kayıtların ve itirazların buluştuğu yerdir. Azja ocaklarıyla Xotar kökenli haneler aynı hizmeti isterken farklı usuller savunabilir.',
    'Şehir kendi ağlarıyla bütün nüfusu doyurmaz. Ana ada ve çevre adaların kök ürünleri, tahılı, bahçeleri, balığı ve dış yükleri limanda birleşir. Yağmur toplama hazneleri ve yüksekten getirilen tatlı su kent hayatını taşır; denizin tuzlu suyunu sınırsız içme suyu saymak mümkün değildir. Kereste, besin, temiz su ve kıyı taşımacılığının aksaması aynı hafta içinde hem tersaneyi hem sofrayı durdurabilir.',
  ] }],
}

export function demographicPlaceRevision(id: string): Partial<Place> | undefined {
  if (capitalScaleSections[id]) return {
    summary: id === 'valdareth'
      ? 'Danstsud’un 500.000 kişilik başkenti. Beş düzensiz sur kuşağı, kraliyet kalesi ve obsidyen kiliseden dış mahallelerin ova hayatına uzanır; Serenith, Doğu Aldara ve Teyra’nın erzak ağı limanla birleşir.'
      : 'Murgul’un bir milyon kişilik ikiz başkenti. Kılıç ve Dal’ın mahalleleri, ada erzağı, tersaneler, tatlı su hatları ve ortak liman masasıyla birbirine bağlıdır.',
  }
  if (honudDemography.settlements[id] !== undefined) return {
    subtitle: 'Honud’un yaşayan kıyı ocağı',
    summary: `${coastalNames[id]}, Honud’un donmuş kıyı şeridinde kalıcı yaşamını sürdüren merkezlerdendir. Kent çekirdeği ${format(honudDemography.settlements[id])} kişidir; iç ülkenin boş eski yerleşimleri bu sayıya eklenmez.`,
    sections: [
      { title: 'Buz ile su arasındaki yerleşim', paragraphs: [
        `${coastalNames[id]} halkı denizden gelen yiyeceği, dışarıdan ulaşan yakıtı ve açık kalan yanaşma aralığını birlikte gözetir. Kıyı güvenliği, her gün aynı buz geçidinin açık kalacağına dayanmaz. Hane ve iskele kayıtları, kent çekirdeğini çevredeki küçük ocaklardan ayırır.`,
        'Batıdan gelen Kapanış haberleri kış yerini belirleyen toplantılara girer. Yeni bir haneye yer açmak yalnız boş bir oda bulmak değildir: av ve ağ payı, yakıt, temiz su ve beklenmeyen dönüş için erzak birlikte hesaplanır.',
      ] },
      { title: 'Taşınan bilgi', paragraphs: [
        'Klanın sözlü öğretisi ve kıyı becerisi yan yana sürer. Eski bir iç yerleşimin adını taşıyan ustalar burada çalışabilir; onların kökeni o eski yerleşimin hâlâ meskûn olduğu anlamına gelmez. İç ülkeye giden bir güzergâh tarif edilse bile o yol gündelik bir ticaret hattı sayılmaz.',
      ] },
    ],
  }
  if (abandonedHonudPlaces.has(id)) return {
    subtitle: 'İç buzda kalan eski yerleşim · kalıcı nüfus 0',
    summary: `${formerNames[id]}, Honud’un iç buzu altında kalmış eski yerleşimidir. Kalıcı nüfusu sıfırdır. Haritadaki yapılar ve yer adı korunur; eski haneler bugün kıyı ocaklarında veya hareketli kıyı toplulukları içinde yaşar.`,
    sections: [
      { title: 'Yer adı kaldı, ocak taşındı', paragraphs: [
        `${formerNames[id]} adı, burada yaşamış hanelerin kökenini ve eski bir yolun hafızasını taşır. Batı Kapanışı’ndan sonra evlerin içinde sürekli ateş yanmaz; bir kule veya çatının görünmesi güvenli bir hanın işareti değildir.`,
        'Aynı adı taşıyan bir hane veya bir ustanın bu kentten geldiğini söylemesi, güncel ikamet kaydı değildir. Kıyıya taşınanlar eski adlarını bırakmak zorunda kalmamıştır. Bugünkü ihtiyaçları ve anlaşmazlıkları yaşadıkları kıyı ocağında çözülür.',
      ] },
      { title: 'İçeriye bakmak', paragraphs: [
        'İç ülke kalıcı yaşam için elverişsizdir. Bir araştırma veya anma ziyareti ancak yakıt, refakat, hava ve dönüş süresi için ayrı hazırlıkla düşünülebilir; düzenli pazar, hazır garnizon veya misafirhane beklenmez. Haritadaki eski noktaya yeni ve daha güvenli bir konum atanmamıştır.',
      ] },
    ],
  }
}

export const demographicDossierOverrides: Record<string, Partial<Dossier>> = {
  valdareth: {
    population: '500.000', populationNote: 'Şehir nüfusu · 27 Ekim yazar kararı; bağlı köyler ve krallık toplamı hariç',
    hooks: [
      { title: 'Beş sur, yarım milyon hayat', text: 'Saraydan dış surlara uzanan 500.000 kişilik kentte mahalle görevlileri, su taşıyıcıları, değirmenler ve liman aynı iaşe düzeninin parçalarıdır.' },
      { title: 'Üç nehrin sofrası', text: 'Serenith, Doğu Aldara ve Teyra’nın verimli ovası uzaktaki tarlalarla birlikte başkenti besler. Kent nüfusu ile vergi köylerinin nüfusu ayrı sayılır.' },
      { title: 'Morun iki ustası', text: 'Mavi mor kiremitlerin hammaddesi Dorvenhall’dan gelir; işlenmesi Dorvenhall ile Valdareth’in atölyelerine yayılır.' },
    ],
  },
  morihael: {
    badge: 'Murgul’un ikiz başkenti', population: '1.000.000', populationNote: 'Morihael’in iki kentsel yüzünün toplamı · ülke nüfusu değil · 27 Ekim yazar kararı',
    government: 'Mahalle ve ada temsilcileri · ortak liman meclisi',
    powers: [4, 5, 5, 4],
    hooks: [
      { title: 'Bir milyon, iki kent yüzü', text: 'Kılıç ve Dal’ın toplam nüfusu bir milyondur. Mahalle meclisleri ve iskele masaları ortak liman yönetiminin günlük yükünü paylaşır.' },
      { title: 'Ada sofrası', text: 'Ana ada ve çevre adaların erzağı, kıyı yükleri ve tatlı su hatları büyük başkenti yaşatır. Şehir, kendi limanından geçen her ürünü kendi üretmiş sayılmaz.' },
      { title: 'Aynı rıhtımda iki dil', text: 'Azja mirasıyla Xotar kökenli haneler tersane, ocak ve ticarette birlikte çalışır; barışın sürmesi mahalle düzeyindeki temsil ve hizmete de bağlıdır.' },
    ],
  },
  honud: {
    badge: 'Ülke toplamı · kıyıya çekilmiş halk', population: '500.000',
    populationNote: 'Honud’un tamamı; eski başkent Hurnas Ithíl 0 · iç ülke kalıcı nüfusu 0 · 27 Ekim yazar kararı',
    ruler: 'Kıyı klan toplantıları · Ardzenor’un kutsal geleneği',
    government: 'Kalıcı başkent olmadan kıyı ocakları ve klan temsilcileri',
    climate: 'Batıdan doğuya ilerleyen soğuk · yalnız kıyı şeridinde kalıcı yaşam',
    exports: ['Balık ve post', 'Kıyı rehberliği', 'Kemik ve deri işleri'],
    powers: [2, 2, 2, 3], motto: 'Bir ocağı kaybeden, komşusunun adını unutmaz.', tone: 'ice',
    hooks: [
      { title: 'Boş başkent', text: 'Hurnas Ithíl’in kalıcı nüfusu sıfırdır. Eski taç adı yaşar, fakat şehirde çalışan saray ve düzenli başkent garnizonu yoktur.' },
      { title: 'Batı Kapanışı', text: 'Soğuk batıdan doğuya ilerler. İç ülkenin eski kentleri boşalmış, nüfus donmuş kıyıdaki yaşama aralığına çekilmiştir.' },
      { title: 'Tek kez sayılan haneler', text: '158.000 kişi kayıtlı kıyı merkezlerinde, 262.000 küçük kıyı ocaklarında, 80.000 kıyı boyunca hareketli hanelerde yaşar. Toplam 500.000’dir.' },
    ],
  },
  'hurnas-ithil': {
    badge: 'Donmuş Taç · boş eski başkent', population: '0',
    populationNote: 'Kalıcı nüfus yok · kesin atlas konumu doğrulanmadı · 27 Ekim yazar kararı',
    ruler: 'Yerleşik saray yok', government: 'Tarihî ve törensel başkent adı',
    climate: 'Kalıcı yerleşime kapalı iç buz', exports: [], powers: [0, 0, 0, 0],
    motto: 'Taç kaldı; ocak kıyıya taşındı.', art: 'honud', tone: 'ice',
    hooks: [{ title: 'İkamet değil hafıza', text: 'Klanların eski başkent adını anması, orada yaşayan bir mahkeme, vergi masası veya garnizon bulunduğu anlamına gelmez.' }],
  },
  ...Object.fromEntries(Object.entries(honudDemography.settlements).map(([id, n]) => [id, {
    badge: 'Yaşayan kıyı merkezi', population: format(n),
    populationNote: 'Kent çekirdeği · Honud’un 500.000 kişilik ülke toplamının parçası; çevre ocakları ayrıca sayılır',
    climate: 'Donmuş kıyı · buz altı akıntı ve sınırlı deniz erişimi',
    exports: ['Balık ve kıyı ürünleri', 'Kıyı ikmali', 'Deri ve onarım'],
    hooks: [
      { title: 'Kıyının yaşama aralığı', text: 'Ağ, yakıt ve açık yanaşma aralığı birlikte korunur. İç ülkenin boş yerleri bu kentte yaşıyormuş gibi nüfusa eklenmez.' },
      { title: 'Taşınan ocak', text: 'Yeni hanelerin yeri, erzağı ve yakıt payı konuşulur. Kışın limana gelen hareketli bir aile iki ayrı nüfus hanesinde sayılmaz.' },
    ],
  } satisfies Partial<Dossier>])),
  ...Object.fromEntries([...abandonedHonudPlaces].map(id => [id, {
    badge: 'Terk edilmiş eski yerleşim', population: '0',
    populationNote: 'Kalıcı nüfus 0 · eski haneler kıyıya taşındı; atlas noktası korunur',
    ruler: 'Kentte yerleşik yönetim yok', government: 'Eski klan yeri · hane temsilcileri kıyıda',
    climate: 'Kalıcı yaşama elverişsiz iç buz', exports: [], powers: [0, 0, 0, 0],
    hooks: [
      { title: 'Köken ve ikamet', text: 'Bu yerden geldiğini söyleyen kişi bugün kıyıda yaşayabilir. Bir hane adının sürmesi kentte kalıcı nüfus bulunduğunu göstermez.' },
      { title: 'Hazır barınak yok', text: 'Eski yapı, yaşayan han veya garnizon sayılmaz. İç ülkeye gidiş ayrı sefer hazırlığı ister.' },
    ],
  } satisfies Partial<Dossier>])),
}
