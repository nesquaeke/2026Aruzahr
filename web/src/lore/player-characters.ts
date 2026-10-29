import type { Character } from './characters';
import {macSmallSkill} from './player-small-skills';

export const playerCharacterSource = '29 Ekim 2026 · kullanıcı tarafından verilen Mac karakter dosyası; anlatım düzenlemesi, yeni portre yorumu ve sonradan istenen kişisel yetenek';

export const playerLoreCharacters: Character[] = [{
  id: 'tugg', name: 'Mac', role: 'Goblin paralı asker · oyuncu karakteri',
  city: '', locationUnknown: true, affiliation: 'Bağımsız', portrait: 'tugg',
  origin: 'Doğduğu köyün adı ve ülkesi bilinmiyor', source: 'author', power: 'ordinary',
  traits: ['Eşit pay', 'Temkinli', 'Eski köle', 'Aranıyor'],
  summary: 'Çocukken köle tüccarlarının eline düşen Mac, bugün kendi hesabına çalışan bir goblin paralı askerdir. Bir işteki payını yalnız kazancı değil, yanında yürüyenlerin ona ne gözle baktığını da ölçmek için kullanır.',
  background: 'Kuzeydeki savaşların ardından köyü yakıldı, ailesi öldürüldü. Sağ kalanlarla birlikte zincire vurularak götürüldü ve bir köle pazarında satıldı. Daha sonra acımasız bir paralı asker grubunun eline düştü. Onlar Mac’a özgürlük vermedi; onu dövüşmeyi ve hayatta kalmayı öğrenmek zorunda bıraktıkları bir silah gibi kullandı.',
  presence: 'Şimdi serbesttir, fakat aranmaktadır. Onu kimin, hangi gerekçeyle aradığı açıklanmamıştır. Bir hanedana veya loncaya bağlılığı, güncel şehri ve oyuncu grubuna katıldığı an henüz belirlenmemiştir.',
  sections: [
    {title:'Bir bakışta',table:{columns:['Bilgi','Kayıt'],rows:[['Halk / cinsiyet','Goblin · erkek'],['Yaş','Yaklaşık 24'],['Boy / ağırlık','1,48 m · 52 kg'],['Meslek','Paralı asker'],['Durum','Serbest; aranıyor'],['Köken ve güncel konum','Bilinmiyor'],['D&D sınıfı / seviyesi','Belirtilmedi']]},paragraphs:[]},
    {title:'Zincirden sonra',paragraphs:[
      'Mac’ın çocukluğundan geriye adı bilinmeyen bir köy ve o köyden koparıldığı gün kalır. Kuzeydeki savaşlar evine ulaştığında ailesini kaybetti. Sağ kalanların kurtuluşu da özgürlük olmadı: köle tüccarları onları zincire vurdu, uzun bir yolculuğun sonunda pazara çıkardı.',
      'Paralı askerlerin eline geçtiğinde kendisinden istenen şey değişti. Artık yalnız taşınacak bir yük değildi; başkalarının hesabına dövüşecekti. Hafif zırh içinde hareket etmeyi, iki bıçakla yakın mesafeyi tutmayı ve bir sonraki güne çıkmayı öğrendi. Para için insan öldürmeyi de bu yıllarda öğrendi. Bugün ücretini kendisi belirleyebilmesi, o yılları geride bıraktığı anlamına gelmez.',
    ]},
    {title:'Eşit pay, eşit hak',paragraphs:[
      'Yıllar içinde paranın yalnız yiyecek veya silah almadığını gördü. Ödülün nasıl bölündüğü, aynı tehlikeye girenlerin birbirine hangi hakkı tanıdığını da gösteriyordu. Mac’ın bugünkü kuralı açıktır: birlikte alınan işin payı eşit bölünür. Küçük bir işte de büyük bir işte de kendi hakkını eksik kabul etmez.',
      '“Üç kişiyiz, bir görev yapıyoruz. O zaman para da üçe bölünür. Değilse… biri eksik kalır.”',
      'Bu söz bir sofra şakası değildir. Mac için dostluk ve sadakat, ödeme konuşmasının dışında tutulmaz. Birine güvenebilmesiyle o kişinin yanında kalması aynı karar değildir; karşısındakinin bu farkı anlamasını bekler.',
    ]},
    {title:'Üzerinde taşıdıkları',table:{columns:['Eşya','Ayrıntı'],rows:[['Hafif zırh','Deri ve metal parçalar; oyun mekaniği karşılığı henüz seçilmedi'],['Çift bıçak','Yakın dövüş silahları'],['Kısa mızrak','Varsa taşır; kesin envantere otomatik eklenmez'],['Sırt çantası','Yemek, su ve temel yol malzemeleri'],['Para kesesi','Her zaman dolu değildir; altın miktarı belirtilmedi'],['Kırık madalya','Geçmişten kalan anı; kime veya neye ait olduğu açıklanmadı']]},paragraphs:['Koyu saçları, uzun sivri kulakları ve yeşil teni, yıpranmış deri parçalarının üstünde hemen ayırt edilir. Yeni portrede bordo boyun bezi ve donuk metal ayrıntılar korunur; madalyaya yeni bir hanedan ya da gizli güç atfedilmez.']},
    {title:'Kendi sözleriyle',paragraphs:[
      '“Para, dostluk, sadakat… Hepsi aynı kefede. Benim kefemde ise tartı var.”',
      '“Eşit pay, eşit hak. Aksi halde… kan.”',
    ]},
    {title:macSmallSkill.name+' · kişisel yetenek',paragraphs:[macSmallSkill.description,
      'Elindeki bıçaklar hançer olarak oynatıldığında fırlatılabilir: normal menzil 6 metre, uzun menzil 18 metre; uzun menzilde dezavantaj vardır. Çeviklikle normal isabet hasarı 1d4+3 delicidir. 1. seviyede hançer yetkinliği varsa isabet d20 +5 olur. Sınıf/seviye kaydı tamamlanmadığından bu koşul, kesinleşmiş bir oyuncu kâğıdı gibi sunulmaz. Atılan hançer geri alınana kadar elde değildir; Bıçak Siperliği için elinde başka hançer bulunmalıdır.',
    ]},
    {title:'Oyuncu kaydı hakkında',paragraphs:[
      'Kuvvet 12, Çeviklik 16, Dayanıklılık 13, Zekâ 10 ve Karizma 8 oyuncunun verdiği dosyadan alınmıştır. Görselde bulunmayan Bilgelik değeri, kullanıcının açıklamasıyla 10 olarak tamamlanmıştır. D&D sınıfı, seviye, can, zırh sınıfı ve yetkinlikler henüz belirtilmemiştir.',
      'Bu sayfa kamusal karakter biyografisidir. Oyuncunun hesabına veya mevcut partiye otomatik karakter eklemez; kişisel oyun kaydı Oyuncu Masası’nda ayrıca oluşturulur.',
    ]},
  ],
}];
