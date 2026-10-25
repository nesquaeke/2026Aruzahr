# Aruzahr hazır sesleri

Bu 12 WAV dosyası proje için `scripts/build-studio-audio.py` ile deterministik olarak sentezlendi. Haricî kayıt, örnek ses, lisanslı müzik veya konuşma içermez. Kullanıcı kendi Aruzahr yayınında bunları kullanabilir. Dosyalar gerçek alan kaydı veya orkestral müzik değildir.

22.050 Hz, 16 bit, mono PCM. On ortam/müzik dokusu 12 saniye; kapı vurma ve zar efektleri 1,5 saniyedir. Ortamların başı/sonu yumuşatılmıştır. Kanallar arası geçiş ve yayın sahipliği tarayıcıda yönetilir.

Yeniden üretmek için `web/` içinde `python3 scripts/build-studio-audio.py` çalıştır. Python standart kütüphanesi yeterlidir.
