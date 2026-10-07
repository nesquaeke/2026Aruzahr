import type { Place, Region, Subregion } from '../data'

// Public lore at the campaign's beginning: Eryndorn is still on the throne.
// Author notes, alternate coups, secret identities and quest outcomes stay outside web/.
const mapSource = 'Aruzahr 8k (1).jpg'
const canonSource = 'Danstsud kanonu — 7 Ekim 2026 tarihli yazar kararları'
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
  sources: [canonSource, 'Valhunar.pdf — genel tarih ve kültürel inanışlar', openingSource, questSource, fractureSource, 'Xotar.docx', 'Garmirik.docx', mapSource],
  sections: [
    { title: 'Danstsud Krallığı', paragraphs: [
      'Danstsud, Valhunar’ın kentler, kaleler, loncalar ve yollarla birbirine bağlanan feodal krallığıdır. Başkenti Valdareth’tir; tahtta Kral Eryndorn bulunur. Krallığın toprakları Hardlane, Manorveil ve Lowvale adlı üç bölgeye ayrılır. Bu bölgeler aynı tacın altında yer alır, fakat kraliyet gücünü aynı ölçüde hissetmez.',
      'Bir başkentte kayıt altına alınabilen vergi, askerî emir veya kamu hizmeti, uzak bir yerleşimde aynı biçimde uygulanmayabilir. Danstsud’un siyasi coğrafyasını yalnızca sınırlar değil, yöneticilerin gerçekten ulaşabildiği insanlar ve yollar da belirler.',
    ] },
    { title: 'Taç, lordlar ve vergi', paragraphs: [
      'Manorveil, kralın doğrudan topraklarıdır. Bu bölgenin vergisi krala toplanır. Diğer lordluk topraklarında tahsilatı lordlar yürütür; böylece yerel iktidar, kraliyet merkezinden ayrı bir güç kazanır.',
      'Danstsud’daki feodal düzen, ülkeyi tek bir yönetim haritasından daha karmaşık hâle getirir. Bir yerin krallığa bağlı olması, orada merkezî yönetimin her gün işlemesi anlamına gelmez. Bu fark en belirgin biçimde Hardlane’de görülür.',
    ] },
    { title: 'Manorveil: kraliyetin doğrudan toprakları', paragraphs: [
      'Manorveil’in ayırt edici özelliği, yerel verginin bir lordun hazinesinden önce kralın otoritesine bağlı olmasıdır. Valdareth çevresindeki kraliyet merkezi, haritanın bu kesiminde öne çıkar; başkentin saray ve kent düzeni, doğrudan yönetimin görünür yüzüdür.',
      'Manorveil, krallığın kendisiyle eş anlamlı değildir. Kraliyet merkezi ile uzak bölgeler arasındaki yönetim farkı, Danstsud’un iç ilişkilerini biçimlendirir.',
    ] },
    { title: 'Hardlane: uzaktaki bağlılık', paragraphs: [
      'Batının karlı bölgesi Hardlane’de, Karlan Dağları’nın ötesine geçen kraliyet otoritesi büyük ölçüde zayıflar. Ternhaven, Dranthol, Frostbay ve Vyssgard Danstsud’a bağlıdır; buna rağmen halkı merkezin düzenine ve imkânlarına eşit biçimde erişmez. Hardlaneliler krallık içinde aşağı bir konuma itilmiş topluluklar olarak görülür.',
      'Düzenli vergilendirmenin işlemediği bölgede Frostbay sınırlı bir istisnadır: vergi, güvenlik, altyapı ve gümrük uygulamaları az da olsa vardır. Diğer Hardlane yerleşimlerinin idaresi resmen Frostbay’e bağlıdır, fakat bu bağ çoğunlukla kâğıt üzerinde kalır.',
    ] },
    { title: 'Lowvale: lordluk toprakları', paragraphs: [
      'Lowvale, Hardlane ve Manorveil dışında kalan arazileri kapsar. Manorveil’de doğrudan krala toplanan verginin karşısında, lordların tahsilat ve yerel güç sahibi olduğu topraklar krallığın feodal yapısını görünür kılar.',
      'Haritanın doğu ve güney kesimlerinde nehirler, tarla çizimleri, küçük yerleşimler ve büyük surlu kentler bir arada bulunur. Lowvale adı bir bölgeyi anlatır; başlı başına bir şehir veya bağımsız bir ülke değildir.',
    ] },
    { title: 'Başlıca şehirler ve yerleşim ağı', paragraphs: [
      'Lirendil, Dorvenhall, Marhalden, Valdareth, Elorwyn ve Theramis krallığın başlıca şehirleridir. Valdareth başkent; Lirendil kale ve lonca yaşamıyla, Dorvenhall üretim ve ticaretle öne çıkar. Theramis’te büyücülerin de yer aldığı bir lonca bulunur. Marhalden, Karlan çevresindeki büyük tahkimatıyla haritada belirgindir.',
      'Bu büyük kentlerin yanında Brannis, Kethra, Myrran ve Luthen gibi yerler yolların ve kıyıların farklı parçalarını oluşturur. Brannis göç baskısıyla, Kethra liman yaşamıyla, Myrran–Luthen hattı kervan yolculuklarıyla ilişkilidir. Hardlane’in dört şehri ise ülkenin karlı batısının yerleşim ağını taşır.',
    ] },
    { title: 'Bakır Ana ve Kırılma’nın hatırası', paragraphs: [
      'Danstsud’un eski felaket anlatısında Kraliçe Yarethus, Bakır Ana olarak anılır. Onun dünyayı bir kalkan gibi örterek korumaya çalıştığına, Halendar’ın ateşi ve hırsının bu korumayı kırdığına inanılır. Tapınak duası bu hafızayı taşır: “Bakır Ana, bizi ateşin çocuğundan koru.”',
      'Honud aynı geçmişi farklı anlatır; oradaki öyküler iki kadim hükümdarın da kusurlarına ağırlık verir. Danstsud’un inancı, bütün halkların üzerinde uzlaştığı tarafsız bir tarih değildir. Aynı yıkımın bıraktığı farklı hatıralardan biridir.',
    ] },
    { title: 'Büyü, loncalar ve dış dünya', paragraphs: [
      'Büyük Kırılma’dan sonra büyünün öngörülemeyen sonuçları, Danstsud’da denetimli okulların önemini artırdı. Okul dışındaki büyü kullanımı yasaklarla çevrilidir. Büyü araştırma enstitüsü eski felaketin nedenlerini açıklamaya çalışırken, halkın büyüye yaklaşımında bilgi arayışı ile korku yan yana bulunur.',
      'ÇelikKalkan gibi loncalarda eğitim, demircilik, hekimlik ve arşiv yaşamı askerî hizmetle birlikte yürür. Xotar’ın Rüzgâr Hatları krallığa ulaşır; Garmirk’le silah ve maden alışverişi vardır. Danstsud kendi sınırları içine kapanmış bir dünya değildir: tüccarlar, göçmenler ve deniz yolları ülkenin yaşamına katılır.',
    ] },
  ],
}

