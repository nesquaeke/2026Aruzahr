# ARUZAHR — HARİTAYA BAĞLI 3D KABARTMA ATLAS MASTER PROMPTU

Kullanıcı talebi: özgün Valhunar haritasını CK3 / Paradox strateji oyunlarındaki gibi eğimli kamera, kabartmalı arazi, üç boyutlu şehirler, özel binalar, nehirler, ormanlar ve iklime bağlı atmosfer ile keşfedilebilir hale getir. Önce bu çalışma talimatını yaz; ardından uygulanmış, test edilmiş atlası teslim et.

## 1. Temel hedef ve kaynak

Çalışmanın kaynağı `Aruzahr 8k (1).jpg` adlı 8192 × 5668 özgün haritadır. Mevcut 95 yerleşimin, sekiz ülkenin, üç Danstsud alt bölgesinin ve coğrafya hedeflerinin kimlikleriyle koordinatlarını koru. Yeni bir dünya haritası üretme. Yeni kıta, yeni şehir, denizden çıkan rastgele dağ veya çalışır hale getirilmiş hayalî ticaret hattı ekleme.

Haritayı yalnızca eğilmiş bir resim olarak sunma. Arazi gerçek bir yükselti ağı; orman ve yapı gerçek üç boyutlu geometri; su ve atmosfer ayrı katmanlar olsun. Uzak görünümde özgün çizim okunabilsin; yakın görünümde sade bir boya yüzeyi binaları ve ormanı öne çıkarabilsin. Çizim dokusu düğmesiyle her ölçekte kaynak dokuya dönülebilsin. Boya yüzeyi koordinatları değiştirmez; renklendirme görsel yorumdur. Haritanın kuzeyi, sağ-sol ilişkisi, kıyılar, dar geçitler ve şehir merkezleri kameranın eğiminden bağımsız aynı koordinat sisteminde kalsın.

CK3 referansı kamera, ölçek değişimi, arazi hissi ve okunabilir keşif için kullanılır. Oyunun arayüzünü veya varlıklarını kopyalama. Aruzahr'ın koyu, altın detaylı arayüzünü ve ressam elinden çıkmış renk duygusunu sürdür. Karakter illüstrasyonlarına ait fotoğraf ve plastik render yasağı korunur; bu görevde istenen 3D atlas, mat ve stilize bir harita maketi olarak işlenir.

## 2. Kanon ve doğruluk sınırları

Eryndorn hâlâ tahtta; Danstsud darbe öncesi dönemindedir. Yeni görünüm eski lore'u değiştirmez. Fehar/Frethar tek yerleşimdir. Hardlane'de merkezî idarenin zayıflığı korunur. Kaldmere'ye kraliyet sarayı veya gelişmiş surlar uydurma. Cevher Çizgisi yapılmamış projedir; haritada ancak plan olarak gösterilir.

Bir resim gerçek yükseklik ölçümü değildir. Haritada görünen dağ kuşaklarını ve mevcut coğrafya kayıtlarını esas alan, düzenlenebilir bir kabartma taslağı oluştur. 13 bin metre bilgisi Karlan lore'udur; ekranda kullanılan yükselti dünya ölçeğine göre okunabilir biçimde abartılır. Ekran bir jeodezik veya metreyle ölçülmüş arazi modeli gibi tanıtılmaz. Kıyı yüzeyi, orman alanı, nehir çizgisi ve binaların maket yerleşimi kaynak çizime dayalı yorum olarak kaydedilir.

## 3. Kamera ve keşif

İlk açılış bütün haritayı anlaşılır bir eğimle göstersin. Tekerlek ve iki parmak yakınlaştırır; sürükleme haritayı taşır. Sağ sürükleme veya ayrı kontrol kameranın eğimini değiştirir. Klavye +/−, bütün harita, kuzeye dönüş ve üstten/eğimli görünüm çalışsın. Kamerayı harita sınırları yakınında tut; kullanıcı tek bir hareketle dünyayı kaybetmesin.

Ülke, bölge veya şehir seçildiğinde kamera doğru noktaya yumuşakça ilerlesin. Kullanıcının sürüklemesi bu hareketi durdurabilsin. Seçim aynı bilgi panelini açsın; wikiye gidip dönünce ilgili hedef ve 3D kamera korunabilsin. Doğrudan `#/atlas/yer-id` bağlantıları çalışsın. 2D çizim görünümüne dönme seçeneği erişilebilir olsun; görünüm tercihi bu tarayıcıda hatırlansın.

