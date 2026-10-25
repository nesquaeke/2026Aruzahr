import type { LoreArticle } from '../data'
import type { Character } from './characters'

// Authorised new public writing, 24 October 2026. Local sites inherit an existing
// settlement's atlas location. None of these records assigns new coordinates.
export const hardlaneSessionSource = '24 Ekim 2026 · Marhalden–Hardlane seferi için yeni kamusal yazar lore’u'

const hardlaneSessionRecords: LoreArticle[] = [
  {
    id: 'sela-varn', name: 'Sela Varn', kind: 'person', region: 'danstsud', mapLocation: 'marhalden',
    subtitle: 'Batıya giden yüklerin sevk kâtibi',
    summary: 'Sela, Marhalden’den çıkan arpa çuvalını, demir aksamı ve taşıyıcının alacağını aynı teslim defterinde takip eder. Onun işi kapı izni vermek değil, üstlenilen sevkin ne olduğunu herkesin okuyabilmesini sağlamaktır.',
    sources: [hardlaneSessionSource], related: ['marhalden', 'marhalden-aktarma-avlusu', 'karven-oll', 'ivren-vask'],
    sections: [
      { title: 'Eksik bir satırdan kalan iş', paragraphs: [
        'Sela, Uldar’dan gelen erzak arabalarının yanında, çuval diken annesine yardım ederek büyüdü. Gençliğinde teslim edilmiş bir yükün taşıma ücreti, belgede yalnız malın adı bulunduğu için haftalarca ödenmedi. Annesi yeni çuval dikmeye devam ederken aynı ipi ikinci kez borç almak zorunda kaldı. Sela hesap öğrenmeye bundan sonra başladı.',
        'Marhalden’in satış koluna bağlı ticarethanelerde kopya çıkararak çalıştı; bugün batı sevklerinde alıcı, tartı, taşıma ücreti ve yükün hangi noktada yeniden bağlanacağını ayrı ayrı yazar. Karven Oll’un satış hesabını bilir, fakat bir kâtibin imzasını lordun geçit izni veya Üç Mühür’ün ortak kararı diye sunmaz. Çalışma masası Aktarma Avlusu’ndadır.',
      ] },
      { title: 'Defterin iki ucundaki insanlar', paragraphs: [
        'Harven’de Deren’in sayım çubuğunu, Mavric’te Aysra’nın tamir işaretini, Frostbay’de Ivren’in teslim nüshasını tanır. Başkasının emeğini bir kâğıtta görünür kılmaya uğraşırken çok sayıda kopya istemesi yükçülerin sabrını tüketebilir. Sözle verilen iyi bir niyeti, karşı tarafın hiç duymadığı bir borca çevirmemeye çalışır.',
        'Otuzlarının sonlarında, kısa koyu kestane saçlı bir insandır. Kömür grisi yün kolluklarının kenarı mürekkeple sertleşmiştir; sayım sırasında ölçü ipini sol avucuna doladığı için orada kalıcı gibi duran bir leke vardır. Bir görüşmede önce adını, sonra hangi iş için ücret beklendiğini sorar.',
      ] },
    ],
  },
  {
    id: 'deren-olm', name: 'Deren Olm', kind: 'person', region: 'danstsud', mapLocation: 'harven',
    subtitle: 'Harven’in odun ve yük sayıcısı',
    summary: 'Deren, Harven’de hanelerin çıkardığı odunu, teslim edilen erzağı ve taşıma sırasını sayar. Aynı malın iki kere vaat edilmesini önlemek için çentikli çubuğunun karşı parçasını yük sahibine verir.',
    sources: [hardlaneSessionSource], related: ['harven', 'harven-pay-sundurmasi', 'sela-varn', 'marhalden-lordlugu'],
    sections: [
      { title: 'Odunun yaş ve kuru hesabı', paragraphs: [
        'Deren Harven’de oduncuların yanında yetişti. Gençken aynı ağırlıktaki iki yükün aynı işi görmediğini, yaş odunun bir evin ocağında kışı uzatamadığını öğrendi. Bir teslimde yalnız tartıya güvenip kuruluk işaretini atladığında komşularının yeniden oduna çıkmasına yardım etmek zorunda kaldı. Bugün kütüğün kesim zamanını çentiklerin arasına koyduğu küçük çizgiyle belirtir.',
        'Haneler onun sayımını kullanmaya başlayınca garnizon teslimlerinin karşı tanıklığına da çağrıldı. Marhalden askerlerinin korumasının önemini bilir; aynı zamanda nöbetin, katırın ve yakacağın her birinin bir hanenin emeğinden geldiğini hatırlatır. Vergi oranı belirlemez ve askerî emir vermez. Sayımını okuyup itiraz edebilecek ikinci bir kişi bulunmasını ister.',
      ] },
      { title: 'Sundurmada görülen yüz', paragraphs: [
        'Sela’nın sevk nüshalarıyla kendi çubuklarını karşılaştırır; Mavric’e giden taşıyıcıları koşum bakımı için Aysra’ya yollar. Köyde köle ve yağma artığı ziynet ticaretinin bulunması, onun baktığı her odun yükünü aynı ticaretin parçası yapmaz. Bir çentiğin neyi doğruladığını ve neyi doğrulamadığını açıkça söyler.',
        'Ellili yaşlarının başında, kısa kırçıl sakallı, rüzgârla kızarmış açık tenli bir insandır. Ağır kahverengi yün ceketinin belinde çentikli çubuklar, omzunda küçük bir odun kancası taşır. Hızlı konuşan birine cevap vermeden önce çubuğun iki parçasını yan yana getirir.',
      ] },
    ],
  },
  {
    id: 'aysra-tann', name: 'Aysra Tann', kind: 'person', region: 'danstsud', mapLocation: 'mavric',
    subtitle: 'Mavric’te kızak ve koşum ustası',
    summary: 'Aysra, Mavric’in yük kızaklarını ve hayvan koşumlarını onarır. Bir kayışın taşıyacağı ağırlığı söylemeden fiyat vermez; yolun sertliğini müşterinin acele etmesine göre değiştiremez.',
    sources: [hardlaneSessionSource], related: ['mavric', 'mavric-kosum-ocagi', 'deren-olm', 'sela-varn'],
    sections: [
      { title: 'Tamir ederek öğrenilen ölçü', paragraphs: [
        'Aysra’nın ailesi Mavric’te av postlarını kurutup dikerdi. İlk koşumunu ailede kalan küçük deri parçalarından yaptı; kayışın ek yeri ilk ağır yükte açıldı. Kazadan sonra onu yanına alan bir kızak ustası, sağlam dikiş kadar yükün nereye bastığını okumayı öğretti. Aysra artık eski kayışı sökmeden yenisini dikmez.',
        'Koşum Ocağı’nda taşınacak ağırlığı, hayvanın sırtındaki izleri ve yolcunun yedek ipini birlikte inceler. Odun, av ürünü veya para karşılığı çalışabilir; yardım için ayırdığı vakti de hesabından gizlemez. Kimsenin bedenini ücretinin karşılığı kabul etmez; bir başkasının emeğini ancak o kişinin kendi rızasıyla işe katabilir. Bu açık tutumu, köydeki her tüccarla rahat anlaşmasını sağlamaz.',
      ] },
      { title: 'İşliğin kapısı', paragraphs: [
        'Deren bazen çentikli sayım çubuğuyla bir sevkin ağırlığını getirir; Sela’nın nüshaları Aysra’nın yaptığı tamirin hangi yük için istendiğini gösterir. Yine de bir kâğıdı okuyarak kayışı sağlam ilan etmez. İşin kendisini denemek ister. Yardım isteyen yolcuya önce neyi tamir edebileceğini, sonra hangisine malzemesi yetmediğini söyler.',
        'Altmışlarında, geniş omuzlu, örgülü gri saçlı ve orta koyulukta tenli bir insandır. Sol kaşının yanında eski küçük bir yara, koyu mavi yününün üstünde aşınmış deri önlük vardır. Kemik saplı bizini masaya bırakırken ucunu her zaman kendisine çevirir.',
      ] },
    ],
  },
  {
    id: 'ovel-sarn', name: 'Ovel Sarn', kind: 'person', region: 'danstsud', mapLocation: 'frostbay',
    subtitle: 'Kırık Kanat taşıyıcılarının sözcüsü',
    summary: 'Ovel, Frostbay’in Kırık Kanat kesiminde yükçülerin iş sırasını ve ortak kızakların bakımını takip eder. Bir günlük kazancı tartışırken yaralı bir taşıyıcının ertesi sabahını da hesaba katmaya çalışır.',
    sources: [hardlaneSessionSource], related: ['frostbay', 'frostbay-kirik-kanat-yuk-evi', 'ivren-vask', 'hessa-rund', 'nera-veld'],
    sections: [
      { title: 'Omuzdan kızağa geçen yük', paragraphs: [
        'Ovel gençliğinde Yamaiskele’de çuval taşıdı. Düşen bir paketi tek başına yakalamaya çalışırken omzunu incitmesi, yük sırasının dışında kalanların ne kadar çabuk borçlandığını gösterdi. İyileştikten sonra ortak kızakların kurulmasına emek verdi; kızak başına bakım payı istemesi bazı arkadaşlarının o günkü ücretini azalttı, fakat her kırık milde işin durmasını da hafifletti.',
        'Kırık Kanat’taki eski değirmen gövdelerinden birinin alt bölümünde kurulan Yük Evi’nde iş dağıtımına aracılık eder. Nera Veld’in memuru veya bütün limanın lonca başkanı değildir. Onu sözcü seçen taşıyıcılar kararlarını tartışabilir; yalnız daha yüksek sesle konuşması bir yük üzerinde hak yaratmaz.',
      ] },
      { title: 'Sırayı konuşmak', paragraphs: [
        'Ivren Vask’ın tartı masasına malın ölçüsünü, Hessa Rund’ın kazanına erzağın ne zaman varabileceğini bildirir. Aşevi için yapılan ücretsiz indirmelerin de aynı işçilerin sofrasından vakit aldığını görür. Yardım ile ücret arasındaki tartışmayı sona erdirecek tek bir kuralı olduğunu iddia etmez; bedelin hangi omza yüklendiğinin söylenmesini ister.',
        'Kırklı yaşlarının ortasında, esmer tenli, uzun yüzlü bir insandır. Kıvırcık siyah saçlarına birkaç ak tel karışır. Yamalanmış zeytin yeşili paltosunda pas kırmızısı atkı, elinde küçük pirinç kefeli terazi taşır. Terazinin kefelerine dokunmadan konuşmakta zorlanır.',
      ] },
    ],
  },
  {
    id: 'marhalden-aktarma-avlusu', name: 'Aktarma Avlusu', kind: 'geography', region: 'danstsud', mapLocation: 'marhalden',
    subtitle: 'Marhalden’de batı yükünün yeniden bağlandığı yer',
    summary: 'Kapı hizmet alanına bağlı Aktarma Avlusu’nda doğunun araba yükü batının değişken yerel izlerine uygun daha küçük parçalara ayrılır. Sela Varn’ın teslim masası, ip germe kazıkları ve geçici yük sundurmaları aynı dar alanı paylaşır.',
    sources: [hardlaneSessionSource], related: ['marhalden', 'sela-varn', 'marhalden-uc-muhur'],
    sections: [{ title: 'Yük ve geçişin ayrı işleri', paragraphs: [
      'Avlu, mevcut Marhalden yerleşiminin yerel hizmet mekânıdır; ayrı bir şehir veya haritada yeni bir geçit değildir. Burada yük hazırlamak, kapalı mülteci girişini açmaz. Batıya gidecek yükle şehirde oturma izni isteyen bir kişi aynı sırada beklese de aynı işleme tabi değildir.',
      'Taşıyıcılar çuvalı tartar, sıradan demir aksamı kayışa zarar vermeyecek biçimde sarar ve yük hayvanının iki yanını dengeler. Üç Mühür düzenindeki kazı, işleme ve satışın birbirinden ayrı işleri, avluda da malın kaynağıyla kalitesi ve sahibinin ayrı sorularda anılmasıyla görünür olur. Avludaki bir kâtip bütün kollar adına yeni hüküm koyamaz.',
    ] }],
  },
  {
    id: 'harven-pay-sundurmasi', name: 'Pay Sundurması', kind: 'geography', region: 'danstsud', mapLocation: 'harven',
    subtitle: 'Harven’de odunun ve erzağın karşılaştırıldığı yer',
    summary: 'Pay Sundurması, Harven’de odun yığınlarının yanına kurulmuş açık kenarlı bir teslim örtüsüdür. Deren Olm’un çentikli çubukları burada yük sahibinin nüshasıyla karşılaştırılır.',
    sources: [hardlaneSessionSource], related: ['harven', 'deren-olm', 'marhalden-lordlugu'],
    sections: [{ title: 'Sayılan şeyin sınırı', paragraphs: [
      'Sundurmada kuru odun, av ürünü, post ve dışarıdan gelen erzak geçici olarak bekler. Harven’de tarla bulunmaz; gelen bir arpa çuvalı köy hasadı diye yazılmaz. Garnizonun teslim saatiyle hanelerin taşıma sırası aynı çatının altında görüşülebilir, fakat bu çatının kendisi mahkeme veya lordluk makamı değildir.',
      'Her teslimde malı veren ve alan kişinin neye tanıklık ettiği söylenir. Çubukta odun sayısının tutması, yükün geçmişte kimlerin elinden geçtiğinin bütünüyle bilindiğini göstermez. Mekân Harven’e bağlı yerel bir ayrıntıdır ve bağımsız atlas konumu taşımaz.',
    ] }],
  },
  {
    id: 'mavric-kosum-ocagi', name: 'Koşum Ocağı', kind: 'geography', region: 'danstsud', mapLocation: 'mavric',
    subtitle: 'Aysra Tann’ın Mavric’teki küçük tamir işliği',
    summary: 'Kızak mili, koşum kayışı ve yük ipinin onarıldığı Koşum Ocağı, Mavric’in odun ve av taşımacılığına hizmet eder. İçerideki küçük ocak deriyi kurutur ve ustanın elini açar; bütün sokağı ısıtmaz.',
    sources: [hardlaneSessionSource], related: ['mavric', 'aysra-tann'],
    sections: [{ title: 'Bir sonraki yükü taşıyabilmek', paragraphs: [
      'İşlikte asılı eski kayışlar her yolcunun boyuna göre kesilmiş hazır birer koşum değildir. Aysra yükü ve hayvanı görerek çalışır; bakım için ayrılan zamanın daha sonra yolda kaybedilecek vakitle karşılaştırılmasını ister. Burada kullanılan demir gündelik tamir malzemesidir, nadir Veyralt değildir.',
      'Mavric’in av ve odun düzeninin parçası olan işlik, kasabanın bütün ticaretini denetleyen bir kurum sayılmaz. Farklı yük sahipleri aynı kapıya gelebilir. Kamusal ücret ve ağırlık konuşmaları, kimsenin bütün hayat hikâyesini kalabalığa anlatmasını gerektirmez. İşlik mevcut Mavric konumuna bağlıdır.',
    ] }],
  },
  {
    id: 'frostbay-kirik-kanat-yuk-evi', name: 'Kırık Kanat Yük Evi', kind: 'geography', region: 'danstsud', mapLocation: 'frostbay',
    subtitle: 'Eski değirmen gövdesinde ortak kızaklar ve indirme sırası',
    summary: 'Frostbay’in Kırık Kanat kesimindeki bir eski değirmenin alt bölümü, küçük tüccarların ve taşıyıcıların kullandığı Yük Evi’dir. Ovel Sarn burada ortak kızakların bakımını ve iş sırasını görüşür.',
    sources: [hardlaneSessionSource], related: ['frostbay', 'ovel-sarn', 'ivren-vask', 'hessa-rund', 'hardlane-yuk-ve-soz'],
    sections: [{ title: 'Kullanılan eski taş', paragraphs: [
      'Değirmenin kurucusu veya ilk kullanım tarihi bilinmez. İçeriye sonradan yerleştirilmiş tahta raflar, eski taşın biçimine uydurulmuştur. Duvarın dibindeki sıra, kırık kızak milini bekleyen taşıyıcıyla tartı nüshasını bekleyen tüccarı yan yana getirir.',
      'Yük Evi gümrük binası değildir; resmî tartı ve posta işi Ivren’in sınırlı masasına uzanır. Yardım yükünün indirilmesi, taşıyıcıların ücreti ve aletlerin bakımı burada aynı günlük iş içinde konuşulur. Bu yeni yerel ayrıntı, Frostbay’in mevcut mahallelerinin içinde kalır; bağımsız bir harita noktası oluşturmaz.',
    ] }],
  },
  {
    id: 'hardlane-yuk-ve-soz', name: 'Hardlane’de Yük ve Söz', kind: 'culture', region: 'danstsud', mapLocation: 'frostbay',
    subtitle: 'Bir sevkin ardındaki yemek, emek ve bakım',
    summary: 'Marhalden’den batıya çıkan yükün değeri yalnız satış fiyatı değildir. Bir çuvalın kime teslim edildiği, hangi hayvanın taşıdığı ve kırılan aletin kim tarafından onarıldığı, yolun her durağında yeniden konuşulur.',
    sources: [hardlaneSessionSource, 'Hardlane · mevcut kamusal şehir ve Cevher Çizgisi kayıtları'],
    related: ['marhalden', 'harven', 'mavric', 'frostbay', 'ternhaven', 'sela-varn', 'deren-olm', 'aysra-tann', 'ovel-sarn'],
    sections: [
      { title: 'Yol standardı değiştiğinde', paragraphs: [
        'Kralın Yolu Marhalden’de biter. Harven ve Mavric’in garnizon izleriyle Kemiğe Basan Yol’un mevsimlik parçaları, doğudaki bakımlı ağın devamı değildir. Taşıyıcılar bir yolculuğun her parçasında aynı arabayı, aynı ağırlığı veya aynı güvenceyi kullanabileceklerini varsayamaz.',
        'Harven ve Mavric’in Marhalden’le fiilî koruma ve tahsilat ilişkisi, Frostbay’in kâğıt üzerindeki bölge idaresinden ayrı işler. Bir sevkteki imza malı aldığını gösterebilir; başka bir şehirde bütün izinleri yerine getirdiği anlamına gelmez.',
      ] },
      { title: 'Yapılmamış yolun bugünkü hesabı', paragraphs: [
        'Ternhaven ile Marhalden’i bağlaması beklenen Cevher Çizgisi hayata geçmemiştir. Bu beklentiyle ayrılmış aletler, saklanmış listeler ve iş bekleyen ustalar hakkında konuşulması, iki şehir arasında tamamlanmış bir yol bulunduğunu göstermez. Yeni bir yerel tamir de kendi başına o büyük projeyi açmış sayılmaz.',
        'Yük ve bakım üzerine sözlü anlaşmalar Hardlane’in tek bir ortak kanunu değildir. Her yerin elindeki insanı, aleti ve yakacağı farklıdır. Yerel hanelerin bulduğu bir karşılık, bütün mültecileri doyuran veya merkezî güvenliği kuran bir çözüm diye anlatılamaz.',
      ] },
    ],
  },
]

