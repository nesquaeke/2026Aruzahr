import type { LoreArticle } from '../data'
import { hardlaneSources } from './hardlane'

// The two royal titles and their effects are author facts. Articles, procedures,
// fund names and the gang compact are authorised worldbuilding.
export const hardlaneLawArticles: LoreArticle[] = [
  {
    id: 'kul-uzerine-ocak-kanunu', name: 'Kül Üzerine Ocak Kanunu', kind: 'law', region: 'danstsud',
    subtitle: 'Eryndorn Vaeranth’ın yerleşim ve statü reformu', mapLocation: 'valdareth',
    summary: 'Hardlane’de yeni yerleşimlere köy veya şehir statüsü verilmesini düzenleyen kraliyet kanunu. Hane kaydı, yerleşim hakkı, idare ve kraliyet beratı kurar; statü verilmesi ayrı yatırım kanunnamesindeki paranın otomatik teslimi değildir.',
    sources: hardlaneSources, aliases: ['Ocak Kanunu', 'iskân kanunu', 'yerleşim statüsü'],
    related: ['eryndorn', 'mahrumiyet-iskan-sermaye', 'dranthol', 'ternhaven', 'kaldmere', 'hardlane', 'danstsud-lordluk-hukuku'],
    sections: [
      { title: 'Kraliyet hitabı ve kanunun maksadı', paragraphs: [
        '“Biz, Danstsud tacını taşıyan Eryndorn Vaeranth, sönen evin ardından yeni ocak kurulabilmesi, boş kalan toprağın mesken tutulması ve adı bulunan fakat kaydı bulunmayan insanların krallık hesabında görünmesi için işbu kanunu bildiririz.”',
        'Kül, eski evini yitiren insanın geride bıraktığını; ocak, yeni yerleşimin devamını anlatır. Kanun Hardlane’deki yeni ve büyüyen yerleşimleri kraliyet defterine almak üzere çıkarılmıştır. Eski şehirlerin Şafak Çağı’ndan gelen gelenekleri bu metinle topluca silinmez.',
      ] },
      { title: 'Madde 1 — Yerleşim sınıfları', paragraphs: [
        'Geçici barınma alanı Konak, aynı yerde ardışık mevsimleri geçirip ortak stok ve komşuluk kuran yerleşim Köy Ocağı, sürekli pazar ve yerleşim çekirdeğiyle büyüyen yer ise Şehir Ocağı olarak kayda alınabilir. Sınıf, görünüşün güzelliğine veya yalnız bir yapının büyüklüğüne göre verilmez.',
        'Her yerleşim adını, bulunduğu kıyı veya vadiyi, hanelerini ve kullandığı ortak alanları sicile bildirir. Henüz sayımın tamamlanamadığı kalabalık yerlerde tahmin kaydı ayrıca belirtilir; tahmin, sayım yapılmış gibi sunulamaz.',
      ] },
      { title: 'Madde 2 — Ocak sicili', paragraphs: [
        'Frostbay’de tutulan bölgesel Ocak Sicili ile başkentteki berat nüshası birbirine bildirilir. Yerel kâtip, aynı haneyi hem eski memleketindeki hem yeni yerleşimindeki mevcut ocak olarak iki kere yazmaz. Hane üyeliği, çocuklar ve bakıma muhtaç yakınlar dahil birlikte yaşayanları gösterir.',
        'Kaydı bulunmayan kişi başvurusunu şahit, önceki belge veya yerel tespit yoluyla tamamlayabilir. Sırf evrakı yolculukta kaybolduğu için bir hanenin mevcut barınağı ve kışlığı kayıttan bütünüyle çıkarılamaz. Yanlış veya eksik kaydın düzeltilmesi için başvuru yolu açık tutulur.',
      ] },
      { title: 'Madde 3 — Başvuru ve tespit', paragraphs: [
        'Yerleşim adına konuşan hane temsilcileri, yerin niteliğini ve ihtiyaçlarını yazdırır. İnceleme su, yiyecek, kıyı veya yol erişimi, yangın tehlikesi ve birlikte kullanılan alanları kaydeder. Mevcut eksikler yalnız başvuruyu reddetmek için değil, yatırım sırasını belirlemek için de gösterilir.',
        'Yerel kayıtta bir yerleşim görünürken başkent nüshasına ulaşmamışsa, kâtip hangi bildirimin yolda veya eksik olduğunu belirtir. Posta gecikmesi yeni bir şehir kurulmuş gibi ikinci dosya açılmasına gerekçe yapılamaz.',
      ] },
      { title: 'Madde 4 — Toprağın kullanımı', paragraphs: [
        'Yerleşim beratıyla barınak, ortak otlak, kıyı geçişi ve gerekli çalışma alanı belirlenir. Eski Hardlane hanelerinin zaten kullandığı alanlar boş arazi sayılıp habersizce dağıtılamaz. Kullanım uyuşmazlığı tespit kaydına geçirilir ve ilgili yerel yetkiyle görüşülür.',
        'Bir hane kendisine tanınan kullanım alanını diğer hanelerin suyunu, tek geçişini veya ortak iskelesini kapatacak biçimde genişletemez. Yeni gelenlerin yerleşimi, mevcut kıyı halkının aynı mevsimde yaşama imkânını yok edecek bir dağıtımla yapılmamalıdır.',
      ] },
      { title: 'Madde 5 — Kışlık ve asgari ocak düzeni', paragraphs: [
        'Yerleşim temsilcileri kışlık yakıt ve yiyecek ihtiyacını bildirir; ortak depo, yangın aralığı ve suya erişim için yer ayırır. Köy veya şehir statüsünün verilmesi, bu ihtiyaçların tamamının sağlanmış olduğu şeklinde kayda geçirilemez.',
        'Hizmetin eksik olduğu yerin statüsü geçiş kaydıyla tanınabilir. Bu kayıtta eksikler, sorumlular ve yatırım talebi açıkça yazılır. Bir baraka topluluğunun şehir sayılması, barakaların kâğıt üzerinde tamamlanmış taş evlere çevrilmesi değildir.',
      ] },
      { title: 'Madde 6 — Yerel temsil ve idare', paragraphs: [
        'Yeni ocaklar kendi hanelerinden temsilciler bildirir. Temsilciler ortak ihtiyaçları ve uyuşmazlıkları yerel idareye taşır; bu görev kendiliğinden lordluk veya askerî komuta yetkisi vermez. Kraliyetin atama ve azil yetkisi, mevcut lordluk hukukuna göre devam eder.',
        'Eski yerleşimlerin kendi yerel usulleri tespit edilir. Yeni temsil, nesillerdir sürdürülen kıyı iş birliğini bütün üyeleri değiştirilmiş bir kraliyet meclisine çevirmek zorunda değildir. Kraliyet görevlisinin görevi ve yerel temsilcinin sözü ayrı kayda girer.',
      ] },
      { title: 'Madde 7 — Vergi ve tahsilat sınırı', paragraphs: [
        'Ocak beratı verilmesi tek başına yeni bir düzenli toprak vergisi kurmaz. Yerel hizmet veya gümrük tahsilatı varsa hangi yetkiye dayandığı ve ne için alındığı gösterilir. Aynı göçmen haneden kayıt adı altında farklı görevlilerce tekrar tekrar para alınamaz.',
        'Manorveil’in doğrudan kraliyet vergisi ile lordlukların mevcut tahsilatı kendi hukukuna tabidir. Hardlane’de sicile bir ad eklenmesi, tahsilatın fiilen bütün kıyıda işlemeye başladığı şeklinde yorumlanamaz.',
      ] },
      { title: 'Madde 8 — Gelenin kaydı ve aranan kişi', paragraphs: [
        'Yeni yerleşime kaydolmak önceki bir suç hükmünü veya arama kaydını kendiliğinden ortadan kaldırmaz. İlgili makamın mührü, kişinin kimliği ve bildirilen hüküm kayda geçirilir. Bir hane, aynı kökenden gelen başka bir kişinin suçuyla topluca suçlanamaz.',
        'Bu kanun sığınmayı ve mesken tutmayı düzenler; bütün gelenlere genel af ilanı değildir. Bununla birlikte kraliyet görevlisi yalnız yabancı isim, farklı dil veya mülteci olmayı bir suç hükmü yerine kullanamaz.',
      ] },
      { title: 'Madde 9 — Pazar, posta ve ortak alan', paragraphs: [
        'Köy ve şehir kayıtlarında pazar kurulan alan, posta teslim yeri ve ortak depo açıkça gösterilir. Kalıcı yapı henüz yoksa kullanılan geçici yer yazılır. Görevli, olmayan bir postahaneyi yalnız raporda tamamlanmış sayamaz.',
        'Ortak alanın bir kişiye sürekli gelir sağlayacak özel mal gibi kapatılması, kullanım kaydı ve ilgili yetki olmadan yapılamaz. Taşımacı ve tüccar hangi yerleşim adına yük veya posta teslim ettiğini gösterebilir.',
      ] },
      { title: 'Madde 10 — İnanç ve ocak geleneği', paragraphs: [
        'Haneler kendi cenaze, dua ve ortak yemek geleneklerini sürdürebilir. Yerleşim sicili bir hanenin hangi mezhebe girdiğini değil, nerede yaşadığını ve kimlerden oluştuğunu kaydeder. Ortak su veya pazar hakkı yalnız bir ibadet çevresinin hanelerine ayrılmaz.',
        'Krallığın büyü ruhsatı düzeni geçerlidir. Dua ve bakım işi ile gerçek büyü uygulaması ayrılır; yerleşim beratı, izinsiz büyüyü veya kurban ritüelini serbest hale getirmez.',
      ] },
      { title: 'Madde 11 — Berat, itiraz ve kayıt denetimi', paragraphs: [
        'Kraliyet statüsü başmühürdarın tuttuğu berat nüshasıyla tanınır. Hane sayımı, yerel temsil ve eksik hizmet listesi berat dosyasına eklenir. Statü değiştirilirse önceki kayıt yok edilmez; değişimin dayanağı birlikte tutulur.',
        'Yanlış ad, mükerrer hane veya kullanım alanı uyuşmazlığı yerel kayda itirazla bildirilir. Yerel görevlinin kendi çıkarı olan bir uyuşmazlıkta kayıt yalnız onun sözünden oluşamaz; bağımsız şahit veya ikinci inceleme istenir.',
      ] },
      { title: 'Madde 12 — Yatırım ile ilişki ve yürürlük', paragraphs: [
        'Statü beratıyla yatırım talebi Mahrumiyet Mıntıkayı İskân ve Sermaye Tevzi Kanunnamesi’ne sunulabilir. Talep, tahsis ve işin teslimi farklı kayıtlardır. Henüz teslim edilmemiş para veya yapı, hanenin eline geçmiş hizmet sayılmaz.',
        'Bu kanun Eryndorn Vaeranth’ın mührüyle bildirilir. Yerel idareler mevcut ocakları ve yeni başvuruları yazdırır; gerçekleşen iş ile kanunda amaçlanan iş ayrı takip edilir.',
      ] },
      { title: 'Hardlane’deki sonuç', paragraphs: [
        'Dranthol’un statüsü yatırım ve güçlü garnizonla birlikte gelişti. Ternhaven’de reform mevcut topluluk düzenini destekledi. Kaldmere’de şehir adı ve kaydı oluştu; kamu altyapısı ve kraliyet otoritesi fiilen kurulmadı. Kanunun metni ile bölgedeki sonuç aynı değildir.',
      ] },
    ],
  },
  {
    id: 'mahrumiyet-iskan-sermaye', name: 'Mahrumiyet Mıntıkayı İskân ve Sermaye Tevzi Kanunnamesi', kind: 'law', region: 'danstsud',
    subtitle: 'Hardlane yatırımlarının tahsisi, teslimi ve bakım düzeni', mapLocation: 'valdareth',
    summary: 'Eryndorn’un yerleşim reformuna kaynak sağlayan yatırım kanunnamesi. Su, iskele, ambar, yol ve güvenlik işlerini aşamalara bağlar; Kuzey Ocak Sandığı ile tahsis edilen para, teslim edilmiş yapıyla aynı kayıt değildir.',
    sources: hardlaneSources, aliases: ['Sermaye Tevzi Kanunnamesi', 'Mahrumiyet Kanunnamesi', 'Kuzey Ocak Sandığı', 'iskân yatırımı'],
    related: ['kul-uzerine-ocak-kanunu', 'valdareth-saray-makamlari', 'dranthol', 'ternhaven', 'kaldmere', 'cevher-cizgisi', 'hardlane'],
    sections: [
      { title: 'Kraliyet hitabı ve tevzinin maksadı', paragraphs: [
        '“Adını deftere yazdığımız ocağın yalnız adıyla yaşamadığını biliriz. Mesken tutulan yerin suyu, kışı, yükü ve korunması için ayrılan sermayenin nereden çıktığı, kime verildiği ve hangi işe döndüğü işbu kanunnameye göre yazılsın.”',
        'Tevzi, ayrılan sermayenin ihtiyaçlara dağıtılmasıdır. Kanunname, Kül Üzerine Ocak Kanunu’nun tanıdığı yerleşimleri yaşanabilir kılmak üzere kamu işi, ticaret erişimi ve güvenlik yatırımını düzenler.',
      ] },
      { title: 'Madde 1 — Kuzey Ocak Sandığı', paragraphs: [
        'Hardlane yatırımları için kraliyet hazinesinde Kuzey Ocak Sandığı hesabı tutulur. Hazinedar Maelis Dervan ayrılan kraliyet gelirini, önceki borcu ve elde bulunan sermayeyi ayrı gösterir. Beklenen gelir henüz tahsil edilmeden harcanabilir para gibi yazılamaz.',
        'Lordluk, lonca veya tüccar katkısı varsa katkının karşılığı ve şartı kayda girer. Katkı sağlayan kişi, ortak suyu veya devlet yapısını kendiliğinden kendi mülkü sayamaz. Bu hesap Hardlane halkına kanun metninden doğan yeni genel toprak vergisi değildir.',
      ] },
      { title: 'Madde 2 — İhtiyaçların derecesi', paragraphs: [
        'Tahsis sırası içme suyu, kışlık yiyecek ve yakıt saklama, yangına karşı yerleşim aralığı, yük erişimi ve uygun korumayı gözetir. Yalnız nüfus sayısı veya güzel bir rapor, bütün kaynakların tek şehre verilmesini haklı kılmaz.',
        'Stratejik geçiş veya kıyı güvenliği için askerî iş önce yapılabilir; bu öncelik verildiğinde hangi sivil ihtiyacın ertelendiği ayrıca yazılır. Böylece bir kalenin tamamlanması, o yerin bütün barınma ve su işlerinin de tamamlandığı gibi gösterilmez.',
      ] },
      { title: 'Madde 3 — Talep dosyası', paragraphs: [
        'Yerleşim, işin yerini, beklenen yararını, malzeme kaynağını, iş gücünü ve mevsim koşullarını bildirir. Kıyıda iskele isteyen dosya buz ve rüzgârı, yol isteyen dosya geçit ve bakım ihtiyacını gösterir. Bir çizgi çekilmiş harita tek başına işin yapılabilirlik kaydı değildir.',
        'Ocak beratı, güncel hane bilgisi ve eksik hizmet listesi dosyaya eklenir. Eksik evrakın hangi sebeple tamamlanamadığı yazılır; aynı iş farklı adlarla birden fazla tahsis talebine dönüştürülemez.',
      ] },
      { title: 'Madde 4 — Tahsis, nakil ve teslim', paragraphs: [
        'Başkentte tahsis edilen miktar, yola çıkarılan para veya malzeme ve yerinde teslim alınan miktar ayrı kaydedilir. Fırtınada kaybolan yük, götürülmüş bir kâğıtla teslim edilmiş sayılmaz. Yerel görevli eksik gelen miktarı gösterir.',
        'Üç Makbuz Usulü, hazine çıkışı, taşıma teslimi ve yerel iş kabulünü birbirine bağlar. Aynı mühürlü kopyanın üç deftere geçirilmesi üç bağımsız teslimin yerine kullanılamaz. Eldeki malzeme ölçülür ve işin adıyla ilişkilendirilir.',
      ] },
      { title: 'Madde 5 — İşin aşamaları', paragraphs: [
        'Büyük yapıda ilk tahsis temel hazırlığına, sonraki tahsis doğrulanmış ilerlemeye, son tahsis kullanılabilir teslim ve kalan eksiklerin kaydına bağlanır. İnşaat başladı diye bütün ücret bir kerede tamamlanmış iş karşılığına dönüşmez.',
        'Kış, buz veya galeri tehlikesi işi durdurursa sebep kayda girer. Mevsim yüzünden ertelenen iş ile hiç başlamayan iş farklı gösterilir. Geçici duruşta korunmayan malzemenin kaybı ayrıca hesaplanır.',
      ] },
      { title: 'Madde 6 — Usta, işçi ve sözleşme', paragraphs: [
        'Lonca veya yüklenici, işin ölçüsü, teslimi, ücret ve malzeme sorumluluğunu yazılı olarak bildirir. Yerel işçiye verilen ücret, onların iskân kaydını yapan kişiye ait özel bir tahsilat gibi kesilemez. Borçlu işçi ile ücretli işçinin kaydı ayrılır.',
        'Eski Hardlane ustalarının kıyı ve don bilgisi iş tespitine alınır. Dışarıdan gelen ustanın mührü, yerel tehlike gözlemini kayıttan çıkarmaz. Hatalı yapılan işi kimin düzelteceği teslimde gösterilir.',
      ] },
      { title: 'Madde 7 — Su, ambar ve yerleşim işleri', paragraphs: [
        'İçme suyu alımı, atık alanı ve ortak ambarın yeri ayrı belirlenir. Yeni yerleşimin yakınındaki su, yalnız yapıya yakın olduğu için temiz kabul edilemez. Ambar çatı, nem ve yangın bakımını taşıyacak bir görev düzeniyle teslim edilir.',
        'Geçici barınaklar yenilenirken hanenin o kış nereye gideceği kayda girer. Yıkılan barakanın yerine yalnız çizimde ev yapılmış olması teslim değildir. Kullanılabilir yapı ve suya erişim yerinde incelenir.',
      ] },
      { title: 'Madde 8 — İskele ve deniz feneri', paragraphs: [
        'İskele işinde yanaşma yeri, yük alanı ve bakım sorumluluğu gösterilir. Deniz feneri yapısının yanında yakıt, nöbet ve onarım kaynağı ayrılır. Kulesi tamamlanan fakat ışığı sürdürülemeyen fener, çalışan deniz hizmeti olarak rapor edilemez.',
        'Buz ve kayalık riskleri yerel bilgiden alınır. Liman yatırımı, donmuş deniz boyunca her mevsim güvenli sefer açılması sözü değildir. Çalışabilecek mevsim ve yük türü tespit dosyasına yazılır.',
      ] },
      { title: 'Madde 9 — Garnizon ve güvenlik hesabı', paragraphs: [
        'Kale, muhafız ve askerî yanaşma işinde personelin ücret, yiyecek, yakıt ve ekipman ihtiyacı yapı maliyetinden ayrı hesaplanır. Garnizonun barınağı ile sivil mahallede gerçekten sürdürülen nöbet aynı satırda tek iş gibi gösterilemez.',
        'Görev, tahsis edilen yer ve emir zinciri bildirilir. Bir güvenlik yatırımı Frostbay’in bütün bölgesel kâğıt üstü yetkisini tek garnizona devretmiş sayılmaz. Yeni muhafız birliğinin fiilî erişimi ayrıca takip edilir.',
      ] },
      { title: 'Madde 10 — Yol ve Cevher Çizgisi', paragraphs: [
        'Yol dosyası yapım kadar mevsimlik bakımı, köprü ihtiyacını, yük değişimini ve korunmasını gösterir. Yerel patikanın adının değiştirilmesi tamamlanmış kraliyet yolu değildir. Marhalden geçidinden geçen iş, yerel lordluk ve lonca yetkileriyle birlikte planlanır.',
        'Cevher Çizgisi gibi büyük hatlarda hazırlık, açılmış bölüm ve kullanılabilir devam birbirinden ayrılır. Hayata geçmeyen yolun tahsis kaydı, bir ucundan öbür ucuna yük taşınabildiğinin kanıtı değildir. Göçmen girişinin kapatılması ile ticaret yükünün geçişi dosyada ayrı değerlendirilir.',
      ] },
      { title: 'Madde 11 — İnanç, büyü ve hizmet', paragraphs: [
        'Yerel ibadet ve yardım yapıları için katkı verilirse hangi hizmete ayrıldığı belirtilir. Bir ibadet çevresinin desteği, bütün yeni hanelerin aynı geleneğe girmesi şartına bağlanamaz. Ortak hizmetin kullanım kaydı haneleri gösterir.',
        'Büyüyle yapılan su, ısı veya yapı işi ruhsatlı uygulayıcı ve izin kapsamıyla kaydedilir. Bakım, yakıt ve büyücü ücreti devam hesabına girer; bir kez yapılmış iş bütün mevsimlerde kendiliğinden süren hizmet sayılmaz. Kurban ritüelleri ve izinsiz büyü bu kanunnameyle meşrulaşmaz.',
      ] },
      { title: 'Madde 12 — Denetim ve itiraz', paragraphs: [
        'Yerel kabul, tedarikçi ve kraliyet kaydı arasındaki farklar denetimde gösterilir. İşin parasından yararlanan görevli, aynı işin tek kabul şahidi olamaz. Hane temsilcileri eksik veya kullanılamayan hizmeti kayda bildirebilir.',
        'Sahte teslim veya saklanan kayıp miktarı önce hesapta durdurulur, sonra ilgili yetki önüne götürülür. Bütün yerleşimin tahsisi, yalnız bir görevlinin yaptığı yanlış yüzünden yeni inceleme yapılmadan yok sayılmaz.',
      ] },
      { title: 'Madde 13 — Bakım ve kesilen tahsis', paragraphs: [
        'Teslim edilen yapının bakım görevi, yerel karşılığı ve gerektiğinde yeni talep yolu gösterilir. Başkent tahsisi kesilirse hangi işin durduğu bildirilir. Yerel görevli eksik ücret veya yakıtı raporda gizleyerek işi hâlâ eksiksiz çalışıyor gösteremez.',
        'Ayrılan sermaye karşılık bulmamışsa elde kalan malzeme ve borç kaydı korunur. Bir sonraki karar aynı işin geçmişini görür; daha önce hiç ödeme yapılmamış gibi yeni bir başlık açılmaz.',
      ] },
      { title: 'Madde 14 — Yürürlük ve yerel sonuç', paragraphs: [
        'Kanunname Eryndorn Vaeranth’ın mührüyle bildirilir. Hazinedar, başmühürdar ve ilgili yerel idareler işin farklı kayıtlarını tutar. Statü, tahsis ve teslim ayrı izlenir.',
        'Her yeni tahsis, önceki işin kullanılabilirliği ve sürmekte olan bakım yüküyle birlikte değerlendirilir. Yerel kayıt, gerçekleşen işi ve henüz karşılanmayan ihtiyacı aynı dosyada ayrı gösterir.',
      ] },
      { title: 'Hardlane’deki uygulama', paragraphs: [
        'Dranthol’daki kale, liman ve fener tamamlandı; Ternhaven’de daha sınırlı onarımlar yaşamı kolaylaştırdı. Kaldmere’de kamu altyapısı oluşmadı, Cevher Çizgisi gerçekleşmedi. Hardlane’in güncel manzarası bu eşitsiz sonuçların manzarasıdır.',
      ] },
    ],
  },
  {
    id: 'vyssgard-kanunlari', name: 'Vyssgard Kanunları', kind: 'law', region: 'danstsud',
    subtitle: 'Beş İskele Sözleşmesi ve zorla uygulatılan liman düzeni', mapLocation: 'vyssgard',
    summary: 'Kanca Rıhtımı, Kör Fener, Kırık Örs, Yaslı Halat ve Kül Deposu’nun kurduğu yerel sözleşme. Kaçak ticaretin devamı ve güç odaklarının çatışmasını sınırlamak için uygulanır; kraliyet hukuku veya bütün sakinlerin özgürce kabul ettiği bir düzen değildir.',
    sources: hardlaneSources, aliases: ['Beş İskele Sözleşmesi', 'çete kanunları', 'İskele Payı'],
    related: ['vyssgard', 'dranthol', 'frostbay', 'hardlane-kulturu', 'kul-uzerine-ocak-kanunu'],
    sections: [
      { title: 'Sözleşmenin dili', paragraphs: [
        '“Dışarıda bizi arayanın defteri bulunur; burada birbirimizin yükünü, yatağını ve sözünü tanırız. Beş iskelenin payını çiğneyen, beşinin kapısından da mahrum kalır.”',
        'Vyssgard’ın güç odakları, sürekli kavganın ticaretlerini yok etmemesi için bu kuralları koymuştur. Zayıf kişi ve siviller uymaya zorlanır. Uygulayıcının kendi ihlalinin cezalandırılması, kurala uymak zorunda olanlarla aynı düzeyde değildir.',
      ] },
      { title: 'Madde 1 — İskele Payı', paragraphs: [
        'Yük boşaltan veya iş gören kişi hangi iskelenin koruma ve tahsilat alanında bulunduğunu bildirir. O alanın payı ödenir; başka güç odağı aynı yükü kendi alanına girmeden ikinci kere vergilendiremez. Buna rağmen pazarlık ve güç, yazılı paydan daha yüksek talebi mümkün kılabilir.',
        'Bu tahsilat kraliyet gümrüğü değildir. Çetenin aldığı para kendi koruma ve zor düzenini sürdürür; devlet hizmeti aldığı için ödeme yapan bir hane hakkı oluşturmaz.',
      ] },
      { title: 'Madde 2 — Kapalı Bıçak', paragraphs: [
        'Pazar, ortak depo ve görüşme masasında açık silahla kişisel kavga başlatılamaz. Güç odakları ticaret saatinde birbirlerinin müşterisini yaralayarak payını bozmaz. Silahını açık taşıyan çete nöbetçileri aynı sınırlamayı herkese aynı biçimde uygulamaz.',
        'Kural kentte bütün şiddeti yasaklamaz; ticaret alanındaki kavgayı ve masadaki pazarlığın kanla kesilmesini sınırlamayı amaçlar. Koruma alanının dışında aynı kişiye aynı güvence verilmez.',
      ] },
      { title: 'Madde 3 — Gelenin kefili', paragraphs: [
        'Yeni gelen, yatak veya ticaret hakkı için tanınan bir kefil gösterir. Kefil gelene dair borç ve uyuşmazlığın ilk muhatabı olur. Kefili olmayan kişi daha pahalı barınak veya dar çalışma hakkına zorlanabilir.',
        'Bu usul kanundan kaçan kişiye özgürlük sözü vermez. Bir çete veya aracıya bağımlılık yaratabilir; gelenin nerede kaldığı ve ne iş yaptığı başka bir deftere girer.',
      ] },
      { title: 'Madde 4 — Mühürlü depo', paragraphs: [
        'İskelelerin tanıdığı depo ve emanete kendi içlerinden izinsiz el konamaz. Depo mührü hangi güç odağının korumasının satın alındığını gösterir. Başka yerde alınmış veya zorla getirilmiş bir malın depoda olması, önceki sahibinin hakkının burada tanınacağı anlamına gelmez.',
        'Tüccarın emaneti korunurken aynı korumayı satın alamayan işçinin küçük eşyası daha kolay kaybolabilir. Kural mal akışını sürdürür; bütün mülkiyet uyuşmazlığına eşit çözüm getirmez.',
      ] },
      { title: 'Madde 5 — Yatağa kan getirmeme', paragraphs: [
        'Payını veren han ve yatak evinde kişisel hesap görülmez. Birini orada zorla almak için yatağı tutan gücün onayı gerekir. Hanın payı veya bağlılığı değişirse korumanın devamı da tartışmaya açılır.',
        'Yatak evi sahibinin kefilliği kısa süreli dinlenme sağlar. Kentte herkesin canının dokunulmaz olduğuna dair genel bir hak değildir; kaçan kişi rahat bir gece için yeni bir borca girebilir.',
      ] },
      { title: 'Madde 6 — Fener, halat ve geçiş', paragraphs: [
        'Ortak yanaşma işaretleri, kıyı halatları ve yük geçişleri kişisel kavga için bozulamaz. Bozanın zararı onarması ve iş kaybını karşılaması istenir; gücü olmayan kişi bu karşılığı zorunlu çalışmayla ödemeye zorlanabilir.',
        'Kural, herkesin aynı kötü hava ve buz riskine bağlı olmasından doğar. Bir rıhtımın işaretini bozmak yalnız rakibi değil, yükü bekleyen bütün güç odaklarını zarara uğratır.',
      ] },
      { title: 'Madde 7 — Borç defteri', paragraphs: [
        'Borç, mal payı ve kefillik tanınan deftere yazılır. Defteri tutan odağın kabulü olmadan aynı borç bitmiş sayılmaz. Sözlü ödeme yapan zayıf kişi, ikinci kayıt veya şahit bulamazsa yeniden ödeme baskısıyla karşılaşabilir.',
        'Güç odakları kendi aralarında kayıt tanır; yoksul işçinin deftere itirazı aynı ağırlıkta değildir. Borç kaydı iş bulma veya barınma şartına dönüştüğünde kişiyi kentten ayrılamaz hale getirebilir.',
      ] },
      { title: 'Madde 8 — Bulunan mal ve kayıp pay', paragraphs: [
        'Kent içinde bulunan yükün hangi koruma alanına ait olduğu sorulur. Tanınan mührü varsa o iskeleye bildirilir. Sahibinin burada adı yoksa güç odakları malı kendi pay kuralına göre bölüşebilir.',
        'Bu kural, dışarıdaki kayıp veya yağma mağduruna tazminat veren bir düzen değildir. Bir başkasının zararını, içerdeki güç odakları arasında kavga çıkarmadan paylaştırma aracına dönüşebilir.',
      ] },
      { title: 'Madde 9 — Tuz Tartısı', paragraphs: [
        'İki iskele arasındaki yük, borç veya yaralanma uyuşmazlığı, üçüncü odağın tanık olduğu Tuz Tartısı görüşmesine götürülür. Konuşanlar kayıt ve şahit getirir; karşılık, pay veya çalışma üzerinden anlaşma aranır.',
        'Üçüncü odağın tarafsızlığı sürekli değildir. Büyük güçler arasındaki anlaşma, onların işçisinin veya bir esirin zararını hesaba katmayabilir. Masaya çıkabilmek de çoğu kişi için önce bir kefilin izin vermesine bağlıdır.',
      ] },
      { title: 'Madde 10 — Kırılan söz', paragraphs: [
        'Tanıdığı emaneti bozan, pay anlaşmasını saklayan veya masada verdiği sözü çiğneyen kişi depo, yatak ve çalışma hakkını kaybedebilir. Büyük güç odakları bu yaptırımları birlikte uygulama sözü verir; güçlü üyenin istisnası pazarlıkla yaratılabilir.',
        'Bir zayıf hanenin bu haklardan çıkarılması kışın yaşama imkânını daraltır. Yazılı düzenin ağırlığı, onu bütün taraflara eşit biçimde uygulatacak bağımsız bir güç olmadığı yerde daha çok zayıfa düşer.',
      ] },
      { title: 'Madde 11 — Sığınmanın sınırı', paragraphs: [
        'Vyssgard’a gelmek önceki bir kralın veya başka bir şehrin kanununu hukuken kaldırmaz. Çeteler dışarıdaki emre uymayabilir, fakat korumaları kendi çıkarı ve pazarlığına bağlıdır. Bir kişinin düşmanına teslim edilmeyeceğine dair ortak ve sürekli bir garanti yoktur.',
        'Kentte nefes almak için kurulan bu düzen, kaçışın bittiği bir güvenli hayat değildir. Aynı kişi başka bir otoritenin borcuna, koruma ücretine veya zorlamasına girebilir.',
      ] },
      { title: 'Kuralların koruduğu ve dışarıda bıraktığı', paragraphs: [
        'Beş İskele Sözleşmesi büyük güçlerin malını ve gelir akışını çatışmanın bir bölümünden korur. Kentin kalan sakinleri de bu düzenin içinde yaşamak zorundadır; işçi, çocuk, aile ve esirlerin aynı pazarlık gücü yoktur.',
        'Vyssgard’ın tehlikesi hiçbir kural bulunmamasından gelmez. Kuralların kim için yazıldığı ve kim tarafından uygulatıldığı, burada güvenliği parayla ve bağlılıkla satın alınan bir şeye çevirir.',
      ] },
    ],
  },
]
