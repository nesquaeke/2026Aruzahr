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
