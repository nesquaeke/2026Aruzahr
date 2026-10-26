# Atlas doğrulaması — 9 Ekim 2026

## Veri ve harita

Tarayıcıdan okunan uygulama verisi: 96 yerleşim, 8 ülke, 3 alt bölge, 31 coğrafya/yol hedefi; toplam 138 nokta. 155 karakter, 234 lore/kişi kaydı ve 365 görsel vardır. 197 görsel yeni boya dokulu illüstrasyondur; 52 yeni yerleşimin kendi özgün harita kesiti ayrıca tutulur.

Tekrarlanan kayıt kimliği, eksik bağlantı hedefi, eksik portre veya tanımsız kurum üyesi bulunmadı. Manifestteki bütün görsel dosyaları mevcut; HTTP ve tarayıcı görsel açma kontrolü de geçti. Her yerleşim en az iki metin bölümüne sahip.

95 yerleşimin merkezi özgün 8K çizimden eşleşir. Fehar yaklaşık konumuyla açıkça ayrılır; Frethar farklı kayıttır. Gaalmire/Galmire, Korhenden/Korthen, Toran/Tora ve Serenith/Serenth alternatif yazımları aynı hedefe açılır. Geniş coğrafya işaretleri temsilî merkez, yollar şematik güzergâhtır.

## Otomatik doğrulama

`npm run build` TypeScript kontrolü ve Vite üretim derlemesiyle başarılı oldu. Yeni çizimler ve düzeltmelerden sonra görsel erişim/bestiary testi yeniden geçti.

**82 ayrı Playwright senaryosu doğrulandı.** İlk tam koşuda 76 senaryo geçti. Üç mevcut deneyim testi için katmanın yeni adı, doğrulanmış köy konumları ve mobil okuma fontu düzeltildi. 59 şehrin tek tarayıcı süresine sığmadığı Danstsud turu, bütün şehirleri koruyarak üç teste bölündü. Sonraki sekiz hedefli senaryo geçti; bu koşu iki daha önce geçen testi de yeniden denetledi. Toplam benzersiz doğrulanmış senaryo sayısı 82'dir.

Kapsam: bütün 96 yerleşimde gerçek pin → panel → wiki geçişi; bütün lore bağlantıları; resimler ve portreler; kurum kadroları; tam 12 farklı Taç Şövalyesi; kitap yaprakları; galeri filtreleri ve klavye kullanımı; katmanlar; pan/yakınlaştırma; kamera dönüşü; yer imleri; mobil gezinme; azaltılmış hareket.

## Üretim görünümü

Derlenmiş statik site 320, 390, 820, 1024 ve 1440 piksel genişliğinde atlas, Valdareth, yeni Halden kaydı, On İki Taç Şövalyesi, kitaplık ve galeri üzerinde kontrol edildi: **30 görünümde yatay taşma, görünür kırık görsel veya tarayıcı hatası çıkmadı.** Atlas, mobil okuma ve portre kadrosu ekran görüntüleri ayrıca gözle incelendi.

Bu kayıt üretim dosyalarının ve kaynak kodun doğrulamasını anlatır. Bir barındırma hizmetinde canlı yayın yapıldığını ifade etmez.

## Sonraki kullanıcı konum düzeltmesi — 9 Ekim 2026

Kullanıcının verdiği 31 yer adı eşleştirildi; altı yerleşimin noktası yapı kümeleri üzerinde yeniden seçildi. Haritadaki isimler kullanıcının son yazımlarını tanır. Yeni lore veya görsel üretilmedi.

Fehar’ın reddedilen tahmini noktası kaldırıldı. Veri modeli konumu bilinmeyen kaydı `point: null` olarak tutar; haritada nokta oluşturmaz, kamerayı tahmini bir yere taşımaz ve wikide haritada göster düğmesi sunmaz. Wiki kaydı korunur. Güncel görünür envanter 95 yerleşim ve toplam 137 harita hedefidir; 96 yerleşim kaydı vardır.

Bu düzeltme için **11 ayrı tarayıcı senaryosu geçti**: yazar listesinin tam eşleşmesi; 31 noktanın ve altı düzeltilmiş noktanın özgün görüntü piksellerine göre gerçek ekran hizası; alternatif adlar; bütün harita görünümünde noktaların korunması; yolun güncel şehir noktalarıyla birleşmesi; bilinmeyen konumun gizlenmesi ve wikisinin korunması; şehir kartı/okuma, wiki-kamera dönüşü ve mobil galeri. Son TypeScript/Vite üretim derlemesi başarılıdır. Önceki tam test kaydı yukarıda tarihsel doğrulama olarak korunur.

## Fehar / Frethar eşleştirmesi — 9 Ekim 2026

Yazar Fehar’ı, Vornic ile Pilorn arasındaki Frethar olarak tarif etti. Fehar’ın önceki tahmini konumu yerine özgün çizimin **4860 × 3370 piksel** merkezi kullanılır. Harita etiketi Frethar, mevcut wiki adı Fehar’dır. İki adın atlas/wiki bağlantıları ve yer imleri aynı kanonik kayda gider; ikinci bir yerleşim veya nokta oluşturulmaz. Fehar’ın nüfus kartı, Eryndorn’a vergi bağlılığı, mevcut metinleri ve boyalı kapağı korunur. Frethar’ın özgün harita kesiti de aynı wiki galerisinden açılır. Yeni lore veya görsel üretilmedi.

Güncel envanter **95 yerleşimdir ve tamamının harita noktası vardır**; Danstsud’da 58 yerleşim, bütün haritada 137 hedef bulunur. Önceki 96 kayıt, aynı yerleşimin iki adının birleşmesiyle 95’e indi; haritadaki bir yer kaybolmadı. 365 görsel korunur.

**13 ayrı ilgili Playwright senaryosu doğrulandı.** İlk koşuda 12 senaryo geçti; son Danstsud grubunda ilk harita yüklemesi beş saniyelik başlangıç beklemesini aştı. Başlangıç için Deep Zoom yüklemesini bekleyen görünürlük kontrolünün süresi 15 saniyeye çıkarıldı; aynı grubun 18 yerleşimi ayrı koşuda geçti. Hiçbir nokta veya geçiş kontrolü kaldırılmadı. Üç grubun toplamında Danstsud’un 58 yerleşiminde pin → panel → wiki geçişi denetlendi. Diğer kontroller, yazarın 31 yer adı ve altı konum düzeltmesinin görüntü piksellerine göre hizasını, tek kayıt/tek nokta eşleşmesini, iki adla aramayı, eski bağlantı ve yer imlerini, kraliyet vergi bağını, görselleri ve bütün kamuya açık kayıt bağlantılarını kapsar. Bu hedefli koşu, 86 senaryonun tamamının yeniden çalıştırıldığı anlamına gelmez.

`npm run build` TypeScript ve Vite üretim derlemesiyle geçti. Derlenmiş sitede 1440 ve 390 piksel genişliklerde Fehar/Frethar atlas ve wiki bağlantıları üzerinden **beş görünüm** denetlendi: nokta, panel, başlık ve harita kesiti açıldı; yatay taşma veya tarayıcı hatası görülmedi. Masaüstü harita ekranı ayrıca özgün çizimle gözle karşılaştırıldı.

## Yaşayan ansiklopedi — 10 Ekim 2026

Yüklenen master promptun tam kopyası `EVREN_VE_ANSIKLOPEDI_MASTER_PROMPTU.md` dosyasında tutulur. Kaynak dosyayla SHA-256 eşleşmesi doğrulandı: `dfc24c850a916d7cf60862de27e555e348f468cb500657af540e7d8e0846014b`. Madde karşılıkları, kanon kararları ve yeni yazımlar `YASAYAN_ANSIKLOPEDI_TESLIMI.md` içinde kaydedildi.

### Güncel içerik ve veri

**161 kimliği bilinen kişi, 14 kitap, 371 görsel, 246 genel lore kaydı ve 95 yerleşim** vardır. Yerleşimlerin tamamı noktalıdır; 8 ülke, 3 alt bölge ve 31 coğrafya/yol hedefiyle toplam 137 harita hedefi korunur. Danstsud'un 58 yerleşimi ve Fehar/Frethar'ın tek kaydı değişmedi. Tekrarlanan kimlik, eksik referans, eksik görsel veya noktası olmayan yerleşim bulunmadı.

Her bilinen kişinin altı D&D niteliği 3–20 aralığında ve doğru değiştiriciyle gösterilir. Değerler oyun taslağıdır; çerçeve sınıfı ayrı kalır. Kimliği açıklanmamış üç portreye nitelik veya geçmiş atanmadı. Bütün kitapların okuma seçkileri 400–900 kelime ve üç-dört yapraktır; önceki sekiz eserin özgün metinleri korunur. Bryndon'un kişi/kitap ortak bağlantısında boyalı portre de görünür; eski ve yeni görsel doğru kişi sayfasına gider.

15 şehir yaşam rehberi, 15 kurumun çalışma düzeni, 33 mevcut önemli kişiye ek biyografi ve 12 tekil tür özeti eklenmiştir. Orvelin yük, yem, rakım ve soğukta çalışma taslağı mevcut ekolojiyle birlikte gösterilir. Altı yeni yazarın özgün boya portresi galeriye eklenmiştir; boya dokulu olarak işaretli görsel sayısı 203'tür. Masaüstü kartlar, mobil parşömen ve Bryndon portresi ekran görüntüleri ayrıca gözle incelendi.

