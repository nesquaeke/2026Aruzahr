# Aruzahr yayın stüdyosu

Güncel yönetim masası `http://127.0.0.1:5173/#/broadcast` adresindedir. Önceki arayüz `/#/broadcast/classic` altında korunur. OBS'nin ana adresi değişmedi: **`http://127.0.0.1:5173/#/broadcast/live`**.

Sade/gelişmiş geçişi kaldırıldı; bütün araçlar tek masadadır. Önce [Tek DM Masası](TEK_DM_MASASI.md) rehberindeki başlangıç ve kişi/yer aramasını kullan. Bu sayfa yayın araçlarının ayrıntılarıdır.

## İlk oturum

1. Güncel depoyu indirip çıkar. Windows'ta `baslat/Yayini-Baslat.cmd`; macOS/Linux'ta `bash baslat/Yayini-Baslat.sh` çalıştır. Node 22.12+ gerekir. Terminali açık tut.
2. **Görev** bölümünde On Kış Kararı hazır gelir: 10 bölüm, 61 ana sahne, 10 yan olay. Giriş ve numaralı adımlar aynı masadadır; ayrı bir gelişmiş moda geçmezsin. Kendi JSON veya not dosyanı **DM paketi aç** ile açabilirsin. Önceki beşli paket de desteklenir.
3. İlk oyun için **Son İlaç → Giriş** seç. Kayıtlı sahne kartları da istersen soldaki **Görev sahnelerini içe al** ile eklenebilir; hikâyeyi okumak için bu işlem zorunlu değildir. İçe almak yayın görüntüsünü değiştirmez.
4. **Giriş manzarasını hazırla** veya **Sahneyi hazırla** kullan. Görev ekranında sağdaki hazırlık önizlemesinde resmi ve portreleri kontrol et; altındaki canlı önizleme oyuncuların mevcut görüntüsüdür. Hazırlık değişiklikleri izleyiciye gitmez.
5. **Yayına al** düğmesiyle göster. Altındaki canlı önizleme ve bağlantı durumu, gönderimin onayını gösterir. OBS kaynağında aynı görüntü açılır.
6. Oturum sonunda **Özel kampanya paketini indir** ile dosya yedeği al. Otomatik yerel kayıt da vardır; taşınabilir yedek başka bilgisayara geçmek içindir.

Parti başlangıçta boştur. Gil, Jeremiah ve Volomiyr kendiliğinden partiye eklenmez. **Kişi** panelinden oyuncu adı ve portresi seçerek kendi grubunu oluştur.

## Hazırlık ve canlı

**Hazırlık** düzenleme alanıdır; **Canlı** izleyicinin aldığı görüntüdür. Sahne kaydını açmak, haritada dolaşmak veya kişiyi yeniden adlandırmak hazırlıkta kalır. Kaydı güncellemek ile yayına almak ayrı işlemlerdir.

- **Canlıyı hazırlığa kopyala:** mevcut yayın üzerinden yeni düzenleme yap.
- **Hazırlığı iptal et:** hazırlığı canlı görüntüye döndür.
- **Önceki canlı:** son yayına alma öncesindeki görüntüye dön.
- **Geri al / ileri al:** hazırlıkta katman, harita taşı ve çizim değişikliklerini geri getir.

Acil sessizlik, canlı zar, savaş gösterimi, dikkat halkası ve **Oyuncu kamerasını buraya getir** anında canlıya etki eder. Bu düğmeler ayrıca adlandırılmıştır.

Sol sütunda sahne arama, favori, sıralama, çoğaltma, çöp kutusu ve geri getirme bulunur. Sağdaki **Sahne → Kayıtlı sahnenin özel bilgileri** altında kayıt adı, etiket, not, durum ve OBS sahne eşleştirmesi düzenlenir. Sütun ayraçları sürüklenebilir veya odaklanıp ok tuşlarıyla ayarlanabilir.

## Görev ve defter

Hazır kitap otomatik açılır; dosya yüklemen gerekmez. İstersen **Geniş DM okuma masasını aç** düğmesini kullan. Önce “Bölümü buradan başlat” alanındaki geliş yolunu, amacı ve kişileri oku. İlk bölüm yedi, kalan bölümler altışar sahnedir. Açılıştan sonra **İlk sahneye geç** kullan. Her sahnenin okunacak metni, sırayla yapılacakları, konuşmaları ve sonraki geçişi ayrı gösterilir. Zarlar ve ek teknik notlar açılır bölümdedir. Esc, geniş okuma masasını kapatır.

