import { danstsudRegion, danstsudPlaces, danstsudSubregions } from './lore/danstsud'
import { danstsudArticles } from './lore/danstsud-court'
import { danstsudExpansionArticles, karlanExpansionArticles } from './lore/danstsud-expansion'
import { hardlaneArticles } from './lore/hardlane'
import { hardlaneLawArticles } from './lore/hardlane-laws'
import { hardlaneCoastArticles } from './lore/hardlane-coasts'
import { bryndonArticles } from './lore/bryndon'
import { taxVillages, visualPeopleArticles } from './presentation'
import { atlasRouteArticles, atlasGeographyArticles } from './map-features'
import { characterArticles } from './lore/characters'
import { lirendilInstitutions } from './lore/lirendil-institutions'

export type RegionId = 'xotar' | 'murgul' | 'honud' | 'danstsud' | 'garmirk' | 'ariki' | 'gurbin' | 'lakbar'
export type Section = { title: string; paragraphs: string[]; table?: { columns: string[]; rows: string[][] } }
export type Region = {
  id: RegionId; name: string; subtitle: string; climate: string; color: string;
  quote: string; summary: string; tags: string[]; point: [number, number];
  box: [number, number, number, number]; sections: Section[]; sources: string[];
}
export type SubregionId = 'hardlane' | 'manorveil' | 'lowvale'
type LocationRecord = {
  id: string; name: string; region: RegionId; point: [number, number]; summary?: string;
  subtitle?: string; sections?: Section[]; sources?: string[]; related?: string[];
  subregion?: SubregionId; major?: boolean;
  positionStatus?: 'mapped' | 'approximate';
}
export type Place = LocationRecord & { kind?: 'settlement' }
export type Subregion = LocationRecord & {
  id: SubregionId; kind: 'subregion'; region: 'danstsud'; subtitle: string;
  box: [number, number, number, number]; summary: string; sections: Section[]; sources: string[];
}
export type LoreArticle = {
  id: string; name: string; kind: 'dynasty' | 'person' | 'law' | 'institution' | 'geography' | 'material' | 'fauna' | 'culture' | 'chronicle'; region: RegionId;
  subtitle: string; summary: string; sections: Section[]; sources: string[];
  related?: string[]; aliases?: string[]; mapLocation?: string;
}
export const loreKindLabels = { dynasty: 'Hanedan', person: 'Kişi', law: 'Hukuk', institution: 'Kurum', geography: 'Coğrafya', material: 'Maden', fauna: 'Canlılar', culture: 'Kültür', chronicle: 'Tanıklık' }

