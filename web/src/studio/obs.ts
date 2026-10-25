const b64 = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
const sha = async (text: string) =>
  b64(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))
export class OBSConnection {
  private socket: WebSocket | null = null
  private pending = new Map<
    string,
    { resolve: (v: any) => void; reject: (e: Error) => void; timer: number }
  >()
  onStatus: (text: string) => void = () => {}
  async connect(url: string, password: string) {
    this.disconnect()
    if (!/^wss?:\/\//.test(url))
      throw new Error('OBS için ws:// veya wss:// adresi gerekli.')
    const ws = new WebSocket(url)
    this.socket = ws
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        ws.close()
        reject(new Error('OBS bağlantısı zaman aşımına uğradı.'))
      }, 10000)
      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.op === 0) {
            const auth = msg.d.authentication
            const authentication = auth
              ? await sha((await sha(password + auth.salt)) + auth.challenge)
              : undefined
            ws.send(
              JSON.stringify({
                op: 1,
                d: {
                  rpcVersion: 1,
                  ...(authentication ? { authentication } : {}),
                },
              }),
            )
          }
          if (msg.op === 2) {
            clearTimeout(timer)
            this.onStatus('OBS bağlı')
            resolve()
          }
          if (msg.op === 7) {
            const p = this.pending.get(msg.d.requestId)
            if (p) {
              clearTimeout(p.timer)
              this.pending.delete(msg.d.requestId)
              msg.d.requestStatus.result
                ? p.resolve(msg.d.responseData)
                : p.reject(
                    new Error(
                      msg.d.requestStatus.comment || 'OBS isteği reddetti.',
                    ),
                  )
            }
          }
        } catch (e) {
          clearTimeout(timer)
          reject(e)
        }
      }
      ws.onerror = () => {
        clearTimeout(timer)
        reject(
          new Error(
            'OBS bağlantısı açılamadı. WebSocket sunucusunu kontrol et.',
          ),
        )
      }
      ws.onclose = () => {
        clearTimeout(timer)
        this.onStatus('OBS bağlantısı kapalı')
        for (const p of this.pending.values()) {
          clearTimeout(p.timer)
          p.reject(new Error('OBS bağlantısı kesildi.'))
        }
        this.pending.clear()
        reject(new Error('OBS bağlantısı kapandı.'))
      }
    })
  }
  request(type: string, data: Record<string, unknown> = {}) {
    return new Promise<any>((resolve, reject) => {
      if (this.socket?.readyState !== WebSocket.OPEN) {
        reject(new Error('OBS bağlı değil.'))
        return
      }
      const requestId = crypto.randomUUID(),
        timer = window.setTimeout(() => {
          this.pending.delete(requestId)
          reject(new Error('OBS yanıt vermedi.'))
        }, 8000)
      this.pending.set(requestId, { resolve, reject, timer })
      this.socket.send(
        JSON.stringify({
          op: 6,
          d: { requestType: type, requestId, requestData: data },
        }),
      )
    })
  }
  disconnect() {
    this.socket?.close()
    this.socket = null
    for (const p of this.pending.values()) {
      clearTimeout(p.timer)
      p.reject(new Error('OBS bağlantısı kapatıldı.'))
    }
    this.pending.clear()
  }
}
