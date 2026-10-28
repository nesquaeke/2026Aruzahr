import { abilityModifier } from './rules'
import type { ClassId, PlayerCharacter, PlayerResource, SkillId } from './types'

/** Original Turkish play summaries of the 2014 SRD 5.1, not a second rules engine.
 * Conditional effects and choices stay explicit; only an add button creates a counter. */
export type ReferenceResource = { id:string; name:string; max:number; reset:PlayerResource['reset'] }
export type ClassFeatureReference = {
  level:number; title:string; text:string; subclass?:string;
  resource?:(character:PlayerCharacter)=>ReferenceResource|null;
}
const feature = (level:number,title:string,text:string,subclass?:string,resource?:ClassFeatureReference['resource']):ClassFeatureReference => ({level,title,text,subclass,resource})
const counter = (id:string,name:string,max:number,reset:PlayerResource['reset']):ReferenceResource => ({id:`ref-${id}`,name,max,reset})
const asi = (levels:number[]) => levels.map(level=>feature(level,'Nitelik artışı','Bir niteliğe +2 veya iki ayrı niteliğe +1 ver; bu yolla normal sınır 20’dir. DM yetenek kuralına izin verirse bunun yerine bir yetenek seçebilirsin. Nihai değerleri Nitelikler bölümünde bir kez değiştir; bu rehber artışları kendiliğinden eklemez.'))
const extraAttack = (level:number,count=2) => feature(level,'Ek Saldırı',`Kendi turunda Saldırı eylemi yaptığında ${count} saldırı yaparsın. Bu, ek bir eylem veya her bonus eyleme ek saldırı vermez.`)
const fullCasting = (name:string,ability:string,how:string) => feature(1,`${name}: büyü kullanımı`,`${ability} büyü niteliğindir. Basit büyüler yuva harcamaz; diğer büyüler uygun derecede yuva ister. ${how} Yoğunlaşma, bileşen ve eylem süresini her büyünün kartında kontrol et; büyü seviyesi karakter seviyesiyle aynı değildir.`)
const cha = (c:PlayerCharacter) => abilityModifier(c.scores.cha)
export const classFeatureReferences:Record<ClassId,ClassFeatureReference[]> = {
  barbarian:[
    feature(1,'Öfke','Bonus eylemle başlar, en çok 1 dakika sürer. Ağır zırh giymiyorken Kuvvet kontrolleri/kurtarışlarında avantaj, kesme-delme-ezme hasarına direnç ve Kuvvet kullanan yakın silah saldırılarında +2 hasar verir (+3: seviye 9, +4: seviye 16). Büyü yapamaz veya yoğunlaşamazsın. 15. seviyeye kadar, son turundan beri bir düşmana saldırmadıysan ve hasar da almadıysan tur sonunda erken biter; bilincini yitirmek de bitirir.',undefined,c=>c.level>=20?null:counter('barbarian-rage','Öfke',c.level>=17?6:c.level>=12?5:c.level>=6?4:c.level>=3?3:2,'long')),
    feature(1,'Zırhsız Savunma','Zırh giymiyorken Zırh Sınıfı 10 + Çeviklik + Dayanıklılık değiştiricileridir; kalkan kullanılabilir. Defter uygun durumda bunu hesaplar.'),
    feature(2,'Gözü Kara Saldırı','Turundaki ilk saldırıda seç: bu tur Kuvvet kullanan yakın silah saldırılarında avantaj alırsın; bir sonraki turuna kadar sana karşı saldırılar da avantajlıdır.'),
    feature(2,'Tehlike Sezgisi','Görebildiğin tuzak ve büyü gibi etkilere karşı Çeviklik kurtarışlarında avantaj; kör, sağır veya aciz durumdayken işlemez.'),
    feature(3,'İlkel Yol','Bir yol seç. Yerleşik SRD yolu Berserker’dir; yol yetenekleri 3, 6, 10 ve 14. seviyelerde açılır.'),
    feature(3,'Çılgınlık','Öfkeye girerken çılgınlığı seçebilirsin. Sonraki turlarında bonus eylemle bir yakın silah saldırısı yaparsın. Öfke bitince 1 düzey tükenmişlik alırsın; otomatik uygulanmaz.','berserker'),
    ...asi([4,8,12,16,19]),extraAttack(5),
    feature(5,'Hızlı Hareket','Ağır zırh giymiyorken hızın +10 ft artar; defter zırh koşuluyla hesaplar.'),
    feature(6,'Akılsız Öfke','Öfke sürerken büyülenmiş veya korkmuş olamazsın; önceden üzerindeyse etki öfke boyunca bastırılır.','berserker'),
    feature(7,'Yabanî İçgüdü','İnisiyatif zarında avantaj. Sürprize uğradığında, aciz değilsen ve ilk iş öfkeye girersen ilk turunda yine hareket edebilirsin.'),
    ...[9,13,17].map((level,i)=>feature(level,'Acımasız Kritik',`Yakın dövüş saldırısının kritik hasarına ${i+1} ek silah hasar zarı ekle. Normal kritik zarlarının yerine geçmez; saldırı kaydında koşullu olarak uygula.`)),
    feature(10,'Yıldırıcı Varlık','Eylemle 30 ft içindeki bir hedefi Bilgelik kurtarışına zorla: ZD 8 + yetkinlik + Karizma. Korkuyu sonraki eylemlerinle sürdürebilirsin; başarılı hedef 24 saat bağışıktır.','berserker'),
    feature(11,'Direnen Öfke','Öfkeliyken 0 cana düşer ve anında ölmezsen ZD 10 Dayanıklılık kurtarışıyla 1 canda kalabilirsin. Her sonraki kullanımın ZD’si +5; kısa/uzun dinlenme ZD’yi 10’a döndürür.'),
    feature(14,'Misilleme','5 ft içindeki bir yaratık sana hasar verdiğinde tepkiyle ona bir yakın silah saldırısı yapabilirsin.','berserker'),
    feature(15,'Kalıcı Öfke','Öfken saldırı yapmadığın veya hasar almadığın için erken bitmez; bilincini kaybetmen veya kendin sonlandırman yine bitirir.'),
    feature(18,'Boyun Eğmez Güç','Kuvvet kontrolünün toplamı Kuvvet puanından düşükse puanını sonuç olarak kullanabilirsin; saldırı ve kurtarışlara uygulanmaz.'),
    feature(20,'İlkel Şampiyon','Kuvvet ve Dayanıklılık +4, bu iki niteliğin sınırı 24 olur. Puanları bir kez elle güncelle. Öfke kullanım sınırın kalkar; eski öfke sayacını kendin kaldırabilirsin.'),
  ],
  bard:[
    fullCasting('Ozan','Karizma','Sınırlı sayıda büyü bilirsin; günlük hazırlık yapmazsın. Bilinen ritüelleri 10 dakika ekleyerek yuvasız kullanabilirsin.'),
    feature(1,'Ozan Esini','Bonus eylemle 60 ft içinde seni duyabilen başka bir yaratığa esin zarı ver. 10 dakika içinde bir kontrol, saldırı veya kurtarışına ekleyebilir; zar atıldıktan sonra ama sonuç ilan edilmeden karar verir. Zar d6; 5’te d8, 10’da d10, 15’te d12. Aynı anda yalnız bir esin zarı taşır.',undefined,c=>counter('bard-inspiration','Ozan Esini',Math.max(1,cha(c)),c.level>=5?'short':'long')),
    feature(2,'Her İşten Biraz','Yetkinlik bonusun eklenmeyen nitelik kontrollerine bonusunun yarısı (aşağı yuvarla) eklenir. İnisiyatifi de etkiler; saldırı ve kurtarışları etkilemez. Defter beceri/İnisiyatife uygular.'),
    feature(2,'Dinlenme Ezgisi','Kısa dinlenmede seni duyan ve can zarı harcayan her dost, bir kez ek d6 can kazanır. Zar 9’da d8, 13’te d10, 17’de d12 olur; otomatik iyileştirmeye eklenmez.'),
    feature(3,'Uzmanlık ve Ozan Okulu','Yetkin olduğun iki beceride uzmanlık seç. 10. seviyede iki ek beceri seçersin. Bilgelik Okulu SRD’deki yerleşik seçenektir.'),
    feature(3,'Ek Yetkinlikler ve Keskin Sözler','Üç ek beceride yetkinlik seç. 60 ft içinde seni duyabilen, büyülenmeye bağışık olmayan bir yaratığın saldırı, nitelik kontrolü veya hasar zarından tepkiyle bir esin zarı çıkarabilirsin. Aynı Ozan Esini havuzundan harcanır.','lore'),
    ...asi([4,8,12,16,19]),
    feature(5,'Esin Pınarı','Esin zarı d8 olur ve bütün esin hakların artık kısa veya uzun dinlenmede geri gelir. Önceden eklenmiş sayaçların sıfırlanma türünü Kaynaklar’da elle güncelle.'),
    feature(6,'Karşı Ezgi','Eylemle sonraki turunun sonuna kadar sürdürdüğün performans, seni duyabilen 30 ft içindeki dostlara korku/büyülenmeye karşı kurtarış avantajı verir. Pasif bağışıklık sağlamaz.'),
    feature(6,'Ek Büyülü Sırlar','Herhangi bir sınıftan, kullanabildiğin derecede iki büyü/basit büyü seç. Bunlar normal bilinen büyü sınırına eklenir; seçimini not et.','lore'),
    feature(9,'Dinlenme Ezgisi d8','Dinlenme Ezgisi’nin ek iyileştirme zarı d8 olur.'),
    feature(10,'Esin d10 · Uzmanlık · Büyülü Sırlar','Esin d10 olur, iki ek beceride uzmanlık seçersin. Herhangi bir sınıftan iki büyü seç; bu ikisi toplam bilinen büyü sayısına dahildir. Basit büyü seçmek de bir Büyülü Sır harcar.'),
    feature(13,'Dinlenme Ezgisi d10','Dinlenme Ezgisi’nin ek iyileştirme zarı d10 olur.'),
    feature(14,'Büyülü Sırlar','Herhangi bir sınıftan iki büyü daha seç; normal toplam bilinen büyü sayısına dahildir.'),
    feature(14,'Eşsiz Yetenek','Kendi nitelik kontrolüne bir Ozan Esini harcayıp zarı ekleyebilirsin. Zar atıldıktan sonra, sonuç kesinleşmeden seç.','lore'),
    feature(15,'Ozan Esini d12','Esin zarın d12 olur.'),feature(17,'Dinlenme Ezgisi d12','Dinlenme Ezgisi’nin ek iyileştirme zarı d12 olur.'),
    feature(18,'Büyülü Sırlar','Herhangi bir sınıftan iki büyü daha seç; bunlar da normal toplam bilinen büyü sayısına dahildir.'),
    feature(20,'Üstün Esin','İnisiyatif atarken hiç esin hakkın kalmadıysa bir kullanım geri kazanırsın. Otomatik değil, koşul gerçekleşince sayacı bir azalt.'),
  ],
  cleric:[
    fullCasting('Rahip','Bilgelik','Her uzun dinlenmeden sonra seviye + Bilgelik değiştiricisi kadar büyü hazırla (en az 1). Hazır ritüeller yuvasız kullanılabilir; alan büyüleri daima hazırdır ve hazırlık sınırına girmez.'),
    feature(1,'İlahi Alan','Bir alan seç; SRD seçeneği Yaşam’dır. Alan yetenekleri 1, 2, 6, 8 ve 17. seviyelerde; alan büyüleri 1, 3, 5, 7 ve 9. seviyelerde gelir.'),
    feature(1,'Yaşam: Ağır Zırh ve Şifa Çırağı','Ağır zırh yetkinliği kazanırsın. 1. derece veya üstü bir büyüyle can iyileştirirken 2 + büyünün derecesi kadar ek can iyileştir. Basit büyülerde ve büyü olmayan yeteneklerde işlemez. Alan büyüleri Büyüler listesinde daima hazırdır.','life'),
    feature(2,'İlahi Gücü Kanalize Et','Kanal seçenekleri aynı havuzu paylaşır. Eylemle kutsal simgeni sunarak 30 ft içindeki seni gören/duyan ölümsüzleri Bilgelik kurtarışına zorlarsın; başarısız hedef 1 dakika veya hasar alana kadar kaçar. Kullanım 2’de 1, 6’da 2, 18’de 3; kısa/uzun dinlenmede geri gelir.',undefined,c=>counter('cleric-channel','İlahi Gücü Kanalize Et',c.level>=18?3:c.level>=6?2:1,'short')),
    feature(2,'Yaşamı Koru','Eylemle kanal hakkı harca: 30 ft içindeki yaratıklara toplam 5 × rahip seviyesi can dağıt. Bir hedefi azami canının yarısından yukarı çıkaramaz; ölümsüzleri/yapıları iyileştirmez.','life'),
    ...asi([4,8,12,16,19]),
    ...[[5,'1/2'],[8,'1'],[11,'2'],[14,'3'],[17,'4']].map(([level,cr])=>feature(Number(level),'Ölümsüzleri Yok Et',`Ölümsüz Kovma kurtarışında başarısız olan ve zorluk derecesi ${cr} veya daha düşük bir ölümsüz yok edilir.`)),
    feature(6,'Kutsanmış Şifacı','1. derece veya üstü bir büyüyle başka bir yaratığı iyileştirirken kendin 2 + büyünün derecesi kadar can kazanırsın.','life'),
    feature(8,'İlahi Darbe','Her kendi turunda bir silah isabetine ek 1d8 ışınım hasarı ver; 14. seviyede 2d8 olur. Her saldırıya eklenmez.','life'),
    feature(10,'İlahi Müdahale','Eylemle yardım dile ve d100 at: sonuç rahip seviyene eşit/altındaysa DM yardımı belirler. Başarısız deneme uzun dinlenmeden sonra tekrarlanabilir; başarıdan sonra 7 gün beklenir. Sayaç bu takvim koşulu için elle sıfırlanır.',undefined,()=>counter('cleric-intervention','İlahi Müdahale (başarı: 7 gün bekle)',1,'manual')),
    feature(14,'İlahi Darbe 2d8','Yaşam Alanı’nın tur başına tek silah darbesine verdiği ek ışınım hasarı 2d8 olur.','life'),
    feature(17,'Yüce Şifa','İyileştirme büyülerinde atacağın can zarlarını en yüksek yüzü gelmiş say. Diğer iyileştirme özelliklerini ve sabit bonusları ayrıca uygula.','life'),
    feature(18,'Kanalize Et: üç kullanım','Kısa/uzun dinlenme başına üç kullanımın olur; önceki sayacı Kaynaklar’da elle güncelle.'),
    feature(20,'Kesin İlahi Müdahale','İlahi Müdahale isteği zar gerektirmeden başarılıdır. Sonraki kullanım için 7 günlük bekleme sürer; yardımın biçimini DM belirler.'),
  ],
  druid:[
    fullCasting('Druid','Bilgelik','Uzun dinlenmeden sonra seviye + Bilgelik değiştiricisi kadar büyü hazırla (en az 1). Hazır ritüelleri yuvasız kullanabilirsin.'),
    feature(1,'Druid Dili ve Donanım Geleneği','Druid dilini bilirsin; gizli mesaj bırakabilir ve druid mesajını otomatik fark edebilirsin. Metal zırh/kalkan kullanmama geleneğini donanım seçerken gözet. Druid dilini Dil alanına kendin yaz.'),
    feature(2,'Yabanî Biçim','Eylemle daha önce gördüğün bir hayvana dönüş; süre yarım druid seviyesi kadar saat (aşağı yuvarla). İki kullanım, kısa/uzun dinlenmede geri gelir. Başlangıçta ZD 1/4 ve yüzme/uçma hızı yok; 4’te ZD 1/2 ve yüzme, 8’de ZD 1 ve uçma açılır. Hayvan istatistikleri/ayrı canı ve taşan hasar masada izlenir; 18’e kadar bu biçimde büyü yapamazsın, fakat önceden başlamış yoğunlaşman sürebilir.',undefined,c=>c.level>=20?null:counter('druid-wild-shape','Yabanî Biçim',2,'short')),
    feature(2,'Druid Çemberi','Bir çember seç. Yerleşik Toprak Çemberi, ek basit büyü ve araziye bağlı daima hazır büyüler sağlar.'),
    feature(2,'Doğal Toparlanma ve Ek Basit Büyü','Bir ek druid basit büyüsü seç. Günde bir kısa dinlenmede, toplam derecesi en çok yarım druid seviyesi (yukarı yuvarla) olan yuvaları geri al; 6. derece ve üstü yuvalar olmaz. Hangi yuvaların döneceğini elle seç.','land',()=>counter('druid-natural-recovery','Doğal Toparlanma (günde bir)',1,'long')),
    ...[3,5,7,9].map(level=>feature(level,'Toprak Çemberi büyüleri','Kutup, kıyı, çöl, orman, çayır, dağ, bataklık veya karanlıkaltı arazini seç. Arazi tablosundaki bu seviyenin iki büyüsü daima hazırdır ve hazırlık sınırına girmez. Bu sürüm arazi seçimini otomatik uygulamaz; isimlerini not et.','land')),
    ...asi([4,8,12,16,19]),
    feature(4,'Yabanî Biçim: yüzme','En çok ZD 1/2 hayvan; yüzme hızı olabilir, uçma hızı olamaz.'),
    feature(6,'Toprağın Adımı','Büyüsüz zorlu arazi ek hareket harcatmaz; büyüsüz bitkiler seni yavaşlatmaz veya dikenle yaralamaz. Hareketini engellemek için yaratılmış/yönlendirilmiş büyülü bitkilere karşı kurtarışta avantaj.','land'),
    feature(8,'Yabanî Biçim: uçma','En çok ZD 1 hayvan; artık uçma hızı da olabilir. Gördüğün hayvan koşulu sürer.'),
    feature(10,'Doğanın Koruması','Elementaller ve periler seni büyüleyemez veya korkutamaz; zehir ve hastalığa bağışıksın.','land'),
    feature(14,'Doğanın Sığınağı','Hayvan veya bitki yaratık sana saldırmadan önce büyü ZD’ne karşı Bilgelik kurtarışı yapar; başarısızsa başka hedef seçer/yapamaz. Başarılı yaratık 24 saat bağışıktır. Saldırıdan önce DM’ye hatırlat.','land'),
    feature(18,'Zamansız Beden ve Hayvan Büyüleri','Her 10 yılda bedenin 1 yıl yaşlanır. Yabanî Biçimde druid büyülerinin sözlü/bedensel bileşenlerini yerine getirebilirsin; maddi bileşenler hâlâ sorun olabilir.'),
    feature(20,'Başdruid','Yabanî Biçim sınırsızdır. Druid büyülerinin sözlü/bedensel ve bedelsiz, tüketilmeyen maddi bileşenlerini göz ardı edebilirsin; pahalı/tüketilen bileşenler yine gerekir.'),
  ],
  fighter:[
    feature(1,'Dövüş Tarzı','Bir tarz seç: Okçuluk (menzilli silah saldırısı +2), Savunma (zırhla ZS +1), Düello (tek elde yakın silah; diğer elde silah yokken hasar +2), Büyük Silah Dövüşü (uygun iki elli silahın 1–2 hasar zarını bir kez yeniden at), Koruma (kalkanla tepki; yanındaki dosta saldırıya dezavantaj), İki Silahla Dövüş (ikinci saldırının hasarına nitelik ekle). Sayısal/koşullu etkileri donanım ve saldırı alanlarına elle işle.'),
    feature(1,'İkinci Nefes','Bonus eylemle 1d10 + savaşçı seviyesi can geri kazan. Kısa/uzun dinlenme başına bir kullanım; sayacı harcamak can zarını otomatik atmaz.',undefined,()=>counter('fighter-second-wind','İkinci Nefes',1,'short')),
    feature(2,'Eylem Patlaması','Kendi turunda olağan eylemine ek bir eylem alırsın; ek bonus eylem vermez. 17. seviyeden sonra iki kullanım, ama aynı turda yalnız bir kez.',undefined,c=>counter('fighter-action-surge','Eylem Patlaması',c.level>=17?2:1,'short')),
    feature(3,'Savaşçı Yolu','Şampiyon veya kayıtlı Büyülü Şövalye yolunu seç. Yol yetenekleri 3, 7, 10, 15 ve 18. seviyelerde gelir.'),
    feature(3,'Gelişmiş Kritik','Silah saldırıların doğal 19 veya 20’de kritik olur; toplam saldırı sonucu 19 olması yeterli değildir.','champion'),
    ...asi([4,6,8,12,14,16,19]),extraAttack(5),extraAttack(11,3),extraAttack(20,4),
    feature(7,'Olağanüstü Atlet','Yetkinlik bonusu eklenmeyen Kuvvet, Çeviklik ve Dayanıklılık kontrollerine bonusun yarısını yukarı yuvarlayıp ekle. Defter beceri/İnisiyatifi hesaplar; uzun atlayışa Kuvvet değiştiricisi kadar ft eklenir.','champion'),
    feature(9,'Boyun Eğmez','Başarısız bir kurtarışı yeniden at; yeni sonucu kullanmak zorundasın. Kullanım 9’da 1, 13’te 2, 17’de 3; uzun dinlenmede yenilenir.',undefined,c=>counter('fighter-indomitable','Boyun Eğmez',c.level>=17?3:c.level>=13?2:1,'long')),
    feature(10,'Ek Dövüş Tarzı','Bir ikinci dövüş tarzı seç; aynı tarzı iki kez seçemezsin. Koşullu etkileri elle kaydet.','champion'),
    feature(13,'Boyun Eğmez: iki kullanım','Uzun dinlenme başına iki yeniden atış; önceki sayacın azamisini elle güncelle.'),
    feature(15,'Üstün Kritik','Silah saldırıların doğal 18–20 aralığında kritik olur.','champion'),
    feature(17,'Eylem Patlaması ve Boyun Eğmez artışı','Eylem Patlaması kısa/uzun dinlenme başına 2, Boyun Eğmez uzun dinlenme başına 3 kullanım olur. Eski sayaçları elle güncelle; yeni ekleme mevcut kaydı değiştirmez.'),
    feature(18,'Hayatta Kalan','Her turunun başında canın azaminin yarısı veya altındaysa 5 + Dayanıklılık değiştiricisi kadar can kazan. 0 canda çalışmaz.','champion'),
    feature(3,'Büyülü Şövalye: büyü ve silah bağı','Zekâ ile Büyücü listesinden sınırlı büyü öğrenirsin; çoğu Koruma/Çağrışım olmalıdır, serbest seçim seviyelerini Büyüler’deki uyarıdan izle. Bir dinlenmede silah bağı kurar, bağlı silahını bonus eylemle çağırırsın. Okul kotaları ve bağlanan silahlar elle takip edilir.','eldritch-knight'),
    feature(7,'Savaş Büyüsü','Eylemle basit büyü yaptığında bonus eylemle bir silah saldırısı yapabilirsin.','eldritch-knight'),
    feature(10,'Büyülü Darbe','Silahınla vurduğun hedef, sonraki turunun sonuna kadar yaptığın bir büyüye karşı ilk kurtarışında dezavantaj alır.','eldritch-knight'),
    feature(15,'Gizemli Hücum','Eylem Patlaması kullanınca saldırılardan önce veya sonra 30 ft’ye kadar boş bir konuma ışınlanabilirsin.','eldritch-knight'),
    feature(18,'Gelişmiş Savaş Büyüsü','Eylemle herhangi bir büyü yaptığında bonus eylemle bir silah saldırısı yapabilirsin.','eldritch-knight'),
  ],
  monk:[
    feature(1,'Zırhsız Savunma ve Dövüş Sanatları','Zırh/kalkan yokken ZS 10 + Çeviklik + Bilgelik. Yalnız keşiş silahlarıyla veya silahsızken saldırı/hasarda Çeviklik seçebilirsin; Saldırı eyleminde böyle saldırdıktan sonra bonus eylemle silahsız vurabilirsin. Dövüş zarı 1–4’te d4, 5–10’da d6, 11–16’da d8, 17–20’de d10. Keşiş silahı: kısa kılıç ve ağır/iki elli özelliği olmayan basit yakın silahlar.'),
    feature(2,'Ki','Ki puanın keşiş seviyene eşittir. Kısa/uzun dinlenmede en az 30 dakika meditasyonla geri gelir. Ki ZD: 8 + yetkinlik + Bilgelik. 1 Ki: Saldırı eyleminden sonra bonus eylemle iki silahsız saldırı; veya bonus eylemle Savun; veya bonus eylemle Atıl/Uzaklaş ve sıçrama mesafeni ikiye katla.',undefined,c=>counter('monk-ki','Ki',c.level,'short')),
    feature(2,'Zırhsız Hareket','Zırh/kalkan yokken +10 ft hız; 6/10/14/18’de sırasıyla +15/+20/+25/+30 ft. Defter bunu hesaplar.'),
    feature(3,'Mermi Saptırma','Menzilli silah isabetinde tepkiyle hasarı 1d10 + Çeviklik + keşiş seviyesi azalt. Hasarı 0’a indirir, bir elin boş olur ve mermi uygunsa yakalarsın; 1 Ki ile aynı tepkinin içinde geri fırlatabilirsin.'),
    feature(3,'Açık El Tekniği','Darbe Yağmuru saldırın vurursa hedefi Çeviklik kurtarışıyla yere düşür, Kuvvet kurtarışıyla 15 ft it veya kurtarışsız sonraki turunun sonuna kadar tepkisini kaldır.','open-hand'),
    ...asi([4,8,12,16,19]),
    feature(4,'Yavaş Düşüş','Düşerken tepkiyle düşme hasarını 5 × keşiş seviyesi kadar azalt.'),extraAttack(5),
    feature(5,'Sersemleten Darbe','Yakın silah saldırısı isabetinde 1 Ki harca. Hedef Dayanıklılık kurtarışında başarısızsa sonraki turunun sonuna kadar sersemler.'),
    feature(6,'Ki ile Güçlenen Vuruşlar','Silahsız saldırıların, büyüsüz saldırılara direnç/bağışıklık aşmada büyülü sayılır.'),
    feature(6,'Bedenin Bütünlüğü','Eylemle 3 × keşiş seviyesi can iyileştir; uzun dinlenme başına bir kez.','open-hand',()=>counter('monk-wholeness','Bedenin Bütünlüğü',1,'long')),
    feature(7,'Sıyrılma ve Zihin Dinginliği','Çeviklik kurtarışıyla yarım hasar veren etkide başarı hasarı 0 yapar, başarısızlık yarıya indirir. Ayrıca eylemle kendindeki bir büyülenme/korku etkisini bitirebilirsin.'),
    feature(9,'Duvar ve Su Üzerinde Hareket','Kendi turun sırasında dik yüzeylerde/sıvı üstünde hareket edebilirsin; bu yetenek turunu su üstünde veya duvarda güvenle bitirmez.'),
    feature(10,'Arınmış Beden','Zehir ve hastalığa bağışıklık kazanırsın.'),
    feature(11,'Sükûnet','Uzun dinlenmeden sonra Sığınak büyüsüne benzer koruma kazanırsın; ZD 8 + yetkinlik + Bilgelik. Sonraki uzun dinlenmeye kadar sürer, fakat saldırı/büyüyle zarar verme gibi Sığınak’ın bitiş koşulları geçerlidir.','open-hand'),
    feature(13,'Güneşin ve Ayın Dili','Konuşulan bütün dilleri anlarsın; dil anlayabilen her yaratık söylediklerini anlar.'),
    feature(14,'Elmas Ruh','Bütün kurtarışlarda yetkinlik; defter altı nitelik kurtarışını hesaplar. Başarısız bir kurtarışı 1 Ki harcayıp yeniden atabilir, yeni sonucu kullanırsın. Ölüm kurtarışları da yetkinlikten yararlanır; masada ayrıca ekle.'),
    feature(15,'Zamansız Beden','Yaşlılık bedenini zayıflatmaz ve büyüyle yaşlandırılamazsın; doğal ömrün yine biter. Yiyecek/suya gereksinim kalmaz.'),
    feature(17,'Titreyen Avuç','Silahsız isabetten sonra 3 Ki harcayıp bedende titreşim bırak. En çok keşiş seviyen kadar gün içinde aynı düzlemdeyken eylemle tetikle: Dayanıklılık kurtarışı başarısızsa 0 can, başarılıysa 10d10 nekrotik. Aynı anda tek hedef; masada takip et.','open-hand'),
    feature(18,'Boş Beden','Eylem ve 4 Ki ile 1 dakika görünmezlik; kuvvet hasarı dışında bütün hasarlara direnç. 8 Ki ile yalnız kendini etkileyen Astral Yolculuk’u bileşensiz yapabilirsin.'),
    feature(20,'Kusursuz Benlik','İnisiyatif atarken hiç Ki kalmadıysa 4 Ki geri kazanırsın. Koşul gerçekleşince kullanılan miktarı elle azalt.'),
  ],
  paladin:[
    feature(1,'İlahi Sezgi','Eylemle bir sonraki turunun sonuna dek 60 ft içinde tam siper arkasında olmayan göksel, iblis ve ölümsüzlerin konum/türünü algılarsın; kimliklerini değil. Kutsanmış/kirletilmiş alanı da sezersin.',undefined,c=>counter('paladin-divine-sense','İlahi Sezgi',Math.max(0,1+cha(c)),'long')),
    feature(1,'Şifalı Eller','Uzun dinlenmede yenilenen 5 × paladin seviyesi can havuzu. Eylemle dokunup istediğin miktarda can aktar; 5 puanla bir hastalığı veya zehri bitirebilirsin. Ölümsüz ve yapılar etkilenmez. Sayaçtaki 1 kullanım 1 havuz puanıdır.',undefined,c=>counter('paladin-lay-on-hands','Şifalı Eller: can havuzu',5*c.level,'long')),
    feature(2,'Dövüş Tarzı · Büyü Kullanımı · İlahi Darbe','Savunma, Düello, Büyük Silah Dövüşü veya Koruma tarzı seç. Karizma ile yarım seviye + Karizma kadar büyü hazırla (en az 1). Yakın silah isabetinden sonra yuva harcayıp ek ışınım hasarı: 1. derece 2d8, her üst derece +1d8, en çok 5d8; iblis/ölümsüze +1d8 (en çok 6d8). Darbe büyü yapmak değildir; yuva harcamasını ayrıca kaydet.'),
    feature(3,'İlahi Sağlık ve Kutsal Yemin','Hastalığa bağışıklık. Yeminini seç; SRD seçeneği Adanmışlık’tır. Yemin büyüleri daima hazırdır ve normal hazırlık sınırına girmez.'),
    feature(3,'Adanmışlık: İlahi Gücü Kanalize Et','Eylemle Kutsal Silah (1 dakika; tek silahın saldırılarına en az +1 Karizma, büyülü sayılır/ışık yayar) veya Kötücülü Kov (30 ft içinde seni gören/duyan iblis ve ölümsüzleri Bilgelik kurtarışıyla kov) seç. İki seçenek aynı kullanım havuzunu paylaşır.','devotion',()=>counter('paladin-channel','Yemin: İlahi Gücü Kanalize Et',1,'short')),
    ...asi([4,8,12,16,19]),extraAttack(5),
    feature(6,'Koruyucu Aura','Bilinçliyken sen ve 10 ft içindeki dostlar bütün kurtarışlara Karizma değiştiricini ekler (en az +1). Koşullu olduğu için defterin taban kurtarış sayısına eklenmez; kendi kurtarışında da uygula.'),
    feature(7,'Adanmışlık Aurası','Bilinçliyken sen ve 10 ft içindeki dostlar büyülenemez.','devotion'),
    feature(10,'Cesaret Aurası','Bilinçliyken sen ve 10 ft içindeki dostlar korkutulamaz.'),
    feature(11,'Gelişmiş İlahi Darbe','Her yakın silah isabetine ek 1d8 ışınım hasarı; normal İlahi Darbe ile birlikte kullanılabilir.'),
    feature(14,'Arındırıcı Dokunuş','Eylemle kendindeki veya istekli dokunduğun yaratık üzerindeki bir büyüyü bitir. Kullanım Karizma değiştiricin (en az 1); uzun dinlenmede yenilenir.',undefined,c=>counter('paladin-cleansing','Arındırıcı Dokunuş',Math.max(1,cha(c)),'long')),
    feature(15,'Ruhun Saflığı','Kötülük ve İyilikten Korunma’nın etkileri sürekli üzerindedir; etkilediği yaratık türleri ve korumaları büyü kartından kontrol et.','devotion'),
    feature(18,'Aura Genişlemesi','Koruyucu Aura, Cesaret Aurası ve Adanmışlık Aurası menzili 30 ft olur.'),
    feature(20,'Yeminin Doruk Yeteneği','20. seviye yeteneğini seçtiğin kutsal yemin belirler. Adanmışlık Yemini’nde Kutsal Hale açılır; alt sınıfın seçili değilse önce Kimlik bölümünden yeminini seç.'),
    feature(20,'Kutsal Hale','Eylemle 1 dakika hale: yakınındaki düşmanlara turlarının başında ışınım hasarı ve iblis/ölümsüzlerin büyülerine karşı kurtarış avantajı. 30 ft içindeki düşman her tur başında 10 ışınım alır; uzun dinlenme başına bir kez.','devotion',()=>counter('paladin-holy-nimbus','Kutsal Hale',1,'long')),
  ],
  ranger:[
    feature(1,'Seçilmiş Düşman','Bir tür seç: sapkın, hayvan, göksel, yapı, ejderha, elemental, peri, iblis, dev, yaratığımsı, sümüksü, bitki veya ölümsüz; bunun yerine iki insansı halk seçebilirsin. İz sürme Hayatta Kalma ve bilgi Zekâ kontrollerinde avantaj; konuşuyorlarsa bir dillerini öğrenirsin. Otomatik saldırı/hasar bonusu vermez.'),
    feature(1,'Doğal Kâşif','Kutup, kıyı, çöl, orman, çayır, dağ, bataklık veya karanlıkaltından bir tercih edilen arazi seç. Orada yetkin olduğun ilgili Zekâ/Bilgelik kontrollerinde çift yetkinlik; en az bir saatlik yolculukta yön bulma, iz sürme, yiyecek arama ve grup hareketine üstünlükler. Koşullu bonusları elle uygula.'),
    feature(2,'Dövüş Tarzı ve Büyü Kullanımı','Okçuluk, Savunma, Düello veya İki Silahla Dövüş seç. Bilgelik ile sınırlı sayıda kolcu büyüsü bilirsin; günlük hazırlık yoktur. Seviye aldığında bir bilinen büyüyü uygun derecede başka kolcu büyüsüyle değiştirebilirsin.'),
    feature(3,'İlkel Farkındalık','Eylemle bir yuva harca; yuva derecesi kadar dakika boyunca 1 mil (tercih edilen arazide 6 mil) içindeki belirli doğaüstü türlerin varlığını sez. Yerlerini/sayılarını söylemez; yuva harcamasını Büyüler’de kaydet.'),
    feature(3,'Avcının Avı','Birini seç: Dev Avcısı (5 ft içindeki görebildiğin Büyük veya daha iri yaratık sana saldırıp vurur/ıskalarsa tepkiyle ona vur), Sürü Kıran (turda bir, ilk hedefe 5 ft içinde menzilindeki başka hedefe aynı silahla ek saldırı), Dev Deviren (azami canının altında bir hedefe turda bir +1d8). Seçimini not et.','hunter'),
    ...asi([4,8,12,16,19]),extraAttack(5),
    feature(6,'İkinci Düşman ve Arazi','Bir ek düşman tercihi, onun uygun dili ve bir ek tercih edilen arazi seç.'),
    feature(7,'Savunma Taktikleri','Birini seç: Fırsat saldırıları sana dezavantajlı; aynı yaratığın bir turdaki sonraki saldırılarına karşı ilkinden sonra +4 ZS; veya korkuya karşı kurtarış avantajı. Koşullu etkileri not et.','hunter'),
    feature(8,'Toprağın Adımı','Büyüsüz zorlu arazi ek hareket harcatmaz; büyüsüz bitkiler seni yavaşlatmaz/yaralamaz. Hareket engelleyen büyülü bitkilere karşı kurtarış avantajı.'),
    feature(10,'Üçüncü Arazi ve Açıkta Gizlenme','Bir ek arazi seç. Doğal kamuflaj için 1 dakika harca; uygun yüzeye yaslanıp hareket/eylem yapmadan Gizlenme’ye +10 alırsın. Hareket, eylem veya tepkide yeniden kamuflaj gerekir.'),
    feature(11,'Çoklu Saldırı','Birini seç: Yaylım (eylemle seçtiğin noktanın 10 ft içindeki gördüğün her hedefe bir menzilli saldırı, ayrı zar/cephane) veya Kasırga (eylemle 5 ft içindeki her yaratığa ayrı yakın saldırı). Ek Saldırı eylemiyle üst üste yığılmaz.','hunter'),
    feature(14,'Üçüncü Düşman ve Gözden Kaybolma','Bir ek düşman tercihi ve uygun dili seç. Gizlen’i bonus eylemle yaparsın; büyülü olmayan yöntemlerle izlenemezsin, istersen iz bırakabilirsin.'),
    feature(15,'Üstün Avcı Savunması','Sıyrılma, bir yakın saldırı ıskalayınca saldırıyı başka hedefe yöneltme tepkisi veya görünür saldırganın isabet hasarını tepkiyle yarılama seçeneklerinden birini seç. Ayrıntı/koşulları not et.','hunter'),
    feature(18,'Yabanî Duyular','Görmediğin hedefe saldırmak tek başına dezavantaj vermez. 30 ft içindeki görünmez yaratık gizlenmemişse ve sen kör/sağır değilsen konumunu sezersin.'),
    feature(20,'Düşman Avcısı','Her kendi turunda bir kez seçilmiş düşmanına yaptığın saldırının saldırı veya hasar zarına Bilgelik değiştiricini ekleyebilirsin. Zarın ardından ama sonucu kesinleşmeden seç.'),
  ],
  rogue:[
    feature(1,'Uzmanlık','İki yetkin beceriyi veya bir beceri ve hırsız aletlerini seç; ilgili kontrolde yetkinlik bonusu iki kat. 6’da iki ek seçim. Alet uzmanlığını Araçlar/notlarda, becerileri Uzmanlık seçiminde işaretle.'),
    feature(1,'Gizli Saldırı','Her tur bir kez, ustalık (finesse) veya menzilli silah isabetine ek hasar. Avantajın varsa veya hedefin 5 ft içinde aciz olmayan başka bir düşmanı varsa ve sen dezavantajlı değilsen işler. 1’de 1d6, her tek seviyede +1d6, 19’da 10d6. “Her tur” ile “kendi turum” farklıdır; uygun tepki saldırısında da mümkün olabilir.'),
    feature(1,'Hırsız Jargonu','Gizli mesajları konuşmaya katarsın; normal iletinin dört katı zaman alır. İşaret/sembollerle tehlike, ganimet ve saklanma noktası bildirebilirsin; bütün dilleri anlama sağlamaz.'),
    feature(2,'Kurnaz Eylem','Her kendi turunda bonus eylemle Atıl, Uzaklaş veya Gizlen. Otomatik görünmezlik sağlamaz; gizlenme koşullarını DM belirler.'),
    feature(3,'Düzenbaz Yolu','Hırsız veya kayıtlı Büyülü Düzenbaz’ı seç; yol yetenekleri 3, 9, 13 ve 17. seviyelerde gelir.'),
    feature(3,'Hızlı Eller ve Çatı Yolları','Kurnaz Eylem ile El Çabukluğu, hırsız aletleriyle kilit/tuzak veya Nesne Kullan eylemini yapabilirsin; büyülü eşya etkinleştirmek otomatik kapsamda değildir. Tırmanma ek hareket harcatmaz; koşulu uzun atlayışa Çeviklik değiştiricin kadar ft ekle.','thief'),
    ...asi([4,8,10,12,16,19]),
    feature(5,'Esrarengiz Kaçınma','Görebildiğin saldırganın bir saldırısı vurduğunda tepkiyle o saldırının hasarını yarıya indir; kurtarış gerektiren her etkiye uygulanmaz.'),
    feature(6,'İki Ek Uzmanlık','İki ek yetkin beceri veya uygun hırsız aleti seçimini uzmanlaştır.'),
    feature(7,'Sıyrılma','Çeviklik kurtarışıyla yarım hasar veren bir etkide başarı hasarı 0 yapar, başarısızlık yarıya indirir.'),
    feature(9,'Üstün Gizlilik','Turunda hızının en çok yarısı kadar hareket edersen Çeviklik (Gizlenme) kontrolünde avantaj.','thief'),
    feature(11,'Güvenilir Yetenek','Yetkinlik bonusun eklenen nitelik kontrollerinde doğal d20 9 veya altındaysa 10 say. Taban beceri bonusuna +10 eklemek değildir.'),
    feature(13,'Büyülü Aygıt Kullanımı','Büyülü eşya kullanımında sınıf, soy ve seviye şartlarını yok sayabilirsin; eşyanın diğer koşulları sürer.','thief'),
    feature(14,'Kör Sezi','Duyabildiğin sürece 10 ft içindeki gizlenmiş veya görünmez yaratıkların konumunu bilirsin.'),
    feature(15,'Kaygan Zihin','Bilgelik kurtarışlarında yetkinlik kazanırsın; mevcut defterde Ek Kurtarış Yetkinliği bölümünden Bilgelik’i seç.'),
    feature(17,'Hırsız Refleksleri','Savaşın ilk raundunda biri normal inisiyatifinde, diğeri 10 daha düşükte iki tur alırsın. Sürprize uğramışken kullanamazsın.','thief'),
    feature(18,'Ele Geçmez','Aciz değilsen sana karşı hiçbir saldırı avantaj kazanamaz.'),
    feature(20,'Talih Vuruşu','Menzildeki bir hedefe ıskalayan saldırıyı isabete veya başarısız nitelik kontrolünün d20’sini 20’ye çevirebilirsin. Kısa/uzun dinlenme başına bir kez; kurtarış değildir.',undefined,()=>counter('rogue-stroke-of-luck','Talih Vuruşu',1,'short')),
    feature(3,'Büyülü Düzenbaz: büyü ve el becerisi','Zekâ ile Büyücü listesinden sınırlı büyü öğren. Büyücü Eli zorunludur; çoğu dereceli büyü Efsun/Yanılsama olmalıdır. Görünmez el ile özel hırsızlık/alet işlemlerini ve okul kotalarını elle izle.','arcane-trickster'),
    feature(9,'Büyülü Pusu','Bir hedefe karşı gizlenmişken ona büyü yaparsan o tur büyünün kurtarışlarında dezavantaj alır.','arcane-trickster'),
    feature(13,'Çok Yönlü Düzenbaz','Bonus eylemle Büyücü Eli’ni 5 ft yanındaki hedefin dikkatini dağıtacak şekilde kullan; o tur hedefe saldırılarında avantaj.','arcane-trickster'),
    feature(17,'Büyü Hırsızı','Sana büyü yapan veya seni alanına alan bir büyücüye tepki ver; Zekâ kurtarışı başarısızsa etkiyi kendin için engelle. Uygun derecedeki büyüyü 8 saatliğine çalabilir ve yuvayla kullanabilirsin; asıl büyücü o sürede kullanamaz. Tam koşullar DM kontrolünde; uzun dinlenme başına bir kez.','arcane-trickster',()=>counter('rogue-spell-thief','Büyü Hırsızı',1,'long')),
  ],
  sorcerer:[
    fullCasting('Efsuncu','Karizma','Sınırlı sayıda büyü bilirsin; günlük hazırlık ve temel sınıftan ritüel kullanımı yoktur. Seviye aldığında bir bilinen büyüyü değiştirebilirsin.'),
    feature(1,'Ejderha Atası ve Dayanıklılığı','Bir ejderha/hasar türü seç. Ejderha dili; ejderhalarla Karizma kontrollerinde uygun yetkinliği iki kat uygula. Her seviyede +1 azami can, zırh yokken 13 + Çeviklik ZS: defter bunları hesaplar. Ejderha dilini elle ekle.','draconic'),
    feature(2,'Büyü Pınarı: Efsun Puanları','Puanın efsuncu seviyene eşittir; uzun dinlenmede geri gelir. Bonus eylemle yuva bozup derecesi kadar puan alabilir veya puanla yuva yaratabilirsin. 1/2/3/4/5. derece yuva bedelleri 2/3/5/6/7 puandır; yaratılan yuva uzun dinlenmede kaybolur. Sayaç değişikliği yuvayı otomatik değiştirmez.',undefined,c=>counter('sorcerer-points','Efsun Puanları',c.level,'long')),
    feature(3,'Üst Büyü','İki seçenek seç: Dikkatli (1 puan; Karizma değiştiricin kadar, en az bir seçili hedef kurtarışta başarılı), Uzak (1; menzil ×2/dokunma 30 ft), Güçlendirilmiş (1; Karizma değiştiricin kadar, en az bir hasar zarını yeniden at), Uzatılmış (1; en az 1 dakikalık süreyi ×2 yap, en çok 24 saat), Zorlayıcı (3; bir hedefin ilk kurtarışında dezavantaj), Hızlandırılmış (2; eylem süresi bonus eylem), İncelikli (1; söz/bedensel bileşeni kaldır), İkiz (derece kadar, basit büyüde 1; yalnız uygun tek hedefli büyü). Normalde büyü başına tek Üst Büyü; Güçlendirilmiş istisnasıdır. Seçimleri ve tam hedef koşullarını not et. Bonus eylemle büyü yaptığın turda başka büyü ancak eylem süresi 1 eylem olan bir basit büyü olabilir; Hızlandırılmış bunu aşmaz.'),
    ...asi([4,8,12,16,19]),
    feature(6,'Element Yakınlığı','Atanın türünde hasar veren bir büyünün bir hasar zarına Karizma değiştiricini ekle. Bunu yaparken 1 puan harcayıp o hasar türüne 1 saat direnç alabilirsin.','draconic'),
    feature(10,'Ek Üst Büyü','Bir ek Üst Büyü seç (toplam 3); seçimini not et.'),
    feature(14,'Ejderha Kanatları','Bonus eylemle kanat çıkar/kaldır; uçma hızın yürüyüş hızına eşit. Giysi ve zırh kanatlara uyumlu olmalıdır.','draconic'),
    feature(17,'Dördüncü Üst Büyü','Bir ek Üst Büyü seç (toplam 4).'),
    feature(18,'Ejderha Varlığı','Eylem ve 5 efsun puanıyla 1 dakikaya kadar yoğunlaşma gerektiren 60 ft aura yarat. Seçtiğin düşmanlar Bilgelik kurtarışıyla korku veya hayranlık/büyülenmeye direnebilir; başarılı hedef 24 saat bağışıktır.','draconic'),
    feature(20,'Efsun Toparlanması','Kısa dinlenmeyi bitirince 4 efsun puanı geri kazan; azami puanını aşma. Genel kısa dinlenme düğmesi bu koşullu geri kazanımı otomatik uygulamaz.'),
  ],
  warlock:[
    feature(1,'Ant Büyüsü ve Öte Dünya Efendisi','Karizma ile sınırlı sayıda büyü bilirsin. Ant yuvalarının tümü aynı derecededir ve kısa/uzun dinlenmede geri gelir; olağan büyü yuvalarıyla aynı sayaç değildir. SRD efendisi İblis’tir. Genişletilmiş liste büyüleri otomatik öğrenilmez, seçim olanağı verir.'),
    feature(1,'Karanlık Efendinin Lütfu','Düşman bir yaratığı 0 cana indirdiğinde ant büyücüsü seviyesi + Karizma değiştiricin kadar geçici can alırsın. Geçici canlar toplanmaz; elindeki veya yenisini seç.','fiend'),
    feature(2,'Gizemli Çağrılar','İki çağrı seç. Seviye/ant/büyü önkoşullarını kontrol et; seçim sayısı 5’te 3, 7’de 4, 9’da 5, 12’de 6, 15’te 7, 18’de 8 olur. Çağrılar otomatik uygulanmaz; isim, önkoşul, sürekli etki ve sınırlı kullanımı not/kaynaklarda sakla.'),
    feature(3,'Ant Armağanı','Zincir (özel tanıdık ve ritüeli), Kılıç (ant silahı) veya Kitap (üç sınıf dışı basit büyü) seç. Armağan/çağrılardan gelen ek büyüler ayrı kaynaktır; normal sınıf büyü seçimine otomatik eklenmez. Silahı/tanışığı/ek basit büyüleri not et.'),
    ...asi([4,8,12,16,19]),
    feature(5,'Üçüncü Gizemli Çağrı','Toplam üç çağrı bilirsin; yeni seçimin önkoşullarını kontrol et.'),
    feature(6,'Karanlık Efendinin Talihi','Nitelik kontrolü veya kurtarışına d10 ekle; ilk zar atıldıktan sonra ama sonuç belirlenmeden karar ver. Kısa/uzun dinlenme başına bir kullanım.','fiend',()=>counter('warlock-dark-luck','Karanlık Efendinin Talihi',1,'short')),
    feature(7,'Dördüncü Gizemli Çağrı','Toplam dört çağrı bilirsin.'),feature(9,'Beşinci Gizemli Çağrı','Toplam beş çağrı bilirsin.'),
    feature(10,'İblisçe Direnç','Kısa/uzun dinlenmeden sonra bir hasar türüne direnç seç. Büyülü veya gümüşlü silahların hasarı bu direnci aşar; seçimi not et.','fiend'),
    ...[[11,6],[13,7],[15,8],[17,9]].map(([level,degree])=>feature(level,`Gizemli Sır: ${degree}. derece`,`${degree}. dereceden bir ant büyücüsü büyüsü seç; uzun dinlenme başına bir kez yuva harcamadan yaparsın. Bu ayrı günlük hakkı Büyüler bölümündeki Gizemli Sır sayacından kullan; Ant yuvası harcama.`)),
    feature(12,'Altıncı Gizemli Çağrı','Toplam altı çağrı bilirsin.'),
    feature(14,'Cehenneme Savur','Saldırıyla vurduğunda hedefi kısa bir cehennem yolculuğuna gönder; sonraki turunun sonunda geri döner. İblis değilse 10d10 psişik hasar alır. Uzun dinlenme başına bir kez.','fiend',()=>counter('warlock-hurl-hell','Cehenneme Savur',1,'long')),
    feature(15,'Yedinci Gizemli Çağrı','Toplam yedi çağrı bilirsin.'),feature(18,'Sekizinci Gizemli Çağrı','Toplam sekiz çağrı bilirsin.'),
    feature(20,'Ant Ustası','Efendine 1 dakika yalvararak harcanmış Ant yuvalarının tamamını geri al; uzun dinlenme başına bir kez. Gizemli Sırları yenilemez. Ant sayacını ayrıca sıfırla.',undefined,()=>counter('warlock-eldritch-master','Ant Ustası',1,'long')),
  ],
  wizard:[
    fullCasting('Büyücü','Zekâ','İlk kitapta altı 1. derece büyü; her sonraki büyücü seviyesinde iki ücretsiz uygun büyü. Başka kaynaklardan kopyalama ayrıca mümkündür. Seviye + Zekâ kadar büyü hazırla (en az 1); kitabındaki ritüeller hazır olmasa da ritüel yapılabilir.'),
    feature(1,'Gizemli Toparlanma','Günde bir kısa dinlenmede toplam derecesi yarım büyücü seviyesini (yukarı yuvarla) aşmayan yuvaları geri al; 6. derece veya üstü yuva olamaz. Hangi yuvaların geri döndüğünü elle seç; genel kısa dinlenme düğmesi bunları otomatik yenilemez.',undefined,()=>counter('wizard-arcane-recovery','Gizemli Toparlanma (günde bir)',1,'long')),
    feature(2,'Gizemli Gelenek','Bir gelenek seç. Yerleşik SRD geleneği Çağrışım’dır; sonraki özellikleri 6, 10 ve 14. seviyelerde gelir.'),
    feature(2,'Çağrışım Bilgini ve Büyü Biçimleme','Çağrışım büyülerini kitaba kopyalamak yarı zaman/altın ister. Görebildiğin dostları etkileyen bir çağrışım büyüsünde 1 + büyü derecesi kadar hedef seç; kurtarışta otomatik başarılı olurlar ve normalde yarım alacakları hasarı almazlar.','evocation'),
    ...asi([4,8,12,16,19]),
    feature(6,'Güçlü Basit Büyü','Hedef, hasar veren basit büyüne karşı kurtarışında başarılı olsa da hasarın yarısını alır; ek etkileri almaz. Saldırı zarı ıskalamaları için geçerli değildir.','evocation'),
    feature(10,'Güçlendirilmiş Çağrışım','Yaptığın bir büyücü çağrışım büyüsünün bir hasar zarına Zekâ değiştiricini ekle.','evocation'),
    feature(14,'Aşırı Kanal','1–5. dereceden hasar veren büyücü büyüsünün hasarını azami yapabilirsin. Uzun dinlenme sonrası ilk kullanım güvenlidir; tekrarları büyü derecesi başına 2d12 nekrotik hasar verir, her ek tekrarda +1d12 artar; direnç/bağışıklık aşılır. Sayaç yalnız ücretsiz kullanımı izler.','evocation',()=>counter('wizard-overchannel','Aşırı Kanal: güvenli kullanım',1,'long')),
    feature(18,'Büyü Ustalığı','Kitabından bir 1. ve bir 2. derece büyü seç. Hazır olduklarında en düşük derecelerinde yuvasız yapabilirsin; daha yüksek derecede yuva gerekir. 8 saat çalışarak seçimleri değiştirebilirsin. İsimlerini not et; genel büyü harcama düğmesi muafiyeti otomatik uygulamaz.'),
    feature(20,'İmza Büyüleri','Kitabından iki 3. derece büyü seç; daima hazır ve hazırlık kotası dışında. Her birini kısa/uzun dinlenme başına bir kez 3. derecede yuvasız yaparsın; diğer kullanımlar normal yuva ister. A/B sayaçlarını seçtiğin isimlerle yeniden adlandır.',undefined,()=>counter('wizard-signature-a','İmza büyüsü A (3. derece)',1,'short')),
    feature(20,'İkinci İmza Büyüsü','İkinci seçtiğin 3. derece büyünün bağımsız ücretsiz kullanımı; aynı büyüyü iki kez seçme.',undefined,()=>counter('wizard-signature-b','İmza büyüsü B (3. derece)',1,'short')),
  ],
}

