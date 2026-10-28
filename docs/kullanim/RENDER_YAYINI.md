# Render'da ücretsiz yayın

Depo kökündeki `render.yaml` yalnız **Static Site** oluşturur. Ücretli sunucu veya veritabanı istemez. Harita, wiki, galeri, kitaplar ve Oyuncu Masası statik yayında çalışır. Render'ın ücretsiz kullanım kotaları ve hesapta gösterdiği güncel koşullar geçerlidir.

## Hazır yapılandırmayla kur

1. GitHub'a bağlı Render hesabınla [hazır kurulumu aç](https://render.com/deploy?repo=https://github.com/nesquaeke/2026Aruzahr).
2. İstenirse bu depoyu seç ve Blueprint adını örneğin `aruzahr` yap. Listede **bir Static Site** görünür; ayrıca ücretli Web Service veya veritabanı ekleme.
3. **Deploy Blueprint** / **Apply** ile başlat. Build tamamlanıp durum **Live** olduğunda Render'ın verdiği `.onrender.com` adresini aç.

Kurulum bağlantısı hesabında Blueprint yerine başka ekran açarsa **New → Static Site → bu depo → main** yolunu kullan. Aynı değerler:

| Alan | Değer |
| --- | --- |
| Branch | `main` |
| Root Directory | Boş bırak; depo kökü |
| Build Command | `npm --prefix web ci --include=dev --no-audit --no-fund && npm --prefix web run assets && npm --prefix web run build` |
| Publish Directory | `web/dist` |
| Environment | `NODE_VERSION` = `24.19.0` |

Başlangıçta 8K haritadan döşemeler üretildiği için yalnız `npm run build` yazma. Kaynak harita depo köküne göre bulunduğundan Root Directory'yi `web` yapma. Site `/#/play` gibi hash adresleri kullanır; yönlendirme kuralı gerekmez. GitHub `main` değiştiğinde Render'ın otomatik dağıtımı yeni sürümü hazırlar.

## Yayın sonrası kontrol

`render.yaml`, GitHub `main` dalına her yeni commit geldiğinde otomatik dağıtım isteyecek şekilde `autoDeployTrigger: commit` kullanır. Mevcut Blueprint'te Auto Sync açık olmalıdır; gerekirse Blueprint → Manual Sync ile dosya değişikliğini uygula. Site hizmetinin Settings → Build & Deploy bölümünde Auto-Deploy ayarı On Commit görünmelidir. Gerçek Render hesabı bu ortamdan kontrol edilmediğinden ayarın uygulandığı ayrıca doğrulanmalıdır. Build başarısız olursa önceki başarılı sürüm yayında kalır.

- Ana adres: atlas ve harita döşemeleri görünmeli.
- `/#/play`: **Karakter oluştur** ile bir deneme karakteri açılmalı.
- **Büyüler**: 319 yerleşik büyü ve basit büyü filtresi açılmalı.
- **Eşya**: 237 temel donanım kaydı aranabilmeli.
- **A4 kâğıt → Yazdır / PDF**: yeni pencere açılmalı; engelleniyorsa bu siteye açılır pencere izni ver.

## Oyuncu kayıtlarını taşı

Yerel otomatik kayıt tarayıcıya özeldir. Supabase kurulumu tamamlandıysa oyuncu hesabıyla açık komut üzerinden bulut yedeği kaydedip başka cihazda kopyalayabilir; otomatik eşitleme yapılmaz. Yerel siteden yeni adrese geçmeden önce ayrıca **Yedek indir**, yeni sitede **Karakter yedeği aç** kullan. Özel büyü arşivini ayrıca indirip aktar. Ayrıntı: [Oyuncu bulut kaydı](OYUNCU_BULUT_KAYDI.md).

## OBS ve özel bilgiler

OBS yayın rölesi, uzaktan kumanda ve ElevenLabs bağlantısı statik barındırmada çalışmaz. Bu işlerde bilgisayarındaki `baslat/Yayini-Baslat.cmd` ve `http://127.0.0.1:5173/#/broadcast/live` adresini kullan. Yayındaki harita ve oyuncu sayfaları için Render adresini paylaşabilirsin.

Kullanıcının önceden açıkça yayımlanmasını istediği yerleşik DM senaryosu indirilebilir dosya olarak sitede bulunur. Bu statik dosyalar parola korumalı özel sunucu değildir. Kendi oturum notların ve karakter yedeklerin otomatik depoya veya Render'a yüklenmez.
