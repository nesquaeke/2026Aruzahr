# Açılış, kapanış, kamera ve müzik

Sitede **Yayın Masası → Yayın ekranları** ya da doğrudan `/#/broadcast/screens`.

- [Tam kurulum rehberi](../../web/public/downloads/Aruzahr-OBS-Kurulum-Rehberi.md)
- [Yayın başlıyor · MP4](../../web/public/downloads/Aruzahr-Yayin-Basliyor-1080p.mp4)
- [Yayın sona erdi · MP4](../../web/public/downloads/Aruzahr-Yayin-Sona-Erdi-1080p.mp4)
- [Tasarım master promptu](../tasarim/YAYIN_ACILIS_KAPANIS_MASTER_PROMPTU.md)
- [Dosya boyutu, kaynak çözünürlüğü ve döngü kaydı](../../web/public/downloads/Aruzahr-Yayin-Ekranlari.json)

İki bağımsız yağlıboya yorumdan oluşturulan sabit kameralı hareketli kompozitlerdir. Her MP4 sessiz, 20 saniye, H.264, 1920×1080, 30 FPS. Kar pencereyle sınırlı, ışık periyodiktir. Tarayıcı çıktısı azaltılmış hareket tercihini dinler. Başlangıç ve bitiş anı renderer'da birebir eşleşir; video son karesi bir kare önceki andır ve ilk kareye olağan kare aralığıyla döner.

Kaynak tablolar 1672×941; 1080p teslim ölçeklenmiştir. Doğal 4K veya üretken video olduğu iddia edilmez. Kendi yağlıboya/3D olmayan görsel dilinin yorumudur, coğrafi atlasın yerini almaz. Gerçek OBS/Windows masaüstü çalıştırılmadı; tarayıcı çıktıları ve video dosyaları otomatik/görsel olarak doğrulanır.

Geliştirici yeniden üretimi: FFmpeg ve Chromium kurulu ortamda `cd web && npm run broadcast:slates`. İki tablo `public/illustrations/broadcast-{starting,ending}.webp` yolunda bulunmalı. Kendi geçici Vite sunucusu 5188 portunda ve ayrı bağımlılık önbelleğinde çalışır. Render'ın normal build'i videoları yeniden üretmez; hazır dosyaları yayımlar.