Bölüm girişinde **Giriş manzarasını hazırla / Girişi oyunculara göster** düğmeleri vardır. İlk bölümün tanışma ve sevk sözleşmesi, revir olaylarından önce oynanır. Yeni JSON'u aynı görev kimlikleriyle açmak mevcut adım, karar ve tamamlanma kayıtlarını korur; dosyanın içinde açık bir ilerleme kaydı varsa o kullanılır. Tam defter dosyanı ayrıca indirebilirsin.

Yeni resimler sitenin içindedir. Güncel siteyle hazır hikâye doğrudan açılır; kendi paketlerin için dosya seçimi korunur. Önceki kayıtlardaki canlı görüntü kendiliğinden değiştirilmez; yeni resmi hazırlayıp yayına al. **Görev sahnelerini içe al** mevcut görev kartlarını yeni içerikle günceller. ZIP'teki `On-Kis-Karari-Oynatim-Kitabi.html`, internetsiz okunabilen özel metin sürümüdür.


Görev panelinde adımları sırayla yürüt, kontrol maddelerini işaretle, gerekirse sahneyi atla veya sırayı değiştir. Alternatif çıkışlar rehberde görünür. Kararı kaydet ve **Hatırlatmaya dönüştür** ile sonraki oturumlarda yeniden karşına çıkar.

**Defter** panelindeki hatırlatmayı sahnelere veya görev kimliğine bağlayabilirsin. Bu kayıtlar yalnız DM'ye görünür. Olay, karar, söz, teslim ve ilişki notlarının ayrı bir **oyunculara açık cümle** alanı vardır. Özet düğmesi özel özeti tüm kayıtlardan, oyuncu özetini yalnız açık cümlelerden çıkarır. Her iki metni düzenleyip ayrı Markdown dosyası indirebilirsin. Açık özeti ara ekranına koymak ayrı komuttur.

Görev sonuçları otomatik olarak wiki kanonuna yazılmaz. DM paketi ve kampanya kaydı, uygulamanın halka açık lore verilerinden ayrıdır.

Görevdeki **numaralı sahneler** aynı bölümün adımlarıdır. Son İlaç, avludaki tanışma ve gece olayından başlayıp revir araştırmasına ve tedavi kararına uzanan yedi sahnedir. Bazı adımlar aynı arka planı/portreleri kullanır; olay ve kontrol metni değişir. **Sahneyi hazırla** sonrasında resim/portrelerin hazırlandığını belirten bildirim görünür; hazırlıktaki ara/perde kaldırılır. **Oyunculara göster** ayrı canlı yayın komutudur.

## Kişi, yer veya karşılaşma arama

Üstte **Kişi / yer bul** ortak dizini açar. Ad, yer veya görevle ara; **Kişiler / Karşılaşmalar / Yerler** filtresini seç. Sonuç kartında görev kaynağı, kişi rolü ve bağlı yer görünür. **İlgili görev sahnesini aç**, **Gece ve Yol kartını aç** veya **Savaş kartını aç** ile doğru içeriğe git. Bir sonuç seçmek yayını değiştirmez.

Portreyi veya mekânı hazırlığa ekleyip üstte **Yayına al** kullan. **Haritada konumu hazırla** mevcut şehir çevresini açar. Kaynakta kesin konumu olmayan bir arşiv resmine rastgele nokta verilmez.

Yeni yedi şehir tablosu **Valdareth, Morihael, Marhalden, Elorwyn, Theramis, Dorvenhall, Lirendil** adlarıyla bulunur. Ana sitedeki **Galeri** ve ilgili wiki sayfaları da bu resimleri gösterir. Yeni tablolar ölçülü plan değildir.

Ana sitenin **Haneler** menüsünde sekiz ülkenin 33 hane/klanı, özgün armaları ve sözleri bulunur. Ülkeyi seçince unvanlar, atanma biçimi ve silahlı güç düzeni açılır. **Galeri → Armalar** arma koleksiyonudur. Atlasın **Özgün 2D / Danstsud 3D / Loş 3D** düğmeleri ayrı görünümlerdir; ortak kanonik noktalar korunur. Loş 3D bütün dünya kabartma yorumudur, erişilemeyen Velutan referansının bire bir kopyası diye sunulmaz.

## Kişiler, katmanlar ve ipuçları

**Kişi** panelinde parti, NPC/dost ve düşman/canlı listeleri vardır. Gerçek ad ile oyuncuların bildiği adı ayırabilirsin. **Kimlik oyunculara açık** kapalıysa sahneye bilinen ad taşınır. Konuşma tavrı, amaç, ilişki, not, can ve zırh özel kayıttır.

