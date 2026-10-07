import type { LoreArticle, Section } from '../data'

// Curated public lore. The author's new brief supplies facts; named customs,
// institutions and animals are authorised additions, not raw campaign imports.
export const hardlaneSources = [
  'Hardlane — 8 Ekim 2026 tarihli şehir, reform ve deniz kararları',
  'Hardlane — 8 Ekim 2026 yetkilendirilmiş kültür ve doğa yazımı',
]

export const hardlaneSections: Section[] = [
  { title: 'Karlan’ın batısındaki yaşam', paragraphs: [
    'Hardlane, Karlan Dağları’nın batısındaki zor Danstsud topraklarıdır. Ternhaven, Dranthol, Frostbay, Vyssgard ve Kaldmere kıyıda farklı hayatlar sürer. Marhalden geçidi doğuya açılır; geniş bölgenin resmî idaresi Frostbay’e bağlı görünse de gerçek yetki yerden yere değişir.',
    'Eski kıyı halkının yanına son dönemde çok sayıda Danstsudlu göçmen ve mülteci gelmiştir. Honud’dan kaçanlar Frostbay’e uğrar; başkentten ve başka kıtalardan aranan kişiler de merkezî idarenin zayıflığını son sığınak olarak görür. Bir ev arayan aile, iş arayan göçmen ve kanundan kaçan biri aynı sebeple gelmiş değildir.',
  ], table: { columns: ['Yerleşim', 'Öne çıkan yaşam', 'Güncel durum'], rows: [
    ['Frostbay', '45–50 bin kişi; eski yapıların içinde büyük kıyı pazarı', 'Sınırlı idare ve gümrük; yetersiz garnizon'],
    ['Kaldmere', 'Danstsudlu mültecilerin kurduğu küçük şehir', 'Barakalar, küçük liman; kamu altyapısı ve kraliyet otoritesi yok'],
    ['Dranthol', 'Yaklaşık 1.500’den 15.000 kişiye büyüyen reform yerleşimi', 'Bölgenin kişi başına en güçlü güvenliği; zayıf altın akışı'],
    ['Vyssgard', 'Eski kentin çeteler ve kaçak ticaretçe paylaşılması', 'Zorla uygulanan yerel kurallar; kraliyet idaresi işlemiyor'],
    ['Ternhaven', 'Rydorn sıcak sularında eski Hardlane kültürü', 'Görece ılıman ve kendine yeten şehir; yol fırsatı kaybedilmiş'],
  ] } },
  { title: 'Bağlılık ve eşitsizlik', paragraphs: [
    'Hardlane Danstsud’a bağlıdır; halkı merkezdeki güvenlik, yol ve kamu hizmetlerine eşit ölçüde ulaşamaz. Bölgeyi kraliyetin kaydında görmek, bir kış gecesi yardımın gerçekten gelebileceği anlamına gelmez.',
    'Eryndorn Vaeranth’ın Kül Üzerine Ocak Kanunu yerleşim statülerini, Mahrumiyet Mıntıkayı İskân ve Sermaye Tevzi Kanunnamesi yatırımları düzenlemiştir. Dranthol ile Ternhaven reformlardan yararlandı. Kaldmere’in şehir boyutuna ve statüsüne ulaşması ise su hattı, düzenli yol veya muhafız getirmedi.',
  ] },
  { title: 'Frostbay’in sınırlı idaresi', paragraphs: [
    'Frostbay’in posta, gümrük ve yerel kayıt işleri, kimlerin inşa ettiği bilinmeyen kadim taş yapılarda yürütülür. Bölgenin en eski şehrindeki garnizon kendi sokaklarının tamamını koruyamaz. Diğer yerleşimler üzerindeki geniş yetki çoğunlukla kâğıtta kalır.',
    'Hardlane genelinde düzenli kraliyet vergisi işlemez. Frostbay sınırlı tahsilat ve hizmetin eski istisnası, Dranthol kraliyet yatırımı ve garnizonunun yeni güvenlik istisnasıdır. Bu iki durum bölgenin tamamında işleyen merkezî yönetim kurmaz.',
    'Harven ve Mavric’te Marhalden askerlerinin fiilî koruma ve yerel vergi düzeni ayrı bir bağlılıktır. Kralın Yolu Marhalden’de biter; bu köylerin askerî izleri veya Kemiğe Basan Yol, kraliyet ana yolunun batıya uzatılmış hali değildir.',
  ] },
  { title: 'Kemiğe Basan Yol ve eksik Cevher Çizgisi', paragraphs: [
    'Kemiğe Basan Yol, Ternhaven, Dranthol ve Frostbay’i Marhalden’e bağlayan uzun, gayriresmî ticaret hattıdır. Bazı parçaları orman izi, bazıları kıyı yürüyüşü, bazıları yüklerin sırtta taşındığı dar patikadır. Mevsime göre yön değiştiren bu hat, güvenli ve sürekli bir şose değildir.',
    'Ternhaven ile Marhalden arasında tasarlanan Cevher Çizgisi, daha düzenli bir yük yolu kuracaktı. Marhalden’in mülteci girişini kapatması, Vyssgard’daki suç düzeni ve başkentin karışıklıkları projeyi hayata geçirmedi. Kapanan kapılar, ticaretin bütünüyle durmasından çok insanlara ve yüke farklı davranıldığı bir geçiş rejimi yaratır.',
  ] },
  { title: 'Denizin değişen yüzleri', paragraphs: [
    'Ternhaven ve Dranthol önündeki Ak Cam Denizi bağlı buz örtüsü taşımayan sudur. Aralarındaki Soluk Su’da sis, rüzgâr ve kayalıklar gemileri kıyıya sürer. Dranthol’un aşağısındaki Ayaz Yutan Boğazı’ndan sonra donmuş deniz kuşağı başlar.',
    'Danstsud ile Honud arasındaki Kırağı Denizi, Son Nefes Denizi adıyla da bilinir. Çatlayan, akıntıyla yer değiştiren ve yeniden kapanan buz, yürüyerek aşılacak sağlam bir köprü oluşturmaz. Doğuya bakan Kefen Denizi’nin ayrı buzları kıyı akıntılarıyla başka sulara taşınır; açık denize gelen bir buz parçası orada da kalıcı örtü olduğu anlamına gelmez.',
  ] },
  { title: 'Ocakların kültürü ve eski yeşilin şüphesi', paragraphs: [
    'Eski kıyı halkı, bir evin kışlık emeğine ocak der: ateş kadar tuz, kuru yakıt ve birlikte tutulan stok da bu adın içindedir. Ternhaven’de bu alışkanlıklar güçlü biçimde sürer; göçlerle büyüyen şehirlerde yeni inanç ve yemeklerle birleşir. Vyssgard çeteleri kimi eski sözleri kendi zor düzenine çevirmiştir.',
    'Theramis’ten gelen Kâtip Bryndon, Frostbay’in yuvarlak taş yığma yapılarını ve eski yel değirmenlerini inceler. Bugünkü soğuk içinde bu kadar geniş ve korunaksız yapıların niçin kurulduğu, bölgenin bir zamanlar daha yaşanabilir ve yeşil olduğu şüphesini besler. Araştırması geçmişin bütün nedenlerini çözmüş bir tarih değildir.',
  ] },
]

