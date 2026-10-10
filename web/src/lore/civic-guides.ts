import type { Section } from '../data';

export const civicSource = '10 Ekim 2026 · yaşayan ansiklopedi geliştirmesi; kullanıcı kanonu üzerine yeni gündelik yaşam ayrıntıları';
export type CityGuide = { food: string; work: string; order: string; magic: string; season: string; neighbours: string; tension: string };
export const cityGuides: Record<string, CityGuide> = {
  valdareth: {
    food: 'Serenith, Doğu Aldara ve Teyra ovasının tahılı değirmenlerden Yedi Ambar’a, oradan fırınlara gider. Kuyular ve mahalle su taşıyıcıları aynı hizmet düzeyini sunmaz; dış surlarda suyun taşınması hane işidir.',
    work: 'Feneraltı yük taşır; Mor Sır ustaları Dorvenhall mineralini işler. İç sarayın düzenli siparişiyle dış mahalledeki günlük ücret arasında büyük fark vardır. Yeni gelenlerin ilk işi çoğunlukla taşıma, tamir veya mevsimlik hasattır.',
    order: 'Krala doğrudan gelen köy vergisini hazine kaydeder. Teren Halvek sivil hizmetleri, Rickon muhafız işini yürütür; gözaltı hapishane nazırına kayıtla devredilir. Dilekçe, tanık ve teslim alındı belgesi bir mahalle kavgasını saraya götürmeden çözmenin araçlarıdır.',
    magic: 'Geçerli ruhsatla hizmet mümkündür. Sicil kaydı, uygulamanın kapsamını ve sorumlusunu gösterir. İzinsiz büyü ve kurban ritüelleri yasaktır; saraya yakın olmak tek başına ruhsat yerine geçmez.',
    season: 'Taşkın haftalarında araba yolları kesilir. Hasatta depolar dolar; kış öncesi donanmanın tahıl ve kereste alımı sivil fiyatları yükseltebilir. Fener yakıtı ile yoksul hanelerin yakacağı aynı pazarda aranır.',
    neighbours: 'Pilorn, Fehar, Gaalmire, Naeron, Fevric, Theld ve Korhenden’in vergisi doğrudan başkente gelir. Dorvenhall sır minerali, çevre ova yiyecek, Rilorn deniz gücü sağlar. Bu bağlılıklar başkenti büyük, tedarik kesintilerine duyarlı kılar.',
    tension: 'Sabançeper’de bir aile taşkın giderini temizletmek için dilekçe verirken Taçyamaç’ın çatı onarımı daha hızlı tamamlanabilir. Şehrin küçük sorusu şudur: Bir masrafın hangi surun hizmet defterine yazılması gerekir?',
  },
  lirendil: {
    food: 'Çevre yerleşimlerden gelen tahıl, hayvan ve bahçe ürünü pazar üzerinden dağılır. Lonca mutfağı görevden dönenlere düzenli öğün sunar; bütün şehir halkı bu mutfağın hakkına sahip değildir.',
    work: 'Silah bakımı, refakat sözleşmesi, iz sürme ve eğitim birbirini besler. Demirci işini tamamlasa bile kervan çıkmazsa görevliler ücret bekler. Serbest kılıç ile loncalı kişi aynı sözleşme teminatına sahip değildir.',
    order: 'Şehir yönetimi ile ÇelikKalkan ayrı yetkilerdir. Lonca kendi sözleşmesini ve üye disiplinini yönetir; kentteki herkesi yargılayan bir mahkeme sayılmaz. Görev yazmanı ödeme, teslim ve sorumluluk sınırını işe çıkmadan kaydeder.',
    magic: 'Akademi eğitim ve araştırma verir; okul üyeliği halka hizmet ruhsatına eşit değildir. Sicil ve uygulama kapsamı ayrıca denetlenir. Gezgin şifacının hastası, büyücünün öğrencisiyle aynı hukuki ilişkide bulunmaz.',
    season: 'Sefer mevsimi koğuşları boşaltıp atölyeleri doldurur. Kış, bakım ve eğitim zamanıdır; iş bekleyen serbest kılıçların birikimi han ücretlerine ve görev pazarlığına yansır.',
    neighbours: 'Valdareth’in siparişleri, Dorvenhall metali ve çevredeki kervan yolları loncanın iş akışını belirler. Ucuz refakat talebiyle iyi hazırlanmış bir ekibin gerçek maliyeti her zaman uyuşmaz.',
    tension: 'Bir araba sahibi yalnız yolun ilk kısmı için para öder, fakat kervan bütün yolu korunacağını sanır. Torena’nın sözleşme nüshası anlaşmazlık büyümeden sorulması gereken ilk belgedir.',
  },
  dorvenhall: {
    food: 'Yüksek yollardaki hayvancılık ve aşağıdaki ekilebilir yerlerin ürünleri şehir pazarına taşınır. Ocak vardiyası yiyeceği yanında götürür; binek yemi, insan iaşesinden ayrı stoklanır.',
    work: 'Menekşespatının çıkarılması, sır için arıtılması ve kiremit işçiliği ayrı kazançlardır. Korucu, cevher yoklamacısı ve ocak emniyetçisi aynı yükü farklı sebeplerle durdurabilir.',
    order: 'Lord Rovan Mereth’in korucuları geçitleri ve yük hatlarını tutar. Ocak emniyetinin kapattığı tehlikeli işyerini yalnız asker emriyle açmak mümkün sayılmaz; risk kaydı ustaların sorumluluğudur. Lordluk tahsilatı yerel kayda girer.',
    magic: 'Ruhsatlı destek kullanılır; sağlam tahkimat ve hayvan bakımı büyüyle geçiştirilmez. Bir cevher incelemesi büyülü hizmet gerektiriyorsa sorumlusu ve ruhsatı sevk belgesine eklenir.',
    season: 'Buzlanmada bineklerin bölünmüş tırnakları işe yarar, fakat dar yol çökmesini önlemez. Bahar çözülmesi gevşek taşları artırır; bir rotanın yazın açık olması kışın da açık olduğu anlamına gelmez.',
    neighbours: 'Valdareth’in mavi mor çatılarının hammaddesi buradan gider. Lirendil atölyeleriyle metal ticareti sürer. Karlan Veyraltı ile menekşespatı farklı ürünlerdir; aynı ocaktan geliyormuş gibi fiyatlanmaz.',
    tension: 'Bir yük sürücüsü yol kapanmadan yetişmek ister; Orvik tehlikeli çalışma yüzünden sevki durdurur. Bir gün kaybedilen ücret ile kayabilecek bütün bir yamaç aynı pazarlığın iki ucudur.',
  },
  marhalden: {
    food: 'Tarım neredeyse yoktur. Uldar, Tolvur ve Toran’ın erzağı stok düzeninin temelidir; temiz Aldara suyu vardır. Balık bulunur, ancak maden ve ticaretin yerini alan ana sanayi değildir.',
    work: 'Kazı, işleme ve satış üç ayrı güç merkezidir. Ham ağırlık, işlenmiş metal ve satılan külçe ayrı defterlerde tutulur. Veyraltın nadirliği, sıradan demir işçisinin her gün bu metali gördüğü anlamına gelmez.',
    order: 'Lord sekiz, baş lonca üyesi dört yılda bir seçilir; kralın atama ve görevden alma yetkisi sürer. Nehrin iki yanındaki lordluk ve lonca kaleleri yetkiyi ayırır. Akçelik geçidi korur; zindana teslim kaydı lonca borç defterinden ayrıdır.',
    magic: 'Theramis ustalarıyla Elorwyn ruhbanının yerel iklim desteği yaşamı kolaylaştırır. Bakım, yakıt ve ruhsatlı görevli ister; açık dağın bütün kışını ortadan kaldırmaz.',
    season: 'Kış −35 °C’ye iner; yazın en yüksek değer yaklaşık 25 °C, genel sıcaklık 5–10 °C dolayındadır. Frostmere yılın yarısında donar. Depo doldurmak ve döküm için yakıt biriktirmek geçit savunması kadar gereklidir.',
    neighbours: 'Uldar, Tolvur, Toran, Harven ve Mavric lordluğun tahsilat alanıdır. Doğu erzağı besler; Hardlane’deki Harven ve Mavric sınırlı garnizon desteği alır. Kral Yolu burada biter; Cevher Çizgisi tamamlanmış bir yol değildir.',
    tension: 'Mülteci girişi kapalıdır. Erzak konvoyu ile sığınacak aile aynı kapıda bekleyebilir; ticari izin, yerleşme izninin yerine geçmez. Bu durumun bütün yükünü kapı nöbetçisinin çözmesi beklenir.',
  },
  elorwyn: {
    food: 'Hane mutfakları, bağışlı bakım ve çevre ürünlerinin pazarı bir aradadır. Sefer hazırlığında paladin ve yaralı bakımının iaşesi aynı kent ambarlarından istenir.',
    work: 'Hanedan hizmeti, zanaat, dini bakım ve askerî hazırlık ayrı geçim çevreleridir. Uzun süredir tanınan ailelerin referansı iş bulmayı kolaylaştırır; dışarıdan gelen ruhsatlı bir uzman aynı güveni hemen edinmez.',
    order: 'Tharion Elorwynder şehrin lordudur. Başkâtip Seldric yerel izinleri, Orena uygulama denetimini yürütür. Caldris askerî refakati, Rahela yaralı tahliyesini yönetir; bu görevler aile içindeki bütün nüfuzu tek kişiye vermez.',
    magic: 'Danstsud’da ruhsatlı büyü yasaldır. Elorwyn uygulamada en katı yerel denetimi yürütür; ruhsatın kapsamı, kullanılacağı yer ve ayin güvenliği incelenir. Yeni bir genel büyü yasağı ilan edilmiş sayılmaz.',
    season: 'Ayin ve sefer takvimi barınma ile bakım yükünü artırır. Yağışta refakat gecikir; geç kalan şifa izni hukuki tartışmayı doğrudan hastanın yatağına taşır.',
    neighbours: 'Theramis uzmanlık ve ruhsat eğitimi, başkent merkez sicili sağlar. Kethra’daki Elorwynder hanesi aynı soy ağı içinde ayrı yerel yönetimdir; Damian’ın makamı Tharion’un unvanıyla birleştirilmez.',
    tension: 'Bir hizmet ruhsatı geçerli olduğu hâlde yerel başvurunun alanı eksik yazılmış olabilir. Denetçinin güvenlik kaygısı ile bekleyen hastanın zamanı arasındaki gerilim sokağa yansır.',
  },
  theramis: {
    food: 'Pazar iaşesiyle okul ve atölye siparişleri birbirinden ayrıdır. Araştırma bütçesindeki pahalı bir malzeme, öğrencinin günlük yemeğini karşılayan kaynak değildir.',
    work: 'Ders, ruhsat sınavı, iksir güvenliği, kâtiplik ve sözleşmeli büyü hizmeti iş yaratır. Stajyer gözlem yapabilir; imza yetkisi ve ücretli hizmet için ayrıca yeterlilik gerekir.',
    order: 'Lord Elyas Theren şehir yönetimini, Başbüyücü Solan lonca çalışmalarını yürütür. Mavena sınavı, Liora hizmet kayıtlarını tutar. Ruhsat itirazı öğretmenin kişisel beğenisine değil kayıtlı gerekçeye yöneltilir.',
    magic: 'Ruhsatlı büyü okul dışında yasal hizmet verebilir. Kapsam aşımı, izinsiz uygulama ve kurban ritüelleri yasaktır. Heskar’ın güvenlik masası malzemenin saklanmasını da işin parçası sayar.',
    season: 'Sınav döneminde yatak ve kâğıt talebi artar. Marhalden iklim bakımına ayrılan ustaların dönüşü atölye sırasını değiştirir; aynı uzman iki şehirde sürekli hazır bulunamaz.',
    neighbours: 'Lirendil akademisiyle bilgi, Elorwyn’le izin, Marhalden’le bakım ilişkisi sürer. Ustanın şehir dışında çalışması başka kurumun lordluk yetkisini üstlendiği anlamına gelmez.',
    tension: 'Aynı ustanın dağ bakımına ve sınav heyetine çağrılması iki takvimi çarpıştırır. Hizmet masasının işi yalnız büyücü bulmak değil, kimin hangi tarihte sorumluluk alacağını belirlemektir.',
  },
  kethra: {
    food: 'Balık, kıyı ürünleri ve hane erzak deposu gündelik iaşeyi taşır. Denizden gelen yükün hemen satılması ile fırtına için stoklanması farklı çıkarlar yaratır.',
    work: 'Liman hizmeti, küçük onarım, taşıma ve hane işleri geçim sağlar. Branis’in satın alımı yerel fiyatları etkiler; Melra’nın bakım ve öğretimi bütün bu işlerin insan tarafını görünür tutar.',
    order: 'Damian Elorwynder lord, Aveline hane görüşmelerinin önemli ismidir. Tavera liman devriyesini yürütür. Rook’un Rydorn Sırtı arazisi şehir limanı üzerinde sınırsız yetki vermez; arazi ve iskele ihtilafları ayrı kaydedilir.',
    magic: 'Krallığın ruhsatlı hizmet düzeni geçerlidir. Kıyı şifası ile liman yükünde uygulanan büyünün kapsamı ayrıca belirtilir. Elorwyn’in katı yerel usulü her kıyı işine otomatik olarak taşınmaz.',
    season: 'Fırtına, tekne tamirini ve kıyı erzak ihtiyacını artırır. Sıcak kaynak bilgisi Ternhaven bağlantısını değerli kılar; bu bağlantı hızlı ve güvenli bir kara yolu vaat etmez.',
    neighbours: 'Elorwynder hanedan ilişkileri Elorwyn’e, Rydorn arazisi kıyı içlerine bağlanır. Ternhaven’le bilgi ve küçük mal alışverişi mümkündür; bitmemiş Cevher Çizgisi bu ilişkilerin yerini alamaz.',
    tension: 'Bir balıkçı teknesinin rıhtım işi hane sevkiyatı yüzünden bekletilir. Tavera güvenli yanaşmayı, Branis hane teslimini savunur; geciken ağ sahibinin zararını kimin ödeyeceği açıkta kalır.',
  },
  frostbay: {
    food: 'Altı aylık düşük verimli ekim büyük nüfusu doyurmaz. Dış tahıl, balık, av ve tervan, norruk, velkir ürünleri sofrayı tamamlar. Kışlık tuz ve yakıt tedariki yiyecek kadar önemlidir.',
    work: 'Gümrük, posta, gemi onarımı, taşıma ve küçük pazar işlerinde eski yapıların odaları kullanılır. Göçmen barakalarıyla taş binaların hizmet kalitesi eşit değildir; Honudlu ailelerin ilk işi çoğunlukla günübirliktir.',
    order: 'Nera Veld’in idaresi, Odran’ın garnizonu ve Ivren’in gümrüğü sınırlı işler. Hardlane’in Frostbay’e kâğıt üzerindeki bağlılığı güçlü bölgesel denetim sağlamaz. Küçük hizmet tahsilatı vardır; genel ve düzenli kraliyet vergisi yoktur.',
    magic: 'Ruhsatlı hizmet için krallık hukuku geçerlidir, fakat denetim görevlisi ve bakım imkânı azdır. Theramis araştırmacısı olmak büyü yapma yetkisini kanıtlamaz; Bryndon’un ölçüleri gözlem kaydıdır.',
    season: 'Frostmere yarım yıl donuktur. Denizin yarığına güvenmek, buz üzerinde güvenli bir yol bulmakla aynı şey değildir. Değirmen kalıntısında araştırma da posta dağıtımı da havaya göre durabilir.',
    neighbours: 'Kemiğe Basan Yol kıyı kentlerini Marhalden’e bağlar; uzunluğu ve güvensizliği taşıma kaybı yaratır. Honud’dan gelenler burada ilk sığınağı arar. Dranthol daha güvenli, Frostbay daha hareketli pazardır.',
    tension: 'Bir eski salonun hem posta deposu hem geçici barınak olarak kullanılması istenir. Ivren kayıtları kuru tutmaya, Hessa yeni gelenleri sıcak tutmaya çalışır; ikisinin de talebi gerçektir.',
  },
  kaldmere: {
    food: 'Buz deliği balıkçılığı, orman avı ve hanelerin paylaşımı temel kaynaklardır. Az tüccar tuz ve araç getirir. Düzenli kamu suyu yoktur; hanelerin açtığı kuyu güvenliği yerel emeğe dayanır.',
    work: 'Baraka tamiri, yakacak kesimi, post ve balık satışı birlikte yürür. Sürekli ücretli iş azdır. Son Lokma paylaşımı bir bütçe ya da devlet yardımı sayılmaz.',
    order: 'Şehir statüsü vardır; işleyen kraliyet otoritesi ve altyapı yoktur. Teren Moll barınak halkasının sözcüsüdür, kralın yargıcı değildir. Anlaşmazlıkta komşu tanıklığı ve karşılıklı zorunluluk etkili olsa da güçlü kişi bunu çiğneyebilir.',
    magic: 'Krallık kuralı kâğıtta geçerlidir. Sürekli ruhsat masası yoktur; dışarıdan hizmet getirmek zordur. Zorunluluk izinsiz uygulamayı kendiliğinden yasal yapmaz.',
    season: 'İlk don çatı ve yakıt sınavıdır. Çözülmede baraka altı çamur ve kirli su büyür. Bir sonraki gün dönen balıkçı, uzun vadeli yatırım vaadinden daha somut güvencedir.',
    neighbours: 'Frostbay’e giden küçük ticaret ve yakın orman yaşamı destekler. Ocak Kanunu’nun verdiği statü, Dranthol’daki kale ve liman yatırımının burada da gerçekleştiği anlamına gelmez.',
    tension: 'Bir ortak kuyuya giden geçiş yeni bir barakayla kapanır. Hanelerin su ihtiyacıyla yeni gelen ailenin sığınacak yer ihtiyacı çatışır; çözecek düzenli belediye bulunmaz.',
  },
  dranthol: {
    food: 'Liman yükü, kıyı balığı ve garnizon iaşesi ayrı akışlardır. Yaklaşık 15.000 kişiye çıkan nüfus eski yerel üretimin ölçeğini aşmıştır; kale ambarı sivil pazarı tamamen doyurmaz.',
    work: 'İnşaatla büyüyen işler azalmıştır. Fener, duvar ve tekne bakımında ücret sürer; çekilen korsan ticareti han ve tamirci kazancını daraltmıştır. Güvenlik artışı tek başına refah sağlamaz.',
    order: 'Garran Veyl’in Ocak Kalesi ve Orna Kehl’in fener-batarya düzeni kıyıda güçlüdür. Kraliyet yatırımıyla sınırlı hizmet geliri giderleri karşılar; bütün Hardlane için yeni düzenli vergi kurulmuş sayılmaz.',
    magic: 'Ruhsatlı görevli gerektiğinde sözleşmeyle çağrılır. Kale gücü, deniz fenerini sürekli büyüyle işletmekten değil nöbet, yakıt, mercek ve bakım disiplininden gelir.',
    season: 'Soluk Su sisi feneri değerli kılar. Ayaz Yutan’dan sonra donmuş kuşak başlar; emniyetli liman açık denizdeki her tekneyi kurtaramaz. Kış asker iaşesi yerel pazarı zorlar.',
    neighbours: 'Korsan alışverişi Vyssgard’a kaymıştır. Ternhaven ve Frostbay’le gayriresmî kara hattı sürer; yeni liman, yapılmamış Cevher Çizgisi’nin yerine güvenli karayolu sağlamaz.',
    tension: 'Kaleye kömür götüren araba, sivil fırının aynı günkü yükünü geciktirir. İkisi de sıcaklık ister; sevk önceliği tüccar için gecikme ücreti anlamına gelir.',
  },
  vyssgard: {
    food: 'Kaçak ve açık ticaret aynı depolara uğrar. Gıda, yatak ve tamir hizmeti çetelere pay vermek zorundadır. Bir iskelede bulunan yiyecek başka grubun mahallesine güvenle taşınamayabilir.',
    work: 'Kürekli sevk, tamir, yük taşıma ve bilgi satışı sürer. Yağmadan gelen malın ucuzluğu işçiye güvenli ücret sağlamaz; borç ve zorla tahsilat gündelik hayatın parçasıdır.',
    order: 'Kraliyet otoritesi fiilen yoktur. Beş İskele Sözleşmesi çetelerin alan ve gelirini korur; Dovek Raal sözcüdür, bütün kentin meşru lordu değildir. Sivil kişi anlaşmanın korumasından eşit yararlanmaz.',
    magic: 'Krallığın ruhsatı burada güvenli hizmet ortamı yaratmaz. Bir çetenin izni de krallık ruhsatı sayılmaz. Büyülü bir hizmetin borcu ve zorlaması diğer ticaretle aynı tehlikeyi taşır.',
    season: 'Buz ve sis açıkta bekleyen gemiye dönüşü keser. Günlerce iskelede kalan tayfa daha çok borçlanır; küçük tekneyle taşınabilecek yük ağır hava yüzünden azalır.',
    neighbours: 'Dranthol’un denetiminden kaçan akış kıyıya gelir. Frostbay pazar bağlantısı ve Kemiğe Basan Yol önemli fakat güvensizdir. Çete sınırları denizin hareketini denetleyemez.',
    tension: 'Bir tamircinin aldığı ödeme iki grubun pay defterine yazılır. Üçüncü bir tanık olmadan aynı borcu ikinci kez ödememek tehlikeli bir pazarlığa dönüşür.',
  },
  ternhaven: {
    food: 'Sıcak kaynak çevresindeki küçük ekimler, balık, hayvan ve av birlikte temel ihtiyacı karşılar. Sıcak Saz Avluları ürün kurutur; burası büyük tahıl ihracatçısı değildir.',
    work: 'Kıyı ticareti, küçük onarım ve sıcak su bakımı eski Hardlane hanelerinin bilgisine dayanır. Selvi’nin su işleri günlük iştir; Mera’nın ocak meclisi bunu haneler arasında koordine eder.',
    order: 'Frostbay’e idari bağlılık sürer; fiilî düzenin çoğu yerel ocaklarca yürütülür. Reformların küçük yatırımları yaşamı iyileştirmiştir. Yerel ortak iş payı, yeni genel kraliyet vergisine dönüşmez.',
    magic: 'Ruhsatlı hizmet gerektiğinde çağrılır. Sıcak su doğal ve yereldir; bütün Hardlane’i ısıtan sürekli bir büyü değildir. Kaynak bakımını bilen usta büyücü olmak zorunda değildir.',
    season: 'Sıcak derenin etkisi çevresinde yoğunlaşır; uzak bostan donar. Haneler kışlık ürün ve yakıtı paylaşır. Kaynak çevresinde daha kolay yaşamak depolama gereğini ortadan kaldırmaz.',
    neighbours: 'Cevher Çizgisi hiç yapılmamıştır. Kullanılan Kemiğe Basan Yol Dranthol, Frostbay ve Marhalden üzerinden uzun ve güvensizdir; yol kapanması küçük ürün fazlasını satmayı güçleştirir.',
    tension: 'Eski yol için kesilmiş taşların bir kısmı ocak tamirinde kullanılmak istenir. Taşı bekleyen yük sahibiyle hiç yapılmayan yolun ücretini bekleyen usta aynı malı farklı görür.',
  },
};