Uzak bakışta şehir tabelası ve yoğun model kalabalığı yaratma. Yakınlaşınca orman hacmi ve şehir maketleri kademeli belirginleşsin. Seçili yerin adı her zaman okunabilsin. Etiketlerin seyrelmesi noktaların kaybolmasına dönüşmesin; mevcut her hedef bulunabilir ve seçilebilir kalmalı.

## 4. Arazi kabartması

Karlan, Honud'un buzlu dağları, Garmirk'in sarp adaları, Dorvenhall çevresinin yüksek sırtları ve Lakbar'ın volkanik alanları farklı yükselti karakteri taşısın. Valdareth ovası geniş, daha alçak ve tarıma elverişli görünsün. Rydorn daha yumuşak bir kıyı sırtı olarak ayrışsın. Deniz yüzeyi düz kalsın; adaların kıyısında dağların devamı suya rastgele taşmasın.

Dağ zirvelerinde biçim ve ışık gerçek hacmi göstersin. Yüksek ve soğuk yüzeylerde kar rengi, kayanın bir kısmını açıkta bırakan bir örtü gibi davranabilsin. Kar bütün Danstsud'a veya sıcak adalara yayılmasın. Yerleşim merkezinde yapılar arazinin altında veya havada kalmasın; küçük yerleşim zemini kabartmaya uyum sağlasın.

## 5. Şehirler ve özel yapılar

95 yerleşimin tamamı ortak kayıtlarından bir şehir, köy veya harabe maketine ulaşabilsin. Her yer aynı kale değildir. Büyük şehirler daha büyük ve kendine özgü; küçük yerler birkaç çatı, iskele, avlu veya kuleyle temsil edilebilir. Maketler ölçülü bir yorumdur, yeni bina sahipleri ve gizli hikâyeler eklemez.

- **Valdareth:** dıştan içe beş sur kuşağı, iç kraliyet kalesi, siyah obsidyen mabedi, mavi-mor çatılar, eski deniz feneri ve liman savunması. Dış yerleşim iç kaleden daha alçak ve sade olsun.
- **Marhalden:** karşı kıyılarda iki kale, aralarında köprü/geçit düzeni, taş ocakları ve güçlü duvarlar. Tek kaleyle iki makamı birleştirme.
- **Dorvenhall:** yüksek sırt üzerinde korunaklı kale ve mavi-mor çatı karakteri. Thural Kalkanı kendi harita hedefinde savunma yapısı olsun.
- **Elorwyn:** paladin düzeninin kalesi, avlu ve okunaklı rahip/rahibe mabedi silueti. Valdareth'in beş halkalı planını kopyalama.
- **Theramis:** büyü ve araştırma kuleleri, akademi/arşiv kütlesi ve avlu. Rastgele dev enerji küreleriyle metnin anlamını değiştirme.
- **Lirendil:** Çelik Kalkan'ın ağır lonca salonu, kent çatısı ve kıyı karakteri.
- **Frostbay:** eski taş daireler ve harabelerin yanında daha küçük, düzensiz yapılar.
- **Dranthol:** liman kalesi ve deniz feneri.
- **Ternhaven:** daha küçük yerleşim ve sıcak su havuzu; yapılmamış yol bitmiş görünmesin.
- **Vyssgard:** yıpranmış depo ve iskele düzeni; merkezî güçlü saray ekleme.
- **Kaldmere:** sade ahşap barınaklar ve küçük iskele.
- **Diğer ülkeler:** Xotar için kumtaşı ve kubbe, Murgul için orman ve ahşap, Honud için kar çatılı uzun ev, Garmirk/Gurbin için kayalık kale, Ariki için kıyı yapıları, Lakbar için koyu taş ve volkan silueti.

Kaydı bulunan özel kule, kale, fener ve harabeler kendi mevcut koordinatlarına yerleşsin. Yapı ve şehir maketine tıklamak ilgili mevcut hedefi açsın. Bir model için bilinen bir isim yoksa yeni kanonmuş gibi isim uydurma.

## 6. Nehir, deniz ve orman

