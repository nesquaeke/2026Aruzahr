# Jeremiah · karakter kâğıdı

Sitede **Karakterler → Jeremiah** sayfasını aç (`/#/wiki/jeremiah`). Portresinin altında üç indirme bağlantısı bulunur:

- **Portreli A4 karakter kâğıdı:** oyun sırasında kullanılacak tek sayfalık PDF.
- **Karakter defteri:** aynı kâğıt ile tam hikâye, görünüş, sınıf notları, saldırı açıklamaları ve çantanın bütün içeriği.
- **Oyuncu Masası karakter dosyası:** `Jeremiah-Aruzahr.json`. **Oyuncu Masası → Karakter yedeği aç** ile seç. Portre dosyaya gömülüdür. Mevcut karakterlerin silinmez; bu dosya kendiliğinden bir bulut hesabına kaydedilmez.

Yazdırma: A4, %100 / gerçek boyut. HTML sürümünü açtıysan tarayıcının üst-alt bilgilerini kapat. `web/public/downloads/Jeremiah-Karakter-Kagidi-A4.html` fontları ve portresi gömülü, çevrimdışı yazdırılabilir tam defterdir. Önizleme aynı klasörde `Jeremiah-Karakter-Kagidi-Onizleme.webp`.

## Hazır oyun değerleri

Kullanıcının seçimi **D&D 5e 2014, Düzenbaz 1; ileride Arcane Trickster**. Alt sınıf 3. seviyede seçilir; 1. seviyede sınıf büyüleri veya büyü yuvası yoktur. Kurnaz Eylem 2. seviyede açılır. Son kullanıcı isteğiyle **Kan Yankısı** adlı hafif doğuştan büyü özelliği eklendi; bu, Aruzahr özel kuralıdır. Sesindeki yankı düğümü zorunlu susma veya otomatik mekanik ceza değildir.

## Kan Yankısı nasıl kullanılır?

İki seçenek **ortak 2 kullanım** paylaşır. Her başlatma 1 eylem ve 1 kullanım harcar. Menzil 9 metre; görülen, tam siper arkasında olmayan nokta seçilir. Kısık bir sözcük ve el hareketi gerekir. Aynı anda tek etki sürer; yeni etki öncekini bitirir. Uzun dinlenmede iki kullanım da geri gelir; kısa dinlenmede yenilenmez.

- **Soluk El:** 1 dakika süren solgun el, en fazla 1 kg ağırlığındaki sahipsiz eşyayı taşıyabilir veya hafif, kilitsiz bir kapıyı itebilir. İlk iş başlatma eyleminde yapılır; sonraki yönlendirmeler eylem ister, yeni kullanım harcamaz. El 9 metre menzilden çıkarsa kaybolur. Saldıramaz, kilit açamaz, hırsız aleti/büyülü eşya kullanamaz veya kişinin üzerindeki/tuttuğu eşyayı alamaz.
- **Sahte Fısıltı:** 1 tur / 6 saniyelik tıkırtı, ayak sürtünmesi veya ıslık üretir. Normal konuşmadan yüksek olamaz; en fazla 9 metre öteden duyulur, çevre gürültüsü sesi örtebilir. Söz, emir veya belirli kişinin sesi üretilemez. İncelemek için eylem harcayan yaratık **Zekâ (Araştırma) ZD 12** ile yanılsamayı anlar. Formül 8 + yetkinlik + Zekâ değiştiricisidir. Otomatik hareket, saldırı avantajı veya Gizli Saldırı sağlamaz.

Hasar vermez ve büyü yuvası kullanmaz. Bunlar sınırsız cantrip değildir. Oyuncu Masası'nın savaş/dinlenme bölümünde **Kan Yankısı → Nasıl kullanılır?** açıklamasını aç; iki seçenekten birini kullandığında **Kullan** düğmesine bir kez bas. **Geri koy**, yanlışlıkla harcanan kullanımı geri alır. Eşya hareketi ve yanılsamayı değerlendirme masa başında yapılır; site otomatik hedef/zorluk çözmez. Kullanım sayacı ve açıklama karakter JSON yedeğinde korunur.

Önceden içe alınmış karakterler otomatik değişmez. Güncel JSON'u açmak mevcut karakterinin üstüne yazmaz; ayrı kopya oluşturabilir. Mevcut karakterini sürdürmek istersen bu kuralları notlarına ve uzun dinlenmede yenilenen **2 kullanımlık Kan Yankısı** sayacına elle ekleyebilirsin. Çift kopyada ilerlemeyi iki kez yürütme.

Can 9, Zırh 14 (kuşanılmış deri zırh), İnisiyatif +3, Yetkinlik +2, hız 30 fit. Gizlilik +7 ve Aldatma +6, Uzmanlıkları içerir. Meç / kısa yay / hançer saldırıları +5. Yazılı hasarlar sırasıyla 1d8+3, 1d6+3 ve 1d4+3; Çeviklik +3 zaten dahildir. İki hafif hançerle bonus eylem saldırısının hasarı 1d4'tür; meç hafif değildir. Gizli Saldırı 1d6 yalnız koşulları sağlanırsa tur başına bir kez eklenir.

Nitelikler mevcut editoryal kayıttan korunmuştur: 9 / 16 / 12 / 15 / 11 / 15. Bunlar kullanıcıca verilmiş zar sonuçları değildir. İnsan soyu, altı beceri, iki Uzmanlık ve özel geçmişin dil/alet seçimleri düzenlenebilir başlangıç tercihleridir. `*` işareti özel geçmiş için taslak dil/alet seçimini belirtir; otomatik bir oyun cezası değildir. Başlangıç altını ve ek geçmiş donanımı eklenmemiştir. Atış/puan yöntemi, kalan geçmiş donanımı ve tercihler oyuncu ile DM tarafından kesinleştirilebilir.

## Yeniden üretim

Depo kökünde `node web/scripts/build-jeremiah-sheet.mjs` çalıştır. Node bağımlılıkları ve Chromium gerekir. Mevcut portre kullanılır; yeni bir görsel üretilmez. PDF için yalnız biçim dönüşümü yapılır. Teknik eşya kimlikleri JSON'da korunur; kâğıtta tekrar eden katalog etiketleri gösterilmez. Yazıtipi ve kural atıfları aynı indirme klasöründeki `Jeremiah-Yazitipi-Lisanslari.txt` dosyasındadır.
