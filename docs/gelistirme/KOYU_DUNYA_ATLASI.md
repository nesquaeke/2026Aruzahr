# Loş dünya kabartması · 27 Ekim 2026

Atlasın üstündeki **Özgün 2D**, yazarın 8K haritasıdır. **Danstsud 3D**, mevcut ayrıntılı Danstsud sahnesini açar. **Loş 3D**, bütün Valhunar için ayrı bir koyu kabartma görünümüdür. Seçilen görünüm tarayıcıda hatırlanır. Sağ sürükleme kamerayı eğer; üstten görünüm, kuzey ve kamera sıfırlama düğmeleri haritanın sol üstündedir. Özgün haritaya dönüş düğmesi sağ alttadır.

Loş görünüm 8K resmini arazi dokusu olarak yüklemez. `web/scripts/build-cinematic-atlas.mjs`, resimden yalnız teknik kara/su maskesi çıkarır; çizim yazıları ve küçük süsler temizlenir. Honud dış sınırı için elle hazırlanmış sınır kullanılır, içindeki mavi su kanalları korunur. Danstsud'da daha önce kaynak üzerinden çizilmiş kıyı ve dağ kayıtları kullanılır. Yükseklikler görsel ölçeklerdir; ölçülmüş rakım değildir. Kıyı çıkarımı ve diğer ülkelerin dağ koridorları yorumdur; haritacılık ölçümü veya bire bir kopya iddiası yoktur.

137 seçilebilir konum ve 95 yerleşim özgün kayıt kimliği ve UV koordinatlarını korur. Kaynak çizimde bazı adların merkezi su boyasının üstündedir. Böyle bir durumda **pin taşınmaz**; simgesel şehir maketi en fazla dünya genişliğinin %2,2'si uzaktaki gerçek kara hücresine yerleşebilir. Yeni ada çizilmez. İnceleme için `.cinematic-viewer` üzerindeki `data-city-offsets`, kaynak pinini, maket merkezini ve uzaklığını ayrı verir. `data-city-ids` ve `data-target-count` kapsama kontrolü içindir.

Danstsud'un 58 yerleşimi mevcut ayrıntılı maketlerini kullanır: başkentin beş sur kuşağı, Marhalden'in kaleleri ve Lirendil'in anıtsal feneri korunur. Diğer ülkelerdeki yerleşimler simgesel tasarımdır. Honud'un terk edilmiş iç kentleri yıkık yapılarla gösterilir; yeniden iskân edilmiş sayılmaz. Danstsud nehirleri arazi üstüne yerleşen sürekli su şeritleridir. Diğer ülkelerin henüz ayrı nehir çizgisi verisi bulunmayan ayrıntıları icat edilmez.

WebGL, kaynak maskesi veya GPU bağlamı kullanılamazsa aynı seçili yer korunarak özgün 2D atlasa dönülür. Görünüm kapatıldığında GPU geometri/malzeme/doku ve dinleyicileri bırakılır. Görünmez sekmede çizim durur; sabit harita sürekli yeniden çizilmez. Hareket azaltma tercihi kamera geçişini de anlık yapar.

Referans olarak istenen Velutan sitesi bu ortamın ağında 403 tünel hatası verdi. Bu nedenle sitenin iç yapısı incelenmiş veya görünümün ona bire bir eş olduğu söylenemez. Yeni renderer mevcut kaynak haritaya bağlı bağımsız bir yorumdur.

Doğrulama: `cd web && npx playwright test tests/cinematic-atlas.spec.ts --workers=1`. Testler bütün konumların korunmasını, maketlerin gerçek karada ve sınırlı uzaklıkta olmasını, bağımsız deniz kontrol noktalarında dağ çıkmamasını, ülke sınırını aşan seçimleri, kamerayı, kaynak hatası sonrası dönüşü ve dar ekranı kapsar.