export const frostbaySections: Section[] = [
  { title: 'En eski kıyı şehri', paragraphs: [
    'Frostbay, Hardlane’in en eski ve en ilgi çekici şehridir. Kimin kurduğu ve ilk yapıların hangi tarihte yükseldiği bilinmez. Bugün hâlâ duran haşmetli taş binalar, aralarına eklenen barakalar ve düşük gelirli hanelerle aynı sokakları paylaşır. Kadim bir kapının altında yamalı kumaştan bir dükkân açılabilir.',
    'Yaklaşık 45–50 bin kişinin yaşadığı tahmin edilir. Posta defterine giren hane sayısı bütün nüfusu göstermez: mevsimlik denizciler, barakalarda kalanlar ve yeni gelen mülteciler kayıtta eksik olabilir. Kalabalığına rağmen şehrin kaynakları ve idaresi kırılgandır.',
  ] },
  { title: 'Dairetaş ve kullanılan harabeler', paragraphs: [
    'Dairetaş, yuvarlak taş yığma yapılarla dolu eski idare kesimidir. Taş Halka binasında postahane, İkinci Halka’da gümrük kaydı, Sessiz Avlu’da yerel görüşmeler yürütülür. Duvarların bazıları en eski yerel kayıtların hatırlayabildiği onarımlardan da önceye uzanır.',
    'İdare bu binaları kökenlerini bildiği için değil, ayakta kaldıkları ve elde başka mekân az olduğu için kullanır. Yeni kapı eski kemere uydurulur, zemin üstüne tahta serilir, kayıp taşın yerine daha küçük taşlar sıkıştırılır. Geçmiş, gündelik işlerin altında görünür kalır.',
  ] },
  { title: 'Yamaiskele, Dar Soba ve Kırık Kanat', paragraphs: [
    'Yamaiskele, depo, rıhtım ve küçük tüccarların kıyısıdır. Dar Soba’da mülteci haneleri ile düşük gelirli aileler dar barakalarda yaşar; aynı bacayı paylaşan evler vardır. Kırık Kanat, eski değirmen gövdelerinin ev ve depo olarak kullanıldığı kesimdir. Küçük fener Alçak Işık, kenti büyük deniz fenerli Dranthol’dan farklı bir siluetle gösterir.',
    'Honudlu mültecilerin ilk uğraklarından biri olan şehirde, tercümanlık, geçici yatak, iş ve yiyecek bulmak aynı anda gerekir. Yardım bağı kuran haneler ve gelenlerden yararlanan aracılar aynı mahallelerde bulunur. Bir evin kökeni, orada yaşayanların bütün kararını açıklamaz.',
  ] },
  { title: 'Sınırlı hizmet ve tahsilat', paragraphs: [
    'İskele Vekili Nera Veld’in yürüttüğü yerel idare, posta, tartı, sınırlı gümrük ve bakım işleriyle ayakta kalır. Bu gelir her sokağa güvenlik veya altyapı sağlamaya yetmez. Frostbay bölgenin kâğıt üzerindeki merkezi olarak görünürken gerçek erişimi kent içinde dahi kesintilidir.',
    'Nöbetbaşı Odran Vehl’in garnizonu vardır; rıhtımlar, baraka kesimleri ve eski yapılara yayılmış büyük nüfusu bütünüyle koruyamaz. Sınırlı tahsilat, Hardlane’in tamamına yayılmış düzenli kraliyet vergisi değildir. Harven ve Mavric’teki Marhalden bağlılığı ayrı işler.',
  ] },
  { title: 'Korsanların da uyuduğu korunak', paragraphs: [
    'Kentin kıyı şekli ve limana sığınan küçük koylar, yağmacı ve korsanlara ticaret yapabilecekleri, bazen de rahat uyuyabilecekleri doğal koruma sağlar. Onların getirdiği para, liman emeği ve mal akışı şehrin pazarını büyütür. Aynı akış tehdidi, borcu ve zorla alınan payları da taşır.',
    'Frostbay’in her sakini korsan değildir. Balıkçı, avcı, katip, işçi ve çocukların gündelik hayatı bu ekonominin çevresinde sürer. Yerel idarenin neyi denetleyebildiği ile tüccarın neyi soruşturmadan satın aldığı arasındaki boşluk, şehrin servet ve güvensizliğinin birlikte büyüdüğü alandır.',
  ] },
  { title: 'Altı aylık tarla ve kışlık yiyecek', paragraphs: [
    'Tarım yılın yaklaşık altı ayında, düşük verimle yapılabilir. İnce Yaz Arpası, kök bitkiler ve korunaklı küçük bostanlar şehir için katkıdır; bu kadar kalabalık nüfusu tek başına doyurmaz. Kıyı ticareti, dışarıdan gelen tahıl, balık ve av ürünleri beslenmeyi tamamlar.',
    'Az sayıdaki otlakta Kırağı Boynuzlu Tervan, Kütburunlu Norruk ve Saztırnaklı Velkir beslenebilir. İnce don kabuğunu kırıp altında kalmış ot, saz kökü veya likene ulaşırlar. Bitki kışın sürekli yeniden büyümez; haneler yem, kuru balık ve yakıt biriktirir.',
    'Frostmere’in yılın yarısı donması, kıyı balıkçılığını mevsime bağlar. Donmuş denizin açık yarıkları ile göldeki akıntı ağızları aynı güvenilirliği taşımaz. Ürün saklamak için tuz ve yakıt bulmak, avın kendisi kadar önemlidir.',
  ] },
  { title: 'Bryndon’un ölçtüğü eski şehir', paragraphs: [
    'Theramis kâtipleri ve araştırmacıları, kentin izlerini binlerce yıl geriye götürebilecek yapı tabakalarını inceler. Bryndon, yuvarlak kuru taş yığma tekniği, değirmen yatakları, geniş dış avlular ve eski su giderleri arasında ilişki kurar.',
    'Bir değirmenin varlığı tek başına çevresinde tahıl yetiştiğini kanıtlamaz; değirmen başka ürünleri de işleyebilir veya tahıl dışarıdan gelmiş olabilir. Bryndon’un merakı, bu yapıların bir arada nasıl bir hayatı mümkün kıldığında yoğunlaşır. Kıyı Defteri bu arayışı kendi sesiyle anlatır.',
  ] },
]

