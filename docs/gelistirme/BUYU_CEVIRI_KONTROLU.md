# Türkçe büyü kataloğu kontrol kaydı

28 Ekim 2026. Katalog **D&D 5e 2014 / SRD 5.1 içindeki 319 büyüyü** kapsar. Bütün yayımlanmış ek kitapların büyü metinleri bu sayı içinde değildir. SRD dışı veya ev yapımı büyüler oyuncunun özel JSON dosyasıyla eklenebilir.

## Kaynak ve kapsam

- Temel veri: `web/scripts/data/5e-SRD-Spells-2014.json`; 5e-bits/5e-database, `src/2014/en/5e-SRD-Spells.json`.
- Türkçe uyarlama: `web/src/player/translations/spells-1.json`, `spells-2.json`, `spells-3.json`.
- Birleştirme: `node web/scripts/build-player-spells.mjs`.
- Kaynak kimlikleri, dereceler ve sınıf listeleri korunur. Mesafe birimi fit olarak kalır; yuvarlanmış metre dönüşümü yapılmaz.
- Lisans ve atıf metinleri `web/public/licenses/` içindedir. Türkçe açıklamalar masada kullanılabilecek biçimde kısaltılmış uyarlamalardır.

## Bütün kayıtlarda yapılan otomatik kontrol

319 kaynak kimliği ile 106 + 106 + 107 Türkçe kimlik bire bir karşılaştırıldı; eksik, fazla veya yinelenmiş kimlik bulunmadı. Ad, açıklama, üst derece ve malzeme alanlarının türleri; kaynakta bulunan malzeme ve üst derece açıklamalarının karşılıkları kontrol edildi. Yer tutucu, çevrilmeden kalmış temel İngilizce kural cümlesi ve metne yanlışlıkla yazılmış `\\n` dizisi bulunmadı.

Kaynak açıklama ve üst derece metinlerindeki bütün `NdM` zar ifadelerinin Türkçe kayıtta karşılığı kontrol edildi. Tek fark, kaynak Moonbeam metnindeki `1dl0` yazım hatasının `1d10` olarak düzeltilmesidir. Malzemesi tüketilen büyülerde tüketim koşulunun Türkçe açıklamada veya malzeme alanında bulunması ayrıca kontrol edildi. Bu kontroller tek başına bütün kuralların doğru çevrildiğini kanıtlamaz.

## Ayrıntılı okunan 30 karmaşık büyü

Nesne Canlandırma, Astral Yansıtma, Gizemli El, Büyü Karşıtı Alan, Bulaşıcı Hastalık, Hayvan Çağırma, Ölü Yaratma, Parçacıklara Ayırma, Hayvana Hükmetme, Kişiye Hükmetme, Yoldaş Çağırma, Kuvvet Kafesi, Koruma Rünü, Kahramanlar Şöleni, Canavarı Tutma, Ruh Kabı, Toplu Telkin, Düzlemsel Bağlama, Biçim Değiştirme, Prizmatik Duvar, Yeniden Bedenlenme, Kar Sureti, Sembol, Işınlanma, Gerçek Biçim Değiştirme, Kusursuz Diriltme, Dilek, Zamanı Durdurma, Kuvvet Duvarı ve Büyülü Ağız.

Bu okuma hedef/sayı sınırlarını, kurtulma atışlarını, yoğunlaşmayı, hasarı, malzeme bedellerini, üst derece kullanımını ve özel tabloları kapsadı. Örneğin Işınlanma tablosu, Prizmatik Duvar'ın yedi katmanı, Sembol'ün sekiz seçeneği, Nesne Canlandırma'nın boyut tablosu ve Dilek'in zorlanma koşulları metinde korunur.

## Kaynak hataları ve 2014 düzeltmeleri

Temel veri bazı eski veya hatalı metinleri içerdiğinden aşağıdaki noktalar ham kayıttan körlemesine aktarılmadı:

| Büyü | Uygulanan düzeltme |
|---|---|
| Animal Friendship | Üst yuva derecesi başına bir ek hayvan açıklaması eklendi. |
| Conjure Animals | 5./7./9. yuvalarda yaratık sayısı 2/3/4 katı olarak tamamlandı. |
| Contagion | 2014 erratasındaki ilk zehirlenme ve üç başarısız kurtulmadan sonra hastalık sırası kullanıldı. |
| Disintegrate | Hasarın ardından hedef 0 canda kalıyorsa parçalanma uygulanır. |
| Dominate Beast | 5. yuvada 10 dakika, 6. yuvada 1 saat, 7. ve üzerinde 8 saat. |
| Heroism | Üst yuva derecesi başına bir ek hedef. |
| Hold Monster | Tekrar kurtulması hedefin kendi turunun sonunda. |
| Heroes' Feast | Şölenin katılımcı sınırı toplam 12 yaratık. |
| Magic Mouth | Tüketilen malzeme bedeli 10 altın; kaynakta bulunan ölçü yazım hatası taşınmadı. |
| Moonbeam | `1dl0` yerine `1d10`. |
| Polymorph | Şekil değiştirici ve 0 canı olan hedefleri etkilememe koşulu açıklaştırıldı. |
| Prismatic Wall | Mor katmanın Bilgelik kurtulması **büyüyü yapanın** sonraki turunun başında. |
| Simulacrum | Kopyanın yaratık türünün yapı olduğu belirtildi. |
| True Polymorph | Tam süre yoğunlaşınca dönüşümün büyü dağıtılana kadar sürmesi ve 0 canı olan hedefe işlememesi belirtildi. |
| True Resurrection | Yaşayan ölünün yaşayan ölü olmayan biçimine dönüşmesi belirtildi. |

True Polymorph'ın güncel süre/0 can koşulu ayrıca Open5e'nin `data/v1/wotc-srd/Spell.json` 2014 SRD kaydıyla karşılaştırıldı. Resmî SRD 5.1 PDF adresi bu ortamda 403 erişim hatası verdi; PDF'nin bu çalışmada açılıp doğrulandığı iddia edilmez. 2014 errata düzeltmeleri 2024 sınıf/büyü kurallarına geçiş anlamına gelmez.

## Terim tutarlılığı ve kalan sınır

Metin içindeki Büyü Dağıtma, Parçacıklara Ayırma, Kusursuz Diriltme, Üstün İyileştirme ve Günışığı göndermeleri katalogdaki adlarıyla aynı hâle getirildi; Eter Düzlemi yazımı birleştirildi. İngilizce büyü adları arama kolaylığı için ayrıca metadata alanında korunabilir.

Bu kayıt, 319 büyünün her cümlesine bağımsız ikinci uzman onayı verildiği anlamına gelmez. Otomatik kontroller 319 kaydı; ayrıntılı ikinci okuma yukarıdaki 30 büyüyü kapsar. Çağrılan yaratık oyun değerleri, DM kararları, geçerli hedefler ve karşılaşmaya bağlı uygulamalar masa yöneticisinin değerlendirmesini gerektirir. Karakter ekranının büyü seçimi/yuva takibi, büyünün bütün oyun etkilerini kendiliğinden çözmez.
