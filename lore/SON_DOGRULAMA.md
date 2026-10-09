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