export const kaldmereSections: Section[] = [
  { title: 'Son umut', paragraphs: [
    'Kaldmere, Danstsud dilinde “son umut” demektir. Başlangıçta Danstsudlu mültecilerin mesken tuttuğu küçük bir kamp, sonra köy, bugün ise küçük şehir boyutunda bir yerleşim olmuştur. Kenti kuran sürekli yerli nüfus yoktur; bugünkü haneler burada tutunmuş göçmen aileleridir.',
    'Eryndorn’un döneminde şehir statüsüne ulaşması, görünüşünü düzenli bir kent yapmadı. Barakalar, yamalı çatılar ve tek kişinin geçebildiği tahta aralıklar kıyıya yayılır. Bir kayıtta şehir sayılan yere bakan ziyaretçi, “şehir olduğuna dair kanıt” arayabilir.',
  ] },
  { title: 'Kâğıtta şehir, gündelik hayatta baraka', paragraphs: [
    'Kaldmere’de kamu altyapısı yoktur. Düzenli su hattı, kanalizasyon, şehir yolu veya kraliyet muhafızı işlemez; krallığın otoritesi fiilen yoktur. Küçük liman, hanelerin kendilerinin tuttuğu basit bir yanaşma alanıdır. Az sayıda tüccar uğrar; çoğu yükünü daha güçlü pazarların kıyısına götürür.',
    'İnsanlar ortak kuyu açmaya, su taşımaya, barakayı sağlamlaştırmaya veya komşusuyla yemek paylaşmaya çalışır. Bu emek devlet hizmeti değildir. Bir grubun yardımı sona erdiğinde yerine düzenli bir kurum gelmez; yangın veya hastalık bir mahalle sırasını hızla etkileyebilir.',
  ] },
  { title: 'Farklı ocakların dini', paragraphs: [
    'Danstsud’un farklı yörelerinden gelen haneler aynı dua, cenaze ve ev geleneğini taşımamıştır. Bazıları Bakır Ana için eski memleketinden getirdiği küçük levhayı saklar; bazıları yalnızca bir taş, kumaş veya aile sözünü koruyabilir. Şehirde tek ve bütün haneleri temsil eden bir büyük ibadethane yoktur.',
    'Kaldmere’de oluşan Son Lokma geleneğinde, yeni evin ilk sıcak yemeğinden küçük bir pay komşuya götürülür. Bir aile kendi inancıyla bu paya anlam verir, başka bir aile bunu yalnızca karşılıklı yardım sayar. “Son umut” aynı inanca girmekten çok aynı yerde kalabilme çabasını anlatır.',
  ] },
  { title: 'Buz deliği, orman ve geçim', paragraphs: [
    'Balıkçılar deniz buzunda açtıkları deliklerden avlanır; kıyı hareketi ve buzun kırılganlığı bu işi tehlikeli kılar. Yakın orman av hayvanı ve yakacak sağlar. Av, kuru balık, post ve kereste az gelen tüccara verilebilecek mallardır.',
    'Danstsudlu yerleşimcilerin önemli bölümü orman, av ve sert mevsimde stok tutma bilgisini yanında getirmiştir. Bu beceriler, dışarıdan hazırlıksız gelen birinin yaşayacağından daha kolay tutunmalarını sağlar. Her yeni gelen aynı bilgiyi taşımaz; komşudan öğrenmek ve ilk kışı atlatmak belirleyicidir.',
  ] },
  { title: 'Statünün ardından gelmeyen gelişme', paragraphs: [
    'Kül Üzerine Ocak Kanunu, yerleşimin kayda ve statüye girmesine imkân açtı. Sermaye Tevzi Kanunnamesi’nde yazılı yatırım sırası ise burada sürekli işleyen hizmetlere dönüşmedi. Başkent kaydındaki bir unvan ile barakanın önündeki çamur arasında uzun mesafe kaldı.',
    'Şehir boyutuna ulaştıktan sonra çok az gelişme yaşanmıştır. Dranthol’un yeni kalesi ile Kaldmere’in tahtaları yan yana düşünülünce, aynı reformun bölgede ne kadar farklı sonuçlar verdiği görülür.',
  ] },
]