### Tarayıcı ve üretim doğrulaması

**117 ayrı Playwright senaryosu doğrulandı.** Tam koşuda 113 senaryo geçti; Fehar başlangıcı, Honud turu ve Danstsud'un ilk iki grubu harita yüklemesinde veya toplam sürede zaman aşımına uğradı. Aynı dört senaryo tek tarayıcıyla yeniden koşuldu ve dördü de geçti. Fehar başlangıç beklemesi, mevcut Deep Zoom kontrolleriyle aynı 15 saniyelik sınırı kullanır. Hiçbir yerleşim, hizalama veya geçiş kontrolü kaldırılmadı. Bu kayıt tek tam koşunun 117/117 geçtiği iddiası değildir; tam ve hedefli koşuların birleşik sonucudur.

Yeni 30 senaryonun kapsamı: bütün karakterler ve nitelikleri; bütün kitapların bütün yaprakları ve özgün metinlerin korunması; yazar/şehir bağlantıları; filtreler; doğrudan bağlantılar ve tarayıcı geçmişi; yer imi, yazı boyutu, klavye ve yaprak kaydırması; yeni portrelerin HTTP erişimi; ortak galeri kimlikleri; şehir/kurum rehberleri; 320, 390, 820, 1024 ve 1440 px menüler; bozuk yerel depolama ve geçersiz URL'lerden toparlanma. Son Bryndon bağlantısı düzeltmesinden sonra **30 senaryonun tamamı yeniden geçti (39,8 saniye)**. Bu tekrar toplam benzersiz senaryo sayısını artırmaz.

Son TypeScript/Vite üretim derlemesi geçti. Derlenmiş statik sitede beş genişlikte Karakterler, parşömen okuyucu, Valdareth, Mereth Vann, Orvel ve Galeri üzerinden **30 görünüm** denetlendi. Yatay taşma, görünür kırık görsel veya tarayıcı hatası görülmedi. Yaprak çevirme de bu kontrolde denendi. Görsel kayıtları `/workspace/artifacts/living-library/` çalışma çıktısında bulunur.

### Özel hazırlık paketi

Altı maceranın çözümleri uygulama dışında, ayrı `Aruzahr-DM-Hazirlik.zip` dosyasındadır. Paket bir rehber ve altı hazırlık olmak üzere yedi Markdown belge içerir; ZIP bütünlüğü ve 30 kişi referansı denetlendi. Kaynak, `public` ve üretim derlemesinde özel paket yolları ve DM işaretleri bulunmadı. Gizli çözümler Git değişikliklerine dahil edilmedi.

## Haritaya bağlı 3D kabartma atlas — 10 Ekim 2026

Kullanıcının istediği master prompt uygulamadan önce `3D_ATLAS_MASTER_PROMPTU.md` dosyasına yazıldı. Gerçek Three.js arazi ağı, 95 şehir maketi, 11 özel şehir mimarisi, sekiz bağımsız yapı, 18 orman alanı, dört nehir yüzeyi ve mevcut beş rota eklendi. Aynı 137 atlas hedefi ve kanonik şehir merkezleri kullanılır. Yeni görünüm varsayılandır; 2D çizim tercihi, motor indirme/WebGL/bağlam arızasında toparlanma ve wiki-kamera dönüşü çalışır. Kabartma, kıyı izleri, yakın yüzey renkleri ve maket planları görsel yorum olarak açıkça kaydedilir.

**22 yeni 3D senaryo ile 17 ilgili mevcut atlas senaryosu doğrulandı.** Eski 16 senaryo tek koşuda geçti; son üretim dosyaları ve ham lore erişimini denetleyen 17. gizlilik senaryosu ayrı koşuda geçti. Yeni 3D tam koşusunda 20 senaryo geçti; bir ek testteki dağ alanının son yakınlaştırmasına ilişkin yanlış sabit beklenti, gerçek hedefte durmuş kamera kontrolüyle düzeltildi ve aynı senaryo ayrı koşuda geçti. Son su/renk malzemesi düzenlemesinde iki ilgili katman/atmosfer senaryosu tekrar geçti. Motor dosyası indirme arızası kontrolü eklendikten sonra yeni ziyaretçi, wiki-kamera dönüşü, WebGL yokluğu ve indirme hatası olmak üzere dört senaryo tekrar geçti. 22 yeni senaryonun sonucu bu koşuların birleşimidir; tek tam koşunun 22/22 geçtiği iddiası değildir. Depoda toplam 139 senaryo vardır; bütün eski senaryolar bu görevde yeniden çalıştırılmadı.

Kapsam: gerçek geometri ve 95 merkez; özgün piksel konumlarının bağımsız 3D projeksiyonu; 95 noktanın paneli; doğrudan kale geometrisi seçimi; sürükleme/döndürme; kamera ve wiki; tüm katmanlar; yerel kar/buhar; atmosfer kapatma ve azaltılmış hareket; beş ekran genişliği; hatalı depolama ve grafik/yükleme arızaları. Eski senaryolar 31 ad + altı konum düzeltmesinin 2D hizasını, yolları, wiki ve görsel ilişkilerini, galeri/bestiary, mobil gezinme ve Fehar'ın tek kaydını koruduğunu denetledi.

Son TypeScript/Vite üretim derlemesi ve `git diff --check` geçti. Derlenmiş uygulamada toplam **20 görünüm** incelendi: yedi dünya/şehir/dağ görünümü; beş genişlikte Valdareth ve Marhalden; ayrıca aktif kar, buhar ve Lakbar. Yatay taşma, kayıp dönüş kontrolü veya beklenmeyen tarayıcı hatası çıkmadı. Seçili ekranlar gözle de incelendi. Dar sahnede 18.032 arazi köşesi / 1.260 ağaç; masaüstünde 40.247 köşe / 2.173 ağaç vardır. Bunlar geometri bütçesi ve gözlenen sahne sayılarıdır; FPS garantisi değildir.

8K kaynak dosyanın SHA-256 değeri korunur: `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`. İki WebP doku türevi üretildi; `npm run assets` önbelleği ve üretim sürümü 2 doğrulandı. Özel DM paket yolu kaynak/public/dist taramasında bulunmadı. Kapsam, dosya karşılıkları ve yorum sınırları `3D_ATLAS_TESLIMI.md` içindedir. Haricî canlı yayın bu doğrulamanın kapsamı değildir.

## 10 Ekim 2026 — yalnızca Danstsud, isteğe bağlı 3D düzeltmesi

Kullanıcının yeni talebi önceki tüm dünya 3D kapsamını daraltır. Başlangıç 2D; Danstsud 3D aç/kapat düğmesi; 58 Danstsud modeli; çizime bağlı dokuz kapalı dağ alanı. Tahmini kıyı/dağ şeritleri, suyu yükselten şehir tabanları, yakınlık yüzünden gizlenen modeller ve yakın yüzeydeki sade biyom geçişi kaldırıldı.

- `npm run build`: başarılı.
- `tests/relief.spec.ts`: 24/24 geçti (2,9 dakika). Son mimari düzenlemelerden sonra model, gerçek üçgen sınırları ve gerçek bina tıklamasıyla ilgili 3/3 senaryo tekrar geçti (41,1 saniye); bu koşuda dışa bakan çatı yüzleri ve yüzey üstündeki tüm model tabanları da kontrol edildi.
- Son 3D işaret düzenlemesinden sonra kaynak piksel hizalama, 58 şehir tıklaması/model görünürlüğü ve beş ekran genişliğiyle ilgili 7/7 senaryo yeniden geçti (2,3 dakika).
- `experience.spec.ts`, `atlas-refresh.spec.ts`, `pin-alignment.spec.ts`: 16/16 geçti (1,6 dakika). Eski 2D kamera, rota, kart/wiki, mobil okuma ve kanonik nokta hizalamaları korundu.
- `atlas.spec.ts` yayımlanan içerik/geliştirme sunucusu gizlilik kontrolü: 1/1 geçti.
- Yerel üretim derlemesi: 20 görünüm, JavaScript/konsol hatası ve taşma yok. 11 özel kent, genel görünüm, Fehar/Telvai, Karlan/Frostmere ve 320–1024 piksel dar görünümler incelendi.
- Kaynak harita SHA-256 değişmedi: `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`.

Toplam arşiv 141 senaryodur; tamamı bu düzeltmede tekrar koşulmadı. Eski tüm dünya 3D kayıtları tarihçedir; güncel uygulama ve sınırlar [Danstsud 3D teslim kaydındadır](../arsiv/3D_ATLAS_TESLIMI.md). Üretim görüntüleri ve koşu kayıtları `/workspace/artifacts/danstsud-3d/` altındadır.

## 10 Ekim 2026 — kaynak resmi kullanmadan sıfırdan Danstsud haritası

Kullanıcının açıklaması üzerine master prompt uygulamadan önce yeniden yazıldı. 3D motorundaki özgün resim/doku yükleme ve yakınlaşma sırasında 4096 piksel resme geçiş kaldırıldı. Kıyı/göl vektörlerinden yeni kara, deniz altı tabanı ve bağımsız deniz geometrisi oluşturulur. Arazi renkleri programatiktir. 58 kanonik yerleşim, 11 dağ alanı (Lowvale sırtları dahil), yedi doğal orman alanı, dört ana nehir ve Serenith’in kuzey kolu, Frostmere, tarla parçaları ve üç bağımsız yapı gösterilir. Başlangıç 2D; 3D isteğe bağlıdır ve harita içindeki düğmeyle de kapanır.

