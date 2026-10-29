"""Build the downloadable authored DM pack. Never includes a user's local saves."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json

public = Path(__file__).resolve().parent.parent / 'public'
images = json.loads((public.parent.parent / 'docs/gelistirme/29_EKIM_YAN_GOREV_GORSELLERI.json').read_text())['images']
files = [public / 'illustrations' / (item['id'] + '.webp') for item in images]
files += [public / p for p in [
    'illustrations/side-mine-map.svg', 'illustrations/side-mine-map.png',
    'dm/Kayip-Pay-Madeni-DM-Haritasi.svg', 'dm/Yan-Gorevler.json',
    'dm/Yan-Gorevler.md', 'dm/Yan-Gorevler-Oynatim-Kitabi.html',
    'dm/Harven-Orman-Yolu.html', 'dm/Harven-Orman-Yolu.md', 'dm/Harven-Orman-Yolu.pdf',
    'dm/Terk-Edilmis-Kamp.html', 'dm/Terk-Edilmis-Kamp.md', 'dm/Terk-Edilmis-Kamp.pdf',
]]
pdf = public / 'dm/Hardlane-Yan-Gorevler-Oynatim-Kitabi.pdf'
if pdf.exists():
    files.append(pdf)
target = public / 'dm/Hardlane-Yan-Gorevler-DM-Paketi.zip'
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    archive.writestr('ONCE-OKU.txt', '''ARUZAHR · HARDLANE YAN GOREVLER

Bu paketi tamamen bir klasore cikart.
dm/Yan-Gorevler-Oynatim-Kitabi.html dosyasini tarayicida ac.
Resimler ../illustrations klasorunden yuklenir. Klasorleri ayirma.
Yazdir / PDF dugmesiyle kagit ciktisi alinabilir.

DM haritasi ve hikaye cozumleri oyunculara gosterilmez.
Kagit rota haritasi ve oyuncu zindan plani ayri dosyalardir.
Sitede: Yayin Masasi > Yan Gorevler.
Bu ZIP bir oyuncu yedegi veya canli kampanya durumu degildir.
''')
    for path in files:
        if not path.is_file():
            raise FileNotFoundError(path)
        archive.write(path, path.relative_to(public))
with ZipFile(target) as archive:
    assert archive.testzip() is None
print(f'{target.name}: {len(files)} dosya + rehber, {target.stat().st_size} bayt')

# Small OBS-friendly delivery, without the other DM adventures.
camp_target = public / 'downloads/Kamp-Haydutlari.zip'
with ZipFile(camp_target, 'w', ZIP_DEFLATED) as archive:
    for file, label in [('camp-len.webp','Len.webp'),('camp-rusk.webp','Rusk.webp'),('camp-tova.webp','Tova-Kest.webp'),('camp-abandoned.webp','Terk-Edilmis-Kamp.webp')]:
        archive.write(public / 'illustrations' / file, label)
    archive.write(public / 'dm/Terk-Edilmis-Kamp.pdf', 'DM-Kamp.pdf')
    archive.writestr('ONCE-OKU.txt', 'ARUZAHR - SONMUS OCAK\n\nLen, Rusk ve Tova: yeni yasli/zirhli haydut portreleri. Kamp tablosu ve DM oynatim PDFsi dahildir.\nSitede Yayin Masasi > Yan Gorevler > Sonmus Ocak.\nLen/Rusk onceki orman pususundaki ayni kisilerdir; olu/yakalanmis kisileri tekrar oynatma.\nPortre adlarini OBSde ayri metin katmani olarak ekleyebilirsin; Enchanted Land fontu.\n')
with ZipFile(camp_target) as archive:
    assert archive.testzip() is None
print(f'{camp_target.name}: {camp_target.stat().st_size} bayt')