export const drantholSections: Section[] = [
  { title: 'Bin beş yüz kişiden on beş bine', paragraphs: [
    'Dranthol, eski Hardlane halkından yaklaşık 1.500 kişinin yaşadığı küçük bir yerleşim ve minicik garnizon çevresinde büyüdü. Eryndorn Vaeranth’ın iki reformu statü, yerleştirme ve yatırımı buraya taşıdı; göç dalgasıyla toplam nüfus yaklaşık 15.000’e, eski nüfusun on katına ulaştı.',
    'Eski kıyı sokakları birdenbire büyük bir askerî yapı ve yeni gelen çok sayıda haneyle çevrildi. Kiralar, pazar ihtiyacı ve günlük yük miktarı eski yerleşimin ölçeğini aştı; büyüyen nüfus için iş bulmak kalenin inşası kadar hızlı olmadı.',
  ] },
  { title: 'Ocak Kalesi, yeni liman ve Nöbet Işığı', paragraphs: [
    'Küçük garnizonun yerini büyük Ocak Kalesi aldı. Liman ve Nöbet Işığı adlı deniz feneri hızla inşa edildi; depo, kapı ve askerî yanaşma düzeni yeni yatırımla kuruldu. Kale, iskân politikasının görünen imzasıdır.',
    'Kraliyet yatırımı asker, taş ustası, yük taşıyıcısı ve iş arayan aileleri getirdi. İnşaat işi azaldığında aynı hanelerin başka bir geçim bulması gerekti. Yeni bir duvarın arkasında yaşamak, eski büyüme dönemindeki ücretin devam etmesini sağlamadı.',
  ] },
  { title: 'Kişi başına en fazla güvenlik', paragraphs: [
    'Dranthol, Hardlane’de kişi başına en çok güvenliğin düştüğü yerleşimdir. Ocak Muhafızları limanı, kapıları ve kale çevresini daha sık denetler. Frostbay kadar büyük ve eski bir pazar değildir; daha küçük nüfusun yanında güçlü bir garnizon bulunur.',
    'Güvenliğin bedeli kış iaşesi, asker ücretleri, fener yakıtı ve duvar bakımıdır. Bu düzen, kraliyet yatırımına ve sınırlı yerel hizmet gelirlerine bağlıdır. Bütün Hardlane halkına yeni bir düzenli kraliyet vergi sistemi kurulduğu sonucunu doğurmaz.',
  ] },
  { title: 'Giden korsan, giden altın', paragraphs: [
    'Dranthol eskiden korsanların en işlek uğraklarındandı. Yeni kale ve denetimle bu akış azaldı. Korsanlar gemilerini açıkta bırakıp küçük kürekli teknelerle Vyssgard’a giderek işlerini orada görür; buz ve hava uygun olmadığında bu hareket de aksar.',
    'Korsan parasının çekilmesi yalnızca yağmayı azaltmadı; han, tamir, yiyecek, yük ve mal alımını da daralttı. Daha az korsan, daha az ticaret ve daha az altın akışı yarattı. Dranthol bu yüzden güvenliğine rağmen Frostbay kadar gelişememiş, bazı yeni binaları çevreleyen sokaklar köhne kalmıştır.',
  ] },
  { title: 'Eski kıyı ile yeni iskân', paragraphs: [
    'Eski Hardlane haneleri kıyı izlerini, sis saatlerini ve suyun karakterini bilir. Yeni gelenler farklı zanaat ve memleket gelenekleri taşır. Pazar dili, ev kiraları ve iş paylaşımı bu iki çevrenin birlikte büyüdüğü yerlerdir.',
    'Ocak Kalesi’nde yazılı düzen daha güçlü uygulanırken doğunun her emri çevrede aynı karşılığı bulmaz. Frostbay’in kâğıt üstü bölgesel bağı, Dranthol’daki kraliyet garnizonunun günlük emir zincirinin tamamı değildir. Şehir, merkezî gücün bölge içindeki sınırlı ama belirgin istisnasıdır.',
  ] },
  { title: 'Kıyı yolu ve deniz riski', paragraphs: [
    'Ternhaven’e doğru Soluk Su, kıyıya sürükleyen rüzgâr ve sisle zorlaşır. Güneyde Ayaz Yutan’dan sonra donmuş deniz kuşağı başlar. Büyük fener bu tehlikeyi azaltır; suyun ve buzun bütün davranışını değiştirmez.',
    'Kemiğe Basan Yol şehri öteki kıyı yerleşimleri ve Marhalden’e bağlar. Uzun ve güvensiz gayriresmî hat, eksik Cevher Çizgisi’nin sağlayacağı düzenli yük akışını karşılayamamıştır.',
  ] },
]

