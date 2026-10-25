# Özel DM paketini indirme

Sohbetteki bulut dosya yollarına erişilemiyorsa [şifreli paket dosyasını](../web/public/DM-Paketini-Ac.html) GitHub'da açıp sağ üstteki **Download raw file** düğmesiyle indir. İndirilen HTML dosyasını tarayıcıda aç ve yalnızca DM'ye sohbetten verilen şifreyi gir. **Şifreyi aç ve ZIP’i indir** düğmesi gerçek ZIP paketini indirir.

Alternatif: güncel depoyu indir, yerel siteyi başlat ve `http://localhost:5173/DM-Paketini-Ac.html` adresine git.

ZIP içindeki `On-Kis-Karari-DM.md` yeni on görevi okumak içindir. `On-Kis-Karari-DM.json`, **Yayın Masası → Görevler → DM paketi aç** ile içe aktarılır. Bu sürümde 30 sahne, görsel hazırlama, karar ve ilerleme takibi vardır. Önceki beşli `Marhalden-Hardlane-DM.json/md` de ZIP içinde ayrıca korunur. Paket şifresi değişmemiştir.

GitHub'daki HTML yalnızca AES-256-GCM ile şifrelenmiş paketi içerir. Anahtar PBKDF2-SHA256 ve rastgele tuz ile 600.000 turda türetilir. Şifre depoya eklenmez; şifre çözümü cihazda yapılır, ağ isteği gönderilmez. Bu dosya otomatik olarak oyuncu sahnesine veya görsel kütüphanesine eklenmez. Şifreyi oyuncularla paylaşma.

Doğrulama: yerel HTTP sunucusunda Chromium ile yanlış şifre reddi, doğru şifreyle ZIP indirme ve indirilen dosyanın özgün özel paketle bayt düzeyinde eşitliği kontrol edildi. Tarayıcı hatası oluşmadı. Bulutun yönetilen Chromium'u `file://` gezinmesini engellediği için çift tıklama akışı bu ortamda ayrıca doğrulanamadı; yerel sunucu seçeneği doğrulandı.
