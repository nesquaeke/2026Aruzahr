import type { LoreArticle, RegionId, Section } from './data'
import type { MapFeature } from './map-features'

type Landmark = {
  id: string; name: string; kind: MapFeature['kind']; region: RegionId;
  x: number; y: number; summary: string; fact: string;
  related: string[]; sections: Section[]; aliases?: string[]; article?: string;
  source: 'label' | 'author' | 'drawing';
}
const sourceLabels = {
  label: '9 Ekim 2026 · özgün 8K haritada yazısı ve çizimi doğrulanan yer',
  author: 'Yazarın coğrafya kararları · harita üzerindeki yaklaşık alan işareti',
  drawing: '9 Ekim 2026 · özgün 8K haritadaki etiketsiz yapıya verilen açıklayıcı atlas adı',
}
// These anchors point to visible water, terrain or structures. An unlabelled
// drawing receives a descriptive atlas name, never an invented source quotation.
const landmarks: Landmark[] = [
  {
    id: 'aldara-nehri', name: 'Aldara · Doğu Kolu', kind: 'river', region: 'danstsud', x: 5420, y: 4510,
    source: 'label', aliases: ['Aldara Nehri', 'Doğu Aldara'], related: ['marhalden', 'valdareth', 'frostmere-golu', 'karlan-daglari'],
    summary: 'Marhalden Dağı’nın buzul kaynak alanından doğan Aldara iki kola ayrılır. Doğu kolu Valdareth ovasını, batı kolu Frostmere’i besler.', fact: 'Buzul kaynağı · iki kol',
    sections: [
      { title: 'Aynı buzdan iki ayrı hayat', paragraphs: ['Aldara’nın iki kolu ortak buzul kaynak alanıyla ilişkilidir. Doğu Aldara’nın ovaya ulaşan suyu, başkentin çevresindeki tarlaları ve kıyı yerleşimlerini besler. Batı Aldara Marhalden’den geçerek Frostmere’e dökülür; göl yılın yaklaşık yarısında donar.'] },
      { title: 'Ova ile geçit arasında', paragraphs: ['Marhalden’de nehrin iki kıyısı ayrı kale yerleşimleriyle tutulur. Aşağı ovada aynı su değirmen, sulama ve yük işlerinin parçasıdır. Bir çiftçinin beklediği su ile bir geçit muhafızının gözlediği akış, aynı dağın iki farklı gündelik hesabıdır.'] },
    ],
  },
  {
    id: 'bati-aldara', name: 'Batı Aldara', kind: 'river', region: 'danstsud', x: 4600, y: 4800,
    source: 'author', article: 'aldara-nehri', related: ['marhalden', 'frostmere-golu'],
    summary: 'Aldara’nın Marhalden’den Frostmere’e ulaşan batı kolu. Buzul kaynağını doğu koluyla paylaşır.', fact: 'Marhalden → Frostmere',
    sections: [],
  },
  {
    id: 'serenith-nehri', name: 'Serenith Nehri', kind: 'river', region: 'danstsud', x: 7020, y: 4160,
    source: 'label', aliases: ['Serenth', 'Serenth Nehri'], related: ['valdareth', 'oren', 'melthir', 'teyra-nehri'],
    summary: 'Valdareth ovasını besleyen üç nehirden biri. Özgün haritada Serenth yazımıyla gösterilen su, burada yazarın Serenith adıyla yer alır.', fact: 'Verimli ova · kıyı yerleşimleri',
    sections: [
      { title: 'Kıyının çalışma saati', paragraphs: ['Serenith kıyısındaki gün, yükün ne zaman karşıya geçirilebileceğine göre düzenlenir. Tekneler, köprüler ve tarlalar aynı suyu farklı amaçlarla kullanır; bir yükçünün kısa yol isteği, çiftçinin sulama düzeniyle her zaman örtüşmez.'] },
      { title: 'Haritadaki iki yazım', paragraphs: ['Serenith, yazarın kullandığı addır; haritadaki Serenth ayrı bir nehir olarak sayılmaz. Atlas iki yazımı da aramada tanır ve aynı suyun kaydını açar.'] },
    ],
  },
  {
    id: 'teyra-nehri', name: 'Teyra Nehri', kind: 'river', region: 'danstsud', x: 7040, y: 4780,
    source: 'label', related: ['elorwyn', 'theramis', 'runeth', 'eroth', 'valdareth'],
    summary: 'Elorwyn ile Theramis çevresinde izlenen Teyra, Valdareth ovasının verimli su düzeninin parçasıdır.', fact: 'Köprüler · değirmenler · tarım',
    sections: [
      { title: 'İki şehrin arasındaki su', paragraphs: ['Teyra’nın haritadaki hattı, Elorwyn’in çevresiyle Theramis’in batı kıyısını birbirine yaklaştırır. Köprüye gelen bir yükün yalnız nereden geldiği değil, ne kadar beklediği de önemlidir; yaş tahıl ile kuru taş aynı aceleyle taşınmaz.'] },
      { title: 'Suyun küçük payları', paragraphs: ['Nehir kıyısında değirmen, balıkçı ve tarla aynı mevsime ayrı gözlerle bakar. Teyra tarakbalığının çamurlu sığlıkları, büyük şehirlerin arasındaki bu suyu yalnız bir taşıma çizgisi olmaktan çıkarır.'] },
    ],
  },
  {
    id: 'thural-kalkani', name: 'Thural Kalkanı', kind: 'landmark', region: 'danstsud', x: 6750, y: 3460,
    source: 'label', related: ['dorvenhall', 'dorvenhall-sinir-koruculari'],
    summary: 'Dorvenhall’ın güney yaklaşımında uzanan, haritada adı görülen savunma hattı. Ayrı bir şehir olarak sayılmaz.', fact: 'Dorvenhall · savunma hattı',
    sections: [
      { title: 'Duvarın karşısında bekleyenler', paragraphs: ['Thural Kalkanı’nın çizimi, Dorvenhall’ın yüksek yerleşimini aşağı yaklaşımından ayıran kapı ve surları gösterir. Yük arabaları burada hızını düşürür; dağdan gelen korucu ile maden taşıyan işçi aynı eşiği farklı yorgunluklarla geçer.'] },
      { title: 'Şehir ile sırt arasındaki eşik', paragraphs: ['Bu kaydın kapsamı haritada görülen savunma yapısıdır. Dorvenhall korucularının açık sırtlardaki görevi ile kapı nöbeti birbirini tamamlar; bir surun güçlü olması, uzaktaki patikayı kendiliğinden güvenli kılmaz.'] },
    ],
  },
  {
    id: 'karlan-daglari', name: 'Karlan Dağları', kind: 'ridge', region: 'danstsud', x: 4700, y: 4550,
    source: 'author', related: ['marhalden', 'aldara-nehri', 'frostmere-golu'],
    summary: 'Hardlane’i Manorveil ve Lowvale’den ayıran sarp dağ sırası. Marhalden bilinen güvenilir geçişin anahtarıdır.', fact: 'Dağ sırası · Marhalden geçidi', sections: [],
  },
  {
    id: 'valdareth-ovasi', name: 'Valdareth Ovası', kind: 'landmark', region: 'danstsud', x: 6800, y: 4320,
    source: 'author', related: ['valdareth', 'uldar', 'theld', 'aldara-nehri', 'serenith-nehri', 'teyra-nehri'],
    summary: 'Aldara, Serenith ve Teyra’nın beslediği geniş tarım arazileri. Tarlalar ve yel değirmenleri başkentin dış surlarının çok ötesine uzanır.', fact: 'Üç nehir · tahıl · yel değirmenleri',
    sections: [
      { title: 'Beş surun dışındaki şehir', paragraphs: ['Valdareth’in en dış mahalleleri köy görünümünü taşır; şehir büyüdükçe tarlalar daha uzakta devam eder. Ovanın ürünleri başkentin yüksek nüfusunu besler. Değirmenin döndüğü gün, fırının ertesi sabah ne kadar ekmek çıkarabileceğinin de hesabıdır.'] },
      { title: 'Ekmek başkente nasıl varır?', paragraphs: ['Hasat bir arabaya yüklendiğinde iş bitmez. Kurutma, depolama, tartı ve kapı geçişi ürünün kent sofrasına ulaşmasını belirler. Bereketli ova, taşımayı ve ambar işini gereksiz kılmaz; yağışlı bir haftanın zararı bazen tarlada değil yol üstünde ortaya çıkar.'] },
    ],
  },
  {
    id: 'lakbar-kara-kule', name: 'Lakbar Kara Kulesi', kind: 'landmark', region: 'lakbar', x: 4020, y: 900,
    source: 'drawing', related: ['lakbar'], summary: 'Lakbar’ın iç volkan alanındaki yüksek koyu kule. Özgün çizimde etiketi bulunmayan yapının atlas adıdır.', fact: 'Etiketsiz çizim · açıklayıcı atlas adı',
    sections: [{ title: 'Alevin üzerindeki siluet', paragraphs: ['Koyu kule, lavın aydınlattığı kayaların üzerinde ince ve yüksek bir siluet oluşturur. Haritadaki güçlü biçimi yerini ayırt etmeye yarar; bu kayıt kuleyi bir kişiye, tarikata veya gizli göreve bağlamaz.'] }, { title: 'Yaklaşımı okumak', paragraphs: ['Lakbar’ın sıcak denizi ile volkanik zeminini birbirine karıştırmak yolcuyu yanıltır. Kulenin uzaktan görünmesi güvenli bir yaklaşım olduğu anlamına gelmez; ada ustalarının yerel yol bilgisi burada önem kazanır.'] }],
  },
  {
    id: 'lakbar-lav-kalesi', name: 'Lakbar Lav Kalesi', kind: 'landmark', region: 'lakbar', x: 4695, y: 1310,
    source: 'drawing', related: ['lakbar', 'lakbar-kara-kule'], summary: 'Lakbar’ın doğu tarafında lavla çevrili dairesel sur yapısı. Açıklayıcı adı atlas için verilmiştir.', fact: 'Dairesel sur · volkan kıyısı',
    sections: [{ title: 'Yuvarlak surun içi', paragraphs: ['Harita, bu yapıyı çevresi kulelerle tutulan yuvarlak bir kale olarak çizer. Sıcak kaya ve lav, yapının gündelik bakımını sıradan bir kıyı kalesinden farklı kılar; sağlam taş kadar ona ne zaman dokunulabileceği de önemlidir.'] }, { title: 'Bilinen ile anlatılan', paragraphs: ['Yapının kesin kuruluş tarihi ve yönetimi kamu kaynaklarında belirlenmiş değildir. Lav Kalesi adı görseli bulabilmek için kullanılır; bir savaşın sonucu veya bir hanedanın mülkü olarak sunulmaz.'] }],
  },
  {
    id: 'lakbar-kizil-igne', name: 'Lakbar Kızıl İğne', kind: 'landmark', region: 'lakbar', x: 4347, y: 1620,
    source: 'drawing', related: ['lakbar', 'lakbar-lav-kalesi'], summary: 'Volkan adalarının güneyindeki ince kırmızı kule. İğne biçimindeki çizim atlas adını belirler.', fact: 'Kırmızı kule · açıklayıcı atlas adı',
    sections: [{ title: 'Sivri çatının işareti', paragraphs: ['Kızıl İğne, kıyı çiziminin üstünde dar bir dikey işaret gibi yükselir. Haritayı okuyan biri için çevresindeki yuvarlak kaleden kolayca ayrılır; aynı renkteki kayalar arasında yapının yüksekliği yön bulmaya yardım eder.'] }, { title: 'Kıyı bilgisinin değeri', paragraphs: ['Lakbar’da deniz yalnız bir ulaşım boşluğu değildir; sıcaklık, gaz ve kayalıklar yaklaşımı belirler. Bir kulenin görünürlüğü ile rıhtımın kullanılabilirliği ayrı bilgidir.'] }],
  },
  {
    id: 'lakbar-bati-burclari', name: 'Lakbar Batı Burçları', kind: 'landmark', region: 'lakbar', x: 3846, y: 1827,
    source: 'drawing', related: ['lakbar', 'lakbar-kizil-igne'], summary: 'Lakbar’ın batı kıyısında açık denize bakan kırmızı çatılı kale kümesi.', fact: 'Batı kıyısı · etiketsiz kale çizimi',
    sections: [{ title: 'Denize bakan taş', paragraphs: ['Batı Burçları, haritada deniz kıyısına oturan çok çatılı bir yapı olarak görünür. Lav çizgilerinin arasından açık suya bakan bu konum, Lakbar’ın bütünüyle tek bir ateş alanından oluşmadığını hatırlatır.'] }, { title: 'Atlas adı', paragraphs: ['Batı Burçları yapının yönünü ve biçimini anlatan yeni bir atlas adıdır. Kamu kaynakları kimin oturduğunu söylemediği için bu kayıt bir lord veya askerî komuta atamaz.'] }],
  },
  {
    id: 'lakbar-guney-kalesi', name: 'Lakbar Güney Kalesi', kind: 'landmark', region: 'lakbar', x: 4410, y: 1933,
    source: 'drawing', related: ['lakbar', 'kraenfall'], summary: 'Lakbar’ın güney kıyısındaki kırmızı çatılı kale. Gurbin yönündeki sulara bakar.', fact: 'Güney kıyısı · açıklayıcı atlas adı',
    sections: [{ title: 'İki kıyının arasındaki bakış', paragraphs: ['Güney Kalesi’nin haritadaki yeri, Lakbar ile Gurbin çevresindeki deniz alanlarını aynı bakışta bulmaya yardım eder. İki kıyının birbirini görebilmesi aralarında kolay bir geçiş olduğu anlamına gelmez.'] }, { title: 'Çizimde kalan bilgi', paragraphs: ['Çatı ve burçlar haritada belirgindir; kuruluş tarihi ve yaşayan kadro henüz kaynaklarla belirlenmemiştir. Bu açık sınır, çizimde görülen yapıyı keşfedilebilir kılarken onu hazır bir görev sırrına dönüştürmez.'] }],
  },
  {
    id: 'thessar-acigi-feneri', name: 'Thessar Açığı Feneri', kind: 'landmark', region: 'danstsud', x: 3520, y: 3610,
    source: 'drawing', related: ['thessar', 'aelmar', 'lirendil'], summary: 'Thessar’ın açığında, özgün haritada ayrı çizilmiş büyük deniz feneri. Yerinin açıklayıcı adıyla açılır.', fact: 'Açık deniz yapısı · kıyı işareti',
    sections: [{ title: 'Kıyının dışındaki ışık', paragraphs: ['Bu büyük fener kıyıdaki evlerden ayrı, suyun içinde yükselir. Haritada yerinin seçilmesi deniz yaklaşımını okunur kılar; bir gemici için limanın görülmesi ile güvenle yaklaşılabilecek yönün bilinmesi ayrı işlerdir.'] }, { title: 'Fener ile başkent ayrımı', paragraphs: ['Thessar Açığı Feneri, Valdareth’in eski İlk Işık feneri değildir. Atlas adı haritadaki konumu açıklar; yapının yapım tarihi ve bakıcısı henüz kaynakta adlandırılmamıştır.'] }],
  },
  {
    id: 'runeth-kuzeyi-harabeleri', name: 'Runeth Kuzeyi Harabeleri', kind: 'landmark', region: 'danstsud', x: 7340, y: 4400,
    source: 'drawing', related: ['runeth', 'oren', 'halden', 'teyra-nehri'], summary: 'Runeth’in kuzeyinde, tarlalar arasında görülen yıkık taş yapı. Açıklayıcı atlas adıyla işaretlenir.', fact: 'Yıkık taş · tarım ovası',
    sections: [{ title: 'Tarlanın ortasındaki eski eşik', paragraphs: ['Yıkık duvarlar, sağlam çiftlik evlerinin ve işlenen toprağın arasında kalır. Haritadaki biçim geçmiş bir yapılaşmayı gösterir; bugünkü yerleşim hayatı bu taşların çevresinden devam eder.'] }, { title: 'Harabe bir cevap değildir', paragraphs: ['Kimin yaptırdığı, ne zaman yıkıldığı ve hangi eski işleve sahip olduğu kamu kaynağında açıklanmış değildir. Bu kayıt görünen taşları konumlandırır; kalıntıya kesin bir felaket tarihi veya gizli yeraltı girişi eklemez.'] }],
  },
]

export const mappedLandmarkPixels = landmarks.map(({ id, name, x, y, source }) => ({ id, name, x, y, source }))
export const mappedLandmarks: MapFeature[] = landmarks.map(({ id, name, kind, region, x, y, summary, fact, aliases, article }) => {
  const point: [number, number] = [x / 8192, y / 5668]
  return { id, name, kind, region, point, box: [Math.max(0, point[0] - .07), Math.max(0, point[1] - .07), .14, .14], article: article || id, summary, fact, aliases }
})
export const mappedLandmarkArticles: LoreArticle[] = landmarks
  .filter(landmark => landmark.sections.length > 0 && !landmark.article)
  .map(({ id, name, region, summary, fact, related, sections, aliases, source }) => ({
    id, name, kind: 'geography', region, summary, subtitle: fact, mapLocation: id, related, sections, aliases,
    sources: ['Aruzahr 8k (1).jpg', sourceLabels[source], '9 Ekim 2026 · yeni kamusal gündelik yaşam yazımı'],
  }))