Son 3D koşusu: **`tests/relief.spec.ts` 24/24 geçti, tek worker ile 5,1 dakika.** Kaynak deniz kontrol noktaları ve diğer ülkeler; bütün modellerin kanonik merkezleri ve dışa bakan çatıları; iki kalite düzeyindeki gerçek dağ üçgenleri; gerçek arazi üzerinde model/orman temelleri; sudan dışlanan ağaçlar; nehir üçgenlerinin görünürlüğü; göl UV’leri ve denize batmayan güzergâhlar; kaynak resim isteği olmaması; 58 noktanın doğru paneli; doğrudan bina seçimi; kamera/wiki/yeniden yükleme; katmanlar, atmosfer, hareket azaltma; motor/GPU hataları; başka ülkeye geçiş ve beş ekran genişliği doğrulandı.

`experience.spec.ts`, `atlas-refresh.spec.ts`, `pin-alignment.spec.ts` içindeki **16 mevcut senaryo** aynı çalışma içinde geçti. Bu 16 senaryo, son yalnızca 3D coğrafya eklemesinden önceki karma koşudadır; 2D uygulama ve kanonik kayıtlar bu eklemede değişmedi. Karma 40 senaryolu ara koşunun sonucu 38 başarılı, iki zaman aşımıdır; tamamı geçti diye sunulmaz. Son 3D koşusu ayrıca bütünüyle başarılıdır. İlk uygulama kontrolünde nehirlerin yamaç içine girmesi ve wiki dönüşünde kameranın ezilmesi bulundu ve düzeltildi. Yeniden kurulan 3D motorunun hazır olma beklemeleri ilk açılıştaki 30 saniyelik beklemeyle eşitlendi; yazılım WebGL ile eşzamanlı görüntü incelemesinin zaman aşımını önlemek için son koşu tek worker ile yapıldı. İlk açılışın hareketsiz kontrolü azaltılmış hareketle yürütülür; gerçek hava animasyonu ayrı senaryolarda sınanır. Senaryo veya doğrulama devre dışı bırakılmadı.

`npm run assets` üretim sürümü 3 ile doğrulandı; yalnızca eski üretilmiş `relief-2048.webp` / `relief-4096.webp` türevleri temizlenir. 2D yakınlaştırma katmanları korunur. `npm run build` ve `git diff --check` başarılıdır. Özgün 8K dosyanın SHA-256 özeti değişmedi: `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`.

Güncel kapsam [teslim kaydında](../arsiv/3D_ATLAS_TESLIMI.md), çalışma alanı kanıtları `/workspace/artifacts/danstsud-rebuilt/` altında bulunur. Önceki resim üzerine kabartma ekleyen teslimler tarihçedir; yeni 3D görünüm özgün çizimi zemin olarak göstermez. Tam 141 senaryoluk arşiv yeniden çalıştırılmadı.

Son üretim çıktısı için gizlilik senaryosu ayrıca **1/1 geçti** (1,3 saniye). Son yerel üretim derlemesiyle **23 görünüm** incelendi: Danstsud geneli, 11 özel kent, Fehar/Telvai, Karlan/Frostmere, Lowvale’de Rymar/Eldwen/Lysmar ve 320/390/820/1024 piksel görünümler. JavaScript/konsol hatası, yatay taşma veya seçilen şehrin modelinin kaybolması tespit edilmedi. Genel sahnede 58 yerleşim modeli, 245.503 arazi köşesi, 4.970 ağaç ve 298 çizim çağrısı ölçüldü; dar görünüm 77.976 köşe ve 2.883 ağaç kullanır. Bunlar denetlenen sahnenin ölçümleridir, cihazlar arası FPS vaadi değildir. `production.json`, `final-*.png`, `tests-release.log`, `tests-regression-and-intermediate.log`, `tests-privacy-release.log` ve `build-release.log` çalışma alanı kanıtlarıdır. GitHub’a kaynak kod yüklemek canlı site dağıtımının doğrulandığı anlamına gelmez.

## 10 Ekim 2026 — kıyı, akarsu, şehir mimarisi ve Kral Yolu geliştirmesi

Güncel master prompt uygulamadan önce yazıldı. Lirendil’in kuzey kıyısı ve Valdareth’in liman/nehir ağzı yeniden çizildi; akarsu ağı ortak birleşim noktalarıyla dokuz şeride çıkarıldı. Marhalden’in kapalı dağ alanı, terasları, iki yakadaki kaleleri ve iki kademeli şelalesi eklendi. On bir özel kent; kurumları, kemerleri, sütunları, iskeleleri, atölyeleri ve yerleşim düzenleriyle ayrı modellendi. Valdareth’te beş düzensiz sur, yoğun mavi-mor mahalleler, kraliyet kalesi, obsidyen kilise, Derinkilit ve gemili liman bulunur. Lirendil’in büyük kütüphanesi, kıyı feneri ve kervanları; Elorwyn’in ruhban/paladin yerleşkeleri; Theramis’in kuvars sütunları ve çeşmeleri; Dorvenhall’in işlikleri ve askeri yapıları; Hardlane’in ayrı düzenleri korunur.

Yeni doğal yüzey malzemeleri, yumuşak normalli dallı ağaçlar, görüş merkezine/ölçeğe bağlı orman ayrıntısı ve güneş gölgeleri kullanılır. Kral Yolu, kara üzerinde 51 yerleşime bağlanır; batıdaki yedi Hardlane yerleşimi kraliyet ağına dahil edilmez. Yol koridorlarında ağaç üretilmez. Özgün resim 3D zeminde kullanılmaz; 58 merkez, 2D başlangıç, isteğe bağlı 3D, wiki ve başka ülkeye dönüş korunur.

### Son kontroller

- `npm run build`: TypeScript ve Vite üretim derlemesi başarılı.
- `tests/relief.spec.ts`: **25/25 geçti, tek worker ile 8,6 dakika**, son yüzey ve ışık geçişinden önce tek tam koşu. Yeni bağımsız kontrol kıyının kendini kesmemesini, Lirendil’in kuzeyindeki denizi, başkentteki su ağzını, 51 kraliyet bağlantısının uçlarını ve her yol parçasının karada kalmasını denetler. Yol katmanının gerçekten açılıp kapanması da kontrol edilir.
- 3D kontrolleri ayrıca 58 model/pin, dışa bakan çatı yüzleri, iki geometri kalitesindeki dağ sınırları, gerçek arazi üstündeki model/orman tabanları, nehir yüzleri, gerçek bina seçimi, sürükleme/döndürme, klavye/tekerlek, wiki ve kamera saklama, kar/buhar, hareket azaltma, motor/GPU arızaları, beş ekran genişliği ve diğer ülkeye dönüşü kapsar.
- `experience.spec.ts`, `atlas-refresh.spec.ts`, `pin-alignment.spec.ts`: **16 benzersiz mevcut senaryo doğrulandı**. İlk koşuda 15 başarılı, bir ilk yakınlaştırma beklemesi başarısızdır. Aynı uygulama kaynaklarıyla bu kamera/wiki senaryosu ayrı ve tek worker koşusunda geçti (14,4 saniye). Bu 16 sonucu tek başarılı tam koşu olarak sunmuyoruz.
- `atlas.spec.ts` üretim/geliştirme sunucusu gizlilik senaryosu: **1/1 geçti**. Ham lore ve özel DM paketi uygulama çıktısına eklenmedi.
- Son üretim önizlemesi yeniden başlatılıp tek tarayıcıyla **23 görünüm** incelendi: genel görünüm, 11 özel kent, Fehar/Telvai, Karlan/Frostmere, Rymar/Eldwen/Lysmar ve 320/390/820/1024 px Valdareth. Ek bir görüntü bütün kraliyet yol ağını gösterir. JavaScript/konsol hatası, yatay taşma veya seçili modelin kaybolması görülmedi.
- Son görsel geçiş, taş derzlerini/kiremit sıralarını, kaya katmanlarını, eğime göre kar örtüsünü, tarla sıralarını ve eğik güneş ışığını iyileştirir. Bu kaynaklardan üretim derlemesi tekrar geçti (`build-polish.log`); aynı **23 görünüm yeniden incelendi ve hata bulunmadı** (`production-polish.log`, güncel `production.json`). Son kaynakta model/iki kalite coğrafyası, doğrudan bina seçimi ve kamera hareketi, orman/su/kış katmanları, soğuk/ılık bölgeler/buhar/hareket azaltma için seçilen **5/5 senaryo da geçti, 1,7 dakika** (`tests-polish.log`). Bu beş senaryo önceki 25’in alt kümesidir; ayrı yeni senaryolar diye sayılmaz. Son malzeme geçişinden sonra 25’in tamamı yeniden çalıştırılmadı.
- `git diff --check`: başarılı. Kaynak 8K dosyanın SHA-256 özeti değişmedi: `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`.

### Ara koşularda düzeltilenler

Daha yoğun ilk sahnede RAF zamanı, kurulumdan önceki kareye ait olabiliyordu; negatif süre kamera/hava interpolasyonunu ters yöne götürüyordu. Süre artık negatif olamaz; kamera geçişinin gerçek zaman sonu vardır, ilk hava saydamlığı geçerli aralıkta başlar. Sabit sahnenin gölgesi her karede yeniden üretilmez. Orman ayrıntısı yakınlaştırma kadar görüş merkezine de bağlıdır.

