# Aruzahr — 3D kabartma atlas teslimi

10 Ekim 2026. Kullanıcının önce master prompt, ardından haritaya bağlı 3D uygulama isteğinin karşılığıdır. [Master prompt](3D_ATLAS_MASTER_PROMPTU.md) uygulamadan önce yazılmıştır. Özgün çizim, şehir merkezleri ve mevcut lore korunur.

## Çalışan deneyim

Yeni ziyaretçi gerçek Three.js/WebGL atlasını açar. Dağlar yükseltilmiş arazi ağı, ağaçlar örneklenmiş geometri, şehirler birleşik yapı modelleridir. Dünya yalnızca eğilmiş bir resim değildir. Uzakta kaynak çizim; yakınlaşınca yapıları okunabilir kılan sade, mat arazi rengi görünür. “Çizim” kontrolü her ölçekte özgün dokuya döner.

Tekerlek ve iki parmak yakınlaştırır; sürükleme taşır; sağ sürükleme yönü/eğimi değiştirir. Üstten/eğimli görünüm, kuzeye dönüş ve sıfırlama çalışır. Ok tuşları ile taşıma ve +/− kontrolleri vardır. Şehir noktası veya gerçek yapı geometrisi mevcut bilgi panelini açar; wikiye gidip dönünce seçilen yer ve kamera korunur. 2D/3D tercihi aynı tarayıcıda hatırlanır.

Orman, su, kış ve özgün çizim ayrı kontrollerdir. Kar yüksek/soğuk alanlarda; buhar Ternhaven'de yereldir. Lakbar sıcak renk ve ölçülü sıcak ışıkla ayrılır. Atmosfer kapatıldığında parçacıklar temizlenir. Azaltılmış hareket, kamera geçişini anında yapar ve hareketli su/kar/buharı durdurur. Görünmeyen sekmede döngü durur; atlas kapatıldığında geometri, malzeme, doku ve olay dinleyicileri temizlenir.

3D motorunun dosyası indirilemez, WebGL açılamaz, başlangıç dokusu yüklenemez veya grafik bağlamı kaybolursa aynı yerin paneliyle 2D çizim atlası açılır. 2D görünüm ayrıca kullanıcı kontrolündedir.

## Haritaya bağlanan kapsam

| İçerik | Uygulamadaki karşılık |
| --- | --- |
| 95 yerleşim | Aynı kanonik kimlik ve UV merkezlerinde 95 ayrı 3D model grubu |
| 137 hedef | 8 ülke, 95 yerleşim, 3 alt bölge ve 31 coğrafya/yol hedefinin ortak kayıtları |
| 14 dağ omurgası | Karlan, Dorvenhall, Rydorn, Garmirk, Taş Klanları, Honud, Lakbar, Gurbin, Ariki ve Eldrascar |
| 18 orman alanı | Kaynak çizimdeki kümelere bağlı yapraklı, iğne yapraklı ve sonbahar/kurak koru paletleri |
| 4 nehir | Doğu Aldara, Batı Aldara, Serenith, Teyra; gerçek arazi üçgenlerinden örneklenen su şeritleri |
| 8 bağımsız yapı | Thural Kalkanı, Thessar Açığı Feneri, Runeth Kuzeyi Harabeleri ve beş mevcut Lakbar yapısı |
| 5 ticaret kaydı | Mevcut şehir duraklarıyla araziye oturan şematik hatlar; yapılmamış Cevher Çizgisi kesikli plan |

Fehar/Frethar tek kayıttır. Kullanıcının önceki 31 yer adı ve altı konum düzeltmesi değiştirilmedi. Harita noktalarını seyrelten bir ülke filtresi eklenmedi; etiketler çakışmayı azaltır, noktalar seçilebilir kalır. Arama ve eski bağlantılar aynı kanonik kaydı açar.

## Mimari imzalar

| Şehir | 3D maket |
| --- | --- |
| Valdareth | Beş düzensiz sur kuşağı, kraliyet kalesi, obsidyen mabedi, mavi-mor çatılar, eski fener, liman savunması ve 105 küçük ev |
| Marhalden | İki kale, geçit köprüsü, döküm/maden atölyeleri |
| Dorvenhall | Sınır kalesi, mavi-mor çatı, gözetleme kuleleri |
| Elorwyn | Mabet, paladin avlusu, çan kuleleri ve lordluk kalesi |
| Theramis | Akademi/arşiv, beş araştırma kulesi ve çalışma avlusu |
| Lirendil | Çelik Kalkan salonu, talim avlusu ve iskeleler |
| Frostbay | Eski taş daire ve düzensiz kıyı barınakları |
| Dranthol | Liman kalesi ve fener |
| Ternhaven | Sıcak su havuzu ve küçük evler |
| Kaldmere | Ahşap barınak ve küçük iskele |
| Vyssgard | Yıpranmış depo/iskele düzeni |

Diğer yerleşimler kendi ülkesinin kumtaşı/kubbe, ahşap/uzun ev, koyu taş veya kayalık kale paletini kullanır. Yeni hanedan, bina sahibi ya da gizli olay uydurulmadı. Yapı planları maket yorumudur; illüstrasyon portreleri ve güç çerçeveleri değişmedi.

## Kaynak ve yorum sınırı

8192 × 5668 kaynak `Aruzahr 8k (1).jpg` değiştirilmedi. SHA-256: `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`. 2048 ve 4096 piksel WebP dokular, mekanik küçültme türevleridir; yeni harita resmi üretilmedi.

