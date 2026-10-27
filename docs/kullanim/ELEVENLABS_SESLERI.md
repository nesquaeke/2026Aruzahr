# Karakter konuşmaları · ElevenLabs

Yayın Masası → **Ses** → **Karakterlere ses ver · ElevenLabs** bölümünü aç.
Henüz bir anahtar eklenmediği için hazır ElevenLabs kaydı yoktur. Mevcut ortam ve zar sesleri çalışmaya devam eder.

1. `web/.env.local.example` dosyasını aynı klasörde `.env.local` adıyla kopyala.
2. `ELEVENLABS_API_KEY=` satırının sonuna kendi anahtarını yaz. Dosyayı kaydet; yerel sunucuyu kapatıp yeniden başlat.
3. Masayı bu bilgisayarda `http://127.0.0.1:5173/#/broadcast` adresinden aç. **ElevenLabs seslerimi getir** düğmesi hesabındaki sesleri listeler.
4. Sesi seç, kayda anlaşılır bir ad ver, yalnız oyuncuların duyacağı sözleri yaz. **Ses üret** metni ElevenLabs’a gönderir ve hesabındaki krediyi kullanır. Türkçe için `eleven_multilingual_v2` modeli kullanılır.
5. Önce kaydı dinle. Beğendiğinde **MP3 indir** veya **Ses kütüphanesine ekle** düğmesine bas.
6. Kütüphaneye eklediğin adı **Tek seferlik efekt** listesinden seç. Hazırlıkta dene; istediğin anda mevcut ses/yayın kontrolleriyle yayına al.

Anahtarı sohbete veya GitHub’a yapıştırma. `.env.local` Git tarafından yok sayılır. Değişkenin adının başına `VITE_` ekleme; anahtar yalnız yerel sunucuda okunur. Sunucunun ses adresleri LAN kumandasına veya izleyiciye açık değildir.

Metin ve API anahtarı yayın durumuna gönderilmez. Üretilmiş MP3’ü kütüphaneye eklersen kayıt kampanya medyana ve özel kampanya yedeğine dahil olur; açıkça yayına aldığın ses izleyiciye iletilir. Önizleme geçicidir: eklemeden veya indirmeden sekmeden ayrılırsan yeniden üretmen gerekebilir. Sunucudaki geçici sesler en fazla bir saat tutulur, sunucu kapanınca silinir.

Seslerin yayın/kullanım koşulları ElevenLabs hesabına ve seçtiğin sese bağlıdır.