İlk 3D koşusu bu sorunları incelemek için durduruldu: 9 başarılı, 5 başarısız, bir kesilmiş ve 10 çalıştırılmamış senaryo. Ayrı hareket koşusunda dört senaryo geçti; son kamera hedefi kontrolünde metin olarak tam eşitlik yerine 0,01 dünya birimi konum toleransı kullanıldı. Yakınlaştırma testi üst sınırdan daha fazla büyümeyi beklemek yerine dışarı/içeri tekerlek hareketini ve 14 sınırını denetler. Gerçek sürükleme noktası bilgi panelinin dışındaki canvas üzerinde doğrulanır. Dört yeniden kurulum yapan kamera/wiki senaryosunun toplam bütçesi 120 saniyedir; her kurulumun hazır olma sınırı 30 saniye olarak kalır. Hiçbir işlev kontrolü kapatılmadı. Son 25 senaryolu koşu bütünüyle başarılıdır.

Çalışma alanı kanıtları `/workspace/artifacts/danstsud-refined/` içindedir: `production.json`, `production-polish.log`, `final-*.png`, `royal-roads.png`, `build-release.log`, `build-polish.log`, `tests-release.log`, `tests-polish.log`, `tests-intermediate.log`, `tests-motion.log`, `tests-regression.log`, `tests-2d-camera.log`, `tests-privacy.log`. Valdareth ve Marhalden’in son üretim görüntüleri ayrıca `lore/onizlemeler/` içinde GitHub’dan incelenebilir. Son sahne masaüstünde **424.530 arazi köşesi / 4.970 ağaç**, dar görünümde **117.459 köşe / 2.883 ağaç** kullanır. Genel görünümde 58 yerleşim ve üç anıt görünürdür. Bunlar doğrulanan geometri ve sahne ölçüleridir; cihazlar arası FPS garantisi değildir.

Arşiv toplamı 142 senaryodur; bu görevde arşivin tamamı tekrar çalıştırılmadı. Şehir planları ve kabartma görsel yorumdur. Diğer ülkeler 2D’dir; karakter/hayvan illüstrasyonlarının elle boyanmış üslubu ve mevcut lore değişmedi. GitHub kaynak yüklemesi haricî bir canlı site dağıtımının doğrulandığı anlamına gelmez.


## 11 Ekim 2026 — işaretli dağ kuşakları, kent dokusu ve 3D remaster

Son isteğin ayrıntıları uygulamadan önce [3D master promptuna](../tasarim/3D_ATLAS_MASTER_PROMPTU.md) eklendi. Rydorn, Dorvenhall, Lowvale ve Karlan'ın işaretli boşlukları dört kesintisiz sırt alanıyla tamamlandı; on iki yerel zirve alanı korunur. Ilıman kuşaklarda açık kaya, Karlan/Hardlane'de eğime bağlı kar bulunur. Yeni yükseklik alanından pigment, normal ve pürüzlülük haritaları üretilir. Özgün 8K çizim 3D doku değildir.

58 yerleşim kanonik noktalarında kalır. Büyük kentlere mesken mahalleleri ve sokaklar; Lirendil'e kare alt gövdeli, galerili/çokgen üst katlı anıtsal fener eklendi. Frostbay harabeleri ve Ternhaven'in eski ocak evleri yıpratıldı. Marhalden köprüsü, kaynak nehir kesimine dik yerleştirildi; ayakları araziye iner ve iki bankaya sokaklarla bağlanır. Vadiyi seçince daha yukarıdan bakılır. Başkentin beş suru ve yoğun mavi-mor çatıları korunur.

209 komşu düzensiz tarım parseli su, dağ, soğuk zemin ve şehir merkezlerinden dışlanır. Hacimli yaprak/iğne taçları, gövde ve dallar yakın/uzak ayrıntı kullanır; ormanlar tarla ve yol koridorlarına girmez. 51 kraliyet bağlantısı ve Frostbay merkezli sekiz yerel bağlantı ayrı ağlardır; ikisi de ilk açılışta görünür. “Yollar” fiziksel ağları, “Ticaret yolları” güzergâh vurgularını yönetir. Yuvarlanan yol köşeleri kıyıya karşı denetlenir. Cevher Çizgisi tamamlanmış yol sayılmaz. Siyah etiket kutuları yerine sakin harita yazıları, daha dar bir başlangıç kadrajı ve telefon için çakışmayan alt açıklama kullanılır.

### Koşular ve düzeltilen sorunlar

- `npm run build`: son kaynakla başarılı (`build-release.log`). Vite'ın mevcut büyük paket uyarısı sürer; derleme hatası yoktur.
- Tam `tests/relief.spec.ts` koşusu: **25 başarılı / 1 başarısız, 12,4 dakika** (`tests-release.log`). Kamera ve iki yol kontrolünün ardışık akışı toplam 60 saniyeyi aştı. Bu sonuç 26/26 başarılı diye sunulmaz.
- Kamera akışının toplam bütçesi 120 saniyeye çıkarıldı; her işlemin ayrı doğrulama sınırı korunur. Sonraki tekrar, katman düğmesinin durumuyla sahnenin geç eşleştiğini yakaladı. Katman durumu artık hareketsiz/azaltılmış hareket görünümünde de hemen uygulanır. Çizim aralığı, eski RAF zaman damgası yerine çizimin bitişinden ölçülür; yavaş GPU'da ardışık telafi çizimleri kullanıcı girdisini boğmaz.
- Bu düzeltmelerden sonra ilgili **6/6 senaryo geçti, 3,6 dakika** (`tests-polish-final.log`): bütün model geometrileri, nehir yüzleri, kamera/yol kontrolleri, gerçek bina seçimi, orman/su/kış, atmosfer/hareket azaltma.
- Son köprü konumu ve telefon açıklama düzeniyle **3/3 senaryo geçti, 37,1 saniye** (`tests-final-details.log`): 58 model, 320 ve 390 pikselde kontrol/panel/2D dönüşü. Bu üç ve önceki altı senaryo, 26'lık kümenin alt kümeleridir. Son kamera açı göstergesi üretim incelemesinde de kontrol edilir. Son kaynağın bütün 26 senaryosu tek koşuda tekrar çalıştırılmadı; koşuların birleşiminde 26 farklı 3D senaryosunun başarılı sonucu bulunur.
- Mevcut 2D atlas, wiki, görseller, yollar ve pinpoint kontrolleri: **16/16 geçti, 2 dakika** (`tests-2d-final.log`). `experience.spec.ts`, `atlas-refresh.spec.ts`, `pin-alignment.spec.ts` çalıştırıldı.
- Özel DM içeriğinin kaynak/varlıklara taşınmadığı kontrol: **1/1 geçti** (`tests-privacy-final.log`).
- Ara orman tepe yüzeyleriyle orman/su/kış kontrolü **1/1 geçti, 45,1 saniye** (`tests-canopy-recheck.log`). Bu ara sürümün görsel incelemesinde düz yaprak kartlarının yıldız/disk gibi görünmesi yeterince düzelmedi; son sürüm bunların yerine yumuşak normalli hacimli taçlar kullanır. Önceki denemede geliştirme görünümü “Atlas açılıyor” durumunda kaldı ve 3D bileşeni 30 saniyede bulunamadı (`tests-canopy-final.log`); modülün HTTP 200 yanıtı kontrol edildikten sonra aynı kaynakla tekrar başarılı oldu. İlk başarısız deneme saklanır; nedeninin kesin olarak ayrıştırıldığı iddia edilmez.
- İlk hacimli orman koşusunda **2 başarılı / 1 başarısız** sonuç alındı (`tests-volumetric-final.log`): iki kalite katmanında arazi/model/ağaç zeminleri ve orman/su/kış geçti; kamera akışı son yol düğmesinde toplam 120 saniyeyi aştı. Uzak taç geometrisi hafifletildi ve pahalı yaprak kabartma örneklemesi kaldırıldı; yakındaki dallı taçlar korundu. Bu düzeltmelerle kamera/yol kontrolleri ve orman/su/kış **2/2 geçti, 1,4 dakika** (`tests-forest-lod-final.log`). İşlem doğrulamaları veya süre sınırları bu tekrar için değiştirilmedi.
- Uzak taçların silueti ve normalleri son kez yumuşatıldıktan sonra kamera/yol akışı **1/1 geçti, 1,1 dakika** (`tests-final-camera.log`). Önceki iki senaryodan biridir; yeni bir senaryo diye sayılmaz. Son üretim derlemesi de bu kaynakla başarılıdır.

İlk tanı sırasında görsel kuzey kırpmasının yönlendirme ızgarasını kaydırarak Velthar bağlantısını bozduğu bulundu. Yol ızgarasının başlangıcı kamera kırpmasından bağımsız, sabit kaynak koordinatına döndürüldü. Yeni dağlarda bir Doğu Aldara yüzünün kaya içine girmesi de yakalandı; nehir üçgenleri yalnız gerekli yerlerde bölünerek gerçek arazi yüzeyini izler. Ara koşular ve başarısız tekrarlar kanıt dizininde saklanır; bunlar son başarılı koşularla karıştırılmaz.

