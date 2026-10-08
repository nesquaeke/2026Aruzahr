# Aruzahr — Valhunar Atlası

Orijinal 8K harita üzerinde çalışan, Türkçe bir keşif atlası ve genel lore ansiklopedisi.

## Kurulum

Node.js 22.12 veya üzeri gerekir; bu bulut ortamında Node.js 24.19.0 ile doğrulandı.

Bilgisayarında denemek için deponun tamamını indirip ZIP'ten çıkar. Windows'ta ana klasördeki `BASLAT.bat` dosyasını aç; macOS/Linux'ta `bash baslat.sh` çalıştır. Giriş dosyası `web/index.html`, React/Vite sunucusu üzerinden açılır; dosyaya çift tıklamak uygulamayı başlatmaz.

```bash
cd /workspace/2026Aruzahr/web
npm --cache /workspace/.cache/npm ci --no-audit --no-fund
npm run assets
npm run build
npm run dev
```

Geliştirme sunucusu 5173 portunda çalışır. Harita varlıkları, depo kökündeki `Aruzahr 8k (1).jpg` dosyasından üretilir. Kaynak dosya değiştirilmez. SHA-256 kontrolü eşleştiğinde mevcut katmanlar yeniden kullanılır.

```bash
npm test
```

Tarayıcı testleri bulut ortamındaki `/usr/bin/chromium` dosyasını kullanır. Başka bir makinede `PLAYWRIGHT_CHROMIUM_PATH` ile Chromium yürütülebilir dosyasını belirtebilirsin. Testler gerçek harita katmanlarını, bölge ve şehir seçimini, wiki bağlantılarını, kaydetmeyi, yakınlaştırmayı, mobil gezinmeyi, azaltılmış hareket tercihini ve genel çıktının kapsamını doğrular.

## İçerik ve etkileşim

- Sekiz bölge: Xotar, Murgul, Honud, Danstsud, Garmirk, Ariki, Gurbin ve Lakbar.
- Orijinal haritada konumu belirlenen 32 ve yaklaşık işaretlenen 12 yeni vergi yerleşimi (toplam 44) ve genel Büyük Kırılma anlatısı.
- Haritadan kısa bilgi paneline, panelden kalıcı bağlantısı olan wiki sayfasına geçiş.
- Yerleşim katmanı, arama, yer imleri, küçük harita, klavye ve dokunmatik gezinme.
- Bölge atmosferi, akıcı kamera geçişleri ve azaltılmış hareket tercihine uyum.

Genel wiki verisi `src/data.ts` içinde bilinçli olarak hazırlanmıştır. Ham DOCX/PDF belgelerini istemciye aktaran otomatik bir içe aktarma işlemi yoktur. Görev sırları, DM notları, gizli kampanya sonuçları ve yanlışlıkla eklenen Broken Oath bu uygulamaya dahil edilmez.

Kullanıcının belirlediği Honud, Danstsud ve Garmirk yazımları kullanılır. Özgün 32 yerleşim işareti haritaya göre yerleştirilmiştir. Kullanıcının 8 Ekim isteğiyle eklenen 12 vergi yerleşimi ve yeni coğrafya hedefleri yaklaşık konum notuyla gösterilir; eski yazımlarla kesin eşleştirme sayılmaz. Xotar metnindeki farklı anlatılardan kampanya sırları ve çelişen yönetim/başkent bilgileri yayımlanmaz; genel kültür için diğer bölge belgeleriyle ortak Karutah geleneği kullanılır.

Şehirlerde kaynak belgelerin genel kanonu korunur. Kaynakta ayrıntısı sınırlı yerleşimler için eklenen günlük hayat sahneleri ve kültürel bölümler, yeni yazar metni olarak işaretlenir. Kullanıcının yetkilendirdiği yeni yazım, kaynak metinlerden ayrı yazar belgelerinde kaydedilir. Danstsud şehir kartlarındaki yeni nüfus tahminleri ve makamlar `../lore/danstsud/TASARIM_VE_KARTLAR.md` içinde açıkça ayrılır.

## Yayın çıktısı

`npm run build`, yalnızca `dist/` içindeki uygulamayı ve genel harita katmanlarını üretir. Statik barındırmaya bu dizin verilir. Depo kökündeki ham lore belgeleri web uygulamasının dışında tutulur. Geliştirme sunucusunun dosya erişimi de `web/` diziniyle sınırlıdır.

Harita katmanları, derleme çıktıları, bağımlılıklar ve test çıktıları Git tarafından yok sayılır; kaynak harita ile kilit dosyasından yeniden oluşturulabilir. Yer imleri tarayıcıda saklanır; bir kullanıcı hesabı veya sunucu gerektirmez. Ağ üzerinden kullanılan font veya harita servisi yoktur.

Her bulut görevi zaten ayrı bir ortamda çalışır. Mevcut çalışma kopyasını kullan; kullanıcı açıkça istemedikçe Git worktree oluşturma. Yeni ortamda dosyalar korunabilir, fakat geliştirme sunucusu gibi çalışan süreçler yeniden başlatılmalıdır.

## Görsel deneyim

`src/presentation.ts`: 27 Danstsud yerleşim kartı; nüfus, yönetici, iklim, geçim kaynakları, dört göreli güç göstergesi ve portreli kişi bağlantıları. Yeni nüfuslar dünya kurma tahminidir; Frostbay ve Dranthol kullanıcının sayılarını korur. `src/lore/village-life.ts` 12 vergi yerleşiminin geçimini ve günlük hayatını geliştirir.