Portreyi hazırlığa ekle veya haritaya koy. Birden fazla katmanı sürükleyip boyutlandırabilirsin. **Sahne** panelinden seçim, hizalama, grup, kilit, katman sırası ve konuşan vurgusu yönetilir. Shift/Ctrl ile birden çok portre seçilebilir. Kilitli katman sürüklenmez.

**Görsel** panelindeki hazır illüstrasyonları ya da kendi yüklemelerini arka plan, portre, resim veya büyütülmüş ipucu olarak kullan. Kullanılan yerel görselin yanlışlıkla silinmesi engellenir. İpucu üstündeki gizlenecek alanlar kaynak resmin yüzdesiyle tanımlanır. Hazırlık görünümü ve yayın için gizleme resmin gerçek piksellerine işlenir; açık kaynak resmin üstüne yalnız bir CSS kutusu konmaz. Yayın kaynağına yalnız seçilmiş görüntünün adı belirsiz dosya referansı gider.

## Harita

Araç çubuğu: gezinme, kalem, ok, silgi, dikkat halkası ve yer işareti. Kalem/taş/işaretler özgün haritanın koordinatlarına bağlıdır; zoom değişince kaymaz.

**Harita** panelinden şehir odağı, kamera yer imi, özel/açık işaret, yol etabı, etap sırası, tamamlanan etap sayısı ve taş kilitleri yönetilir. Yeni yer işareti önce özeldir. Dikkat halkası altı saniye görünür. Haritada gezinmek izleyici kamerasını taşımaz; ilgili canlı düğmesini kullan veya sahneyi yayına al.

Kilometre ölçeği başlangıçta tanımsızdır. Gerçek bir evren ölçeğin varsa haritanın **8192 piksel yatay genişliğinin kaç kilometre** olduğunu gir, sonra iki işaret seç. Sonuç kuş uçuşudur; dağ geçidi yürüyüş süresi değildir. Yer imleri kamera/ölçek bilgisini taşır.

Haritadan çıkmak için **Haritayı kapat · sahneye dön**, araç çubuğundaki **Haritayı kapat · Esc** veya **Esc** kullan. Şehir seçimi tek seferlik odaklanmadır; seçimden sonra liste kapanıp odağı bırakır. Yeniden gezinmek için seçim listesini açık tutman gerekmez. Haritadan çıkmak canlı görüntüyü değiştirmez.

## Savaş ve zar

**Görev → Karşılaşmalar · yol, pusu ve gece** altında 12 kart vardır. **Yalnız pusu ve canavar** filtresi beş savaşlı kartı gösterir: Sivren’in yol pususu, Ruvik’in takipçileri, İs Halkası, Mühürsüz Nöbetçi ve Uçurum Dinleyicisi. Yer, kullanma zamanı, DM hakikati ve keşif ipuçları ayrı görünür. **1d12 at ve kart çek** seçilen koşula uygun kartı getirir; uygun değilse sakin geçiş olur. [Tam kişi/yer rehberi](../../web/public/dm/GECE-VE-PUSU-KARTLARI.md).

**Savaş masasında aç** planı geniş orta alana taşır. **Karşılaşmanın düşmanlarını ekle · gizli** ile katılımcıları ekle; seçmek tek başına eklemez. Düşmanın amacı, uyarısı, taktiği, kaçış ve teslim koşulunu önce oku. **İsmiyle kişi veya yaratık bul** araması bütün dizini tarar; önce kendi kişi listene eklemen gerekmez. Kaynakta olmayan değerleri DM belirler. Hızlı hasar/iyileştirme düğmeleri geçici can ve azami can sınırına uyar.

**Savaş** paneli inisiyatif sıralaması, tur, sıradaki, önceki hamle, grup inisiyatifi, can/geçici can, zırh, durum ve konsantrasyon tutar. **Savaş bilgisini canlı göster** kapalıyken yalnız DM görür. Açınca yalnız seçilen yayın alanları gider. Can gösterimini kapalı, durum, çubuk veya sayı seçebilirsin. **İzleyiciden tamamen gizle** açık düşman listede görünmez. Gizli not ve zırh sınıfı yayın katmanına eklenmez.

**Zar** panelinde `1d20+5`, `2d6+1d4+3` gibi ifadeler kullanılabilir. Desteklenen zarlar d4/d6/d8/d10/d12/d20/d100; avantaj/dezavantaj tek d20 üzerindedir. Kişi, atış adı ve ek değer girilebilir. Atışları kaydet ve geçmişte kişi ara. **Gizli DM atışı** yayında ses veya görüntü üretmez. **Yalnız sonucu göster** formülü ve tekil zarları kapatır. Doğal 20 vurgusu otomatik başarı kuralı uygulamaz.