Son üretim sürümü tek tarayıcıyla **26 görünümde** incelendi (`production-release.log`, `production.json`): genel harita, 21 şehir/coğrafya yakın planı ve 320/390/820/1024 piksel Valdareth görünümleri. JavaScript/konsol hatası, yatay taşma veya seçili şehir modelinin kaybolması bulunmadı. Marhalden'in köprüsü/vadisi, Lirendil'in feneri, Frostbay harabeleri, genel harita ve telefon görünümü görsel olarak incelendi. Altı güncel PNG [teslim belgesinde](../arsiv/3D_ATLAS_TESLIMI.md) bulunur. Bu 26 görünüm, 26 Playwright senaryosunun tek tam başarılı koşusu anlamına gelmez.

Sahne ölçüleri: masaüstünde **394.893 arazi köşesi / 8.699 ağaç**, dar görünümde **109.039 köşe / 4.175 ağaç**; iki kalitede **209 tarım parseli**. Yeni arazi yüzey haritaları sırasıyla **1536×945** ve **768×472** pikseldir. Genel görünümde 58 yerleşim ve üç anıt, toplam 61 model görünür. Bunlar sahne ölçüleridir; cihazlar arası FPS veya CK3/AAA kalite garantisi değildir. `git diff --check` başarılıdır.

Arşiv toplamı 143 senaryodur; tamamı yeniden çalıştırılmadı. 8K kaynağın SHA-256 özeti yeniden kontrol edildi ve değişmedi: `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`. Çalışma alanı kanıtları `/workspace/artifacts/danstsud-remaster/` içindedir. Diğer krallıklar 2D'dir; mevcut lore, portre/yaratık illüstrasyonlarının elle boyanmış üslubu ve özel DM paketi değiştirilmedi. Kaynak kodun GitHub'a yüklenmesi haricî canlı dağıtımın doğrulandığı anlamına gelmez.

## 24 Ekim 2026 — D&D Yayın Masası ve Yük ve Söz

`/#/broadcast` ayrı bir yönetim masası; `/#/broadcast/live` temiz 16:9 yayın sahnesidir. Özgün Deep Zoom haritası, kaynak UV koordinatındaki yuvarlak taşlar/kalem/ok/silgi, taşınabilir ve boyutlandırılabilir çoklu görsel katmanları, şehir/mekân arka planları ve sesli animasyonlu zar eklendi. Yerel görseller IndexedDB ile saklanır; doğrulanan JSON yedeğine dahil edilir. Yayın görüntüsü hem aynı profilin BroadcastChannel bağlantısına hem Vite dev/preview üzerindeki yerel SSE bağlantısıyla ayrı OBS profiline ulaşır. Kullanılmayan görseller, gizli katmanlar ve DM defteri yayın iletisine girmez.

Beş kısa macera aynı Marhalden–Harven–Mavric–Frostbay yük sözleşmesine bağlandı. Dört kamusal kişi, dört yerel mekân ve bir kültür kaydı, dört portre/iki sahne illüstrasyonu eklendi. Yeni kişilerin altı D&D niteliği düzenlenebilir oyun taslağıdır. Koşullu çözümler ve karşılaşmalar deponun dışında özel MD/JSON/ZIP paketindedir; kamusal sonuçlar oynanmış kanon gibi yazılmadı. Özel paketin beş kimliği kamusal kancalarla eşleşir; ZIP dosyaları güncel MD/JSON ile bayt düzeyinde aynı kontrol edildi.

Doğrulanan sonuçlar:

- Kilit dosyasından `npm ci` başarılı; Node 24.19.0. Eski ortamda eksik Three bağımlılıkları geri yüklendi. Paket/lock sürümleri değiştirilmedi.
- Son `npm run build`: TypeScript ve Vite üretim çıktısı başarılı (`build-final.log`). Mevcut büyük paket uyarısı sürer.
- Yeni dört yayın test dosyası: **26/26 geçti, 1,7 dakika** (`tests-final.log`). Güvenli zar örneklemesi, gerçek toplam, yerel resim doğrulama/küçültme, IndexedDB, dosya yedeği, bozuk dosya reddi, kamera/taş/çizim koordinatları, sürükleme/boyutlandırma, ayrı profil üzerinden gerçek sahne ve çoklu zar eşleşmesi, bağlantı önbelleği kaybında yeniden yayın, özel veri ayrımı ve 390 px düzeni kontrol edildi.
- Son sabit/kaydırılabilir kütüphane düzeninden sonra aynı yayın kullanım kümesi **8/8 geçti, 1,4 dakika** (`tests-final-layout.log`). Son çizim sınırı düzenlemesiyle ilgili senaryo **1/1 geçti** (`tests-final-drawing.log`). Bunlar önceki 26'nın alt kümeleridir, yeni ayrı senaryolar diye sayılmaz.
- Görevler arasında özel notların korunması ve serbest notun ayrı dosyaya indirilmesi eklendikten sonra ilgili özel DM ayrımı senaryosu **1/1 geçti, 18,7 saniye** (`tests-final-dm.log`). Düzenlenen özel paket/serbest metin yayın iletisine, genel sahne yedeğine veya izleyici DOM'una taşınmaz. Bu senaryo da 26'lık kümenin alt kümesidir.
- Mevcut atlas/wiki/galeri/yol/pin hizası: `experience.spec.ts`, `atlas-refresh.spec.ts`, `pin-alignment.spec.ts` **16/16 geçti, 1,5 dakika** (`tests-atlas-regression.log`).
- Tam 165 kişi için altı nitelik/portre eşleşmesi, kaynak-varlıklarda özel DM işareti bulunmaması ve dizin/wiki aynı değerleri gösterimi: **3/3 geçti, 3,6 saniye** (`tests-roster-privacy.log`). Eski sabit 161 beklentisi dört yeni kişi için 165'e güncellendi; bilinmeyen arşiv portrelerine kimlik veya nitelik atanmaz.
- Üretim önizlemesi ayrı sunucuda incelendi (`production-final.log`, `production.json`): yeni Aktarma Avlusu ve iki yeni portre, ayrı profilde 1920×1080 temiz OBS sahnesi, özgün haritada yuvarlak portre/rota, 390 px görünüm. JavaScript/konsol hatası veya yatay taşma bulunmadı. Uzun kütüphane kaydırılırken sahne yerinde kalır. Özel görev dosyası üretim sunucusundan okunamadı. Üç güncel görüntü [Yayın Masası rehberinde](../kullanim/YAYIN_MASASI.md) bulunur.
- `bash -n Yayini-Baslat.sh` ve `git diff --check` başarılıdır. Windows `.cmd` dosyası Linux ortamında çalıştırılmadı; kullandığı npm/atlas/sunucu komutları doğrulandı.

Ara koşular saklanır: ilk birleşik yayın koşusu 23/23 geçti (`tests-complete-first.log`); SSE eklenirken çalışan geliştirme sunucusunun yeniden yüklenmesiyle bir form taslağı sıfırlanması gözlenen sonraki 25'lik koşu **24 başarılı / 1 başarısızdır** (`tests-release.log`). Kaynak güncellemeleri durdurulduktan sonraki 26'lık koşu bütünüyle geçti. Bu ara başarısızlık gizlenmez veya son başarılı koşu diye sayılmaz.

Çalışma alanı kanıtları `/workspace/artifacts/broadcast/` içindedir. Koşuların birleşiminde **45 farklı ilgili senaryonun başarılı sonucu** bulunur; bütün 170 test arşivi tekrar çalıştırılmadı. 8K kaynak SHA-256 özeti değişmedi: `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`. Normal atlasın 3D coğrafya kaynakları bu görevde değiştirilmedi. Kaynak yüklemesi haricî bir canlı barındırmaya dağıtım değildir. Yerel OBS bağlantısı aynı sunucuyu gerektirir; sıradan statik barındırma için aynı tarayıcıdaki yayın penceresi yakalanabilir.


## 25 Ekim 2026 — On Kış Kararı, ara ekranı ve sıfırlama

