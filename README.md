# Aruzahr — Valhunar Atlası

Orijinal 8K harita üzerinde interaktif keşif ve genel lore wikisi. Uygulamanın giriş dosyası [`web/index.html`](web/index.html), kaynak kodları [`web/`](web/) dizinindedir.

## Bilgisayarında aç

1. [Node.js LTS](https://nodejs.org/en/download) kur. Sürüm 22.12 veya üzeri olmalı.
2. GitHub'da **Code → Download ZIP** ile deponun tamamını indir ve ZIP'i bir klasöre çıkar. Harita için yalnızca `index.html` dosyasını indirmek yeterli değildir.
3. **Windows:** Ana klasördeki `BASLAT.bat` dosyasına çift tıkla.
4. **macOS / Linux:** Ana klasörde terminal açıp `bash baslat.sh` çalıştır.

Başlatıcı bağımlılıkları kurar, orijinal haritadan yakınlaştırma katmanlarını oluşturur ve siteyi tarayıcıda açar. İlk açılışta internet gerekir. Test ederken açılan terminali açık tut; kapatmak için **Ctrl+C** kullan.

Bu React/Vite uygulaması, `index.html` dosyasına çift tıklayarak çalışmaz. Geliştirme sunucusu üzerinden açılır. Tarayıcı otomatik açılmazsa terminalde gösterilen yerel adresi bilgisayarındaki tarayıcıya yaz.

## Terminalden çalıştır

```bash
cd web
npm ci
npm run assets
npm run dev -- --host 127.0.0.1 --open
```

Derlemek için `npm run build` çalıştır. Statik yayın çıktısı `web/dist/` olur. Ayrıntılı kurulum ve tarayıcı testleri için [uygulama notlarına](web/README.md) bak.

Genel wiki sekiz bölgeyi ve haritadaki 28 yerleşimi içerir. Görev sırları, DM notları ve Broken Oath web uygulamasına dahil edilmez; ham lore belgelerini barındırma hizmetine yükleme.