export const vyssgardSections: Section[] = [
  { title: 'Eski kentin çetelerin eline geçişi', paragraphs: [
    'Vyssgard bir zamanlar önemli bir Hardlane kentiydi. Önce göçmen, sonra mülteci dalgaları geldi; ardından korsanlar, kaçakçılar ve aranan kişiler bölgenin boşluğuna yerleşti. Bugün sıradan köylünün çok az kaldığı, insanların çoğunun bir çetenin payı, borcu veya zorlaması çevresinde yaşadığı tehlikeli bir yerleşimdir.',
    'Bu değişimin sorumluluğu bütün göçmenlere yüklenmez. Kraliyet idaresinin işlememesi ve şiddet kullanabilen örgütlerin rıhtım, depo ve barınakları ele geçirmesi, kimin gerçekten yetki taşıdığını değiştirdi. Kaçan aile ile bu boşluktan güç alan kişi aynı konumda değildir.',
  ] },
  { title: 'Beş İskele ve zorla kurulan otorite', paragraphs: [
    'Kanca Rıhtımı, Kör Fener, Kırık Örs, Yaslı Halat ve Kül Deposu diye anılan beş güç odağı, kentte alan ve gelir paylaşır. Beş İskele Sözleşmesi, birbirlerinin malını, tahsilatını ve güvenli ticaret saatlerini nasıl tanıyacaklarını belirler.',
    'Bu sözleşme bir kraliyet hukuku değildir. Kuralları çeteler uygular; geçim için orada bulunan sivil insanlar da bunlara uymaya zorlanır. Birinin “kanundan kaçtığı” yerde başka bir gücün defterine, borcuna ve cezasına girmesi mümkündür.',
  ] },
  { title: 'Açık gemiler ve kürekli gelenler', paragraphs: [
    'Dranthol’un denetiminden çekilen korsanlar gemilerini açıkta bırakıp kürekli teknelerle Vyssgard’a ulaşır. Yaklaşan her küçük tekne aynı büyük gemiye veya aynı çeteye bağlı değildir; rıhtım hakkı ve mal payı pazarlıkla belirlenir.',
    'Ticaretin yanında gemi tamiri, yiyecek, yatak, yük taşıma ve bilgi satışı geçim oluşturur. Buz, sis ve açıkta bekleyen gemiye dönme zorunluluğu bu ekonomiyi kırılgan tutar. Bir rıhtımı kontrol etmek, denizin kendisini yönetmek değildir.',
  ] },
  { title: 'Normal hayatın daralan yeri', paragraphs: [
    'Aileler, borç içindeki işçiler ve kalmak zorunda olan hizmetliler suç örgütlerinin arasında yaşar. Bir fırın, yük deposu veya tamir tezgâhı ayakta kalmak için pay vermek zorunda olabilir. Çete kuralları büyük güçlerin ticaretini korurken zayıf kişinin aynı korumaya ulaşmasını sağlamaz.',
    'Gece kimin kapısında uyunacağı, hangi sokaktan geçileceği ve borcun kime yazıldığı gündelik hayatın sorularıdır. Kentteki otorite boşluğu bütünüyle kuralsızlık üretmemiştir; kurallar en çok onları uygulatacak gücü olanların işine göre yapılmıştır.',
  ] },
]

