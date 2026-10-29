import type {Artwork} from './media';
const scenes=[
 ['side-frostbay-market','Frostbay · Eski çarşı','frostbay'],
 ['side-mine-entrance','Eski ocak · Giriş',''],
 ['side-mine-hall','Eski ocak · Ayrım galerisi',''],
 ['side-mine-rig','Soğuk Kesim Aracı',''],
 ['side-marhalden-guild','Marhalden · Üç Mühür Lonca Salonu','marhalden-uc-muhur'],
 ['side-orvek-house','Orman kıyısındaki ev',''],
 ['side-dry-mill','Eski değirmen',''],
 ['side-treasure-handout','Eski bir ocak krokisi','']
];
const items=[['side-dagger','Düğümkesen'],['side-sword','Denge Çeliği'],['side-bow','Sakin Kiriş'],['side-arrow','İz Boyası Okları'],['side-cloak','İs Tülü'],['side-solukoz','Soluköz'],['side-bad-sword','Yıpranmış Kılıç'],['side-fake-armor','Süslü Göğüslük']];
const people=[['side-bren','Bren Volk'],['side-dessa','Dessa Kurn'],['side-ilven','Çavuş İlven Sorn']];
export const sideArtworks:Artwork[]=[
 ...scenes.map(([id,title,relatedId]):Artwork=>({id,title,src:`/illustrations/${id}.webp`,caption:'29 Ekim · yeni yağlıboya mekân yorumu; yaşanmış olay kaydı değildir',origin:'generated',painted:true,category:id==='side-treasure-handout'?'map':'scene',...(relatedId?{relatedId}:{})})),
 ...items.map(([id,title]):Artwork=>({id,title,src:`/illustrations/${id}.webp`,caption:'Aruzahr · eşya ve mineral yağlıboya portresi',origin:'generated',painted:true,category:'item',...(id==='side-solukoz'?{relatedId:'solukoz'}:{})})),
 ...people.map(([id,title]):Artwork=>({id,title,src:`/illustrations/${id}.webp`,caption:'Frostbay · yeni kişi tasviri; sade yağlıboya portre',origin:'generated',painted:true,portrait:true,category:'portrait',relatedId:id})),
 {id:'side-mine-map',title:'Eski ocak · Oyuncu planı',src:'/illustrations/side-mine-map.png',caption:'Çözümsüz, şematik oda planı · atlas koordinatı değildir',origin:'adapted',category:'map'},
];
