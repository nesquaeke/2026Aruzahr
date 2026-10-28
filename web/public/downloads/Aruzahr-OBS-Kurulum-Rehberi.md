# Aruzahr · Yayın hazırlığı

## Açılış ve kapanış

Sitede `/#/broadcast/screens` adresini aç. Yayın Masası üst çubuğundaki **Yayın ekranları** bağlantısı da buraya gider. İki MP4 indirilebilir. Dosyalar 20 saniye, 1920×1080, 30 FPS, H.264 ve sessizdir. Kaynak tablolar 1672×941 boyutundadır; 1080p çıktı için ölçeklenir. Yeni yağlıboya yorumların üzerinde periyodik kar/sis ve kandil ışığı kompoziti vardır; üretken video veya gerçek 3D çekim değildir.

OBS'de üç ayrı sahne oluştur:

1. **Açılış:** Medya Kaynağı → Yerel dosya → `Aruzahr-Yayin-Basliyor-1080p.mp4`. Döngü açık; kaynak etkinleşince oynatmayı baştan başlat açık. Görünmezken oynatmayı kapatma seçeneği varsa etkinleştir. Ekrana sığdır.
2. **Oyun:** Tarayıcı Kaynağı → `http://127.0.0.1:5173/#/broadcast/live`, 1920×1080. Yerel başlatıcı ve yönetim penceresi açık kalsın.
3. **Kapanış:** Medya Kaynağı → `Aruzahr-Yayin-Sona-Erdi-1080p.mp4`, aynı döngü ayarları.

Sahne geçişinde 500–700 ms **Fade / Solma** kullan. Hazır olduğunda Açılış'tan Oyun'a geç. Oturum sonunda Kapanış'a geç, izleyiciye vedanı et; sonra OBS'de **Yayını Durdur**. Kapanış sahnesi kendi başına yayını durdurmaz. Ara ekranı, mevcut oyun masasının **Ara ver** komutuyla kullanılabilir.

Dosya indirmeden alternatif: `/#/broadcast/starting` ve `/#/broadcast/ending` adreslerini ayrı OBS Tarayıcı kaynaklarına ekle. Barındırılmış sitedeki bu iki ekran röle istemez. 1920×1080 kaynak kullan; monitörün 4K olsa da tuval/çıkış 1080p kalabilir. MP4 yöntemi, yerel sunucunun açık olmasına ihtiyaç duymadığı için açılış/kapanışta daha az bağımlılığa sahiptir.

## Dört kamera ve isimlik

Kendi kameranı OBS **Video Yakalama Aygıtı** olarak ekle. Uzaktaki oyuncular için VDO.Ninja'da oda oluşturup davet gönder; her oyuncunun OBS izleme bağlantısını ayrı Tarayıcı Kaynağı olarak ekle. Kaynakları önce tek tek görüntü ve gecikme bakımından dene. VDO.Ninja izleme/yönetim bağlantılarını özel tut.

OBS'de **Oyuncu Kameraları** adlı yardımcı sahne oluştur. Dört kamerayı ve **Metin (GDI+)** isimlerini burada tut; sonra bu sahneyi Oyun sahnesine Sahne Kaynağı olarak ekle. Böylece kamera dizilimi her mekânda aynı kalır. İlk satır karakter adı; istersen ikinci satır küçük oyuncu adı. 1080p'de yaklaşık 350 px sol sütun, 320×180 kamera, 32–40 px isimlik ve eşit boşluk kullan. Kaynakları kilitle. Açılış/kapanışta bu yardımcı sahneyi eklemek zorunda değilsin.

Kamera aktarımı için 720p/30 FPS yeterlidir; bu kameranın çözünürlüğüdür, 1080p ana yayını değiştirmez. Sesleri Discord'dan alıyorsan kamera tarayıcı kaynaklarını sessize al; aynı kişiyi iki kanaldan duyurma. Kendi mikrofonunun da iki ayrı kaynaktan gelmediğini kontrol et.

## Spotify ve müzik

