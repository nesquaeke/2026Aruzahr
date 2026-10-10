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

Toplam arşiv 141 senaryodur; tamamı bu düzeltmede tekrar koşulmadı. Eski tüm dünya 3D kayıtları tarihçedir; güncel uygulama ve sınırlar [Danstsud 3D teslim kaydındadır](3D_ATLAS_TESLIMI.md). Üretim görüntüleri ve koşu kayıtları `/workspace/artifacts/danstsud-3d/` altındadır.
