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
- Orijinal haritada konumu belirlenen 28 yerleşim kaydı ve genel Büyük Kırılma anlatısı.
- Haritadan kısa bilgi paneline, panelden kalıcı bağlantısı olan wiki sayfasına geçiş.
- Yerleşim katmanı, arama, yer imleri, küçük harita, klavye ve dokunmatik gezinme.
- Bölge atmosferi, akıcı kamera geçişleri ve azaltılmış hareket tercihine uyum.

Genel wiki verisi `src/data.ts` içinde bilinçli olarak hazırlanmıştır. Ham DOCX/PDF belgelerini istemciye aktaran otomatik bir içe aktarma işlemi yoktur. Görev sırları, DM notları, gizli kampanya sonuçları ve yanlışlıkla eklenen Broken Oath bu uygulamaya dahil edilmez.

Kullanıcının belirlediği Honud, Danstsud ve Garmirk yazımları kullanılır. Konum işaretleri doğrudan haritaya göre yerleştirilmiştir. Belgede geçen fakat haritada konumu belirlenmeyen yerler, tahmini işaretlere dönüştürülmez. Xotar metnindeki farklı anlatılardan kampanya sırları ve çelişen yönetim/başkent bilgileri yayımlanmaz; genel kültür için diğer bölge belgeleriyle ortak Karutah geleneği kullanılır.

Şehirlerde mevcut kaynağın kapsamı korunur: özel şehir lore'u bulunmayan kayıtlar, haritadaki yerleşimi ve bölgenin genel bilgisini gösterir. Yazılı olmayan tarih veya olaylar üretilmez.

## Yayın çıktısı

`npm run build`, yalnızca `dist/` içindeki uygulamayı ve genel harita katmanlarını üretir. Statik barındırmaya bu dizin verilir. Depo kökündeki ham lore belgeleri web uygulamasının dışında tutulur. Geliştirme sunucusunun dosya erişimi de `web/` diziniyle sınırlıdır.

Harita katmanları, derleme çıktıları, bağımlılıklar ve test çıktıları Git tarafından yok sayılır; kaynak harita ile kilit dosyasından yeniden oluşturulabilir. Yer imleri tarayıcıda saklanır; bir kullanıcı hesabı veya sunucu gerektirmez. Ağ üzerinden kullanılan font veya harita servisi yoktur.

Her bulut görevi zaten ayrı bir ortamda çalışır. Mevcut çalışma kopyasını kullan; kullanıcı açıkça istemedikçe Git worktree oluşturma. Yeni ortamda dosyalar korunabilir, fakat geliştirme sunucusu gibi çalışan süreçler yeniden başlatılmalıdır.