// This is an intentionally curated public dataset. Never import the raw campaign
// documents into the client bundle: they contain private DM notes and endgame secrets.
// The map governs marker positions; the user's chosen spellings govern display names.
export const regions: Region[] = [
  {
    id: 'xotar', name: 'Xotar', subtitle: 'Çölün kalbi, güneşin iradesi', climate: 'Çöl & vahalar', color: '#d6aa63',
    quote: 'Su kimdeyse, güç ondadır.', point: [.17, .16], box: [0, 0, .37, .39],
    summary: 'Kumların altında kadim sırlar, vahaların çevresinde yaşayan şehirler. Xotar’da su, ticaret ve güneşin mirası birbirinden ayrılmaz.',
    tags: ['Karutah', 'Ticaret', 'Vahalar'], sources: ['Xotar.docx', 'Aruzahr 8k (1).jpg'],
    sections: [
      { title: 'Kumun altında yaşam', paragraphs: ['Kızıl sarı kumların ve sert güneşin hüküm sürdüğü Xotar’da gündüzün kavurucu sıcaklığı, gece yerini keskin bir soğuğa bırakır. Kızıl Fırtınalar olarak bilinen kum kasırgaları, yolculuğu başlı başına bir sınava dönüştürür.', 'Miraz Vadileri diye anılan yeraltı su yolları, gizli bahçeleri ve derin kuyuları besler. Yerleşimler bu yaşam kaynakları çevresinde gelişir; çöl halkı için su, altından değerlidir.'] },
      { title: 'Güneş, ışık ve gölge', paragraphs: ['Karutah öğretisi, insanın içindeki Zahr — ışık — ve Rah — gölge — arasında bir denge arar. Rahipler yalnızca dini önderler değildir; bilgin, şifacı ve filozof olarak da toplumda yer alırlar.', 'Kum, su ve güneş ışığı ritüellerin üç kutsal unsurudur. Rav’Kalim gününde gündüz susuz oruç tutulur, gece ilk su içimi dualarla karşılanır.'] },
      { title: 'Kervanların taşıdığı dünya', paragraphs: ['Baharatlar, değerli taşlar, mineraller ve nadir Kum İpeği, Xotar’ın ticari mirasını oluşturur. Kum İpeği, çöl böceklerinin salgısından dokunur ve sıcak ile soğuğa karşı koruyucu niteliğiyle tanınır.', 'Rüzgâr Hatları adı verilen eski ticaret rotalarında kervanlar ve tüccarlar hareket eder. Su kaynakları ve yollar, ekonomik gücün merkezindedir.'] },
      { title: 'Çölün gündelik dili', paragraphs: ['Misafirlik kutsaldır: bir yabancıya su vermek, Karutah geleneğinde büyük değer taşır. Baharatlı ve kurutulmuş yiyecekler paylaşılır; gelenekler, yaşamın kıt kaynaklarını birlikte korumaya dayanır.', 'Evlilikte iki su kabı karıştırılır. Her çocuğun doğumunda aldığı Su İsmi, suya ilk dokunan kişinin duasıyla ilişkilendirilir.'] },
    ],
  },
  {
    id: 'murgul', name: 'Murgul', subtitle: 'Adalar ülkesi ve Azja mirası', climate: 'Adalar & ormanlar', color: '#86b793',
    quote: 'Dalga gibi yumuşak, fırtına gibi kudretli.', point: [.16, .35], box: [0, .19, .38, .33],
    summary: 'Azja’nın ruhani mirası ile Xotar’ın deniz aşırı kültürü, Murgul’un adalarında bir araya gelir. Deniz, farklı halkları ve gelenekleri birbirine bağlar.',
    tags: ['Azja', 'Denizcilik', 'Kültür'], sources: ['Murgul.docx', 'Aruzahr 8k (1).jpg'],
    sections: [
      { title: 'Adaların dünyası', paragraphs: ['Murgul, çok sayıda ada ve küçük takımadadan oluşur. Adaların iklimi ve ekosistemi birbirinden farklıdır; fırtınalı denizler ve ani hava değişimleri kimi yerleşimleri dış dünyadan uzaklaştırır.', 'Merkez adada Azja mirası ile Xotar kültürü yan yana yaşar. Kıyılar balıkçılık ve deniz ticareti için zengin kaynaklar sunar.'] },
      { title: 'Bir arada yaşayan gelenekler', paragraphs: ['Azja toplulukları kendi dillerini ve ruhani geleneklerini korur. Xotar kökenli topluluklar ise Karutah kültürünün disiplinini ve örgütlenme mirasını taşır.', 'Murgul’un toplumsal kimliği, farklı köken ve inançların bir arada yaşamasına dayanır. Saygı ve barış, ada kültürünün temel değerlerindendir.'] },
      { title: 'İnanç ve ritüeller', paragraphs: ['Azja öğretisinde doğa ile uyumlu yaşamak bir erdemdir. Deniz tanrılarına ve atalara saygı gösterilir; her ada, kendi geleneklerine göre toplu kutlamalar ve ritüeller düzenler.', 'Gurbin’in Vahen öğretileri burada daha barışçıl biçimlerde yorumlanır. Aynı öğreti, farklı adalarda farklı bir anlam kazanabilir.'] },
      { title: 'Denizden gelen refah', paragraphs: ['Balıkçılık, deniz ürünleri, baharat ticareti, el sanatları ve gemicilik ada ekonomisinin temelidir. Limanlar yalnızca malları değil, farklı halkların hikâyelerini de taşır.', 'Ariki ve Garmirk ile ticaret ve diplomasi yürütülür. Gurbin ile ilişkilerin arkasında ise ortak geçmişten gelen daha karmaşık bağlar vardır.'] },
    ],
  },
  {
    id: 'honud', name: 'Honud', subtitle: 'Buz devi toprakları', climate: 'Buz & uzun kışlar', color: '#92bdce',
    quote: 'Hayatta kalmak sadece güç meselesi değil, sabır ve uyum işidir.', point: [.21, .73], box: [0, .47, .40, .52],
    summary: 'Donmuş düzlükler, nehir vadileri ve birbirine bağlı klanlar. Honud’un halkı, sert doğanın karşısına sabır, dayanışma ve sözlü büyü geleneğiyle çıkar.',
    tags: ['Klanlar', 'Buz ruhları', 'Sözlü büyü'], sources: ['honut.docx', 'Valhunar.pdf', 'Aruzahr 8k (1).jpg'],
    sections: [
      { title: 'Buzun sınavı', paragraphs: ['Donmuş topraklar ve uzun kışlar, Honud’da yaşamın ritmini belirler. Beş yılda bir gelen dondurucu ayaz, halkın hazırlıklarını ve kaynak kullanımını şekillendirir.', 'Nehirler ve kıyılar, sınırlı nüfusun beslenmesinde yaşamsal öneme sahiptir. Balıkçılık, avcılık ve mevsimlik stoklar, soğukla mücadelenin temelidir.'] },
      { title: 'Klan ve dayanışma', paragraphs: ['Yüzyıllardır yaşayan klanlar, kendi bölgelerinde ekonomik ve sosyal düzeni sağlar. Avcılıkta, kaynak paylaşımında ve felaket zamanlarında klan üyeleri birbirine güvenir.', 'Yerel topluluklar büyük ölçüde kendi düzenlerini korur. Ardzenor adlı tanrı-kral figürü, halkın bir kısmı için hem yönlendirici hem de kutsal bir otoritedir.'] },
      { title: 'Ruhlar ve sözlü büyü', paragraphs: ['Buz Ruhları, iklim olayları ve felaketlerin kültürel anlatılarında yer alır. Büyü geleneği, on beş kulede sürdürülen sözlü öğretilerle ilişkilidir.', 'Söz, hafıza ve hayatta kalma bilgisi nesiller arasında taşınır. Honud’da bilgelik, yalnızca gücü değil, gücün ne zaman kullanılacağını da bilmektir.'] },
      { title: 'Göçlerin bıraktığı iz', paragraphs: ['Geçmiş yüzyıllarda yaşanan göçler, halkın dağılımını ve toplulukların ilişkilerini değiştirmiştir. Coğrafyanın baskısı, her nesli yeni yaşam yolları aramaya zorlar.', 'Eski anlatılar, Honud ile Danstsud’un parçalanmadan önce aynı kara bütününün parçası olduğunu söyler. Bugünün ayrılığı, ortak bir geçmişi tamamen silememiştir.'] },
    ],
  },
  danstsudRegion,
  {
    id: 'garmirk', name: 'Garmirk', subtitle: 'Dağların kalbi', climate: 'Dağlar & fırtınalar', color: '#b9b8a3',
    quote: 'Taş kırılır, ama yankı kalır.', point: [.84, .13], box: [.67, 0, .32, .31],
    summary: 'Her dağın bir klanı, her çeliğin bir ruhu vardır. Garmirk, yeminlerin taş kadar ağır, tarihin şarkılar kadar canlı olduğu dorukların ülkesidir.',
    tags: ['Demir Meclisi', 'Yeminler', 'Zanaat'], sources: ['Garmirik.docx', 'Aruzahr 8k (1).jpg'],
    sections: [
      { title: 'Yedi sıradağ', paragraphs: ['Vurgarin, Morhald, Hranvek, Kalgor, Rindhal, Ternik ve Urnvad, Garmirk’in dağlık dünyasının çekirdeğini oluşturur. Madenler, fırtınalar, mağaralar ve sis, her dağa ayrı bir kimlik verir.', 'Klan sınırları yalnızca coğrafyayla değil, onur yeminleriyle de belirlenir. Bir dağ, aynı zamanda bir halkın ata toprağıdır.'] },
      { title: 'Torgallar ve Demir Meclisi', paragraphs: ['Volgar, Rudmar, Tahrin, Bregin ve Skarv klanları farklı totem ve geleneklerle anılır. Klan liderlerine Torgal denir; lider hem savaşta hem barışta halkını temsil eder.', 'Demir Meclisi, Kardum Çanağı adlı doğal amfitiyatroda toplanır. Liderlerin örse indirdiği çekiçlerin yankısı, kararlılığın simgesidir.'] },
      { title: 'Taşın hatırladığı', paragraphs: ['Ataların Gözü efsanesi, ölmüş liderlerin halklarını izlemeyi sürdürdüğünü anlatır. Koru yanan ruhu, Sura ise uyuyan ruhu temsil eder. Borin adı verilen ruh rehberleri, geçmişin sesini taşır.', 'Varn, Morga, Krenir ve Doral, çelik, dağ, rüzgâr ve ateşle ilişkilendirilir. Kutsal yerler, mağaralar ve taş çemberlerdir.'] },
      { title: 'Çeliğin ve şarkının mirası', paragraphs: ['Bir demirci tamamladığı kılıca isim verir; çeliğin ruh taşıdığına inanılır. Silah yapımı ve taş oymacılığı, hem zanaat hem de hafıza işidir.', 'Yemin Şarkıcıları, klan geçmişini sözlü olarak yaşatır. Garmirk’te tarih, yalnızca yazılı kayıtlarda değil, bir sonraki nesle aktarılan şarkılarda da bulunur.'] },
    ],
  },
  {
    id: 'ariki', name: 'Ariki', subtitle: 'Ada klanlarının özgür denizleri', climate: 'Adalar & değişken rüzgâr', color: '#80b6b2',
    quote: 'Deniz bizi birbirimize bağlar, ama hiç kimseyi zincirleyemez.', point: [.86, .32], box: [.72, .23, .27, .26],
    summary: 'Denizciliğin, klanların ve seçimlerin şekillendirdiği ada dünyası. Ariki’de özgürlük ile onur, her değişen rüzgârda yeniden sınanır.',
    tags: ['Klanlar', 'Seçimler', 'Denizcilik'], sources: ['Ariki.docx', 'Aruzahr 8k (1).jpg'],
    sections: [
      { title: 'Altı adanın hikâyesi', paragraphs: ['Ardena’nın ormanları, Krenna’nın dik yamaçları, Bralis’in balıkçılığı, Varnok’un fırtınaları ve Thalven’in madenleri, ada kültürünün farklı yüzleridir. Orinth ise sürgün geleneğiyle anılır.', 'Değişken rüzgârlar, yağış ve deniz yolları, gündelik hayatı biçimlendirir. Her ada kendi doğasını ve alışkanlıklarını taşır.'] },
      { title: 'Lideri seçmek', paragraphs: ['Ada liderleri, diğer klanların katıldığı seçimlerle belirlenir. Tavren ticarette, Morrik güvenlikte, Eryth bilgi ve diplomaside, Valren ise adalar arası ilişkilerde öne çıkar.', 'Küçük klanlar da karar süreçlerinde söz sahibidir. Özgürlük, sürekli diplomasi ve karşılıklı denge gerektirir.'] },
      { title: 'Deniz sunağı', paragraphs: ['Deniz tanrısı Varnis, bilgelik tanrıçası Erytha ve sürgün adasıyla ilişkilendirilen Krenn, Ariki’nin mitolojik dünyasında yer alır. Yolculuklardan önce ailelerin deniz sunaklarında dualar edilir.', 'Dalga ve Kılıç destanı ile seçim öncesinde yapılan Altın Oruç, adaların kültürel hafızasını yaşatan geleneklerdendir.'] },
      { title: 'Rüzgârın taşıdığı geçim', paragraphs: ['Balıkçılık, tuz, mineraller, gemicilik ve nakliye adaların temel kaynaklarıdır. Limanlar ve ticaret yolları, toplumun refahını doğrudan etkiler.', 'Garmirk’in kültürel mirası ile denizciliğin özgürlük anlayışı, Ariki’de birlikte yaşar. Onur ve diplomasi, aynı yaşam biçiminin iki parçasıdır.'] },
    ],
  },
  {
    id: 'gurbin', name: 'Gurbin', subtitle: 'Klanların gölgeleri', climate: 'Kayalık adalar', color: '#ba8580',
    quote: 'Güç ne verilmez, alınır; itaat edilmez, seçilir.', point: [.66, .39], box: [.52, .16, .29, .33],
    summary: 'Sert kıyılar, hızlı gemiler ve güç dengesiyle ayakta duran klanlar. Gurbin’de strateji, sadakat ve bağımsızlık hayatın her alanına uzanır.',
    tags: ['Vahen', 'Strateji', 'Bağımsızlık'], sources: ['Gurbin.docx', 'Aruzahr 8k (1).jpg'],
    sections: [
      { title: 'Beş adanın coğrafyası', paragraphs: ['Vahen, Tarnis, Brulmar, Orveth ve Kryssan, Gurbin anlatılarındaki beş adadır. Kayalık kıyılar, derin deniz ve sürekli rüzgâr, toplulukların gündelik sınavını oluşturur.', 'Denizcilik, balıkçılık ve küçük tarım alanları ada yaşamını besler. İzolasyon hem koruyucu hem de zorlayıcıdır.'] },
      { title: 'Dört klanın dengesi', paragraphs: ['Vahen, Bralk, Tarn ve Kryss klanları, Altıların Savaşı sonrasında bağımsızlığı koruyan yapıyı oluşturur. Diplomasi, deniz gücü, bilgi ve mistik gelenekler, farklı klanların uzmanlık alanlarıdır.', 'Güç ve sadakat, kişisel ilişkiler kadar siyasi düzenin de merkezindedir. Klanlar birbirini gözlemler ve değişen dengelere uyum sağlar.'] },
      { title: 'Vahen öğretisi', paragraphs: ['Vahor güç ve zaferi, Azreth gölge ve stratejiyi, Delak ise ölüm ve sürgünü temsil eder. Gölge Yeminleri, gençlerin hem klanlarına hem de kendi güçlerine bağlılığını simgeler.', 'Gurbin’de başarı, yalnızca savaş meydanında değil, diplomasi ve stratejide de ölçülür. Güç, bir erdem olduğu kadar sürekli bir sınavdır.'] },
      { title: 'Denizde bağımsızlık', paragraphs: ['Bralk denizcilerinin hızlı gemileri ve klan savaşçılarının dayanıklı silahları, ada savunmasının parçasıdır. Bilgi ve psikolojik strateji, fiziksel güç kadar önemsenir.', 'Garmirk ve Ariki ile tarihsel ilişkiler, Lakbar ile ticari bağlar ve bağımsız kalma iradesi, Gurbin’in dış dünyayla ilişkisini şekillendirir.'] },
    ],
  },
  {
    id: 'lakbar', name: 'Lakbar', subtitle: 'Yanan denizin adaları', climate: 'Volkanlar & lav', color: '#d98b64',
    quote: 'Ateşin ortasında doğanlar, alevle yürümeyi bilir.', point: [.49, .19], box: [.37, 0, .23, .40],
    summary: 'Volkanik kayalar, sıcak denizler ve dışarıya kapalı bir kültür. Lakbar’da yaşam, ateşle savaşmak kadar onunla birlikte var olmayı öğrenmektir.',
    tags: ['Ateş', 'Kaos büyüsü', 'İzolasyon'], sources: ['Lakbar.docx', 'Aruzahr 8k (1).jpg'],
    sections: [
      { title: 'Yanan deniz', paragraphs: ['Lakbar’ın toprakları volkanik ve kayalıktır; bitki örtüsü sınırlıdır. Adaların çevresindeki sıcak sular, lav ve gazlar, sıradan deniz yolculuklarını güçleştirir.', 'Bu doğal engeller, ada halkını dış dünyadan korur. Aynı zamanda yaşamı sürekli ustalık ve hazırlık gerektiren bir mücadeleye dönüştürür.'] },
      { title: 'Kapalı bir kültür', paragraphs: ['Lakbar halkı, kendi ritüellerini ve öğretilerini kuşaktan kuşağa aktarır. Yerel sırları dışarıya açmamak, kültürel kimliğin önemli bir parçasıdır.', 'Toplumsal düzen, merkezi otoriteden çok bireysel yetenek ve ustalıkla ilişkilidir. Ateş ve kaos büyüsü, gündelik yaşamdan savunmaya uzanan bir rol oynar.'] },
      { title: 'Alevle birlikte yaşamak', paragraphs: ['Ateş ve lav yalnızca tehlike değildir; yerel kültürde kutsal ve gündelik olanla iç içedir. Halk, bu güçlerle uyum içinde yaşayabilmek için kendine özgü yöntemler geliştirmiştir.', 'Denizde hareket, özel ağaçlardan yapılan araçlar ve antik tekniklerle mümkün olur. Adaların bilgisi, dışarıdan gelen bir ziyaretçi için kolayca anlaşılabilir değildir.'] },
      { title: 'Az ama değerli bağlar', paragraphs: ['Mineraller, özel ağaçlar ve ustalıkla üretilen araçlar, Lakbar’ın sınırlı fakat stratejik kaynaklarıdır. Ticari temaslar özellikle Xotar ve Garmirk ile kurulur.', 'İzolasyon, Lakbar’ı hem gizemli hem de stratejik açıdan önemli kılar. Burada doğal çevre, kültür ve büyü birbirinden ayrı düşünülemez.'] },
    ],
  },
]