export const ternhavenSections: Section[] = [
  { title: 'Rydorn’un sıcak su kıyısı', paragraphs: [
    'Ternhaven, Rydorn Sırtı’ndan gelen sıcak suların oluşturduğu küçük, ılıman ve daha yaşanabilir bir Hardlane şehridir. Sıcaklığın en belirgin olduğu dere ve kıyı kesimleri çevresinde evler, küçük bostanlar ve çalışma alanları vardır; bütün bölge aynı derecede sıcak değildir.',
    'Eski Hardlane halkı ve kültürü burada baskındır. Öteki şehirlere göre göçmen, mülteci ve suçlu akışı daha azdır. Bu göreli sakinlik, Ternhaven’in gündelik işlerini aynı hanelerin uzun süre birlikte yürütmesine imkân verir.',
  ] },
  { title: 'Az eken, az biçen şehir', paragraphs: [
    'Şehir az eker, az biçer; korunaklı tarla, balık, hayvan, av ve kıyı ticareti birlikte yaşamasını sağlar. Kendi temel ihtiyacını karşılayabilir. Sıcak su çevresinde büyüyen küçük ürün fazlası, büyük bir tahıl ihracatına dönüşmez.',
    'Sıcak Saz Avluları diye anılan ortak kurutma yerlerinde balık ve ot hazırlanır. Düşük mevsimde haneler iş ve yakıt paylaşır. Yeterli stok tutmak, ılıman suya sahip olmaktan ayrı bir emektir.',
  ] },
  { title: 'Reformların ulaştığı kıyı', paragraphs: [
    'Kül Üzerine Ocak Kanunu ve Sermaye Tevzi Kanunnamesi Ternhaven’e daha yaşanabilir bir düzen getirdi. Yerel onarımlar, küçük iskele ve ürün depolama olanakları, şehrin mevcut topluluk ağının üzerine eklendi. Kentin bütün kültürü yeni gelen devlet görevlileri tarafından kurulmuş değildir.',
    'İdari kaydı Frostbay’e bağlıdır; yerel hanelerin birlikte yürüttüğü işlerle sınırlı kraliyet yatırımı aynı alanda bulunur. Ternhaven’in düzeni, Hardlane’in bütün kıyısında aynı kapasitenin var olduğunu göstermez.',
  ] },
  { title: 'Hayata geçmeyen Cevher Çizgisi', paragraphs: [
    'Marhalden ile kurulması beklenen Cevher Çizgisi, Ternhaven için büyük bir fırsattı. Daha düzenli bir yol, maden şehrinin ürününü kıyıya ve kıyının yiyeceğini geçide taşıyabilirdi. Proje hiçbir zaman hayata geçmedi.',
    'Marhalden’in mülteci girişini kapatması, Vyssgard’daki suç düzeni ve başkentteki iaşe ile idare karışıklıkları işin sürdürülmesini engelledi. Kıyıdaki ihtiyaç sürerken ödeneklerin, ustaların ve bakım sorumluluğunun birbirini beklemesi projeyi kâğıtta bıraktı.',
  ] },
  { title: 'Kemiğe Basan Yolun uzun bedeli', paragraphs: [
    'Gayriresmî Kemiğe Basan Yol, Ternhaven, Dranthol, Frostbay ve Marhalden’i birbirine bağlar. Hattın aşırı uzunluğu, değişen mevsim parçaları ve güvenlik eksikliği düzenli ticaret için büyük engeldir. Bir ürün yola çıktığında teslim edilebilecek miktarı yolun kendisi azaltabilir.',
    'Ternhaven kıyıyla ticaretini sürdürür; fakat eksik yol, Hardlane’in daha farklı bir geleceğine açılabilecek fırsatın kaybıdır. Eski kıyı haneleri bugün hâlâ yollarına, stoklarına ve birbirlerini tanımalarına dayanarak yaşar.',
  ] },
]

