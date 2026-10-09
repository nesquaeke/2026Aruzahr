# Görsel üretim ve kaynak kaydı

9 Ekim 2026. Kullanıcının istediği çizim dili: fotoğraf görünümü yerine yağlıboya ve guajı çağrıştıran, görünür fırça izli, yumuşak renkli ve okunaklı biçimli fantastik illüstrasyon. [Kalıcı rehber](GORSEL_VE_ANLATI_REHBERI.md) ve [üretim yönlendirmesi](URETIM_MASTER_PROMPTU.md) esas alındı.

## Arşiv

Manifestte **365 görsel** vardır. Bunların **197 tanesi** yeni boya dokulu illüstrasyon olarak işaretlenir; 52 yeni yakın plan yazarın özgün 8K haritasından alınmıştır. `origin` alanı yazar görseli, harita kesiti, uyarlama ve üretilen temsili çizimi ayırır. “Boya dokulu” bir stil tanımıdır; görsellerin bir insan ressam tarafından fiziksel olarak boyandığı iddia edilmez. Yeni illüstrasyonlar `image_gen` ile üretildi.

- 109 yeni kişi portresi: Danstsud kurumları ve şehirleri için 64; diğer ülkelerdeki ve yeni harita yerleşimlerindeki kadrolar için 45.
- Önceki 18 üretilmiş portre aynı kişilerin tarifleri korunarak boya dilinde yeniden çizildi. Eryndorn’un yeni kral portresi ve kütüphane sahnesi ayrıca eklendi.
- Valdareth’in beş surlu büyük panoraması, Danstsud’un 14 diğer ana şehir görüntüsü, 12 vergi yerleşiminin geçim sahnesi, sekiz ülkenin kapak seçkisi ve Karlan/Frostmere/Ak Cam/Rilorn manzaraları bağlandı.
- Mor Pelerin, Mavi Pelerin, Mor Donanma, Dorvenhall orvel korucuları, Elorwyn dinî kuvvetleri ve Marhalden Akçelik Nöbeti için altı ayrı birlik sahnesi eklendi.
- 12 yeni dünya türünün illüstrasyonu; mevcut sekiz Karlan canlısı ve üç Hardlane otlak türünün boya dilinde yeni sürümleri; ayrıca otlak habitatı eklendi.

## Çıktı işlemi

Portreler altılı, üç sütun ve iki satırlı üretim levhalarından ayrı WebP dosyaları olarak dışa aktarıldı. Manzara, birlik ve canlı levhaları iki sütun ve üç satırdan bölündü; ince panel ayırıcıları dışa aktarımda kesildi. Sharp yalnız dosya bölme, boyutlandırma ve WebP dönüştürme için kullanıldı. Yüz, ışık, boya veya anatomi programatik filtreyle yeniden çizilmedi.

Üretim sonuçları görsel olarak incelendi. Fotoğraf/3D hissi fazla olan ilk sahne ve canlı levhaları daha belirgin boya düzlemleriyle yeniden üretildi; kapaklar için uygun sürümler seçildi. Özgün kaynaklar, önceki sürümler ve kullanıcının `Karakterler/` dosyaları korunur. Yeni `-painted` kimlikleri birincil gösterimi değiştirir; arşiv geçmiş sürümleri de içerir.

## Uygulamada seçim

`portrait-manifest.ts` yeni portreleri ve eski kimlikten yeni portreye takma adları; `painted-art-manifest.ts` ve `painted-details-manifest.ts` şehir, ülke, canlı ve birlik tablolarını; `mapped-art-manifest.ts` harita yakın planlarını tutar. `media.ts` aynı seçimleri kişi kartı, şehir kadrosu, wiki kapağı ve büyütme galerisine uygular.

İşlemeli güç çerçevesi resme gömülmez. `character-card-profiles.ts` dövüş, büyü ve siyasi nüfuzu birlikte yorumlayan Olağan/Seçkin/Kudretli/Yüce sınıfları sağlar. Lysandra, Ashara ve Kaptan Roddic’in açıklanmamış rollerine veya güçlerine yeni kimlik atanmaz.
