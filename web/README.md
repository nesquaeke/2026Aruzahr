# Aruzahr — uygulama notları

React 19, TypeScript, Vite ve OpenSeadragon ile Türkçe interaktif atlas. Node.js 22.12 veya üzeri gerekir; mevcut bulut ortamında Node.js 24.19.0 kullanılır.

## Kurulum ve çalıştırma

Depo kökündeki `BASLAT.bat` veya `bash baslat.sh` yerel kurulumu yapar. Elle çalıştırmak için:

```bash
cd web
npm ci --no-audit --no-fund
npm run assets
npm run dev -- --host 127.0.0.1 --open
```

Bulut çalışma dizini `/workspace/2026Aruzahr/web`; npm önbelleği için `npm --cache /workspace/.cache/npm ci --no-audit --no-fund` kullanılabilir. Sunucu 5173 portunda çalışır. Süreçler yeni ortamda yeniden başlatılır.

`npm run assets`, depo kökündeki `Aruzahr 8k (1).jpg` dosyasından Deep Zoom katmanlarını üretir. Özgün çizimi değiştirmez; SHA-256 eşleştiğinde mevcut katmanları yeniden kullanır. Hazır illüstrasyonlar `public/illustrations/` içinde sürümlenir; yeni kurulumda görsel üretmek gerekmez.

```bash
npm run build
npm test
```

Tarayıcı testleri varsayılan olarak `/usr/bin/chromium` kullanır. Farklı makinede Chromium yolunu `PLAYWRIGHT_CHROMIUM_PATH` ile belirt. Playwright sunucuyu başlatır veya çalışan geliştirme sunucusunu kullanır.

## Harita verisi

`src/data.ts` genel wiki, sekiz ülke ve yerleşim verisini birleştirir. `map-corrections.ts` özgün 8192 × 5668 çizime göre 43 eski konumu düzeltir ve 52 yeni yerleşim ekler. Toplam 96 yerleşimin her biri bilgi paneline ve dolu wikiye bağlıdır. 95 yerleşim kaynak çizimle eşleşir; Fehar’ın reddedilen tahmini noktası kaldırıldı, wiki kaydı korundu. Frethar ile birleştirilmez.

`map-landmarks.ts`, Aldara'nın iki kolu, Serenith, Teyra, Thural Kalkanı, Karlan sırası, Valdareth Ovası ve belirgin etiketsiz yapıları ekler. `map-features.ts` toplam 31 coğrafya/yol kaydını ve beş şematik güzergâhı tanımlar. Sekiz ülke ve üç alt bölgeyle haritada 137 hedef vardır. Deniz ve geniş alan işaretleri temsilî merkezlerdir; coğrafi sınır ölçümü değildir.

`Atlas.tsx` görüş alanındaki yerleşim noktalarını ülke seçimi veya uzak yakınlık yüzünden gizlemez. Çakışan yazılar azalırken 44 piksel etkileşim alanlı noktalar korunur. Ekran dışı noktalar klavye sırasına girmez. Coğrafya başlangıçta açık, yollar kapalıdır; seçilen rota kendi duraklarına odaklanır. Cevher Çizgisi tamamlanmamış proje olarak ayrı gösterilir. Güncel şehir koordinatları yol çizgilerinin de kaynağıdır.

Arama alternatif yazımları tanır; `Galmire`, `Korthen`, `Tora` ve `Serenth` aynı kanonik kayıtlara gider. Tam ad/koordinat envanteri ve belirsizlikler [harita denetiminde](../lore/HARITA_KONUM_DENETIMI.md) saklanır. Harita kamerası sessionStorage, yer imleri localStorage içinde tutulur.

## Wiki, kadrolar ve görseller

`presentation.ts`, `mapped-place-dossiers.ts` ve `world-dossiers.ts` şehir kartlarını birleştirir: nüfus, yönetim, iklim, geçim ve göreli güçler. Yeni nüfuslar kurgusal tahmin olarak not edilir. Özgün Frostbay/Dranthol sayıları korunur.

`lore/characters.ts`, Danstsud ve dünya kadro modülleriyle 155 karakteri sunar. `InstitutionRoster.tsx` şehirleri askerî/dinî/akademik kurumlara, kurumları portreli üyelere bağlar. On İki Şövalye kadrosunda tam 12 farklı kişi bulunur. `CharacterCard.tsx` ve `character-card-profiles.ts` birleşik dövüş/büyü/siyasi nüfuza göre dört çerçeve sınıfını uygular; açıklanmamış portreler sınıflandırılmaz.

`WikiArticle.tsx` şehir pasaportu, merak kartları, kurumlar, portreler ve galeriden sonra konuya göre seçilebilen lore bölümlerini sunar. Kartlar, tam okuma, sakin okuma, bölüm adımları, gerçek kaydırma ilerlemesi ve içindekiler aynı metne erişir. Büyük Kırılma mevcut 16 bölümlük genel tarih anlatısını ve karşılaştırmalı tarih deneyimini korur.

`Bookshelf.tsx` ile `lore/books.ts` sekiz kısa kitabı eski/yasak/kayıp raflarında ve çevrilebilir parşömen yapraklarında sunar. `GalleryHub.tsx` bütün 365 görseli kategori, arama ve özgün arşiv filtresiyle gösterir. Büyütülmüş galeri ok tuşları ve Escape ile kullanılabilir; görselin ilgili wiki sayfası açılabilir.

`media.ts`, portre ve boyalı görsel manifestleriyle kaynakları birleştirir. 197 yeni boyalı illüstrasyon ve 52 yeni yerleşim için özgün haritadan kesit bulunur. Birincil kapaklar/portreler yeni resimsel sürümleri seçer; önceki görseller arşivde korunur. Görsellerin kaynak ve gerçek üretim sayıları [görsel kaydında](../lore/GORSEL_URETIM_KAYDI.md), tarz [kalıcı yaratıcı rehberde](../lore/GORSEL_VE_ANLATI_REHBERI.md) açıklanır.

## Test kapsamı ve yayın

86 Playwright senaryosu harita katmanlarını, konumu bilinen yerleşimlerin pin → panel → wiki geçişini, konumu bilinmeyen kaydın davranışını, alternatif adları, özgün görüntü piksellerine göre simge hizasını, genel lore bağlantılarını, görselleri, kurum kadrolarını, galeri/kitaplık, mobil gezinme, klavye odağı ve azaltılmış hareketi denetler. Önceki sürümde 82 senaryo ve 30 üretim görünümü doğrulandı; son konum düzeltmesinde 11 ilgili senaryo ve derleme geçti. Koşuların ayrıntısı [son doğrulama kaydında](../lore/SON_DOGRULAMA.md) bulunur.

`npm run build` yalnızca `dist/` içine statik uygulamayı üretir. Ham DOCX/PDF belgeleri otomatik içe aktarılmaz; görev sırları, gizli karakter bilgileri ve Broken Oath yayımlanmaz. Geliştirme sunucusu dosya erişimi de `web/` ile sınırlıdır. Statik barındırmaya yalnızca `dist/` verilir. Bağımlılıklar, harita katmanları, derleme ve test çıktıları Git tarafından yok sayılır. Fontlar yereldir; dış font veya harita servisi gerekmez.