export const hardlaneArticles: LoreArticle[] = [
  {
    id: 'hardlane-kulturu', name: 'Hardlane Kültürü', kind: 'culture', region: 'danstsud',
    subtitle: 'Ocak hatırı, eski kıyı haneleri ve ikinci dumanlar', mapLocation: 'hardlane',
    summary: 'Eski Hardlane kıyı kültürü, sıcak bir ocaktan çok birlikte tutulan kışlık emeğe dayanır. Göç ve sığınma dalgaları bu alışkanlıkları farklı biçimlerde değiştirir; Ternhaven, Kaldmere ve Vyssgard aynı kültürel sonucu yaşamaz.',
    sources: hardlaneSources, aliases: ['Ocak Hatırı', 'İkinci Duman', 'Hardlane halkı'],
    related: ['hardlane', 'ternhaven', 'kaldmere', 'frostbay', 'vyssgard', 'kemige-basan-yol'],
    sections: [
      { title: 'Ocak, yalnızca ateş değildir', paragraphs: [
        'Hardlane’de ocak, aynı kışı geçirmek için bir araya getirilen yakıt, tuz, yiyecek ve insan emeğini anlatır. Bir hanenin ateşi tükenirken komşusunda odun olması tek başına yetmez; o odunun paylaşılıp paylaşılmayacağı topluluğun güvenini belirler.',
        'Eski kıyı haneleri kendilerine Kıyı Eskileri der. Bu ifade tek bir hanedan veya bütün haneleri yöneten bir reis anlamına gelmez. Birinin ailesinin hangi kıyıda kış tuttuğunu, bir fırtınada kimden yardım gördüğünü anlatan yerel hafızadır.',
      ] },
      { title: 'İlk Tas Hakkı ve Ocak Hatırı', paragraphs: [
        'İlk Tas Hakkı, kapıya sığınan kişiye konuşma ve pazarlık başlamadan önce az miktarda sıcak yiyecek verilmesi geleneğidir. Ocak Hatırı, yardım gören kişinin sonraki uygun zamanda emeğiyle veya malıyla karşılık vermesini bekler. Borç her zaman para değildir; bir çatı onarımı veya bir balık ağı da karşılık olabilir.',
        'Bu gelenekler bütün evlerde aynı kuvvetle uygulanmaz. Açlık, korku ve gelenlerin sayısının artması paylaşımını daraltabilir. Bir çetenin aynı sözleri kullanarak zorunlu pay alması, eski karşılıklı yardımın başka bir güce çevrilmesidir.',
      ] },
      { title: 'İkinci Duman ve yeni komşular', paragraphs: [
        'Sonradan kurulan ocaklar İkinci Duman diye anılır. Yeni gelen bir aile kendi yemek, dua ve iş bilgisini taşır; bunlar eski hanelerin alışkanlığıyla birleşebilir veya ayrı kalabilir. Terim her yerde bir hakaret değildir, fakat dışlama için de kullanılabilir.',
        'Danstsud’un göçmenleriyle Honudlu sığınmacılar aynı geçmişten gelmez. Başka kıtalardan aranan kişiler de bu karışımın içine girer. Hardlane’in kültürü yalnız suçluların kurduğu bir hayat değildir; aynı bölgede kaçak gelir, komşuluk, korku ve gerçek yardım birlikte bulunur.',
      ] },
      { title: 'Dua, yas ve mevsim hafızası', paragraphs: [
        'Bakır Ana’ya dua eden haneler, atalarının denize ilişkin sözlerini de saklayabilir. Bazıları yolculuk öncesi ocağın külünden bir tutamı kapı eşiğine bırakır; anlamı evin yolcuyu hatırlamasıdır. Kaldmere’de kaybedilmiş memleketlerin farklı dua biçimleri yan yana tutulur.',
        'Buz Çatısı Gecesi, ilk kalın donun ardından yakıt ve stokların komşularca yoklandığı gelenektir. Kapı önüne bırakılan küçük kömür işareti yardım isteğini gösterebilir. Denizden dönmeyenler için evin bir kandili boş tutulur; ölümün kesin bilinmediği bir yas da böylece yaşanabilir.',
      ] },
      { title: 'Sofra, iş ve sözlü bilgi', paragraphs: [
        'Kurutulmuş balık, kök çorbası, İnce Yaz Arpası lapası ve av eti temel yiyeceklerdir. Ternhaven sıcak su çevresinde daha fazla taze ürün kullanabilir; Frostbay dış ticaretle daha çeşitli mal görür. Bir sofranın çeşidi, bütün bölgenin bolluk içinde olduğu anlamına gelmez.',
        'Sis, buz ve otlak bilgisi kısa sözlerle aktarılır: “Buzun rengi bir adım, sesi iki adım söyler.” Bu söz yeterli deneyimin yerine geçmez; yaşlıların gözlemlerini hatırlatır. Kış türkülerinde kahramanlıktan çok dönmek, yük bırakmak ve kimin kapısının açıldığı anlatılır.',
      ] },
      { title: 'Aynı bölgenin farklı düzenleri', paragraphs: [
        'Ternhaven’de eski hanelerin sürekliliği güçlüdür. Kaldmere’de yeni komşuluklar henüz kurulmaktadır. Frostbay eski binaların çevresinde karışık ve büyük bir pazar yaşar; Dranthol’da kraliyet askerinin yazılı düzeni daha görünürdür.',
        'Vyssgard’ın çeteleri liman payını ve zorla alınan borcu aynı ocak diliyle haklı göstermeye çalışabilir. Bu benzerlik, onların kurallarını bütün Hardlane’in geleneği yapmaz. Bölgeye bakarken bir şehrin şiddetiyle diğer şehrin komşuluğu arasındaki fark korunur.',
      ] },
    ],
  },
  {
    id: 'hardlane-otlak-hayvanlari', name: 'Hardlane Otlak Hayvanları', kind: 'fauna', region: 'danstsud',
    subtitle: 'Don kabuğunun altındaki otlara ulaşan üç tür', mapLocation: 'frostbay',
    summary: 'Tervan, Norruk ve Velkir, Hardlane’in az sayıdaki otlağında ve kıyı sazlıklarında beslenir. İnce don örtüsünü kırabilirler; kış boyunca sınırsız yem yaratmaz, derin deniz buzunu aşacak hayvanlar değildirler.',
    sources: hardlaneSources, aliases: ['Tervan', 'Norruk', 'Velkir', 'donmuş otlak'],
    related: ['frostbay', 'ternhaven', 'kaldmere', 'karlan-canlilari', 'hardlane-kulturu'],
    sections: [
      { title: 'Kırağı Boynuzlu Tervan', paragraphs: [
        'Tervan, gövdesi yaklaşık bir buçuk metre uzunluğunda, kalın boyunlu bir otçuldur. Kül beyazı alt yünü üstünde gri kahverengi uzun kıllar bulunur; alın üzerindeki boynuz uçları yassılaşarak bir kar sıyırma yüzeyi oluşturur. Erkek ve dişinin boynuz biçimi farklıdır; genç hayvanın uçları henüz geniş değildir.',
        'Ön tırnaklarının sert kenarı ince don kabuğunu vurup gevşetir, yassı boynuzuyla kırıkları yana iter. Altta kalmış Camotu, kuru ot ve likene ulaşır. Kalın, uzun süre donmuş zeminde aynı işi yapamaz; sürü daha korunaklı yamaç ve rüzgârla açılmış otlak arar.',
        'Sürü küçük gruplar halinde hareket eder, ilkbaharda az sayıda yavru doğurur. Yerel haneler süt, yün ve sınırlı yük için evcilleşmiş sürüler tutar. Kışlık yem ihtiyacı devam eder. Bir Tervan sürüsü, küçük bir Frostbay otlağının bütün insanları doyurabileceği anlamına gelmez.',
      ] },
      { title: 'Kütburunlu Norruk', paragraphs: [
        'Norruk kısa bacaklı, ağır gövdeli ve omuzları kalın bir hayvandır. Koyu tarçın rengi kıl örtüsünün altında sık yağ tabakası bulunur. Burun ucundaki geniş, keratinleşmiş yüzey bir küçük kürek gibi sertleşmiştir; ön ayakların iki dış tırnağı toprağı eşeler.',
        'Gevşemiş don ve ince buzun altında saz kökü, yumru ve bitki artığı arar. Bostana girdiğinde depolanacak köklerin bir bölümünü çıkarıp mahvedebilir; bu yüzden çit ve gözetim gerekir. Gözleri küçük olsa da koku duyusu güçlüdür. Bütün kış kayayı veya derin donmuş zemini kolayca kazmaz.',
        'Dişiler yavrularını kuru çalı ve kıyı tortusundan yapılmış bir yuvada saklar. Yuvaya yaklaşan birine aniden saldırabilir. Haneler et ve dayanıklı deri için besler; hayvanın yemini tamamlamak gerektiğinden bir sürü edinmek yoksul aile için kendiliğinden ucuz bir çözüm değildir.',
      ] },
      { title: 'Saztırnaklı Velkir', paragraphs: [
        'Velkir ince bacaklı, uzun yüzlü, küçük boynuzları geriye kıvrılan bir kıyı otçuludur. Sırtı soluk duman rengi, göğsü koyu kahverengidir. Genişçe açılan tırnakları ıslak sazlıkta yükü dağıtır; sert ön kenarla bitkinin üzerinde oluşmuş ince buz halkasını kırabilir.',
        'Don Sazı, kıyı otları ve kıştan kalmış gövdelerle beslenir. Ternhaven’in sıcak su çevresinde daha uzun süre besin bulur; Frostbay’in rüzgârla açılan küçük otlaklarında da görülebilir. Tuzlu suyun kendisini içerek beslenmez; tatlı su veya uygun düşük tuzluluklu kaynak gerekir.',
        'Özellikle sessiz, küçük sürülerde yaşar. Tetikte kaldığında kulaklarını birbirinden farklı yöne çevirir, korktuğunda kıyı boyunca ani sıçrayışlarla uzaklaşır. Yerel çobanlar yün ve sınırlı süt için besler. Yavruların soğuk rüzgârdan korunması ve otlağın aşırı tüketilmemesi sürüyü sürdürmek için gereklidir.',
      ] },
      { title: 'Otlağın sınırı', paragraphs: [
        'Bu türler donun altındaki eski bitkiyi çıkarır; kışın karanlık ve soğuk içinde sürekli yeni çim üretilmez. Yazın kuru yem hazırlamak, sürüyü küçültmek veya dışarıdan yem almak bölgenin hayvancılık kararlarıdır.',
        'Tervan ve Velkir’in küçük otlaklarda birlikte tutulması bitki çeşitliliğini azaltabilir. Norruk’un kök çıkarması zemini açar, fakat fazla eşeleme sonraki yazı da zayıflatır. Canlının yeteneği ile toprağın taşıyabileceği hayvan sayısı aynı şey değildir.',
      ] },
    ],
  },
]
