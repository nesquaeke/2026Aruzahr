# Aruzahr — Sıfırdan Danstsud 3D Haritası Master Promptu

Son yönlendirme: 10 Ekim 2026. Bu metin önceki, özgün resme kabartma ekleyen yaklaşımın yerini alır.

## Görev

Danstsud için sıfırdan, gezilebilir ve stilize bir üç boyutlu harita oluştur. Mevcut 8K Aruzahr haritası **yalnızca coğrafi referanstır**. Bu resmi bir düzleme kaplamak, yükseltmek veya üzerindeki çizilmiş şehirlerin yanına modeller koymak görevi karşılamaz. 3D açıldığında kullanıcı yeni çizilmiş kara ve denizleri, gerçek hacimli dağları ve yerleşimleri görmelidir. Özgün resmin yazıları, kareli zemini, şehir çizimleri, gemi süsleri ve kâğıt dokusu yeni haritada bulunmaz.

İlk kapsam yalnızca Danstsud’dur. Normal dünya atlası 2D olarak korunur. Başlangıç görünümü 2D olur; kullanıcı 3D’yi açıkça açabilir ve kapatabilir. Başka krallığa gidilince dünya atlasına dönülür. Her iki görünüm aynı yer adlarını, kimlikleri, bilgi panellerini ve wiki bağlantılarını kullanır.

## Coğrafyayı yeniden çiz

1. Özgün haritayı koordinatlı parçalar halinde incele. Danstsud kıyılarını, girintileri, Rydorn uzantısını, Hardlane kıyılarını, gölleri ve önemli akarsuları ayrı vektör verisi olarak çiz. Tahmini geniş bir çokgenle denizleri kara yapma.
2. Bu veriden yeni bir arazi yüzeyi üret. Karalar deniz seviyesinden yükselsin; kıyılarda kıyı şeridi ve deniz tabanına iniş görülsün. Deniz kendi yüzeyi ve rengiyle ayrı olsun. Göller kara dokusunun üstüne mavi çizgi olarak boyanmasın; su havzaları olarak görünsün.
3. Yüzeyin renklerini sıfırdan oluştur: ovada soluk yeşiller ve tarım tonları, dağda taş ve toprak, Hardlane’de soğuk gri-mavi ile beyaz. Mat yüzeyler, ölçülü ışık, doğal renk farklılıkları kullan. Fotoğraf dokusu, parlak plastik ve özgün atlas resmi kullanma.
4. Özgün haritadaki beyaz bölgeleri kar alanı olarak yeniden yorumla. Kar yalnızca parçacık değildir: yerde, yüksek yamaçlarda ve uygun ağaç tepelerinde de görünür. Kış düğmesi mevsimlik örtüyü genişletebilir; kalıcı yüksek dağ karını kaldırmaz.

## Dağlar, akarsular ve ormanlar

Dağları yalnızca kaynakta dağ olan kara alanlarına yerleştir. Rydorn, Dorvenhall çevresi ve Karlan sırası farklı yükseltiler ve okunabilir sırtlar taşısın. Deniz içinde dağ, yerleşimin altında rastgele sivri tepe veya bütün haritaya yayılan gürültü çıkmasın. Zirveler yalnız koni değildir: taş yüzeyleri, yan sırtları, geçitleri ve karlı üst bölümleri olan arazi geometrisidir. Görsel yükselti bir maket ölçeğidir, metre ölçümü gibi sunulmaz.

Nehirleri kaynakta izlenen güzergâhlara bağlı kalarak kur. Doğu/Batı Aldara, Serenith, Teyra ve Frostmere aynı coğrafi düzende yer alsın. Su kıyılarında ve nehir yataklarında ağaç çıkmasın. Suyun hareketi hafif ve okunaklı olsun; animasyonlar kapatılabilsin.

Ormanları sabit bir rastgelelik tohumu ile, doğal kümeler ve açıklıklar halinde dağıt. Yeni açılışta bütün orman değişmesin. Ağaçlar yalnızca karaya yerleşsin; şehir merkezlerini, suyu, çıplak zirveleri ve yolları işgal etmesin. Soğuk bölgelerde iğne yapraklılar, daha ılıman ovada geniş yapraklı kümeler kullan. Ağaçları düz resim işaretleri olarak çizme; gövde ve taç hacmi bulunmalı.

## Şehirleri modelle

