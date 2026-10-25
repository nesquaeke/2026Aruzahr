/** Remove only this app's records, never unrelated origin storage. */
export async function clearAruzahrData() {
  for (const storage of [localStorage, sessionStorage]) {
    const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i)).filter((key): key is string => !!key && key.startsWith('aruzahr-'))
    for (const key of keys) storage.removeItem(key)
  }
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('aruzahr-broadcast')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(new Error('Yayın kaydı silinemedi. Diğer Aruzahr sekmelerini kapatıp yeniden dene.'))
    request.onblocked = () => reject(new Error('Kayıt başka bir sekmede açık. Diğer Aruzahr sekmelerini kapatıp yeniden dene.'))
  })
  if ('caches' in window) { for (const key of await caches.keys()) if (key.startsWith('aruzahr-')) await caches.delete(key) }
}
