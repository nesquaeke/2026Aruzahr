import type { Artwork } from './media'
export const winterPeople = [['sena-erven','Sena Erven'],['miren-aska','Miren Aska'],['bera-hald','Bera Hald'],['iven-rusk','Iven Rusk'],['elda-sorren','Elda Sorren'],['neris-vel','Neris Vel'],['maeron-vesk','Yüzbaşı Maeron Vesk'],['taren-olt','Taren Olt']]
const sceneRows = [['ilac','Marhalden · İki yatak','marhalden'],['kopru','Batı geçidindeki yük köprüsü','marhalden'],['ekmek','Harven · Küçük fırın','harven'],['varkul','Mavric · Varkul ini','mavric'],['uyku','Frostbay · Eski taş salon','frostbay'],['baba','Frostbay · Kıyı odası','frostbay'],['kayik','Frostbay · Fırtına kıyısı','frostbay'],['bahce','Ternhaven · Sıcak su bahçesi','ternhaven'],['ambar','Dranthol · İkmal avlusu','dranthol'],['kul','Kömürcü evlerinin kalıntıları','dranthol'],['marhalden','Marhalden · Aldara ve iki kale','marhalden'],['kamp','Hardlane · Akşam kampı','hardlane']]
export const winterArtworks: Artwork[] = [
 ...sceneRows.map(([id,title,relatedId]):Artwork=>({id:`winter-${id}`,src:`/illustrations/winter-${id}.webp`,title,caption:'On Kış Kararı · yeni boyanmış sahne yorumu, kampanyanın sonucu veya kesin yeni harita noktası değildir',relatedId,origin:'generated',painted:true,category:'scene'})),
 ...winterPeople.map(([id,name]):Artwork=>({id:`winter-${id}`,src:`/illustrations/winter-${id}.webp`,title:name,caption:'On Kış Kararı · yeni kamusal kişi portresi',relatedId:id,origin:'generated',painted:true,portrait:true,category:'portrait'}))
]
export const winterAliases = Object.fromEntries(winterPeople.map(([id])=>[id,`winter-${id}`]))