- `npm run build` geçti. TypeScript hatası yok; mevcut büyük parça uyarısı sürüyor.
- Yayın kontrolleri: ilk tam çalıştırmada 30/31 geçti; eski temiz-sahne testi yeni tam ekran düğmesini beklemiyordu. Kontrol yeni davranışa göre düzeltildi. Sonraki tam çalıştırmada **31/31**, ek F/reduced-motion kontrolünde **1/1** geçti: **32 farklı yayın senaryosu**.
- Rehber yerleşimi ve özel yedekten etkin görevin notunu geri getirme düzeltmesinden sonra alt küme **6/6**, uyumluluk/gizlilik ve telefon alt kümesi **2/2** geçti. Son 4K tipografi/zar ölçeklemesinden sonra çözünürlük kontrolleri **2/2**, gerçek zar/telefon alt kümesi **2/2** tekrar geçti. Alt kümeler farklı yeni testler gibi sayılmadı. Bir ara komut elle kesildi; son derleme ve ilgili kontroller yeniden tamamlandı.
- Atlas/wiki/pin regresyonları **16/16**, kişi dizini/statları/özel bilgi sınırı alt kümesi **3/3** geçti. Böylece çalışma boyunca **51 farklı ilgili senaryo** başarıyla doğrulandı. Tam 177 senaryolu arşiv ve ağır 3D testleri bu işte baştan çalıştırılmadı; 3D kaynakları değişmedi.
- Üretim önizlemesinde gerçek özel paket içe aktarıldı: **10 görev / 30 sahnenin tamamı** dolaşıldı, bütün arka planlar ve kişi resimleri yüklendi. Ayrı tarayıcı profilindeki 3840×2160 sahne tam alanı doldurdu. Ara ver/dön, 390 px yatay taşma ve gizli metinlerin yayın ekranında bulunmaması kontrol edildi. Tarayıcı hatası: **0**. Kanıtlar çalışma alanındaki `artifacts/onkis/production.json` ve ilgili ekran görüntülerinde; özel DM ekran görüntüleri depoya eklenmedi.
- Şifreli teslim dosyasında yanlış şifre reddi ve doğru şifreyle ZIP indirme gerçek Chromium'da sınandı. ZIP özel kaynak dosyayla bayt düzeyinde aynı; parola yayımlanan HTML'de yok. Eski beşli paket de ZIP içinde korunur. Doğrudan `file://` açılması yönetilen tarayıcı politikasıyla engellendiği için doğrulama yerel HTTP üzerinde yapıldı.
- 20 görsel gözle incelendi. İlk fazla gerçekçi üretimler kullanılmadı; daha çizilmiş/yağlıboya biçimde yeniden üretildi. Bera ve Iven'in sahne içi kimlikleri portrelerine göre düzeltildi. Kaynak boyutları görsel kaydında açıktır; 4K yerleşim yerel 4K sanat iddiası değildir.
- `git diff --check` temiz. Gerçek OBS masaüstü veya Windows başlatıcısı bu Linux ortamında çalıştırılmadı; OBS'nin ayrı profiline eşdeğer yerel röle ve üretim sunucusu tarayıcılarla sınandı.

## 25 Ekim 2026 — hazırlık/canlı yayın stüdyosu

Kullanıcının bütün yayın geliştirme kapsamını istemesiyle `/#/broadcast` yeni stüdyoya geçti. Önceki masa `/#/broadcast/classic` altında korunur. Sözleşme [stüdyo master promptunda](../tasarim/YAYIN_STUDYOSU_MASTER_PROMPTU.md), kullanım [kılavuzda](../kullanim/YAYIN_STUDYOSU_KULLANIM.md), tamamlanan özellikler ve kamuya uygun ekran görüntüleri [teslim belgesinde](../arsiv/YAYIN_STUDYOSU_TESLIMI.md) bulunur.

### Koşuların gerçek sonuçları

- İlk 20 yeni senaryo koşusu **19 başarılı/1 başarısızdı**: özel kampanya indirme düğmesi iki yerde bulunduğu için test seçimi belirsizdi. Seçim ilgili panele sınırlandı.
- Sonraki 27 senaryo **24 başarılı/3 başarısızdı** (`studio-suite.log`). Ara dönüş düğmesinin iki yerde olması ve geçiş sırasında iki sahnenin görünmesi test seçimlerini belirsizleştirdi. Gruplu sürükleme geri alma kontrolü ise gerçek bir hatayı yakaladı: React StrictMode, yan etkili güncelleyicide geçmişi iki kez tüketiyordu. Durum değişimi ve geçmiş işlemleri tek uygulamaya geçirildi.
- Genişletilen 31'lik koşu **29 başarılı/2 başarısızdı** (`studio-suite-release.log`): yedekten açılan rehberde yeniden hazırlama yapılmadan yayın düğmesinin etkin olması beklenmişti; doğru davranış, önce hazırlama istemesidir. Ses durum seçimi de iki satırla eşleşiyordu. Kontroller bu davranışları açıkça sınayacak biçimde düzeltildi.
- Sonraki yeni 32 senaryonun tamamı **32/32 geçti, 2,4 dakika** (`studio-tests-final.log`).
- Eski yayın/atlas kontrolünde **45/48 geçti, 3,8 dakika** (`studio-regression.log`). Üç eski rehber testi, yeni kapalı düzenleme alanındaki aynı metinle de eşleşiyordu; seçim okunacak olay paragrafına sınırlandı. Bu koşudaki 16 atlas/wiki/pin kontrolünün tamamı geçti.
- Yayınların birleşik 66'lık koşusu **65 başarılı/1 başarısız, 5 dakika** (`studio-all-broadcast-final.log`). 34 yeni stüdyo senaryosu geçti. Klasik masadaki sıfırlama varsayılan yeni rotaya dönüyordu; klasik masada kalacak biçimde düzeltildi. Ses/rehber ve iki yeni ses kontrolünü içeren son alt küme **20/20 geçti, 2,1 dakika** (`studio-tests-polish.log`). Eski sıfırlama kontrolü de bu kümede geçti. Önceki canlıda kullanılan sesin silinmemesi ve efektin sayfa yenilenince yeniden çalmaması doğrulandı.
- Ses dosyası kimliği/içeriği bütünlüğü de doğrulandıktan sonra kampanya paketi kümesi **6/6 geçti, 30,7 saniye** (`studio-package-final.log`): medya/DM/ilerlemeyi yeni profilde açma, bozuk resim ve ses reddi, kimlik birleştirme, gerçek kapalı pikseller, sıfırlama ve yayından kalkmış bir sahneyi yerel arşivden hazırlama.
- Üretim görüntüsünü gözle incelemek, yönetim masası küçük canlı önizlemesinin sunucuda varlık yayımlanmadan önce 404 alıp bozuk kalabildiğini gösterdi. Bu özel önizleme artık yerel doğrulanmış görsel arşivini kullanır. Hazırlık/canlı, iptal, önceki yayın, yeniden açma ve iki önizlemedeki gerçek resim kontrolü **1/1 geçti, 8,8 saniye** (`studio-preview-regression.log`). Son üretim akışında aynı kontrol 30 sahnenin tamamına uygulandı.
- Mevcut kişi dizini/altı nitelik/özel kaynak sınırı **3/3 geçti, 3,5 saniye** (`studio-roster-privacy.log`).
- Son `npm run build` TypeScript/Vite çıktısı başarılıdır (`studio-build-verified.log`). Mevcut büyük paket uyarısı sürer. Paket/lock bağımlılık sürümleri değiştirilmedi.

Böylece koşuların birleşiminde **87 farklı ilgili senaryonun başarılı sonucu** vardır: 36 yeni stüdyo + 32 eski yayın + 16 atlas/wiki/pin + üç kişi/gizlilik. Alt kümeler ikinci kez sayılmadı. Bu kayıt tek 87'lik temiz koşu iddiası değildir. Güncel arşiv **213 senaryo** içerir; tamamı ve ağır 3D senaryoları bu çalışmada yeniden çalıştırılmadı. Normal atlasın coğrafya/model kaynakları değişmedi.

### Gerçek sunucu ve üretim akışı

Ayrı bir Vite sunucusu 5274 portunda gerçekten kapatılıp yeniden açıldı (`artifacts/studio/recovery.json`). Canlı kare ve varlıklar yeniden geldi; yayımlanmamış hazırlık kaldı; ayrı izleyici profilinde özel hazırlık görünmedi. Tarayıcı hatası yoktu. Bu deneme çalışan 5173 geliştirme sunucusunu durdurmadı.

Derlenmiş uygulamanın 4197 üretim önizlemesinde gerçek On Kış Kararı JSON'u açıldı; 10 görevden 30 kayıtlı sahne üretildi ve **30/30 sahne hazırlanıp ayrı profilde yayına alındı**. Arka plan, portre ve yönetim canlı önizlemesi resimlerinin tamamı yüklendi. Gizli özetler kamu iletisinde yoktu. Ana görüntü ve beş ek çıktı 3840×2160 boyutta; portre/zar/inisiyatif gerçek alfa arka planıyla doğrulandı. 390 px görünümde yatay taşma yoktu. Son üretim akışı JavaScript hatası: **0** (`artifacts/studio/production.json`, `production-final.log`). Masaüstü, ana görüntü ve telefon ekranları gözle incelendi; depodaki ekran görüntülerinde özel not bölümü kapalıdır.

Şifreli HTML'nin yanlış şifreyi reddettiği ve doğru şifreyle verdiği ZIP'in özel kaynak ZIP'le bayt düzeyinde aynı olduğu Chromium'da sınandı. Parola değişmedi ve depo taramasında bulunmadı. ZIP'te eski beşli paket korunur; yeni sürümde Taren'in erken sahnelerdeki bilinen adları ve stüdyo kılavuzu bulunur. Toplam altı dosyadır. Açık özel DM JSON/Markdown, kaynak veya uygulama varlıklarına kopyalanmadı. Yeni kampanya yedeği bilinçli olarak özel verileri içeren, kullanıcıya indirilen ayrı bir dosyadır; canlı protokol ve eski kamusal yedek bu bilgileri içermez.

`git diff --check`, `bash -n Yayini-Baslat.sh` ve `bash -n Yayini-Uzaktan-Baslat.sh` geçti. Yeni hazır 12 WAV dosyası proje için prosedürel olarak üretildi; dış kayıt veya müzik kullanılmadı. Yeni illüstrasyon üretildiği iddia edilmez. Gerçek OBS masaüstü ve Windows başlatıcısı bu Linux ortamında çalıştırılmadı. OBS WebSocket 5 kimlik doğrulaması/sahne geçişi taklit protokol sunucusunda, görüntü ve tek ses sahipliği gerçek ayrı Chromium profillerinde sınandı. Telefon/oylama erişilebilir ağ/sunucu ister; Twitch entegrasyonu veya otomatik internet barındırması değildir. GitHub kaynak güncellemesi haricî canlı site dağıtımı olarak sunulmaz.


