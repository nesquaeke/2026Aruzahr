# Aruzahr kamera çerçevesi

## Büyütmede netlik için yeni sürüm

- [Saf vektör SVG](../../web/public/downloads/Aruzahr-Kamera-Cercevesi-Vektor.svg): raster resim içermez. Desenler yeniden çizilmiş geometrik bezemelerdir; ilk resmin piksel büyütmesi değildir.
- [Vektörden 4160 × 2640 PNG](../../web/public/downloads/Aruzahr-Kamera-Cercevesi-4K.png): OBS Görüntü Kaynağı için önerilen dosya. Şeffaf kamera açıklığı bu ölçekte x160/y160, 3840 × 2160'dır. Oranı 16:9; üst/alt kırpmaya gerek yoktur. İsim plakası yaklaşık x1030/y2386 ile x3130/y2558 arasındadır.
- [Yeni detaylı boyalı yorum](../../web/public/downloads/Aruzahr-Kamera-Cercevesi-Detayli.png): 1672 × 941 yerel üretim; büyütme sınırsız değildir. Vektör dosyasından ayrı bir görsel yorumdur.

4K genişliğindeki PNG'yi doğal boyutundan küçük kullan. Çok küçültürken OBS → sağ tık → Ölçekleme Filtresi → Lanczos denenebilir. Kamera, çerçeve ve metni aynı gruba koyup grubun köşesinden orantılı ölçekle. Kaynakları tek tek büyütürsen hizaları kayar. Vektör çerçeve net kalsa da düşük çözünürlüklü VDO.Ninja kamera görüntüsüne yeni ayrıntı eklemez. SVG'yi OBS sürümün Görüntü Kaynağı olarak desteklemiyorsa PNG sürümünü kullan.

## İlk boyalı sürüm

[Şeffaf PNG indir](../../web/public/downloads/Aruzahr-Kamera-Cercevesi.png)

Tek oyuncu için yeniden kullanılabilir eskitilmiş metal çerçeve ve boş isim plakası. Üretim boyutu 1672 × 941, RGBA PNG. Kamera alanı ve dış zemin gerçek alfa şeffaflığı kullanır; siyah bir dikdörtgen değildir. Kamera açıklığı yaklaşık 2,1:1 olduğundan 16:9 kameranın bir miktar üst/alt kırpılması gerekir. İnternet bağlantısı gerektirmeyen yerel OBS Görüntü Kaynağı olarak kullan.

1. PNG'yi bilgisayarına indir. OBS → Kaynaklar → Görüntü ile ekle.
2. VDO.Ninja Tarayıcı Kaynağını veya kameranı çerçevenin ALTINA yerleştir. Görüntüyü boşluğa göre boyutlandır; Alt ile kenarlarından kırp. Çerçeveyi esnetme.
3. Metin (GDI+) kaynağını çerçevenin ÜSTÜNE ekle. İsmi alt plakaya ortala; Palatino Linotype Bold veya Georgia Bold, açık krem önerilir. Yazı boyutunu ekranda görünen plakanın yüksekliğine göre seç.
4. Üç kaynağı Ctrl ile seç → sağ tık → Seçili öğeleri grupla. Grup adı oyuncunun adı olsun. Bitince kilitle.
5. Her oyuncu için ayrı kamera, metin ve grup kullan. Aynı PNG dosyasını tekrar kullanabilirsin; kişilerin isimlerini PNG'ye yazmak gerekmez.

1920 × 1080 yayın için çerçevenin toplam genişliği 320–350 px ile başlanabilir. Dört çerçeveyi solda eşit aralıklarla diz. Kamerayı taşırırken yüzün kesilmediğini test kaydıyla kontrol et. Bu PNG konuşana göre otomatik parlamaz, kamera veya hesapla otomatik eşleşmez.
