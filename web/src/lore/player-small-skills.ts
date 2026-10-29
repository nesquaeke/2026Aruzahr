import type {PlayerResource} from '../player/types';

// User-requested minor, non-magical personal talents. These do not determine
// Mac's missing class, grant a feat, or change the rogue class for everyone.
export const macSmallSkill={
 id:'mac-bicak-siperligi',name:'Bıçak Siperliği',max:1,used:0,reset:'long',
 description:'Aruzahr özel kuralı · büyüsüz kişisel yetenek. Uzun dinlenme başına 1 kez. Elinde bir hançer varken, gördüğün bir yaratığın yakın dövüş silah saldırısı sana isabet ettiğinde tepkini harcayarak o saldırıdan aldığın kesici, delici veya ezici hasarı 1d4 azaltırsın; hasar en az 0 olur. Saldırının başka türdeki hasarı azalmaz. Kritik isabette de yalnız 1d4 azaltır. Büyü saldırısı, menzilli saldırı veya çevre hasarında kullanılamaz. Kullanım için elindeki tepkiyi ve kaynak hakkını harca; aynı turda ikinci tepki vermez. Hasarı düşür, sonra kalan hasarı uygula; site bunu otomatik hesaplamaz.',
} satisfies PlayerResource;

export const ciotelSmallSkill={
 id:'ciotel-cikis-gozu',name:'Çıkış Gözü',max:1,used:0,reset:'long',
 description:'Aruzahr özel kuralı · büyüsüz kişisel yetenek. Uzun dinlenme başına 1 kez. Bir yapıda kaçış yolu veya gizli geçit ararken yaptığın Zekâ (Araştırma) kontrolüne 1d4 eklersin. d20 sonucunu gördükten sonra, DM başarı veya başarısızlığı açıklamadan önce kullanacağını söyle. Araştırma normal eylemini/süresini ister; yeteneği eklemek ayrıca bir eylem istemez. Kontrol başarısız olsa da kullanım harcanır. Otomatik geçit oluşturmaz, kilit açmaz, tuzak sökmez ve saldırı zarlarına uygulanmaz. Çeviklik veya başka beceri bonusunu bu Zekâ kontrolüne ekleme. Ciotel’in mevcut Araştırma kontrolü d20 +2; yetenekle d20 +2 +1d4 olur. Site önce d20 atar; ek 1d4 ve kaynak kullanımı elle uygulanır.',
} satisfies PlayerResource;