// These rectangles frame map views; they do not assert surveyed political borders.
export const danstsudSubregions: Subregion[] = [
  {
    id: 'hardlane', kind: 'subregion', name: 'Hardlane', region: 'danstsud',
    subtitle: 'Karlı batı ve kâğıt üzerindeki kraliyet idaresi', point: [.496, .848], box: [.39, .65, .27, .35],
    summary: 'Karlan Dağları’nın ötesindeki karlı Danstsud bölgesi. Krallığa bağlıdır; ancak kraliyet otoritesi, vergi ve kamu hizmetleri burada çok sınırlı işler. Ternhaven, Dranthol, Frostbay ve Vyssgard bu bölgenin şehirleridir.',
    sources: [canonSource, fractureSource, mapSource], related: ['frostbay', 'ternhaven', 'dranthol', 'vyssgard', 'marhalden'],
    sections: [
      { title: 'Karlan’ın batısındaki yaşam', paragraphs: [
        'Hardlane, Danstsud’un batıdaki karlı bölgesidir. Karlan Dağları kraliyet merkezinin erişiminde önemli bir eşik oluşturur. Haritada karla örtülü yerleşimler, kıyılar, dağlık araziler ve Frostmere Gölü bölgenin görünümünü belirler.',
        'Ternhaven, Dranthol, Frostbay ve Vyssgard Hardlane şehirleridir. Dağ insanları ve göçerler de bölgenin yaşamında yer alır; Hardlane yalnızca surlu kentlerden oluşmaz.',
      ] },
      { title: 'Bağlılık ve eşitsizlik', paragraphs: [
        'Hardlane bağımsız bir ülke değildir. Danstsud’a bağlı kalır, fakat Karlan’ın bu tarafında kraliyet otoritesi güçlü biçimde işlemez. Merkezî yönetimin varlığı burada bir başkent sokağındaki kadar somut değildir.',
        'Hardlane halkı krallık içinde aşağı bir konuma itilmiştir. Aynı ülkeye ait olmalarına rağmen güvenlik, altyapı ve yönetim erişimi bakımından merkezdeki halkla eşit bir durumda değildirler.',
      ] },
      { title: 'Frostbay’in sınırlı idaresi', paragraphs: [
        'Diğer Hardlane yerleşimleri resmen Frostbay’in idaresine bağlıdır. Bu düzen büyük ölçüde kâğıt üzerinde kalır; Frostbay bölgenin her yerinde etkili bir yönetim kuramaz.',
        'Hardlane’de düzenli vergilendirme işlemez. Frostbay’de vergi, güvenlik, altyapı ve gümrük işlemleri sınırlı da olsa vardır. Bu küçük yönetim kapasitesi, bütün bölgenin işleyen bir kraliyet düzenine sahip olduğu anlamına gelmez.',
      ] },
    ],
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
        'Serenth ve Terra nehirleri bu coğrafyada belirgindir. Kentler ve küçük yerleşimler su yolları ve kara yollarıyla birbirine bağlanır.',
      ] },
    ],
  },
]