Spotify kişisel dinleme içindir; Premium abonelik bile müziği Kick yayınında veya kayıtta kullanma lisansı sağlamaz. OBS'ye ses almakla yayın hakkı ayrı konulardır. Şarkıyı başka kaynaktan çalmak da hakkı çözmez. Reklam engelleme veya telif denetimini aşma yöntemi kullanma.

Önerilen yöntem: **Kick canlı yayınına ve VOD/kayıtlara açık izin veren** bir müzik kütüphanesi veya kendi bestelerin. Kütüphanenin güncel lisansını kontrol et; gerekiyorsa kanalını tanımla, atıf ekle, izin/lisans belgesini sakla. “Royalty free” her kullanımın koşulsuz ücretsiz olduğu anlamına gelmez. Platforma özgü bir müzik izninin Kick'i kapsadığını varsayma.

Hak sahibi olduğun/izinli bir parçayı Spotify'dan veya başka bir uygulamadan denemek için Windows OBS'de:

1. **Kaynaklar → Uygulama Ses Yakalama** ekle; ilgili oynatıcıyı seç. Spotify görünmüyorsa çalarken pencereyi aç ve listeyi yenile. Özellik OBS/Windows sürümüne göre farklı adlandırılabilir.
2. Mikrofonu ve Discord'u ayrı kaynak olarak tut. Aynı sesi ayrıca alan Masaüstü Sesi kaynağını kapat; iki kez yakalanan müzik yankı yapar.
3. Müzik kaynağında **İzleme Kapalı** kullan; çift izleme döngüsü oluşturma. Sesi kullandığın kulaklık ve OBS kaydıyla kontrol et.
4. Konuşma zirvelerini yaklaşık -12 ile -6 dB arasında, konuşma altı müziği başlangıçta -30 ile -24 dB civarında dene. Bunlar garanti değil başlangıç noktalarıdır; bütün oyuncular konuşurken dinleyerek ayarla.
5. Otomatik kısılma istersen müzik kaynağına **Kompresör** filtresi ekleyip sidechain/ducking kaynağını mikrofona bağla. Tek mikrofon sidechain'i diğer oyunculara tepki vermez; bütün konuşmaları kapsamak için birleşik konuşma kaynağı veya elle ses kontrolü gerekir.

İzinli yerel müzik dosyası için Spotify yerine OBS Medya Kaynağı veya VLC Video Kaynağı da kullanılabilir. Parçaların geçişini ve döngüde ani ses sıçraması olmadığını dene. Açılış/kapanış MP4'lerinde müzik gömülü olmadığı için aynı ses kaynağını bağımsız kontrol edebilirsin.

## Yayından önce beş dakikalık kontrol

- Kulaklık kullan; mikrofon hoparlörden kendi sesini yeniden almasın.
- Her oyuncu bir cümle konuşsun. Discord ve kendi mikrofonu birer kez duyulsun.
- OBS'de kısa yerel kayıt al; kameraların, isimlerin, ses dengesinin ve sahne geçişlerinin çalıştığını izle.
- OBS Temel ve Çıkış 1920×1080; 30 FPS. NVENC H.264 varsa kullan; CBR 6000 kbps başlangıç, anahtar kare 2 saniye. Gelişmiş çıkışta ayrı 720p yeniden ölçekleme açık olmasın.
- Kamera ve mikrofon izinleri, rahatsız etme modu, bildirimler, masaüstünde kişisel bilgi ve yayın anahtarının görünmemesi kontrol edilsin.
- OBS'ye yönetim ekranını değil temiz `/broadcast/live` çıktısını ver. Görev sırlarını ve özel notlarını gösterme.
- Bir moderatör, sohbet kuralları ve mola/geri dönüş planı belirle. Sohbeti oyun mekânının üstüne yığmak zorunlu değil; küçük ekranda okunaklılığı koru.
- Kick başlığı/kategorisi ve bağlantı kontrolü; OBS düşen kare ve kodlayıcı yükünü izle. Bağlantı kararsızsa önce bitrate'i/iş yükünü azalt; çözünürlük değişimini yayın kapalıyken yap.
- Kameralar + mikrofonlar açıkken, müzik ve masa güvenli durumdayken yayına başla. Kapanış resmi göstermek OBS yayınını kendiliğinden kapatmaz.
