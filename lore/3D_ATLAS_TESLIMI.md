# Aruzahr — sıfırdan Danstsud 3D haritası

10 Ekim 2026. Kullanıcının son düzeltmesi doğrultusunda [master prompt](3D_ATLAS_MASTER_PROMPTU.md) önce yazıldı, ardından eski resme kabartma ekleyen uygulama değiştirildi. **3D görünüm yeni bir coğrafi sahnedir; özgün harita resmi zemin veya doku olarak kullanılmaz.** İlk kapsam Danstsud, başlangıç görünümü 2D’dir.

## Yeni harita

Kıyı çizgisi, Rydorn uzantısı, Hardlane girintileri ve Frostmere havzası koordinatlı kaynak parçalarından elle çizildi. Bu kapalı vektörlerden yükseltilmiş kara ve su altında kalan taban oluşturulur. Deniz ayrı bir geometridir. Ova/taş/kıyı pigmentleri ve küçük yüzey farklılıkları programatik olarak üretilir; fotoğraf veya kaynak atlas dokusu yüklenmez. Eski resmin kareleri, yazıları, gemileri ve çizilmiş şehirleri yeni zeminde bulunmaz.

On bir kapalı dağ alanı kaynakta görünen Rydorn, Dorvenhall, Lowvale ve Karlan/Hardlane sırtlarını sınırlar. Zirveler ayrı sırtlar ve taş yüzeyleri oluşturur; yükseklerde ve kaynakta beyaz olan Hardlane topraklarında kalıcı kar vardır. Kış katmanı soğuk alanların karını artırır. Deniz noktaları kara/dağ/orman üretmez. Doğu/Batı Aldara, Serenith (geniş kuzey koluyla) ve Teyra yeni su şeritleriyle; Frostmere ayrı havzayla gösterilir.

Yedi orman alanında sabit tohumlu, açıklıkları olan doğal kümeler üretilir. Ağaçlar kıyı, göl, nehir, çıplak zirve ve yerleşim merkezlerinden dışlanır. İğne yapraklılarda katlı taçlar ve kar tepeleri; geniş yapraklılarda farklı yönlere yayılan taçlar vardır. Valdareth çevresinde tarla parçaları ovayı belirginleştirir.

## Yerleşimler ve kullanım

Danstsud’un **58 yerleşimi** aynı kanonik koordinatlarda modellenir. 11 özel mimari: Valdareth’in beş düzensiz suru, yoğun evleri, sarayı, obsidyen mabedi ve feneri; Marhalden’in iki kale/köprü/işlikleri; Dorvenhall’in sınır kalesi ve çevre mahallesi; Elorwyn’in mabet/paladin avlusu; Theramis’in akademisi; Lirendil’in Çelikkalkan salonu; Frostbay’in eski/yeni yapı karışımı; Dranthol’un kale/feneri; Ternhaven’in sıcak su havuzu; Kaldmere’in barakaları; Vyssgard’ın depoları. Küçük yerlerde çatılı evler, şapel, değirmen, ambar veya gözetleme kulesi bulunur. Üç bağımsız anıt modeli de korunur.

“Danstsud 3D” aç/kapat düğmesi ile görünüm değişir. Harita içindeki “2D’ye dön” düğmesi tam ekranda da kullanılabilir. Model veya noktaya tıklamak mevcut bilgi panelini açar; wiki, arama, kanonik takma adlar ve ticaret durumları korunur. Sürükleme, tekerlek/iki parmakla yakınlaşma, sağ sürüklemeyle eğim, üstten görünüm, kuzeye dönüş, kamera sıfırlama ve ok tuşları çalışır. Kamera wiki dönüşünde hatırlanır. Başka ülkeye gidilince dünya atlası açılır.

Masaüstü ve dar ekran farklı arazi/ağaç yoğunluğu kullanır. Hareket azaltma ve atmosfer kapatma su/kar/buhar hareketini durdurur. Gizli sekmede döngü durur; çıkışta GPU kaynakları temizlenir. Motor yükleme, WebGL veya grafik bağlamı sorununda seçili yer korunarak 2D’ye dönülür.

## Kaynak ve sınırlar

8K kaynak değiştirilmedi: `Aruzahr 8k (1).jpg`, SHA-256 `c6b2827887a6cc0e25fbf619507ad60153135e89971d923935f8ffcc430866c8`. Merkezler ortak UV kayıtlarından gelir; önceki konum düzeltmeleri ve Fehar/Frethar tek kaydı korunur. `npm run assets` yalnızca 2D atlas katmanları ve ülke kapaklarını hazırlar; artık eski resmi 3D dokusu olarak üretmez.

Kıyı/dağ verisi kaynak çizimin yorumudur; kaynakta binalarla örtülen kıyılar görünen kara eteklerinden geçirilir. Güneydoğu sınırında atlasın dışına taşan, kaynakta görünmeyen yeni toprak uydurulmaz. Yükselti maket ölçeğidir; mimari modeller ölçülmüş şehir planı değildir. Diğer krallıklar 2D’dedir. Lore, illüstrasyonlar ve özel DM paketi bu görevde değiştirilmedi.

## Doğrulama

Bu sürümün güncel koşu sonuçları [son doğrulama kaydına](SON_DOGRULAMA.md) yazılır. Kontroller yeni kara/su ayrımını, kaynak resmi yüklemeyen motoru, 58 modelin konumunu ve seçimini, arazi üzerinde model temellerini, sudan dışlanan ağaçları, kaynak dağ alanlarında kalan yüksek üçgenleri, nehir görünürlüğünü ve 2D/wiki/kamera akışlarını kapsar.

Çalışma alanı görsel kanıtları `/workspace/artifacts/danstsud-rebuilt/` altında tutulur. `coast-reference-audit.png` yalnızca inceleme için kaynak resim ile kıyı vektörlerini karşılaştırır; sitenin 3D zemini değildir. Tarayıcı görüntüleri ve koşu kayıtları özel DM içeriği taşımaz ve site varlıklarına eklenmez.

Son sonuç: **24 yeni 3D senaryosu, 16 ilgili mevcut atlas senaryosu ve bir üretim gizlilik senaryosu başarılıdır**. 24 yeni senaryo son kaynak sürümünde tek tam koşuda geçti. Son üretim derlemesinde 23 görünüm kontrol edildi; JavaScript/konsol hatası veya yatay taşma bulunmadı. Ayrıntılı koşu ve ara hata bilgileri son doğrulama kaydındadır. 4.970 masaüstü / 2.883 dar görünüm ağacı; 245.503 / 77.976 arazi köşesi kullanılır. Üretim derlemesi ve kaynak harita bütünlük kontrolü başarılıdır.
