# Aruzahr — Valhunar Atlası

Yazarın özgün 8K haritasında gezilen Türkçe atlas, resimli wiki, karakter kartları, galeri ve kitaplık. Giriş dosyası [web/index.html](web/index.html); uygulama [web/](web/) dizinindedir.

## Haritanın güncel kapsamı

**95 yerleşim, 8 ülke, 3 Danstsud alt bölgesi ve 31 coğrafya/yol hedefi: toplam 137 tıklanabilir nokta.** Özgün haritadan eklenen 52 adın biri mevcut Fehar ile eşleşir; 51 ayrı yerleşim eklendi. Mevcut 44 yerleşimin noktası özgün çizimle karşılaştırılarak düzeltildi. Her harita noktası kendi bilgi kartına ve bölümleri dolu wiki sayfasına açılır.

Yerleşim ve coğrafya katmanları başlangıçta açıktır. Bir ülkeyi seçmek görüş alanındaki komşu şehirleri gizlemez. Uzak görünümde çakışan yazılar azalır, noktalar kalır; fareyle veya klavye odağıyla isim açılır. Ticaret yolları ayrı katmandadır ve güncel şehir merkezlerini izleyen şematik güzergâhlardır. Cevher Çizgisi yapılmamış proje olarak gösterilir.

95 yerleşimin tamamında harita noktası vardır. **Fehar / Frethar**, yazarın Vornic ile Pilorn arasındaki yerleşimi işaret etmesiyle tek kayda bağlandı. Harita etiketi Frethar, mevcut wiki adı Fehar olarak korunur; iki ad, eski bağlantılar ve yer imleri aynı kayda ulaşır. Tam envanter, koordinatlar ve eşleştirme notları [harita konum denetiminde](lore/HARITA_KONUM_DENETIMI.md) bulunur.

## Atlasın içinde

- Şehir kartlarında nüfus tahmini, yönetici, geçim kaynakları ve göreli idare/ticaret/ekonomi/savunma göstergeleri.
- 155 karakter biyografisi; büyük şehirlerin lonca, askerî birlik, donanma ve dinî kurum kadroları. Başkentteki On İki Şövalye ayrı kişilerden oluşur.
- 234 genel lore/kişi kaydı; konuya göre bölümler, kısa okuma kartları, tam lore, içindekiler ve sakin okuma modu.
- 365 görsellik galeri: 197 yeni boya dokulu illüstrasyon, özgün yüklemeler ve 52 kaynak harita adı için özgün çizimden alınan kesitler. Görseller wiki içinden büyütülür.
- Eski, yasak ve kayıp kitaplar için ayrı kitaplık; sekiz kısa kitap, çevrilebilir parşömen yaprakları.

Portrelerin isim plakalı çerçevesi dövüş, büyü ve siyasi nüfuzun toplam etkisine göre işlenir. Yeni çizimlerde görünür fırça dokusu ve resimsel biçimler kullanılır. Üretim tercihleri [Görsel ve Anlatı Rehberinde](lore/GORSEL_VE_ANLATI_REHBERI.md), kapsam [master promptta](lore/URETIM_MASTER_PROMPTU.md), gerçek görsel envanteri [üretim kaydında](lore/GORSEL_URETIM_KAYDI.md) saklanır.

## Bilgisayarında aç

1. [Node.js LTS](https://nodejs.org/en/download) kur; sürüm 22.12 veya üzeri olmalı.
2. GitHub'da **Code → Download ZIP** ile deponun tamamını indir ve ZIP'i çıkar.
3. Windows'ta ana klasörde **BASLAT.bat** dosyasını aç. macOS/Linux'ta ana klasörde `bash baslat.sh` çalıştır.

Başlatıcı bağımlılıkları kurar, özgün haritanın yakınlaştırma katmanlarını üretir ve siteyi tarayıcıda açar. İlk kurulumda internet gerekir. Kullanırken terminali açık tut; kapatmak için **Ctrl+C** kullan. Tarayıcı otomatik açılmazsa terminalin gösterdiği yerel adresi aç.

React/Vite uygulaması `index.html` dosyasına çift tıklayarak çalışmaz. Terminalden başlatmak için:

```bash
cd web
npm ci
npm run assets
npm run dev -- --host 127.0.0.1 --open
```

Derleme için `npm run build`; statik yayın çıktısı `web/dist/`. Kurulum, veri modülleri ve testler [uygulama notlarında](web/README.md) açıklanır.

## Dünya ve kaynaklar

Honud, Danstsud ve Garmirk kullanıcı tarafından belirlenen yazımlardır. Danstsud, Eryndorn Vaeranth'ın tahtta olduğu darbe öncesini anlatır. Genel lore ile yeni yazar metni kaynak notlarında ayrılır; yeni nüfuslar belgelenmiş dünya kurma tahminleridir. Kimliği açıklanmayan portrelere görev veya güç atanmaz.

Danstsud'un yeni otorite zincirleri [şehirler ve kadrolar belgesinde](lore/danstsud/SEHIRLER_VE_KADROLAR.md), diğer ülkelerin karakterleri ve canlıları [dünya kadroları belgesinde](lore/DUNYA_KADROLARI_VE_CANLILAR.md) bulunur. Ayrıntılı çalışma belgeleri [lore/danstsud/](lore/danstsud/) dizinindedir.

Görev sırları, DM notları ve Broken Oath uygulamaya dahil edilmez. Statik barındırmaya yalnızca `web/dist/` yükle; ham yazar belgeleri uygulamanın dışında kalır.