Doğu Aldara ovaya, Batı Aldara Marhalden'den Frostmere'e gider. Serenith ve Teyra kendi çizilen hatlarına bağlı kalsın. Nehirlerin üç boyutlu şeritleri arazinin üstüne otursun; yüksek yüzeyin içinden kaybolmasın veya başka şehre taşınmasın. Akış hafif animasyonla sezilsin. Nehir izi çizimden yorumlandığı için çalışma kaydı bunu açıklasın.

Deniz üzerinde sakin, düşük kontrastlı hareket olsun. Donmuş suların görünümü açık denizden ayrılsın. Frostmere'e kış görünümünde buz örtüsü eklenebilir; mevsim seçimi görsel bir atlas tercihidir, kampanya tarihini değiştirmez.

Ormanlar haritadaki ağaç kümelerini takip etsin. Yeşil yapraklı orman, karlı iğne yapraklı alan, kurak bölgenin küçük korusu ve sonbahar tonları ayrışsın. Tekrarlanan ağaçları verimli ortak geometriyle çiz. Deniz ortasına, sarayın içine veya aşırı yüksek zirveye rastgele ağaç ekleme. Yakınlaşınca hacim okunabilsin, uzak görünümde etiketler boğulmasın.

## 7. Atmosfer ve erişilebilirlik

Honud, Hardlane ve yüksek dağlara yakın bakışta yerel kar yağışı; uygun kıyı/sırtlarda hafif pus; Lakbar'da ölçülü sıcak ışık; Ternhaven'de sıcak su hissi ekle. Kar yer ve yükseltiyle belirlenir, bütün ekranı sürekli kaplayan bir dekor değildir. Atmosfer düğmesi efektleri kapatabilsin.

Azaltılmış hareket tercihi kamera geçişini anında yapar ve hareketli yağış/akışı durdurur. Statik arazi, kar örtüsü, şehirler ve bilgiye erişim korunur. Mobilde kontroller sığsın; klavye ile görünüm, katman ve yer seçimi çalışsın. Harita motoru yüklenemez veya grafik bağlamı kaybolursa mevcut 2D atlas çalışmaya devam etsin.

## 8. Uygulama ve performans

3D motorunu ihtiyaç halinde yükle. Orijinal 8K dosyayı değiştirmeden uygun boyutlarda doku türevleri hazırla; yakınlaşınca daha ayrıntılı dokuyu kullan. Mobilde piksel oranı, arazi ağı, gölge ve parçacık bütçesi sınırlı olsun. Ağaçlarda örnekleme, yapılarda birleştirilmiş geometri ve uzaklık ayrıntısı kullan. Görünmeyen sekmede animasyonu durdur. Görünümden çıkınca GPU kaynaklarını, dinleyicileri ve animasyon döngüsünü temizle.

Katmanlar aynı harita kimlikleriyle çalışır. 2D ve 3D için birbirinden kopuk şehir listeleri oluşturma. İşleyen, tehlikeli ve planlanan yolların mevcut durumunu koru; rotalar araziye otursun. Kitaplar, galeri, karakterler, lore ve özel DM paketinin sınırları değişmez.

## 9. Kabul ölçütleri

Master prompt, düzenlenebilir yüzey/model kayıtları ve kullanılan yaklaşık yorumlar teslim kaydında yer alsın. Gerçek tarayıcıda 3D görünüm açıldığı, yükselti ve model geomet­rilerinin oluştuğu, bütün 95 yerleşimin aynı kimlikle bulunduğu, model/nokta tıklamasının panel ve wikiye gittiği doğrulansın. Yakınlaşma, eğim, kuzey ve bütün harita kontrolleri; kamera dönüşü; doğrudan bağlantı; 2D tercihi; bağlam kaybı; azaltılmış hareket ve mobil taşma test edilsin.

Valdareth, Marhalden, Karlan, orman/nehir alanı ve Honud ekran görüntüleriyle gözle incelensin. Rastgele yere konmuş dağ, su üstündeki orman, havada bina veya seçilemeyen şehir kalmasın. Üretim derlemesi ve ilgili eski atlas/wiki testleri geçsin. Tamamlanmış iş, yaklaşımın gerçek sınırları ve doğrulama sonucu açıkça bildirilsin; yapılmamış bir geliştirme yapılmış gibi anlatılmasın.