export const danstsudPlaces: Place[] = [
  {
    id: 'valdareth', name: 'Valdareth', region: 'danstsud', subregion: 'manorveil', major: true,
    point: [.734, .667], subtitle: 'Danstsud’un soylu başkenti',
    summary: 'Danstsud’un soylu başkenti ve Kral Eryndorn’un tahtının merkezi. Gri taş, sis, surlar ve kalabalık kent yaşamı, kraliyet düzeninin bu şehirdeki görünümünü oluşturur.',
    sources: [canonSource, openingSource, questSource, fractureSource, mapSource], related: ['lirendil', 'brannis', 'dorvenhall'],
    sections: [
      { title: 'Başkent ve taç', paragraphs: [
        'Valdareth, Danstsud Krallığı’nın başkentidir. Şehir ile ülke aynı şey değildir: Danstsud üç bölgeyi ve çok sayıda yerleşimi kapsar; Valdareth bu siyasi bütünün taht merkezidir. Kral Eryndorn hâlâ hüküm sürmektedir.',
        'Haritada soylu başkent olarak işaretlenen kent, kraliyet merkezi çevresindeki Manorveil düzeniyle ilişkilidir. Manorveil’in vergisi doğrudan krala toplanır.',
      ] },
      { title: 'Taş, sis ve kent yaşamı', paragraphs: [
        'Şehir gri taşlı, sisli ve soğuk olarak anlatılır. Büyük surlu kent çizimi, kuleleri ve çevresindeki yerleşim ağı Valdareth’i haritada belirgin kılar. Pazar yaşamı ve kalabalık sokaklar, başkentin askerî yüzünün yanında sivil bir hayat da bulunduğunu gösterir.',
        'Valdareth’in düzeni ülkenin her yerinde aynı biçimde yaşanmaz. Karlan Dağları’nın ötesindeki Hardlane halkı, kraliyet merkezinin sunduğu güvenlik ve altyapıya çok daha sınırlı erişir.',
      ] },
      { title: 'Zindanlar ve askerî güç', paragraphs: [
        'Valdareth’in zindanları kalabalıktır. Mahkûmlar, göçmenler ve düşmüş soylular aynı ağır koşulların içinde bulunur. Taş duvarlar, paslı demir ve dar hücreler şehrin baskı düzeninin bir yüzüdür.',
        'Kraliyet askerleri ve ÇelikKalkan loncası, başkentin askerî yaşamında adları geçen güçlerdir. Loncanın etkisi, askerî hizmetin sarayla birlikte şehir hayatına da uzandığını gösterir.',
      ] },
      { title: 'Başkenti bağlayan yollar', paragraphs: [
        'Brannis, Valdareth’ten Lirendil’e uzanan yolculuklarda bir duraktır. Dorvenhall ise üretim ve ticaretin öne çıktığı diğer büyük merkezlerden biridir. Başkent, bu yollar ve yerleşimler ağı içinde bulunur.',
        'Valdareth’i krallığın bütünü olarak görmek, diğer şehirlerin ve uzak bölgelerin deneyimini örter. Danstsud’un merkezî gücü burada somutlaşır; fakat ülkenin her yerinde aynı derecede işlemez.',
      ] },
    ],
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
    sources: [canonSource, questSource, mapSource], related: ['valdareth', 'brannis'],
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
    ],
  },
  {
    id: 'marhalden', name: 'Marhalden', region: 'danstsud', major: true,
    point: [.610, .853], subtitle: 'Karlan çevresindeki büyük tahkimat',
    summary: 'Danstsud’un altı başlıca şehrinden Marhalden, Karlan Dağları ile karlı ve daha ılıman arazilerin geçişinde görülen büyük surlu kenttir.',
    sources: [canonSource, mapSource], related: ['hardlane', 'frostbay', 'valdareth'],
    sections: [
      { title: 'Başlıca şehirlerden biri', paragraphs: [
        'Marhalden, Lirendil, Dorvenhall, Valdareth, Elorwyn ve Theramis ile birlikte Danstsud’un başlıca şehirleri arasındadır. Haritadaki adı Marhalden’dir.',
        'Büyük surları ve kuleleriyle çizilen kent, krallığın dağlık kesiminde belirgin bir yer tutar. Bir bölge adı değil, ayrı bir şehir kaydıdır.',
      ] },
      { title: 'Karlan ve kar sınırı', paragraphs: [
        'Haritada Marhalden, Karlan Zirveleri çevresinde, karlı arazi ile farklı bitki örtüsünün yan yana geldiği yerde gösterilir. Kentin çevresinde dağ, su ve orman çizimleri bulunur.',
        'Karlan, Danstsud’un siyasi erişiminde de önemli bir eşiktir: dağların Hardlane tarafında kraliyet otoritesi zayıflar. Marhalden’in bu dağ kuşağındaki konumu, onu krallığın coğrafyasını anlamada önemli bir durak yapar.',
      ] },
      { title: 'Batı ve merkez arasında', paragraphs: [
        'Frostbay ve Hardlane’in karlı yerleşimleri, Marhalden’in batısındaki farklı yönetim koşullarını temsil eder. Valdareth ise kraliyet merkezinin bulunduğu başkenttir.',
        'Aynı krallıkta dağlar, yalnızca manzarayı değiştirmez. Kraliyetin bir yere ne kadar ulaşabildiğini ve merkezî düzenin nerede zayıfladığını da belirginleştirir.',
      ] },
    ],
  },
  {
    id: 'elorwyn', name: 'Elorwyn', region: 'danstsud', major: true,
    point: [.750, .863], subtitle: 'Güneydeki büyük surlu şehir',
    summary: 'Danstsud’un altı başlıca şehrinden Elorwyn, haritanın güneyinde büyük surları, kent içi yapıları ve çevresindeki nehirli araziyle gösterilir.',
    sources: [canonSource, mapSource], related: ['valdareth', 'theramis'],
    sections: [
      { title: 'Danstsud’un büyük kentlerinden', paragraphs: [
        'Elorwyn, Danstsud Krallığı’nın başlıca şehirlerinden biridir. Valdareth başkenttir; Elorwyn ise aynı ülkenin kendi adıyla tanımlanan büyük kentlerinden biridir.',
        'Harita Elorwyn’i geniş surlar içinde, birden çok yapı topluluğuyla gösterir. Kent, ülkenin güneydeki yerleşim ağının belirgin öğelerindendir.',
      ] },
      { title: 'Surlar ve su çevresi', paragraphs: [
        'Elorwyn’in kent görünümünde surlar, kuleler, büyük yapılar ve su öğeleri bir aradadır. Çevresindeki arazi, küçük yerleşimler ve nehir yollarıyla çizilmiştir.',
        'Bu coğrafya Danstsud’un karlı batısından farklıdır. Elorwyn, büyük kentlerle çevredeki küçük yerleşimlerin aynı harita üzerinde birbirine yaklaştığı güney dünyasında yer alır.',
      ] },
      { title: 'Başkent ve diğer şehirler', paragraphs: [
        'Valdareth kuzeyde kraliyet merkezini, Theramis doğuda başka bir büyük kenti oluşturur. Elorwyn, bu merkezlerle aynı feodal krallığın siyasi bütününde bulunur.',
        'Danstsud’u yalnızca başkent üzerinden okumak, Elorwyn gibi büyük şehirlerin varlığını geri plana iter. Krallık bir taht merkeziyle birlikte farklı kentlerden ve bölgesel yönetimlerden oluşur.',
      ] },
    ],
  },
  {
    id: 'theramis', name: 'Theramis', region: 'danstsud', major: true,
    point: [.932, .905], subtitle: 'Büyük kıyı kenti ve lonca geleneği',
    summary: 'Danstsud’un başlıca şehirlerinden Theramis, güneydoğudaki büyük surlu kıyı kentidir. Şehir adına anılan loncada büyücüler bulunur; Başbüyücü Solan ve Altın Yılan amblemi bu kurumla ilişkilidir.',
    sources: [canonSource, openingSource, mapSource], related: ['elorwyn', 'lirendil', 'danstsud'],
    sections: [
      { title: 'Güneydoğudaki büyük şehir', paragraphs: [
        'Theramis, Danstsud’un altı başlıca şehrinden biridir. Haritada ülkenin güneydoğusunda, kıyıyla bağlantılı büyük bir tahkimat olarak gösterilir.',
        'Kentin çevresinde nehir, köprü, tarla ve küçük yerleşim çizimleri bulunur. Sur içindeki büyük yapı topluluğu, Theramis’i çevredeki küçük yerlerden ayırır.',
      ] },
      { title: 'Theramis Loncası', paragraphs: [
        'Theramis adına anılan loncada büyücüler de yer alır. Başbüyücü Solan, bu kurumla ilişkili isimlerden biridir. Altın Yılan amblemi loncanın tanınan işaretidir.',
        'Bu lonca, Danstsud’daki büyü ile örgütlü kurum yaşamının birbirinden tamamen ayrı olmadığını gösterir. Ülkenin büyü korkusu ve denetimli eğitim geleneğiyle birlikte okunması gereken bir kent ayrıntısıdır.',
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
    summary: 'Sisli ve kalabalık liman şehri Kethra, Lord Damian Elorwyn adıyla ilişkilidir. Paslı Kanca meyhanesi, kıyı antrepoları ve yakınındaki dağlık arazi şehir yaşamının parçalarıdır.',
    sources: [openingSource, mapSource], related: ['lirendil', 'luthen'],
    sections: [
      { title: 'Liman şehri', paragraphs: [
        'Kethra, kıyısında liman ve depolar bulunan bir Danstsud kentidir. Sis, kalabalık ve liman kokuları şehir betimlemelerinde öne çıkar. Lord Damian Elorwyn, Kethra lordu olarak anılır.',
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
    id: 'frostbay', name: 'Frostbay', region: 'danstsud', subregion: 'hardlane', point: [.478, .824],
    subtitle: 'Hardlane’in sınırlı yönetim merkezi',
    summary: 'Hardlane’de sınırlı vergi, güvenlik, altyapı ve gümrük uygulamaları bulunan karlı kıyı şehri. Diğer Hardlane yerleşimleri resmen Frostbay’e bağlıdır, fakat bu idare büyük ölçüde kâğıt üzerinde kalır.',
    sources: [canonSource, mapSource], related: ['ternhaven', 'dranthol', 'vyssgard', 'marhalden'],
    sections: [
      { title: 'Karlı kıyı şehri', paragraphs: [
        'Frostbay, Ternhaven, Dranthol ve Vyssgard ile birlikte Hardlane’in şehirlerinden biridir. Danstsud’un batıdaki karlı coğrafyasına aittir. Haritada kıyı yapıları, karlı yerleşim ve yakındaki Frostmere Gölü birlikte görülür.',
        'Frostbay bir şehir, Frostmere bir göldür. Bu iki ad, aynı yerin farklı yazımları değildir.',
      ] },
      { title: 'Kâğıt üzerindeki bölgesel idare', paragraphs: [
        'Diğer Hardlane yerleşimleri resmen Frostbay’in idaresine bağlıdır. Bununla birlikte kraliyet otoritesi Karlan Dağları’nın bu tarafında zayıf işler; Frostbay’in bütün bölgeye ulaşan güçlü bir yönetimi yoktur.',
        'Resmî bağlılık ile gerçek idare arasındaki fark, şehir için temel bir koşuldur. Krallığın kaydında bir merkez olmak, bölgenin her yerinde bu düzeni uygulayabilmek anlamına gelmez.',
      ] },
      { title: 'Sınırlı hizmet ve tahsilat', paragraphs: [
        'Hardlane’de düzenli vergilendirme işlemez. Frostbay’de ise vergi ve gümrük işlemleri az da olsa bulunur. Bu sınırlı tahsilata güvenlik ve altyapının yine sınırlı varlığı eşlik eder.',
        'Frostbay, Hardlane’in merkezle aynı koşullara sahip olduğunu gösteren bir örnek değildir. Bölgedeki düşük yönetim kapasitesinin içinde küçük bir istisna oluşturur.',
      ] },
      { title: 'Hardlane halkı ve krallık', paragraphs: [
        'Frostbay halkı da Danstsud’a bağlıdır. Hardlane’in krallık içinde aşağı bir konuma itilmesi, burada yaşayanların siyasi ve toplumsal durumunun bir parçasıdır.',
        'Ternhaven, Dranthol ve Vyssgard’ın Frostbay’e resmî bağlılığı, bu şehirlerin kendi gündelik hayatında etkin bir kraliyet düzeni bulunduğu anlamına gelmez.',
      ] },
    ],
  },
  {
    id: 'ternhaven', name: 'Ternhaven', region: 'danstsud', subregion: 'hardlane', point: [.520, .736],
    summary: 'Hardlane’in karlı kıyı şehirlerinden Ternhaven, Danstsud’a bağlı olmasına rağmen kraliyet otoritesinin zayıf işlediği batıdaki yerleşimlerdendir.',
    sources: [canonSource, mapSource], related: ['frostbay', 'dranthol', 'vyssgard'],
    sections: [
      { title: 'Hardlane kıyısında', paragraphs: ['Ternhaven, Hardlane’in kullanıcı tarafından belirlenmiş dört şehrinden biridir. Haritada karlı kıyı yerleşimi olarak gösterilir; Karlan çevresindeki karlı alanların kuzey kesimindedir.'] },
      { title: 'Resmî bağlılık, zayıf idare', paragraphs: ['Ternhaven Danstsud Krallığı’na, bölgesel idare bakımından da resmen Frostbay’e bağlıdır. Bu idare gündelik hayatta güçlü biçimde işlemez. Düzenli vergilendirmenin ve kraliyet erişiminin zayıflığı, Hardlane halkının merkezden farklı koşullarda yaşamasının bir parçasıdır.'] },
    ],
  },
  {
    id: 'dranthol', name: 'Dranthol', region: 'danstsud', subregion: 'hardlane', point: [.450, .794],
    summary: 'Danstsud’un karlı batısındaki Hardlane şehri Dranthol, kıyı yerleşimidir. Kraliyete bağlıdır; Frostbay üzerinden tanımlanan idaresi büyük ölçüde kâğıt üzerinde kalır.',
    sources: [canonSource, mapSource], related: ['frostbay', 'ternhaven', 'vyssgard'],
    sections: [
      { title: 'Batıdaki kıyı yerleşimi', paragraphs: ['Dranthol, Hardlane’in dört şehrinden biridir. Haritada karla örtülü yapıları ve kıyı bağlantısıyla gösterilir. Danstsud’un merkezî kentlerinden farklı bir coğrafi görünüm taşır.'] },
      { title: 'Krallığın uzak tarafı', paragraphs: ['Dranthol krallığa bağlı kalır; fakat Karlan Dağları’nın bu tarafında güçlü bir kraliyet düzeni işlemez. Düzenli vergilendirme yoktur. Frostbay’e resmî idari bağlılık, günlük yaşamda etkili bir bölgesel yönetim anlamına gelmez.'] },
    ],
  },
  {
    id: 'vyssgard', name: 'Vyssgard', region: 'danstsud', subregion: 'hardlane', point: [.523, .779],
    summary: 'Karlan çevresindeki karlı yerleşimlerden Vyssgard, Hardlane şehridir. Krallıkla resmî bağı sürerken etkin kraliyet idaresi ve düzenli vergilendirme burada işlemez.',
    sources: [canonSource, mapSource], related: ['frostbay', 'ternhaven', 'dranthol'],
    sections: [
      { title: 'Kar ve dağ çevresi', paragraphs: ['Vyssgard, Ternhaven, Dranthol ve Frostbay ile birlikte Hardlane’in şehirlerinden biridir. Haritada karlı yapılar, dağ ve su çevresiyle gösterilir. Karlan’ın batısındaki siyasi koşullar bu yerleşimde de geçerlidir.'] },
      { title: 'Frostbay’e bağlılık', paragraphs: ['Vyssgard’ın bölgesel idaresi resmen Frostbay’e bağlıdır. Bu bağ büyük ölçüde kâğıt üzerinde kalır. Kraliyetin güvenlik ve altyapıya erişimi zayıftır; bölge halkı Danstsud içinde merkezdeki halkla eşit koşullara sahip değildir.'] },
    ],
  },
]
