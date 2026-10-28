# Aruzahr — Valhunar Atlası

İnteraktif harita, resimli wiki, oyuncu karakter defteri, A4 karakter kâğıtları ve D&D yayın masası.

## Hızlı başla

GitHub'da **Code → Download ZIP** ile deponun tamamını indirip çıkar. [Node.js LTS](https://nodejs.org/en/download) 22.12 veya üzerini kur.

| Ne yapmak istiyorsun? | Açılacak dosya / rehber |
|---|---|
| Windows'ta siteyi aç | [baslat/BASLAT.bat](baslat/BASLAT.bat) |
| Kendi D&D karakterini oluştur | [Oyuncu Masası · 2014 / Türkçe büyüler](docs/kullanim/OYUNCU_MASASI.md) · sitede `/#/play` |
| Boş A4 karakter kâğıdını indir | [Karakter PDF](web/public/downloads/Aruzahr-Karakter-Kagidi-A4.pdf) · [Büyü defteri PDF](web/public/downloads/Aruzahr-Buyu-Defteri-A4.pdf) |
| Windows'ta hikâye ve yayın masasını aç | [baslat/Yayini-Baslat.cmd](baslat/Yayini-Baslat.cmd) |
| macOS / Linux veya telefon kumandası | [Başlatma seçenekleri](baslat/README.md) |
| Yan olayları ve kişileri takip et | [Yaşayan Yolculuk](docs/kullanim/YASAYAN_YOLCULUK.md) |
| İlk oturumu hazırla | [Üç oyuncu, 1. seviye kısa rehber](web/public/dm/ILK-OTURUM.md) |
| Oyunu adım adım yönet | [Tek DM Masası](docs/kullanim/TEK_DM_MASASI.md) |
| Hikâye dosyalarını indir | [DM notları ve şifresiz indirmeler](DM_NOTLARI.md) |
| Evrenin lore'unu oku | [Lore dizini](lore/README.md) |
| PDF, Word, harita veya karakter asıllarını bul | [Özgün kaynaklar](kaynaklar/README.md) |

Başlatıcının açtığı terminali kullanım boyunca açık tut. Yayın Masası `http://127.0.0.1:5173/#/broadcast`, OBS görüntüsü `http://127.0.0.1:5173/#/broadcast/live` adresindedir. Hazır hikâye şifresiz gelir; kendi notların ve kararların yerel kaydında kalır.

## Nerede bulacağım?

- **Yayın Masası → Kişi / yer bul:** karakter, yaratık, şehir ve karşılaşmaları aynı aramada bul; hangi görevden geldiğini ve nerede kullanıldığını gör.
- **Görev:** 10 bölüm / 61 sahne, 10 yan olay ve 12 portreli yol/gece kartı. **Savaş:** hazır pusuları ve canavarları geniş masada yönet; beş yeni savaş planı dahil.
- **Galeri:** bütün resimler ve yedi yeni büyük şehir tablosu. **Haneler:** sekiz ülkenin 33 hane/klanı, armaları, sözleri, unvanları ve silahlı güçleri.
- **Atlas:** Özgün 2D, Danstsud 3D ve bütün dünya için Loş 3D. Kanonik konumlar ortaktır; 3D arazi görsel yorumdur.
- **Ses → ElevenLabs:** özel sunucu anahtarıyla karakter konuşması üret, dinle ve kütüphaneye ekle. [Kurulum](docs/kullanim/ELEVENLABS_SESLERI.md).

Sade/gelişmiş geçişi kaldırıldı; bütün araçlar tek DM masasındadır. [Başlangıç ve düğmelerin açıklaması](docs/kullanim/TEK_DM_MASASI.md).

## Klasör düzeni

```text
baslat/      Site ve yayın için Windows, macOS ve Linux başlatıcıları
kaynaklar/   Özgün PDF, Word belgeleri, 8K harita ve karakter görselleri
lore/        Evren, Danstsud, şehirler, hanedanlar ve canlılar
docs/       Kullanım rehberleri, tasarım kararları ve geliştirme kayıtları
web/         Çalışan sitenin kodu ve hazır yayın dosyaları
```

- [Belgeler dizini](docs/README.md): kullanım, tasarım ve teknik kayıtları ayrı bul.
- [Geliştirici kurulumu](web/README.md): terminal komutları, derleme ve testler.
- [Dosya taşıma açıklaması](docs/gelistirme/DEPO_DUZENI.md): eski dosyaların yeni yerleri.

`index.html` dosyasına çift tıklamak yerine başlatıcıyı kullan. Uygulamanın giriş dosyası [web/index.html](web/index.html), statik derleme çıktısı `web/dist/` içindedir.
