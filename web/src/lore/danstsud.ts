import type { Place, Region, Subregion } from '../data'
import { expansionSources, marhaldenExpansionSections, valdarethExpansionSections } from './danstsud-expansion'
import { hardlaneSources, hardlaneSections, frostbaySections, kaldmereSections, drantholSections, vyssgardSections, ternhavenSections } from './hardlane'

// Public lore at the campaign's beginning: Eryndorn is still on the throne.
// Author notes, alternate coups, secret identities and quest outcomes stay outside web/.
const mapSource = 'Aruzahr 8k (1).jpg'
const canonSource = 'Danstsud kanonu — 7 Ekim 2026 tarihli yazar kararları'
const newWritingSource = 'Danstsud: hanedanlar ve büyü hukuku — 7 Ekim 2026 yeni yazım'
const openingSource = '21.11.2025 aruzhar bolum 1.docx — genel şehir ve lonca bilgileri'
const questSource = 'Main questler.docx — genel şehir bilgileri'
const fractureSource = 'Danstud’un Kırılma Noktası, Bölüm 1 — genel yerleşim bilgileri'

export const danstsudRegion: Region = {
  id: 'danstsud', name: 'Danstsud', subtitle: 'Bir taç, üç bölge, eşit dağılmayan bir düzen',
  climate: 'Karlı batı & nehir arazileri', color: '#b19ac8',
  quote: 'Bakır Ana, bizi ateşin çocuğundan koru.',
  point: [.73, .72], box: [.38, .46, .61, .54],
  summary: 'Eryndorn’un tahtta olduğu feodal krallık. Manorveil’de vergi krala, lordluk topraklarında lordlara toplanır. Karlan Dağları’nın ötesindeki Hardlane ise aynı krallığa bağlı olmasına rağmen merkezî düzenin çok azına erişir.',
  tags: ['Feodal krallık', 'Üç bölge', 'Bakır Ana'],
  sources: [canonSource, newWritingSource, ...expansionSources, ...hardlaneSources, 'Valhunar.pdf — genel tarih ve kültürel inanışlar', openingSource, questSource, fractureSource, 'Xotar.docx', 'Garmirik.docx', mapSource],
  sections: [
    { title: 'Danstsud Krallığı', paragraphs: [
      'Danstsud, Valhunar’ın kentler, kaleler, loncalar ve yollarla birbirine bağlanan feodal krallığıdır. Başkenti Valdareth’tir; tahtta Vaeranth Hanedanı’ndan Kral Eryndorn bulunur. Krallığın toprakları Hardlane, Manorveil ve Lowvale adlı üç bölgeye ayrılır. Bu bölgeler aynı tacın altında yer alır, fakat kraliyet gücünü aynı ölçüde hissetmez.',
      'Bir başkentte kayıt altına alınabilen vergi, askerî emir veya kamu hizmeti, uzak bir yerleşimde aynı biçimde uygulanmayabilir. Danstsud’un siyasi coğrafyasını yalnızca sınırlar değil, yöneticilerin gerçekten ulaşabildiği insanlar ve yollar da belirler.',
    ] },
    { title: 'Taç, lordlar ve vergi', paragraphs: [
      'Manorveil, kralın doğrudan topraklarıdır. Bu bölgenin vergisi krala toplanır. Diğer lordluk topraklarında tahsilatı lordlar yürütür. Kral lord atayabilir veya makamdan alabilir; şehirlerin Şafak Çağı’ndan süregelen yerel gelenekleri ise fiilî yönetimi biçimlendirir.',
      'Danstsud’daki feodal düzen, ülkeyi tek bir yönetim haritasından daha karmaşık hâle getirir. Bir yerin krallığa bağlı olması, orada merkezî yönetimin her gün işlemesi anlamına gelmez. Bu fark en belirgin biçimde Hardlane’de görülür.',
    ] },
    { title: 'Manorveil: kraliyetin doğrudan toprakları', paragraphs: [
      'Manorveil’in ayırt edici özelliği, yerel verginin bir lordun hazinesinden önce kralın otoritesine bağlı olmasıdır. Valdareth çevresindeki kraliyet merkezi, haritanın bu kesiminde öne çıkar; başkentin saray ve kent düzeni, doğrudan yönetimin görünür yüzüdür.',
      'Manorveil, krallığın kendisiyle eş anlamlı değildir. Kraliyet merkezi ile uzak bölgeler arasındaki yönetim farkı, Danstsud’un iç ilişkilerini biçimlendirir.',
    ] },
    { title: 'Hardlane: uzaktaki bağlılık', paragraphs: [
      'Batının karlı bölgesi Hardlane’de, Karlan Dağları’nın ötesine geçen kraliyet otoritesi büyük ölçüde zayıflar. Ternhaven, Dranthol, Frostbay, Vyssgard ve mültecilerin kurduğu Kaldmere Danstsud’a bağlıdır; buna rağmen halkı merkezin düzenine ve imkânlarına eşit biçimde erişmez. Hardlaneliler krallık içinde aşağı bir konuma itilmiş topluluklar olarak görülür.',
      'Düzenli vergilendirmenin işlemediği bölgede Frostbay sınırlı tahsilat ve hizmetin eski istisnasıdır. Eryndorn’un iki iskân reformu Dranthol’a güçlü garnizon, liman ve fener; Ternhaven’e sınırlı yatırım getirdi. Kaldmere’de kâğıttaki şehir statüsünün ardından altyapı gelmedi. Geniş Hardlane idaresi resmen Frostbay’e bağlıdır, fakat bu bağ çoğunlukla kâğıt üzerinde kalır. Harven ve Mavric, Marhalden’in asker konuşlandırıp yerel vergi topladığı özel bağlı yerleşimlerdir.',
    ] },
    { title: 'Lowvale: lordluk toprakları', paragraphs: [
      'Lowvale, Hardlane ve Manorveil dışında kalan arazileri kapsar. Manorveil’de doğrudan krala toplanan verginin karşısında, lordların tahsilat ve yerel güç sahibi olduğu topraklar krallığın feodal yapısını görünür kılar.',
      'Haritanın doğu ve güney kesimlerinde nehirler, tarla çizimleri, küçük yerleşimler ve büyük surlu kentler bir arada bulunur. Lowvale adı bir bölgeyi anlatır; başlı başına bir şehir veya bağımsız bir ülke değildir.',
    ] },
    { title: 'Başlıca şehirler ve yerleşim ağı', paragraphs: [
      'Lirendil, Dorvenhall, Marhalden, Valdareth, Elorwyn ve Theramis krallığın başlıca şehirleridir. Valdareth başkent; Lirendil kale ve lonca yaşamıyla, Dorvenhall üretim ve ticaretle öne çıkar. Theramis’te büyücülerin de yer aldığı bir lonca bulunur. Marhalden, Karlan çevresindeki büyük tahkimatıyla haritada belirgindir.',
      'Bu büyük kentlerin yanında Brannis, Kethra, Myrran ve Luthen gibi yerler yolların ve kıyıların farklı parçalarını oluşturur. Brannis göç baskısıyla, Kethra liman yaşamıyla, Myrran–Luthen hattı kervan yolculuklarıyla ilişkilidir. Hardlane’in beş kıyı şehri ise ülkenin karlı batısının yerleşim ağını taşır.',
    ] },
    { title: 'Bakır Ana ve Kırılma’nın hatırası', paragraphs: [
      'Danstsud’un eski felaket anlatısında Kraliçe Yarethus, Bakır Ana olarak anılır. Onun dünyayı bir kalkan gibi örterek korumaya çalıştığına, Halendar’ın ateşi ve hırsının bu korumayı kırdığına inanılır. Tapınak duası bu hafızayı taşır: “Bakır Ana, bizi ateşin çocuğundan koru.”',
      'Honud aynı geçmişi farklı anlatır; oradaki öyküler iki kadim hükümdarın da kusurlarına ağırlık verir. Danstsud’un inancı, bütün halkların üzerinde uzlaştığı tarafsız bir tarih değildir. Aynı yıkımın bıraktığı farklı hatıralardan biridir.',
    ] },
    { title: 'Büyü, loncalar ve dış dünya', paragraphs: [
      'Büyük Kırılma’dan sonra büyünün öngörülemeyen sonuçları, Danstsud’da denetimli eğitimin önemini artırdı. Eğitimli ve ruhsatlı büyücüler okul dışında da yasal hizmet verebilir; izinsiz uygulama ve kurban ritüelleri yasaktır. Valdareth’teki Kraliyet Büyü Sicili, uygulayıcıyı ve izin verilen hizmet alanını kaydeder.',
      'Büyü araştırma enstitüsü eski felaketin nedenlerini açıklamaya çalışır. Bu araştırmalar, halkın büyüye yaklaşımındaki bilgi arayışı ve korkuyla birlikte sürer; bir açıklamanın araştırılması, onun kanıtlanmış tarih olduğu anlamına gelmez.',
      'ÇelikKalkan gibi loncalarda eğitim, demircilik, hekimlik ve arşiv yaşamı askerî hizmetle birlikte yürür. Xotar’ın Rüzgâr Hatları krallığa ulaşır; Garmirk’le silah ve maden alışverişi vardır. Danstsud kendi sınırları içine kapanmış bir dünya değildir: tüccarlar, göçmenler ve deniz yolları ülkenin yaşamına katılır.',
    ] },
  ],
}