export type RaceReference = {
  id:string; name:string; ability:string; size:string; speed:number; darkvision:string;
  languages:string[]; extraLanguages:number; skills:SkillId[]; skillChoices:number;
  tools?:string[]; toolChoices?:string[]; traits:{title:string;text:string}[];
  resources?:(character:PlayerCharacter)=>ReferenceResource[];
}
export const languageOptions = ['Ortak Dil','Cücece','Elfçe','Devce','Gnomca','Goblin Dili','Buçukluk Dili','Orkça','Uçurum Dili','Göksel Dil','Ejderha Dili','Derin Konuşma','Cehennem Dili','İlksel Dil','Peri Dili','Karanlıkaltı Ortak Dili']
export const raceReferences:RaceReference[] = [
  {id:'human',name:'İnsan',ability:'Altı niteliğin her birine +1. Bu, standart 2014 insandır; varyant insan değildir.',size:'Orta',speed:30,darkvision:'Yok',languages:['Ortak Dil'],extraLanguages:1,skills:[],skillChoices:0,traits:[{title:'Çeşitli Halklar',text:'Bir ek dil seç. Standart insan ek beceri veya ücretsiz yetenek kazanmaz; Aruzahr’daki kültürün ve doğum yerin ayrıca hikâye seçimidir.'}]},
  {id:'hill-dwarf',name:'Tepe Cücesi',ability:'Dayanıklılık +2, Bilgelik +1.',size:'Orta',speed:25,darkvision:'60 ft; karanlıkta renk seçilmez',languages:['Ortak Dil','Cücece'],extraLanguages:0,skills:[],skillChoices:0,toolChoices:['Demirci aletleri','Biracı malzemeleri','Taşçı aletleri'],traits:[{title:'Cüce Direnci',text:'Zehir kurtarışlarında avantaj, zehir hasarına direnç.'},{title:'Silah ve Zanaat',text:'Savaş baltası, el baltası, hafif çekiç ve savaş çekici yetkinliği. Bir artisan aleti seç: demirci, biracı veya taşçı.'},{title:'Taş Bilgisi',text:'Taş işçiliğinin kökenine dair Zekâ (Tarih) kontrolünde yetkin sayılırsın ve yetkinlik bonusun iki kat eklenir; bütün Tarih kontrollerine genel uzmanlık değildir.'},{title:'Cüce Sağlamlığı',text:'Her karakter seviyesinde +1 azami can; defter hesaplar. Hızın ağır zırhın Kuvvet şartından dolayı azalmaz.'}]},
  {id:'high-elf',name:'Yüksek Elf',ability:'Çeviklik +2, Zekâ +1.',size:'Orta',speed:30,darkvision:'60 ft; karanlıkta renk seçilmez',languages:['Ortak Dil','Elfçe'],extraLanguages:1,skills:['perception'],skillChoices:0,traits:[{title:'Keskin Duyular',text:'Algı yetkinliği; aşağıdaki açık uygulama düğmesiyle eklenebilir.'},{title:'Peri Soyu ve Trans',text:'Büyülenmeye karşı kurtarış avantajı; büyü seni uyutamaz. Günde 4 saat trans, insanın 8 saatlik uykusuyla aynı yararı verir; nöbet ve uzun dinlenme koşullarını DM ile belirle.'},{title:'Elf Silah Eğitimi',text:'Uzun/kısa kılıç ve uzun/kısa yay yetkinliği.'},{title:'Soy Büyüsü',text:'Büyücü listesinden bir basit büyü seç; büyü niteliği Zekâ. Sınıfından bağımsızdır: adını notlara, ZD ve saldırısını kendi Zekâ’nla yaz; sınıf büyü defterine otomatik eklenmez.'}]},
  {id:'lightfoot-halfling',name:'Hafifayak Buçukluk',ability:'Çeviklik +2, Karizma +1.',size:'Küçük',speed:25,darkvision:'Yok',languages:['Ortak Dil','Buçukluk Dili'],extraLanguages:0,skills:[],skillChoices:0,traits:[{title:'Şanslı',text:'Saldırı, nitelik kontrolü veya kurtarış d20’sinde doğal 1 atarsan yeniden at ve yeni sonucu kullan.'},{title:'Cesur ve Çevik',text:'Korkuya karşı kurtarış avantajı. Senden daha büyük yaratıkların kapladığı alandan geçebilirsin; hareketini onların alanında bitiremezsin.'},{title:'Doğal Gizlilik',text:'Senden en az bir boy büyük bir yaratık seni örttüğünde gizlenmeyi deneyebilirsin; otomatik gizli sayılmazsın.'},{title:'Küçük Beden',text:'2014’te ağır (heavy) silah saldırılarında dezavantaj; eşya ve silah seçerken özelliğini kontrol et.'}]},
  {id:'dragonborn',name:'Ejderdoğan',ability:'Kuvvet +2, Karizma +1.',size:'Orta',speed:30,darkvision:'Yok',languages:['Ortak Dil','Ejderha Dili'],extraLanguages:0,skills:[],skillChoices:0,traits:[{title:'Ejderha Soyu',text:'Siyah/bakır: asit çizgi Çeviklik; mavi/bronz: yıldırım çizgi Çeviklik; pirinç: ateş çizgi Çeviklik; altın/kırmızı: ateş koni Çeviklik; yeşil: zehir koni Dayanıklılık; gümüş/beyaz: soğuk koni Dayanıklılık. Çizgi 5 × 30 ft, koni 15 ft. Soyunu not et.'},{title:'Nefes Silahı',text:'Eylemle kullan: ZD 8 + yetkinlik + Dayanıklılık. Hasar 2d6; 6’da 3d6, 11’de 4d6, 16’da 5d6; başarılı kurtarış yarım. Kısa/uzun dinlenmede bir kez. 2014’te bir saldırının yerine geçmez, eylemin tamamını kullanır.'},{title:'Hasar Direnci',text:'Seçtiğin ejderha soyunun hasar türüne direnç.'}],resources:()=>[counter('dragonborn-breath','Ejderha Nefesi',1,'short')]},
  {id:'rock-gnome',name:'Kaya Gnomu',ability:'Zekâ +2, Dayanıklılık +1.',size:'Küçük',speed:25,darkvision:'60 ft; karanlıkta renk seçilmez',languages:['Ortak Dil','Gnomca'],extraLanguages:0,skills:[],skillChoices:0,tools:['Tamirci aletleri'],traits:[{title:'Gnom Kurnazlığı',text:'Büyüye karşı Zekâ, Bilgelik ve Karizma kurtarışlarında avantaj. Büyüsüz etkilere genel avantaj sağlamaz.'},{title:'Zanaatkâr Bilgisi',text:'Büyülü eşyalar, simya nesneleri veya teknolojik aygıtlara ilişkin Zekâ (Tarih) kontrolüne normalde ekleyeceğin yetkinlik bonusunun iki katını ekle; genel Tarih uzmanlığı değildir.'},{title:'Tamirci',text:'Tamirci aleti yetkinliği. 1 saat ve 10 altın malzemeyle minik kurmalı oyuncak, ateş yakıcı veya müzik kutusu yap. En çok üç aygıt etkin olabilir; 24 saat sonra ya da parçalanınca çalışmaz, 1 saatlik bakımla ömrü sürer.'},{title:'Küçük Beden',text:'Ağır (heavy) silah saldırıları dezavantajlıdır.'}]},
  {id:'half-elf',name:'Yarı Elf',ability:'Karizma +2; Karizma dışındaki iki farklı niteliğe +1. Bu iki seçimi Nitelikler’de bir kez elle uygula.',size:'Orta',speed:30,darkvision:'60 ft; karanlıkta renk seçilmez',languages:['Ortak Dil','Elfçe'],extraLanguages:1,skills:[],skillChoices:2,traits:[{title:'Peri Soyu',text:'Büyülenmeye karşı kurtarış avantajı; büyü seni uyutamaz. Elf Trans özelliğini kazanmazsın.'},{title:'Beceri Çeşitliliği',text:'İki farklı beceride yetkinlik seç. Zaten yetkin olduğun bir beceriyi seçme; bu özellik uzmanlık vermez.'}]},
  {id:'half-orc',name:'Yarı Ork',ability:'Kuvvet +2, Dayanıklılık +1.',size:'Orta',speed:30,darkvision:'60 ft; karanlıkta renk seçilmez',languages:['Ortak Dil','Orkça'],extraLanguages:0,skills:['intimidation'],skillChoices:0,traits:[{title:'Tehditkâr',text:'Gözdağı yetkinliği.'},{title:'İnatçı Dayanıklılık',text:'0 cana düşüp anında ölmezsen 1 canda kalmayı seçebilirsin; uzun dinlenme başına bir kez. Canı ve kaynağı elle güncelle.'},{title:'Yabanî Saldırılar',text:'Yakın silah saldırısında kritik vurursan silahın hasar zarlarından birini bir kez daha atıp kritik hasarına ekle. Normal vuruşa veya bütün zar havuzuna bir kat daha eklemek değildir.'}],resources:()=>[counter('half-orc-relentless','İnatçı Dayanıklılık',1,'long')]},
  {id:'tiefling',name:'Tiefling',ability:'Karizma +2, Zekâ +1.',size:'Orta',speed:30,darkvision:'60 ft; karanlıkta renk seçilmez',languages:['Ortak Dil','Cehennem Dili'],extraLanguages:0,skills:[],skillChoices:0,traits:[{title:'Cehennem Direnci',text:'Ateş hasarına direnç.'},{title:'Cehennem Mirası',text:'1’de Mucize (Thaumaturgy) basit büyüsü; 3’te Cehennem Azarı (Hellish Rebuke) bir kez 2. derecede; 5’te Karanlık (Darkness) bir kez. Her iki dereceli hak uzun dinlenmede ayrı ayrı yenilenir. Büyü niteliği Karizma; 2014’te bunları sınıf yuvalarıyla sınırsız kullanma hakkı doğmaz. Soy büyülerini sınıf kitabından ayrı not/kaynakta izle.'}],resources:c=>[...(c.level>=3?[counter('tiefling-rebuke','Soy: Cehennem Azarı (2. derece)',1,'long')]:[]),...(c.level>=5?[counter('tiefling-darkness','Soy: Karanlık',1,'long')]:[])]},
]

export function featuresForCharacter(character:PlayerCharacter) {
  return classFeatureReferences[character.classId].filter(row=>!row.subclass||row.subclass===character.subclass).sort((a,b)=>a.level-b.level)
}
export function createReferenceResource(resource:ReferenceResource):PlayerResource {
  return {...resource,used:0}
}
/** Exact repeated application is idempotent; unrelated prose and user choices survive. */
export function mergeReferenceText(existing:string,additions:string[]) {
  const known=new Set(existing.split(/[,;\n]/).map(value=>value.trim().toLocaleLowerCase('tr-TR')))
  const added=additions.filter(value=>value.trim()&&!known.has(value.trim().toLocaleLowerCase('tr-TR')))
  return [existing.trim(),...new Set(added)].filter(Boolean).join(', ')
}
export function mergeReferenceSkills(existing:SkillId[],additions:SkillId[]) {
  return [...new Set([...existing,...additions])]
}