// Character records and their lore articles share the same public biographies.
// No power tier is inferred from a portrait or a civilian job.
const contactDetails: Record<string, { affiliation: string; traits: string[] }> = {
  'sela-varn': { affiliation: 'Marhalden batı sevk masası', traits: ['Teslim hesabı', 'Taşıma emeği', 'Sabırlı kayıt'] },
  'deren-olm': { affiliation: 'Harven yük haneleri', traits: ['Çentikli sayım', 'Odun bilgisi', 'Karşı tanıklık'] },
  'aysra-tann': { affiliation: 'Mavric Koşum Ocağı', traits: ['Koşum tamiri', 'Yük dengesi', 'Açık ücret'] },
  'ovel-sarn': { affiliation: 'Kırık Kanat taşıyıcıları', traits: ['Ortak kızaklar', 'İş sırası', 'Bakım payı'] },
}

export const hardlaneSessionCharacters: Character[] = hardlaneSessionRecords.filter(article => article.kind === 'person').map(article => ({
  id: article.id, name: article.name, role: article.subtitle, city: article.mapLocation!,
  affiliation: contactDetails[article.id].affiliation, portrait: article.id,
  traits: contactDetails[article.id].traits, summary: article.summary,
  background: article.sections[0].paragraphs[0], presence: article.sections[1].paragraphs[0],
  sections: article.sections, related: article.related, source: 'new',
}))

export const hardlaneSessionArticles: LoreArticle[] = hardlaneSessionRecords.filter(article => article.kind !== 'person')
