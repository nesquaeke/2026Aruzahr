# Aruzahr — uygulama notları

React 19, TypeScript, Vite, Three.js ve OpenSeadragon ile Türkçe interaktif atlas. Node.js 22.12 veya üzeri gerekir; mevcut bulut ortamında Node.js 24.19.0 kullanılır.

## Kurulum ve çalıştırma

Depo kökündeki `BASLAT.bat` veya `bash baslat.sh` yerel kurulumu yapar. Elle çalıştırmak için:

```bash
cd web
npm ci --no-audit --no-fund
npm run assets
npm run dev -- --host 127.0.0.1 --open
```

Bulut çalışma dizini `/workspace/2026Aruzahr/web`; npm önbelleği için `npm --cache /workspace/.cache/npm ci --no-audit --no-fund` kullanılabilir. Sunucu 5173 portunda çalışır. Süreçler yeni ortamda yeniden başlatılır.

`npm run assets`, depo kökündeki `Aruzahr 8k (1).jpg` dosyasından Deep Zoom katmanlarını ve 3D atlasın 2048/4096 piksel WebP dokularını üretir. Özgün çizimi değiştirmez; SHA-256 ve üretim sürümü eşleştiğinde mevcut katmanları yeniden kullanır. Hazır illüstrasyonlar `public/illustrations/` içinde sürümlenir; yeni kurulumda görsel üretmek gerekmez.

```bash
npm run build
npm test
```

Tarayıcı testleri varsayılan olarak `/usr/bin/chromium` kullanır. Farklı makinede Chromium yolunu `PLAYWRIGHT_CHROMIUM_PATH` ile belirt. Playwright sunucuyu başlatır veya çalışan geliştirme sunucusunu kullanır.

## Harita verisi

`src/data.ts` genel wiki, sekiz ülke ve yerleşim verisini birleştirir. `map-corrections.ts` özgün 8192 × 5668 çizime göre 44 eski konumu düzeltir ve 52 kaynak harita adını kaydeder; bunlardan Frethar mevcut Fehar kaydıyla eşleştiği için 51 ayrı yerleşim eklenir. Toplam 95 yerleşimin tamamı harita noktasına, bilgi paneline ve dolu wikiye bağlıdır. Fehar / Frethar, yazarın tarif ettiği Vornic–Pilorn arasındaki 4860 × 3370 piksel noktasını paylaşır. Fehar’ın wiki içeriği, kraliyet vergi bağı ve nüfus kartı korunur. `mapSettlementAliases` eski Frethar bağlantılarını ve yer imlerini Fehar’a yönlendirir; ikinci bir yerleşim veya nokta oluşmaz. Frethar özgün harita kesiti de Fehar galerisinde bulunur.

`map-landmarks.ts`, Aldara'nın iki kolu, Serenith, Teyra, Thural Kalkanı, Karlan sırası, Valdareth Ovası ve belirgin etiketsiz yapıları ekler. `map-features.ts` toplam 31 coğrafya/yol kaydını ve beş şematik güzergâhı tanımlar. Sekiz ülke ve üç alt bölgeyle haritada 137 hedef vardır. Deniz ve geniş alan işaretleri temsilî merkezlerdir; coğrafi sınır ölçümü değildir.

`Atlas.tsx` görüş alanındaki yerleşim noktalarını ülke seçimi veya uzak yakınlık yüzünden gizlemez. Çakışan yazılar azalırken 44 piksel etkileşim alanlı noktalar korunur. Ekran dışı noktalar klavye sırasına girmez. Coğrafya başlangıçta açık, yollar kapalıdır; seçilen rota kendi duraklarına odaklanır. Cevher Çizgisi tamamlanmamış proje olarak ayrı gösterilir. Güncel şehir koordinatları yol çizgilerinin de kaynağıdır.

Arama alternatif yazımları tanır; `Frethar`, `Galmire`, `Korthen`, `Tora` ve `Serenth` aynı kanonik kayıtlara gider. Tam ad/koordinat envanteri ve belirsizlikler [harita denetiminde](../lore/HARITA_KONUM_DENETIMI.md) saklanır. Harita kamerası sessionStorage, yer imleri localStorage içinde tutulur.

