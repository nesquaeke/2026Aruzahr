# Oyuncuya özel bulut yedeği

Supabase ücretsiz planıyla küçük bir arkadaş grubu için başlanabilir. Güncel kota ve e-posta gönderim sınırlarını Supabase panelinden kontrol et; ücretsiz projeler kullanılmadığında duraklatılabilir. Ücretli plan gerekmez. Bu özellik proje bağlanmadan çalışmaz.

## Bir defalık kurulum

1. supabase.com üzerinde ücretsiz bir proje oluştur. Veritabanı parolasını özel tut.
2. SQL Editor içinde depodaki `supabase/player-snapshots.sql` dosyasını çalıştır.
3. Authentication ayarlarında e-posta/parola girişini ve e-posta doğrulamasını açık tut. Site URL alanına gerçek Render site adresini yaz.
4. Project Settings → API bölümünden Project URL ve publishable (veya eski anon) anahtarını al. **service_role / secret anahtarı kullanılmaz.**
5. Render Static Site → Environment içine `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` ekle. Yeniden build/deploy başlat. Vite bu iki herkese açık değeri build sırasında okur.
6. Yerel kullanımda aynı değerleri `web/.env.local` dosyasına yazıp geliştirme sunucusunu yeniden başlat. Bu dosyayı Git'e ekleme.

## Oyuncunun kullanımı

Oyuncu Masası'nın üstündeki **Hesabım ve bulut kayıtları** bölümünü aç. E-posta ve en az 8 karakterli parola ile hesap oluştur, e-postayı doğrula, ardından giriş yap. Yerel karakteri seçip **Buluta yeni yedek kaydet** düğmesine bas. Diğer cihazda aynı hesaba girip **Cihazıma kopyala** de. Önceki karakterlerin üzerine yazılmaz. Düzenlemeler otomatik buluta gönderilmez; oturum sonunda yeni yedek oluştur.

Her hesap en fazla 100 yedek tutar. Eski yedekler panelden silinebilir. Bir karakterin bulut yükü 750 KB ile sınırlıdır; büyük portreleri küçült. JSON yedeğini ayrıca sakla. Özel büyü kataloğu ayrı JSON olarak taşınır; karakter yedeği kataloğun bütün metinlerini içermez.

Oturum anahtarı yalnız bellekte tutulur; yenileyince yeniden giriş gerekir. Parola uygulamada saklanmaz. Sunucuda satır güvenliği her oyuncunun yalnız kendi yedeklerine erişmesini sağlar. DM'ye bütün hesapları okuma yetkisi verilmez. Ortak canlı düzenleme, DM paylaşımı ve parola yenileme ekranı bu ilk sürümde yoktur; hesap kurtarma gerekirse Supabase yöneticisi üzerinden işlem yapılır.

## Yayına almadan kontrol

İki test hesabı aç. A hesabıyla kayıt oluştur; B hesabında görünmediğini doğrula. Çıkıştan sonra kayıtların alınamadığını kontrol et. İkinci cihazda A ile giriş yapıp kopyala; eski yerel karakterin korunmasını kontrol et. SQL güvenliği gerçek Supabase projesinde bu kontrollerle doğrulanmalıdır; yalnız statik build bunların yerine geçmez.