## 25 Ekim 2026 — haritadan çıkış ve görev düğmelerinin anlaşılması

Yayın Masası haritasına açık kapatma düğmeleri ve Esc ile sahneye dönüş eklendi. Şehre odaklanma seçimi sonrasında liste boş duruma döner ve odağı bırakır; aynı yeri yeniden seçmek mümkündür ve fare tekerleği odaktaki listeden yeni şehir seçmez. Harita incelemesi görev sahnesinin başlığını değiştirmez. Görevden haritaya geçiş, eski sahnenin hazır işaretini kaldırır.

Aynı arka planı kullanan adımların ayrı olay/araştırma/karar aşamaları olduğu rehberde açıklanır. Hazırlama sonrasında görünür durum bildirimi vardır. Hazırlıkta kalmış ara ekranı yeni resmi örtebiliyordu; hazırlama artık ara/perdeyi kapatır. Canlıya geçiş ayrı komut olarak kalır. Görev görselleri ve lore değiştirilmedi.

İlk iki yeni senaryodan biri otomatik kaydın 700 ms gecikmesini beklemeden kamera değerini okuyup hata verdi; test kayıt oluşmasını bekleyecek biçimde düzeltildi. Son hedefli koşu **9/9 geçti, 1,2 dakika** (`map-exit-regression.log`): seçim odağı/tekrarı, gerçek pan/zoom sonrası kameranın geri sıçramaması, düğme/Esc ile çıkış, aynı resimli üç adımın açıklaması, hazırlıkta aranın kaldırılması ve özel metnin canlıya çıkmaması; eski rehber/ara/sıfırlama ve harita/işaret uyumluluğu. Yeni dosya iki farklı senaryo ekler; arşiv toplamı 215'tir. Önceki geniş doğrulama bu küçük düzeltme için baştan tekrarlanmadı.

Son kaynakla üretim derlemesi başarılıdır (`map-exit-build-final.log`). İki yeni senaryo telefon genişliğinde hazırlık bildirimi kontrolü eklenerek **2/2, 14,7 saniye** tekrar geçti (`map-exit-final.log`); önceki dokuzun alt kümesidir. `git diff --check` temizdir.


## 25 Ekim 2026 — karanlık yağlıboyalar ve Oynatım Kitabı

Kullanıcının son netleştirmesi **“Yağlıboya: karanlık, ciddi, yüksek ayrıntı”** oldu. Pixel art talebi yoktur. On Kış Kararı'nın 12 geniş sahnesi ve sekiz portresi sıfırdan, 20 ayrı üretimle değiştirildi. Kaynaklar geniş sahnelerde 1672×940/941, portrelerde 1086×1448 pikseldir. Toplu resimden kesilmedi; büyütme, kırpma veya keskinleştirme uygulanmadı. PNG → kayıpsız WebP dönüşümünde **20/20 resmin ham piksel eşitliği** doğrulandı (`artifacts/runbook/lossless-check.log`). 4K yayın düzeni 4K kaynak resim diye sunulmaz. Kimlikler/yollar korunur; galeriye 20 ayrı yeni kayıt eklenmiş sayılmaz. [Dosyalar ve ölçüler](../arsiv/ON_KIS_KARARI_YENI_BASKI.md).

Özel Oynatım Kitabı yaklaşık 9.700 kelimelik okuma sürümüdür: on bölümde önceki bağlam, geliş yolu, amaç, kişiler/istekleri/ilk karşılaşmaları; 30 sahnede başlangıç, okunacak söz, sıralı olaylar, diyaloglar, sorular ve sonraki geçiş yazıldı. Mekanik kontroller/karar yankıları korunur. Geniş DM okuma masası klavye odağı/Esc/telefon düzeniyle açılır. İlk bölümün giriş görseli ayrı hazırlanıp yayına alınabilir. Aynı kitabın güncel JSON'u mevcut adımı/kararları/tamamlanmayı korur; dosyadaki açık ilerleme önceliklidir. Eski v1/v2 paketleri açılır.

Şifreli paket güncel JSON/Markdown yanında bölüm bağlantılı çevrimdışı özel HTML kitap içerir; eski beşli macera korunur. ZIP toplam **yedi dosyadır**. Parola aynı kalır ve depoya yazılmaz. Açık özel metinler, JSON ve çevrimdışı kitap yalnız özel çalışma klasöründedir. Yeni yüklemede ayrıca siteyi güncellemek ve yeni paketin JSON'unu açmak gerekir; mevcut yerel dosya kendiliğinden yeniden yazılmaz.

Doğrulama:

- `npm run build`: TypeScript/Vite üretim çıktısı başarılı (`runbook-build-release.log`). Mevcut büyük paket uyarısı sürer; bağımlılık sürümleri değişmedi.
- İlk birleşik koşu **27 başarılı / 1 başarısızdı** (`runbook-tests.log`): IndexedDB kaydını gecikmeli kayıttan önce okuyan beklenti yakalandı. Kayıt beklemesi düzeltildi; ayrıca yönetici sahipliği kazanıldığında özel paket durumunun ilk kez eşitlenmesi sağlandı.
- Son birleşik koşu **35/35 geçti, 3,3 dakika** (`runbook-tests-final.log`): yeni kitap doğrulama/okuma masası/açılış/ilerleme koruması/20 görsel; stüdyo, paket, haritadan çıkış ve önceki yayın rehberi/ara/sıfırlama akışları. Aynı testler tekrar sayılmadı.
- Kişi dizini/nitelikler ve açık kaynak-varlıklarda özel görev içeriğinin bulunmaması **3/3 geçti, 3,6 saniye** (`runbook-roster-privacy.log`). Bu üç senaryo önceki 35'in dışında; bu çalışmada toplam **38 farklı ilgili senaryo** geçti.
- Gerçek özel JSON, üretim önizlemesi 4197 üzerinde açıldı. Bölüm girişi ve **30/30 adım** hazırlanıp ayrı izleyici profiline yayımlandı; arka planlar, portreler ve yönetim canlı önizlemesi yüklendi. Giriş ve özel özetler izleyicide yoktu; 30 sahnede oynatım alanları görüldü. Ana görüntü ve ek çıktılar 3840×2160 olarak kontrol edildi; üç ayrı katman çıktısının gerçek alfa arka planı doğrulandı. 390 px görünümde yatay taşma ve JavaScript hatası bulunmadı (`artifacts/runbook/production.json`).
- Şifreli HTML yanlış parolayı reddetti; doğru parolayla indirilen ZIP özel kaynak ZIP'le bayt düzeyinde eşleşti. ZIP iç bütünlüğü ve güncel JSON eşleşmesi de kontrol edildi. Kaynak/dist taramasında açık özel kitap veya parola bulunmadı.

Geniş özel okuma masası ve yönetim görünümü gözle incelendi. [Masaüstü](../gorseller/yayin-studyosu.png) ve [telefon](../gorseller/yayin-studyosu-telefon.png) ekranları güncellendi; depoya özel metin içeren okuma masası ekranı konmadı. Çalışma alanı kanıtları `artifacts/runbook/` içindedir; halka açık teslim belgesi özel anlatımı içermez.

Güncel arşiv **219 senaryo** içerir; tamamı veya ağır 3D senaryoları yeniden çalıştırılmadı. Coğrafya ve şehir modelleri bu çalışmada değişmedi. Gerçek OBS masaüstü/Windows başlatıcısı bu Linux ortamında çalıştırılmadı; üretim çıktıları ayrı Chromium profillerinde incelendi. GitHub güncellemesi haricî site dağıtımının doğrulandığı anlamına gelmez.


## 25 Ekim 2026 — sade hikâye akışı ve şifresiz hazır kampanya

Kullanıcının son isteği mevcut stüdyonun karmaşıklığını azaltmak; nerede/ne zaman/ne yapılacağını ve hangi resmin gösterileceğini tek akışta sunmaktı. `/#/broadcast` artık varsayılan **Sade Hikâye Masası**dır; önceki tüm araçlar **Gelişmiş masaya geç** altında korunur. Aynı proje ve yayın bağlantısı kullanılır. İki görev yönetmeni aynı anda çalışmaz. Bölüm/seçim/ileri-geri okumak yayını değiştirmez; **Bu sahneyi göster** doğru resmi ve portreleri hazırlayıp yayımlar. Hazırlama ayrı da kullanılabilir. Bölüm girişi kendi ilk-sahne geçişini, görev sonu ise sonraki bölümü gösterir; giriş düzenlemesi bölümün son bağlantısını ezmez.

Kullanıcı “şifre işine gerek yok içinde gelsin direkt” diyerek sağlanan On Kış Kararı senaryosunun şifresiz yayımlanmasını açıkça istedi. Hazır 10 bölüm/30 sahne, doğrulanan kısa yer/zaman/amaç/sonra alanları ve görsel eşleşmeleri `public/dm/` içinde gelir. Yönetim ekranı kayıtlı proje geri yüklendikten ve sahiplik alındıktan sonra açar. Önceki on görevlik dosya yalnız eksik sunum alanları/bilinen eski görsel eşleşmeleriyle zenginleşir; düzenlenen metin, başka kampanya, kişisel not, karar ve ilerleme korunur. Yükleme sırasında içe alınan başka paket sonradan hazır kitapla ezilmez. Canlı/telefon iletisi ve genel wiki DM metni almaz. Eski parola depoda yoktur.

