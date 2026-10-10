export type InstitutionOperation = { mandate: string; chain: string; support: string; accountability: string };
export const institutionOperations: Record<string, InstitutionOperation> = {
  'tac-on-iki': {
    mandate: 'Tam on iki yeminli şövalye krala doğrudan bağlıdır. Ardel görevleri paylaştırır; yol, arşiv, tören ve sağlık refakatinin her biri ayrı uzmanlık ister. Şövalye unvanı herkesi kent yargıcı yapmaz.',
    chain: 'Kraliyet görev emri → Ardel’in dağıtımı → görevlendirilen şövalye. Refakat edilen makamın sivil kararıyla şövalyenin güvenlik sorumluluğu ayrı tutulur; yol üzerinde gerekçeli değişiklik dönüşte kayda girer.',
    support: 'Hizmetkârlar, silah bakımcıları, at bakıcıları ve yazmanlar hanenin giderinden karşılanır. On iki sayısı bütün destek personelinin sayısı değildir. Sefer için ek iaşe önceden hazine ve levazımla görüşülür.',
    accountability: 'Görev sonu raporu, emanet teslimi ve yemin denetimi yapılır. Nethan adayları ve yemin usulünü izler. Özel kraliyet görevine ayrılan şövalye aynı gün kent kapısında sürekli nöbet tutamaz.',
  },
  'mor-pelerin': {
    mandate: 'Saray iç çevresi, kapı ve refakat güvenliği. Şehir mahallelerinin bütün asayişi bu birliğe yüklenmez; nöbetin amacı kralın hanesi ve görevli saray personelinin korunmasıdır.',
    chain: 'Vesren komutayı, Fara iç kapı vardiyasını yönetir. Çavuşlar erleri dağıtır; vardiya değişiminde kapı listesi, anahtar ve teslim edilen emanet sayılır.',
    support: 'Saray bütçesi ücret, iaşe ve donanımı karşılar. Nöbet yedekleri, bakımcılar ve taşıyıcılar bulunur; iki tanınmış komutan iki kişilik bir ordu anlamına gelmez.',
    accountability: 'Giriş kaydı ve vardiya defteri karşılaştırılır. Gözaltına alınan kişi kent muhafızlığına teslim edildiğinde iki kurum da imza verir; saray nüfuzu şehirde kayıtsız ceza yetkisi yaratmaz.',
  },
  'mavi-pelerin': {
    mandate: 'Kraliyet sevkiyle saha, garnizon ve yük refakati hizmeti. Sivil kent muhafızlığından farklı olarak şehir dışına görevle çıkabilir.',
    chain: 'Darsen saha emrini bölüklere, Ivela erzak ve sevki levazım görevlilerine verir. Yaya bölükleri ile kalkan takımları kendi astları üzerinden çalışır.',
    support: 'Taç ücret ve iaşeyi karşılar. Araba bakımcıları, silah ustaları, sağlık desteği ve küçük tahkimat ekipleri görevin parçasıdır. Kaynak yetersizliği sevkin gününü değiştirir.',
    accountability: 'Sevk edilen ve teslim alınan mal ayrı sayılır. Sivil pazardan alınan erzak makbuzla kaydedilir; askerî öncelik tüccarın ücretini kendiliğinden silmez.',
  },
  'mor-donanma': {
    mandate: 'Rilorn Körfezi’nde kraliyet gemileri, liman yaklaşımı ve görevlendirilmiş konvoyların korunması. Her açık deniz gemisi sürekli donanma korumasında değildir.',
    chain: 'Nerath gemi komutasını, Ceryn konvoy görevini, Veyla rota ve seyir hazırlığını yürütür. Tormal’ın tersane uygunluğu alınmadan bakım isteyen gemi hazır sayılmaz.',
    support: 'Hazine ödeneğiyle tayfa ücreti, tuzlu erzak, halat, yelken, kereste ve fener yakıtı alınır. Kürekçi, marangoz, arma ustası ve depo sayımcısı aynı geminin farklı ihtiyaçlarını karşılar.',
    accountability: 'Gemi günlüğü, tersane teslimi ve iaşe listesi karşılaştırılır. Bir konvoyun gecikmesi hava, eksik tamir veya emir değişikliği olabilir; her kayıp yük korsan saldırısı değildir.',
  },
  'valdareth-kent-hizmetleri': {
    mandate: 'Mahalle hizmeti, gıda arzı, liman, gümrük, muhafızlık, kilise bakımı ve hapishane ayrı masalardır. Sivil başkent vekili koordinasyon yapar; hepsinin uzmanlığını tek başına üstlenmez.',
    chain: 'Teren’in hizmet masası talepleri ilgili nazıra aktarır. Rickon asayişi, Nolen zindan teslimini izler. Odrissa dini bakımın muhatabıdır. Erhan dışarıdan çalışan duvar ustası, Sela bağımsız dilekçe yazıcısıdır; ikisine memur yetkisi verilmez.',
    support: 'Kent bütçesi ve görevine göre kayıtlı liman-hizmet gelirleri kullanılır. Tartıcı, su taşıyıcı, ambarcı, sokak bakımcısı ve kâtipler görünür makamların altında işi taşır.',
    accountability: 'Dilekçe teslimi, ilk vergi makbuzu ve hizmet kaydı muhafaza edilir. Aynı ürünün iki kez tahsilatı itiraz konusudur; surlar arasındaki hizmet eşitsizliği en sık gerilimdir.',
  },
  'lirendil-gorev-haneleri': {
    mandate: 'Sözleşmeli refakat, iz sürme, eğitim ve görev hazırlığı. ÇelikKalkan üyeleriyle serbest kılıçlar aynı şehirde iş alır, fakat aynı disiplin ve teminata bağlı değildir.',
    chain: 'Torena iş kapsamını yazar; Hadrik ve Jarek hazırlığı, Nelra sağlık desteğini, Oswen malzemeyi kontrol eder. Maera sahada sözleşme kapsamıyla çalışır; Sevran serbestlerin talebini temsil eder.',
    support: 'Görev bedeli, hazırlık avansı ve bakım payı ayrı kaydedilir. Yiyecek, yedek kalkan, katır veya araba ihtiyacı işin uzaklığına göre belirlenir; bunlar kahramanın sırtında görünmez varsayılmaz.',
    accountability: 'Teslim noktası, gecikme ve görevden dönme koşulu önceden yazılır. Lonca hakemi üye sözleşmesini inceler; kentteki suç ayrıca yerel idareye bildirilir.',
  },
  'theramis-altin-yilan': {
    mandate: 'Büyü eğitimi, ruhsat sınavı, güvenli araştırma ve sözleşmeli hizmet. Şehir lordluğu ile lonca makamı ayrı kalır; okul dışı ruhsatlı hizmet yasaldır.',
    chain: 'Solan ustaların çalışmalarını, Mavena yeterlilik ve ruhsatı, Liora staj-hizmet takvimini izler. Darom karşı büyüyü, Erisa iklim bakımını, Vadren sefer desteğini, Heskar malzeme güvenliğini üstlenir. Neral arşivde nüsha araştırır; hizmet büyücüsü sayılmaz.',
    support: 'Eğitim gideriyle ücretli hizmet geliri ayrı hesaplanır. Laboratuvar gözetmeni, kâtip, malzeme görevlisi ve gözetimli stajyer bulunur. Hizmet fiyatı yol, sarf ve ustanın zamanını içerir.',
    accountability: 'Ruhsat kapsamı, kullanılan malzeme ve uygulama sonucu kayda girer. İtirazın gerekçesi belirtilir; öğrenci olmak uygulama yetkisi vermez. Tehlikeli deney durdurulabilir.',
  },
  'dorvenhall-sinir-koruculari': {
    mandate: 'Lord Rovan Mereth’e bağlı geçit devriyesi ve yük refakati. Talvena cevher yoklaması, Orvik ocak emniyetiyle temas eder; korucular her dağ yamacına aynı anda ulaşamaz.',
    chain: 'Borren rotaları, Endrik kuzey vardiyalarını dağıtır. Sira binek uygunluğunu belirler. Yol emri, bakımın sakıncalı bulduğu yaralı hayvanı sağlıklı saymaz.',
    support: 'Lordluk bütçesi ücret ve iaşeyi sağlar. Orvel yemi, eyer, nal yerine tırnak bakımı, su ve dinlenme durağı planlanır. Bakıcı ve iz yazmanı olmadan binekli devriye sürdürülemez.',
    accountability: 'Çıkış-dönüş, rota değişikliği ve yük teslimi işaretlenir. Kayıp devriyede önce güzergâh, hayvan izi ve ocak kapanma kaydı karşılaştırılır; tutarsızlık otomatik suç hükmü değildir.',
  },
  'marhalden-akcelik': {
    mandate: 'Nehir kaleleri, geçit, zindan teslimi ve sınırlı küçük kuşatma düzeneklerinin korunması. Savren ile Elva tanınan askerî yöneticilerdir; kazı, işleme ve satış temsilcileri Üç Mühür Meclisi’nde ayrı muhataptır.',
    chain: 'Savren garnizonu, Elva nehrin iki yanındaki kale vardiyalarını yönetir. Görevli çavuş kapı ve tahkimat ekiplerini dağıtır. Lordlukla lonca başının ayrı yerleşkeleri tek makam sayılmaz.',
    support: 'Lordluk bütçesi, lonca katkısı ve kayıtlı görev iaşesi kullanılır. Demirci, düzenek bakımcısı, ok yapımcısı, taşıyıcı ve ruhsatlı iklim desteği seçkin askerin arkasındaki emektir.',
    accountability: 'Kapı izinleri, zindan teslimleri ve kullanılan malzeme ayrı defterdedir. Mülteci girişinin kapanması ticaretin bütünüyle kapanması değildir. Lonca borcu askerî suçmuş gibi kayıtsız cezalandırılamaz.',
  },
  'elorwyn-adak-muhafizlari': {
    mandate: 'Paladin ön sıra ve refakati, Siper Rahibeleri savunma ve yaralı tahliyesi, sefer rahipleri bakım-ibadeti üstlenir. Tharion’un lordluğu bu hizmetleri kent düzeni içinde tutar.',
    chain: 'Caldris askerî kolu, Rahela rahibeleri, Veyren sefer bakımını yönetir. Orena ruhsat ve ayin denetçisi, Seldric lordluk başkâtibidir; denetim ile savaş komutası aynı görev değildir.',
    support: 'Hane bütçesi, kayıtlı dini bağışlar ve görev ödeneği birbirinden ayrılır. Sedyeci, aşçı, teçhizat bakımcısı ve bakım öğrencileri bulunur. Bağış, ruhsat verilmesini satın alamaz.',
    accountability: 'Yemin, görev emri, yaralı teslimi ve uygulama ruhsatı denetlenir. Elorwyn’in sert yerel usulü krallık çapında yeni bir büyü yasağı oluşturmaz; ret gerekçesi yazılmalıdır.',
  },
  'kethra-kiyi-hizmetleri': {
    mandate: 'Lordluk hanesi, liman güvenliği, erzak ve kıyı bakımının ortak çalışma çevresi. Kent sakini Seraphinia’nın listede olması ona yönetim makamı verilmesi değildir.',
    chain: 'Damian lordluk kararını, Aveline hane görüşmelerini, Tavera liman devriyesini, Branis erzağı yürütür. Melra bakım-öğretimle ilgilenir; Rook kendi Rydorn arazisinin sahibidir.',
    support: 'Lordluk ve liman işi kayıtlı giderlerle karşılanır. Yük işçisi, tekne tamircisi, erzak sayımcısı ve gönüllü bakım desteği ayrı iş yapar. Hane siparişi özel esnafın bütün zamanını sahiplenmez.',
    accountability: 'Rıhtım sırası, mal teslimi ve arazi izinleri ayrı incelenir. Hane bağının ticari uyuşmazlığı tek başına çözmediği durumlarda teslim kaydı ve tanık gerekir.',
  },
  'hardlane-ocak-agi': {
    mandate: 'Frostbay, Dranthol, Vyssgard, Ternhaven ve Kaldmere’deki farklı yerel muhatapları bir arada gösterir. Tek bir ordu, hükümet veya bölgesel emir zinciri değildir.',
    chain: 'Frostbay vekili ve garnizonu sınırlı yetkilidir; Dranthol garnizonu ayrı işler. Ternhaven meclisi ve Kaldmere barınak halkası yereldir. Vyssgard sözcüsü iskele düzeninin muhatabıdır. Ivena bağımsız yol araştırmacısı, Sella kıyı çobanıdır; askerî veya idari komutan değillerdir.',
    support: 'Frostbay’de sınırlı gümrük-hizmet geliri, Dranthol’da yatırım ve garnizon iaşesi, öteki yerlerde ortak emek veya zorla alınan pay vardır. Bunlar tek bir genel kraliyet vergisi değildir.',
    accountability: 'Her yerin teslim ve anlaşması kendi muhatabıyla yapılır. Frostbay’de kayıt olan talep Kaldmere’de otomatik hizmet doğurmaz; kâğıt üzerindeki bağlılıkla fiilî kapasite sürekli ayrılır.',
  },
  'celikkalkan-loncasi': {
    mandate: 'Üye eğitimi, sözleşmeli görev ve ortak bakım. Sir Vardek loncanın başıdır; lonca bütün Lirendil’i yöneten kraliyet muhafızlığı değildir.',
    chain: 'Vardek görev ilkelerini, Kaelen eğitimi, Torena sözleşmeyi takip eder. Varric kıdemli görevlerde bulunur; Ellyn arşivi, Ghorin demirhaneyi, Zylara reviri yönetir. Üye ve oyuncu karakterler kendiliğinden komutan sayılmaz.',
    support: 'Üye payı, görev bedeli ve bakım bütçesiyle koğuş, revir, demirhane ve levazım işletilir. Bakım çırakları, mutfak görevlileri ve taşıyıcılar kadronun arkasındaki gündelik işi yapar.',
    accountability: 'Görev dönüşü teslim, yaralanma ve ödeme kaydedilir. İç disiplin bir üyeyi görevden çekebilir; sivil suç ayrı idareye gider. Politik görüş, herkese açıklanmış bir kurum hedefi gibi sunulmaz.',
  },
  'lirendil-buyu-akademisi': {
    mandate: 'Eğitim, araştırma ve yeterlilik hazırlığı. Akademi üyeliği, mezuniyet ve halka büyü hizmeti ruhsatı ayrı kayıtlardır.',
    chain: 'Magister Vaelcor ustalardan biridir, bütün akademinin tek yöneticisi olarak atanmaz. Lethan merkez siciliyle ilişkiyi taşır; sürekli yalnız Lirendil’de bulunan yeni bir şehir lordu sayılmaz.',
    support: 'Eğitim gideri, atölye malzemesi ve kayıtlı hizmet sözleşmeleri ayrı tutulur. Kâtip, malzeme sorumlusu, ders yardımcıları ve gözetimli öğrenciler çalışır; bilinen iki yüz bütün kadro değildir.',
    accountability: 'Ders ve deney gözetimi, yeterlilik kaydı ve ruhsat kapsamı birlikte izlenir. Tehlikeli uygulama durdurulur. Bir öğrencinin başarısı öğretmenin siyasi nüfuzuyla ölçülmez.',
  },
  'marhalden-uc-muhur': {
    mandate: 'Kazı, işleme ve satış çevrelerinin yerel üretim dengesini korumak. Şehrin lordu sekiz yılda, baş lonca üyesi dört yılda seçilir; tacın atama ve azil yetkisi sürer.',
    chain: 'Edran lordluk ve kapı işini, Vessa baş lonca işini izler. Tervik kazı, Nesra işleme, Karven satış kolunu temsil eder. Mereth karşılaştırma kâtibidir; tartı araştırması ona hüküm ya da seçim yetkisi vermez.',
    support: 'Üretim payı, kayıtlı ticaret gideri ve lonca katkısı ayrı tutulur. Kazıcı, fırıncı usta, tartıcı, depo görevlisi ve taşıyıcı sevkin farklı basamaklarını taşır. İşçilik ücreti satılan külçenin miktarıyla aynı kayıt değildir.',
    accountability: 'Ham yük, işleme farkı ve son teslim üç çevrenin tanığıyla okunur. Borç, emanet ve satış aynı sayılmaz. Karşı nüsha ve seçim süreleri tek kolun bütün kaynakları sahiplenmesini sınırlar; borç anlaşmazlığı doğrudan askerî zindan hükmü değildir.',
  },
};