## Ses ve ara ekranı

**Ses → Karakterlere ses ver · ElevenLabs** bölümünde kendi sunucu anahtarınla sesleri listeleyebilir, seçtiğin konuşmayı üretebilir, MP3’ü dinleyip indirebilir veya ses kütüphanesine ekleyebilirsin. Metin yalnız açık **Ses üret** komutuyla sağlayıcıya gönderilir. API anahtarı istemciye/yayına konmaz; henüz ayarlanmadıysa üretim yapılmaz. [Yerel anahtar kurulumu](ELEVENLABS_SESLERI.md).

**Ses** panelinin müzik, ortam ve tek seferlik efekt kanalları bağımsızdır. Aynı ortam yeniden yayına alındığında baştan başlamaz. Seviye ve 0–5 saniye geçiş ayarlanır. Ses seçimi hazırlığa aittir; **Efekti canlı çal**, **Acil sessizlik** ve yeniden açma canlı komutlarıdır.

Hazır 12 ses, proje için kodla üretilmiş döngü/efekt dokularıdır: rüzgâr, yağmur, dalga, ateş, orman, kalabalık, mağara, kervan, uzak çatışma, sakin armonik doku, vurma ve zar. Gerçek alan kaydı veya orkestral müzik değildir. Kendi WAV/MP3/OGG/WebM dosyanı en çok 16 MB olarak yükleyip kullanım iznini/kaynağını not edebilirsin.

Ses kaynağını **Yönetim tarayıcısı**, **Ana OBS/izleyici kaynağı** veya kapalı seç. İzleyici seçilirse aynı sunucudaki ana çıktılardan biri ses sahipliği alır; şeffaf katmanlar ses çalmaz. Tarayıcı izin vermiyorsa ilgili pencerede **Sesi başlat** düğmesine bas. OBS'de yalnız o pencerenin sesini yakala; aynı sesi hem masaüstü hem tarayıcı kaynağıyla iki kez ekleme.

**Yayın → Ara ekranı:** mesaj, kampanya adı, süre ve ortamı seçip ara ver. Durdur/sürdür ve beş dakika ekle seçenekleri bulunur. Süre dolunca hazırlık açılmaz; **Moladan dön** komutunu sen verirsin. Kanonik harita kamerası ve taşlar ara animasyonuyla yer değiştirmez.

## OBS kurulumu ve 4K

OBS'ye **Tarayıcı kaynağı** ekle; ana URL:

```text
http://127.0.0.1:5173/#/broadcast/live
```

OBS tuvali ve tarayıcı kaynağının genişlik/yüksekliğini birlikte seç: **1920×1080**, **2560×1440** veya **3840×2160**. Monitörünün 4K olması tek başına OBS kaynağının 4K olduğu anlamına gelmez. 16:9 olmayan pencerede görüntü oranı korunur. Masaüstü kamerasını site açmaz; OBS'de kamera kaynaklarını sahnenin üzerine koy.

| Kaynak | Adresin sonu | Ses |
|---|---|---|
| Ana sahne | `/#/broadcast/live` | Seçilen tek kaynak |
| Yalnız harita | `/#/broadcast/output/map` | Yok |
| Şeffaf portreler | `/#/broadcast/output/portraits` | Yok |
| Şeffaf zar | `/#/broadcast/output/dice` | Yok |
| Şeffaf inisiyatif | `/#/broadcast/output/initiative` | Yok |
| Ara ekranı | `/#/broadcast/output/break` | Yok |

Adresleri **Yayın → OBS kaynakları** bölümünden kopyalayabilirsin. Ana çıktı tarayıcıda F ile tam ekran olur. Tam ekran düğmesi fare çıktıdan uzaklaşınca kaybolur. Bağlantı kesilince son görüntü korunur.

İstersen OBS'de **Araçlar → WebSocket sunucusu** aç; masadaki WebSocket 5 alanından adres/şifreyle bağlan. Kayıtlı sahneyi OBS sahnesiyle eşleştir. Yayına alırken OBS'ye de o sahneye geçmesi istenir. Şifre kalıcı kayda/pakete girmez. Bu sürümde protokol kimlik doğrulaması ve sahne geçişi tarayıcıda taklit sunucuyla sınandı; gerçek OBS masaüstü bu Linux ortamında çalıştırılmadı.

## Telefon ve oylama

Telefon için Windows'ta **baslat/Yayini-Uzaktan-Baslat.cmd**, macOS/Linux'ta **bash baslat/Yayini-Uzaktan-Baslat.sh** kullan. Sunucu aynı ağdan erişime açılır; bilgisayardaki yönetimi yine **127.0.0.1** üzerinden aç.