// Secondary towns retain their established officeholders and transport roles.
for (const [id, specialty] of [['brannis', 'pazar ve kervan işleri'], ['myrran', 'iskele-kervan teslimi'], ['luthen', 'karakol ve yol hizmetleri']] as const) {
  cityGuides[id] = {
    food: 'Yakın üretim, küçük pazar ve dış yük birlikte iaşe sağlar. Büyük şehrin siparişi arttığında burada satılacak ürün azalabilir; hane stoku ticaret yükünden ayrı tutulur.',
    work: `${specialty[0].toLocaleUpperCase('tr-TR')}${specialty.slice(1)}, yerleşimin gündelik iş çevresini oluşturur. Bir atölyenin satış yapabilmesi kadar aletini onarması, yakıt bulması ve müşterinin geri gelmesi gerekir.`,
    order: id === 'brannis' ? 'Lord Varlen Neth yerel yönetimi, Savra Nell piyasa kaydını, Uldrin Fael ruhsatlı pazar güvenliğini yürütür. Vergi ile artan göçmen nüfusunun hizmet ihtiyacı aynı bütçeye yüklenir; teslim makbuzu itirazın ilk dayanağıdır.' : id === 'myrran' ? 'Elric Marn sivil arabuluculuk ve mahkeme işleriyle tanınır; lord unvanı verilmez. İskeledeki teslim tanığı, yük ve zarar hesabını açıklığa kavuşturur. Kraliyet atama yetkisi yerel gelenekleri tümüyle silmez.' : 'Nalven Rieth köprü ve yol yüzbaşısıdır; karakol ve nöbet işleri onun hizmet çevresidir. Askerî yol güvenliği, bütün sivil uyuşmazlıklarda lordluk yargısı sayılmaz. Sevk ve geçişler yazılı teslimle izlenir.',
    magic: 'Ruhsatlı hizmet serbesttir; izinsiz uygulama ve kurban ritüelleri yasaktır. Gezgin uzmanın yanında ruhsat kapsamı ve kayıt sorulur; okul unvanı tek başına hizmet izni değildir.',
    season: 'Hasat yükü, yağışta geciken araba ve kış öncesi yakıt alımı pazarın ritmini değiştirir. Küçük bir stok kaybı, büyük kentte fark edilmeyen fakat burada önemli bir fiyat artışı yaratabilir.',
    neighbours: id === 'brannis' ? 'Valdareth–Lirendil yolculuğunun durağıdır. Honudlu ve yerinden edilmiş Danstsudlu ailelerin gelişi barınma ile pazar yükünü artırır; kraliyet sevki aynı sokaklardan geçer.' : 'Myrran–Luthen hattı Lirendil’den gelen kervanları kıyı ağına bağlar; Kethra bu yol çevresinin diğer merkezlerindendir. Bir teslimin gecikmesi sonraki karakol nöbetini ve iskele sırasını etkiler.',
    tension: 'Geciken bir yükün zararını üretici, arabacı ve alıcı birbirine yükler. Bir teslim belgesi, yüksek bir makama ulaşmaktan daha erişilebilir çözüm olabilir.',
  };
}

