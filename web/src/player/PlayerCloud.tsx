import { useState } from 'react';
import { exportPlayerCharacter, parsePlayerCharacter } from './model';
import type { PlayerCharacter } from './types';
import { newPlayerId } from './model';
import { cloudUrl as url, cloudPublicKey as key } from './cloud-config';
import './player-cloud.css';

type Session = { access_token: string; user: {id: string; email?: string} };
type Snapshot = { id: string; name: string; created_at: string };

export default function PlayerCloud({players,onRestore}:{players:PlayerCharacter[];onRestore:(c:PlayerCharacter)=>void}) {
  const [email,setEmail]=useState(''), [password,setPassword]=useState('');
  const [session,setSession]=useState<Session|null>(null), [rows,setRows]=useState<Snapshot[]>([]);
  const [message,setMessage]=useState(''), [busy,setBusy]=useState(false);
  const [selected,setSelected]=useState('');
  if (!url || !key) return <details className="pw-section"><summary>Hesabım ve bulut kayıtları</summary><p>Bulut bağlantısı henüz kurulmadı. Karakterlerin bu cihazda saklanmaya devam eder; JSON yedeğini indirebilirsin.</p></details>;
  async function request(path:string, options:RequestInit={}, token?:string) {
    const response=await fetch(`${url}${path}`,{...options,signal:AbortSignal.timeout(20000),headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...options.headers}});
    const data=await response.json().catch(()=>null);
    if(data?.code==='PGRST205'||data?.code==='42P01')throw Error('Bulut tablosu henüz kurulmamış. Site yöneticisi Supabase SQL Editor içinde player-snapshots.sql kurulumunu çalıştırmalı.');
    if(data?.error_code==='invalid_credentials')throw Error('E-posta veya parola yanlış. E-posta doğrulamasını da tamamladığından emin ol.');
    if(data?.error_code==='email_not_confirmed')throw Error('Önce e-postana gelen doğrulama bağlantısını aç.');
    if(!response.ok) throw Error(response.status===401?'Oturum süresi dolmuş olabilir; tekrar giriş yap.':data?.msg||data?.error_description||data?.message||'Bulut işlemi tamamlanamadı.');
    return data;
  }
  async function run(action:()=>Promise<void>) {
    setBusy(true);setMessage('');try{await action();}catch(e){setMessage(e instanceof Error?e.message:'Bağlantı kurulamadı.');}finally{setBusy(false);}
  }
  async function list(s:Session) {
    const data=await request('/rest/v1/player_snapshots?select=id,name,created_at&order=created_at.desc&limit=100',{},s.access_token);
    setRows(data);
  }
  return <details className="pw-section pw-cloud"><summary>Hesabım ve bulut kayıtları</summary>
    <p>Her oyuncu kendi hesabını kullanır. Buluta kaydet, sonra diğer cihazında giriş yapıp bir kopyasını aç. Yerel karakterlerin otomatik silinmez veya değiştirilmez.</p>
    <fieldset disabled={busy} style={{border:0,padding:0,display:'grid',gap:12}}>
    {!session ? <form style={{display:'grid',gap:12}} onSubmit={e=>{e.preventDefault();void run(async()=>{
      const s=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
      setSession(s);setPassword('');await list(s);setMessage('Giriş yapıldı. Bulut kayıtların aşağıda.');
    });}}>
      <label>E-posta<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
      <label>Parola<input type="password" minLength={8} autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      <button type="submit">Giriş yap</button>
      <button type="button" disabled={!email||password.length<8} onClick={()=>void run(async()=>{
        await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password})});setPassword('');setMessage('Hesap isteği alındı. E-postana gelen doğrulama bağlantısını aç, ardından burada giriş yap.');
      })}>Ücretsiz hesap oluştur</button>
    </form> : <>
      <p>{session.user.email} · Oturum bu sekmede tutulur. Sayfayı yenilersen yeniden giriş yaparsın.</p>
      <label>Kaydedilecek karakter<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Karakter seç</option>{players.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <button disabled={!selected} onClick={()=>void run(async()=>{
        const c=players.find(p=>p.id===selected);if(!c)throw Error('Önce karakter seç.');
        const payload=JSON.parse(exportPlayerCharacter(c));
        if(new TextEncoder().encode(JSON.stringify(payload)).length>750000)throw Error('Bulut kaydı 750 KB sınırını aşıyor. Portreyi küçült veya JSON yedeği kullan.');
        await request('/rest/v1/player_snapshots',{method:'POST',body:JSON.stringify({owner_id:session.user.id,name:c.name,payload})},session.access_token);
        await list(session);setMessage('Yeni bulut yedeği kaydedildi. Önceki sürümler korundu.');
      })}>Buluta yeni yedek kaydet</button>
      <button onClick={()=>void run(()=>list(session))}>Bulut listesini yenile</button>
      <button onClick={()=>void run(async()=>{try{await request('/auth/v1/logout',{method:'POST'},session.access_token);}finally{setSession(null);setRows([]);setMessage('Bu cihazdaki karakterler korunuyor.');}})}>Çıkış yap</button>
      {rows.length===0&&<p>Henüz bulut kaydı yok.</p>}
      {rows.map(row=><div key={row.id}><strong>{row.name}</strong> · {new Date(row.created_at).toLocaleString('tr-TR')} <button onClick={()=>void run(async()=>{
        const found=await request(`/rest/v1/player_snapshots?id=eq.${encodeURIComponent(row.id)}&select=payload`,{},session.access_token);
        if(!found?.[0])throw Error('Bu bulut yedeği artık bulunamıyor; listeyi yenile.');
        const c=parsePlayerCharacter(found[0].payload);onRestore({...c,id:newPlayerId(),name:`${c.name.slice(0,150)} (buluttan)`,updatedAt:new Date().toISOString()});setMessage('Yerel kopya açıldı. Eski karakterlere dokunulmadı.');
      })}>Cihazıma kopyala</button> <button onClick={()=>{if(window.confirm(`${row.name} bulut yedeği silinsin mi? Yerel karakter silinmez.`))void run(async()=>{await request(`/rest/v1/player_snapshots?id=eq.${encodeURIComponent(row.id)}`,{method:"DELETE"},session.access_token);await list(session);setMessage("Seçili bulut yedeği silindi.");});}}>Yedeği sil</button></div>)}
      <p>En yeni 100 yedek gösterilir. Bu sürüm ortak canlı düzenleme veya otomatik eşitleme yapmaz.</p>
    </>}
    </fieldset><p role="status" aria-live="polite">{busy?'İşlem sürüyor…':message}</p>
  </details>;
}
