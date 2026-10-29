export const abilityIds = ['str','dex','con','int','wis','cha'] as const
export type AbilityId = typeof abilityIds[number]
export const classIds = ['barbarian','bard','cleric','druid','fighter','monk','paladin','ranger','rogue','sorcerer','warlock','wizard'] as const
export type ClassId = typeof classIds[number]
export type SkillId = 'acrobatics'|'animal-handling'|'arcana'|'athletics'|'deception'|'history'|'insight'|'intimidation'|'investigation'|'medicine'|'nature'|'perception'|'performance'|'persuasion'|'religion'|'sleight-of-hand'|'stealth'|'survival'
export type PlayerAttack = {id:string;name:string;ability:AbilityId;proficient:boolean;damage:string;damageType:string;notes:string}
export type PlayerEquipment = {id:string;name:string;quantity:number;weight:number;notes:string}
export type PlayerResource = {id:string;name:string;max:number;used:number;reset:'short'|'long'|'manual';description?:string}
export type PlayerCharacter = {
  version:1;id:string;createdAt:string;updatedAt:string;name:string;playerName:string;
  classId:ClassId;level:number;subclass:string;raceId:string;backgroundId:string;
  origin:string;houseId:string;alignment:string;appearance:string;portrait:string;
  scores:Record<AbilityId,number>;skillProficiencies:SkillId[];expertise:SkillId[];
  extraSaveProficiencies:AbilityId[];languages:string;tools:string;
  hp:number;maxHpOverride:number|null;tempHp:number;hitDiceUsed:number;deathSuccesses:number;deathFailures:number;
  armorId:string;shield:boolean;acBonus:number;initiativeBonus:number;speedOverride:number|null;
  inspiration:boolean;exhaustion:number;conditions:string[];
  attacks:PlayerAttack[];equipment:PlayerEquipment[];
  coins:{cp:number;sp:number;ep:number;gp:number;pp:number};
  spellbook:string[];preparedSpells:string[];usedSpellSlots:number[];pactSlotsUsed:number;arcanumUsed:number[];
  concentration:string;resources:PlayerResource[];
  personality:string;ideals:string;bonds:string;flaws:string;backstory:string;notes:string;
}
export type PlayerSpell = {
  id:string;name:string;englishName:string;level:number;school:string;classes:ClassId[];
  castingTime:string;range:string;components:string[];material:string;duration:string;
  concentration:boolean;ritual:boolean;description:string;higherLevels:string;source:string;
}