export const civicSections = (id: string): Section[] => {
  const g = cityGuides[id];
  return g ? [
    { title: 'Bir günün geçimi', paragraphs: [g.food, g.work, g.season] },
    { title: 'Kapı, kayıt ve hizmet', paragraphs: [g.order, cityJustice[id], g.magic] },
    { title: 'Komşular ve küçük anlaşmazlıklar', paragraphs: [g.neighbours, g.tension] },
  ] : [];
};

export const cityJustice: Record<string, string> = {
  valdareth: 'Şehir muhafızları tanık ve olay kaydını toplar; sivil yargı masası hükmü dinler. Saray görevi olağan sokak suçunu kendiliğinden saray yargısına taşımaz. Nolen Dur tutuklu ve hükümlü teslimini kaydeder; muhafız cezanın infazında görev alır. Hizmet şikâyetiyle suç isnadı ayrı başvurulardır.',
  lirendil: 'Kent muhafızlığı sivil suçun delilini toplar; lordluk yargı masası tanıklığı dinler. Hükmün uygulanması yerel idarenin işidir. ÇelikKalkan üye disiplini ve sözleşme hesabına bakabilir, ancak kent sakininin cezasını yalnız lonca toplantısıyla veremez.',
  dorvenhall: 'Korucular yoldaki suç ve kayıp yükün izini toplar. Lordluk yargı masası tanık ile teslim kaydını karşılaştırır; garnizon kayıtlı gözaltı ve hüküm teslimini uygular. Orvik’in güvenlik nedeniyle ocağı kapatması ceza hükmü değildir; yeniden açılma koşulu teknik incelemeyle belirlenir.',
  marhalden: 'Akçelik Nöbeti kapı ve kale suçlarını soruşturur, tanıkları kaydeder. Lordluk yargı masası ceza işini, lonca muhatapları üretim ve borç hesabını dinler. Lonca borcu otomatik zindan gerekçesi değildir. Hükümlü teslimi yüksek güvenlikli zindanda ayrı kayda girer.',
  elorwyn: 'Güvenlik görevlileri olay ve tanık kaydını toplar; lordluk yargı masası sivil suçu dinler. Orena ruhsat ve ayin ihlalini inceler, tek başına bütün suçların yargıcı sayılmaz. İzin denetimi, dini disiplin ve sivil ceza farklı süreçlerdir; uygulanacak hüküm kayıtla görevliye teslim edilir.',
  theramis: 'Şehir güvenliği sivil olayları araştırır; lordluk yargı masası tanık ve delili dinler. Lonca tehlikeli deney veya ruhsat kapsamını inceleyip uygulamayı durdurabilir. Eğitim disiplininin ötesindeki ceza idareye aktarılır; bir ustanın öğrenciyi dersten çekmesi zindan hükmü değildir.',
  kethra: 'Tavera’nın liman devriyesi kıyı suçlarının kaydını toplar. Damian’ın lordluk yargı masası sivil ihtilafı dinler; hükmün güvenlik teslimi devriyeye yazılır. Rook’un arazi hakkı limanda sınırsız ceza yetkisi vermez. Melra’nın bakım kaydı hastanın tanıklığına yardımcı olabilir, hükmün yerini almaz.',
  frostbay: 'Garnizon elinden geldiğince olay kaydı ve tanık toplar; Nera’nın sınırlı idare masası uyuşmazlığı dinler. Ağır işlerde yetki ve sevk için kraliyet muhatabı aranır, fakat yol ve kapasite eksikliği dosyayı bekletebilir. Kağıttaki hüküm, kentte her mahallede güvenle uygulanabildiği anlamına gelmez.',
  kaldmere: 'Sürekli kraliyet muhafızı, mahkeme ve ceza düzeni işlemez. Barınak halkası tanık dinleyebilir, iş paylaşımıyla uzlaşma arayabilir; Teren Moll’un sözü kraliyet hükmü sayılmaz. Şiddet kullanan kişi karşısında hanelerin dayanışması ve dışarıya haber yollama imkânı sınırlıdır.',
  dranthol: 'Ocak Muhafızları liman ve kale olayını araştırır. Garran’ın garnizon masası askerî disiplin işini, kayıtlı sivil idare muhatabı sivil başvuruyu dinler. Asker nöbet ve teslimi uygular; fener görevlisi deniz güvenliği kaydı tutar. Her rıhtım kavgası askerî suç olarak görülmez.',
  vyssgard: 'Tanığı dinleyen de cezayı uygulayan da çoğunlukla ilgili iskele grubudur. Beş İskele Sözleşmesi kraliyet mahkemesi değildir; güçlü grupların uzlaşma ve tahsilat düzenidir. İki alanı ilgilendiren olayda sözcüler konuşur, fakat zayıf kişinin eşit temsil ve güvenlik garantisi yoktur.',
  ternhaven: 'Ocak meclisi tanıklarla küçük ihtilafları dinler, hane ve iş paylaşımı üzerinden uzlaşma arar. Bu yerel çözüm güçlü bir kraliyet ceza mahkemesi değildir. Ağır şiddet için Frostbay’e haber gerekir; sınırlı denetim nedeniyle cevap geç gelebilir. Mera bütün Hardlane’in yargıcı sayılmaz.',
  brannis: 'Pazar muhafızı Uldrin olay ve tanığı toplar, Savra kayıtları karşılaştırır. Varlen’in lordluk yargı masası sivil ve ceza başvurusunu dinler; yerel güvenlik hükmün teslimini uygular. Yeni gelen ailenin adresi eksikse başvuru güçleşir; bu kişiyi otomatik suçlu kılmaz.',
  myrran: 'Elric Marn mahkeme ve sivil arabuluculuğun tanınan muhatabıdır. İskele tanıklarıyla taşıyıcıların teslim nüshaları zarar hesabını kurar; güvenlik görevlisi gözaltı ve teslimde rol alır. Malın ıslanması her zaman suç değildir: taşıma sorumluluğu ile kasıt ayrıca değerlendirilir.',
  luthen: 'Nalven’in yol görevlileri karakol olayını ve geçiş tanıklarını kaydeder. Sivil ihtilaf lordluk yargı muhatabına gider; yol yüzbaşısının askerî emri bütün sivil cezanın hükmü değildir. Sevk bekleyen olayda tanık ve mal teslimi korunur; gecikme kervanın sonraki durağını etkiler.',
};
