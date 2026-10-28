import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { BookOpen, Check, ChevronDown, Download, FileJson, Plus, Sparkles, Upload, X } from 'lucide-react'
import { classDefinitions } from './rules'
import { classIds, type ClassId, type PlayerSpell } from './types'
import { customPlayerSpellTemplate, importPlayerSpells, parsePlayerSpellPack, readCustomPlayerSpells } from './spells'
import './spell-archive-tools.css'

type Props = { spells: PlayerSpell[]; onRefresh: () => void; onMessage: (message: string) => void; classId?: ClassId }
type Draft = Omit<PlayerSpell, 'id'>
const schools:Record<string,string> = {abjuration:'Koruma',conjuration:'Çağırma',divination:'Kehanet',enchantment:'Efsun',evocation:'Evokasyon',illusion:'Yanılsama',necromancy:'Nekromansi',transmutation:'Dönüşüm'}
const initialDraft = (classId?: ClassId): Draft => ({ name:'',englishName:'',level:0,school:'abjuration',classes:[classId || 'wizard'],castingTime:'1 eylem',range:'30 fit',components:['V','S'],material:'',duration:'Anlık',concentration:false,ritual:false,description:'',higherLevels:'',source:'Kendi oyun notlarım' })
function slug(value: string) {
  return value.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90) || 'buyu'
}
function uniqueId(name: string, spells: PlayerSpell[]) {
  const used=new Set(spells.map(spell=>spell.id)),base='ozel-'+slug(name)
  let id=base,number=2
  while(used.has(id)) id=base+'-'+number++
  return id
}
function download(name: string, value: unknown) {
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json;charset=utf-8'})),anchor=document.createElement('a')
  anchor.href=url;anchor.download=name;document.body.append(anchor);anchor.click();anchor.remove()
  setTimeout(()=>URL.revokeObjectURL(url),1000)
}
function Field({label,children,hint,wide=false}:{label:string;children:ReactNode;hint?:string;wide?:boolean}) {
  const fieldId=useId()
  const input=isValidElement<{ 'aria-labelledby'?:string;'aria-describedby'?:string }>(children)?cloneElement(children,{'aria-labelledby':fieldId,...(hint?{'aria-describedby':fieldId+'-hint'}:{})}):children
  return <label className={'sat-field'+(wide?' sat-wide':'')}><span id={fieldId}>{label}</span>{input}{hint&&<small id={fieldId+'-hint'}>{hint}</small>}</label>
}

