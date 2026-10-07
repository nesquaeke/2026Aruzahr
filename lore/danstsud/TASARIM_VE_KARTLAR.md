# Görsel atlas ve şehir kartları — 8 Ekim 2026

Kullanıcı, metin dizini yerine okunabilir ve eğlenceli görsel wiki; şehir kartlarında nüfus, yönetici, idare, ticaret, ekonomi ve savunma; yeni deniz/yer adlarının pinleri ve ticaret yollarını istedi. Bu belge arayüz için eklenen **yeni yazımı** önceki kaynak bilgisinden ayırır. Dönem değişmez: darbe öncesi, Eryndorn tahtta.

## Nüfus ve yöneticiler

Frostbay’in 45–50 bin ve Dranthol’un yaklaşık 1.500’den toplam 15.000’e ulaşması **kullanıcının verdiği bilgidir**. Diğer sayılar, hane ölçeğini ve şehirlerin birbirlerine göre büyüklüğünü anlaşılır kılmak için **bu turda oluşturulan kurgusal tahminlerdir**; özgün harita veya belgelerden elde edilmiş nüfus sayımı değildir. Valdareth açık farkla en büyük şehirdir. Marhalden’in geçit gücü nüfus büyüklüğünden gelmez. Mevsimlik göç nüfusları değiştirir.

| Şehir | Karttaki nüfus | Yönetici / işleyen idare | Kaynak durumu |
| --- | --- | --- | --- |
| Valdareth | yaklaşık 420.000 | Eryndorn Vaeranth, doğrudan kraliyet | Nüfus yeni tahmin; kral önceki kanon |
| Dorvenhall | yaklaşık 93.000 | Lord Rovan Mereth, üretici loncaları | Nüfus ve lord bu turda yeni yazım |
| Lirendil | yaklaşık 64.000 | Lord Averen Dhal, ÇelikKalkan çevresi | Nüfus ve lord bu turda yeni yazım |
| Elorwyn | yaklaşık 58.000 | Elorwynder Hanedanı | Nüfus yeni tahmin; hanedan önceki kanon; aile reisinin adı seçilmedi |
| Frostbay | 45–50 bin | İskele Vekili Nera Veld | Nüfus kullanıcıdan; vekil önceki Hardlane yeni yazımı |
| Theramis | yaklaşık 38.000 | Lord Elyas Theren; büyü kurumunda Başbüyücü Solan | Nüfus ve lord yeni; Solan kaynaklarda |
| Kethra | yaklaşık 29.000 | Damian Elorwynder | Nüfus yeni; yönetici önceki kanon |
| Brannis | yaklaşık 17.000 | Lord Varlen Neth | Nüfus ve lord bu turda yeni yazım |
| Dranthol | yaklaşık 15.000 | Ocak Kalesi Komutanı Ser Garran Veyl | Nüfus kullanıcıdan; komutan bu turda yeni yazım |
| Marhalden | yaklaşık 12.000 | Üç Mühür lordu Edran Korr | Nüfus yeni; makam ve lord önceki yeni yazım |
| Vyssgard | yaklaşık 11.000 | Beş İskele güç odakları | Nüfus yeni; düzen önceki Hardlane yazımı |
| Ternhaven | yaklaşık 8.500 | Ocak Meclisi, sözcü Mera Sorn | Nüfus, meclis ve sözcü bu turda yeni yazım |
| Kaldmere | yaklaşık 6.500 | Mahalle ocakları, merkezi otorite yok | Nüfus yeni; ocak dayanışması önceki yazım |
| Luthen | yaklaşık 3.200 | Karakol komutanlığı | Nüfus ve idareyi özetleyen kart kaydı yeni |
| Myrran | yaklaşık 1.800 | İskele heyeti | Nüfus ve yerel makam yeni |

Lord adları hazır kaynaklardan çıkarılmış gibi gösterilmez. Dranthol komutanı kralın yerine geçmez; garnizon ve kale idaresini temsil eder. Ternhaven’in yerel meclisi krallıktan bağımsız bir devlet değildir. Nera’nın Frostbay’deki sınırlı erişimi Hardlane’in tümüne egemenlik sayılmaz. Solan büyü kurumunun başıdır; şehir lorduyla aynı makam değildir. Elorwynderlerin Tharion–Damian aile ilişkileri bu kartlarla çözülmüş sayılmaz.

## Beş üzerinden göstergeler

Bunlar ekonomik büyüklüğün ölçülmüş değerleri veya sayısal savaş kuralları değildir. Danstsud yerleşimlerini karşılaştıran **göreli anlatı ölçeği**: 1 çok zayıf, 3 orta, 5 krallığın en güçlü örnekleri.

- **İdare:** İşleyen kamu idaresi ve hizmet erişimi. Çetenin zor kullanma gücü tek başına yüksek idare puanı vermez.
- **Ticaret:** Pazar, liman ve taşıma bağlantıları. Korsan ve kaçak ticareti de hacim yaratabilir.
- **Ekonomi:** Üretim ve gelir kapasitesi; şehirdeki her hanenin refahı değildir.
- **Savunma:** Tahkimat ve düzenli güvenlik. Her sakine eşit koruma veya garantili fethedilemezlik anlamına gelmez.

