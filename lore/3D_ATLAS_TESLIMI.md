# Aruzahr — isteğe bağlı Danstsud 3D teslimi

10 Ekim 2026. Bu kayıt ve [güncel master prompt](3D_ATLAS_MASTER_PROMPTU.md), kullanıcının ilk 3D uygulamasına verdiği düzeltme isteğini karşılar. Önceki tüm dünya kabartması kaldırıldı; **3D kapsamı yalnızca Danstsud**, başlangıç görünümü 2D'dir.

## Kullanım

“Danstsud 3D” düğmesindeki Aç/Kapat aynı yerde gerçek 3D görünümü açar veya kapatır. Danstsud'da seçilmiş yer korunur. Ana kamera Danstsud'u çerçeveler; başka ülke seçilince normal harita açılır. Önceki sürümün 3D tercihi/kamerası yeni görünümü otomatik başlatmaz. Kullanıcının yeni tercihi tarayıcıda hatırlanır.

Sürükleme taşır; tekerlek/iki parmak yakınlaştırır; sağ sürükleme eğimi ve yönü değiştirir. Üstten/eğimli bakış, kuzeye dönüş, kamera sıfırlama, ok tuşları ve +/− çalışır. Nokta veya gerçek bina geometrisi aynı mevcut bilgi panelini açar. Wikiye gidip dönünce geçerli kamera hatırlanır.

## Düzeltilen sorunlar

- **Denizdeki ve çizimde bulunmayan dağlar:** 14 geniş tahmini dağ omurgası, kara/kıyı yükseltisi ve suyu kabartan şehir tabanları kaldırıldı. Dokuz kapalı alan yalnızca Danstsud'daki dağ çizimlerine bağlıdır. Alan sınırında sıfır yükseklik tamponu gerçek üçgenlerin dışarı taşmasını önler. Deniz ve diğer ülkelerin kaynak yüzeyi düzdür.
- **Eksik görünen şehirler:** Danstsud'un 58 yerleşimi ortak kayıttan modellenir. Büyük/küçük yerleşimlere uygulanan yakınlık eşikleri kaldırıldı. Görüş alanındaki modeller her yakınlıkta vardır; seçilmiş şehri kullanıcının yerleşim katmanını kapatması da gizlemez.
- **Yakında kaybolan coğrafya:** kaynak doku yakınlaşınca tahmini sade biyom renkleriyle değiştirilmez. Kıyılar, tarlalar, özgün nehirler ve etiketler her ölçekte korunur. Tahmini deniz maskesi ve oval göl maketi de kaldırıldı.
- **Yapı okunabilirliği:** eğimli çatılar, dışa bakan çatı yüzleri, kapı/pencereler, bacalar, sur dişleri ve küçük yerleşim yapı varyasyonları eklendi. Valdareth'te beş düzensiz sur arasında daha okunabilir ev/çatı siluetleri vardır.
- **Genel görünümün yükü:** küçük yerleşimler görünür kalırken ek gölge çizimlerinden çıkarıldı. 1440 piksel üretim kontrolünde Danstsud genel görünümü 292 çizim çağrısıdır; dar şehir görünümleri 44–45 çağrıdır. Bunlar ölçülen sahnelerdir, cihazlar arası FPS vaadi değildir.

## Gerçek kapsam

| İçerik | Yeni uygulama |
| --- | --- |
| Yerleşimler | Danstsud'da 58 model; diğer 37 yerleşim normal 2D atlas/wiki içinde |
| Dağ alanları | Rydorn'da iki, Dorvenhall'da iki; Karlan/Hardlane'de beş kapalı ayak izi |
| Ormanlar | Danstsud'da 13 alan; 2.155 masaüstü / 1.250 dar görünüm ağacı |
| Nehirler | Doğu Aldara, Batı Aldara, Serenith ve Teyra; gerçek üçgen yüzeyinden örneklenen ince şeritler |
| Bağımsız yapılar | Thural Kalkanı, Thessar Açığı Feneri, Runeth Kuzeyi Harabeleri |
| Ticaret | Mevcut Danstsud hatları; açık, tehlikeli ve planlanan durumları korunur |
| Hava | Yerel soğuk/yükselti karı, Ternhaven buharı; orman/su/kış kontrolleri |