export default function SpellArchiveTools({spells,onRefresh,onMessage,classId}:Props) {
  const prefix=useId(),upload=useRef<HTMLInputElement>(null)
  const [open,setOpen]=useState(false),[draft,setDraft]=useState<Draft>(()=>initialDraft(classId)),[busy,setBusy]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState('')
  useEffect(()=>{if(!open)setDraft(d=>({...d,classes:[classId || 'wizard']}))},[classId,open])
  const customResult=(()=>{try{return {spells:readCustomPlayerSpells(),error:''}}catch(e){return {spells:[] as PlayerSpell[],error:(e as Error).message}}})()
  const customIds=new Set(customResult.spells.map(spell=>spell.id))
  const customCount=customResult.spells.length,basicCount=spells.filter(spell=>spell.level===0).length,builtinCount=spells.filter(spell=>!customIds.has(spell.id)).length
  function patch<K extends keyof Draft>(key:K,value:Draft[K]) {setDraft(d=>({...d,[key]:value}));setError('')}
  function toggleClass(value:ClassId) {patch('classes',draft.classes.includes(value)?draft.classes.filter(id=>id!==value):[...draft.classes,value])}
  function toggleComponent(value:string) {patch('components',draft.components.includes(value)?draft.components.filter(id=>id!==value):[...draft.components,value])}
  function completed(message:string) {setStatus(message);onMessage(message);onRefresh()}
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if(busy)return
    setError('');setStatus('')
    if(!draft.classes.length){setError('Büyünün kullanılabildiği en az bir sınıf seç.');return}
    if(draft.material.trim()&&!draft.components.includes('M')){setError('Malzeme açıklaması için Malzeme bileşenini de işaretle.');return}
    setBusy(true)
    try {
      const current=readCustomPlayerSpells()
      const spell:PlayerSpell={...draft,id:uniqueId(draft.name,[...spells,...current]),name:draft.name.trim(),englishName:draft.englishName.trim(),description:draft.description.trim(),source:draft.source.trim() || 'Kendi oyun notlarım'}
      const pack=parsePlayerSpellPack({version:1,title:'Özel büyüm',source:'Oyuncunun yerel büyü arşivi',spells:[spell]})
      await importPlayerSpells(JSON.stringify(pack))
      setDraft(initialDraft(classId));setOpen(false)
      completed(`${spell.name} arşivine eklendi. Arşivde bulup karakterinin büyü defterine seçebilirsin.`)
    } catch(e) {setError((e as Error).message);onMessage((e as Error).message)}
    finally {setBusy(false)}
  }
  async function importFile(file?:File) {
    if(!file||busy)return
    setBusy(true);setError('');setStatus('')
    try {
      if(file.size>5_000_000)throw Error('Büyü dosyası 5 MB’dan küçük olmalı.')
      const count=await importPlayerSpells(await file.text())
      completed(`${count} büyü kaydı özel arşivine işlendi.`)
    } catch(e) {setError((e as Error).message);onMessage((e as Error).message)}
    finally {setBusy(false);if(upload.current)upload.current.value=''}
  }
  function exportCustom() {
    try {download('Aruzahr-Ozel-Buyu-Arsivi.json',{version:1,title:'Özel büyü arşivim',source:'Oyuncunun yerel büyü kayıtları',spells:readCustomPlayerSpells()});onMessage('Özel büyü arşivin dosya olarak indirildi. Bu dosyayı başka cihazda içe aktarabilirsin.')}
    catch(e){setError((e as Error).message);onMessage((e as Error).message)}
  }
  return <section className="spell-archive-tools" aria-label="Büyü arşivini genişlet" data-testid="spell-archive-tools">
    <div className="sat-overview">
      <div><span className="sat-eyebrow"><BookOpen size={13}/> BÜYÜ KÜTÜPHANEN</span><h3>Bir defterden daha fazlası.</h3><p>2014 kurallarıyla bütün dereceleri incele; kendi büyülerini de aynı arşive ekle.</p></div>
      <dl className="sat-counts"><div><dt>Toplam büyü</dt><dd>{spells.length}</dd></div><div><dt>Basit büyü</dt><dd>{basicCount}</dd></div><div><dt>Özel kayıt</dt><dd>{customCount}</dd></div></dl>
    </div>
    <details className="sat-coverage"><summary>Arşivde neler var? <ChevronDown size={13}/></summary><p>Yerleşik katalog <strong>{builtinCount || 319} açık SRD 5.1 büyüsü</strong> içerir; basit büyüler ve 1–9. dereceler birlikte bulunur. Diğer ek kitapların metinlerini veya kendi oyun notlarını aşağıdaki form ve dosya alanıyla özel arşivine ekleyebilirsin. Özel kayıtlar bu tarayıcıda saklanır; Aruzahr’ın yayımlanmış hikâyesine eklenmiş sayılmaz.</p><p>Sınıf seviyesi ile büyü derecesi farklıdır: örneğin 2. seviye büyücü 1. derece büyüler kullanır. Katalogdaki üst dereceleri inceleyebilir, karakterinin seçebildiklerini ayrıca filtreleyebilirsin. Bu bölüm 2014 düzenini kullanır.</p></details>
    <div className="sat-actions">
      <button type="button" className="sat-add" aria-expanded={open} aria-controls={prefix+'-form'} disabled={busy} onClick={()=>{setOpen(v=>!v);setError('')}}><Plus size={15}/>{open?'Büyü formunu kapat':'Yeni büyü / basit büyü ekle'}</button>
      <button type="button" disabled={busy} onClick={()=>upload.current?.click()}><Upload size={14}/>Büyü dosyası aç</button>
      <button type="button" disabled={busy||!customCount} onClick={exportCustom}><Download size={14}/>Özel arşivimi indir</button>
      <button type="button" disabled={busy} onClick={()=>download('Aruzahr-Buyu-Dosyasi-Sablonu.json',customPlayerSpellTemplate)}><FileJson size={14}/>Dosya şablonu</button>
      <input ref={upload} className="sat-file" type="file" accept=".json,application/json" aria-label="Özel büyü JSON dosyası" onChange={event=>void importFile(event.target.files?.[0])}/>
    </div>
    <p className="sat-storage-note">Formla eklediğin büyü için dosya hazırlaman gerekmez. İndirilen özel arşivi karakter yedeğinle birlikte sakla.</p>
    {(error||customResult.error)&&<p role="alert" className="sat-error">{error||customResult.error}</p>}
    {status&&<p role="status" className="sat-status"><Check size={15}/>{status}</p>}
    {open&&<form id={prefix+'-form'} className="sat-form" onSubmit={event=>void submit(event)}>
      <header><span><Sparkles size={15}/>Özel büyü sayfası</span><button type="button" aria-label="Özel büyü formunu kapat" onClick={()=>setOpen(false)} disabled={busy}><X size={16}/></button></header>
      <div className="sat-form-grid">
        <Field label="Türkçe büyü adı"><input required maxLength={160} value={draft.name} onChange={event=>patch('name',event.target.value)} placeholder="Büyünün adı"/></Field>
        <Field label="Derecesi"><select value={draft.level} onChange={event=>patch('level',Number(event.target.value))}><option value={0}>0 · Basit büyü</option>{Array.from({length:9},(_,i)=><option key={i+1} value={i+1}>{i+1}. derece</option>)}</select></Field>
        <Field label="Büyü etkisi" wide hint="Hedefleri, hasar veya iyileşme zarlarını, kurtulma atışını ve özel sınırları yaz."><textarea required rows={5} maxLength={30000} value={draft.description} onChange={event=>patch('description',event.target.value)} placeholder="Büyü yapıldığında ne olur?"/></Field>
      </div>
      <fieldset className="sat-classes"><legend>Hangi sınıflar kullanabilir?</legend><div>{classIds.map(id=><label key={id}><input type="checkbox" checked={draft.classes.includes(id)} onChange={()=>toggleClass(id)}/><span>{classDefinitions.find(c=>c.id===id)?.name || id}</span></label>)}</div><small>İlk seçim: {classDefinitions.find(c=>c.id===(classId || 'wizard'))?.name}. İstersen birden fazla sınıf seç.</small></fieldset>
      <details className="sat-settings" open><summary>Okul, kullanım ve bileşenler <ChevronDown size={13}/></summary><div className="sat-form-grid">
        <Field label="Büyü okulu"><select value={draft.school} onChange={event=>patch('school',event.target.value)}>{Object.entries(schools).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></Field>
        <Field label="Kullanım süresi"><input required maxLength={300} value={draft.castingTime} onChange={event=>patch('castingTime',event.target.value)} placeholder="Örneğin 1 eylem"/></Field>
        <Field label="Menzil"><input required maxLength={300} value={draft.range} onChange={event=>patch('range',event.target.value)} placeholder="Örneğin 30 fit veya Dokunma"/></Field>
        <Field label="Etki süresi"><input required maxLength={400} value={draft.duration} onChange={event=>patch('duration',event.target.value)} placeholder="Örneğin Anlık veya 1 dakika"/></Field>
      </div><fieldset className="sat-components"><legend>Gerekli bileşenler</legend>{[['V','Söz'],['S','Hareket'],['M','Malzeme']].map(([id,name])=><label key={id}><input type="checkbox" checked={draft.components.includes(id)} onChange={()=>toggleComponent(id)}/>{name}</label>)}</fieldset><div className="sat-form-grid">
        <Field label="Malzeme açıklaması" wide hint="Bedeli ve tüketilip tüketilmediği önemliyse belirt."><input maxLength={5000} value={draft.material} onChange={event=>patch('material',event.target.value)} placeholder="Malzeme gerekmiyorsa boş bırak"/></Field>
      </div><div className="sat-flags"><label><input type="checkbox" checked={draft.concentration} onChange={event=>patch('concentration',event.target.checked)}/>Yoğunlaşma gerektirir</label><label><input type="checkbox" checked={draft.ritual} onChange={event=>patch('ritual',event.target.checked)}/>Ritüel olarak uygulanabilir</label></div></details>
      <details className="sat-settings"><summary>Üst derece, kaynak ve arama adı <ChevronDown size={13}/></summary><div className="sat-form-grid">
        <Field label="Üst derece / seviye artışı" wide><textarea rows={3} maxLength={15000} value={draft.higherLevels} onChange={event=>patch('higherLevels',event.target.value)} placeholder="Daha yüksek yuva veya karakter seviyesi etkisini değiştiriyorsa yaz."/></Field>
        <Field label="Kaynak veya kendi notun"><input maxLength={500} value={draft.source} onChange={event=>patch('source',event.target.value)} placeholder="Örneğin masa kurallarım"/></Field>
        <Field label="İngilizce arama adı · isteğe bağlı"><input maxLength={160} value={draft.englishName} onChange={event=>patch('englishName',event.target.value)}/></Field>
      </div></details>
      <footer><p>Kaydettikten sonra arşivde bulup karakterinin büyü defterine seç. Bu kayıt için ayrı bir kimlik otomatik oluşturulur.</p><button type="button" disabled={busy} onClick={()=>setOpen(false)}>Vazgeç</button><button type="submit" className="sat-save" disabled={busy}>{busy?'Kaydediliyor…':'Büyüyü arşive kaydet'}</button></footer>
    </form>}
  </section>
}