## 3D kabartma atlas

Yeni ziyaretçi `Atlas3D.tsx` içindeki gerçek WebGL görünümünü açar. “2D harita” özgün Deep Zoom görünümüne döner; seçim bu tarayıcıda hatırlanır. Motor yüklenemez veya GPU bağlamı kaybolursa aynı yerin paneliyle 2D atlas açılır. Şehir, ülke, coğrafya ve wiki kimlikleri iki görünümde ortaktır.

Tekerlek / iki parmak yakınlaştırır; sürükleme taşır; sağ sürükleme eğimi ve yönü değiştirir. Üstten/eğimli görünüm, kuzeye dön ve kamera sıfırlama kontrolleri vardır. Odaklanmış haritada ok tuşları taşır, +/− yakınlaştırır. Yakında gerçek şehir/orman geometrisi ve sade boyalı yüzey açılır; “Çizim” her ölçekte özgün kaynak dokusunu gösterir. Orman, su ve kış ayrı katmanlardır. Atmosfer kapatılabilir; azaltılmış hareket tercihi kamera geçişini anında yapar, kar/buhar ve su animasyonunu durdurur.

`relief-data.ts` düzenlenebilir kıyı yorumlarını, dağ omurgalarını, orman alanlarını, dört nehir izini ve mimari imzaları tutar. `relief-buildings.ts` bütün 95 yerleşimi kendi mevcut noktasında maket olarak kurar; 11 büyük/özel şehir ayrı mimariye sahiptir. `relief-scene.ts` gerçek yükselti ağını, örneklenmiş ağaçları, su yüzeyini ve hava katmanını üretir. Yapı modelleri de kendi paneline tıklanabilir.

Kıyı, yükselti, bitki alanı ve bina planı kaynak çizimden yapılan **görsel yorumdur**; metreyle ölçülmüş arazi veya gerçek ölçekli şehir planı değildir. Yerleşim merkezleri taşınmaz. Ekrandaki kar tercihi kampanya tarihini değiştirmez; yapılmamış Cevher Çizgisi plan olarak kalır. Ayrıntılı kapsam [3D master promptunda](../lore/3D_ATLAS_MASTER_PROMPTU.md), uygulama ve doğrulama [3D atlas teslim kaydında](../lore/3D_ATLAS_TESLIMI.md) bulunur.

Three.js ayrı bir istek üzerine yüklenen parça olarak derlenir. Mobilde daha düşük arazi çözünürlüğü, ağaç/parçacık sayısı ve piksel oranı kullanılır; gölgeler kapalıdır. Masaüstünde ilk doku 2048 pikseldir; yakınlaşınca GPU destekliyorsa 4096 piksel sürüm yüklenir. Sekme görünmüyorken çizim döngüsü durur; görünüm kapatıldığında GPU kaynakları temizlenir.

## Wiki, kadrolar ve görseller

`presentation.ts`, `mapped-place-dossiers.ts` ve `world-dossiers.ts` şehir kartlarını birleştirir: nüfus, yönetim, iklim, geçim ve göreli güçler. Yeni nüfuslar kurgusal tahmin olarak not edilir. Özgün Frostbay/Dranthol sayıları korunur.

`lore/characters.ts`, Danstsud, dünya ve yazar kadro modülleriyle 161 karakteri sunar. `CharactersHub.tsx` isim, görev, ülke, şehir ve kurum filtrelerini birleştirir; `character-abilities.ts` bütün kişilerin düzenlenebilir altı D&D niteliğini, ortak `CharacterAbilities.tsx` ise kart ve wiki gösterimini sağlar. Sayılar oyun taslağıdır; birleşik güç çerçevesi ayrı tutulur. `InstitutionRoster.tsx` şehirleri askerî/dinî/akademik kurumlara, kurumları portreli üyelere bağlar. On İki Şövalye kadrosunda tam 12 farklı kişi bulunur. `CharacterCard.tsx` ve `character-card-profiles.ts` birleşik dövüş/büyü/siyasi nüfuza göre dört çerçeve sınıfını uygular; açıklanmamış portreler sınıflandırılmaz.