11 büyük/özel kentin mimarisi ayrıdır: Valdareth'in beş suru, kalesi, obsidyen mabedi ve feneri; Marhalden'in iki kale/köprü/atölyesi; Dorvenhall'in sınır kalesi; Elorwyn'in mabet/paladin avlusu; Theramis'in akademi ve araştırma kuleleri; Lirendil'in Çelik Kalkan salonu; Frostbay'in taş dairesi; Dranthol'un liman kalesi; Ternhaven'in sıcak su havuzu; Kaldmere'in barınakları; Vyssgard'ın depoları/iskeleleri. Diğer Danstsud yerlerinde ev kümeleri ve şapel, değirmen, ambar veya gözetleme silueti bulunur. Maket varyasyonları yeni kanonik bina sahibi veya lore iddiası değildir.

Atmosfer kapatıldığında veya hareket azaltıldığında parçacıklar temizlenir, su/hava hareketi durur. Görünmeyen sekmede döngü durur. Atlas kapatıldığında GPU kaynakları ve dinleyiciler temizlenir. Motor indirimi, WebGL, başlangıç dokusu veya grafik bağlamı başarısızsa aynı seçili yerle 2D atlas açılır.

## Kaynak sınırı

8192 × 5668 `Aruzahr 8k (1).jpg` değişmedi. SHA-256: `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`. 2048/4096 piksel dokular mekanik türevlerdir. Tüm şehir merkezleri mevcut kanonik UV noktalarından gelir. Fehar/Frethar tek kaydı ve önceki altı şehir düzeltmesi korunur.

Özgün çizim bir yükseklik ölçümü veya mimari plan değildir. Dağ ayak izleri ve zirve biçimleri çizim üzerinden elle sınırlandırılmış gösterim yorumudur; gerçek metreyle ölçülmüş arazi iddia edilmez. Nehir ve orman katmanları düzenlenebilir görsel izlerdir. Kaynak kıyılarının yerine tahmini kara çokgenleri kullanılmaz. Başka ülkelerde 3D arazi veya şehir oluşturulmaz. Halka açık lore, karakter illüstrasyonları, kart çerçeveleri ve özel DM paketi değiştirilmez.

## Doğrulama

**24 Danstsud 3D senaryosu ve 17 ilgili eski atlas/gizlilik senaryosu geçti.** Son mimari değişikliklerden sonra üç ilgili model/yüzey/tıklama senaryosu yeniden geçti. Şehir işaretleri inceltildikten sonra piksel hizalama, 58 şehir tıklaması ve beş ekran genişliğiyle ilgili yedi senaryo da yeniden geçti. Tam 141 senaryoluk arşiv bu görevde yeniden koşulmadı.

Yeni kontroller: 2D başlangıç ve ihtiyaç halinde motor yükleme; aç/kapat; 58 ayrı modelin tam çatı geometrisi ve kanonik merkezi; kaynak deniz noktalarında sıfır yükseklik; diğer ülkelerde sıfır yükselti; masaüstü/dar gerçek arazi üçgenlerinin kapalı dağ alanları içinde kalması; her şehirde yüzey üstündeki model tabanı; nehir yüzeylerinin arazi üstünde kalması; bağımsız piksel projeksiyonu; 58 noktanın kendi paneli ve görünür modeli; gerçek kale geometrisine tıklama; kamera/katman/wiki/takma ad/yol akışı; yerel hava/azaltılmış hareket; motor indirimi ve grafik bağlamı sorunları; başka ülkeye çıkış; bozuk kamera kaydı; 320, 390, 820, 1024 ve 1440 piksel yerleşimleri.

`npm run build` ve `git diff --check` başarılı. Özgün harita özeti değişmedi. Yerel **üretim derlemesinde 20 görünüm** kontrol edildi: genel Danstsud, 11 özel kent, Fehar, Telvai, Karlan/Frostmere ve dört dar ekran. JavaScript/konsol hatası, yatay taşma veya kapalı kalan model tespit edilmedi.

Çalışma alanı kanıtları `/workspace/artifacts/danstsud-3d/` altında: `source-footprints.png` kaynak/ayak izi karşılaştırması; `final-*.png` son üretim görünümleri; `production.json` sahne ölçümleri; `tests-first.log`, `tests-model-final.log`, `tests-label-final.log`, `tests-2d.log`, `tests-privacy.log` koşu sonuçları. Bunlar web sitesine veya özel DM paketine eklenmez.
