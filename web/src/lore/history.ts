import type { Section } from '../data'

// Public readings of Valhunar.pdf, pages 1–7 and 9–11. Campaign revelations,
// secret locations and the author's game-master notes are deliberately excluded.
export const historyArticle = {
  id: 'buyuk-kirilma', name: 'Büyük Kırılma', subtitle: 'Ateşin, ışığın ve kaybolan bir çağın hikâyesi',
  quote: 'Bizi buz değil, iki büyük çocuğun kavgası öldürdü.',
  summary: 'Bir zamanlar aynı imparatorluğun halkları olan topluluklar, bugün parçalanmış kıyılarda farklı adlar ve inançlarla yaşar. Büyük Kırılma; yanan göğün, kırılan büyünün, yeni yaratıkların ve değişen iklimin ortak adıdır. Felaketin hatırası aynı kalır; suçun ve kurtuluşun kime ait olduğu ise anlatıcıya göre değişir.',
  sources: ['Valhunar.pdf · s. 1–7, 9–11 · halka açık tarih, destan ve kültürel anlatılar'],
  sections: [
    { title: 'Kırılmadan önce: Ejderha İmparatorluğu', paragraphs: [
      'Kadim Valhunnar İmparatorluğu, eski anlatılarda Ejderha İmparatorluğu diye de anılır. Bugün birbirini yabancı sayan halklar, o çağın yollarını, limanlarını ve ortak düzenini paylaşmıştır. İmparatorluğun hatırası yalnızca bir hükümdar listesi değildir: parçalanmadan önce başka türlü bir dünyanın mümkün olduğunu söyler.',
      'Başlıca iki figür, Kral Halendar ile Kraliçe Yarethus’tur. Onları anlatan metinler birbiriyle bütünüyle uyuşmaz. Halkın koruyucuları olarak başlayan hikâyeleri, aynı halkın korktuğu kudretlere dönüşür. Bir kahramanlık destanında övgü olan nitelik, felaket anlatısında suçlama olabilir.',
    ] },
    { title: 'Halendar: Ateşin Çocuğu', paragraphs: [
      'Halendar’a Kızıl Kral, Alev Baba ve Kömür Efendi denir. Doğumu çevresindeki söylenceler volkanlar, ateş ve fırtınayla doludur. Halkın belleğinde onun kudreti, soğuk sınırları ve dışarıdan gelen tehditleri durdurabilecek kadar büyüktür. Ateş, önce bir korku değil, korunmanın dili olarak görünür.',
      'Aynı kuvvetin denetimden çıkması, sonradan yazılan destanların merkezine yerleşir. Danstsud metinleri kralın ateşini yıkımın başlatıcısı sayar; Honud anlatıcıları yalnızca ona değil, kendini dünyadan büyük gören iki hükümdara birden kızar. Bu yüzden Halendar’ın adı her yerde aynı duyguyla söylenmez.',
    ] },
    { title: 'Yarethus: Kutsalın Kızı', paragraphs: [
      'Yarethus’un adları Bakır Ana, Azize Kraliçe ve Yaraların Efendisi’dir. Işık, şifa ve koruyucu çemberlerle anılır. Kralın yakıcı kuvvetinin karşısında bir denge kurduğu; yaraları iyileştirdiği ve insanları felaketlerden sakındığı anlatılır.',
      'Fakat eski metinlerde merhametin yanında kusursuzlaştırma arzusu da vardır. Her yarayı kapatmak ile her farklılığı silmek arasındaki sınır, onun hikâyesinde giderek bulanıklaşır. Danstsud’da bu gölgeyi hatırlamak kolay değildir; Bakır Ana’ya edilen dua, evleri ve çocukları ateşten koruma isteğiyle yaşar.',
    ] },
    { title: 'Sessiz Binyıl', paragraphs: [
      'Halendar ile Yarethus’un düzeni altında yaşanan uzun barışa Sessiz Binyıl denir. Kaynaklarda bu çağın az anlatılması, hiçbir şey yaşanmadığı anlamına gelmez. Büyük savaşlar yerine gündelik hayatın sürdüğü; insanların koruyucu iki güce güvenmeyi öğrendiği bir dönem olarak hatırlanır.',
      'Batıdan gelen buz yaratıkları, güney sınırlarının akınları ve kuzeydeki ruh fısıltıları, hükümdarların birlikte karşı durduğu tehditler arasında sayılır. Ateş ile kutsalın dengesi, yalnızca saraya değil, sıradan bir hanenin yarın yaşayacağına ilişkin güvene de dayanır. Kırılmanın dehşeti, işte bu güvenin kaybolmasıdır.',
    ] },
    { title: 'Dengenin çatlaması', paragraphs: [
      'Barışın ne zaman bozulduğu kesin bir takvimle anlatılmaz. Destanlar kudretin büyümesini, hükümdarların birbirine güveninin zayıflamasını ve insanları koruma iddiasının onları tehlikeye atmasını aynı dönemin işaretleri sayar. Her anlatı bir suçlu arar; hiçbiri bütün halkların üzerinde anlaştığı bir mahkeme kaydı değildir.',
      'Büyüye ilişkin eski düşüncede kuvvetin bir bedeli vardır: enerji başka bir yerden gelir, beden yorulur, irade tükenebilir. Kırılma bu sınırların unutulduğu bir çağın sonu diye okunur. Bugünkü ruhsat tartışmaları, eğitim kurumları ve kurban ritüellerine yönelik yasaklar, farklı çağlara ait olsa da bu korkunun izlerini taşır.',
    ] },
    { title: 'Son karşılaşma: ateş ve çember', paragraphs: [
      'Felaketin merkezindeki karşılaşma, alevle ışığın birbirine çarpması olarak anlatılır. Bir anlatıda Halendar ateşle karşılık verir; diğerinde Yarethus halkı koruyucu bir çemberin içine alır. Toprak, su ve gök bu çatışmanın dışında kalmaz. Savaş yalnızca iki kuvvetin sınırında değil, insanların yaşadığı dünyanın içinde gerçekleşir.',
      'Sonrasını tek bir açıklamaya sığdırmak güçtür. Kaynaklarda göğün yarılması, denizlerin yanması ve koca kara parçalarının kaybı birlikte görünür. Bu büyüklükte bir yıkımdan dünyanın bir bölümünün yine de sağ çıkmış olması, bazı metinlerde bir mucize; bazı ağıtlarda ise geride kalanların cezasıdır.',
    ] },
    { title: 'I · Ateş Kıyameti — Gök Yarılması', paragraphs: [
      'İlk felaket kızıl gökle başlar. Denizlerin yandığı, lavın yağmur gibi düştüğü ve şehirlerin kül altında kaybolduğu anlatılır. Gökyüzü, koruyan bir tavan olmaktan çıkıp tehlikenin geldiği yere dönüşür. Ateşin Çocuğu’nun adı, bu yüzden kimi halklarda bir hükümdar adı kadar bir uyarıdır.',
      'Destan dili yıkımı mutlak sözcüklerle anlatır; bütün kayıpların sayısını veren ortak bir kayıt yoktur. Bugünün okuyucusu için önemli olan, halkın bir gecede evini, toprağını ve geleceğini aynı anda kaybettiği düşüncesidir. Kül yalnızca yanmış madde değildir: bir önceki hayatın artık geri getirilemeyeceğinin simgesidir.',
    ] },
    { title: 'II · Büyüsel Çürüme — Işığın Kırılması', paragraphs: [
      'İkinci katman, dünyanın büyüyle ilişkisindeki bozulmadır. Eskiden güvenle tekrarlanan uygulamaların beklenmedik sonuçlar vermesi, koruma ve şifanın da korkuyla anılmasına yol açar. Işığın Kırılması adı, yalnızca görünür bir parıltının sönmesini değil, insanlar ile kullandıkları kuvvet arasındaki güvenin kırılmasını anlatır.',
      'Bu hafıza, büyüyü kullanan herkesin aynı derecede tehlikeli olduğu anlamına gelmez. Danstsud’un bugünkü düzeninde ruhsatlı hizmet mümkündür; izinsiz uygulama ve kurban ritüelleri yasaktır. Eski korku ile günlük hayatın şifa, ısı ve araştırma ihtiyacı arasındaki gerilim, büyü hukukunu yaşayan bir mesele yapar.',
    ] },
    { title: 'III · Canavarlar Çağı', paragraphs: [
      'Üçüncü felaketin destanları, dünyanın sınırlarının zayıfladığını ve insanın tanımadığı canlıların ortaya çıktığını söyler. Boşluk Avcıları, Gölge Sürüngenleri, Yanan Yel İnleri ve Buz Çığ Çocukları bu eski korku sözlüğünün adlarıdır. Her isim, bir halkın gördüğü ya da gördüğüne inandığı tehlikeyi kendi diline taşır.',
      'Lakbar adı bazı eski anlatılarda bir dış kuvvetin veya yabancı bir bilincin adı olarak da geçer. Bugünkü volkanik adalar ve orada yaşayan halk ile bu söylenceyi aynı şey saymak doğru bir okuma değildir. Eski destanların dili, bugünkü bir halkın tamamını suçlamak için yeterli bir tarih kaydı oluşturmaz.',
      'Karlan’daki canlıları inceleyen bir doğa araştırmacısı ise başka sorular sorar: ne yerler, hangi yükseltide yaşarlar, yuvaları nerededir? Destanın canavarı ile dağın besin ağı aynı anlatım biçimi değildir. Bir Ulveth’in izini anlamak için Kırılma’ya inanmak zorunlu değildir.',
    ] },
    { title: 'IV · İklim Kırılması', paragraphs: [
      'Dördüncü katman iklimdir. Honud’un donması, büyük çığlar ve insanların doğuya yönelen göçü bu başlıkta anılır. Soğuk yalnızca havanın değişmesi değildir: tarlanın çalışmaması, otlağın kaybolması, bir yolun kapanması ve bütün bir topluluğun başka yerde hayatta kalmak zorunda kalmasıdır.',
      'Honud klanlarının kan, atalar ve dayanıklılıkla kurduğu ilişki, bu hafızayla birlikte yaşar. Bunun tek ve değişmez bir toplum portresi olduğu düşünülmemelidir; bir klanın ağıdıyla diğerinin kutlaması farklı olabilir. Hardlane’in kıyılarına ulaşan göçmenler, bu tarihsel yükün yanında kendi zanaatlarını ve gündelik alışkanlıklarını da taşır.',
    ] },
    { title: 'V · Ağıtlarda kanın bedeli', paragraphs: [
      'Kırılma ağıtlarının bir başka ortak motifi kandır. Yakınını kaybetmek, verilen sözün bedelini taşımak ve şifa için yeniden acı çekmek, ateş ile ışığın ardından anlatılan hikâyelerde yan yana gelir. Kan kimi gelenekte akrabalığı ve sürekliliği, kiminde ödenemeyen bir borcu simgeler.',
      'Bu bölüm bir büyünün nasıl çalıştığını açıklayan kural değildir. Halkın felakete verdiği anlamı gösterir. Bir duanın, bir klan yemininin ve bir yasak ritüelin aynı sözcüğü kullanması, bunların aynı inanç veya uygulama olduğu anlamına gelmez.',
    ] },
    { title: 'Honud anlatısı: Kan Yarıldığında', paragraphs: [
      'Honud’un anlatısı felaketi, koruyan iki büyüğün kavgasının altında kalan halkın gözünden aktarır. Suç yalnızca ateşte değildir; insanların yaşamını kendi kudretlerinden daha küçük gören iki figürde aranır. “Bizi buz değil, iki büyük çocuğun kavgası öldürdü” sözü bu okumanın sert özüdür.',
      'Bu hikâyede kahraman, göğü parçalayan kuvvetten çok karda evini yeniden kuran insandır. Göç, dayanışma ve kaybı unutmamak, saltanatların görkeminden daha kalıcı değerlerdir. Honud’un soğuğu aşan her hanesi, eski hikâyeye kendi cevabını ekler.',
    ] },
    { title: 'Donuk Ana ve Hurnas Ithíl', paragraphs: [
      'Donuk Ana, Honud söylencelerinde çığın ve buzun altında uyuyan bir ana figürüdür. Bazı anlatıcılar uyanışını umut eder; bazıları eski kudretin dönüşünden korkar. Aynı inanç, bir ailede teselli, başka bir ailede uzak durulması gereken bir uyarı olabilir.',
      'Hurnas Ithíl, Donmuş Taç adıyla anılan eski başkentin söylencesidir. Kar altında kalan şehir, yitirilen geçmişin mekâna dönüşmüş hâlidir. Burada adı bir efsane olarak geçer; atlas üzerindeki kesin bir yer veya bütün yolları bilinen bir gezi durağı olarak sunulmaz.',
    ] },
    { title: 'Danstsud anlatısı: Işığın Savaşı', paragraphs: [
      'Danstsud’un Işığın Savaşı anlatısında ağırlık değişir. Halendar’ın ateşi saldırıyı; Yarethus’un çemberi ise halkı koruma iradesini temsil eder. Bakır Ana’nın fedakârlığı, düzenin yıkım karşısındaki son dayanağı olarak okunur. Bu yüzden onun hatırası yalnızca eski sarayın değil, evlerin ve mahallelerin içine yerleşmiştir.',
      '“Bakır Ana, bizi Ateşin Çocuğu’ndan koru” duası, korkunun gündelik dile dönüşmesidir. Bir Honudlu aynı hikâyeyi dinlediğinde iki hükümdarı da sorgulayabilir. Danstsudlu için ise koruma düşüncesinin kendisi değerlidir. Komşu iki halkın aynı geçmişten neden farklı ahlaki sonuçlar çıkardığını bu ayrım gösterir.',
    ] },
    { title: 'Kırılmanın bugünkü dünyası', paragraphs: [
      'Savaş, iklim değişimi, göç ve büyüye karşı güvensizlik, eski imparatorluğun halklarını farklı yönlere taşımıştır. Yeni şehirler kurulmuş, kıyılar başka geçim biçimlerine alışmış, aynı efsane başka dillerde anlatılmıştır. Ortak köken, bugünkü bütün yönetimlerin veya inançların aynı olduğu anlamına gelmez.',
      'Frostbay’deki eski yapılar ve değirmen kalıntıları, Bryndon’u geçmişte daha yaşanabilir bir iklim olup olmadığını araştırmaya yöneltir. Bu gözlem, Kırılma’yla ilgili her iddiayı kanıtlamaz; taşın, toprağın ve halk hafızasının birlikte incelenebileceği bir soru açar. Yaşayan dünya, cevaplardan olduğu kadar iyi sorulardan da oluşur.',
      'Kemiğe Basan Yol üzerindeki bir göçmen, Theramis’te bir kâtip ve Valdareth’te dua eden bir aile, eski felaketi aynı biçimde düşünmeyebilir. Atlas bu farklı sesleri yan yana getirir. Geçmişin ortak olması, onu tek bir sesle okumayı gerektirmez.',
    ] },
    { title: 'Küllerin içinde kalan umut', paragraphs: [
      'Felaket anlatılarının hepsi yalnızca korkuyla bitmez. Bazı sözler ateş ile ışığın birbirini tüketmek yerine yeniden bir denge kurabileceğini düşünür. Bu, gerçekleşeceği kesin bir gelecek kaydı değil, halkların yıkımdan sonra bile koruduğu bir ihtimaldir.',
      'Bir dünyanın onarılması düşüncesi, yalnızca büyük kudretlere ait değildir. Bir hanenin yeniden kurulması, bir yolun açılması, bir balık sürüsünü korumak için maden suyunun ayrılması da bu umudun gündelik karşılıklarıdır. Kırılma eski bir çağın sonudur; yaşayanların hikâyesinin sonu olmak zorunda değildir.',
    ] },
  ] as Section[],
}

export const fractureLayers = [
  { title: 'Ateş Kıyameti', symbol: '✺', detail: 'Kızıl gök, yanan denizler, kül altında şehirler', section: 6 },
  { title: 'Işığın Kırılması', symbol: '✧', detail: 'Büyünün ve şifanın güvenini kaybetmesi', section: 7 },
  { title: 'Canavarlar Çağı', symbol: '◈', detail: 'Eski destanların yabancı canlıları', section: 8 },
  { title: 'İklim Kırılması', symbol: '❄', detail: 'Honud’un donması ve göç yolları', section: 9 },
  { title: 'Kanın Bedeli', symbol: '♦', detail: 'Ağıtlardaki kayıp, soy ve borç motifi', section: 10 },
]