`WikiArticle.tsx`: şehir ve kişi pasaportu, kısa merak kartları, açılır bölümler ve tam okuma modu. Her wiki sayfasında büyütülebilen görsel galerisi vardır. `MediaGallery.tsx` masaüstü ve mobilde çalışır; ok tuşları görsel değiştirir, Escape kapatır. `WikiHub.tsx` sekiz ülke/bölgeyi, 44 yerleşimi, 46 kişinin sayfasını ve üç ek portreyi koleksiyonlar halinde sunar. Lysandra, Ashara ve Kaptan Roddic portre galerisinde bulunur; açıklanmamış görevler atanmaz.

`src/lore/history.ts` Büyük Kırılma'yı Valhunar PDF'sinin genel tarih ve destan bölümlerinden 16 bölümde aktarır. `HistoryExperience.tsx` beş felaket katmanını ve Honud–Danstsud anlatılarını karşılaştırarak bölümlere geçiş sağlar. Gizli nedenler ve kampanya sonları genel anlatıya aktarılmaz.

`src/map-features.ts`: Rydorn Sırtı dahil 17 deniz/göl/zirve/körfez/yol hedefi ve beş şematik güzergâh. SVG yollar güncel şehir koordinatlarından üretilir; pan ve yakınlaştırmada birlikte hareket eder. Yol katmanı başlangıçta kapalıdır. Bir güzergâh seçildiğinde yalnızca o hat ve durakları görünür; panelde durak sırasından şehirlere geçilebilir. Planlanan Cevher Çizgisi ancak özellikle seçilince görünür ve çalışır yol sayılmaz. Etiketler ekran üzerinde çakışmaya göre azalır; gizlenen etiket fareyle veya klavye odağıyla açılır. Yeni köylerin yaklaşık işaretleri yakınlaşınca veya aramayla görünür. Şehir kartı masaüstünde haritanın yanında, mobilde altında açılır. Son kamera sessionStorage ile aynı sekmede hatırlanır; yer imleri localStorage içinde kalır.

Görseller `public/illustrations/` içinde sürümlenir; yeni kurulumda yeniden görsel üretimi gerekmez. `src/media.ts` 116 görselin adını, kaynağını ve galerilerini tanımlar: özgün yüklemeler, onlardan yapılan uyarlamalar ve evren için üretilen çizimler ayrı kaynak etiketi taşır. Sekiz Karlan canlısının ve üç Hardlane otlak türünün kendi görselleri bulunur. Özgün `Karakterler/`, `Ashara.png` ve 8K harita korunur. Yeni lore ve konum düzeltmeleri [güncel yazar notlarında](../lore/danstsud/KARAKTERLER_VE_GORSEL_ATLAS.md) kayıtlıdır.

## Remaster

Karakterler `CharacterCard.tsx` ile isim plakalı, işlemeli kartlar olarak sunulur. `character-card-profiles.ts` içindeki 46 editoryal güç sınıfı dövüş, büyü ve siyasi nüfuzun toplam etkisini gösterir: Olağan, Seçkin, Kudretli ve Yüce. İşleme yoğunluğu bu sırayla artar; sayısal savaş istatistiği değildir. Koleksiyon, şehir kadroları, kişi kapakları ve görsel galerisi aynı sınıfı kullanır. Kimliği açıklanmamış portreler “Gücü bilinmiyor” olarak kalır. Sonraki karakter/canlı çizimleri ve lore için [kalıcı yaratıcı rehber](../lore/GORSEL_VE_ANLATI_REHBERI.md) uygulanır.

`src/remaster.css` koyu lacivert, sıcak altın ve daha okunur metinlerle atlası ve wikiyi yeniden düzenler. Panoramik giriş illüstrasyonu coğrafi harita yerine geçmez. Odak modunda şehirler arasında gezinirken büyük harita açık kalır; wikiye geçince normal okuma görünümü açılır.

`Journeys.tsx` üç rehberli keşif seçkisini sunar. Bunlar mevcut şehirlerde okuma/gezinme duraklarıdır; haritaya fiziksel yol çizmez. Wikiye gidip haritaya dönüşte seçki korunur. `ReadingProgress.tsx` makalenin gerçek kaydırma ilerlemesini izler, açılan bölümlerde güncellenir ve başa dönüş sağlar.

Yerleşim koleksiyonu sekiz bölgeye veya bütün kıtaya göre filtrelenebilir. Karakterler ad, görev ve ilgili yere göre bulunabilir. `src/lore/living-world.ts` 15 Danstsud şehrine ve diğer bölgelerdeki 17 yerleşime günlük hayat sahneleri; yedi bölgeye ikişer bölüm ve dört yeni kurumsal/kültürel kayıt ekler. Böylece 44 yerleşimin tamamı gerçek bölümler içerir. Yeni yazımın kapsamı ve kanon sınırları [remaster yazar notlarında](../lore/danstsud/REMASTER_VE_YASAYAN_DUNYA.md) açıklanır.

8 Ekim 2026 doğrulaması: harita varlıkları ve üretim derlemesi başarılı; 45 tarayıcı testi geçti. Okuma kartlarındaki cümle aralığı düzeltmesinden sonra ilgili iki okuma testi ve derleme yeniden geçti. Üretim görünümü 320, 390, 820, 1024 ve 1440 pikselde atlas, ansiklopedi, Valdareth, Büyük Kırılma ve yeni ekonomi kaydı üzerinde taşma ve tarayıcı hatası olmadan kontrol edildi.
