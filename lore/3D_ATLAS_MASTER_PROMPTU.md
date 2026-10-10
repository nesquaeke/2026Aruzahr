# Aruzahr — Danstsud 3D Atlasını Geliştirme Master Promptu

Son yönlendirme: 10 Ekim 2026. Önce bu promptu yaz; ardından uygula, gerçek tarayıcı görüntüleriyle incele ve doğrula. Son kullanıcı isteği aşağıdaki ayrıntılı şehir, coğrafya ve malzeme gerekliliklerini ekler.

## Görev

Danstsud için sıfırdan, gezilebilir, doğal ışıklı ve ayrıntılı bir üç boyutlu harita oluştur. CK3 gibi strateji haritalarının coğrafi okunabilirliği ve malzeme kalitesi hedeflenir. Ucuz low-poly görünümü, koni dağlar, üçgen topak ağaçlar ve çıplak küplerden şehirler kullanma. Mevcut 8K Aruzahr haritası **yalnızca coğrafi referanstır**. Bu resmi bir düzleme kaplamak, yükseltmek veya üzerindeki çizilmiş şehirlerin yanına modeller koymak görevi karşılamaz. 3D açıldığında kullanıcı yeni çizilmiş kara ve denizleri, gerçek hacimli dağları ve yerleşimleri görmelidir. Özgün resmin yazıları, kareli zemini, şehir çizimleri, gemi süsleri ve kâğıt dokusu yeni haritada bulunmaz.

İlk kapsam yalnızca Danstsud’dur. Normal dünya atlası 2D olarak korunur. Başlangıç görünümü 2D olur; kullanıcı 3D’yi açıkça açabilir ve kapatabilir. Başka krallığa gidilince dünya atlasına dönülür. Her iki görünüm aynı yer adlarını, kimlikleri, bilgi panellerini ve wiki bağlantılarını kullanır.

## Coğrafyayı yeniden çiz

1. Özgün haritayı koordinatlı parçalar halinde incele. Danstsud kıyılarını, girintileri, Rydorn uzantısını, Hardlane kıyılarını, gölleri ve önemli akarsuları ayrı vektör verisi olarak çiz. Tahmini geniş bir çokgenle denizleri kara yapma.
2. Bu veriden yeni bir arazi yüzeyi üret. Karalar deniz seviyesinden yükselsin; kıyılarda kıyı şeridi ve deniz tabanına iniş görülsün. Deniz kendi yüzeyi ve rengiyle ayrı olsun. Göller kara dokusunun üstüne mavi çizgi olarak boyanmasın; su havzaları olarak görünsün.
3. Yüzeyin renklerini sıfırdan oluştur: ovada doğal yeşiller ve tarım tonları, dağda taş ve toprak, Hardlane’de soğuk gri-mavi ile beyaz. Yamaç yönü, yüzey pürüzü, renk ve kar sınırı birlikte çalışsın. Doğal malzeme ayrıntısı ve gölgeler kullan; aşırı doygun düz yeşil, tekrarlanan dalga şeritleri, plastik yüzey ve özgün atlas resmi kullanma. Bu 3D talebi, karakter/hayvan illüstrasyonlarının elle boyanmış tasarım kuralını değiştirmez.
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

## Son isteğin ayrıntılı uygulama sözleşmesi

### Kıyılar ve akarsular

Kaynak atlası koordinatlı yakın planlarla incele. Kıyı girintilerini ve çıkıntılarını düzelt; yanlış kapanmış koyları aç. **Lirendil’in kuzeyinde deniz olmalıdır**; görünümün üst kenarını kara ile doldurma. Nehir yatağı ve su aynı, kesintisiz güzergâhta ilerlesin. Doğu/Batı Aldara’nın ortak kaynağını ve Frostmere bağlantısını koru. Serenith ve Teyra’nın eksik veya yanlış parçalarını tamamla. **Valdareth’e ulaşan nehir şehrin bir yanından/içinden geçerek denize kadar akmalı; liman gerçek denize açılmalıdır.** Nehirler yüzeyde boyanmış, kopuk veya dağa gömülü mavi çizgiler olamaz. Marhalden’de dağdan inen çağlayanlar ve şelale görünmelidir.

### Ayrıntılı şehir mimarileri

**Marhalden:** Karlan dağlarının içine yerleşmiş teraslı evler, maden işlikleri, dar dağ sokakları. Ortasından Aldara geçer ve dağ yatağından aşağıya çağlayan/şelalelerle iner. İki yakada iki ayrı kale, taş köprü, köprübaşlarında ve yamaçlarda kuleler bulunur. Kaleleri ve evleri tek düz platforma koyma. Kaya, güçlü savunma, yüksek güvenlikli zindan ve dağ geçidi birlikte okunmalıdır.

**Valdareth:** çok kalabalık, düzensiz büyümüş başkent. Beş ayrı sur kuşağı; en içte kraliyet kalesi ve sarayı ile siyah obsidyen kilise. Ayrı büyük hapishane, muhafız yerleşkeleri, lonca yapıları. İçte daha yoğun ve varlıklı mahalleler; dışa doğru yoksullaşan küçük evler; dışta köy dokusu ve tarım. Duvarlar kusursuz beş çember değildir; kapıları, burçları ve avluları olan düzensiz mahalle kuşaklarıdır. Mavi-mor ev çatıları. Büyük eski deniz feneri, koruyucu liman duvarı, iskeleler, ambarlar ve Mor Donanma’nın koy bağlantısı. Nehir köprüleri ve kıyı mahalleleri suyun denize ulaşmasını gösterir.

