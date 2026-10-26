# Aruzahr — Valhunar Atlası

İnteraktif harita, resimli wiki, karakter kartları ve D&D yayın masası.

## Hızlı başla

GitHub'da **Code → Download ZIP** ile deponun tamamını indirip çıkar. [Node.js LTS](https://nodejs.org/en/download) 22.12 veya üzerini kur.

| Ne yapmak istiyorsun? | Açılacak dosya / rehber |
|---|---|
| Windows'ta siteyi aç | [baslat/BASLAT.bat](baslat/BASLAT.bat) |
| Windows'ta hikâye ve yayın masasını aç | [baslat/Yayini-Baslat.cmd](baslat/Yayini-Baslat.cmd) |
| macOS / Linux veya telefon kumandası | [Başlatma seçenekleri](baslat/README.md) |
| Oyunu adım adım yönet | [Sade Hikâye Masası](docs/kullanim/SADE_HIKAYE_MASASI.md) |
| Hikâye dosyalarını indir | [DM notları ve şifresiz indirmeler](DM_NOTLARI.md) |
| Evrenin lore'unu oku | [Lore dizini](lore/README.md) |
| PDF, Word, harita veya karakter asıllarını bul | [Özgün kaynaklar](kaynaklar/README.md) |

Başlatıcının açtığı terminali kullanım boyunca açık tut. Yayın Masası `http://127.0.0.1:5173/#/broadcast`, OBS görüntüsü `http://127.0.0.1:5173/#/broadcast/live` adresindedir. Hazır hikâye şifresiz gelir; kendi notların ve kararların yerel kaydında kalır.

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
