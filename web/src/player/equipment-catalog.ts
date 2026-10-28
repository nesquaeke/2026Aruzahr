import type { AbilityId, ClassId, PlayerAttack, PlayerCharacter, PlayerEquipment } from './types'
import { abilityModifier } from './rules'

export type EquipmentCategory = 'weapon'|'armor'|'gear'|'tools'|'mounts'
export type EquipmentItem = {
  id:string;name:string;englishName:string;category:EquipmentCategory;subcategory:string;
  cost:{quantity:number;unit:string};weight:number|null;bundleQuantity:number;description:string;properties:string[];
  weapon?:{kind:'simple'|'martial';rangeKind:'melee'|'ranged';damageDice:string;damageType:string;normalRange:number;longRange:number|null;thrownRange?:{normal:number;long:number}|null;versatileDice?:string|null};
  armor?:{armorId:string|null;baseAC:number;dexBonus:boolean;dexCap?:number|null;strength:number;stealthDisadvantage:boolean;shield:boolean};
  contents?:{id:string;quantity:number}[];speed?:string;capacity?:string;sourceCorrection?:string;
}
export const equipmentSource='SRD 5.1 · 2014 · CC BY 4.0; 5e-bits veri düzeni · MIT. Büyülü eşyalar ve ek kitaplar bu temel donanım arşivine dahil değildir.'
export const equipmentCategories:{id:EquipmentCategory;name:string}[]=[{id:'weapon',name:'Silahlar'},{id:'armor',name:'Zırh ve kalkan'},{id:'gear',name:'Maceracı donanımı'},{id:'tools',name:'Alet ve çalgılar'},{id:'mounts',name:'Binek ve araçlar'}]
export const equipmentCatalog:EquipmentItem[] = [
  {
    "id": "club",
    "name": "Sopa",
    "englishName": "Club",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 1,
      "unit": "sp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "light",
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d4",
      "damageType": "Ezici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "dagger",
    "name": "Hançer",
    "englishName": "Dagger",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "finesse",
      "light",
      "thrown",
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d4",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": {
        "normal": 20,
        "long": 60
      },
      "versatileDice": null
    }
  },
  {
    "id": "greatclub",
    "name": "Büyük sopa",
    "englishName": "Greatclub",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 2,
      "unit": "sp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "two-handed"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d8",
      "damageType": "Ezici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "handaxe",
    "name": "El baltası",
    "englishName": "Handaxe",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "light",
      "thrown",
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d6",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": {
        "normal": 20,
        "long": 60
      },
      "versatileDice": null
    }
  },
  {
    "id": "javelin",
    "name": "Cirit",
    "englishName": "Javelin",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "thrown",
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d6",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": {
        "normal": 30,
        "long": 120
      },
      "versatileDice": null
    }
  },
  {
    "id": "light-hammer",
    "name": "Hafif çekiç",
    "englishName": "Light hammer",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "light",
      "thrown",
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d4",
      "damageType": "Ezici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": {
        "normal": 20,
        "long": 60
      },
      "versatileDice": null
    }
  },
  {
    "id": "mace",
    "name": "Topuz",
    "englishName": "Mace",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d6",
      "damageType": "Ezici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "quarterstaff",
    "name": "Çeyrek asa",
    "englishName": "Quarterstaff",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 2,
      "unit": "sp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "versatile",
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d6",
      "damageType": "Ezici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": "1d8"
    }
  },
  {
    "id": "sickle",
    "name": "Orak",
    "englishName": "Sickle",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "light",
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d4",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "spear",
    "name": "Mızrak",
    "englishName": "Spear",
    "category": "weapon",
    "subcategory": "Basit · Yakın dövüş",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "thrown",
      "versatile",
      "monk"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "melee",
      "damageDice": "1d6",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": {
        "normal": 20,
        "long": 60
      },
      "versatileDice": "1d8"
    }
  },
  {
    "id": "crossbow-light",
    "name": "Hafif arbalet",
    "englishName": "Crossbow, light",
    "category": "weapon",
    "subcategory": "Basit · Menzilli",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "ammunition",
      "loading",
      "two-handed"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "ranged",
      "damageDice": "1d8",
      "damageType": "Delici",
      "normalRange": 80,
      "longRange": 320,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "dart",
    "name": "Dart",
    "englishName": "Dart",
    "category": "weapon",
    "subcategory": "Basit · Menzilli",
    "cost": {
      "quantity": 5,
      "unit": "cp"
    },
    "weight": 0.25,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "finesse",
      "thrown"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "ranged",
      "damageDice": "1d4",
      "damageType": "Delici",
      "normalRange": 20,
      "longRange": 60,
      "thrownRange": {
        "normal": 20,
        "long": 60
      },
      "versatileDice": null
    }
  },
  {
    "id": "shortbow",
    "name": "Kısa yay",
    "englishName": "Shortbow",
    "category": "weapon",
    "subcategory": "Basit · Menzilli",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "ammunition",
      "two-handed"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "ranged",
      "damageDice": "1d6",
      "damageType": "Delici",
      "normalRange": 80,
      "longRange": 320,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "sling",
    "name": "Sapan",
    "englishName": "Sling",
    "category": "weapon",
    "subcategory": "Basit · Menzilli",
    "cost": {
      "quantity": 1,
      "unit": "sp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "ammunition"
    ],
    "weapon": {
      "kind": "simple",
      "rangeKind": "ranged",
      "damageDice": "1d4",
      "damageType": "Ezici",
      "normalRange": 30,
      "longRange": 120,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "battleaxe",
    "name": "Savaş baltası",
    "englishName": "Battleaxe",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "versatile"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d8",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": "1d10"
    }
  },
  {
    "id": "flail",
    "name": "Döven",
    "englishName": "Flail",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d8",
      "damageType": "Ezici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "glaive",
    "name": "Uzun pala",
    "englishName": "Glaive",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 20,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "heavy",
      "reach",
      "two-handed"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d10",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "greataxe",
    "name": "Büyük balta",
    "englishName": "Greataxe",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 30,
      "unit": "gp"
    },
    "weight": 7,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "heavy",
      "two-handed"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d12",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "greatsword",
    "name": "Büyük kılıç",
    "englishName": "Greatsword",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "heavy",
      "two-handed"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "2d6",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "halberd",
    "name": "Teber",
    "englishName": "Halberd",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 20,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "heavy",
      "reach",
      "two-handed"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d10",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "lance",
    "name": "Atlı mızrağı",
    "englishName": "Lance",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "5 fit içindeki hedefe saldırırken dezavantaj verir. Binekte değilsen kullanmak için iki el gerekir.",
    "properties": [
      "reach",
      "special"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d12",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "longsword",
    "name": "Uzun kılıç",
    "englishName": "Longsword",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 15,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "versatile"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d8",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": "1d10"
    }
  },
  {
    "id": "maul",
    "name": "Büyük savaş çekici",
    "englishName": "Maul",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "heavy",
      "two-handed"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "2d6",
      "damageType": "Ezici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "morningstar",
    "name": "Çivili topuz",
    "englishName": "Morningstar",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 15,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d8",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "pike",
    "name": "Uzun mızrak",
    "englishName": "Pike",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 18,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "heavy",
      "reach",
      "two-handed"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d10",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "rapier",
    "name": "Meç",
    "englishName": "Rapier",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "finesse"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d8",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "scimitar",
    "name": "Pala",
    "englishName": "Scimitar",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "finesse",
      "light"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d6",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "shortsword",
    "name": "Kısa kılıç",
    "englishName": "Shortsword",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "finesse",
      "light",
      "monk"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d6",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "trident",
    "name": "Üç dişli mızrak",
    "englishName": "Trident",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "thrown",
      "versatile"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d6",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": {
        "normal": 20,
        "long": 60
      },
      "versatileDice": "1d8"
    }
  },
  {
    "id": "war-pick",
    "name": "Savaş kazması",
    "englishName": "War pick",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d8",
      "damageType": "Delici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "warhammer",
    "name": "Savaş çekici",
    "englishName": "Warhammer",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 15,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "versatile"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d8",
      "damageType": "Ezici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": "1d10"
    }
  },
  {
    "id": "whip",
    "name": "Kamçı",
    "englishName": "Whip",
    "category": "weapon",
    "subcategory": "Askerî · Yakın dövüş",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "finesse",
      "reach"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "melee",
      "damageDice": "1d4",
      "damageType": "Kesici",
      "normalRange": 5,
      "longRange": null,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "blowgun",
    "name": "Üfleme borusu",
    "englishName": "Blowgun",
    "category": "weapon",
    "subcategory": "Askerî · Menzilli",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "ammunition",
      "loading"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "ranged",
      "damageDice": "1",
      "damageType": "Delici",
      "normalRange": 25,
      "longRange": 100,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "crossbow-hand",
    "name": "El arbaleti",
    "englishName": "Crossbow, hand",
    "category": "weapon",
    "subcategory": "Askerî · Menzilli",
    "cost": {
      "quantity": 75,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "ammunition",
      "light",
      "loading"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "ranged",
      "damageDice": "1d6",
      "damageType": "Delici",
      "normalRange": 30,
      "longRange": 120,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "crossbow-heavy",
    "name": "Ağır arbalet",
    "englishName": "Crossbow, heavy",
    "category": "weapon",
    "subcategory": "Askerî · Menzilli",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 18,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "ammunition",
      "heavy",
      "loading",
      "two-handed"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "ranged",
      "damageDice": "1d10",
      "damageType": "Delici",
      "normalRange": 100,
      "longRange": 400,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "longbow",
    "name": "Uzun yay",
    "englishName": "Longbow",
    "category": "weapon",
    "subcategory": "Askerî · Menzilli",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": [
      "ammunition",
      "heavy",
      "two-handed"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "ranged",
      "damageDice": "1d8",
      "damageType": "Delici",
      "normalRange": 150,
      "longRange": 600,
      "thrownRange": null,
      "versatileDice": null
    }
  },
  {
    "id": "net",
    "name": "Ağ",
    "englishName": "Net",
    "category": "weapon",
    "subcategory": "Askerî · Menzilli",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "Büyük veya daha küçük bir yaratığı isabette kısıtlar; biçimsiz veya Devasa ve daha büyük yaratıklarda etkisizdir. Kurtarmak bir eylem ve DC 10 Kuvvet kontrolü veya ağa (ZS 10) 5 kesici hasar gerektirir. Ağla saldırılan eylem/bonus eylem/tepkide, normal saldırı sayın ne olursa olsun tek saldırı yapılır. Hasar vermez.",
    "properties": [
      "thrown",
      "special"
    ],
    "weapon": {
      "kind": "martial",
      "rangeKind": "ranged",
      "damageDice": "—",
      "damageType": "Özel",
      "normalRange": 5,
      "longRange": 15,
      "thrownRange": {
        "normal": 5,
        "long": 15
      },
      "versatileDice": null
    }
  },
  {
    "id": "padded-armor",
    "name": "Dolgulu zırh",
    "englishName": "Padded Armor",
    "category": "armor",
    "subcategory": "Hafif zırh",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 8,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "padded",
      "baseAC": 11,
      "dexBonus": true,
      "dexCap": null,
      "strength": 0,
      "stealthDisadvantage": true,
      "shield": false
    }
  },
  {
    "id": "leather-armor",
    "name": "Deri zırh",
    "englishName": "Leather Armor",
    "category": "armor",
    "subcategory": "Hafif zırh",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "leather",
      "baseAC": 11,
      "dexBonus": true,
      "dexCap": null,
      "strength": 0,
      "stealthDisadvantage": false,
      "shield": false
    }
  },
  {
    "id": "studded-leather-armor",
    "name": "Çivili deri zırh",
    "englishName": "Studded Leather Armor",
    "category": "armor",
    "subcategory": "Hafif zırh",
    "cost": {
      "quantity": 45,
      "unit": "gp"
    },
    "weight": 13,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "studded-leather",
      "baseAC": 12,
      "dexBonus": true,
      "dexCap": null,
      "strength": 0,
      "stealthDisadvantage": false,
      "shield": false
    }
  },
  {
    "id": "hide-armor",
    "name": "Post zırh",
    "englishName": "Hide Armor",
    "category": "armor",
    "subcategory": "Orta zırh",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 12,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "hide",
      "baseAC": 12,
      "dexBonus": true,
      "dexCap": 2,
      "strength": 0,
      "stealthDisadvantage": false,
      "shield": false
    }
  },
  {
    "id": "chain-shirt",
    "name": "Zincir gömlek",
    "englishName": "Chain Shirt",
    "category": "armor",
    "subcategory": "Orta zırh",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 20,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "chain-shirt",
      "baseAC": 13,
      "dexBonus": true,
      "dexCap": 2,
      "strength": 0,
      "stealthDisadvantage": false,
      "shield": false
    }
  },
  {
    "id": "scale-mail",
    "name": "Pul zırh",
    "englishName": "Scale Mail",
    "category": "armor",
    "subcategory": "Orta zırh",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 45,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "scale-mail",
      "baseAC": 14,
      "dexBonus": true,
      "dexCap": 2,
      "strength": 0,
      "stealthDisadvantage": true,
      "shield": false
    }
  },
  {
    "id": "breastplate",
    "name": "Göğüslük",
    "englishName": "Breastplate",
    "category": "armor",
    "subcategory": "Orta zırh",
    "cost": {
      "quantity": 400,
      "unit": "gp"
    },
    "weight": 20,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "breastplate",
      "baseAC": 14,
      "dexBonus": true,
      "dexCap": 2,
      "strength": 0,
      "stealthDisadvantage": false,
      "shield": false
    }
  },
  {
    "id": "half-plate-armor",
    "name": "Yarım plaka zırh",
    "englishName": "Half Plate Armor",
    "category": "armor",
    "subcategory": "Orta zırh",
    "cost": {
      "quantity": 750,
      "unit": "gp"
    },
    "weight": 40,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "half-plate",
      "baseAC": 15,
      "dexBonus": true,
      "dexCap": 2,
      "strength": 0,
      "stealthDisadvantage": true,
      "shield": false
    }
  },
  {
    "id": "ring-mail",
    "name": "Halka zırh",
    "englishName": "Ring Mail",
    "category": "armor",
    "subcategory": "Ağır zırh",
    "cost": {
      "quantity": 30,
      "unit": "gp"
    },
    "weight": 40,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "ring-mail",
      "baseAC": 14,
      "dexBonus": false,
      "dexCap": null,
      "strength": 0,
      "stealthDisadvantage": true,
      "shield": false
    }
  },
  {
    "id": "chain-mail",
    "name": "Zincir zırh",
    "englishName": "Chain Mail",
    "category": "armor",
    "subcategory": "Ağır zırh",
    "cost": {
      "quantity": 75,
      "unit": "gp"
    },
    "weight": 55,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "chain-mail",
      "baseAC": 16,
      "dexBonus": false,
      "dexCap": null,
      "strength": 13,
      "stealthDisadvantage": true,
      "shield": false
    }
  },
  {
    "id": "splint-armor",
    "name": "Şerit zırh",
    "englishName": "Splint Armor",
    "category": "armor",
    "subcategory": "Ağır zırh",
    "cost": {
      "quantity": 200,
      "unit": "gp"
    },
    "weight": 60,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "splint",
      "baseAC": 17,
      "dexBonus": false,
      "dexCap": null,
      "strength": 15,
      "stealthDisadvantage": true,
      "shield": false
    }
  },
  {
    "id": "plate-armor",
    "name": "Tam plaka zırh",
    "englishName": "Plate Armor",
    "category": "armor",
    "subcategory": "Ağır zırh",
    "cost": {
      "quantity": 1500,
      "unit": "gp"
    },
    "weight": 65,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": "plate",
      "baseAC": 18,
      "dexBonus": false,
      "dexCap": null,
      "strength": 15,
      "stealthDisadvantage": true,
      "shield": false
    }
  },
  {
    "id": "shield",
    "name": "Kalkan",
    "englishName": "Shield",
    "category": "armor",
    "subcategory": "Kalkan",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "Kuşanmak envantere eklemekten ayrıdır. Zırh veya kalkan yetkinliği olmadan kullanmanın kontrol, saldırı ve büyü yapma sonuçlarını DM ile doğrula.",
    "properties": [],
    "armor": {
      "armorId": null,
      "baseAC": 2,
      "dexBonus": false,
      "dexCap": null,
      "strength": 0,
      "stealthDisadvantage": false,
      "shield": true
    }
  },
  {
    "id": "abacus",
    "name": "Abaküs",
    "englishName": "Abacus",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "acid-vial",
    "name": "Asit şişesi",
    "englishName": "Acid (vial)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Bir eylemle 5 fit içindeki hedefe dökebilir veya 20 fite kadar fırlatabilirsin. Doğaçlama menzilli silah saldırısı isabet ederse 2d6 asit hasarı verir; şişe harcanır.",
    "properties": []
  },
  {
    "id": "alchemists-fire-flask",
    "name": "Simyacı ateşi şişesi",
    "englishName": "Alchemist's fire (flask)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Bir eylemle 20 fite kadar doğaçlama menzilli silah olarak atılır. İsabette hedef her turunun başında 1d4 ateş hasarı alır; ateşi söndürmek için bir eylemle DC 10 Çeviklik kontrolü yapabilir.",
    "properties": []
  },
  {
    "id": "alms-box",
    "name": "Sadaka kutusu",
    "englishName": "Alms box",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 0,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Dinî törenlerde kullanılan eşya; tek başına sınıf özelliği veya büyü kullanımı kazandırmaz.",
    "properties": []
  },
  {
    "id": "arrow",
    "name": "Ok",
    "englishName": "Arrow",
    "category": "gear",
    "subcategory": "Mühimmat",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 20,
    "description": "",
    "properties": []
  },
  {
    "id": "block-of-incense",
    "name": "Tütsü kalıbı",
    "englishName": "Block of incense",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 0,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Dinî törenlerde kullanılan eşya; tek başına sınıf özelliği veya büyü kullanımı kazandırmaz.",
    "properties": []
  },
  {
    "id": "blowgun-needle",
    "name": "Üfleme iğnesi",
    "englishName": "Blowgun needle",
    "category": "gear",
    "subcategory": "Mühimmat",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 50,
    "description": "",
    "properties": []
  },
  {
    "id": "censer",
    "name": "Buhurdan",
    "englishName": "Censer",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 0,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Dinî törenlerde kullanılan eşya; tek başına sınıf özelliği veya büyü kullanımı kazandırmaz.",
    "properties": []
  },
  {
    "id": "crossbow-bolt",
    "name": "Arbalet oku",
    "englishName": "Crossbow bolt",
    "category": "gear",
    "subcategory": "Mühimmat",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 1.5,
    "bundleQuantity": 20,
    "description": "",
    "properties": []
  },
  {
    "id": "sling-bullet",
    "name": "Sapan mermisi",
    "englishName": "Sling bullet",
    "category": "gear",
    "subcategory": "Mühimmat",
    "cost": {
      "quantity": 4,
      "unit": "cp"
    },
    "weight": 1.5,
    "bundleQuantity": 20,
    "description": "",
    "properties": []
  },
  {
    "id": "amulet",
    "name": "Muska",
    "englishName": "Amulet",
    "category": "gear",
    "subcategory": "Kutsal simgeler",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Rahip veya Paladin büyüleri için kutsal simge. Elde tutulmalı, görünür biçimde takılmalı veya kalkanda taşınmalıdır; ücreti belirtilmiş/harcanan malzeme ayrıca gerekir.",
    "properties": []
  },
  {
    "id": "antitoxin-vial",
    "name": "Panzehir şişesi",
    "englishName": "Antitoxin (vial)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "İçen yaratık 1 saat boyunca zehre karşı kurtulma atışlarında avantaj kazanır. Ölümsüz ve yapay yaratıkları etkilemez.",
    "properties": []
  },
  {
    "id": "crystal",
    "name": "Büyü kristali",
    "englishName": "Crystal",
    "category": "gear",
    "subcategory": "Gizemli odaklar",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Efsuncu, Ant Büyücüsü veya Büyücü büyülerinde uygun bir gizemli odak olarak kullanılabilir. Ücreti belirtilmiş veya harcanan malzemelerin yerini tutmaz.",
    "properties": []
  },
  {
    "id": "orb",
    "name": "Büyü küresi",
    "englishName": "Orb",
    "category": "gear",
    "subcategory": "Gizemli odaklar",
    "cost": {
      "quantity": 20,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "Efsuncu, Ant Büyücüsü veya Büyücü büyülerinde uygun bir gizemli odak olarak kullanılabilir. Ücreti belirtilmiş veya harcanan malzemelerin yerini tutmaz.",
    "properties": []
  },
  {
    "id": "rod",
    "name": "Büyü çubuğu",
    "englishName": "Rod",
    "category": "gear",
    "subcategory": "Gizemli odaklar",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Efsuncu, Ant Büyücüsü veya Büyücü büyülerinde uygun bir gizemli odak olarak kullanılabilir. Ücreti belirtilmiş veya harcanan malzemelerin yerini tutmaz.",
    "properties": []
  },
  {
    "id": "staff",
    "name": "Büyü asası",
    "englishName": "Staff",
    "category": "gear",
    "subcategory": "Gizemli odaklar",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "Efsuncu, Ant Büyücüsü veya Büyücü büyülerinde uygun bir gizemli odak olarak kullanılabilir. Ücreti belirtilmiş veya harcanan malzemelerin yerini tutmaz. Bu katalog girdisi bir büyü odağıdır; saldırı için ayrı Çeyrek Asa kaydını seç.",
    "properties": []
  },
  {
    "id": "wand",
    "name": "Büyü değneği",
    "englishName": "Wand",
    "category": "gear",
    "subcategory": "Gizemli odaklar",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Efsuncu, Ant Büyücüsü veya Büyücü büyülerinde uygun bir gizemli odak olarak kullanılabilir. Ücreti belirtilmiş veya harcanan malzemelerin yerini tutmaz.",
    "properties": []
  },
  {
    "id": "backpack",
    "name": "Sırt çantası",
    "englishName": "Backpack",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "ball-bearings-bag-of-1000",
    "name": "Metal bilye kesesi · 1.000 adet",
    "englishName": "Ball bearings (bag of 1,000)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Bir eylemle düz zeminde 10 fitlik kareyi kaplar. Alandan geçen yaratık DC 10 Çeviklik kurtarışını başaramazsa yere düşer. Yarı hızla geçerse kurtarış gerekmez.",
    "properties": []
  },
  {
    "id": "barrel",
    "name": "Fıçı",
    "englishName": "Barrel",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 70,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "basket",
    "name": "Sepet",
    "englishName": "Basket",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 4,
      "unit": "sp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "bedroll",
    "name": "Yatak örtüsü",
    "englishName": "Bedroll",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 7,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "bell",
    "name": "Çan",
    "englishName": "Bell",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "blanket",
    "name": "Battaniye",
    "englishName": "Blanket",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "block-and-tackle",
    "name": "Palanga",
    "englishName": "Block and tackle",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Makara ve halat düzeni; normalde kaldırabileceğin ağırlığın dört katına kadarını kaldırmana yardım eder.",
    "properties": []
  },
  {
    "id": "book",
    "name": "Kitap",
    "englishName": "Book",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Bilgi, öykü veya çizimler içeren sıradan bir kitap. Büyücü büyülerini kaydetmek için ayrı Büyü Kitabı kullanılır.",
    "properties": []
  },
  {
    "id": "bottle-glass",
    "name": "Cam şişe",
    "englishName": "Bottle, glass",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "bucket",
    "name": "Kova",
    "englishName": "Bucket",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "cp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "caltrops",
    "name": "Çivili engel kesesi · 20 adet",
    "englishName": "Caltrops",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Bir kese 20 çivili engel içerir; bir eylemle 5 fitlik kareye yayılır. Giren yaratık DC 15 Çeviklik kurtarışını başaramazsa hareketi durur ve 1 delici hasar alır. En az 1 can iyileşene kadar yürüme hızı 10 fit azalır. Yarı hızla geçmek kurtarışı gerektirmez.",
    "properties": [],
    "sourceCorrection": "SRD 5.1: 20 adetlik kesenin bedeli 1 altın; kaynak veri tek adet bedelini kese ağırlığıyla karıştırıyordu."
  },
  {
    "id": "candle",
    "name": "Mum",
    "englishName": "Candle",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "1 saat yanar; 5 fit parlak, bunun ötesinde 5 fit loş ışık verir.",
    "properties": []
  },
  {
    "id": "case-crossbow-bolt",
    "name": "Arbalet oku kutusu",
    "englishName": "Case, crossbow bolt",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "20 arbalet oku alabilen mahfaza; oklar ayrıca edinilir.",
    "properties": []
  },
  {
    "id": "case-map-or-scroll",
    "name": "Harita ve parşömen mahfazası",
    "englishName": "Case, map or scroll",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "10 kâğıt veya 5 parşömen yaprağını rulo halinde koruyabilir.",
    "properties": []
  },
  {
    "id": "chain-10-feet",
    "name": "Zincir · 10 fit",
    "englishName": "Chain (10 feet)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "10 fitlik zincirin 10 canı vardır; DC 20 Kuvvet kontrolüyle kırılabilir.",
    "properties": []
  },
  {
    "id": "chalk-1-piece",
    "name": "Tebeşir · 1 parça",
    "englishName": "Chalk (1 piece)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "chest",
    "name": "Sandık",
    "englishName": "Chest",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 25,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "clothes-common",
    "name": "Gündelik giysiler",
    "englishName": "Clothes, common",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "clothes-costume",
    "name": "Gösteri kostümü",
    "englishName": "Clothes, costume",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "clothes-fine",
    "name": "Şık giysiler",
    "englishName": "Clothes, fine",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 15,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "clothes-travelers",
    "name": "Yolcu giysileri",
    "englishName": "Clothes, traveler's",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "component-pouch",
    "name": "Büyü bileşeni kesesi",
    "englishName": "Component pouch",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Büyülerin parasal değer belirtilmeyen ve harcanmayan maddi bileşenlerini taşır. Ücreti belirtilmiş veya harcanan malzeme ayrıca edinilir; her büyünün Malzeme alanını kontrol et.",
    "properties": []
  },
  {
    "id": "crowbar",
    "name": "Levye",
    "englishName": "Crowbar",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Kaldıraç olarak kullanılabildiği Kuvvet kontrollerine avantaj verir.",
    "properties": []
  },
  {
    "id": "sprig-of-mistletoe",
    "name": "Ökseotu dalı",
    "englishName": "Sprig of mistletoe",
    "category": "gear",
    "subcategory": "Doğa odakları",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Druid büyülerinde doğa odağı olarak kullanılabilir; ücreti belirtilmiş veya harcanan malzemeleri karşılamaz.",
    "properties": []
  },
  {
    "id": "totem",
    "name": "Totem",
    "englishName": "Totem",
    "category": "gear",
    "subcategory": "Doğa odakları",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Druid büyülerinde doğa odağı olarak kullanılabilir; ücreti belirtilmiş veya harcanan malzemeleri karşılamaz.",
    "properties": []
  },
  {
    "id": "wooden-staff",
    "name": "Ahşap doğa asası",
    "englishName": "Wooden staff",
    "category": "gear",
    "subcategory": "Doğa odakları",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "Druid büyülerinde doğa odağı olarak kullanılabilir; ücreti belirtilmiş veya harcanan malzemeleri karşılamaz.",
    "properties": []
  },
  {
    "id": "yew-wand",
    "name": "Porsuk ağacı değneği",
    "englishName": "Yew wand",
    "category": "gear",
    "subcategory": "Doğa odakları",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Druid büyülerinde doğa odağı olarak kullanılabilir; ücreti belirtilmiş veya harcanan malzemeleri karşılamaz.",
    "properties": []
  },
  {
    "id": "emblem",
    "name": "Kutsal arma",
    "englishName": "Emblem",
    "category": "gear",
    "subcategory": "Kutsal simgeler",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Rahip veya Paladin büyüleri için kutsal simge. Elde tutulmalı, görünür biçimde takılmalı veya kalkanda taşınmalıdır; ücreti belirtilmiş/harcanan malzeme ayrıca gerekir.",
    "properties": []
  },
  {
    "id": "fishing-tackle",
    "name": "Balıkçılık takımı",
    "englishName": "Fishing tackle",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "Olta, ip, kanca ve yem takımı. Balık tutmanın sonucunu ortam ve DM belirler.",
    "properties": []
  },
  {
    "id": "flask-or-tankard",
    "name": "Matara veya kupa",
    "englishName": "Flask or tankard",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "cp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "grappling-hook",
    "name": "Tırmanma kancası",
    "englishName": "Grappling hook",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "hammer",
    "name": "Çekiç",
    "englishName": "Hammer",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "hammer-sledge",
    "name": "Balyoz",
    "englishName": "Hammer, sledge",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "holy-water-flask",
    "name": "Kutsal su şişesi",
    "englishName": "Holy water (flask)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Bir eylemle 5 fit içindeki hedefe dökülür veya 20 fite kadar doğaçlama menzilli saldırıyla atılır. Bir iblis veya ölümsüze isabet ederse 2d6 ışık hasarı verir. Şişe harcanır; kutsal su üretimi için Rahip veya Paladin 1 saatlik ritüel, 25 altın gümüş tozu ve 1. derece yuva harcar.",
    "properties": []
  },
  {
    "id": "hourglass",
    "name": "Kum saati",
    "englishName": "Hourglass",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "hunting-trap",
    "name": "Av kapanı",
    "englishName": "Hunting trap",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 25,
    "bundleQuantity": 1,
    "description": "Bir eylemle kurulur. Tetikleyen yaratık DC 13 Çeviklik kurtarışını başaramazsa 1d4 delici hasar alır ve tuzak zincirinin uzunluğuyla sınırlanır. Bir eylemle DC 13 Kuvvet kontrolüyle açılır; başarısız deneme 1 delici hasar verir.",
    "properties": []
  },
  {
    "id": "ink-1-ounce-bottle",
    "name": "Mürekkep · 1 ons şişe",
    "englishName": "Ink (1 ounce bottle)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "ink-pen",
    "name": "Divit",
    "englishName": "Ink pen",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "jug-or-pitcher",
    "name": "Testi veya sürahi",
    "englishName": "Jug or pitcher",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "cp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "climbers-kit",
    "name": "Tırmanış takımı",
    "englishName": "Climber's Kit",
    "category": "gear",
    "subcategory": "Takımlar",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 12,
    "bundleQuantity": 1,
    "description": "Çiviler, eldivenler ve emniyet kemeri içerir. Bir eylemle kendini sabitleyebilirsin; bu noktadan 25 fitten fazla düşemezsin, ancak bağı bırakmadan 25 fitten fazla uzaklaşamazsın.",
    "properties": []
  },
  {
    "id": "disguise-kit",
    "name": "Kılık değiştirme takımı",
    "englishName": "Disguise Kit",
    "category": "gear",
    "subcategory": "Takımlar",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "Kozmetik, boya ve küçük aksesuarlarla görünüşü değiştirir. Takımda yetkinlik uygun kontrole yetkinlik bonusunu ekler; büyülü kılık değiştirme değildir.",
    "properties": []
  },
  {
    "id": "forgery-kit",
    "name": "Sahtecilik takımı",
    "englishName": "Forgery Kit",
    "category": "gear",
    "subcategory": "Takımlar",
    "cost": {
      "quantity": 15,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Belge sahteciliği için kâğıt, mürekkep ve araçlar. Yetkinlik, sahte belge üretme kontrollerine uygulanabilir.",
    "properties": []
  },
  {
    "id": "herbalism-kit",
    "name": "Şifalı bitki takımı",
    "englishName": "Herbalism Kit",
    "category": "gear",
    "subcategory": "Takımlar",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "Bitkileri tanıma, şifa malzemesi ve bazı panzehir/iksir üretiminde kullanılan takım. Uygun kontrolde araç yetkinliği uygulanır; üretimin para ve zaman koşulları ayrıca belirlenir.",
    "properties": []
  },
  {
    "id": "healers-kit",
    "name": "Şifacı takımı",
    "englishName": "Healer's Kit",
    "category": "gear",
    "subcategory": "Takımlar",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "10 kullanımlı bandaj, merhem ve atel takımı. Bir eylem ve bir kullanım harcayarak 0 candaki yaratığı Tıp kontrolü olmadan stabilize eder; can kazandırmaz.",
    "properties": []
  },
  {
    "id": "mess-kit",
    "name": "Yemek takımı",
    "englishName": "Mess Kit",
    "category": "gear",
    "subcategory": "Takımlar",
    "cost": {
      "quantity": 2,
      "unit": "sp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Yemek hazırlamak ve yemek için kap, çatal-bıçak ve küçük tava takımı.",
    "properties": []
  },
  {
    "id": "poisoners-kit",
    "name": "Zehirci takımı",
    "englishName": "Poisoner's Kit",
    "category": "gear",
    "subcategory": "Takımlar",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Zehir hazırlama ve uygulama için şişe ve araçlar. Takımda yetkinlik uygun zehir kontrollerine eklenir; hazır zehir ayrıca edinilir.",
    "properties": []
  },
  {
    "id": "ladder-10-foot",
    "name": "Merdiven · 10 fit",
    "englishName": "Ladder (10-foot)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "sp"
    },
    "weight": 25,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "lamp",
    "name": "Kandil",
    "englishName": "Lamp",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Bir şişe yağla 6 saat yanar; 15 fit parlak, bunun ötesinde 30 fit loş ışık verir.",
    "properties": []
  },
  {
    "id": "lantern-bullseye",
    "name": "Odaklı fener",
    "englishName": "Lantern, bullseye",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Bir şişe yağla 6 saat yanar; 60 fitlik konide parlak, bunun ötesinde 60 fit loş ışık verir.",
    "properties": []
  },
  {
    "id": "lantern-hooded",
    "name": "Kapaklı fener",
    "englishName": "Lantern, hooded",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Bir şişe yağla 6 saat yanar; 30 fit parlak ve ardından 30 fit loş ışık. Bir eylemle kapağı kapatıp yalnız 5 fit loş ışığa düşürebilirsin.",
    "properties": []
  },
  {
    "id": "little-bag-of-sand",
    "name": "Küçük kum kesesi",
    "englishName": "Little bag of sand",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 0,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Mürekkebi kurutmak ve yazı işi için küçük kum kesesi.",
    "properties": []
  },
  {
    "id": "lock",
    "name": "Kilit",
    "englishName": "Lock",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Anahtarsız açmak için hırsız aletlerinde yetkin bir yaratık DC 15 Çeviklik kontrolü yapabilir. Daha iyi kilitlerin zorluğunu DM belirler.",
    "properties": []
  },
  {
    "id": "magnifying-glass",
    "name": "Büyüteç",
    "englishName": "Magnifying glass",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 100,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Yakından incelemeye yardım eder. Yeterince parlak güneş, tutuşturulabilir malzeme ve yaklaşık 5 dakika varsa ateş yakabilir; küçük ayrıntıları incelemeye dayanan uygun kontrollere avantaj verir.",
    "properties": []
  },
  {
    "id": "manacles",
    "name": "Kelepçe",
    "englishName": "Manacles",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "Küçük veya Orta yaratığı bağlar. Kaçmak DC 20 Çeviklik; kırmak DC 20 Kuvvet kontrolüdür. Anahtarsız açmak için hırsız aletlerinde yetkinlik ve DC 15 Çeviklik gerekir; 15 canı vardır.",
    "properties": []
  },
  {
    "id": "mirror-steel",
    "name": "Çelik ayna",
    "englishName": "Mirror, steel",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 0.5,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "oil-flask",
    "name": "Yağ şişesi",
    "englishName": "Oil (flask)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "sp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Bir eylemle 5 fite dökebilir veya 20 fite fırlatabilirsin. Doğaçlama menzilli isabette hedef 1 dakika yağlı kalır; bu sürede ateş hasarı alırsa ek 5 ateş hasarı alır. Düz zeminde 5 fitlik kareye dökülüp yakılırsa 2 tur yanar; giren veya turunu orada bitiren yaratığa tur başına en çok bir kez 5 ateş hasarı verir.",
    "properties": []
  },
  {
    "id": "paper-one-sheet",
    "name": "Kâğıt · 1 yaprak",
    "englishName": "Paper (one sheet)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "sp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "parchment-one-sheet",
    "name": "Parşömen · 1 yaprak",
    "englishName": "Parchment (one sheet)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "sp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "perfume-vial",
    "name": "Parfüm şişesi",
    "englishName": "Perfume (vial)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "pick-miners",
    "name": "Madenci kazması",
    "englishName": "Pick, miner's",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "piton",
    "name": "Kaya çivisi",
    "englishName": "Piton",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "cp"
    },
    "weight": 0.25,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "poison-basic-vial",
    "name": "Basit zehir şişesi",
    "englishName": "Poison, basic (vial)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 100,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Bir eylemle bir kesici/delici silahı veya üç mühimmatı kaplar. 1 dakika etkilidir. İsabet alan yaratık DC 10 Dayanıklılık kurtarışını başaramazsa ek 1d4 zehir hasarı alır.",
    "properties": []
  },
  {
    "id": "pole-10-foot",
    "name": "Sırık · 10 fit",
    "englishName": "Pole (10-foot)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "cp"
    },
    "weight": 7,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "pot-iron",
    "name": "Demir tencere",
    "englishName": "Pot, iron",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "pouch",
    "name": "Kese",
    "englishName": "Pouch",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Kemer kesesi; yaklaşık 6 lb veya 1/5 fitküp malzeme taşır. Para eklemek veya harcamak ayrıca yapılır.",
    "properties": []
  },
  {
    "id": "quiver",
    "name": "Sadak",
    "englishName": "Quiver",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "20 ok alır; oklar ayrıca edinilir.",
    "properties": []
  },
  {
    "id": "ram-portable",
    "name": "Taşınabilir koçbaşı",
    "englishName": "Ram, portable",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 4,
      "unit": "gp"
    },
    "weight": 35,
    "bundleQuantity": 1,
    "description": "Kapı kırarken Kuvvet kontrolüne +4. İkinci bir yaratık yardım ederse ayrıca avantaj sağlar.",
    "properties": []
  },
  {
    "id": "rations-1-day",
    "name": "Kumanya · 1 gün",
    "englishName": "Rations (1 day)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Bir günlük kuru yiyecek; su ayrıca gerekir. Bir satır bir günlük kumanyadır.",
    "properties": []
  },
  {
    "id": "reliquary",
    "name": "Kutsal emanet kutusu",
    "englishName": "Reliquary",
    "category": "gear",
    "subcategory": "Kutsal simgeler",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Rahip veya Paladin büyüleri için kutsal simge. Elde tutulmalı, görünür biçimde takılmalı veya kalkanda taşınmalıdır; ücreti belirtilmiş/harcanan malzeme ayrıca gerekir.",
    "properties": []
  },
  {
    "id": "robes",
    "name": "Cüppe",
    "englishName": "Robes",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 4,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "rope-hempen-50-feet",
    "name": "Kenevir halat · 50 fit",
    "englishName": "Rope, hempen (50 feet)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "50 fit uzunluğunda, 2 cana sahip halat; DC 17 Kuvvet kontrolüyle koparılabilir.",
    "properties": []
  },
  {
    "id": "rope-silk-50-feet",
    "name": "İpek halat · 50 fit",
    "englishName": "Rope, silk (50 feet)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "50 fit uzunluğunda hafif halat; 2 can, koparmak için DC 17 Kuvvet kontrolü.",
    "properties": []
  },
  {
    "id": "sack",
    "name": "Çuval",
    "englishName": "Sack",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "cp"
    },
    "weight": 0.5,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "scale-merchants",
    "name": "Tüccar terazisi",
    "englishName": "Scale, merchant's",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "Küçük ağırlıkları ve ticaret mallarını tartmak için terazi ve ağırlıklar.",
    "properties": []
  },
  {
    "id": "sealing-wax",
    "name": "Mühür mumu",
    "englishName": "Sealing wax",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "shovel",
    "name": "Kürek",
    "englishName": "Shovel",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "signal-whistle",
    "name": "İşaret düdüğü",
    "englishName": "Signal whistle",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "signet-ring",
    "name": "Mühür yüzüğü",
    "englishName": "Signet ring",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "small-knife",
    "name": "Küçük bıçak",
    "englishName": "Small knife",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 0,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Yazı, zanaat ve küçük işler için bıçak. Silah hasarı ve yetkinliği kendiliğinden Hançer ile aynı sayılmaz.",
    "properties": []
  },
  {
    "id": "soap",
    "name": "Sabun",
    "englishName": "Soap",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "spellbook",
    "name": "Büyü kitabı",
    "englishName": "Spellbook",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "100 sayfalık büyü kitabı. Büyücünün kaydettiği büyülerin taşıyıcısıdır; boş kitabı almak yeni büyü öğretmez. Kitaba kopyalama para ve zamanını ayrıca takip et.",
    "properties": []
  },
  {
    "id": "spike-iron",
    "name": "Demir çivi",
    "englishName": "Spike, iron",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "sp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "spyglass",
    "name": "Dürbün",
    "englishName": "Spyglass",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1000,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Uzak nesneleri yaklaşık iki kat büyütür; büyülü görme veya otomatik Algı başarısı vermez.",
    "properties": []
  },
  {
    "id": "string-10-feet",
    "name": "İp · 10 fit",
    "englishName": "String (10 feet)",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 0,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "10 fitlik ince ip; ağır yük taşıyan halat değildir.",
    "properties": []
  },
  {
    "id": "tent-two-person",
    "name": "İki kişilik çadır",
    "englishName": "Tent, two-person",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 20,
    "bundleQuantity": 1,
    "description": "İki kişiyi barındıran taşınabilir kamp çadırı.",
    "properties": []
  },
  {
    "id": "tinderbox",
    "name": "Çakmak takımı",
    "englishName": "Tinderbox",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Çakmaktaşı, çelik ve kav. Meşale gibi hazır bir yakıtı tutuşturmak bir eylem; sıradan bir ateş yakmak genellikle 1 dakika sürer.",
    "properties": []
  },
  {
    "id": "torch",
    "name": "Meşale",
    "englishName": "Torch",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "cp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "1 saat yanar; 20 fit parlak ve bunun ötesinde 20 fit loş ışık. Yanan meşaleyle yakın dövüş isabeti 1 ateş hasarı verir.",
    "properties": []
  },
  {
    "id": "vestments",
    "name": "Dinî giysiler",
    "englishName": "Vestments",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 0,
      "unit": "cp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Dinî törenlerde kullanılan eşya; tek başına sınıf özelliği veya büyü kullanımı kazandırmaz.",
    "properties": []
  },
  {
    "id": "vial",
    "name": "Küçük şişe",
    "englishName": "Vial",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "waterskin",
    "name": "Su tulumu",
    "englishName": "Waterskin",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 2,
      "unit": "sp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Dolu ağırlığı 5 lb; yaklaşık 4 pint su alır. Su tüketimini ayrıca azalt.",
    "properties": []
  },
  {
    "id": "whetstone",
    "name": "Bileği taşı",
    "englishName": "Whetstone",
    "category": "gear",
    "subcategory": "Gündelik donanım",
    "cost": {
      "quantity": 1,
      "unit": "cp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "burglars-pack",
    "name": "Hırsız çantası",
    "englishName": "Burglar's Pack",
    "category": "gear",
    "subcategory": "Hazır çantalar",
    "cost": {
      "quantity": 16,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Hazır çanta açıldığında aşağıdaki içindekiler ayrı satırlar halinde envantere eklenir; çanta ağırlığı ikinci kez sayılmaz.",
    "properties": [],
    "contents": [
      {
        "id": "backpack",
        "quantity": 1
      },
      {
        "id": "ball-bearings-bag-of-1000",
        "quantity": 1
      },
      {
        "id": "string-10-feet",
        "quantity": 1
      },
      {
        "id": "bell",
        "quantity": 1
      },
      {
        "id": "candle",
        "quantity": 5
      },
      {
        "id": "crowbar",
        "quantity": 1
      },
      {
        "id": "hammer",
        "quantity": 1
      },
      {
        "id": "piton",
        "quantity": 10
      },
      {
        "id": "lantern-hooded",
        "quantity": 1
      },
      {
        "id": "oil-flask",
        "quantity": 2
      },
      {
        "id": "rations-1-day",
        "quantity": 5
      },
      {
        "id": "tinderbox",
        "quantity": 1
      },
      {
        "id": "waterskin",
        "quantity": 1
      },
      {
        "id": "rope-hempen-50-feet",
        "quantity": 1
      }
    ]
  },
  {
    "id": "diplomats-pack",
    "name": "Diplomat çantası",
    "englishName": "Diplomat's Pack",
    "category": "gear",
    "subcategory": "Hazır çantalar",
    "cost": {
      "quantity": 39,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Hazır çanta açıldığında aşağıdaki içindekiler ayrı satırlar halinde envantere eklenir; çanta ağırlığı ikinci kez sayılmaz.",
    "properties": [],
    "contents": [
      {
        "id": "chest",
        "quantity": 1
      },
      {
        "id": "case-map-or-scroll",
        "quantity": 2
      },
      {
        "id": "clothes-fine",
        "quantity": 1
      },
      {
        "id": "ink-1-ounce-bottle",
        "quantity": 1
      },
      {
        "id": "ink-pen",
        "quantity": 1
      },
      {
        "id": "lamp",
        "quantity": 1
      },
      {
        "id": "oil-flask",
        "quantity": 2
      },
      {
        "id": "paper-one-sheet",
        "quantity": 5
      },
      {
        "id": "perfume-vial",
        "quantity": 1
      },
      {
        "id": "sealing-wax",
        "quantity": 1
      },
      {
        "id": "soap",
        "quantity": 1
      }
    ]
  },
  {
    "id": "dungeoneers-pack",
    "name": "Zindan gezgini çantası",
    "englishName": "Dungeoneer's Pack",
    "category": "gear",
    "subcategory": "Hazır çantalar",
    "cost": {
      "quantity": 12,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Hazır çanta açıldığında aşağıdaki içindekiler ayrı satırlar halinde envantere eklenir; çanta ağırlığı ikinci kez sayılmaz.",
    "properties": [],
    "contents": [
      {
        "id": "backpack",
        "quantity": 1
      },
      {
        "id": "crowbar",
        "quantity": 1
      },
      {
        "id": "hammer",
        "quantity": 1
      },
      {
        "id": "piton",
        "quantity": 10
      },
      {
        "id": "torch",
        "quantity": 10
      },
      {
        "id": "tinderbox",
        "quantity": 1
      },
      {
        "id": "rations-1-day",
        "quantity": 10
      },
      {
        "id": "waterskin",
        "quantity": 1
      },
      {
        "id": "rope-hempen-50-feet",
        "quantity": 1
      }
    ]
  },
  {
    "id": "entertainers-pack",
    "name": "Gösterici çantası",
    "englishName": "Entertainer's Pack",
    "category": "gear",
    "subcategory": "Hazır çantalar",
    "cost": {
      "quantity": 40,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Hazır çanta açıldığında aşağıdaki içindekiler ayrı satırlar halinde envantere eklenir; çanta ağırlığı ikinci kez sayılmaz.",
    "properties": [],
    "contents": [
      {
        "id": "backpack",
        "quantity": 1
      },
      {
        "id": "bedroll",
        "quantity": 1
      },
      {
        "id": "clothes-costume",
        "quantity": 2
      },
      {
        "id": "candle",
        "quantity": 5
      },
      {
        "id": "rations-1-day",
        "quantity": 5
      },
      {
        "id": "waterskin",
        "quantity": 1
      },
      {
        "id": "disguise-kit",
        "quantity": 1
      }
    ]
  },
  {
    "id": "explorers-pack",
    "name": "Kâşif çantası",
    "englishName": "Explorer's Pack",
    "category": "gear",
    "subcategory": "Hazır çantalar",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Hazır çanta açıldığında aşağıdaki içindekiler ayrı satırlar halinde envantere eklenir; çanta ağırlığı ikinci kez sayılmaz.",
    "properties": [],
    "contents": [
      {
        "id": "backpack",
        "quantity": 1
      },
      {
        "id": "bedroll",
        "quantity": 1
      },
      {
        "id": "mess-kit",
        "quantity": 1
      },
      {
        "id": "tinderbox",
        "quantity": 1
      },
      {
        "id": "torch",
        "quantity": 10
      },
      {
        "id": "rations-1-day",
        "quantity": 10
      },
      {
        "id": "waterskin",
        "quantity": 1
      },
      {
        "id": "rope-hempen-50-feet",
        "quantity": 1
      }
    ]
  },
  {
    "id": "priests-pack",
    "name": "Rahip çantası",
    "englishName": "Priest's Pack",
    "category": "gear",
    "subcategory": "Hazır çantalar",
    "cost": {
      "quantity": 19,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Hazır çanta açıldığında aşağıdaki içindekiler ayrı satırlar halinde envantere eklenir; çanta ağırlığı ikinci kez sayılmaz.",
    "properties": [],
    "contents": [
      {
        "id": "backpack",
        "quantity": 1
      },
      {
        "id": "blanket",
        "quantity": 1
      },
      {
        "id": "candle",
        "quantity": 10
      },
      {
        "id": "tinderbox",
        "quantity": 1
      },
      {
        "id": "rations-1-day",
        "quantity": 2
      },
      {
        "id": "waterskin",
        "quantity": 1
      },
      {
        "id": "alms-box",
        "quantity": 1
      },
      {
        "id": "block-of-incense",
        "quantity": 2
      },
      {
        "id": "censer",
        "quantity": 1
      },
      {
        "id": "vestments",
        "quantity": 1
      }
    ]
  },
  {
    "id": "scholars-pack",
    "name": "Bilgin çantası",
    "englishName": "Scholar's Pack",
    "category": "gear",
    "subcategory": "Hazır çantalar",
    "cost": {
      "quantity": 40,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Hazır çanta açıldığında aşağıdaki içindekiler ayrı satırlar halinde envantere eklenir; çanta ağırlığı ikinci kez sayılmaz.",
    "properties": [],
    "contents": [
      {
        "id": "backpack",
        "quantity": 1
      },
      {
        "id": "book",
        "quantity": 1
      },
      {
        "id": "ink-1-ounce-bottle",
        "quantity": 1
      },
      {
        "id": "ink-pen",
        "quantity": 1
      },
      {
        "id": "parchment-one-sheet",
        "quantity": 10
      },
      {
        "id": "little-bag-of-sand",
        "quantity": 1
      },
      {
        "id": "small-knife",
        "quantity": 1
      }
    ]
  },
  {
    "id": "alchemists-supplies",
    "name": "Simyacı malzemeleri",
    "englishName": "Alchemist's Supplies",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 8,
    "bundleQuantity": 1,
    "description": "Simyacı malzemeleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "brewers-supplies",
    "name": "Biracı malzemeleri",
    "englishName": "Brewer's Supplies",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 20,
      "unit": "gp"
    },
    "weight": 9,
    "bundleQuantity": 1,
    "description": "Biracı malzemeleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "calligraphers-supplies",
    "name": "Hattat malzemeleri",
    "englishName": "Calligrapher's Supplies",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Hattat malzemeleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "carpenters-tools",
    "name": "Marangoz aletleri",
    "englishName": "Carpenter's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 8,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "Marangoz aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "cartographers-tools",
    "name": "Haritacı aletleri",
    "englishName": "Cartographer's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 15,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "Haritacı aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "cobblers-tools",
    "name": "Ayakkabıcı aletleri",
    "englishName": "Cobbler's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Ayakkabıcı aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "cooks-utensils",
    "name": "Aşçı takımı",
    "englishName": "Cook's utensils",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 8,
    "bundleQuantity": 1,
    "description": "Aşçı takımı: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "glassblowers-tools",
    "name": "Cam ustası aletleri",
    "englishName": "Glassblower's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 30,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Cam ustası aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "jewelers-tools",
    "name": "Kuyumcu aletleri",
    "englishName": "Jeweler's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Kuyumcu aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "leatherworkers-tools",
    "name": "Derici aletleri",
    "englishName": "Leatherworker's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Derici aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "masons-tools",
    "name": "Taş ustası aletleri",
    "englishName": "Mason's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 8,
    "bundleQuantity": 1,
    "description": "Taş ustası aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "painters-supplies",
    "name": "Ressam malzemeleri",
    "englishName": "Painter's Supplies",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Ressam malzemeleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "potters-tools",
    "name": "Çömlekçi aletleri",
    "englishName": "Potter's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "Çömlekçi aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "smiths-tools",
    "name": "Demirci aletleri",
    "englishName": "Smith's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 20,
      "unit": "gp"
    },
    "weight": 8,
    "bundleQuantity": 1,
    "description": "Demirci aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "tinkers-tools",
    "name": "Tamirci aletleri",
    "englishName": "Tinker's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "Tamirci aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "weavers-tools",
    "name": "Dokumacı aletleri",
    "englishName": "Weaver's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Dokumacı aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "woodcarvers-tools",
    "name": "Ahşap oymacı aletleri",
    "englishName": "Woodcarver's Tools",
    "category": "tools",
    "subcategory": "Zanaat aletleri",
    "cost": {
      "quantity": 1,
      "unit": "gp"
    },
    "weight": 5,
    "bundleQuantity": 1,
    "description": "Ahşap oymacı aletleri: mesleğin üretim, onarım ve ince işlerine ait takım. Yetkinlik ilgili araç kontrolüne yetkinlik bonusunu ekler; yalnız takımı taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "dice-set",
    "name": "Zar takımı",
    "englishName": "Dice Set",
    "category": "tools",
    "subcategory": "Oyun takımları",
    "cost": {
      "quantity": 1,
      "unit": "sp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Zar takımı: ilgili oyunda yetkinlik uygun kontrole eklenebilir. Para yatırma ve sonuçlar otomatik uygulanmaz.",
    "properties": []
  },
  {
    "id": "playing-card-set",
    "name": "Oyun kâğıdı takımı",
    "englishName": "Playing Card Set",
    "category": "tools",
    "subcategory": "Oyun takımları",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "Oyun kâğıdı takımı: ilgili oyunda yetkinlik uygun kontrole eklenebilir. Para yatırma ve sonuçlar otomatik uygulanmaz.",
    "properties": []
  },
  {
    "id": "bagpipes",
    "name": "Gayda",
    "englishName": "Bagpipes",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 30,
      "unit": "gp"
    },
    "weight": 6,
    "bundleQuantity": 1,
    "description": "Gayda: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "drum",
    "name": "Davul",
    "englishName": "Drum",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 6,
      "unit": "gp"
    },
    "weight": 3,
    "bundleQuantity": 1,
    "description": "Davul: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "dulcimer",
    "name": "Santur",
    "englishName": "Dulcimer",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "Santur: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "flute",
    "name": "Flüt",
    "englishName": "Flute",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Flüt: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "lute",
    "name": "Lavta",
    "englishName": "Lute",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 35,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Lavta: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "lyre",
    "name": "Lir",
    "englishName": "Lyre",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 30,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Lir: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "horn",
    "name": "Boru",
    "englishName": "Horn",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 3,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Boru: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "pan-flute",
    "name": "Pan flüt",
    "englishName": "Pan flute",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 12,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Pan flüt: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "shawm",
    "name": "Zurna",
    "englishName": "Shawm",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Zurna: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "viol",
    "name": "Viyol",
    "englishName": "Viol",
    "category": "tools",
    "subcategory": "Müzik aletleri",
    "cost": {
      "quantity": 30,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Viyol: müzik icrası için çalgı. Yetkinlik uygun çalgı kontrolüne eklenir; Ozan kendi sınıf büyülerinde çalgıyı odak olarak kullanabilir.",
    "properties": []
  },
  {
    "id": "navigators-tools",
    "name": "Seyrüsefer aletleri",
    "englishName": "Navigator's Tools",
    "category": "tools",
    "subcategory": "Diğer aletler",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 2,
    "bundleQuantity": 1,
    "description": "Yıldız, deniz ve harita üzerinden rota bulma araçları. Yetkinlik yol bulma ve kaybolmayı önleme kontrollerinde kullanılabilir.",
    "properties": []
  },
  {
    "id": "thieves-tools",
    "name": "Hırsız aletleri",
    "englishName": "Thieves' Tools",
    "category": "tools",
    "subcategory": "Diğer aletler",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "Maymuncuk, küçük eğeler ve ince aletler. Uygun kilit veya tuzak kontrollerine araç yetkinliği uygulanır; araç taşımak yetkinlik kazandırmaz.",
    "properties": []
  },
  {
    "id": "camel",
    "name": "Deve",
    "englishName": "Camel",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "50 fit / tur",
    "capacity": "480 lb"
  },
  {
    "id": "donkey",
    "name": "Eşek",
    "englishName": "Donkey",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 8,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "40 fit / tur",
    "capacity": "420 lb"
  },
  {
    "id": "mule",
    "name": "Katır",
    "englishName": "Mule",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 8,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "40 fit / tur",
    "capacity": "420 lb"
  },
  {
    "id": "elephant",
    "name": "Fil",
    "englishName": "Elephant",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 200,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "40 fit / tur",
    "capacity": "1.320 lb"
  },
  {
    "id": "horse-draft",
    "name": "Yük atı",
    "englishName": "Horse, draft",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "40 fit / tur",
    "capacity": "540 lb"
  },
  {
    "id": "horse-riding",
    "name": "Binek atı",
    "englishName": "Horse, riding",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 75,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "60 fit / tur",
    "capacity": "480 lb"
  },
  {
    "id": "mastiff",
    "name": "Mastif",
    "englishName": "Mastiff",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 25,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "40 fit / tur",
    "capacity": "195 lb"
  },
  {
    "id": "pony",
    "name": "Midilli",
    "englishName": "Pony",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 30,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "40 fit / tur",
    "capacity": "225 lb"
  },
  {
    "id": "warhorse",
    "name": "Savaş atı",
    "englishName": "Warhorse",
    "category": "mounts",
    "subcategory": "Binekler ve hayvanlar",
    "cost": {
      "quantity": 400,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "60 fit / tur",
    "capacity": "540 lb"
  },
  {
    "id": "barding-padded",
    "name": "Binek zırhı · dolgulu",
    "englishName": "Barding: Padded",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 20,
      "unit": "gp"
    },
    "weight": 16,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-leather",
    "name": "Binek zırhı · deri",
    "englishName": "Barding: Leather",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 40,
      "unit": "gp"
    },
    "weight": 20,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-studded-leather",
    "name": "Binek zırhı · çivili deri",
    "englishName": "Barding: Studded Leather",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 180,
      "unit": "gp"
    },
    "weight": 26,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-hide",
    "name": "Binek zırhı · post",
    "englishName": "Barding: Hide",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 40,
      "unit": "gp"
    },
    "weight": 24,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-chain-shirt",
    "name": "Binek zırhı · zincir gömlek",
    "englishName": "Barding: Chain shirt",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 200,
      "unit": "gp"
    },
    "weight": 40,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-scale-mail",
    "name": "Binek zırhı · pul",
    "englishName": "Barding: Scale mail",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 200,
      "unit": "gp"
    },
    "weight": 90,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-breastplate",
    "name": "Binek zırhı · göğüslük",
    "englishName": "Barding: Breastplate",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 1600,
      "unit": "gp"
    },
    "weight": 40,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-half-plate",
    "name": "Binek zırhı · yarım plaka",
    "englishName": "Barding: Half plate",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 3000,
      "unit": "gp"
    },
    "weight": 80,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-ring-mail",
    "name": "Binek zırhı · halka",
    "englishName": "Barding: Ring mail",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 120,
      "unit": "gp"
    },
    "weight": 80,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": [],
    "sourceCorrection": "SRD 5.1: 30 altın halka zırhın dört katı 120 altındır; kaynak veride 12 yazıyordu."
  },
  {
    "id": "barding-chain-mail",
    "name": "Binek zırhı · zincir",
    "englishName": "Barding: Chain mail",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 300,
      "unit": "gp"
    },
    "weight": 110,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-splint",
    "name": "Binek zırhı · şerit",
    "englishName": "Barding: Splint",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 800,
      "unit": "gp"
    },
    "weight": 120,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "barding-plate",
    "name": "Binek zırhı · tam plaka",
    "englishName": "Barding: Plate",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 6000,
      "unit": "gp"
    },
    "weight": 130,
    "bundleQuantity": 1,
    "description": "Bineğin başını, boynunu ve gövdesini koruyan zırh. Normal insansı zırhın dört katı fiyatı, iki katı ağırlığı vardır. Karakterin kendi Zırh Sınıfına kuşanılmaz; binek yetkinliğini ayrıca kontrol et.",
    "properties": []
  },
  {
    "id": "bit-and-bridle",
    "name": "Gem ve dizgin",
    "englishName": "Bit and bridle",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 2,
      "unit": "gp"
    },
    "weight": 1,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "carriage",
    "name": "Kapalı yolcu arabası",
    "englishName": "Carriage",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 100,
      "unit": "gp"
    },
    "weight": 600,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "cart",
    "name": "El arabası",
    "englishName": "Cart",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 15,
      "unit": "gp"
    },
    "weight": 200,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "chariot",
    "name": "Savaş arabası",
    "englishName": "Chariot",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 250,
      "unit": "gp"
    },
    "weight": 100,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "animal-feed-1-day",
    "name": "Hayvan yemi · 1 gün",
    "englishName": "Animal Feed (1 day)",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 5,
      "unit": "cp"
    },
    "weight": 10,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "saddle-exotic",
    "name": "Egzotik eyer",
    "englishName": "Saddle, Exotic",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 60,
      "unit": "gp"
    },
    "weight": 50,
    "bundleQuantity": 1,
    "description": "Olağan dışı veya sucul/uçan bineğe uygun özel eyer.",
    "properties": []
  },
  {
    "id": "saddle-military",
    "name": "Askerî eyer",
    "englishName": "Saddle, Military",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 20,
      "unit": "gp"
    },
    "weight": 30,
    "bundleQuantity": 1,
    "description": "Binekte kalma kontrollerine avantaj sağlar; binici bilinçsizken de eyerde kalabilir.",
    "properties": []
  },
  {
    "id": "saddle-pack",
    "name": "Yük eyeri",
    "englishName": "Saddle, Pack",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 5,
      "unit": "gp"
    },
    "weight": 15,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "saddle-riding",
    "name": "Biniş eyeri",
    "englishName": "Saddle, Riding",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 10,
      "unit": "gp"
    },
    "weight": 25,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "saddlebags",
    "name": "Heybe",
    "englishName": "Saddlebags",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 4,
      "unit": "gp"
    },
    "weight": 8,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "sled",
    "name": "Kızak",
    "englishName": "Sled",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 20,
      "unit": "gp"
    },
    "weight": 300,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "stabling-1-day",
    "name": "Ahır ücreti · 1 gün",
    "englishName": "Stabling (1 day)",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 5,
      "unit": "sp"
    },
    "weight": 0,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "wagon",
    "name": "Yük arabası",
    "englishName": "Wagon",
    "category": "mounts",
    "subcategory": "Eyer ve kara araçları",
    "cost": {
      "quantity": 35,
      "unit": "gp"
    },
    "weight": 400,
    "bundleQuantity": 1,
    "description": "",
    "properties": []
  },
  {
    "id": "galley",
    "name": "Kadırga",
    "englishName": "Galley",
    "category": "mounts",
    "subcategory": "Su araçları",
    "cost": {
      "quantity": 30000,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "4 mil / saat"
  },
  {
    "id": "keelboat",
    "name": "Küçük yelkenli",
    "englishName": "Keelboat",
    "category": "mounts",
    "subcategory": "Su araçları",
    "cost": {
      "quantity": 3000,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Küçük su aracı; yelken veya kürekle ilerleyebilir. Tayfa ve yolculuk koşulları ayrıca belirlenir.",
    "properties": [],
    "speed": "1 mil / saat"
  },
  {
    "id": "longship",
    "name": "Uzun gemi",
    "englishName": "Longship",
    "category": "mounts",
    "subcategory": "Su araçları",
    "cost": {
      "quantity": 10000,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "3 mil / saat"
  },
  {
    "id": "rowboat",
    "name": "Sandal",
    "englishName": "Rowboat",
    "category": "mounts",
    "subcategory": "Su araçları",
    "cost": {
      "quantity": 50,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "Kürekle kullanılan sandal; akıntı ve hava ilerlemeyi değiştirebilir.",
    "properties": [],
    "speed": "1.5 mil / saat"
  },
  {
    "id": "sailing-ship",
    "name": "Yelkenli gemi",
    "englishName": "Sailing ship",
    "category": "mounts",
    "subcategory": "Su araçları",
    "cost": {
      "quantity": 10000,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "2 mil / saat"
  },
  {
    "id": "warship",
    "name": "Savaş gemisi",
    "englishName": "Warship",
    "category": "mounts",
    "subcategory": "Su araçları",
    "cost": {
      "quantity": 25000,
      "unit": "gp"
    },
    "weight": null,
    "bundleQuantity": 1,
    "description": "",
    "properties": [],
    "speed": "2.5 mil / saat"
  }
]

export const equipmentById=(id:string)=>equipmentCatalog.find(item=>item.id===id)
export const equipmentPropertyDefinitions:Record<string,{name:string;description:string}>={
  ammunition:{name:'Mühimmat',description:'Her saldırı bir mühimmat harcar; kılıf/ceplikten çekmek saldırıya dahildir. Menzilli silahı yüklemek için boş bir el gerekir. Savaştan sonra bir dakika arayarak kullanılan mühimmatın yarısını toplayabilirsin; adetleri elle değiştir.'},
  finesse:{name:'İncelikli',description:'Saldırı ve hasarda Kuvvet veya Çeviklik kullanabilirsin; ikisinde aynı nitelik kullanılır.'},
  heavy:{name:'Ağır',description:'Küçük yaratıklar bu silahla saldırırken dezavantaj alır.'},
  light:{name:'Hafif',description:'2014 iki silahla dövüş kurallarındaki hafif yakın dövüş silahı koşulunu karşılar.'},
  loading:{name:'Doldurmalı',description:'Bu silahla saldıran bir eylem, bonus eylem veya tepkide, saldırı sayın ne olursa olsun yalnız bir mühimmat ateşlenir. Özelliklerin istisna getirebilir.'},
  range:{name:'Menzilli',description:'İlk sayı olağan, ikinci sayı uzun menzildir. Uzun menzilde saldırı dezavantajlıdır; ikinci menzilin ötesine saldırı yapılamaz.'},
  reach:{name:'Uzun erişim',description:'Bu silahla saldırırken ve fırsat saldırısı erişimini belirlerken erişimine 5 fit eklenir.'},
  special:{name:'Özel',description:'Eşyanın özel kuralını aşağıdaki açıklamadan oku.'},
  thrown:{name:'Fırlatılabilir',description:'Silahı verilen menzile atabilirsin. Yakın dövüş silahıysa aynı nitelik kullanılır; incelikli silah Kuvvet veya Çeviklik seçebilir.'},
  'two-handed':{name:'İki elli',description:'Silahla saldırırken iki el gerekir; yalnız taşımak iki el gerektirmez.'},
  versatile:{name:'Çok yönlü',description:'Tek elle normal, iki elle parantezde verilen hasarı kullanır. Kalkan takılıyken iki elli seçimi kullanma.'},
  monk:{name:'Keşiş silahı',description:'Kısa kılıç veya ağır/iki elli olmayan basit yakın dövüş silahı. Keşişin Dövüş Sanatları koşulları sağlanırsa uygun Çeviklik ve hasar zarı seçeneği kullanılabilir.'},
}
const currencyNames:Record<string,string>={cp:'bakır',sp:'gümüş',ep:'elektrum',gp:'altın',pp:'platin'}
export const formatEquipmentCost=(item:EquipmentItem)=>`${new Intl.NumberFormat('tr-TR',{maximumFractionDigits:4}).format(item.cost.quantity)} ${currencyNames[item.cost.unit]||item.cost.unit}${item.bundleQuantity>1?` / ${item.bundleQuantity} adet`:''}`
export function equipmentUnitWeight(item:EquipmentItem){return item.weight===null?null:item.weight/item.bundleQuantity}
export function equipmentWeight(item:EquipmentItem,quantity=item.bundleQuantity):{weight:number;complete:boolean}{
  if(item.contents){let weight=0,complete=true;for(const child of item.contents){const found=equipmentById(child.id);if(!found)throw Error('Çantanın içindeki eşya bulunamadı.');const result=equipmentWeight(found,child.quantity*quantity);weight+=result.weight;complete=complete&&result.complete}return {weight,complete}}
  return {weight:(equipmentUnitWeight(item)||0)*quantity,complete:item.weight!==null}
}
const marker=(id:string)=>`[SRD:${id}]`
export const inventoryCatalogCount=(c:PlayerCharacter,id:string)=>c.equipment.filter(row=>row.notes.includes(marker(id))).reduce((n,row)=>n+row.quantity,0)
function expandedItems(id:string,quantity:number,seen=new Set<string>()):{item:EquipmentItem;quantity:number}[]{
  const item=equipmentById(id)
  if(!item)throw Error('Bu eşya temel donanım arşivinde bulunamadı.')
  if(seen.has(id))throw Error('Çanta içeriğinde döngü var.')
  if(!item.contents)return [{item,quantity}]
  const next=new Set(seen);next.add(id)
  return item.contents.flatMap(child=>expandedItems(child.id,child.quantity*quantity,next))
}
function inventoryRow(item:EquipmentItem,quantity:number,prefix:string,note:string):PlayerEquipment {
  const weight=equipmentUnitWeight(item)
  return {id:`${prefix}-${item.id}`,name:item.name,quantity,weight:weight??0,notes:[marker(item.id),note,item.weight===null?'Kaynakta ağırlık belirtilmemiştir; toplam yükte 0 lb kabul edildi.':`${formatEquipmentCost(item)} · birim ağırlık ${weight} lb`,item.description].filter(Boolean).join('\n').slice(0,2000)}
}
function checkedQuantity(quantity:number){if(!Number.isInteger(quantity)||quantity<1||quantity>100000)throw Error('Eşya adedi 1–100.000 arasında tam sayı olmalı.')}
function checkedEquipment(rows:PlayerEquipment[]){if(rows.length>150)throw Error('Envanterde en fazla 150 satır olabilir. Önce eski satırları birleştir veya kaldır.');return rows}
export function addCatalogEquipment(c:PlayerCharacter,id:string,quantity?:number):Partial<PlayerCharacter> {
  const item=equipmentById(id);if(!item)throw Error('Eşya bulunamadı.')
  const amount=quantity??(item.contents?1:item.bundleQuantity);checkedQuantity(amount)
  const equipment=c.equipment.map(row=>({...row}))
  for(const part of expandedItems(id,amount)){
    checkedQuantity(part.quantity)
    const row=inventoryRow(part.item,part.quantity,'srd-item',item.contents?`${item.name} içinden eklendi.`:'Katalogdan eklendi; satın alma bedeli otomatik düşülmedi.')
    const existing=equipment.find(e=>e.id===row.id)
    if(existing){if(!existing.notes.includes(marker(part.item.id)))throw Error('Bu eşya kimliği elle yazılmış başka bir kayıtta kullanılıyor; önce o kaydın kimliğini değiştir.');if(existing.quantity+row.quantity>100000)throw Error('Bu eşyadan en fazla 100.000 adet kaydedilebilir.');existing.quantity+=row.quantity}
    else equipment.push(row)
  }
  return {equipment:checkedEquipment(equipment)}
}
const specialWeapons:Partial<Record<ClassId,string[]>>={
  bard:['crossbow-hand','longsword','rapier','shortsword'],rogue:['crossbow-hand','longsword','rapier','shortsword'],monk:['shortsword'],
  druid:['club','dagger','dart','javelin','mace','quarterstaff','scimitar','sickle','sling','spear'],
  sorcerer:['dagger','dart','sling','quarterstaff','crossbow-light'],wizard:['dagger','dart','sling','quarterstaff','crossbow-light'],
}
export function isWeaponProficient(c:PlayerCharacter,item:EquipmentItem){
  if(!item.weapon)return false
  if(['barbarian','fighter','paladin','ranger'].includes(c.classId))return true
  if(!['druid','sorcerer','wizard'].includes(c.classId)&&item.weapon.kind==='simple')return true
  if(specialWeapons[c.classId]?.includes(item.id))return true
  if(c.raceId==='high-elf'&&['longsword','shortsword','shortbow','longbow'].includes(item.id))return true
  if(c.raceId==='hill-dwarf'&&['battleaxe','handaxe','light-hammer','warhammer'].includes(item.id))return true
  return false
}
export function weaponAbility(c:PlayerCharacter,item:EquipmentItem):AbilityId {
  if(!item.weapon)throw Error('Saldırı eklemek için bir silah seç.')
  const monk=c.classId==='monk'&&c.armorId==='none'&&!c.shield&&item.properties.includes('monk')
  if(item.properties.includes('finesse')||monk)return c.scores.dex>=c.scores.str?'dex':'str'
  return item.weapon.rangeKind==='ranged'?'dex':'str'
}
export function addCatalogAttack(c:PlayerCharacter,id:string,options:{ability?:AbilityId;proficient?:boolean;twoHanded?:boolean}={}):Partial<PlayerCharacter>{
  const item=equipmentById(id)
  if(!item?.weapon)throw Error('Bu eşya bir silah kaydı değil.')
  if((options.twoHanded||item.properties.includes('two-handed'))&&c.shield)throw Error('Kalkan takılıyken iki elli saldırı seçilemez; önce kalkanı çıkar.')
  if(options.twoHanded&&!item.weapon.versatileDice)throw Error('Bu silahın ayrı iki elli hasarı yok.')
  const ability=options.ability??weaponAbility(c,item)
  if(!['str','dex'].includes(ability))throw Error('Bu silah için Kuvvet veya Çeviklik seç; özel büyülü saldırıları elle oluştur.')
  const flexible=item.properties.includes('finesse')||(c.classId==='monk'&&c.armorId==='none'&&!c.shield&&item.properties.includes('monk'))
  if(!flexible&&ability!==weaponAbility(c,item))throw Error('Bu silah bu kullanımda seçilen niteliği kullanmaz; özel sınıf özelliklerini elle ayrı saldırı olarak kaydet.')
  const attackId=`srd-attack-${id}-${ability}-${options.twoHanded?'two':'one'}`
  if(c.attacks.some(a=>a.id===attackId))throw Error('Bu silahın aynı kullanım biçimi saldırı listende zaten var.')
  if(c.attacks.length>=30)throw Error('En fazla 30 saldırı kaydı olabilir.')
  let damage=options.twoHanded?item.weapon.versatileDice!:item.weapon.damageDice
  if(c.classId==='monk'&&c.armorId==='none'&&!c.shield&&item.properties.includes('monk')){
    const faces=c.level>=17?10:c.level>=11?8:c.level>=5?6:4
    const base=damage.match(/^1d(\d+)$/);if(base&&Number(base[1])<faces)damage='1d'+faces
  }
  const properties=item.properties.filter(p=>p!=='monk').map(p=>equipmentPropertyDefinitions[p]?.name||p).join(', ')
  const range=item.weapon.thrownRange?`Fırlatma ${item.weapon.thrownRange.normal}/${item.weapon.thrownRange.long} fit`:item.weapon.rangeKind==='ranged'?`Menzil ${item.weapon.normalRange}/${item.weapon.longRange??item.weapon.normalRange} fit`:`Erişim ${item.properties.includes('reach')?10:item.weapon.normalRange} fit`
  const modifier=abilityModifier(c.scores[ability])
  const attack:PlayerAttack={id:attackId,name:item.name+(options.twoHanded?' · iki el':''),ability,proficient:options.proficient??isWeaponProficient(c,item),damage,damageType:item.weapon.damageType,notes:[marker(item.id),properties,range,item.description,id==='net'?'Ağ hasar vermez; nitelik değiştiricisi hasara eklenmez.':`Hasar zarı temel değerdir; normal isabette ${ability==='str'?'Kuvvet':'Çeviklik'} değiştiricin (${modifier>=0?'+':''}${modifier}) ayrıca uygulanır. İki silahla ikincil saldırı, direnç ve özel özellikleri ayrıca değerlendir.`].filter(Boolean).join('\n').slice(0,3000)}
  return {attacks:[...c.attacks,attack]}
}
export function armorProficiency(c:PlayerCharacter,item:EquipmentItem){
  if(!item.armor)return false
  const heavy=['barbarian','bard','cleric','druid','fighter','monk','paladin','ranger','rogue','sorcerer','warlock','wizard'].includes(c.classId)&&(['fighter','paladin'].includes(c.classId)||(c.classId==='cleric'&&c.subclass==='life'))
  if(item.armor.shield)return ['barbarian','cleric','druid','fighter','paladin','ranger'].includes(c.classId)
  if(item.subcategory==='Ağır zırh')return heavy
  if(item.subcategory==='Orta zırh')return ['barbarian','cleric','druid','fighter','paladin','ranger'].includes(c.classId)
  return !['monk','sorcerer','wizard'].includes(c.classId)
}
export function equipCatalogArmor(c:PlayerCharacter,id:string):Partial<PlayerCharacter>{
  const item=equipmentById(id)
  if(!item?.armor)throw Error('Kuşanmak için insansı zırhı veya kalkanı seç; binek zırhı karakterine takılmaz.')
  const equipment=inventoryCatalogCount(c,id)>0?c.equipment:(addCatalogEquipment(c,id,1).equipment!)
  return item.armor.shield?{equipment,shield:true}:{equipment,armorId:item.armor.armorId!}
}
export type StarterEquipment={classId:ClassId;title:string;description:string;items:{id:string;quantity:number}[]}
export const starterEquipment:StarterEquipment[]=[
  {classId:'barbarian',title:'Barbar · büyük balta ve yol çantası',description:'2014 seçeneklerinden bir başlangıç: büyük balta, iki el baltası, dört cirit ve kâşif çantası.',items:[{id:'greataxe',quantity:1},{id:'handaxe',quantity:2},{id:'javelin',quantity:4},{id:'explorers-pack',quantity:1}]},
  {classId:'bard',title:'Ozan · meç ve lavta',description:'Meç, deri zırh, hançer, lavta ve gösterici çantası. Başka bir çalgı seçmek istersen eşyayı değiştirebilirsin.',items:[{id:'rapier',quantity:1},{id:'leather-armor',quantity:1},{id:'dagger',quantity:1},{id:'lute',quantity:1},{id:'entertainers-pack',quantity:1}]},
  {classId:'cleric',title:'Rahip · topuz ve kalkan',description:'Topuz, pul zırh, hafif arbalet ve 20 oku, kalkan, kutsal muska, rahip çantası. Yaşam Alanı ağır zırh seçeneğini ayrıca seçebilir.',items:[{id:'mace',quantity:1},{id:'scale-mail',quantity:1},{id:'crossbow-light',quantity:1},{id:'crossbow-bolt',quantity:20},{id:'shield',quantity:1},{id:'amulet',quantity:1},{id:'priests-pack',quantity:1}]},
  {classId:'druid',title:'Druid · pala ve doğa odağı',description:'Pala, ahşap olarak seçilen kalkan, deri zırh, ökseotu ve kâşif çantası. 2014 Druid metal zırh/kalkan geleneğini ayrıca gözet.',items:[{id:'scimitar',quantity:1},{id:'shield',quantity:1},{id:'leather-armor',quantity:1},{id:'sprig-of-mistletoe',quantity:1},{id:'explorers-pack',quantity:1}]},
  {classId:'fighter',title:'Savaşçı · uzun kılıç ve zincir zırh',description:'Uzun kılıç, kalkan, zincir zırh, iki el baltası ve zindan gezgini çantası.',items:[{id:'longsword',quantity:1},{id:'shield',quantity:1},{id:'chain-mail',quantity:1},{id:'handaxe',quantity:2},{id:'dungeoneers-pack',quantity:1}]},
  {classId:'monk',title:'Keşiş · asa ve dart',description:'Çeyrek asa, on dart ve kâşif çantası; zırh verilmez.',items:[{id:'quarterstaff',quantity:1},{id:'dart',quantity:10},{id:'explorers-pack',quantity:1}]},
  {classId:'paladin',title:'Paladin · yeminli savaşçı',description:'Uzun kılıç, kalkan, beş cirit, zincir zırh, kutsal muska ve rahip çantası.',items:[{id:'longsword',quantity:1},{id:'shield',quantity:1},{id:'javelin',quantity:5},{id:'chain-mail',quantity:1},{id:'amulet',quantity:1},{id:'priests-pack',quantity:1}]},
  {classId:'ranger',title:'Kolcu · iki kısa kılıç ve yay',description:'İki kısa kılıç, deri zırh, uzun yay, sadak ve 20 ok, kâşif çantası.',items:[{id:'shortsword',quantity:2},{id:'leather-armor',quantity:1},{id:'longbow',quantity:1},{id:'quiver',quantity:1},{id:'arrow',quantity:20},{id:'explorers-pack',quantity:1}]},
  {classId:'rogue',title:'Düzenbaz · meç ve hırsız çantası',description:'Meç, kısa yay, sadak ve 20 ok, deri zırh, iki hançer, hırsız aletleri ve hırsız çantası.',items:[{id:'rapier',quantity:1},{id:'shortbow',quantity:1},{id:'quiver',quantity:1},{id:'arrow',quantity:20},{id:'leather-armor',quantity:1},{id:'dagger',quantity:2},{id:'thieves-tools',quantity:1},{id:'burglars-pack',quantity:1}]},
  {classId:'sorcerer',title:'Efsuncu · arbalet ve bileşen kesesi',description:'Hafif arbalet ve 20 oku, bileşen kesesi, iki hançer ve kâşif çantası.',items:[{id:'crossbow-light',quantity:1},{id:'crossbow-bolt',quantity:20},{id:'component-pouch',quantity:1},{id:'dagger',quantity:2},{id:'explorers-pack',quantity:1}]},
  {classId:'warlock',title:'Ant Büyücüsü · kitap ve silah',description:'Hafif arbalet ve 20 oku, bileşen kesesi, bilgin çantası, deri zırh, çeyrek asa ve iki hançer.',items:[{id:'crossbow-light',quantity:1},{id:'crossbow-bolt',quantity:20},{id:'component-pouch',quantity:1},{id:'scholars-pack',quantity:1},{id:'leather-armor',quantity:1},{id:'quarterstaff',quantity:1},{id:'dagger',quantity:2}]},
  {classId:'wizard',title:'Büyücü · büyü kitabı ve asa',description:'Çeyrek asa, bileşen kesesi, bilgin çantası ve boş büyü kitabı. Kitabına öğrendiğin büyüleri Büyüler bölümünden seç.',items:[{id:'quarterstaff',quantity:1},{id:'component-pouch',quantity:1},{id:'scholars-pack',quantity:1},{id:'spellbook',quantity:1}]},
]
export function starterEquipmentApplied(c:PlayerCharacter,classId=c.classId){return c.equipment.some(row=>row.notes.includes(`[Başlangıç:${classId}]`))}
export function applyStarterEquipment(c:PlayerCharacter,classId:ClassId=c.classId):Partial<PlayerCharacter>{
  const starter=starterEquipment.find(s=>s.classId===classId)
  if(!starter)throw Error('Bu sınıf için başlangıç seçimi bulunamadı.')
  if(starterEquipmentApplied(c,classId))throw Error('Bu başlangıç seti daha önce uygulanmış. Aynı set ikinci kez eklenmedi; tek eşyaları katalogdan ekleyebilirsin.')
  const combined=new Map<string,{item:EquipmentItem;quantity:number}>()
  for(const choice of starter.items)for(const part of expandedItems(choice.id,choice.quantity)){
    const existing=combined.get(part.item.id)
    if(existing)existing.quantity+=part.quantity;else combined.set(part.item.id,part)
  }
  const rows=[...combined.values()].map(({item,quantity})=>inventoryRow(item,quantity,`starter-${classId}`,`[Başlangıç:${classId}] ${starter.title}. Başlangıç altını eklenmedi.${classId==='druid'&&item.id==='shield'?' Bu kalkan ahşap seçildi.':''}`))
  if(rows.some(row=>c.equipment.some(previous=>previous.id===row.id)))throw Error('Başlangıç setinin kimliği mevcut bir kayıtta kullanılıyor; aynı satırlar ikinci kez eklenmedi.')
  return {equipment:checkedEquipment([...c.equipment,...rows])}
}
