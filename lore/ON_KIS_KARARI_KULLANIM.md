# On Kış Kararı — yeni oturum rehberi

Bu yolculuk, kullanıcının verdiği on ahlaki ikilemin Aruzahr'a uyarlanmış yeni alternatif macera taslağıdır. Mevcut kanonda oynanmış olay sayılmaz. Darbe öncesinde geçer; Eryndorn tahtta kalır. Yeni kaynak, 25 Ekim 2026 yazar çalışmasıdır. [Önce yazılan master prompt](YAYIN_VE_ON_GOREV_MASTER_PROMPTU.md).

## İlk kullanım

1. Depoyu güncelle, yerel sunucuyu yeniden başlat. Eski uygulama sürümü yapılandırılmış sürüm 2 paketi okuyamaz.
2. [DM notları](../DM_NOTLARI.md) sayfasındaki şifreli dosyayı yeniden indir. Sohbetteki aynı şifreyi kullan.
3. ZIP'ten **On-Kis-Karari-DM.json** dosyasını çıkarıp **Yayın Masası → Görevler → DM paketi aç** ile yükle. Önceki beşli JSON yeni kampanya değildir.
4. Yol haritasından görev, ardından sahne seç. **Şimdi ne oluyor?** DM özetidir. **Oyunculara oku** masa anlatısıdır. **DM olarak yap** somut eylemlerdir. Kişiler, kontroller ve koşullu sonuçlar ayrı kartlardadır.
5. **Hangi görsel?** alanı resmi ve kişi adını gösterir. **Sahneyi hazırla** perdeyi kapatır, arka plan ve ilgili portreleri yerleştirir, eski portre ve zarı kaldırır. Parti taşları ve çizimler korunur. **Oyunculara göster** ile perdeyi aç.
6. Kararı yaz, görevi tamamlandı işaretle. **Defteri indir** özel görevleri, notları, sahne ilerlemesini ve kararları ayrı yedekler. Bu bilgiler sahne yedeğinde veya yayın bağlantısında yoktur.

Eski sürüm 1 paketleri korunur; metinleri açılır bölüm kartlarında okunur ve düzenlenebilir. Otomatik görsel düğmeleri yeni sürüm 2 pakettedir. Yeni paket açmak önceki özel defteri değiştirir; önce indirme düğmesiyle yedeğini al.

## Yeni içerik

10 görev, 30 adımlı sahne; **8 yeni kişi portresi ve 12 yeni sahne resmi**. Sena Erven, Miren Aska, Bera Hald, Iven Rusk, Elda Sorren, Neris Vel, Maeron Vesk ve Taren Olt genel karakter dizininde bulunur. Kamusal biyografiler gizli görev rollerini ve gelecekteki sonuçları açıklamaz. Görseller görsel kütüphanesine ve galeriye kayıtlıdır. İn, küçük köprü ve kamp için kesin yeni atlas koordinatı uydurulmaz.

Yol Marhalden, Harven, Mavric, Frostbay, Ternhaven ve Dranthol bağlantılarını kullanır. Kral Yolu Marhalden'de biter; Cevher Çizgisi yapılmamıştır. Yolculuk günleri ara sahnelerle atlanabilir. Parti bileşimi ve seviyesi bilinmediği için kontroller ve karşılaşma profilleri düzenlenebilir öneridir. Bütün üçüncü yollar kapatılmaz; oyuncular yaratıcı bir çözüm bulursa başarıları gizli bir cezayla geri alınmaz.

## Ara ekranı ve tam ekran

**Ara ver**, özgün Danstsud haritasını yavaş kamera kayması, sis ve hafif kar katmanıyla sakin bir döngüye alır. Ara mesajına dönüş saatini veya duyurunu yazabilirsin. **Moladan dön** sahneyi olduğu gibi geri getirir; zar/taş/portre kaydı değişmez. Perdeyi kapatma ayrı eylemdir. Hareket azaltma tercihinde döngü durur. Otomatik müzik yoktur.

İzleyici tarayıcısında **F** tam ekranı açıp kapatır; üst sağdaki denetim üzerine gelince veya klavyeyle odaklayınca görünür. Tarayıcı güvenliği nedeniyle izleyicinin ekranını uzaktan zorla tam ekrana alamazsın. OBS Tarayıcı Kaynağında pencere çerçevesi zaten yoktur.

## OBS ve 4K

URL: `http://127.0.0.1:5173/#/broadcast/live`. Yerel sunucu ve yönetim penceresi açık kalsın. OBS Tarayıcı Kaynağına bu adresi ver; genişlik/yükseklik ile OBS tuvalini eşleştir:

| Yayın | Kaynak ve tuval |
|---|---|
| 1080p | 1920 × 1080 |
| 1440p | 2560 × 1440 |
| 4K UHD | 3840 × 2160 |

Kaynağa sağ tık → **Dönüştür → Ekrana sığdır**. Masaüstü monitörünün çözünürlüğü yayını belirlemez. 16:9 sahne bu iki test edilmiş 1080p/4K alanda tam alanı doldurur. Farklı oranlarda oran korunur; resim ezilmez. Karakterler yüzdeyle, tipografi sahne genişliğine göre ölçeklenir. 4K sahne desteği, tüm mevcut illüstrasyonların yerel 4K çözünürlükte üretildiği anlamına gelmez. Zar sesi yönetim tarayıcısından yakalanır. OBS'nin masaüstü uygulaması bu Linux ortamında açılmadı; ayrı tarayıcı profiline aktarım tarayıcıda doğrulandı.

## Sıfırlama

**Oturum → Yeni oturum başlat** sahneyi, taşları, çizimleri, zarı ve yerel görselleri temizler; özel DM defterini korur.

**Oturum → Bu cihazdaki tüm Aruzahr verilerini sıfırla** özel paket, ilerleme, kararlar, notlar, portreler, kitap işaretleri ve tercihleri de siler. **SIFIRLA** yazmadan çalışmaz. Önce sahne ve DM yedeğini indirme düğmeleri vardır. Ana menüdeki **Verileri sıfırla** aynı Oturum paneline götürür. Kaynak wiki, çizimler, GitHub dosyaları ve başka uygulamaların kayıtları silinmez. Aynı cihazda farklı originler (`localhost` ve `127.0.0.1` gibi) ayrı depolamadır; işlem yalnız açık origin için geçerlidir.

## Yayın önizlemeleri

Temiz oyuncu sahnesi, 4K tarayıcı kaynağından küçültülmüş önizleme:

![On Kış Kararı sahnesi](onizlemeler/on-kis-karari-sahne.webp)

Ara ekranı; yavaş harita/sis/kar hareketi bu durağan görüntüde görünmez:

![Sakin ara ekranı](onizlemeler/on-kis-karari-ara.webp)