**Yayın → Telefon kumandası** altında kod üret, bilgisayarın LAN adresini kontrol et, bağlantıyı telefonda aç ve bağlan. Telefon ile bilgisayar aynı ağda olmalı; işletim sistemi sorarsa yerel ağ erişimine izin verilmelidir. Kod on dakika yeni eşleştirmeye açıktır. Eşleşen telefon sahne hazırlar, yayına alır, ara/ses/zar ve adım komutlarını çalıştırır. Özel görev notlarını almaz. Yönetim devralınır veya bırakılırsa eşleşme kapanır.

Oylama başlığını/seçeneklerini yazıp aç ve bağlantıyı paylaş. Sonuçlar canlı katmanda görünür; kapatınca yeni oy alınmaz. Bir tarayıcıdan ikinci oy engellenir; bu kişi kimliği doğrulaması değildir. `127.0.0.1` dışarıdaki izleyicinin erişeceği adres değildir. İnternet izleyicileri için erişilebilir sunucu/ters vekil ve uygun ağ kurulumu gerekir; site kendiliğinden internete açılmaz ve Twitch sohbetine bağlanmaz.

## Komutlar, yedekler ve kayıt sınırları

**Ctrl+K** komut menüsü; varsayılan **Alt+Enter** yayına al, **Alt+B** ara, **Alt+M** sessizlik, **Alt+N/P** adım, **Ctrl+Z** geri al. Metin alanına yazarken çalışmaz. **Yayın → Klavye ve hızlı panel** alanında değiştir; sık kullanılan komut/sahneleri sabitle.

**Özel kampanya paketi** JSON biçiminde hazırlık/canlı/önceki sahneyi, kayıtlı sahneleri, yerel görseller/sesleri, özel kişi bilgilerini, maskeleri, savaşı, zar geçmişini, defteri, DM dosyasını ve ilerlemeyi içerir. Bu dosya şifreli değildir; DM yedeği olarak sakla. Şifresiz sunulan yerleşik hikâyenin indirme dosyasıyla aynı dosya türü değildir.

İçe aktarırken önizlemede sayıları kontrol et. **Kampanyaya ekle** gelen sahne/kişi/medya/notları birleştirir, çakışan kimlikleri ayırır; mevcut canlı görüntüyü ve etkin savaşı korur. **Bu kampanyayı aç** dosyadaki kampanyayı bütün durumuyla geri yükler. Yedeğini önce indirebilirsin. Eski sürüm 1 yayın yedeği hazırlığa alınır; eski sürüm 1/2 DM paketleri görev paneline yüklenir. Eksik varlık veya bozuk bütünlük mevcut kampanyayı silmeden reddedilir.

Kayıtlar aynı tarayıcı profili ve origin'e bağlıdır. `localhost`, `127.0.0.1`, farklı port ve farklı profil ayrı depolardır. Bilgisayar değiştirirken dosya yedeği kullan. İkinci yönetim penceresi açıkça devralmadan düzenleme ve otomatik kayıt yapamaz.

Uygulama sınırları: 150 sahne, 200 kişi, 40 yerel görsel, 64 yerel ses, sahnede 40 görsel katmanı, 200 harita taşı, 80 savaşçı, 100 harita işareti. Kampanya dosyası 180 MB ve 400 benzersiz gömülü varlıkla sınırlıdır; sunucu varlık önbelleği 200 MB. Resimler/sesler her karede yeniden gönderilmez. Tarayıcı disk kotası cihaza göre değişir; kayıt hatası masada gösterilir.

**Tüm verileri sıfırla**, önce yedek indirme seçeneği ve `SIFIRLA` onayı ister. Yalnız bu origin'deki Aruzahr kayıtlarını temizler. Kaynak lore, hazır çizimler ve başka uygulamanın verileri korunur.

## Çalışma biçimi

Yerel yayın rölesi Vite geliştirme ve üretim önizlemesinde çalışır. `npm run build` ile oluşan `dist/` dosyalarını tek başına sıradan statik barındırmaya koymak röle, telefon ve oylama sunucusunu sağlamaz. Sunucuyu kapatırsan OBS son görüntüde kalır; tekrar başlatıp yönetimi açık tuttuğunda varlıklar yeniden gönderilir. Yeniden bağlanma yeni gizli hazırlığı otomatik yayına almaz.

Görseller mevcut elle boyanmış koleksiyondandır. 4K yerleşim, her kaynak illüstrasyonun yerel 4K çözünürlükte üretildiği anlamına gelmez. Başlatıcı Windows komutları Linux ortamında gerçek Windows oturumunda çalıştırılmamıştır.
