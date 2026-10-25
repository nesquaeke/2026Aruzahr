/** Shared server/browser allowlist. Private project records never enter this shape. */
const bad = () => {
  throw new Error('Yayın katmanı biçimi geçersiz.')
}
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : bad())
const text = (v, n = 240) =>
  typeof v === 'string' &&
  v.length <= n &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)
    ? v
    : bad()
const num = (v, min, max) =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max
    ? v
    : bad()
const choice = (v, list) => (list.includes(v) ? v : bad())
const arr = (v, max) => (Array.isArray(v) && v.length <= max ? v : bad())
const bool = (v) => (typeof v === 'boolean' ? v : bad())
const id = (v) => text(v, 160)
const soundId = (v) =>
  typeof v === 'string' &&
  (/^[a-f0-9]{64}$/.test(v) ||
    /^builtin-(wind|rain|sea|fire|forest|crowd|cave|caravan|battle|calm|knock|dice)$/.test(
      v,
    ))
    ? v
    : bad()
export function publicStudio(value, image) {
  const s = obj(value),
    r = {
      revision: num(s.revision, 0, Number.MAX_SAFE_INTEGER),
      epoch: id(s.epoch),
      takenAt: num(s.takenAt, 0, 8640000000000000),
      transition: choice(s.transition, ['cut', 'fade', 'dip']),
      weather: choice(s.weather, ['none', 'snow', 'rain', 'fog']),
      layout: choice(s.layout, [
        'left',
        'bottom',
        'sides',
        'scene',
        'map',
        'combat',
      ]),
      cameraSlots: num(s.cameraSlots, 0, 8),
    }
  if (s.crop) {
    const v = obj(s.crop)
    r.crop = {
      x: num(v.x, 0, 100),
      y: num(v.y, 0, 100),
      fit: choice(v.fit, ['cover', 'contain']),
    }
  }
  if (s.highlight) r.highlight = id(s.highlight)
  if (s.reveal) {
    const v = obj(s.reveal)
    r.reveal = { id: id(v.id), name: text(v.name, 160), src: image(v.src) }
  }
  if (s.break) {
    const v = obj(s.break)
    r.break = {
      until: v.until === null ? null : num(v.until, 0, 8640000000000000),
      paused: v.paused === null ? null : num(v.paused, 0, 8640000000000000),
      summary: text(v.summary, 1000),
      campaign: text(v.campaign, 160),
    }
    if (v.ambientId) r.break.ambientId = soundId(v.ambientId)
  }
  if (s.audio) {
    const v = obj(s.audio)
    r.audio = {
      owner: choice(v.owner, ['operator', 'audience', 'off']),
      muted: bool(v.muted),
      fadeMs: num(v.fadeMs, 0, 5000),
    }
    for (const key of ['music', 'ambience', 'effect']) {
      const c = v[key]
      if (c) {
        obj(c)
        r.audio[key] = {
          id: soundId(c.id),
          label: text(c.label, 160),
          volume: num(c.volume, 0, 1),
          playing: bool(c.playing),
          trigger: id(c.trigger),
          loop: bool(c.loop),
          ...(c.at === undefined ? {} : { at: num(c.at, 0, 8640000000000000) }),
        }
      }
    }
  }
  if (s.combat) {
    const v = obj(s.combat)
    r.combat = {
      round: num(v.round, 1, 10000),
      activeId: id(v.activeId),
      showOrder: bool(v.showOrder),
      showRound: bool(v.showRound),
      items: arr(v.items, 80).map((item) => {
        const e = obj(item),
          out = {
            id: id(e.id),
            name: text(e.name, 100),
            active: bool(e.active),
            conditions: arr(e.conditions, 15).map((x) => text(x, 60)),
            concentration: bool(e.concentration),
          }
        if (e.hpText !== undefined) out.hpText = text(e.hpText, 60)
        if (e.percent !== undefined) out.percent = num(e.percent, 0, 100)
        return out
      }),
    }
  }
  if (s.roll) {
    const v = obj(s.roll)
    r.roll = {
      id: id(v.id),
      who: text(v.who, 100),
      label: text(v.label, 120),
      expression: text(v.expression, 160),
      mode: choice(v.mode, ['normal', 'advantage', 'disadvantage']),
      onlyTotal: bool(v.onlyTotal),
      critical: bool(v.critical),
      total: num(v.total, -10000, 10000),
      at: num(v.at, 0, 8640000000000000),
      terms: arr(v.terms, 12).map((term) => {
        const t = obj(term),
          sides = choice(t.sides, [4, 6, 8, 10, 12, 20, 100])
        return {
          sides,
          sign: choice(t.sign, [-1, 1]),
          values: arr(t.values, 24).map((n) => num(n, 1, sides)),
          used: t.used === null ? null : num(t.used, 0, 23),
        }
      }),
    }
  }
  if (r.roll) {
    const roll = r.roll
    const pieces =
      roll.expression
        .replace(/\s+/g, '')
        .toLowerCase()
        .match(/[+-]?[^+-]+/g) || []
    let expected = 0,
      term = 0
    if (roll.terms.length) {
      for (const piece of pieces) {
        const sign = piece.startsWith('-') ? -1 : 1,
          value = piece.replace(/^[+-]/, '')
        if (value.includes('d')) {
          const match = value.match(/^(\d*)d(4|6|8|10|12|20|100)$/)
          if (!match) bad()
          const count = Number(match[1] || 1),
            sides = Number(match[2]),
            t = roll.terms[term++]
          if (
            !t ||
            t.sides !== sides ||
            t.sign !== sign ||
            t.values.some((v) => !Number.isInteger(v))
          )
            bad()
          if (roll.mode === 'normal') {
            if (t.used !== null || t.values.length !== count) bad()
            expected += sign * t.values.reduce((a, b) => a + b, 0)
          } else {
            if (
              count !== 1 ||
              sides !== 20 ||
              t.values.length !== 2 ||
              t.used === null ||
              t.used > 1
            )
              bad()
            const chosen =
              roll.mode === 'advantage'
                ? Math.max(...t.values)
                : Math.min(...t.values)
            if (t.values[t.used] !== chosen) bad()
            expected += sign * chosen
          }
        } else {
          if (!/^\d+$/.test(value)) bad()
          expected += sign * Number(value)
        }
      }
      if (term !== roll.terms.length || expected !== roll.total) bad()
    } else if (!roll.onlyTotal) bad()
    if (roll.onlyTotal) {
      roll.terms = []
      roll.expression = ''
      roll.critical = false
    }
  }
  if (s.markers)
    r.markers = arr(s.markers, 100).map((mark) => {
      const v = obj(mark)
      return {
        id: id(v.id),
        label: text(v.label, 100),
        x: num(v.x, 0, 1),
        y: num(v.y, 0, 1),
        kind: choice(v.kind, ['ping', 'place', 'route']),
        expires: num(v.expires, 0, 8640000000000000),
        color:
          typeof v.color === 'string' && /^#[a-f0-9]{6}$/i.test(v.color)
            ? v.color
            : bad(),
      }
    })
  if (s.poll) {
    const v = obj(s.poll)
    r.poll = {
      id: id(v.id),
      title: text(v.title, 200),
      code: text(v.code, 32),
      open: bool(v.open),
      options: arr(v.options, 6).map((option) => {
        const e = obj(option)
        return {
          id: id(e.id),
          label: text(e.label, 160),
          votes: num(e.votes, 0, 1000000),
        }
      }),
    }
  }
  return r
}
