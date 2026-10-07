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

Genel wiki sekiz ülke/bölgeyi, haritadaki yerleşimleri ve Danstsud’un üç alt bölgesini içerir. Danstsud sayfaları Eryndorn’un hâlâ tahtta olduğu darbe öncesini anlatır. Görev sırları, DM notları ve Broken Oath web uygulamasına dahil edilmez; ham lore belgelerini barındırma hizmetine yükleme.

Vaeranth Hanedanı, Eryndorn Vaeranth, Elorwynder Hanedanı ve Büyü Ruhsatları için ayrı wiki sayfaları vardır. Bunlar aramada bulunur, kaydedilebilir ve ilgili şehir sayfalarından açılır. Eski Tharion Elorwyn ve Damian Elorwyn adları da aramada desteklenir.

Valdareth ve Marhalden ayrıntılı şehir sayfalarıdır. Mahalleler, saray makamları, loncalar, vergi havzaları, Karlan Dağları, Veyralt, sekiz dağ canlısı, Frostmere ve lordluk hukuku için on bir ek wiki kaydı vardır. Tablolar mobilde kendi alanında kaydırılır; arama şehir metinlerini ve tablo içeriklerini de tarar.

Hardlane’in beş şehri Frostbay, Kaldmere, Dranthol, Vyssgard ve Ternhaven ayrıntılı yazıldı. İki kraliyet reformu, Vyssgard Kanunları, kültür, üç otlak hayvanı, iki yol/proje ve beş kıyı/deniz için ayrı kayıtlar bulunur. Bryndon’un Kıyı Defteri, eski yeşil Frostbay ihtimalini kâtibin kendi sesiyle araştıran dokuz bölümlük bir kitap olarak okunur. Toplam 28 ek lore kaydı ve haritada 32 gerçek yerleşim pini vardır; Kaldmere özgün haritadan eklendi. Telefonda açılır İçindekiler ile bölümler arasında geçilir.

## Danstsud lore çalışması

Onaylanan kanon, kaynak dökümü, çelişki incelemesi ve yerleşim envanteri [lore/danstsud/](lore/danstsud/) dizinindedir. Bu yazar çalışma belgeleri görev sırları içerir; web uygulaması bunları doğrudan yüklemez. Halka açık Danstsud metinleri [web/src/lore/danstsud.ts](web/src/lore/danstsud.ts) dosyasında ayrı tutulur.

Yeni aile şeması, hanedan adları ve büyü düzeni [hanedanlar ve büyü hukuku belgesinde](lore/danstsud/HANEDANLAR_VE_BUYU_HUKUKU.md) açıklanır. Halka açık hanedan, kişi ve hukuk metinleri [web/src/lore/danstsud-court.ts](web/src/lore/danstsud-court.ts) dosyasındadır; oğulların kimlikleri yazar belgesinde kalır.

[Valdareth, Karlan ve Marhalden tam lore belgesi](lore/danstsud/VALDARETH_KARLAN_MARHALDEN.md), yeni şehir ve doğa yazımını içerir. Bunun kamuya açık wiki verisi [danstsud-expansion.ts](web/src/lore/danstsud-expansion.ts) dosyasındadır.

[Hardlane tam lore belgesi](lore/danstsud/HARDLANE.md), kullanıcı kararlarını, yeni isimleri, tutarlılık kararlarını, açık geliştirme alanlarını ve wiki metinlerini bir araya getirir. [Bryndon’un Kıyı Defteri](lore/danstsud/BRYNDONUN_KIYI_DEFTERI.md) ayrıca okunabilir. Web metinleri `hardlane.ts`, `hardlane-laws.ts`, `hardlane-coasts.ts` ve `bryndon.ts` modüllerindedir; ham yazar belgeleri uygulamaya alınmaz.