Çizim bir yükseklik ölçümü veya mimari plan değildir. Kıyı çokgenleri, dağ omurgaları, orman sınırları ve nehir izleri **kaynak çizime dayalı, düzenlenebilir görsel yorumdur**. Kabartma okunabilirlik için abartılır; Karlan'ın lore'daki 13.000 metresi ekrandaki dünya birimine eşitlenmez. Yakın yüzeyin renkleri yorumdur. Kıyı ve nehir sınırlarında bu ağın görsel çözünürlüğü geçerlidir. Şehir merkezleri ortak kanonik kayıtlardan gelir; ayrı bir 3D şehir listesi kullanılmaz.

Kış görünümü bir atlas tercihi, kampanya tarihi değildir. Eryndorn hâlâ tahtta, dönem darbe öncesidir. Mevcut wiki, kitaplar, karakterler, galeri ve özel DM paketinin sınırı korunur.

## Düzenlenebilir uygulama

- `web/src/relief-data.ts`: kaynak piksel → dünya dönüşümü, kıyı/su alanları, yükselti omurgaları, şehir zemini, iklim, orman ve nehir kayıtları.
- `web/src/relief-buildings.ts`: mimari tip, birleşik model, ülke paleti ve aynı harita kimliğiyle tıklama.
- `web/src/relief-scene.ts`: arazi ağı, gerçek yüzey örnekleyicisi, ağaçlar, su, rota ve yerel hava.
- `web/src/Atlas3D.tsx`: kamera, etiket projeksiyonu, geometri seçimi, ayrıntı seviyesi ve kaynak temizliği.
- `web/src/relief.css`: görünüm seçimi ve masaüstü/mobil kontroller.
- `web/scripts/build-map.mjs`: mevcut Deep Zoom katmanlarıyla birlikte iki 3D doku türevi; üretim sürümü 2.

## Bütçe ve doğrulama

Masaüstü arazi ağı 40.247, dar görünümdeki ağ 18.032 köşedir. Oluşturulan ağaç sayısı sırasıyla 2.173 ve 1.260'tır. Ağaçlar ortak geometri örnekleridir; yapı parçaları malzemeye göre birleştirilir. Yakınlık ve görüş alanı model görünürlüğünü belirler. Dar sahnede gölge kapalı, parçacık sayısı 180 ve piksel oranı en çok 1,25'tir; masaüstünde 340 parçacık ve en çok 1,7 kullanılır. Yakın yüksek doku dar sahnede yüklenmez. Bunlar uygulama bütçeleridir, her cihazda aynı FPS vaadi değildir.

**22 yeni 3D senaryo ve 17 mevcut atlas senaryosu doğrulandı.** 3D kapsamı: tüm 95 modelin ortak merkeze bağlılığı; gerçek kabartma; nehir yüzlerinin gerçek arazinin üstünde kalması; bağımsız piksel → kamera projeksiyonu; 95 noktanın paneli; gerçek kale geometrisine tıklama; sürükleme/döndürme/yakınlaştırma; wiki-kamera dönüşü; arama ve eski adlar; katmanlar; iklim; hareketsiz kamerada atmosferin kapanması; 320/390/820/1024/1440 px kontrolleri; bozuk depolama; indirilemeyen motor; WebGL yokluğu ve gerçek bağlam kaybı.

Eski 16 kontrol: özgün görüntü piksellerinde 31 ad + altı düzeltilmiş merkezin simge hizası; rota seçimi ve yapılmamış proje; wiki/portre bağlantıları; Büyük Kırılma; galeri/bestiary; şehir kartları; kamera dönüşü; Fehar eşleştirmesi; mobil ve azaltılmış hareket. Ek 17. senaryo, son derlemede DM içerik sınırını ve geliştirme sunucusunun ham lore dosyalarını engellediğini doğruladı. Bütün 139 kayıtlı senaryo bu görevde yeniden koşulmadı.

3D'nin nihai tam koşusunda 20 senaryo geçti; bir ek atmosfer testinin, bir dağ bölgesini şehir yakınlaştırmasıyla aynı değerde varsayan beklentisi düzeltildi. Kamera gerçek hedefte durduktan sonra atmosferi kapatan aynı senaryo ayrı koşuda geçti. Son malzeme düzenlemesinde su/kış/çizim ve sabit kamerada atmosfer kontrolleri tekrar geçti. Motor indirme hatası eklendikten sonra yeni ziyaretçi, wiki-kamera dönüşü, WebGL yokluğu ve indirme hatası senaryolarının dördü de geçti. Bu kayıttaki 22 benzersiz senaryo, tam ve hedefli koşuların birleşimidir.

TypeScript/Vite üretim derlemesi ve `git diff --check` geçti. Derlenmiş sitede dünya, Valdareth, Marhalden, Veyrakar, Dorvenhall, Theramis ve Honud; beş ekran genişliğinde Valdareth/Marhalden; ayrıca kar, buhar ve Lakbar görünümleriyle toplam **20 görünüm** incelendi. Yatay taşma, gizli 2D dönüş kontrolü veya beklenmeyen tarayıcı hatası görülmedi. Ekran kayıtları `/workspace/artifacts/relief/` içindedir; Valdareth, Marhalden, Karlan, telefon ve Lakbar ayrıca gözle kontrol edildi. Gözlenen sahneler yaklaşık 10–63 çizim çağrısı ve 82 bin–278 bin üçgen aralığındadır; cihaz FPS ölçümü değildir.

Özel DM ZIP dosyası Git'e eklenmedi; `src`, `public` ve `dist` içinde özel paket yolu bulunmadı. Bu kayıt çalışan uygulama ve depo değişikliklerini anlatır; haricî bir barındırma hizmetinde canlı yayın yapıldığını ifade etmez.
