import type {PlayerResource} from '../player/types';

/** User-requested innate magic. This is an Aruzahr house rule, not rogue
 * Spellcasting, an early subclass, a feat, or a change to all human rogues. */
export const jeremiahGift={
 id:'jeremiah-kan-yankisi',name:'Kan Yankısı',uses:2,
 rules:'Aruzahr özel kuralı · Jeremiah’ın doğuştan yeteneği. İki seçenek aynı 2 kullanım hakkını paylaşır; uzun dinlenmede tamamı yenilenir, kısa dinlenmede yenilenmez. Bir seçeneği başlatmak 1 eylem ve 1 kullanım harcar. Menzil 9 metre; görülen ve tam siper arkasında olmayan bir nokta gerekir. Kısık bir sözcük ve el hareketiyle yapılır; otomatik olarak fark edilmez değildir. Sesindeki yankı düğümü buna ayrıca bir ceza getirmez. Aynı anda yalnız bir etki sürer; yeni etki öncekini bitirir. Büyü yuvası harcamaz ve hasar vermez. Bunlar sınırsız kullanılan cantrip veya Düzenbaz sınıf büyüleri değildir.',
 options:[
  {name:'Soluk El',text:'Solgun bir el 1 dakika belirir. En fazla 1 kg ağırlığındaki sahipsiz bir eşyayı kaldırabilir, kilitli olmayan hafif bir kapıyı itebilir veya basit bir nesneyi taşıyabilir. Başlattığın eylemle ilk işi yaptırırsın; sonraki her yönlendirme 1 eylem ister ve ek kullanım harcamaz. El her zaman senden en fazla 9 metre uzakta kalır; menzil dışına çıkarsa kaybolur. Saldıramaz, büyülü eşya etkinleştiremez, kilit açamaz, hırsız aleti kullanamaz veya birinin üzerindeki/tuttuğu eşyayı alamaz.'},
  {name:'Sahte Fısıltı',text:'Seçtiğin noktadan ayak sürtünmesi, tek bir tıkırtı veya kısa bir ıslık gibi basit bir ses gelir; en fazla 1 tur (6 saniye) sürer. Ses normal bir konuşmadan yüksek olamaz ve en fazla 9 metre öteden duyulur; çevre gürültüsü sesi örtebilir. Anlaşılır söz, belirli bir kişinin sesi veya emir üretemez. Bir yaratık eylemini ayırıp Zekâ (Araştırma) ZD 12 kontrolünü başarırsa sesin büyülü bir yanılsama olduğunu anlar. ZD, 8 + yetkinlik bonusu + Zekâ değiştiricisidir; bu kâğıtta 12. Ses, hedefi zorla hareket ettirmez ve tek başına saldırı avantajı veya Gizli Saldırı sağlamaz.'},
 ],
} as const;

export const jeremiahGiftDescription=[jeremiahGift.rules,...jeremiahGift.options.map(option=>option.name+': '+option.text)].join('\n\n');
export const jeremiahGiftResource=():PlayerResource=>({id:jeremiahGift.id,name:jeremiahGift.name,max:jeremiahGift.uses,used:0,reset:'long',description:jeremiahGiftDescription});