**Elorwyn:** paladin ve ruhban şehri. Ferah geniş sokaklar, açık meydan ve avlular, altın işlemeli amblemler, büyük kiliseler ve geniş ruhban okulları. Paladin eğitim sahası, askeri yerleşke, açık taş mimarisi. Altın ayrıntılar kapı, sancak ve dini yapılarda kullanılır; her yüzeye yayılan parlaklık oluşturma.

**Theramis:** liberal ve özgür büyü şehri. Beyaz kuvars taşları, mavi işlemeler, sütunlu meydanlar, büyük büyü okulları, çeşmeler, arşiv ve kemerli geçitler. Yunan şehir devletini çağrıştıran geniş meydan ve sütunlu mimari. Bütün binaları sivri şapkalı kulelere dönüştürme.

**Dorvenhall:** dağların ardında plato ve ovalara açılan sanayi şehri. Büyük/küçük atölyeler, dökümhaneler, ocak ve baca kümeleri, işlik avluları, yük depoları, askeri binalar. Dağ geçitlerinde sınır korucu kuleleri. Şehir yalnızca yüksek bir kaleden ibaret değildir.

**Lirendil:** görece küçük şehir; **çok büyük deniz feneri ve çok büyük kütüphane**. Kütüphane, Çelikkalkan yerleşkesi, ticaret avlusu, kervanlar, yük arabaları, kıyı ve kuzeydeki deniz birbirini açıklar. Başkent kadar ev ekleme; iki büyük simgesel yapı ile küçük şehir ölçeği arasındaki fark görünmelidir.

**Hardlane:** soğuk, ihmale uğramış, yıpranmış ahşap barakalar, kırık duvarlar ve eski yerleşimler. Lore dosyalarından şehirlerin farklarını koru. Frostbay’de çok büyük görkemli ama yıkık taş yapılar ve kalıntılara sığınmış barakalar, eski idari yapı ve küçük fener bulunur. Dranthol reformlarla kurulmuş düzenli kale/garnizon, liman ve fener taşır; çevresi yoksul olabilir. Ternhaven sıcak su çevresinde daha düzenli, eski Hardlane kültürünü koruyan yaşanabilir küçük şehirdir. Vyssgard sıkışık, düzensiz, yamalı depolar ve tahta iskelelerden oluşan suç limanıdır. Kaldmere altyapısız mülteci barakaları ve küçük iskeledir; gösterişli kale ekleme.

58 yerleşimin tamamı korunur. Büyük şehirlerin mimarilerini ortak birkaç şeklin renklerini değiştirerek üretme. Çatı, pencere, kapı, kemer, merdiven, sur kapısı, avlu, çarşı ve iskele ayrıntıları yakın planda görünür olmalıdır. Planlar görsel yorumdur; yeni kaynak kanonu gibi sunulmaz.

### Kral Yolu

**Lirendil’den Valdareth’e kesintisiz kara Kral Yolu** oluştur. Başkentten **Hardlane dışında kalan bütün Danstsud şehirlerine** yollar ve bağlantılar ulaşsın. Marhalden geçidin doğu ucudur ve ağa bağlanır. Batıdaki Hardlane şehirlerine tamamlanmış kraliyet yolu uzatma; Harven/Mavric hariç, doğudaki Uldar/Toran/Tolvur dahil. Yollar karada, yamaçlarda kıvrılarak ve nehirlerde köprüyle ilerlesin. Deniz üzerinden düz altın çizgi çekme. Mevcut ticaret güzergâhları ile tamamlanmamış Cevher Çizgisi projesini koru. Katman kontrolüyle yolları gizlemek mümkün olsun.

### Görsel kalite, kullanım ve doğrulama

Doğal yüzey ayrıntısı, okunabilir sırtlar ve vadiler, kayalık yamaçlar, kademeli kar sınırı, doğal su ve yumuşak gün ışığıyla şehirleri araziye bağla. Ormanların dalları ve dolu taçları olsun; düşük çokgenli topak görünümünden çık. Sabit dağılım tohumu ve uzaklığa uygun ayrıntı kullan; görünmeyen nesneleri çizme. Mobil kullanım, hareket azaltma, GPU temizliği ve WebGL kaybında 2D dönüş korunur.

Kaynakla kıyı/akarsu karşılaştırmasını, Lirendil’in kuzeyindeki suyu, başkentin deniz bağlantısını, Marhalden’in iki yakasını ve şelalesini ayrı doğrula. Uygun bütün şehirler yol ağına bağlı olmalıdır. Ülke görünümünü ve büyük şehir yakın planlarını gerçek tarayıcıda incele. Test geçti diye kaba görünümü kabul etme. Derleme, ilgili etkileşim ve gizlilik testlerini tamamla; sonucu dürüstçe belgele. Tam CK3 oyunu veya gerçek ölçekte mimari simülasyon iddiasında bulunma.
