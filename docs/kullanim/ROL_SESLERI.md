# Canlı rol sesleri · OBS ve Discord

En doğal farkı oyunculuk verir: konuşma hızı, cümle uzunluğu, duraklama ve vurguyu değiştir. Efekti hafif tut. Aynı karaktere her dönüşünde aynı alışkanlığı kullanmak, çok kalın veya çok ince bir sesten daha kolay takip edilir.

- Muhafız: kısa cümle, düz ritim, önemli sözcükte duraklama.
- Kâtip: biraz hızlı, ayrıntıyı düzeltme alışkanlığı; büyük bir karar öncesinde yavaşlama.
- Yaşlı: daha uzun duraklama, hafif nefes; her sözcüğü titretmek gerekmez.
- Jeremiah: kısa cümleler ve cümle sonunda hafif kesilme. Gerçek sesi zorlayarak sürekli boğaz hırıltısı yapma.

OBS tek başına perde/pitch değiştiren yerleşik bir ses değiştirici sunmaz. Canlı değiştirme için örneğin [Voicemod](https://www.voicemod.net/) kullanılabilir; ücretsiz sürümün ses/preset seçenekleri sınırlıdır. Özel editörün her özelliğinin ücretsiz olduğunu varsayma. Yapay zekâ dönüşümü gerekli değildir. Editör izin veriyorsa ±1–2 yarım ses gibi küçük bir değişimle başla; formantı doğal tut, yankıyı çok az kullan. Bir muhafızın günlük konuşmasına geniş salon yankısı eklemek anlaşılmayı zorlaştırır.

## Bağlantı

1. Voicemod girişinde gerçek mikrofonunu, çıkışında kulaklığını seç.
2. Discord giriş aygıtını **Voicemod Virtual Audio Device / Virtual Microphone** olarak seç; böylece arkadaşların da rol sesini duyar.
3. OBS mikrofon kaynağında aynı sanal mikrofonu seç. Aynı mikrofonun fiziksel kaynağını ayrıca açık tutma; çift ses çıkar.
4. Arkadaşların sesi için Discord'un uygulama ses kaynağını kullan. Aynı Discord sesini hem masaüstünden hem ayrı uygulama kaynağından yakalama.
5. Kulaklık kullan. Kendini dinleme/monitor sesinin yeniden OBS'ye girmediğini kontrol et.

Efekti tek tuşla açıp kapatacak bir kısayol ayarla. Normal anlatıcı sesine dönüşü kolaylaştırır. OBS'deki sahne değişimi tek başına Discord mikrofonunu değiştirmez; ses uygulamasındaki kısayolu kullan.

## OBS'de başlangıç temizliği

Örnek başlangıç ayarı: Kompresör oranı 3:1, eşik yaklaşık -18 dB; sınırlayıcı -1 dB. Bunlar mikrofonuna göre ayarlanır; pitch değiştirmez. Gürültü bastırma nefesleri veya kısık rol sesini kesiyorsa azalt ya da o ses için kapat. Büyük yankı ve güçlü efektleri üst üste koyma.

Önce 20 saniyelik yerel kayıt al: normal ses, rol sesi ve yüksek bir cümle söyle; kulaklıkla dinle. Harfler metalikleşiyorsa efekti azalt; iki ayrı ses duyuyorsan kaynağın iki kez yakalanıp yakalanmadığına bak. Bu rehber bağlantı önerisidir; kullanıcının OBS/Windows ayarları uzaktan değiştirilmiş veya test edilmiş değildir.
