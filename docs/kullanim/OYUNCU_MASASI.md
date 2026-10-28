# Oyuncu Masası · karakterini oluştur ve yanında taşı

Sitede üst menüden **Oyuncu Masası** seç veya `/#/play` adresini aç. Bu bölüm oyuncuların kendi kayıtları içindir; ansiklopedideki kişilerden ayrıdır. D&D 5e **2014** kurallarını kullanır.

## İlk karakter

1. **Karakter oluştur** ile bir isim ve sınıf seç. On iki temel sınıf ve 1–20. seviyeler desteklenir.
2. **Kimlik** bölümünde soyunu, geçmişini ve memleketini yaz. İstersen bir Aruzahr hanesiyle bağ kur ve kendi portreni yükle. Bu seçimler seni otomatik olarak hanedanın yöneticisi yapmaz.
3. **Nitelikler** bölümünde altı nihai puanını ve yetkinliklerini gir. Değiştiriciler, kurtulma atışları ve beceri bonusları hesaplanır. Soydan gelen puanları nihai puanlarına kendin ekle; uygulama bunları ikinci kez eklemez.
4. Zırhını, kalkanını, saldırılarını ve eşyalarını kaydet. **Macerada** ekranı günlük oyun takibindir: can, geçici can, can zarları, durumlar, sınıf kaynakları ve dinlenme.
5. Büyü kullanıyorsan **Büyüler** bölümünden defterini ve hazır büyülerini düzenle. **A4 kâğıt** bölümünden çıktını al.

## Seviye ve büyü derecesi

Karakter seviyesi ile büyü derecesi farklıdır. **2. seviye büyücü, 1. derece büyüler kullanır.** Büyücü 3. seviyede 2. derece büyü yuvası kazanır. Arşivde 0–9. derece büyülerin hepsini okuyabilirsin; sınıfın ve seviyen için uygun olanlar ayrıca gösterilir.

Yerleşik katalog **SRD 5.1’deki 319 büyüdür**. Ek kitaplarda yayımlanmış bütün büyü metinlerini içerdiği iddia edilmez. Türkçe ad, açıklama, malzeme, süre, menzil ve üst derece kullanım bilgileri birlikte verilir. İngilizce ad aramada bulunabilirlik içindir. Menziller fit olarak korunur: standart kare 5 fittir.

- **Büyücü:** Büyü defteri ile günlük hazır büyü listesi ayrıdır. Defterinde yazılı her büyüyü aynı gün hazır sayma.
- **Rahip / druid / paladin:** Günlük hazırlanmış büyü sınırını takip et. Uygulanabilen alan ve yemin büyüleri ayrıca gösterilir.
- **Ozan / korucu / doğuştan büyücü:** Bilinen büyü sayısı günlük hazırlık sayısından farklıdır.
- **Anlaşmalı büyücü:** Anlaşma yuvaları kısa dinlenmede, Gizemli Sırlar uzun dinlenmede yenilenir; bu iki kaynak birbirine dönüştürülmez.
- Soydan, özel yetenekten veya büyülü eşyadan gelen ek özellikleri kaynaklar/notlar alanına yaz. Çoklu sınıf hesabı bu sürümde otomatik yapılmaz.

Bir büyüyü deftere eklemek, büyü kullanmak değildir. Kullanım komutu uygun kaynağı harcar. Kısa dinlenme normal büyü yuvalarını veya bütün canını kendiliğinden doldurmaz.

## A4 karakter kâğıdı

Hazır boş şablonlar:

- [Karakter kâğıdı · A4 PDF](../../web/public/downloads/Aruzahr-Karakter-Kagidi-A4.pdf)
- [Büyü defteri · A4 PDF](../../web/public/downloads/Aruzahr-Buyu-Defteri-A4.pdf)

Kendi karakterin için **A4 kâğıt → Yazdır / PDF** kullan. Tarayıcıdaki yazdırma penceresinde **A4**, **%100 ölçek**, üstbilgi/altbilgi kapalı seç. PDF almak için hedefi **PDF olarak kaydet** yap. Uzun eşya, büyü ve hikâye kayıtları ek sayfalara geçer. Boş şablon tek A4 sayfadır; dolu bir karakterin ekleri birden fazla sayfa olabilir.

## Kayıt ve yedek

Karakterler **kullandığın tarayıcıda otomatik saklanır**. Hesap veya cihazlar arası bulut eşitleme bu sürümde yoktur. Her oyuncu kendi tarayıcısında kendi karakterlerini oluşturabilir. Kayıtlar kendiliğinden wikiye, diğer oyunculara veya yayın ekranına gönderilmez.

**Yedek indir** ile JSON dosyanı indir; başka cihazda veya sitede **Karakter yedeği aç** ile geri yükle. `127.0.0.1` ile Vercel alan adı ayrı kayıt alanlarıdır; taşınırken dosya yedeğini kullan. Tarayıcı verilerini silmeden önce yedek al. Sitedeki bütün Aruzahr verilerini sıfırlamak bu karakterleri de siler.

Özel büyüler için arayüzdeki JSON şablonunu indirip doldur. Sınıf, derece ve kullanım bilgileri standart biçimde içe aktarılır; yerleşik büyüler değiştirilmez.

## Vercel’de yayımlamak

Depo kökünde `vercel.json` hazırdır. Vercel projesinde bu depoyu seçip kök dizini depo kökü olarak bırak; Node.js sürümünü 24 seç. Kurulum ve derleme komutları `web/` uygulamasını kurar, 8K haritanın döşemelerini üretir ve `web/dist` çıktısını yayımlar. Bu oyuncu bölümünün çalışması için API anahtarı gerekmez.

Vercel’de karakter oluşturma, büyü arama, dosya yedeği ve A4 çıktısı statik site olarak çalışır. Mevcut OBS Yayın Masası’nın yerel rölesi ve ElevenLabs sunucu bağlantısı, bilgisayarda çalışan yerel başlatıcıyı kullanır. Gerçek Vercel yayını bu geliştirme sırasında yapılmadı.

Kaynak ve lisans: [SRD 5.1 atfı](../../web/public/licenses/SRD-5.1.txt). Sınıf özellikleri ve özel durumlarda masanızın DM kararı geçerlidir; otomatik hesaplanan ve elle takip edilen alanlar arayüzde ayrılır.