Bu yüzden Frostbay’de ticaret 4, idare 2; Dranthol’da savunma 5, ticaret 2; Vyssgard’da ticaret 4, düzenli savunma 1; Marhalden’de savunma 5’tir. Ayrıntılı kart verisi `web/src/presentation.ts` içinde.

## Harita işaretleri ve güzergâhlar

**32 özgün yerleşim pini korunur.** Kullanıcının yeni yer adlarını da görmek istemesi üzerine 12 ek vergi yerleşimine **yaklaşık yön bulma işareti** eklendi: Pilorn, Fehar, Gaalmire, Naeron, Fevric, Theld, Korhenden, Uldar, Tolvur, Toran, Harven, Mavric. Toplam **44 yerleşim**. Yeni işaretler kesik çerçeve ve “konum yaklaşık” notuyla ayrılır; küçük ölçekte gizlenir, yakınlaşınca veya aramayla görünür.

Ad benzerliği kesin eşleştirme sayılmaz: Pilorn/Rilorn, Fehar/Frethar, Gaalmire/Galmire, Korhenden/Korthen ve Uldar/Ildar otomatik birleştirilmez. İlave işaret bir yerleşimin kesin konumu, idari sınırı veya topografik ölçümü değildir.

**16 coğrafya / yol hedefi:** Ak Cam, Soluk Su, Ayaz Yutan, Kırağı/Son Nefes, Kefen; Frostmere; Veyrakar, Aldarataç, Tholkar; Rilorn ve Brolin körfezleri; aşağıdaki beş güzergâh. Deniz etiketleri tek bir yaklaşık etiket noktasıdır, denizin kesin sınırı değildir. Zirvelerin konumları da yaklaşık; yükseklikler önceki Karlan yazımından.

**Beş şematik hat:**

1. **Kemiğe Basan Yol:** Ternhaven–Dranthol–Frostbay–Marhalden; var olan fakat uzun, güvensiz gayriresmî hat.
2. **Cevher Çizgisi:** Ternhaven–Marhalden; yalnız **plan**, hiç yapılmadı. Soğuk renkli seyrek kesik çizgi ve panelde açık durum notu. Kullanılabilir yol veya ikinci güvenilir dağ geçidi değildir.
3. **Kralın Yolu:** Valdareth’ten Marhalden eşiğine kraliyet bağlantısı. Bağlantı önceki kanon; çizilen ara etaplar yaklaşık atlas temsili.
4. **Mor Sır Hattı:** Dorvenhall–Valdareth menekşespatı ve saray kiremiti üretim zinciri. **Atlas adı bu turda yeni yazım**; yeni tek bir resmi devlet yolu yapıldığı anlamına gelmez.
5. **Myrran–Luthen Yolu:** Lirendil’den Myrran üzerinden Luthen’e kaynaklarda geçen kervan bağlantısı. Çizgi şematik.

Çizgiler haritayla birlikte pan ve yakınlaştırmaya uyar; rotaya veya etiketine basınca kartı, karttan wikisi açılır. Mesafe, seyahat süresi, kış erişimi, gümrük noktaları veya kesin yol döşemesi bu çizgilerden çıkarılmaz. Coğrafya ile yol katmanları ayrı kapatılabilir. Küçük harita özgün araziyi göstermeye devam eder.

## Görsel ve okuma düzeni

Şehirlerde illüstrasyonlu kapak, nüfus/yönetici/iklim kartı, göreli güç göstergeleri, geçim etiketleri, üç kısa merak başlığı ve ilgili kişilerin portreleri bulunur. Eski wiki metni silinmez: “Kartlar” modunda bölümler kısa önizleme ile açılır; “Tam lore” modunda tamamı okunur. Tablolar, bağlantılı kayıtlar, mobil İçindekiler, yer imleri ve kalıcı wiki bağlantıları korunur. Haritaya dönüş son kamera konumunu hatırlar.

GitHub’a yüklenen **Ashara.png** görsel dili için incelendi; özgün dosya değiştirilmedi. Soğuk, doğal fırça dokusu ve antik altın çerçeve yaklaşımı arayüz ve yeni resimlerde kullanıldı. Ashara resmi galeriye eklendi; yalnız resimden biyografi veya gizli kimlik türetilmedi. Kullanıcının bilgisayarındaki `Karakterler` klasörü bu bulut ortamından erişilebilir değildir; bu turda yalnız depodaki resmi kullanıldı.

Yeni resimler web için WebP olarak saklanır; kaynak 8K harita yeniden çizilmedi. Resimler anlatıyı canlandıran illüstrasyonlardır; ölçülmüş şehir planı değildir. Kaynak ve üretim ayrımı `web/public/illustrations/README.md` içinde.

Bu turda toplam 18 yeni illüstrasyon üretildi: 11 şehir, Karlan/Frostmere/Ak Cam için üç doğa sahnesi ve dört portre. Ashara web kopyasıyla 19 görsel varlık uygulamaya dahil edilir.