// These rectangles frame map views; they do not assert surveyed political borders.
export const danstsudSubregions: Subregion[] = [
  {
    id: 'hardlane', kind: 'subregion', name: 'Hardlane', region: 'danstsud',
    subtitle: 'Eski kıyılar, yeni ocaklar ve eşitsiz reform', point: [.496, .848], box: [.39, .65, .27, .35],
    summary: 'Karlan’ın batısındaki beş kıyı şehri. Frostbay’in kadim taşları, Dranthol’un yeni kalesi ve Kaldmere’in barakaları, aynı krallığın farklı hayatlarını taşır.',
    sources: [...hardlaneSources, canonSource, fractureSource, mapSource],
    related: ['frostbay', 'kaldmere', 'dranthol', 'vyssgard', 'ternhaven', 'marhalden', 'hardlane-kulturu', 'hardlane-otlak-hayvanlari', 'kul-uzerine-ocak-kanunu', 'mahrumiyet-iskan-sermaye', 'kemige-basan-yol', 'cevher-cizgisi', 'ak-cam-denizi', 'ayaz-yutan', 'kiragi-denizi', 'soluk-su', 'kefen-denizi', 'bryndon-kiyi-defteri'],
    sections: hardlaneSections,
  },
  {
    id: 'manorveil', kind: 'subregion', name: 'Manorveil', region: 'danstsud',
    subtitle: 'Verginin doğrudan krala toplandığı topraklar', point: [.654, .646], box: [.34, .43, .45, .36],
    summary: 'Danstsud’un doğrudan kraliyet toprakları. Manorveil’i diğer bölgelerden ayıran temel, verginin lordlar yerine kralın otoritesine toplanmasıdır.',
    sources: [canonSource, mapSource], related: ['valdareth'],
    sections: [
      { title: 'Doğrudan kraliyet yönetimi', paragraphs: [
        'Manorveil, Danstsud içinde kralın doğrudan yönettiği topraklara verilen addır. Vergi bu bölgede krala toplanır. Böylece yerel yönetim ile taht arasındaki bağ, lordluk topraklarındakinden farklıdır.',
        'Bu isim bir kent adı değildir. Manorveil, başkent ve çevresindeki kraliyet düzenini anlamak için kullanılan bölgesel bir addır.',
      ] },
      { title: 'Valdareth ve merkez', paragraphs: [
        'Valdareth krallığın başkentidir. Haritada Manorveil yazısı kraliyet merkezi çevresinde yer alır; büyük surlu başkent, çevresindeki yollar ve yerleşimler bu coğrafyanın en belirgin öğeleridir.',
        'Tahtın merkezi ile ülkenin uzak bölgeleri arasındaki erişim farkı burada görünür olur. Manorveil’de doğrudan kralın adıyla yürüyen düzen, Hardlane’de aynı ölçüde işlemez.',
      ] },
      { title: 'Feodal krallık içindeki yeri', paragraphs: [
        'Manorveil ülkenin bütünü değildir. Danstsud, bu kraliyet topraklarıyla birlikte lordların vergi topladığı arazileri ve yönetimin zayıf ulaştığı Hardlane’i de içerir.',
        'Krallığın iç yapısında doğrudan yönetim ile yerel lordluk gücü bir arada bulunur. Manorveil bu ilişkinin kraliyet tarafını temsil eder.',
      ] },
    ],
  },
  {
    id: 'lowvale', kind: 'subregion', name: 'Lowvale', region: 'danstsud',
    subtitle: 'Krallığın lordluk arazileri', point: [.944, .603], box: [.73, .53, .27, .47],
    summary: 'Hardlane ve Manorveil dışında kalan Danstsud arazileri. Krallığın feodal yapısında, yerel vergiyi lordların topladığı toprakların düzeni burada öne çıkar.',
    sources: [canonSource, mapSource],
    sections: [
      { title: 'Lowvale’in kapsamı', paragraphs: [
        'Lowvale, Danstsud’un Hardlane ve Manorveil dışında kalan arazilerini kapsayan bölgesidir. Aynı krallığın parçasıdır; bağımsız bir ülke veya tek bir şehir değildir.',
        'Bölge adı, kraliyet merkezinden farklı bir yerel yönetim dünyasına işaret eder. Manorveil’in vergisi krala toplanırken, diğer lordlukların tahsilatını lordlar yürütür.',
      ] },
      { title: 'Lordlar ve yerel güç', paragraphs: [
        'Danstsud’un feodal niteliği, yerel lordların toprakları üzerindeki gücünde görünür. Vergi toplama yetkisi, kralın doğrudan yönetimi ile lordluk arazileri arasındaki temel ayrımdır.',
        'Lowvale’i anlamak, krallığı yalnızca başkentin bakışından okumamayı gerektirir. Yerel yönetim ile taç aynı siyasi bütünün içinde bulunur.',
      ] },
      { title: 'Nehirler ve yerleşimler', paragraphs: [
        'Haritanın Lowvale çevresinde nehirler, köprüler, tarlalar, küçük yerleşimler ve büyük tahkimatlar yan yana çizilmiştir. Doğu ve güneydeki bu yerleşim ağı, Danstsud’un karlı batısından farklı bir görünüm taşır.',
      'Serenith ve Teyra nehirleri, Doğu Aldara’yla birlikte tarım ve yerleşim ağlarını besler. Kentler ve küçük yerleşimler su yolları ve kara yollarıyla birbirine bağlanır.',
      ] },
    ],
  },
]

