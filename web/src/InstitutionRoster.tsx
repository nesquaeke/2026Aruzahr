import { useEffect, useState } from 'react'
import { ArrowRight, Building2, ChevronDown, Users } from 'lucide-react'
import CharacterCard from './CharacterCard'
import { characterById } from './lore/characters'
import type { Character } from './lore/characters'
import { portraitFor } from './media'
import './roster.css'

export type InstitutionRosterRecord = { id: string; name: string; city: string; memberIds: string[] }
export function membersOf(roster: InstitutionRosterRecord): Character[] {
  return [...new Set(roster.memberIds)].map(characterById).filter((member): member is Character => !!member)
}

export function CityInstitutions({ rosters, navigate }: { rosters: InstitutionRosterRecord[]; navigate: (route: string) => void }) {
  if (!rosters.length) return null
  return <section className="city-institutions" data-testid="city-institutions">
    <div className="section-heading"><div><span className="eyebrow">ŞEHRİN GÜCÜNÜ TAŞIYANLAR</span><h2>Kurumlar ve birlikler</h2></div><span className="institution-total">{rosters.length} kurum</span></div>
    <div className="city-institution-grid">{rosters.map(roster => {
      const members = membersOf(roster)
      const previews = members.flatMap(member => { const art = portraitFor(member.portrait); return art ? [{ member, art }] : [] }).slice(0, 3)
      return <button className="city-institution-link" key={roster.id} onClick={() => navigate(`/wiki/${roster.id}`)} aria-label={`${roster.name} · ${members.length} kişi · kurum kaydını aç`} data-testid={`institution-link-${roster.id}`}>
        <span className="institution-link-heading"><span className="institution-seal"><Building2 size={21} strokeWidth={1.3} /></span><span><strong>{roster.name}</strong><small>{members.length} kayıtlı kişi</small></span><ArrowRight size={17} /></span>
        <span className="institution-link-bottom"><span className="institution-avatar-stack" aria-hidden="true">{previews.map(({ member, art }) => <img src={art.src} key={member.id} alt="" loading="lazy" />)}{members.length > previews.length && <span>+{members.length - previews.length}</span>}</span><span>Kadroyu tanı</span></span>
      </button>
    })}</div>
  </section>
}

export default function InstitutionRoster({ roster, navigate, openPortrait }: { roster: InstitutionRosterRecord; navigate: (route: string) => void; openPortrait: (artworkId: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const members = membersOf(roster)
  useEffect(() => setExpanded(false), [roster.id])
  if (!members.length) return null
  return <section className="institution-roster" data-testid="institution-roster" data-roster-id={roster.id}>
    <div className="section-heading"><div><span className="eyebrow">MAKAMLARIN ARDINDAKİ YÜZLER</span><h2>Kadro ve sorumluluklar</h2></div><span className="roster-member-count"><Users size={16} />{members.length} kişi</span></div>
    <div className="institution-member-grid">{(expanded ? members : members.slice(0, 6)).map(member => {
      const art = portraitFor(member.portrait)
      return <article className="institution-member" key={member.id} data-member-id={member.id}>
        {art ? <button className="institution-member-portrait" onClick={() => openPortrait(art.id)} aria-label={`${member.name} portresini büyüt`}><CharacterCard id={member.id} src={art.src} name={member.name} role={member.role} /></button> : <div className="institution-member-seal"><Users size={32} /><strong>{member.name}</strong></div>}
        <div className="institution-member-info"><h3>{member.name}</h3><p>{member.role}</p><small>{member.affiliation}</small><button onClick={() => navigate(`/wiki/${member.id}`)} aria-label={`${member.name} hakkında oku`}>Kişiyi tanı<ArrowRight size={15} /></button></div>
      </article>
    })}</div>
    {members.length > 6 && <button className="roster-expand" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Kadroyu daralt' : `Bütün kadroyu göster (${members.length})`}<ChevronDown size={16} /></button>}
  </section>
}
