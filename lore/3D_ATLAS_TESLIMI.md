# Aruzahr — Danstsud 3D coğrafya, mimari ve Kral Yolu

10 Ekim 2026. Kullanıcının son düzeltmesi doğrultusunda [master prompt](3D_ATLAS_MASTER_PROMPTU.md) önce yazıldı, ardından eski resme kabartma ekleyen uygulama değiştirildi. **3D görünüm yeni bir coğrafi sahnedir; özgün harita resmi zemin veya doku olarak kullanılmaz.** İlk kapsam Danstsud, başlangıç görünümü 2D’dir.

## Yeni harita

Kıyı çizgisi, Rydorn uzantısı, Hardlane girintileri ve Frostmere havzası koordinatlı kaynak parçalarından elle çizildi. Bu kapalı vektörlerden yükseltilmiş kara ve su altında kalan taban oluşturulur. Deniz ayrı bir geometridir. Ova/taş/kıyı pigmentleri ve küçük yüzey farklılıkları programatik olarak üretilir; fotoğraf veya kaynak atlas dokusu yüklenmez. Eski resmin kareleri, yazıları, gemileri ve çizilmiş şehirleri yeni zeminde bulunmaz.

Marhalden çevresindeki teraslar dahil on iki kapalı dağ alanı kaynakta görünen Rydorn, Dorvenhall, Lowvale ve Karlan/Hardlane sırtlarını sınırlar. Zirveler ayrı sırtlar ve taş yüzeyleri oluşturur; yükseklerde ve kaynakta beyaz olan Hardlane topraklarında kalıcı kar vardır. Kış katmanı soğuk alanların karını artırır. Deniz noktaları kara/dağ/orman üretmez. Doğu/Batı Aldara, Serenith ve Teyra, paylaşılan birleşim noktaları olan dokuz akarsu şeridiyle; Frostmere ayrı havzayla gösterilir.

Yedi orman alanında sabit tohumlu, açıklıkları olan doğal kümeler üretilir. Ağaçlar kıyı, göl, nehir, çıplak zirve ve yerleşim merkezlerinden dışlanır. İğne yapraklılarda katlı taçlar ve kar tepeleri; geniş yapraklılarda farklı yönlere yayılan taçlar vardır. Valdareth çevresinde tarla parçaları ovayı belirginleştirir.

## Yerleşimler ve kullanım

Danstsud’un **58 yerleşimi** aynı kanonik koordinatlarda modellenir. 11 özel mimari: Valdareth’in beş düzensiz suru, yoğun evleri, sarayı, obsidyen mabedi ve feneri; Marhalden’in iki kıyıya yerleşen kale, kemerli köprü, dağ terasları ve iki şelalesi; Dorvenhall’in plato üzerindeki sınır kalesi, küçük/büyük atölyeleri ve askeri yerleşkesi; Elorwyn’in geniş meydanı, mabetleri, paladin avlusu ve ruhban okulları; Theramis’in beyaz kuvars sütunları, mavi işlemeli akademileri ve çeşmeleri; Lirendil’in büyük kütüphanesi, büyük feneri, Çelikkalkan salonu ve kervanları; Frostbay’in büyük eski yapı kalıntıları ve yeni barınakları; Dranthol’un kale/feneri; Ternhaven’in düzenli evleri ve sıcak su havuzu; Kaldmere’in barakaları; Vyssgard’ın depoları. Küçük yerlerde çatılı evler, şapel, değirmen, ambar veya gözetleme kulesi bulunur. Üç bağımsız anıt modeli de korunur.

“Danstsud 3D” aç/kapat düğmesi ile görünüm değişir. Harita içindeki “2D’ye dön” düğmesi tam ekranda da kullanılabilir. Model veya noktaya tıklamak mevcut bilgi panelini açar; wiki, arama, kanonik takma adlar ve ticaret durumları korunur. Sürükleme, tekerlek/iki parmakla yakınlaşma, sağ sürüklemeyle eğim, üstten görünüm, kuzeye dönüş, kamera sıfırlama ve ok tuşları çalışır. Kamera wiki dönüşünde hatırlanır. Başka ülkeye gidilince dünya atlası açılır.

Kral Yolu, Lirendil–Valdareth bağlantısı ve başkentten Hardlane dışındaki 51 yerleşime kara üzerinde hesaplanmış dallar oluşturur. Marhalden’de son bulur; Hardlane’in batı şehirlerine bakımlı yol uydurmaz. Rotalar düğmesiyle açılır.

