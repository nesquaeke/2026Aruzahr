export type DMScene = { id: string; title: string; summary: string; readAloud: string; actions: string[]; checks: string[]; choices: { label: string; result: string; echo: string }[]; backgroundId: string; portraitIds: string[]; publicTitle: string; publicNames?: Record<string,string>; exits?: {label:string;sceneId:string}[] }
export type DMQuest = { id: string; title: string; body: string; location?: string; objective?: string; people?: string[]; steps?: DMScene[] }
export type DMProgress = { quest: string; steps: Record<string, number>; done: string[]; decisions: Record<string, string>; skipped?: string[] }
export type DMPack = { version: 1 | 2; title: string; quests: DMQuest[]; progress?: DMProgress }
const obj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const txt = (v: unknown, max = 120000): v is string => typeof v === 'string' && v.length <= max
function texts(v: unknown, max = 12): v is string[] { return Array.isArray(v) && v.length <= max && v.every(x => txt(x, 2000)) }
export function parseDMPack(value: unknown): DMPack {
  if (!obj(value) || (value.version !== 1 && value.version !== 2) || !txt(value.title, 240) || !Array.isArray(value.quests) || !value.quests.length || value.quests.length > 30) throw new Error('DM paketi biçimi geçersiz.')
  const ids = new Set<string>()
  const quests: DMQuest[] = value.quests.map(q => {
    if (!obj(q) || !txt(q.id, 160) || !q.id || ids.has(q.id) || !txt(q.title, 240) || !txt(q.body)) throw new Error('DM görev kaydı geçersiz.')
    ids.add(q.id)
    const result: DMQuest = {id:q.id,title:q.title,body:q.body}
    if (txt(q.location, 160)) result.location = q.location
    if (txt(q.objective, 2000)) result.objective = q.objective
    if (texts(q.people)) result.people = q.people
    if (q.steps !== undefined) {
      if (!Array.isArray(q.steps) || !q.steps.length || q.steps.length > 12) throw new Error('Görev sahneleri geçersiz.')
      result.steps = q.steps.map(step => {
        if (!obj(step) || !txt(step.id,160) || !txt(step.title,240) || !txt(step.summary,4000) || !txt(step.readAloud,8000) || !texts(step.actions) || !texts(step.checks) || !texts(step.portraitIds,8) || !txt(step.backgroundId,160) || !txt(step.publicTitle,120) || !Array.isArray(step.choices) || step.choices.length > 8) throw new Error('Sahne rehberi geçersiz.')
        const choices = step.choices.map(c => { if (!obj(c) || !txt(c.label,500) || !txt(c.result,3000) || !txt(c.echo,3000)) throw new Error('Karar kaydı geçersiz.'); return {label:c.label,result:c.result,echo:c.echo} })
        return {id:step.id,title:step.title,summary:step.summary,readAloud:step.readAloud,actions:step.actions,checks:step.checks,backgroundId:step.backgroundId,portraitIds:step.portraitIds,publicTitle:step.publicTitle,choices,...(obj(step.publicNames)?{publicNames:Object.fromEntries(Object.entries(step.publicNames).filter(([k,v])=>k.length<=160&&txt(v,100)).map(([k,v])=>[k,String(v)]))}:{}),...(Array.isArray(step.exits)?{exits:step.exits.slice(0,12).filter(e=>obj(e)&&txt(e.label,160)&&txt(e.sceneId,160)).map(e=>({label:e.label as string,sceneId:e.sceneId as string}))}:{})}
      })
    }
    return result
  })
  const pack: DMPack = { version:value.version as 1|2, title:value.title,quests }
  if (obj(value.progress)) pack.progress = parseProgress(value.progress, quests)
  return pack
}
export function parseProgress(value: unknown, quests: DMQuest[]): DMProgress {
  const p = obj(value) ? value : {}, ids = new Set(quests.map(q=>q.id))
  return { skipped:Array.isArray(p.skipped)?p.skipped.filter((v):v is string=>typeof v==='string').slice(0,360):[], quest: typeof p.quest==='string' && ids.has(p.quest) ? p.quest : quests[0]?.id || '',
    steps: Object.fromEntries(quests.map(q=>[q.id, obj(p.steps) && Number.isInteger(p.steps[q.id]) ? Math.max(0,Math.min((q.steps?.length || 1)-1,Number(p.steps[q.id]))) : 0])),
    done: Array.isArray(p.done) ? p.done.filter((id):id is string=>typeof id==='string' && ids.has(id)) : [],
    decisions:Object.fromEntries(quests.map(q=>[q.id,obj(p.decisions) && txt(p.decisions[q.id],10000) ? String(p.decisions[q.id]) : ''])) }
}
export function readPrivatePack(): DMPack | null { try { const raw=localStorage.getItem('aruzahr-director-pack'); return raw ? parseDMPack(JSON.parse(raw)) : null } catch { return null } }
export function downloadPrivateNotes() {
 const pack=readPrivatePack(), notes=localStorage.getItem('aruzahr-director-notes') || ''
 if (pack) { try {pack.progress=parseProgress(JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}'),pack.quests)} catch { /* default progress */ } }
 const blob=new Blob([pack ? JSON.stringify(pack,null,2) : notes],{type:pack?'application/json;charset=utf-8':'text/plain;charset=utf-8'})
 const url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download=pack?'Aruzahr-Ozel-DM.json':'Aruzahr-DM-Notlari.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
