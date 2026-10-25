import { useEffect, useState } from 'react'
import { api } from './connection'
import { freshId } from '../broadcast-state'
import './studio.css'
export default function StudioRemote({ voting = false }: { voting?: boolean }) {
  const params = new URLSearchParams(location.hash.split('?')[1] || ''),
    [code, setCode] = useState(params.get('code') || ''),
    [key, setKey] = useState(''),
    [status, setStatus] = useState(''),
    [value, setValue] = useState<any>(null),
    [voted, setVoted] = useState(false)
  const voter = () => {
    let id = localStorage.getItem('aruzahr-voter')
    if (!id) {
      id = freshId('voter')
      localStorage.setItem('aruzahr-voter', id)
    }
    return id
  }
  async function connect() {
    try {
      if (voting) {
        setValue(await api('vote', { code }))
        setStatus('')
      } else {
        const r = await api('pair', { pin: code })
        setKey(r.key)
        setStatus('Eşleşti')
      }
    } catch (e) {
      setStatus((e as Error).message)
    }
  }
  async function command(action: string, v = '') {
    try {
      setValue(await api('remote', { key, command: { action, value: v } }))
      setStatus('Komut gönderildi')
    } catch (e) {
      setStatus((e as Error).message)
      setKey('')
    }
  }
  useEffect(() => {
    if (!key) return
    const t = setInterval(
      () =>
        api('remote', { key })
          .then(setValue)
          .catch((e) => {
            setStatus(e.message)
            setKey('')
          }),
      2000,
    )
    return () => clearInterval(t)
  }, [key])
  useEffect(() => {
    if (!voting || !code) return
    void connect()
    const timer = setInterval(() => {
      void api('vote', { code })
        .then(setValue)
        .catch((e) => setStatus(e.message))
    }, 3000)
    return () => clearInterval(timer)
  }, [voting, code])
  return (
    <main className="studio-remote">
      <span className="studio-eyebrow">
        ARUZAHR · {voting ? 'İZLEYİCİ OYLAMASI' : 'TELEFON KUMANDASI'}
      </span>
      <h1>{voting ? 'Masaya söz bırak' : 'Hikâyeyi yönet'}</h1>
      {((!key && !voting) || (!value && voting)) && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void connect()
          }}
        >
          <label>
            {voting ? 'Oylama kodu' : 'Ana masadaki eşleştirme kodu'}
            <input
              aria-label="Eşleştirme kodu"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button>Bağlan</button>
        </form>
      )}
      {status && <p role="status">{status}</p>}
      {key && (
        <>
          <p>{value?.title || 'Ana masa bekleniyor'}</p>
          <div className="studio-remote-grid">
            {[
              ['take', 'Yayına al'],
              ['break', 'Ara / devam'],
              ['mute', 'Sessiz / sesli'],
              ['map', 'Haritayı hazırla'],
              ['previous', 'Önceki adım'],
              ['next', 'Sonraki adım'],
              ['roll-d20', 'd20 at'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => void command(id)}>
                {label}
              </button>
            ))}
          </div>
          <h2>Kayıtlı sahneler</h2>
          {value?.scenes?.map((s: any) => (
            <button key={s.id} onClick={() => void command('prepare', s.id)}>
              {s.name} · hazırla
            </button>
          ))}
          <p>Hazırlama yayını değiştirmez. Yayına al ayrı komuttur.</p>
        </>
      )}
      {voting && value && (
        <>
          <h2>{value.title}</h2>
          {value.options.map((o: any) => (
            <button
              key={o.id}
              disabled={voted || !value.open}
              onClick={async () => {
                try {
                  setValue(
                    await api('vote', { code, option: o.id, voter: voter() }),
                  )
                  setVoted(true)
                  setStatus(
                    'Oyun kaydedildi. Son kararı DM ve oyuncular verir.',
                  )
                } catch (e) {
                  setStatus((e as Error).message)
                }
              }}
            >
              {o.label}
              <small> {o.votes} oy</small>
            </button>
          ))}
          <p>
            Bu oylama tarayıcı başına tek oy uygular; kimlik doğrulamalı bir
            yarışma sistemi değildir.
          </p>
        </>
      )}
    </main>
  )
}