// Original pins follow visible settlements. At the author’s request, new tax
// settlements use explicitly approximate anchors. Existing anchors follow the
// drawn settlements; the original image remains intact.
export const places: Place[] = [
  { id: 'zarim-khet', name: 'Zarim’khet', region: 'xotar', point: [.155, .129] },
  { id: 'thariz', name: 'Thariz', region: 'xotar', point: [.052, .193] },
  { id: 'sahrim', name: 'Sahrim', region: 'xotar', point: [.325, .188] },
  { id: 'qal-nashar', name: 'Qal’Nashar', region: 'xotar', point: [.329, .313] },
  { id: 'morihael', name: 'Morihael', region: 'murgul', point: [.159, .331] },
  { id: 'skjornhvaldr', name: 'Skjornhvaldr', region: 'honud', point: [.218, .719] },
  { id: 'frostheimr', name: 'Frostheimr', region: 'honud', point: [.332, .735] },
  { id: 'norrvar', name: 'Norrvar', region: 'honud', point: [.320, .653] },
  { id: 'kaldryss', name: 'Kaldryss', region: 'honud', point: [.254, .879] },
  ...danstsudPlaces,
  ...taxVillages,
  { id: 'hurnreach', name: 'Hurnreach', region: 'gurbin', point: [.674, .227] },
  { id: 'kraenfall', name: 'Kraenfall', region: 'gurbin', point: [.608, .390] },
  { id: 'volriks-maw', name: 'Volrik’s Maw', region: 'gurbin', point: [.780, .473] },
  { id: 'baldrek', name: 'Baldrek', region: 'garmirk', point: [.834, .104] },
  { id: 'stoneclans', name: 'Stoneclans', region: 'garmirk', point: [.959, .213] },
  { id: 'twinclans', name: 'Twinclans', region: 'ariki', point: [.828, .319] },
  { id: 'northpact', name: 'Northpact', region: 'ariki', point: [.930, .331] },
  { id: 'eldrascar', name: 'Eldrascar', region: 'ariki', point: [.943, .460] },
]

export { historyArticle } from './lore/history'

export const subregions: Subregion[] = danstsudSubregions
export const mapLocations: (Place | Subregion)[] = [...places, ...subregions]
export const loreArticles: LoreArticle[] = [...danstsudArticles, ...danstsudExpansionArticles, ...karlanExpansionArticles, ...hardlaneArticles, ...hardlaneLawArticles, ...hardlaneCoastArticles, ...bryndonArticles, ...visualPeopleArticles, ...atlasRouteArticles, ...atlasGeographyArticles, ...characterArticles, ...lirendilInstitutions]
export const canonicalId = (id: string) => id === 'marahalden' ? 'marhalden' : id
export const regionById = (id: string) => regions.find(r => r.id === id)
export const placeById = (id: string) => places.find(p => p.id === canonicalId(id))
export const subregionById = (id: string) => subregions.find(s => s.id === id)
export const locationById = (id: string) => placeById(id) || subregionById(id)
export const articleById = (id: string) => loreArticles.find(article => article.id === id)
export const normalize = (text: string) => text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[’']/g, '')