Şifresiz JSON, Markdown, çevrimdışı HTML kitap, kısa yol haritası ve açıklama; **beş dosyalı ZIP** olarak da verilir. `scripts/build-dm-downloads.mjs` bu çıktıları JSON'dan deterministik üretir. ZIP iç bütünlüğü ve JSON bayt eşleşmesi kontrol edildi. İndirme gerekmeksizin hikâye açılır; eski indirme adresinde parola formu yoktur. Hazır kitabın yayımlanması kullanıcının sonradan yazdığı kişisel notları yayımlamaz.

Sekiz **ayrı** yeni karanlık, ciddi, ayrıntılı yağlıboya: yük avlusu, yeraltındaki eski sıcak su galerisi, un ambarı, odun yolu, su kapısı, dış iskele, bahçe kayıt odası ve iki depo. Her biri **1672×941** kaynak ölçüsündedir; kayıpsız WebP dönüşümünde ham PNG pikselleriyle **8/8 eşitlik** doğrulandı, büyütme/kırpma yoktur. Eski 12 sahne ve sekiz portre korunur; bu maceranın toplamı 20 sahne ve sekiz portredir. Yeni tablolar galeri/yayın kütüphanesinde kayıtlıdır ve ilgili adımlara bağlıdır. 4K yayın düzeni, kaynakların yerel 4K üretim olduğu anlamına gelmez. Kaynak/ölçü kanıtı `artifacts/simple-story-art/report.json`.

### Doğrulama ve düzeltmeler

- Son `npm run build`: TypeScript/Vite başarılı (`simple-story-build-delivery.log`). Bağımlılık sürümleri değişmedi; mevcut büyük paket uyarısı sürer.
- İlk 46'lık birleşik koşu **44 başarılı / 2 başarısız, 3,8 dakika** (`simple-story-tests-first.log`). Gösterge yerel program güncellemesini erken “yayında” sayıyordu; gerçek sunucu ACK'si eklendi. İkinci sorun, eski paket testinin temiz profilde artık varsayılan olan sade ekrandan gelişmiş masaya geçmemesiydi; test geçişi açıkça seçer.
- ACK düzeltmesi sonrası birleşik koşu **45 başarılı / 1 başarısız, 3,7 dakika** (`simple-story-tests-final.log`). Bekleyen kare POST'u sırasında “Yayına gönderiliyor…” kontrolü geçti. Sonraki beklenti, geçiş animasyonunun önceki ve güncel iki başlığını aynı seçiciyle bulduğu için katı seçici hatası verdi; yalnız ana güncel çıkış hedeflendi. İlgili üç sade senaryo **3/3, 13,8 saniye** geçti (`simple-story-tests-details.log`). ACK yalnız başarılı frame yanıtından sonra gönderilen karenin `takenAt` değerinden alınır; yeni sahiplik/kontrol kaybında sıfırlanır.
- Görsel incelemede bölüm girişinin “buradan sonra” metninin bölüm sonuna atladığı görüldü. Açılışın kendi revir geçişi kullanıldı; girişte düzenleme bölümün son bağlantısını değiştirmez. Son 11'lik kısa akış/paket koşusu **10 başarılı / 1 başarısızdı** (`simple-story-tests-release.log`); yeni düzenleme kontrolü, textarea'nın içeriğini de eşleyen tam etiket seçicisinde bekledi. Aynı alan erişilebilir `textbox` adıyla hedeflendi. Son üç sade akış senaryosu **3/3, 14,3 saniye** geçti (`simple-story-tests-release-details.log`). Test seçicisi değişti; zaman sınırı gevşetilmedi.
- Kişi nitelikleri/dizini, yetkilendirilmiş hazır kitap ile wiki/kişisel kayıt ayrımı ve galeri yazarı bağlantıları **4/4, 8,7 saniye** geçti (`simple-story-tests-library.log`).

Koşuların birleşiminde **50 farklı ilgili senaryo** geçti: 35 eski yayın/stüdyo/kitap uyumluluğu + 11 yeni hazır kampanya/sade akış/geri yükleme/sıfırlama + dört kişi/gizlilik/galeri. Alt kümeler tekrar sayılmaz; tek 50'lik temiz koşu iddiası değildir. Güncel arşiv **230 senaryo / 25 dosyadır**; tamamı, ağır 3D ve değişmeyen atlas coğrafyası bu çalışmada yeniden sınanmadı.

### Gerçek üretim akışı

Son derlenmiş sürüm 4197 üzerinde sıfır depolu yönetim profiliyle açıldı: ilk görünüm sade, kitap şifresiz hazırdı. **10 bölüm girişi + 30 görev adımı = 40 sahne** hazırlanıp ayrı 3840×2160 izleyici profiline gönderildi. Arka plan ve portreler yüklendi; yalnız okumak canlı kareyi değiştirmedi; her gösterimde gerçek ACK sonrasında durum “yayında” oldu. Alt+N → Alt+Enter adımı da doğru sahneyi hazırlayıp gösterdi. 390 px ve 3840 px yönetim görünümlerinde yatay taşma yoktu. Parolasız indirme gerçek ZIP'le bayt düzeyinde aynıydı. İzleyici hazır DM JSON'u için **0 istek**, JavaScript hatası **0** (`artifacts/simple-story/production.json`, `production-final.log`).

Masaüstü, telefon ve yeni tablolar gözle incelendi. Üç güncel görüntü [kısa rehberde](../kullanim/SADE_HIKAYE_MASASI.md). Bu görüntüler hazır, yayımlanmasına izin verilen hikâyeyi gösterir; kullanıcıya ait özel not içermez. `git diff --check`, etkin belge bağlantıları ve eski parolanın depo dışında kalması kontrol edildi. Gerçek OBS masaüstü/Windows başlatıcısı bu Linux ortamında çalıştırılmadı. GitHub kaynak güncellemesi haricî site dağıtımının doğrulandığı anlamına gelmez.

Teslim öncesi Markdown satır sonu boşlukları üretim betiğinde temizlendi. Son üretim derlemesi tekrar geçti; beş ZIP dosyasının tamamı kaynakla ve yeni ZIP’in tarayıcıdan indirilen baytlarıyla eşleşti (`artifacts/simple-story/download-final.log`). Bu paket biçim düzeltmesi için hikâye akışı yeniden değiştirilmedi.


## 26 Ekim 2026 — GitHub dosya düzeni

Kökteki özgün kaynaklar `kaynaklar/`, yedi başlatıcı `baslat/`, kullanım/tasarım/teknik/sürüm kayıtları `docs/` altında toplandı. Danstsud yazar metinleri `lore/danstsud/` içinde kaldı. Uygulama `web/` dizinindedir; web görselleri ve hazır DM dosyalarının adresleri değişmedi. README kısaltıldı ve görev odaklı giriş tablosu eklendi. Her ana bölüm için dizin sayfası oluşturuldu. Eski dosya konumları `docs/gelistirme/DEPO_DUZENI.md` içinde açıklanır.

145 taşımanın 102'si özgün kaynak dosyasıdır; hepsinin SHA-256 özeti önceki konumuyla eşleşti. Dosya adı/içeriği korunur; Broken Oath ve boş `aaa` yüklemesi silinmeden kaynak arşivine ayrıldı. 212 göreli belge bağlantısı geçerli bulundu (`artifacts/repo-organization/verification.json`). Git bağlantı/yaratıcı rehber yolları ve 2D harita üretim betiği yeni konuma göre güncellendi.

Dört Bash başlatıcısı sözdizimi ve `/tmp` çalışma klasöründen yalıtılmış Node/npm komut taklitleriyle kontrol edildi; gerçek bağımlılık kurulumu veya yeni sunucu bu denemede çalıştırılmadı. Üç Windows dosyası tırnaklı `..\web` yolları ve CRLF için statik kontrol edildi (`launchers.json`); Windows/Finder masaüstü bu Linux ortamında çalıştırılmadı.

`npm run assets` yeni `kaynaklar/haritalar/Aruzahr 8k (1).jpg` kaynağından 8192×5668 atlas katmanlarını ve kapakları başarıyla üretti (`assets.log`). `npm run build` TypeScript/Vite çıktısı başarılıdır (`build.log`); mevcut büyük paket uyarısı sürer. İlk üç senaryoluk koşu iki başarılı/bir başarısızdı: eski `/@fs/.../Valhunar.pdf` yolu artık bulunmadığı için SPA HTML yanıtı 200 döndü. Gizlilik kontrolü gerçek yeni PDF/DOCX konumlarına taşındı; bu dosyaların üçü de 403 ile engellenir. Son ilgili koşu **3/3, 11,1 saniye** geçti (`tests-final.log`): özgün harita/ülke/wiki/geri dönüş, derlemede ham kaynak ve eski görev sırlarının bulunmaması + yeni kaynak yollarının engellenmesi, varsayılan sade hikâye/ayrı oyuncu çıktısı. Ara ve hedefli kontrol logları saklanır.

230 senaryoluk tüm arşiv ve değişmeyen 3D katmanı bu dosya düzenleme çalışması için yeniden çalıştırılmadı. Bağımlılık sürümleri, karakter/lore verileri ve kullanıcı kayıt biçimi değiştirilmedi. `git diff --check` ve dosya bütünlüğü kontrolleri geçti. Kanıt dizini `artifacts/repo-organization/` içindedir.