Masaüstü ve dar ekran farklı arazi/ağaç yoğunluğu kullanır. Yakındaki ormanlarda dallı taçlar, uzakta ve görüş merkezinden uzak kümelerde daha hafif geometri; her ikisinde yumuşak yüzey normalleri ve yaprak yüzeyi bulunur. Taş derzleri, kiremit sıraları, ahşap damarları, kaya katmanları ve su ayrı yüzey ayrıntısı kullanır. Kar, dik kayada azalır; daha yatay yüzeylerde ve rüzgârla oluşan örtüde belirginleşir. Tarla parçalarında ekim sıraları görünür. Eğik güneş ışığı ve gölgeler yamaç ve yapı hacmini gösterir. Hareket azaltma ve atmosfer kapatma su/kar/buhar hareketini durdurur. Kamera geçişleri kare sayısına değil gerçek geçen zamana göre tamamlanır; değişmeyen sahnenin gölgesi yeniden hesaplanmaz. Gizli sekmede döngü durur; çıkışta GPU kaynakları temizlenir. Motor yükleme, WebGL veya grafik bağlamı sorununda seçili yer korunarak 2D’ye dönülür.

## Üretim önizlemeleri

Valdareth: beş sur, mavi-mor mahalleler, kraliyet kalesi, obsidyen kilise ve denize açılan liman.

![Valdareth 3D önizlemesi](onizlemeler/valdareth-3d.png)

Marhalden: iki yakadaki kaleler, köprü, teraslar ve dağdan inen Aldara.

![Marhalden 3D önizlemesi](onizlemeler/marhalden-3d.png)

## Kaynak ve sınırlar

8K kaynak değiştirilmedi: `Aruzahr 8k (1).jpg`, SHA-256 `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`. Merkezler ortak UV kayıtlarından gelir; önceki konum düzeltmeleri ve Fehar/Frethar tek kaydı korunur. `npm run assets` yalnızca 2D atlas katmanları ve ülke kapaklarını hazırlar; artık eski resmi 3D dokusu olarak üretmez.

Kıyı/dağ verisi kaynak çizimin yorumudur; kaynakta binalarla örtülen kıyılar görünen kara eteklerinden geçirilir. Güneydoğu sınırında atlasın dışına taşan, kaynakta görünmeyen yeni toprak uydurulmaz. Yükselti maket ölçeğidir; mimari modeller ölçülmüş şehir planı değildir. Diğer krallıklar 2D’dedir. Lore, illüstrasyonlar ve özel DM paketi bu görevde değiştirilmedi.

## Doğrulama

Bu sürümün güncel koşu sonuçları [son doğrulama kaydına](SON_DOGRULAMA.md) yazılır. Kontroller yeni kara/su ayrımını, kaynak resmi yüklemeyen motoru, 58 modelin konumunu ve seçimini, arazi üzerinde model temellerini, sudan dışlanan ağaçları, kaynak dağ alanlarında kalan yüksek üçgenleri, nehir görünürlüğünü ve 2D/wiki/kamera akışlarını kapsar.

Bu düzeltmenin çalışma alanı görsel kanıtları `/workspace/artifacts/danstsud-refined/` altında tutulur. Önceki sürümün kanıtları `/workspace/artifacts/danstsud-rebuilt/` içindedir. `coast-reference-audit.png` yalnızca inceleme için kaynak resim ile kıyı vektörlerini karşılaştırır; sitenin 3D zemini değildir. Tarayıcı görüntüleri ve koşu kayıtları özel DM içeriği taşımaz ve site varlıklarına eklenmez.

Tam 3D koşusu **25/25 başarılıdır**. Son yüzey/ışık geçişinden sonra ilgili beş senaryo yeniden çalıştırılarak **5/5 geçti**; 25’in tamamı bu son geçişte tekrar koşulmadı. 16 benzersiz ilgili atlas senaryosu ve bir gizlilik senaryosu da doğrulandı; ilgili koşuların birleşimi ve ara düzeltmeler [son doğrulama kaydında](SON_DOGRULAMA.md) açıkça belirtilir. Son üretim çıktısında 23 görünüm ve ayrıca kraliyet yol ağı görüntüsü incelendi; JavaScript/konsol hatası veya yatay taşma görülmedi. Masaüstü 424.530 arazi köşesi / 4.970 ağaç, dar görünüm 117.459 köşe / 2.883 ağaç kullanır. Önceki 24 senaryolu sonuçlar sürüm tarihçesidir.