export const danstsudPlaces: Place[] = [
  {
    id: 'valdareth', name: 'Valdareth', region: 'danstsud', subregion: 'manorveil', major: true,
    point: [.734, .667], subtitle: 'Beş surun ardındaki soylu başkent',
    summary: 'Danstsud’un soylu başkenti ve en kalabalık şehri. Eryndorn Vaeranth’ın taht merkezi, beş düzensiz sur kuşağıyla çevrilidir; içeride saray zenginliği, dışarıda ova ve köy yaşamı birbirine eklenir.',
    sources: [canonSource, newWritingSource, ...expansionSources, openingSource, questSource, fractureSource, mapSource], related: ['valdareth-mahalleleri', 'valdareth-saray-makamlari', 'valdareth-loncalari', 'valdareth-vergi-havzasi', 'vaeranth-hanedani', 'eryndorn', 'buyu-ruhsatlari', 'lirendil', 'brannis', 'dorvenhall'],
    sections: valdarethExpansionSections,
  },
  {
    id: 'lirendil', name: 'Lirendil', region: 'danstsud', major: true,
    point: [.367, .446], subtitle: 'Kale, kıyı ve ÇelikKalkan yaşamı',
    summary: 'Danstsud’un başlıca şehirlerinden Lirendil, kıyıdaki kalesi ve lonca yaşamıyla öne çıkar. Eğitim alanı, demirhane, revir ve arşiv, askerî hizmetin etrafında bir araya gelir.',
    sources: [canonSource, openingSource, fractureSource, mapSource], related: ['brannis', 'myrran', 'luthen', 'kethra', 'theramis'],
    sections: [
      { title: 'Kıyıdaki kale şehri', paragraphs: [
        'Lirendil, Danstsud’un altı başlıca şehrinden biridir. Haritada denize uzanan, surları ve kuleleri belirgin bir kent olarak gösterilir. Kale, şehir yaşamının önemli bir merkezidir.',
        'Brannis üzerinden gelen yolculuklar Lirendil’e ulaşır. Myrran ve Luthen çevresindeki yollar da kentten hareket eden kervanların dünyasına bağlanır.',
      ] },
      { title: 'ÇelikKalkan ve eğitim', paragraphs: [
        'ÇelikKalkan’ın Lirendil’deki yaşamı askerî eğitim ve yeminle şekillenir. Eğitim ustası Ser Vardek, acemilerin karşılaştığı isimler arasındadır. Lonca yalnızca savaşan kişilerden oluşmaz; hizmeti sürdüren farklı uzmanlıklar vardır.',
        'Eğitim alanları, arşiv, yemekhane ve revir aynı lonca düzeninin parçalarıdır. Bu kurumun kentteki varlığı, askerî hizmet ile bilgi ve zanaat arasındaki bağı görünür kılar.',
      ] },
      { title: 'Körük ve Örs', paragraphs: [
        'Körük ve Örs, lonca yaşamının demirhanesidir. Tek-Göz Ghorin burada teçhizatla ilgilenir. Ateş, is, örs ve ekipman, Lirendil’in gündelik askerî hazırlığının somut parçalarıdır.',
        'Demirhane, bir kılıcın savaş alanına çıkmadan önce geçtiği iş ve ustalık dünyasını temsil eder. Lirendil’de lonca gücü, eğitim kadar bu emeğe de dayanır.',
      ] },
      { title: 'Revir, arşiv ve gündelik hayat', paragraphs: [
        'Hekim Zylara revirle, baş arşivci Ellyn Marowen bilgi ve kayıtlarla ilişkilidir. Mrog da lonca yaşamında bulunan kişiler arasındadır. Yemek, tedavi, eğitim ve kayıt işleri bir kalenin yalnızca surlardan ibaret olmadığını gösterir.',
        'Lirendil’in kalesinde askerî disiplinin yanında bakım ve birlikte yaşama da yer alır. Şehrin tanınan yüzü, bu farklı işlerin bir araya geldiği lonca çevresidir.',
      ] },
    ],
  },
  {
    id: 'dorvenhall', name: 'Dorvenhall', region: 'danstsud', major: true,
    point: [.782, .553], subtitle: 'Tuğla bacalar, üretim ve ticaret',
    summary: 'Kırmızı tuğlalı bacalarıyla anlatılan Dorvenhall, Danstsud’un başlıca üretim ve ticaret merkezlerinden biridir. Büyük surlu kent, çevresindeki yollar ve küçük yerleşimler ağı içinde bulunur.',
    sources: [canonSource, ...expansionSources, questSource, mapSource], related: ['valdareth', 'valdareth-loncalari', 'brannis'],
    sections: [
      { title: 'Üreten şehir', paragraphs: [
        'Dorvenhall, Danstsud’un altı başlıca şehrinden biridir. Uzaktan görülen kırmızı tuğlalı bacalar, kentte üretim ve ticaretin önemini gösterir. Şehir, krallığın askerî merkezlerinden farklı bir çalışma ve alışveriş yüzü taşır.',
        'Bacalar ve surlar aynı kent görünümünde birleşir. Üretim, kent güvenliği ve çevre yolların durumu birbirinden kopuk değildir.',
      ] },
      { title: 'Sur içi ve çevre yollar', paragraphs: [
        'Haritada Dorvenhall büyük, tahkim edilmiş bir kent olarak gösterilir. Çevresinde küçük yerleşimler, yollar, kıyı ve Thural Kalkanı adlı dağ kuşağı bulunur.',
        'Valdareth ve Brannis gibi yerlerle birlikte Dorvenhall, krallığın merkezî yolculuk anlatılarında yer alır. Ticaret kentinin dışarıyla ilişkisi yalnızca kapılarında başlamaz; çevresindeki yollar da şehir yaşamının parçasıdır.',
      ] },
      { title: 'Krallık içindeki yeri', paragraphs: [
        'Dorvenhall, Valdareth’in bir mahallesi veya başka bir krallık değildir. Danstsud’un kendi adı ve işlevi olan büyük şehirlerinden biridir.',
        'Üretim ve ticaret kimliği, Danstsud’daki şehirlerin yalnızca saray ve loncalarla tanımlanmadığını gösterir. Krallığın gündelik çalışma hayatının önemli bir yüzü burada görünür olur.',
      ] },
      { title: 'Menekşespatı ve saray kiremitleri', paragraphs: [
        'Valdareth saraylarında ilk kez kullanılan mavi mor kiremitlere renk veren mineral Dorvenhall’dan çıkar. Menekşespatının arıtılması ve kiremitlerin işlenmesi Dorvenhall ile Valdareth’te yürütülür. Başkentin Mor Sır loncası bu üretim zincirinin kurumlarından biridir.',
        'Dorvenhall’ın renk minerali, yalnız Karlan’da doğal yatağı bulunan Veyralt’tan farklıdır. Kiremit ustalığı ve nadir silah metali, Danstsud’un birbirine bağlı fakat ayrı uzmanlıklarıdır.',
      ] },
    ],
  },
  {
    id: 'marhalden', name: 'Marhalden', region: 'danstsud', major: true,
    point: [.600, .880], subtitle: 'Karlan çevresindeki büyük tahkimat',
    summary: 'Karlan’daki düzenli kara geçidini tutan, yüksek nüfuslu olmayan güçlü kale şehri. Üç Mühür loncaları, nadir Veyralt madeni ve doğudan gelen erzak Marhalden’in gücünü taşır; mülteci girişine kapıları kapalıdır.',
    sources: [canonSource, ...expansionSources, mapSource], related: ['karlan-daglari', 'veyralt', 'marhalden-uc-muhur', 'marhalden-lordlugu', 'karlan-canlilari', 'frostmere-golu', 'hardlane', 'frostbay', 'valdareth', 'theramis', 'elorwyn'],
    sections: marhaldenExpansionSections,
  },
  {
    id: 'elorwyn', name: 'Elorwyn', region: 'danstsud', major: true,
    point: [.750, .863], subtitle: 'Elorwynder Hanedanı’nın şehri',
    summary: 'Danstsud’un başlıca şehirlerinden Elorwyn, bilinen tarihi boyunca Elorwynder Hanedanı tarafından yönetilmiştir. Güneydeki büyük surlu kentte yönetici ailenin geçmişi ile şehir tarihi birlikte anılır.',
    sources: [canonSource, newWritingSource, ...expansionSources, mapSource], related: ['elorwynder-hanedani', 'valdareth', 'theramis', 'kethra', 'marhalden', 'danstsud-lordluk-hukuku'],
    sections: [
      { title: 'Tharion’un şehri ve büyüye sınır', paragraphs: ['Elorwyn’in güncel yöneticisi Lord Tharion Elorwynder’dir. Kent, krallık içinde büyüye en katı yaklaşan yer olarak tanınır; kamusal büyü gösterileri yasaktır ve ruhsatlı uygulamalar sıkı yerel denetim altındadır.', 'Jeremiah ve paladin Volomiyr’in kökeni bu şehre uzanır; bugün ikisi de Lirendil’de ÇelikKalkan çevresindedir. Ser Valerius, kentin iktidarının önemli rakiplerinden biridir; Rina Ironvale onun yaveridir.'] },
      { title: 'Elorwynder yönetiminin sürekliliği', paragraphs: [
        'Elorwyn şehri hep aynı hanedanın yönetiminde kalmıştır. Ailenin güncel adı Elorwynder’dir; şehrin adı Elorwyn olarak kullanılır. Yerel yönetimin geçmişi, aile geçmişiyle süreklilik taşır.',
        'Elorwyn aynı zamanda Danstsud’un altı başlıca şehrinden biridir. Krallığın başkenti Valdareth’tir; Elorwyn kendi yerel yönetim tarihiyle bu siyasi bütünün içinde bulunur.',
      ] },
      { title: 'Hanedan ve kraliyet', paragraphs: [
        'Vaeranth, Danstsud’un güncel kraliyet hanedanıdır. Elorwynder ise Elorwyn’in yönetici ailesidir. Bir şehrin yerel hanedanı ile bütün krallığın taht ailesi farklı makamları temsil eder.',
        'Lord Tharion ve Lord Damian Elorwynder, bu ailenin adıyla anılan kişilerdir. Damian’ın Kethra lordu olarak bilinmesi, hanedanın Elorwyn dışındaki siyasi ilişkilerini de görünür kılar.',
      ] },
      { title: 'Surlar ve su çevresi', paragraphs: [
        'Elorwyn’in kent görünümünde surlar, kuleler, büyük yapılar ve su öğeleri bir aradadır. Çevresindeki arazi, küçük yerleşimler ve nehir yollarıyla çizilmiştir.',
        'Bu coğrafya Danstsud’un karlı batısından farklıdır. Elorwyn, büyük kentlerle çevredeki küçük yerleşimlerin aynı harita üzerinde birbirine yaklaştığı güney dünyasında yer alır.',
      ] },
      { title: 'Başkent ve diğer şehirler', paragraphs: [
        'Valdareth kuzeyde kraliyet merkezini, Theramis doğuda başka bir büyük kenti oluşturur. Elorwyn, bu merkezlerle aynı feodal krallığın siyasi bütününde bulunur.',
        'Elorwyn’in süreklilik taşıyan aile yönetimi, Danstsud’un yerel güçlerinin başkentten ayrı geçmişleri olduğunu gösterir. Kentler, aynı krallık içinde kendilerine ait yönetim hafızasını korur.',
      ] },
      { title: 'Karlan’daki ruhban hizmeti', paragraphs: [
        'Elorwyn’den gelen ruhbanlar, Theramis büyücüleriyle birlikte Marhalden’in sert ikliminde Dört Ocak Çemberleri’nin bakımına katılır. Korunaklı avlular ve su geçişleri, dağın bütün havasını değiştirmeden şehirde yaşamı kolaylaştırır.',
        'Dua, bakım ve gerçek büyü uygulaması farklı işlerdir. Büyü uygulayan görevliler krallığın ruhsat düzenine bağlıdır; dinî görev, tek başına uygulama izni sağlamaz.',
      ] },
    ],
  },
  {
    id: 'theramis', name: 'Theramis', region: 'danstsud', major: true,
    point: [.932, .905], subtitle: 'Büyük kıyı kenti ve lonca geleneği',
    summary: 'Danstsud’un başlıca şehirlerinden Theramis, güneydoğudaki büyük surlu kıyı kentidir. Şehir adına anılan loncada büyücüler bulunur; Başbüyücü Solan ve Altın Yılan amblemi bu kurumla ilişkilidir.',
    sources: [canonSource, newWritingSource, ...expansionSources, openingSource, mapSource], related: ['buyu-ruhsatlari', 'elorwyn', 'lirendil', 'danstsud', 'marhalden'],
    sections: [
      { title: 'Güneydoğudaki büyük şehir', paragraphs: [
        'Theramis, Danstsud’un altı başlıca şehrinden biridir. Haritada ülkenin güneydoğusunda, kıyıyla bağlantılı büyük bir tahkimat olarak gösterilir.',
        'Kentin çevresinde nehir, köprü, tarla ve küçük yerleşim çizimleri bulunur. Sur içindeki büyük yapı topluluğu, Theramis’i çevredeki küçük yerlerden ayırır.',
      ] },
      { title: 'Theramis Loncası', paragraphs: [
        'Theramis adına anılan loncada büyücüler de yer alır. Başbüyücü Solan, bu kurumla ilişkili isimlerden biridir. Altın Yılan amblemi loncanın tanınan işaretidir.',
        'Danstsud’da ruhsatlı büyücüler okul dışında da yasal hizmet verebilir. Theramis Loncası’nın büyücüleri de hizmet sırasında bu ruhsat düzenine bağlıdır; lonca üyeliği tek başına uygulama izni değildir. İzinsiz büyü ve kurban ritüelleri yasaktır.',
        'Theramis büyücüleri, Elorwyn ruhbanlarıyla birlikte Marhalden’in Dört Ocak Çemberleri’nde çalışır. Isıyı tutan ve buzlanmayı geciktiren düzen yerel koruma sağlar; yakıt ve bakım gereksinimini ortadan kaldırmaz.',
      ] },
      { title: 'Krallığın farklı bir yüzü', paragraphs: [
        'Theramis, Valdareth’in taht merkezi veya Lirendil’in ÇelikKalkan çevresiyle aynı şehir değildir. Danstsud’un farklı büyük kentleri, kendi coğrafyaları ve kurumlarıyla krallığın yaşamına katılır.',
        'Elorwyn ve diğer güney yerleşimleriyle birlikte Theramis, ülkenin batıdaki karlı alanların ötesinde uzanan kent dünyasını görünür kılar.',
      ] },
    ],
  },
  {
    id: 'brannis', name: 'Brannis', region: 'danstsud', point: [.660, .555],
    summary: 'Valdareth ile Lirendil arasındaki yolculuklarda bir durak olan Brannis, Honudlu mültecilerin ve yerinden edilmiş Danstsudluların baskısını yaşayan kalabalık yerleşimdir.',
    sources: [fractureSource, mapSource], related: ['valdareth', 'lirendil'],
    sections: [
      { title: 'Yolculuğun durağı', paragraphs: [
        'Brannis, Valdareth’ten Lirendil’e uzanan yolculuk anlatılarında yer alır. Kraliyet askerlerinin eşlik ettiği sevkler burada durur; şehir, başkent ile kale-lonca dünyası arasında bir bağlantı oluşturur.',
        'Haritada kıyı yolu çevresindeki tahkim edilmiş yerleşimlerden biridir. Yol üzerinde bulunması, farklı yönlerden gelen insanların burada karşılaşmasına yol açar.',
      ] },
      { title: 'Göç ve yerinden edilme', paragraphs: [
        'Honudlu mülteciler, evini kaybetmiş Danstsudlular ve farklı kökenlerden gelen kalabalıklar Brannis’in güncel yaşamında yer alır. Göç, şehirde yalnızca geçip giden bir yolculuk değildir; mevcut düzenin üzerinde ağır bir baskıdır.',
        'Brannis’in anlatılardaki kaosu, krallığın krizlerinin sivil halka ve küçük merkezlere de ulaştığını gösterir. Danstsud’un siyasi çalkantısı yalnızca sarayda yaşanmaz.',
      ] },
    ],
  },
  {
    id: 'kethra', name: 'Kethra', region: 'danstsud', point: [.566, .514],
    summary: 'Sisli ve kalabalık liman şehri Kethra, Lord Damian Elorwynder adıyla ilişkilidir. Paslı Kanca meyhanesi, kıyı antrepoları ve yakınındaki dağlık arazi şehir yaşamının parçalarıdır.',
    sources: [canonSource, newWritingSource, openingSource, mapSource], related: ['elorwynder-hanedani', 'elorwyn', 'lirendil', 'luthen', 'damian', 'aveline', 'rook', 'rydorn-sirti'],
    sections: [
      { title: 'Liman şehri', paragraphs: [
        'Kethra, kıyısında liman ve depolar bulunan bir Danstsud kentidir. Sis, kalabalık ve liman kokuları şehir betimlemelerinde öne çıkar. Lord Damian Elorwynder, Kethra lordu olarak anılır; eski anlatılarda aile adı Elorwyn şeklinde de geçer.',
        'Şehir haritada kıyı yollarının üzerinde gösterilir. Luthen çevresinden Kethra’ya ulaşan yolculuklar, kentler arasındaki kara ve kıyı ilişkisini görünür kılar.',
      ] },
      { title: 'Paslı Kanca ve antrepolar', paragraphs: [
        'Paslı Kanca, Kethra’da adı geçen meyhanedir. Limandaki numaralı antrepolar ise ticaret ve depolamanın kent içindeki somut mekânlarıdır.',
        'Bu mekânlar Kethra’yı yalnızca bir lordun adıyla tanımlanan yer olmaktan çıkarır. Liman, meyhane, tüccarlar ve depolar aynı şehir yaşamının içinde yer alır.',
      ] },
      { title: 'Kent dışındaki dağlar', paragraphs: [
        'Kethra çevresindeki dağlık arazi, şehir yaşamına yakın fakat ondan farklı bir dünya oluşturur. Eski kale ve av köşkü gibi yapılar bu kent dışı çevreyle ilişkilidir.',
        'Kıyının kalabalığı ile dağların daha kapalı alanları, Kethra coğrafyasının iki farklı görünümünü oluşturur.',
      ] },
    ],
  },
  {
    id: 'myrran', name: 'Myrran', region: 'danstsud', point: [.431, .485],
    summary: 'Lirendil yakınındaki kıyı yerleşimi Myrran, Luthen’e uzanan kervan güzergâhında anılır.',
    sources: [openingSource, mapSource], related: ['lirendil', 'luthen'],
    sections: [
      { title: 'Kıyıdaki yerleşim', paragraphs: ['Myrran, haritada Lirendil yakınında gösterilen küçük yerleşimlerdendir. Kıyı ve yol çevresindeki konumu, onu büyük kale kentinin yakınındaki yerleşim ağına bağlar.'] },
      { title: 'Myrran–Luthen yolu', paragraphs: ['Lirendil’den çıkan kervanlar Myrran yolu üzerinden Luthen’e gider. Bu hat, Danstsud’un büyük şehirleriyle daha küçük yerleri arasındaki yolculuklardan biridir.'] },
    ],
  },
  {
    id: 'luthen', name: 'Luthen', region: 'danstsud', point: [.482, .497],
    summary: 'Myrran üzerinden gelen kervanların ulaştığı Luthen, Danstsud’un kıyı yolu çevresinde yer alan karakollu yerleşimidir.',
    sources: [openingSource, mapSource], related: ['myrran', 'lirendil', 'kethra'],
    sections: [
      { title: 'Karakol ve yerleşim', paragraphs: ['Luthen, kervan yolculuklarının hedefi olarak anılır; burada bir karakol bulunur. Haritada kıyı boyunca uzanan yerleşimlerden biridir.'] },
      { title: 'Kervan güzergâhı', paragraphs: ['Myrran yolu Luthen’e ulaşır. Lirendil’in askerî ve lonca yaşamı, bu güzergâh üzerinden kervanların ve daha küçük yerleşimlerin dünyasına bağlanır. Kethra da bu kıyı ağı içinde yer alan kentlerdendir.'] },
    ],
  },
  {
    id: 'frostbay', name: 'Frostbay', region: 'danstsud', subregion: 'hardlane', point: [.468, .858],
    subtitle: 'Kadim taşların arasındaki kalabalık kıyı',
    summary: 'Yaklaşık 45–50 bin kişinin yaşadığı Hardlane’in en eski şehri. Bilinmeyen ustaların taş yapıları posta ve gümrüğe ev sahipliği yapar; yetersiz garnizon, mülteciler ve korsan ticareti aynı sokakları paylaşır.',
    sources: [...hardlaneSources, canonSource, mapSource],
    related: ['hardlane', 'ternhaven', 'dranthol', 'vyssgard', 'kaldmere', 'marhalden', 'frostmere-golu', 'hardlane-otlak-hayvanlari', 'hardlane-kulturu', 'bryndon-kiyi-defteri', 'kemige-basan-yol', 'kiragi-denizi'],
    sections: frostbaySections,
  },
  {
    id: 'ternhaven', name: 'Ternhaven', region: 'danstsud', subregion: 'hardlane', point: [.507, .719],
    subtitle: 'Rydorn’un sıcak sularında eski kıyı hayatı',
    summary: 'Sıcak suların çevresinde görece ılıman ve kendine yeten küçük şehir. Eski Hardlane kültürü güçlüdür; iki reformla iyileşen yaşam, tamamlanmayan Cevher Çizgisi’ni bekler.',
    sources: [...hardlaneSources, canonSource, mapSource],
    related: ['hardlane', 'frostbay', 'dranthol', 'marhalden', 'hardlane-kulturu', 'kul-uzerine-ocak-kanunu', 'mahrumiyet-iskan-sermaye', 'cevher-cizgisi', 'kemige-basan-yol', 'ak-cam-denizi', 'soluk-su'],
    sections: ternhavenSections,
  },
  {
    id: 'dranthol', name: 'Dranthol', region: 'danstsud', subregion: 'hardlane', point: [.450, .794],
    subtitle: 'Yeni kale, azalan korsan ve çekilen altın',
    summary: 'Reformlarla yaklaşık 1.500’den 15.000 kişiye büyüyen liman şehri. Büyük kale ve deniz feneri Hardlane’in kişi başına en güçlü güvenliğini sağlarken korsan ticaretinin çekilmesi pazarı daraltır.',
    sources: [...hardlaneSources, canonSource, mapSource],
    related: ['hardlane', 'frostbay', 'ternhaven', 'vyssgard', 'kul-uzerine-ocak-kanunu', 'mahrumiyet-iskan-sermaye', 'kemige-basan-yol', 'ak-cam-denizi', 'soluk-su', 'ayaz-yutan'],
    sections: drantholSections,
  },
  {
    id: 'vyssgard', name: 'Vyssgard', region: 'danstsud', subregion: 'hardlane', point: [.514, .797],
    subtitle: 'Kanundan kaçanların başka kanunlara girdiği kent',
    summary: 'Bir zamanların önemli şehri, bugün korsanlar ve çetelerce paylaşılır. Kraliyet idaresinin boşluğunda Beş İskele Sözleşmesi zorla uygulanır; kentte kalan aileler de bu düzene bağımlıdır.',
    sources: [...hardlaneSources, canonSource, mapSource],
    related: ['hardlane', 'frostbay', 'ternhaven', 'dranthol', 'vyssgard-kanunlari', 'hardlane-kulturu', 'cevher-cizgisi'],
    sections: vyssgardSections,
  },
  {
    // Anchor read from the white settlement cluster below the Kaldmere label
    // on the original 8192 × 5668 map, approximately pixel (3744, 5492).
    id: 'kaldmere', name: 'Kaldmere', region: 'danstsud', subregion: 'hardlane', point: [.457, .969],
    subtitle: 'Son umut: mültecilerin kurduğu baraka şehri',
    summary: 'Danstsudlu mültecilerin kampından büyüyen küçük kıyı şehri. Adı “son umut” demektir; kâğıttaki statüsüne rağmen kamu altyapısı ve kraliyet otoritesi yoktur.',
    sources: [...hardlaneSources, mapSource],
    related: ['hardlane', 'frostbay', 'dranthol', 'hardlane-kulturu', 'kul-uzerine-ocak-kanunu', 'mahrumiyet-iskan-sermaye', 'kiragi-denizi'],
    sections: kaldmereSections,
  },
]
