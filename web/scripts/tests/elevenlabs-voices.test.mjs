import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createVoiceMiddleware, validateVoiceInput, validateVoiceRequest } from '../elevenlabs-voices.mjs'

const secret = 'TEST_ONLY_KEY_NEVER_RETURN'
const requestHeaders = { 'X-Aruzahr-Voice': '1' }
async function serverFor(t, options) {
  const middleware = createVoiceMiddleware(options)
  const server = createServer((req, res) => middleware(req, res, () => { res.writeHead(404); res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const base = `http://127.0.0.1:${server.address().port}/__aruzahr-voices/`
  return (route, options = {}) => fetch(base + route, { ...options, headers: { ...requestHeaders, ...options.headers } })
}
test('voice requests reject LAN, foreign origins, DNS rebinding hosts and missing operator header', () => {
  const req = { socket: { remoteAddress: '127.0.0.1' }, headers: { host: '127.0.0.1:5173', 'x-aruzahr-voice': '1' } }
  assert.doesNotThrow(() => validateVoiceRequest(req))
  for (const value of [
    { ...req, socket: { remoteAddress: '192.168.1.2' } },
    { ...req, headers: { ...req.headers, origin: 'https://foreign.example' } },
    { ...req, headers: { ...req.headers, host: 'attacker.example:5173' } },
    { ...req, headers: { host: '127.0.0.1:5173' } },
  ]) assert.throws(() => validateVoiceRequest(value), { status: 403 })
})
test('text and voice IDs are bounded before sending any provider request', () => {
  assert.deepEqual(validateVoiceInput({ text: '  Birinci söz.\nİkinci söz. ', voiceId: 'voice_1-A' }), { text: 'Birinci söz.\nİkinci söz.', voiceId: 'voice_1-A' })
  for (const input of [{ text: '', voiceId: 'v' }, { text: 'a'.repeat(2501), voiceId: 'v' }, { text: 'Hello', voiceId: '../voices' }, { text: 'Hello\u0000', voiceId: 'v' }]) assert.throws(() => validateVoiceInput(input), { status: 400 })
})
test('unconfigured server reports setup without a key or provider traffic', async t => {
  let calls = 0
  const request = await serverFor(t, { fetchImpl: async () => { calls++; throw new Error('unexpected') } })
  assert.equal((await request('status')).status, 200)
  assert.equal((await (await request('status')).json()).configured, false)
  assert.equal((await request('voices')).status, 503)
  assert.equal(calls, 0)
})
test('voice list strips remote extras; generation keeps credentials and text out of clip metadata', async t => {
  let at = 10_000
  const audio = Buffer.from('ID3\u0004\u0000\u0000test-mp3')
  const calls = []
  const request = await serverFor(t, {
    apiKey: secret, now: () => at,
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      assert.equal(options.headers['xi-api-key'], secret)
      if (url.endsWith('/voices')) return Response.json({ voices: [{ voice_id: 'voice1', name: 'Alçak ses', description: 'Türkçe konuşma', private_key: secret, preview_url: 'https://foreign.example' }] })
      return new Response(audio, { headers: { 'Content-Type': 'audio/mpeg' } })
    },
  })
  const listed = await (await request('voices')).json()
  assert.deepEqual(listed, { voices: [{ id: 'voice1', name: 'Alçak ses', description: 'Türkçe konuşma' }] })
  const result = await request('generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voiceId: 'voice1', text: 'PUBLIC_CHARACTER_WORDS' }) })
  assert.equal(result.status, 200)
  const clip = await result.json()
  assert.match(clip.id, /^[a-f0-9]{48}$/)
  assert.equal(clip.bytes, audio.length)
  assert.equal(JSON.stringify(clip).includes(secret), false)
  assert.equal(JSON.stringify(clip).includes('PUBLIC_CHARACTER_WORDS'), false)
  assert.equal(JSON.parse(calls[1].options.body).model_id, 'eleven_multilingual_v2')
  assert.deepEqual(Buffer.from(await (await request('audio/' + clip.id)).arrayBuffer()), audio)
  const throttled = await request('generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voiceId: 'voice1', text: 'Next' }) })
  assert.equal(throttled.status, 429)
  at += 3_600_001
  assert.equal((await request('audio/' + clip.id)).status, 404)
})
test('provider error body and credentials never reach operator responses', async t => {
  const request = await serverFor(t, { apiKey: secret, fetchImpl: async () => new Response('Error: ' + secret, { status: 401 }) })
  const response = await request('voices')
  assert.equal(response.status, 502)
  const message = await response.text()
  assert.equal(message.includes(secret), false)
  assert.match(message, /ElevenLabs/)
})
test('non-audio generation output is rejected instead of being served as a clip', async t => {
  const request = await serverFor(t, { apiKey: secret, fetchImpl: async () => Response.json({ unexpected: secret }) })
  const response = await request('generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voiceId: 'voice1', text: 'Hello' }) })
  assert.equal(response.status, 502)
  assert.equal((await response.text()).includes(secret), false)
})
test('full reset clears temporary clips without revealing credentials', async t => {
  const request = await serverFor(t, { apiKey: secret, fetchImpl: async () => new Response('ID3test', { headers: { 'Content-Type': 'audio/mpeg' } }) })
  const clip = await (await request('generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voiceId: 'v', text: 'Public words' }) })).json()
  assert.equal((await request('audio/' + clip.id)).status, 200)
  assert.deepEqual(await (await request('reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).json(), { cleared: true })
  assert.equal((await request('audio/' + clip.id)).status, 404)
})