`WikiArticle.tsx` şehir pasaportu, merak kartları, kurumlar, portreler ve galeriden sonra konuya göre seçilebilen lore bölümlerini sunar. Kartlar, tam okuma, sakin okuma, bölüm adımları, gerçek kaydırma ilerlemesi ve içindekiler aynı metne erişir. Büyük Kırılma mevcut 16 bölümlük genel tarih anlatısını ve karşılaştırmalı tarih deneyimini korur.

`Bookshelf.tsx` ile `lore/books.ts` 14 kitabı eski/yasak/kayıp rafları, araştırma/yolculuk/tanıklık türleri ve metin aramasıyla sunar. Her seçki 400–900 sözcük ve üç-dört yapraktır. Bölüm seçimi, yazı boyutu, yer imi, yazar/şehir/harita bağlantıları ve kalıcı `#/books/id?leaf=2` URL vardır. `GalleryHub.tsx` bütün 371 görseli kategori, arama ve özgün arşiv filtresiyle gösterir. Büyütülmüş galeri ok tuşları ve Escape ile kullanılabilir; görselin ilgili wiki sayfası açılabilir.

`media.ts`, portre ve boyalı görsel manifestleriyle kaynakları birleştirir. 203 boya dokulu illüstrasyon ve 52 kaynak harita adı için özgün çizimden kesit bulunur. Birincil kapaklar/portreler yeni resimsel sürümleri seçer; önceki görseller arşivde korunur. Görsellerin kaynak ve gerçek üretim sayıları [görsel kaydında](../lore/GORSEL_URETIM_KAYDI.md), tarz [kalıcı yaratıcı rehberde](../lore/GORSEL_VE_ANLATI_REHBERI.md) açıklanır.

`LivingGuides.tsx` 15 önemli şehrin gündelik işini, 15 kurum çevresinin yetki/destek/denetimini, ilgili kitapları ve türlerin kısa ekoloji özetini sunar. Ayrıntılar tam lore ve aramada da bulunur. `character-life.ts` 33 önemli kişiye yeni olay, hedef, sınır ve karşılaşma ekler; oyuncu geçmişleri değiştirilmez. Orvelin yük ve soğukta çalışma sayıları kurgu saha taslağı olarak belirtilir.

Yeni içerik ve kanon karşılığı [yaşayan ansiklopedi tesliminde](../lore/YASAYAN_ANSIKLOPEDI_TESLIMI.md) kaydedilir. Altı maceranın oyuncuya açık girişleri kitaplarda, çözümleri ayrı yerel DM paketindedir. Özel paket Git deposunun ve uygulamanın dışındadır; statik barındırmaya kopyalanmaz.

## Test kapsamı ve yayın

139 Playwright senaryosu vardır: önceki atlas/ansiklopedi için 117, yeni 3D görünüm için 22. Eski SVG/Deep Zoom testleri açıkça 2D görünümünde; `relief.spec.ts` yeni ziyaretçi varsayılanı olan gerçek WebGL görünümünde çalışır. 3D tesliminde 22 yeni ve 17 ilgili eski senaryo doğrulandı; 139 senaryonun tamamı bu görevde yeniden koşulmadı. Kapsam ve koşu ayrıntıları [son doğrulama kaydında](../lore/SON_DOGRULAMA.md) bulunur.

`npm run build` yalnızca `dist/` içine statik uygulamayı üretir. Ham DOCX/PDF belgeleri otomatik içe aktarılmaz; görev sırları, gizli karakter bilgileri ve Broken Oath yayımlanmaz. Geliştirme sunucusu dosya erişimi de `web/` ile sınırlıdır. Statik barındırmaya yalnızca `dist/` verilir. Bağımlılıklar, harita katmanları, derleme ve test çıktıları Git tarafından yok sayılır. Fontlar yereldir; dış font veya harita servisi gerekmez.
