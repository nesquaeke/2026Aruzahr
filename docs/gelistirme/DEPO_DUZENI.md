# Depo düzeni

26 Ekim 2026. Kullanıcının GitHub'daki dosyaları kolay bulması için kaynaklar, başlatıcılar, lore ve uygulama belgeleri ayrıldı.

| Önce | Şimdi |
|---|---|
| Kökteki PDF | `kaynaklar/evren/Valhunar.pdf` |
| Kökteki 8K harita | `kaynaklar/haritalar/Aruzahr 8k (1).jpg` |
| Ülke Word belgeleri | `kaynaklar/bolgeler/` |
| Bölüm ve görev Word belgeleri | `kaynaklar/maceralar/` |
| `Karakterler/` | `kaynaklar/karakterler/` |
| Kökteki `Ashara.png` | `kaynaklar/gorseller/Ashara.png` |
| Yanlış projeye ait ana hikâye belgesi | `kaynaklar/arsiv/broken-oath/` |
| Kökteki başlatıcılar | `baslat/` |
| `lore/` içindeki kullanım rehberleri | `docs/kullanim/` |
| Master promptlar ve görsel/anlatı rehberi | `docs/tasarim/` |
| Harita denetimi, görsel envanteri, doğrulamalar | `docs/gelistirme/` |
| Sürüm teslim raporları | `docs/arsiv/` |
| `lore/onizlemeler/` | `docs/gorseller/` |

Danstsud'un yazar dosyaları `lore/danstsud/` içinde kalır. Uygulamanın `web/src/`, `web/public/`, hazır macera indirmeleri, harita koordinatları ve tarayıcı kayıtları taşınmaz. `DM_NOTLARI.md` ana klasörde kısa yol olarak korunur.

Başlatıcıların çalışma klasörleri ve harita üretim betiğinin kaynak yolu yeni konuma göre güncellendi. Dosya bağlantıları yeni konumlarına göre yeniden hesaplandı. Özgün kaynakların dosya adları ve içerikleri korunur; değişiklik silme işlemi değildir. Eski GitHub dosya bağlantısındaki bir öğeyi arıyorsan yukarıdaki tabloyu veya [kaynak dizinini](../../kaynaklar/README.md) kullan. Dosyaların geçmiş sürümleri Git geçmişinde kalır.

[Güncel başlangıç sayfası](../../README.md) · [Başlatıcılar](../../baslat/README.md) · [Belgeler](../README.md).

## Doğrulama

- 145 dosya taşındı; 102 özgün kaynak dosyasının SHA-256 özeti taşıma öncesiyle birebir aynı.
- 212 göreli belge bağlantısı kontrol edildi; kırık bağlantı yok.
- Dört Bash başlatıcısı `/tmp` içinden, yalıtılmış `node`/`npm` komut taklitleriyle çalıştırıldı; hepsi doğru `web/` klasörüne ve beklenen atlas/yayın/LAN komutuna ulaştı. Bash sözdizimi kontrolü geçti.
- Üç Windows başlatıcısının tırnaklı göreli yolları ve CRLF satır sonları kontrol edildi. Windows masaüstünde çalıştırılmadı.
- Yeni 8K kaynak konumundan `npm run assets`, ardından `npm run build` başarılı.
- Atlas, hazır hikâyenin ilk açılışı ve ham kaynakların geliştirme sunucusunda engellenmesi: üç tarayıcı senaryosu geçti. Güncel uygulama verileri ve harita noktaları taşınmadı.
