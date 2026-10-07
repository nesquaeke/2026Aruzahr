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

Şehirlerde mevcut kaynağın kapsamı korunur: özel şehir lore'u bulunmayan kayıtlar, haritadaki yerleşimi ve bölgenin genel bilgisini gösterir. Kullanıcının yetkilendirdiği Danstsud yeni yazımı, kaynak metinlerden ayrı yazar belgelerinde kaydedilir. Şehir kartlarındaki yeni nüfus tahminleri ve makamlar `../lore/danstsud/TASARIM_VE_KARTLAR.md` içinde açıkça ayrılır.

## Yayın çıktısı

`npm run build`, yalnızca `dist/` içindeki uygulamayı ve genel harita katmanlarını üretir. Statik barındırmaya bu dizin verilir. Depo kökündeki ham lore belgeleri web uygulamasının dışında tutulur. Geliştirme sunucusunun dosya erişimi de `web/` diziniyle sınırlıdır.

Harita katmanları, derleme çıktıları, bağımlılıklar ve test çıktıları Git tarafından yok sayılır; kaynak harita ile kilit dosyasından yeniden oluşturulabilir. Yer imleri tarayıcıda saklanır; bir kullanıcı hesabı veya sunucu gerektirmez. Ağ üzerinden kullanılan font veya harita servisi yoktur.

Her bulut görevi zaten ayrı bir ortamda çalışır. Mevcut çalışma kopyasını kullan; kullanıcı açıkça istemedikçe Git worktree oluşturma. Yeni ortamda dosyalar korunabilir, fakat geliştirme sunucusu gibi çalışan süreçler yeniden başlatılmalıdır.

## Görsel deneyim

`src/presentation.ts`: 15 Danstsud şehir kartı; nüfus, yönetici, iklim, geçim kaynakları, dört göreli güç göstergesi ve kişi bağlantıları. `WikiArticle.tsx`: görselli şehir pasaportu, kısa merak kartları, açılır bölüm ızgarası ve tam okuma modu. `WikiHub.tsx`: şehir/portre koleksiyonları, Ashara galerisi, lore türü filtreleri.

`src/map-features.ts`: 16 deniz/göl/zirve/körfez/yol hedefi ve beş şematik güzergâh. SVG yollar OpenSeadragon görüntü koordinatlarına bağlıdır; pan ve yakınlaştırmada birlikte hareket eder. Planlanan Cevher Çizgisi ayrı çizilir, çalışır yol sayılmaz. Yeni köylerin yaklaşık işaretleri yakınlaşınca veya aramayla görünür. Şehir kartı masaüstünde haritanın yanında, mobilde altında açılır. Son kamera sessionStorage ile aynı sekmede hatırlanır; yer imleri localStorage içinde kalır.

Görseller `public/illustrations/` içinde sürümlenir; yeni kurulumda yeniden görsel üretimi gerekmez. Özgün `Ashara.png` ve 8K harita korunur. Tasarım ve yeni lore ayrımı [yazar notlarında](../lore/danstsud/TASARIM_VE_KARTLAR.md).