Danstsud’un mevcut 58 yerleşiminin her birine, ortak kanonik koordinatındaki karaya oturan üç boyutlu bir model koy. Lore bulunmayan küçük yerlerin noktasını veya modelini atlama; bu iş için lore uydurma. Çizilmiş şehir resimleri yeni zemine aktarılmasın. Yapılar hacimli, çatılı ve seçilebilir olsun. Yakınlaşınca gerçekten görünen şehir dokusu oluşsun; uzaklaşınca karışıklığı azaltan isim ve işaret düzeni kullan.

Başlıca şehirler birbirinden ayrılmalı:

- **Valdareth:** düzensiz büyümüş beş iç duvar, yoğun mahalleler, iç kale ve kraliyet sarayı, siyah obsidyen kilise, eski deniz feneri, limanı koruyan duvar; mavi-mor çatı vurguları.
- **Marhalden:** Aldara’nın iki yakasında iki kale, köprü, güçlü duvarlar, ocaklar ve maden işlikleri; geçit şehri.
- **Dorvenhall:** yüksek taş kale, yamaca yayılmış yerleşim ve sınır gözetleme yapıları.
- **Elorwyn:** tapınak, paladin/ruhban yerleşkesi ve korunaklı mahalleler.
- **Theramis:** büyü akademisi, farklı kuleler, arşiv ve eğitim avluları.
- **Lirendil:** Çelikkalkan yerleşkesi, eğitim avlusu ve liman/ticaret dokusu.
- **Frostbay:** eski taş kalıntılar ile yeni, mütevazı yapıların karışımı.
- **Dranthol:** kale, düzenli garnizon, deniz feneri ve korunaklı liman.
- **Ternhaven:** sıcak su çevresinde daha açık yerleşim.
- **Kaldmere:** yoğun, düşük barakalar ve küçük iskele.
- **Vyssgard:** düzensiz depolar, ahşap iskeleler ve sıkışık liman yerleşimi.

Küçük yerleşimler tekrarlanan tek bir küp olmasın: çatılı ev grupları, gözetleme kulesi, değirmen, küçük tapınak veya depo gibi uygun farklarla oluşturulsun. Binaların ayrıntılı planları görsel yorumdur; yeni kanon diye sunulmaz.

## Kullanım

Yakınlaşma, sürükleme, eğimli/üstten görünüm, kuzeye dönme ve kamerayı sıfırlama çalışsın. Bir yerin modeline veya işaretine basınca doğru bilgi paneli açılsın; buradan mevcut wikiye gidilsin. Wiki dönüşünde kamera korunsun. Arama ve katman kontrolleri çalışsın. Harita renkleri ve ölçülü gölgeler birbiriyle uyumlu olsun; isim kalabalığı coğrafyayı örtmesin.

3D kapatıldığında normal 2D atlas hemen kullanılabilsin. WebGL desteklenmiyorsa veya GPU bağlantısı kesilirse açıklamayla 2D’ye dön. Küçük ekranlarda daha düşük geometri ve ağaç sayısı kullan; gezinmeyi ağırlaştıracak gereksiz nesneler üretme. Hareket azaltma ayarına uy; kapalı sekmede animasyonu durdur; çıkışta GPU kaynaklarını temizle.

## Teslim ölçütleri

- 3D motoru özgün harita resmini yüklemiyor veya arazi dokusu olarak kullanmıyor; yeni yüzey programatik olarak oluşturuluyor.
- Kara/su ayrımı, kıyı girintileri ve önemli su havzaları görsel olarak kaynakla karşılaştırılıyor. Deniz üzerindeki denetim noktalarında kara, dağ veya orman bulunmuyor.
- 58 yerleşimin tamamının kanonik koordinatı, modeli, kara üzerinde temeli ve çalışan seçimi doğrulanıyor.
- Dağlar, ormanlar ve kar yalnızca uygun coğrafi alanlarda bulunuyor. Nehirlerin ve gölün suyu yeni yüzeyde okunuyor.
- Üstten ve eğimli görünüm, farklı yakınlaştırmalar, bütün önemli şehirler ve telefon boyutları tarayıcıda gerçekten kontrol ediliyor.
- 2D atlas, wiki, arama, erişilebilir kontroller ve özel DM içeriğinin gizliliği korunuyor. Yapı derlemesi ve ilgili etkileşim testleri geçiyor.
- Kaynak 8K dosya değiştirilmeden kalıyor. Sonuç ve sınırlar belgeleniyor; yapılan şey gerçek ölçekli şehir simülasyonu veya tam CK3 oyunu diye sunulmuyor.

Bu prompt bir öneri listesi değildir. Önce coğrafi veriyi çıkar, sonra yeni haritayı üret, modelleri yerleştir, gerçek tarayıcı görüntülerini incele, hataları düzelt ve çalışan sürümü teslim et.
