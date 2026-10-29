export type SideCheck = {skill:string;dc:number;success:string;failure:string};
export type SideRoom = {id:string;title:string;artId:string;read:string;truth:string;clues:SideCheck[];lines:string[];puzzle?:{setup:string;clues:string[];solution:string;alternatives:string;failure:string};enemyIds:string[];exits:string[];next:string};
export type SideQuest = {id:string;title:string;where:string;duration:string;hook:string;goal:string;warning:string;steps:SideRoom[];outcomes:string[]};
export type SideLoot = {id:string;name:string;artId:string;type:string;rules:string;passive:string;value:string;draw:boolean};
export type SideEnemy = {id:string;name:string;role:string;artId:string;ac:number;hp:number;initiative:number;attack:string;tactics:string;morale:string;kind:'enemy'|'ally'};
export type SidePack = {format:'aruzahr-sidequests';version:1;title:string;principles:string[];quests:SideQuest[];loot:SideLoot[];units:SideEnemy[];guards:{trigger:string;approaches:string[];aftermath:string};rig:{steps:string[];clues:string[];solution:string;failure:string};maps:{handout:string;player:string;dm:string}};

export function parseSidePack(raw:unknown):SidePack {
  if(!raw||typeof raw!=='object')throw Error('Yan görev dosyası okunamadı.');
  const p=raw as SidePack;
  if(p.format!=='aruzahr-sidequests'||p.version!==1||!Array.isArray(p.quests)||p.quests.length!==3||!Array.isArray(p.loot)||!Array.isArray(p.units))throw Error('Yan görev dosyasının sürümü uyumsuz.');
  const ids=new Set<string>();
  for(const q of p.quests){
    if(!q.id||ids.has(q.id)||!Array.isArray(q.steps)||!q.steps.length)throw Error('Yan görev kimlikleri bozuk.');ids.add(q.id);
    const rooms=new Set(q.steps.map(r=>r.id));
    for(const r of q.steps)if(!r.title||!r.artId||typeof r.read!=='string'||typeof r.truth!=='string'||!Array.isArray(r.clues)||!r.exits.every(id=>rooms.has(id)))throw Error('Yan görev oda bağlantısı bozuk.');
  }
  return p;
}
export const rigReadings=(a:number,b:number,c:number)=>({total:a+b+c,lever:2*a+b,return:b+c});
export const rigSolved=(a:number,b:number,c:number)=>new Set([a,b,c]).size===3&&a+b+c===10&&2*a+b===7&&b+c===8;
export function drawSideLoot(items:SideLoot[],used:string[],roll:number) {
  if(!Number.isInteger(roll)||roll<1||roll>20)throw Error('d20 sonucu 1–20 olmalı.');
  const pool=items.filter(i=>i.draw);
  const start=Math.floor((roll-1)/4);
  if(pool.length!==5)throw Error('Ödül tablosunda beş eşya bulunmalı.');
  for(let offset=0;offset<pool.length;offset++){
    const item=pool[(start+offset)%pool.length];
    if(!used.includes(item.id))return {item,shifted:offset>0};
  }
  return null;
}
export function sideD20(){
  const b=new Uint32Array(1);let n:number;
  do{crypto.getRandomValues(b);n=b[0];}while(n>=4294967280);
  return n%20+1;
}
