import type { Character } from './characters'

// Authorized new public writing. The named authors of existing books become
// people; anonymous manuscripts remain anonymous. No adventure solutions here.
export const writerCharacters: Character[] = [
  {
    id: 'ivena-sarell', name: 'Ivena Sarell', role: 'Yol araştırmacısı ve gezgin yazar', city: 'ternhaven', affiliation: 'Bağımsız yol defterleri', portrait: 'ivena-sarell', source: 'new', power: 'ordinary',
    traits: ['36 yaşında', 'Mesafeyi yürüyerek ölçer', 'Acele hüküm vermez'],
    summary: 'Ivena, bir güzergâhın kâğıtta çizilmesiyle arabaya geçit vermesi arasındaki farkı araştırır. Ternhaven’de bir yolun yapılmamasının da insanların hayatını değiştirdiğini öğrendi.',
    background: 'Annesi kıyı haneleri arasında kumaş taşırdı; Ivena çocukken teslim günlerini ezberler, sonra bir çizelgenin fırtınayı durdurmadığını görürdü. İlk ücretli yol incelemesinde kısa diye tarif edilen bir patikada yük arabası döndürülemedi. Yolculardan para almamayı seçti; harita sahibinin bir sonraki işini kaybetti. O günden beri bir ölçünün hangi mevsimde alındığını defterin ilk satırına yazar.',
    presence: 'Ocak Meclisi sözcüsü Mera Sorn, onun Cevher Çizgisi notlarını dinler; Ivena da meclisin işçi ve erzak sorularını kendi ölçümlerine ekler. Frostbay’de Bryndon’un bir gözlemini okuyup aynı taşı görmeden alıntı yapmamaya karar verdi. Tek başına bir yolu açacak gücü yoktur. Yolcularla çalışmak ister, fakat bir taşı yerinden sökmelerine razı olmaz: yerinden çıkan kanıtın yönü kaybolur.',
    related: ['kitap-sicak-taslar', 'kitap-yapilmamis-yol', 'mera-sorn', 'bryndon-kiyi-defteri', 'cevher-cizgisi'],
  },
  {
    id: 'mereth-vann', name: 'Mereth Vann', role: 'Maden sevkiyatları karşılaştırma kâtibi', city: 'marhalden', affiliation: 'Üç Mühür çevrelerinin kayıt işleri', portrait: 'mereth-vann', source: 'new', power: 'ordinary',
    traits: ['54 yaşında', 'Ölçünün sahibini sorar', 'Tartışmaya hazırlıklı'],
    summary: 'Mereth, bir cevher yükünün kazıdan satışa kadar üç defterde nasıl değiştiğini izler. Yanlış hesap ile yolsuzluğu aynı sözcükle anlatmaz.',
    background: 'Uldar’dan gelen erzak taşıyıcılarının hesabını tutarak işe başladı. Bir teslimde kardeşinin lehine görünen farkın aslında ıslak çuvaldan doğduğunu buldu. Kardeşi beklediği ek ödemeyi alamadı; Mereth’in taraf tutmadığı haberi ise iki üretim çevresinde iş bulmasını sağladı. Kayıtlardan para kazandığı için kaydın sahibini sorgulamakta zorlandığı günleri saklamaz.',
    presence: 'Tervik Hann’ın ocak teslimlerini Nesra Dolm’un işleme kayıtları ve Karven Oll’un satış ölçüleriyle karşılaştırır. Vessa Thol’a bulguyu söylemeden önce her çevreye açıklama hakkı tanır. Bugünkü amacı ortak bir tartı usulü oluşturmaktır; üç çevrenin de kendi kaydını üstün tutması bunu yavaşlatır. Oyunculardan bir teslimin tanıklarını bulmalarını isteyebilir, fakat peşinen bir suçlu adı vermez.',
    related: ['kitap-uc-agirlik', 'marhalden-uc-muhur', 'tervik-hann', 'nesra-dolm', 'karven-oll', 'vessa-thol'],
  },
  {
    id: 'sela-orven', name: 'Sela Orven', role: 'Dış mahalle dilekçe yazıcısı', city: 'valdareth', affiliation: 'Sabançeper yazı tezgâhı', portrait: 'sela-orven', source: 'new', power: 'ordinary',
    traits: ['42 yaşında', 'İsmi yüksek sesle okur', 'Okuryazarlığı paylaşır'],
    summary: 'Sela, okuyamayan komşuları adına yazdığı dilekçeyi teslim etmeden önce onlara okur. Bir başvurunun kayda girmesiyle cevap almasının aynı şey olmadığını bilir.',
    background: 'Bir fırıncı ailesinde büyüdü; hesapları temiz kâğıt pahalı olduğu için çuval kenarlarına yazmayı öğrendi. Gençken bir kira dilekçesini daha etkili olsun diye kendi sözcükleriyle ağırlaştırdı. Ev sahibine ulaşan suçlama kiracının niyetini aştı, uzlaşma zorlaştı. Şimdi imza atacak kişi her cümleyi duyana kadar kalemini kaldırmaz. Bu usul işini yavaşlatır ve bazı müşterilerin hoşuna gitmez.',
    presence: 'Duvar ustası Erhan Telis yer adlarını ve eski yapı sınırlarını kontrol etmesine yardım eder. Teren Halvek’in memurlarına başvuru numarasını sorar; kendisi bir memur değildir, karar verme yetkisi yoktur. Ücretsiz başvurular için ücretli yazı işlerinden vakit ayırır. Oyuncular tezgâhına geldiklerinde hazır bir komplo değil, iki kurum arasında geri gönderilen gerçek bir dilekçe bulurlar.',
    related: ['kitap-besinci-duvar', 'erhan-telis', 'teren-halvek', 'valdareth-mahalleleri', 'valdareth-kent-hizmetleri'],
  },
  {
    id: 'neral-thes', name: 'Neral Thes', role: 'Theramis nüsha ve ruhsat araştırmacısı', city: 'theramis', affiliation: 'Altın Yılan arşiv çalışma masası', portrait: 'neral-thes', source: 'new', power: 'ordinary',
    traits: ['29 yaşında', 'Çeviri farklarını izler', 'İyi soru sorar'],
    summary: 'Neral, aynı hükmün farklı nüshalarda başka anlamlara gelmesinin izini sürer. Metin bilgisi uygulama ruhsatı değildir; kendisi büyü hizmeti vermeye yetkili sayılmaz.',
    background: 'Theramis’te bir ciltçinin yanında büyüdü. Öğrenciyken eski bir kenar notunu asıl hükmün devamı sanıp kopyaladı; usta okuması hatayı bulduğunda bütün nüshaları geri toplamak için iki hafta dolaştı. Kendisini küçük düşüren bu iş, tarihin ve el değişiminin bir metin kadar önemli olduğunu öğretti. Bir okuma yanlışını saklamaktansa düzeltme yaprağını cilde eklemeyi seçer.',
    presence: 'Mavena Riel’den sicil usullerini öğrenir, Lethan Orve’nin merkez kayıtlarıyla yerel kopyaları karşılaştırır. Elorwynli başkâtip Seldric Nove’ye gönderdiği sorular kısa ve ölçülüdür. Hedefi tek bir tartışmayı kazanmak değil, bir iznin kapsamını herkesin aynı sözcüklerle anlayabilmesidir. Oyunculara asıl metnin yerini söyleyebilir; bir lordun kararını kendi başına bozamaz.',
    related: ['kitap-muhurlu-ruhsat', 'mavena-riel', 'lethan-orve', 'seldric-nove', 'buyu-ruhsatlari'],
  },
  {
    id: 'erhan-telis', name: 'Erhan Telis', role: 'Duvar ustası ve şehir defteri yazarı', city: 'valdareth', affiliation: 'Taş işçileri ve bakım ekipleri', portrait: 'erhan-telis', source: 'new', power: 'ordinary',
    traits: ['63 yaşında', 'Yapının yaşını okur', 'İşçinin saatini sayar'],
    summary: 'Beş Duvarın Gölgesinde’nin yazarı Erhan, başkentin büyümesini resmî yapılardan önce eski derzlerden ve onarılmış kapılardan okur.',
    background: 'Çırakken parlatılmış bir taş yüzünü sağlam duvar sanıp kabul etti. İç dolgunun gevşekliği sonraki onarımda ortaya çıktı; usta işi yeniden açtı, ücretin bir kısmını Erhan karşıladı. Güzel görünen bir işin içeride kimi tehlikeye attığını o günden beri sorar. Yıllarca aynı kentte farklı duvar kuşaklarında çalışması ona bütün mahallelerin aynı onarım sırasını beklemediğini gösterdi.',
    presence: 'Sela Orven’in başvurularına eski kapı ve su oluğu yerlerini işaretler; dilekçenin kararını yazmaz. İaşe ekipleri bir duvarı hemen açmak istediğinde içerideki çatlakların ölçülmesini ister. Geçimini hâlâ küçük bakım işlerinden kazanır. Bir yeri göstermek için oyunculara eşlik edebilir; bir harabenin içinde taşın yaşını tahmin etmek, bütün tarihini bildiği anlamına gelmez.',
    related: ['kitap-bes-duvar', 'kitap-besinci-duvar', 'sela-orven', 'valdareth-mahalleleri'],
  },
  {
    id: 'sella-vorn', name: 'Sella Vorn', role: 'Kıyı çobanı ve hane takvimi yazarı', city: 'frostbay', affiliation: 'Kıyı hanelerinin yem ve yakacak paylaşımı', portrait: 'sella-vorn', source: 'new', power: 'ordinary',
    traits: ['57 yaşında', 'Yem hesabı tutar', 'Az sözle öğretir'],
    summary: 'Kışa Pay Ayırmak’ın yazarı Sella, Frostbay’de hayatta kalmayı sürünün gücünden önce yem, ateş ve komşuluk hesabıyla açıklar.',
    background: 'Gençken bir tervan sürüsünü iyi görünen fakat altı buz tutmuş otlağa erken çıkardı. Hayvanların eve dönüşü uzadı, komşuları kendi kışlık yeminden pay vermek zorunda kaldı. Borcunu tek seferde altınla değil, üç mevsim ortak sürü bakımında çalışarak ödedi. Takvimine yalnız başarılı işleri değil, geciken ve yapılamayan işleri de yazmasının nedeni budur.',
    presence: 'Hessa Rund’ın kıyı aşevine süt payı götürür, yerel otlak gözlemlerini Bryndon’a aktarır. Her sürünün aynı alana çıkmasını istemez; yakınındaki iyi otlağı paylaşmayı savunurken kendi hanesinin kışını tehlikeye atmayacak sınır arar. Yolcular onun defterinden hava tahmini değil, hazırlık bilgisi alır. Bir hayvanın bıraktığı izi okuyabilir; bilmediği bir dağ geçidinde rehberlik sözü vermez.',
    related: ['kitap-kisa-pay', 'hardlane-otlak-hayvanlari', 'bryndon-kiyi-defteri'],
  },
]
