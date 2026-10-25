/** Player-safe job-board hooks. Resolutions and encounter notes live outside the repository. */
export type AdventureHook = {
  id: string
  title: string
  locationId: string
  locationName: string
  pitch: string
  stakes: string
  contactIds: string[]
  duration: string
  kind: string
}

export const adventureHooks: AdventureHook[] = [
  {
    id: 'son-sicak-tas', title: 'Son Sıcak Tas', locationId: 'marhalden', locationName: 'Marhalden',
    pitch: 'Sela Varn’ın kapı dışında yemek bekleyen komşuları, kırık ocak yüzünden bugün sıcak tas alamayabilir. Batıya götürülecek demir bilezik aynı ocağı çalıştırabilir; Sela hem bu yardımı hem Harven’e verdiği teslim sözünü taşıyacak bir ekip arıyor.',
    stakes: 'Bir tarafta soğukta beklenen yemek, diğer tarafta yedek parçasını bekleyen bir soba var. Kısıtlı vakit ve malzemeyle verilen sözlerin bedeli görünür kalıyor.',
    contactIds: ['sela-varn', 'karven-oll'], duration: '45–60 dakika', kind: 'Sevk ve müzakere',
  },
  {
    id: 'nobetin-payi', title: 'Nöbetin Payı', locationId: 'harven', locationName: 'Harven',
    pitch: 'Deren Olm’un odun kızağı buzlu çekim izinde yan yatmış; yük dönmezse Harven’de ocaklar bu gece erken sönecek. Yardıma gelecek aynı iki kişi garnizonun gözetleme yerinde bekleniyor.',
    stakes: 'Önce kayan yükü durdurmak, ardından eldeki insanlarla odunu ve nöbeti yetiştirmek gerekiyor. Para, aynı kişileri aynı saatte iki yerde çalıştıramıyor.',
    contactIds: ['deren-olm', 'sela-varn'], duration: '45–60 dakika', kind: 'Paylaşım ve saha işi',
  },
  {
    id: 'kosumun-bedeli', title: 'Koşumun Bedeli', locationId: 'mavric', locationName: 'Mavric',
    pitch: 'Aysra Tann’ın masasında kopmuş bir koşum ve tamir karşılığı bırakılan bir aile ziyneti duruyor. Ziynetini geri isteyen yolcu, onu elinde tutan alıcı bugün Mavric’ten ayrılmadan sözünü duyurmak istiyor.',
    stakes: 'Yola çıkmak, yadigârı geri almak ve geçmişini herkesin önünde anlatmadan güvende kalmak aynı anın ihtiyacı. Bir bedeli ödemek, bir başkasının adını açıklama hakkı vermiyor.',
    contactIds: ['aysra-tann'], duration: '60–75 dakika', kind: 'Tanıklık ve pazarlık',
  },
  {
    id: 'kirik-kanat-sirasi', title: 'Kırık Kanat Sırası', locationId: 'frostbay', locationName: 'Frostbay',
    pitch: 'Hessa Rund bugün akşam yemeği için bir çuval arpa bekliyor. Ovel Sarn’ın kırılan ortak kızağı ise yaralı bir yükçünün ücretini ve dört hanenin yakacağını aynı taş eşikte durdurmuş; taşıyacak ellere ihtiyaç var.',
    stakes: 'Sıcak yemek acele istiyor; yakacak bekleyen hanelerle çalışamayacak yükçünün payı da bugüne ait. Bir yükü öne almak, geride kimin bekleyeceğini konuşmayı gerektiriyor.',
    contactIds: ['ovel-sarn', 'ivren-vask', 'hessa-rund'], duration: '45–60 dakika', kind: 'Teslim ve ortak çalışma',
  },
  {
    id: 'yapilmamis-yolun-aletleri', title: 'Yapılmamış Yolun Aletleri', locationId: 'frostbay', locationName: 'Frostbay',
    pitch: 'Ovel Sarn, evinin su alan çatısını bugün kapatmak için Cevher Çizgisi’nden kalma ağır aletleri ödünç almış. Aynı aletler Yük Evi’nin kaygan basamaklarına da gerekiyor; hava kararmadan tek ekibin iki tamire yetişmesi zor.',
    stakes: 'Ovel’in evindeki kuru yatakla taşıyıcıların güvenli geçişi aynı aletlere ve gündüz emeğine bakıyor. İşlerden biri ertelenirse bunu kimin üstleneceği açıkça seçilmeli.',
    contactIds: ['ovel-sarn', 'ivren-vask', 'sela-varn'], duration: '45–60 dakika', kind: 'Yerel onarım ve hesap verme',
  },
]
