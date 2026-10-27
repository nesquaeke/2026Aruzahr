import type { Artwork } from './media'
export const cityArtworks: Artwork[] = [
  {
    "id": "city-oil-valdareth",
    "src": "/illustrations/city-oil-valdareth.webp",
    "title": "Valdareth · Şehir Tablosu",
    "caption": "Beş sur, mor çatılar, siyah kilise ve Rilorn’a açılan liman · 27 Ekim 2026, bağımsız yağlıboya mekân yorumu; ölçülü plan veya harita değildir",
    "origin": "generated",
    "painted": true,
    "category": "landscape",
    "relatedId": "valdareth"
  },
  {
    "id": "city-oil-morihael",
    "src": "/illustrations/city-oil-morihael.webp",
    "title": "Morihael · Şehir Tablosu",
    "caption": "Murgul’un milyonluk ada başkenti; tersaneler ve taş rıhtımlar · 27 Ekim 2026, bağımsız yağlıboya mekân yorumu; ölçülü plan veya harita değildir",
    "origin": "generated",
    "painted": true,
    "category": "landscape",
    "relatedId": "morihael"
  },
  {
    "id": "city-oil-marhalden",
    "src": "/illustrations/city-oil-marhalden.webp",
    "title": "Marhalden · Şehir Tablosu",
    "caption": "Aldara’nın iki kıyısında kaleler, köprüler ve dağ şelalesi · 27 Ekim 2026, bağımsız yağlıboya mekân yorumu; ölçülü plan veya harita değildir",
    "origin": "generated",
    "painted": true,
    "category": "landscape",
    "relatedId": "marhalden"
  },
  {
    "id": "city-oil-elorwyn",
    "src": "/illustrations/city-oil-elorwyn.webp",
    "title": "Elorwyn · Şehir Tablosu",
    "caption": "Geniş ruhban okulları, kiliseler ve paladin meydanları · 27 Ekim 2026, bağımsız yağlıboya mekân yorumu; ölçülü plan veya harita değildir",
    "origin": "generated",
    "painted": true,
    "category": "landscape",
    "relatedId": "elorwyn"
  },
  {
    "id": "city-oil-theramis",
    "src": "/illustrations/city-oil-theramis.webp",
    "title": "Theramis · Şehir Tablosu",
    "caption": "Beyaz kuvars okullar, mavi kakmalar ve sütunlu avlular · 27 Ekim 2026, bağımsız yağlıboya mekân yorumu; ölçülü plan veya harita değildir",
    "origin": "generated",
    "painted": true,
    "category": "landscape",
    "relatedId": "theramis"
  },
  {
    "id": "city-oil-dorvenhall",
    "src": "/illustrations/city-oil-dorvenhall.webp",
    "title": "Dorvenhall · Şehir Tablosu",
    "caption": "Dağların ardındaki atölyeler ve sanayi vadisi · 27 Ekim 2026, bağımsız yağlıboya mekân yorumu; ölçülü plan veya harita değildir",
    "origin": "generated",
    "painted": true,
    "category": "landscape",
    "relatedId": "dorvenhall"
  },
  {
    "id": "city-oil-lirendil",
    "src": "/illustrations/city-oil-lirendil.webp",
    "title": "Lirendil · Şehir Tablosu",
    "caption": "Anıtsal fener, büyük kütüphane ve kervan avluları · 27 Ekim 2026, bağımsız yağlıboya mekân yorumu; ölçülü plan veya harita değildir",
    "origin": "generated",
    "painted": true,
    "category": "landscape",
    "relatedId": "lirendil"
  }
]
export const cityArtAliases: Record<string,string> = Object.fromEntries(cityArtworks.map(art => [art.relatedId!,art.id]))
