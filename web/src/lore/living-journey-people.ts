import type { Character } from './characters'

// New public biographies. Conditional encounters, evidence and outcomes live in
// the operator's campaign pack, never in this directory.
export const livingJourneyPeople: Character[] = [
  {
    id: 'eren-keld',
    name: 'Eren Keld',
    role: 'Galeri bakım ustası',
    city: 'marhalden',
    affiliation: 'Marhalden ortak bakım işlikleri',
    portrait: 'eren-keld',
    source: 'new',
    power: 'ordinary',
    traits: ['Kırk dokuz yaşında', 'Su ve taş ustalığı', 'Çırak yetiştirir'],
    summary:
      'Eren, Marhalden’in sıcak su hatlarını, bakım kapaklarını ve madenci mahallelerine çıkan dar merdivenlerini onarır. Bir suyun nereden geldiğini taşın rengine bakarak kestirebilir; emin olmadığı işte kapıyı kapatıp ölçüm ister.',
    background:
      'Babası ocaklarda tahkimat yapardı. Eren gençliğinde onun yanında kereste taşırken aynı direğin kuru galeride yıllarca, sıcak suyun yanında birkaç ay dayanabildiğini gördü. İşleme koluna geçip vana ve boru bakımını öğrendi. Sol elindeki eski yanık, aceleyle açtığı bir basınç kapağından kaldı; bugün kapağı ilk açacak kişinin yanında mutlaka bir ikinci işçi bulunmasını ister. Bu usul bazı taşeronlara yavaş gelir.',
    presence:
      'Uzun yüzlü, kalın bıyıklı, kısa kır saçlı bir adamdır. Kirli sarı yün yeleğinin altında onarılmış deri kolçak taşır. Sol işaret parmağı tam bükülmez. Ekin Sar’a öğüt verirken elinden işi almaz; önce ne ölçtüğünü sorar. Müşterinin unvanından önce çalışılacak hattın basıncını öğrenmek ister.',
    related: ['marhalden', 'ekin-sar', 'vessa-thol', 'ravel-dorr'],
    sections: [
      {
        title: 'Sıcak suyun yanında büyümek',
        paragraphs: [
          'Eren ilk ücretini bir ocak girişine çatı direği taşıyarak aldı. Yük işinden kalan parayla bir vana ustasının işliğinde yarım gün çıraklık yaptı; kış boyunca kazancı azaldı ama sakatlandığında yalnız kol gücüyle geçinemeyeceğini anlamıştı. Su hattı bakımını öğrenmesi ailesinin gelirini de değiştirdi. Artık yalnız ocak açıldığında çağrılan bir işçi değildi.',
          'Yanıktan sonra dönüş yolunu ve kapatma kolunu görmeden işe girmeyi bıraktı. Her yeni iş için küçük bir tahta üzerine kapağın yerini çizer. İş bitince tahtayı temizleyip yeniden kullanır; kendi arşivini tutacak kadar zengin değildir. Ekin’in çizimleri kâğıtta saklama ısrarını gereksiz masraf sayması, aralarındaki en sık tartışmadır.',
        ],
      },
      {
        title: 'İşliğin payı',
        paragraphs: [
          'Ortak bakım işliği lordluk ordusunun bir birliği değildir. Eren’in yetkisi, teslim aldığı hattı açıp kapatmak ve güvenli bulmadığı işe imza vermemektir. Büyük siparişler lonca görevlilerine gider; ücretini işlik üzerinden alır. Vessa Thol’un baş lonca masasına sunduğu bakım cetvellerinde iş günlerini kısmayı reddettiği için hem destek hem itiraz görür.',
          'Ravel Dorr ile tanışıklığı yıllar önce bir işçinin yanık sargısını değiştirmesine dayanır. Hekim suyun temizliğini, usta suyun nereden geçtiğini sorar. Eren işliği kapalıyken bile komşu revirin donan giderine bakar; bunun karşılığında çırağına ücretsiz tedavi sözü istemeyi kendine yakıştırmaz.',
        ],
      },
      {
        title: 'Karşılaşınca',
        paragraphs: [
          'Konuşurken anahtarı avucunda çevirir. “Kapağı kim tutacak?” sorusuna cevap alamadan basıncı boşaltmaz. Öğüt verdiği gençleri dinlemesi zaman alır; fakat ölçümünün yanlış çıktığı gösterildiğinde kapıya kendi adının yazılmasını ister. Kusuru örtmek, bir sonraki işçinin aynı yere elini sokması demektir.',
        ],
      },
    ],
  },
  {
    id: 'ekin-sar',
    name: 'Ekin Sar',
    role: 'Ölçüm ve bakım çırağı',
    city: 'marhalden',
    affiliation: 'Eren Keld’in işliği',
    portrait: 'ekin-sar',
    source: 'new',
    power: 'ordinary',
    traits: ['On dokuz yaşında', 'Çizerek öğrenir', 'Kuru mizah'],
    summary:
      'Ekin, Marhalden’in su hatlarında çalışan genç bir ölçüm çırağıdır. Bir kapıyı sökmekten önce menteşenin nasıl oturduğunu çizmeyi sever; çizimleri ustaların hafızasına dayanan işlik düzeninde hem işe yarar hem sabır taşırır.',
    background:
      'Uldar çevresinde hayvan ve yük arabası işi yapan bir hanede büyüdü. Kentte çalışan dayısının yanında kış geçirmek için geldiğinde temiz su dağıtımındaki farklılığı fark etti: bir sokak sıcak taşın üstünde kururken iki merdiven ötede kovalar donuyordu. Eren Keld’in işliğinde kalarak bu farkın boru, eğim ve bakım hesabını öğrenmeye başladı. Ücretinin bir kısmını eve yollar; iyi kâğıt alma alışkanlığı kalan payını küçültür.',
    presence:
      'İnce yapılı, kısa siyah bukleli, çenesinde yeni sakal beliren yetişkin bir gençtir. Eski gri yeşil gömleği ve onarılmış iş yeleği vardır. Soruyu anlamak için çizim tahtasını çevirir; dinlemiyormuş gibi görünse de yanlış söylenen ölçüyü biraz sonra kelimesi kelimesine tekrar eder.',
    related: ['marhalden', 'uldar', 'eren-keld', 'kesra-venn'],
    sections: [
      {
        title: 'Ölçünün iki yüzü',
        paragraphs: [
          'Ekin kente ilk geldiğinde sayı yazmakta iyiydi, kesme taşın neden düzgün görünse de yerinden oynadığını anlayamıyordu. Eren ona bir hafta boyunca aynı hattın sabah ve akşam sıcaklığını ölçtürdü. Kâğıttaki doğru sayının tek başına iyi tamir etmediğini o hafta öğrendi; bir işin hangi saatte görüldüğünü de yazmaya başladı.',
          'İşliğin eski kayıtları çoğunlukla ustaların aklındadır. Ekin, kapakların arkasındaki geçitleri ve eski onarımları düzenli çizmek ister. Bunun için Kesra Venn’in masasından artık kâğıt alır; kâtip, çizimin tarihini ve kimin gördüğünü yazmasını şart koşar. Ekin ona temiz kopya bırakır. Bu alışveriş küçük işliğin bilgisini yavaş yavaş ortak kayda taşır.',
        ],
      },
      {
        title: 'Ustasının gölgesinde',
        paragraphs: [
          'Eren işi sağlam teslim etmeyi öğretir; Ekin ise neden her hatanın sözlü bir anı gibi dolaştığını sorar. İyi anlaştıkları günlerde usta tahta üzerindeki şekli işçilere gösterir, çırak da Eren’in kısa tarifini herkesin okuyacağı ölçüye çevirir. Tartıştıklarında Ekin bildiğini kanıtlamak için acele eder. En büyük açığı bilgisizlikten çok, hazırlığının fark edilmesini istemesidir.',
          'Uldar’daki ailesi onun geri dönüp araba bakımına ortak olmasını bekler. Ekin Marhalden’de kalmak ister ama aylık kazancını büyütmeden bunu söyleyemez. Bir yolcu doğudan haber getirdiğinde önce yakınlarını sorar; “Kentli oldun” diye takılanlara güler, ardından aynı gün iki mektup yazar.',
        ],
      },
      {
        title: 'Karşılaşınca',
        paragraphs: [
          'Uzun bir öğüt yerine küçük bir deneme ister: “İpi verin, düğümü gösterin.” Korkusunu belli etmemek için yaptığı kuru şaka bazen saygısızlık sanılır. Birisi onu dikkatle dinlediğinde sesi yumuşar; bir çizimin köşesine o kişinin önerisini eklemek, teşekkür etme biçimidir.',
        ],
      },
    ],
  },
  {
    id: 'kesra-venn',
    name: 'Kesra Venn',
    role: 'Sevk sicili kâtibi',
    city: 'marhalden',
    affiliation: 'Marhalden yük avlusu',
    portrait: 'kesra-venn',
    source: 'new',
    power: 'ordinary',
    traits: ['Otuz altı yaşında', 'İki nüsha', 'Sınırı belli yetki'],
    summary:
      'Kesra, Marhalden yük avlusunda çıkış evrakını, taşıyıcı adlarını ve teslim itirazlarını kaydeder. Mührü bir yükün kim tarafından alındığını gösterir; bir yolun açık veya güvenli olduğunu garanti etmez.',
    background:
      'Tolvur’dan kente gönderilen yün balyalarının tartısını tutan annesinin yanında saymayı öğrendi. Bir kış, teslim alanın adı yazılmadığı için aile üç ay ödeme bekledi. Kesra yazı öğrenip avluya girdiğinde kayıttaki boşlukların bir haneyi nasıl borçlu bıraktığını biliyordu. Bugün iki nüsha tutması ve sözlü değişikliği ayrıca yazdırması, acele eden tüccarlarla arasını sık sık bozar.',
    presence:
      'Koyu tenli, ensesinde sık örgülerini toplamış, dikkatli ela gözlü bir kadındır. Lacivert yün ceketinin manşetleri gridir; başparmağında silinmeyen mürekkep izi vardır. Konuşanı dinlerken kalemini bırakır, cevap verirken tarihe bakar. Sırada bekleyen yoksul bir taşıyıcının sözünü zengin bir müşteri keserse kaldığı cümleyi önce ona tamamlatır.',
    related: ['marhalden', 'tolvur', 'sela-varn', 'ekin-sar', 'vessa-thol'],
    sections: [
      {
        title: 'Bir imzanın süresi',
        paragraphs: [
          'Kesra avludaki ilk yılında okuması zayıf taşıyıcılara aynı formu defalarca açıklamaktan çekinirdi. Hızlı çalıştığı için övülüyordu; sonra bir hamalın, devralmadığı bir arabaya kefil olduğunu öğrendi. Evrakı geri çevirmesi ustasının işini uzattı. Hamalın itirazı kabul edildiğinde Kesra, imzadan önce yükümlülüğü sesli okuma alışkanlığı edindi.',
          'Şimdi masasında biri temiz, biri günlük kullanım için iki kayıt bulunur. Sela Varn gibi sevk düzenleyenlerle çalışır, fakat aynı işi yapmaz: Sela yükün ve yol ekibinin düzenini kurar; Kesra avluya sunulan anlaşmanın kaydını alır. Her ikisi de bir kayışın veya eksik katırın bütün cetveli değiştirebileceğini bilir.',
        ],
      },
      {
        title: 'Kapının ötesi',
        paragraphs: [
          'Marhalden’in kapı kararları ve lordluk emri Kesra’nın yetkisini aşar. Onun yapabildiği, verilen kararın tarihini, belgenin kapsamını ve reddin gerekçesini görünür kılmaktır. İşi bu sınırı saklamadan yürütmeye çalışır; bazen açıkça yardım isteyecek birini yeni bir kâğıtla oyaladığını geç fark eder.',
          'Ekin’in bakım çizimlerine artık kâğıt ayırır. İş bitiminde temiz kopyayı avlu dosyasına koyması için çıraktan tarih ister. Kesra’nın daha küçük hırsı, bir sonraki kış aynı kapak için yeniden kavga edilmemesidir. Bir kayıt boş kaldığında onu tamamlamak için kendi mesaisini uzatması, evde paylaştığı hayatı da sıkıştırır.',
        ],
      },
      {
        title: 'Karşılaşınca',
        paragraphs: [
          'Açıklama isterken üç kısa soru sorar: kim aldı, ne aldı, ne zaman? Karşısındaki bu kadarını bilmiyorsa onu suçlamadan bekler. Çözebileceği bir işi anlattığında kalemi yeniden eline alır. Çözemeyeceği işte ise kimin masasına gidileceğini ve o kişinin hangi belgeyi isteyeceğini tarif eder.',
        ],
      },
    ],
  },
  {
    id: 'haldor-pell',
    name: 'Haldor Pell',
    role: 'Odun alıcısı ve ortak yük tartıcısı',
    city: 'harven',
    affiliation: 'Harven ocak haneleri',
    portrait: 'haldor-pell',
    source: 'new',
    power: 'ordinary',
    traits: ['Elli beş yaşında', 'Islak ağırlığı bilir', 'Dar pazarlık payı'],
    summary:
      'Haldor, Harven’e getirilen yakacak odunu tartar, küçük hanelerin siparişlerini bir araya getirir. Islak odun için fazla ödeme yapmakla kışlık yükü hiç alamamak arasındaki pazarlık, işinin günlük gerilimidir.',
    background:
      'Yıllarca kızak sürerek odun taşıdı. Dizleri uzun sefere dayanmayınca baltacıların ürününü ve hanelerin ihtiyacını tek yükte toplama işine geçti. İlk büyük alışında yağmur yemiş odunun ağırlığına aldandı; birikimini kaybedince ertesi yılın yakacağını peşin borçlanarak çıkardı. O günden beri ölçü çubuğunu ve küçük tartısını arabada aynı yere bağlar.',
    presence:
      'Geniş gövdeli, kırlaşmış açık sakallı, mavi gözlü bir adamdır. Pas rengi başlığının altında saçları seyrektir. Yosun yeşili kalın ceket giyer, konuşurken omzundaki ölçü çubuğunu indirir. Şakası pazarlığı yumuşatır ama bir çuvalın fiyatını sormayı unutmaz.',
    related: ['harven', 'bera-hald', 'aysra-tann', 'mavric'],
    sections: [
      {
        title: 'Bir kızağın hesabı',
        paragraphs: [
          'Haldor’un gençliğinde taşıma işi kendi ailesiyle iki komşu haneyi bir araya getirirdi. Biri kızak, biri hayvan, diğeri para koyardı. Kızak kırılınca masrafı kimin ödeyeceği her seferinde yeniden konuşulurdu. Haldor bugün ortak yük alırken bu ayrıntıları ilk günden sayar; bunun dostluğu bozduğunu söyleyenlere eski borç defterini açar.',
          'Harven’in un ve tahılının önemli kısmı doğudan gelir. Bera Hald’ın ocağı için topladığı odun, dönüşte gelen un arabalarının boş yerinden yararlanabilir. Haldor, taşımacıya aynı yeri iki kişiye satmamasını söyleyebilecek kadar çevre edinmiştir. Büyük bir sevki tek başına finanse edecek gücü yoktur; yerel etkisi, küçük siparişleri zamanında birleştirmesine dayanır.',
        ],
      },
      {
        title: 'Kime ne kadar?',
        paragraphs: [
          'Aysra Tann’ın tamir ettiği yük koşumlarının ücretini bazen odunla öder. Birine yardım ettiğinde bunu ertesi alımda daha ucuz işçilik istemek için kullanması yakınlarını kızdırır. Haldor bu davranışını iyi pazarlık sayar; Bera ise bir yardımın fiyatının sonradan söylenmesine itiraz eder. Birlikte çalışmayı sürdürmeleri, anlaşmalarının her zaman rahat olduğu anlamına gelmez.',
          'Kış başında herkes kuru odun ister. Haldor en iyi ürünün hepsini tek zengin haneye ayırırsa öteki müşterilerini kaybeder; paylaştırırsa peşin para azalır. Bazen küçük hanelerin ödemesini kendi hesabından karşılar, sonra uzun süre susup bekler. İyi niyetini açıkça söylemekte zorlanır, alacağını istemekte de gecikir.',
        ],
      },
      {
        title: 'Karşılaşınca',
        paragraphs: [
          'Önce yüke dokunur, ardından elini koklar. Çok düzgün konuşan bir satıcıya “Şunun da bir kuru yüzünü göster” diye takılır. Yeni gelenin işini bilmiyorsa küçük bir siparişle denemeyi önerir. Söz verildiğinde ertesi sabah hangi kapıda bekleyeceğini mutlaka söyler.',
        ],
      },
    ],
  },
  {
    id: 'veyra-senn',
    name: 'Veyra Senn',
    role: 'Kapan onarıcısı ve orman izcisi',
    city: 'mavric',
    affiliation: 'Mavric av haneleri',
    portrait: 'veyra-senn',
    source: 'new',
    power: 'ordinary',
    traits: ['Yirmi yedi yaşında', 'İşaretli kapanlar', 'Mesafeli güven'],
    summary:
      'Veyra, Mavric çevresindeki av kapanlarını onarır, kırılan yük iplerini ve işaret direklerini kontrol eder. Bir hayvanın geçiş hattını öğrenmekle onu mutlaka avlamak arasında seçim yapılabileceğini savunur.',
    background:
      'Av ürünleri ve odunculukla geçinen bir hanede yetişti. Gençken adsız bırakılmış bir kapanın yük hayvanını sakatlaması, evlerinin haftalarca erzak taşıyamamasına yol açtı. O olaydan sonra onardığı her mekanizmaya sahibinin işaretini koymaya başladı. Bazı avcıların yerlerini belli etmek istememesi yüzünden müşterisini kaybetti; yine de kendi işaretini silerek teslim etmez.',
    presence:
      'Kompakt yapılı, kısa siyah saçlı, koyu gözlü bir kadındır. Çenesinde eski soluk bir iz bulunur. Koyu kahverengi ceketinin yakasında erik rengi yün dolanır. Bir mekanizmaya dokunmadan mandalın açık olup olmadığını iki kez kontrol eder; karşısındakinin elini yanlış yere koyduğunu görürse lafı uzatmadan durdurur.',
    related: ['mavric', 'aysra-tann', 'haldor-pell', 'karlan-canlilari'],
    sections: [
      {
        title: 'Kapanın sahibi',
        paragraphs: [
          'Veyra küçükken avın asıl işinin ormana çıkmak olduğunu sanırdı. Derinin korunması, yağın taşınması ve aracın ertesi gün tekrar çalışması bütün akşamı alırdı. Annesi ona iz sürmeyi, bir komşu usta ise gevşek yayı ayarlamayı öğretti. Ustalığını tek büyük avla değil, geri getirilen aletin aynı yerden bir daha kırılmamasıyla duyurdu.',
          'Sahibi belli olmayan kapanlar yalnız yolculara zarar vermez; av haneleri de birbirinin alanını yanlış okuyabilir. Veyra her alete tanınabilir küçük bir damga koyar. İşareti taşıyan müşterinin hayvanından ve kapanından sorumlu tutulacağını bilmesi, bu basit işin kasabada pazarlık konusu olmasına yol açar. Veyra herkesi ikna etmiş değildir.',
        ],
      },
      {
        title: 'Ormandan gelen geçim',
        paragraphs: [
          'Mavric’te tarım yapılmaması, av ve odun yükünü artırır. Veyra genç bir hayvanın ne zaman yuvasından ayrıldığını, oduncuların hangi hattı ne zaman kullanmasının daha güvenli olacağını izler. Bazen kısa bir patikayı kapatmayı önerir; yüklü kızağı geri çevirmek zorunda kalan Haldor Pell onun öğüdünü pahalı bulur. Kışta hangi kaybın taşınabileceğini her seferinde yeniden tartışırlar.',
          'Aysra Tann’la araç ve koşum tamiri üzerinden tanıştı. Birinin tamir ettiği kayışı ötekinin kapan taşıyan çantasına takarlar. Veyra bir işin bütün bilgisini tek başına tutmayı sever; yardım isteyene önce yaptığı denemeleri sorar. Çabuk yargıladığı bir aceminin dikkatli çalıştığını görünce yanına ikinci bir iş bırakması, güveninin açık işaretidir.',
        ],
      },
      {
        title: 'Karşılaşınca',
        paragraphs: [
          'Duyduğu bir av hikâyesinde önce rüzgârın nereden estiğini sorar. Korkmuş bir hayvanı yola sürmenin kimseye yararı olmadığını söyleyebilir; yine de hanelerin yemek ihtiyacını küçümsemez. Merakına cevap almak isteyenin onunla yürüyüp izleri kendi gözüyle görmesini ister.',
        ],
      },
    ],
  },
  {
    id: 'orsa-dren',
    name: 'Orsa Dren',
    role: 'Kıyı kılavuzu ve iskandil ustası',
    city: 'frostbay',
    affiliation: 'Frostbay kıyı kayıkçıları',
    portrait: 'orsa-dren',
    source: 'new',
    power: 'distinguished',
    traits: ['Altmış üç yaşında', 'Dönüş işareti', 'Kıyı hafızası'],
    summary:
      'Orsa, Frostbay’in dar kıyı geçitlerinde kayıklara kılavuzluk eder. Sığlıkları ve kırık taş ayakları kendi yaptığı iskandil ipleriyle ölçer; şehrin küçük deniz fenerinin görülemediği havalarda kayıkçılar onun kıyı işaretlerini arar.',
    background:
      'Çocukluğunda annesiyle ağ onarır, limanda artan ipleri küçük ağırlıklarla denerdi. Genç bir kayıkçı olarak tuttuğu derinlik işaretleri bir fırtınadan sonra geçersiz kaldığında, defterine mevsimi ve rüzgârı da yazmayı öğrendi. Kılavuzluk ücretini yükseltebileceği yıllarda yanına iki çırak aldı; böylece ölçüm bilgisi yalnız kendi kayığıyla denize çıkmamaya başladı.',
    presence:
      'Uzun kemikli yüzlü, açık kahverengi tenli, gri gözlü bir kadındır. Gümüş saçını kalın bir örgüyle toplar; tuz lekeli gri atkı ve eski çivit pelerin taşır. Bir sese dönmeden önce ufku tarar. Konuşurken ipe attığı düğümü yoklar; söylediği mesafenin göz kararı mı ölçüm mü olduğunu açıklar.',
    related: ['frostbay', 'nera-veld', 'iven-rusk', 'bryndon-kiyi-defteri'],
    sections: [
      {
        title: 'İpin düğümleri',
        paragraphs: [
          'Orsa’nın ilk kayığı kendisine ait değildi; payını annesinin onardığı ağlarla ve kendi tuttuğu kürek nöbetiyle ödedi. Daha sonra küçük bir yük kayığı alabildiğinde en pahalı eşyası yeni yelken değil, eşit aralıklarla düğümlenmiş uzun ip oldu. Suyun altındaki taşların başkasının aklına göre tarif edilmesinden bıkmıştı.',
          'Bir yıllık ölçüyü sonsuza kadar geçerli saydığı seferde kayığın altı yarıldı. Kimse ölmedi, fakat yükü karşılamak için iki kış borç ödedi. O günden sonra çizdiği her kıyı kâğıdına hangi rüzgârda baktığını işler. Sert havada dönüş işareti koyduğu zaman genç kayıkçıların alayını sabırla dinler; dönüşte alay edenin de adını sayar.',
        ],
      },
      {
        title: 'Şehrin eski taşları',
        paragraphs: [
          'Frostbay’in eski yuvarlak yapıları Orsa için önce yaklaşma işaretleridir. Bir duvarın kimin elinden çıktığını bilmez; gölgesinin suda nerede kısaldığını bilir. Bryndon’un kıyı notlarına eski bir temel hakkında ölçü vermiş, karşılığında kendi babasının kullandığı yer adlarının daha eski kayıtlarda da bulunup bulunmadığını sormuştur. Araştırmacının sorusuyla kayıkçının sorusu aynı kıyıda buluşur.',
          'Orsa gümrük veya garnizon emri veremez. Etkisi, kayıkçıların onun dönüş kararına ne kadar kulak verdiğiyle sınırlıdır. Nera Veld’in yerel masası bir sevki istediğinde önce havayı ve tekneyi görmeyi şart koşar. Kıyıdan iç yük yollarına geçen Iven Rusk gibi rehberlere kıyı ölçüsü verir; iç yolların bilgisini de onlardan dinler.',
        ],
      },
      {
        title: 'Karşılaşınca',
        paragraphs: [
          'Bir yolcunun acele gerekçesini dinler, ardından geri dönecek kişiyi sorar. Kendisine danışılmadan yola çıkana kızgınlığını uzun süre taşıyabilir. Birini yanlış tanıdığını kabul etmesi yavaştır; kabul ettiğinde ertesi seferin ipini kendi eliyle hazırlar.',
        ],
      },
    ],
  },
  {
    id: 'dalen-marr',
    name: 'Dalen Marr',
    role: 'Savak ve taş kanal ustası',
    city: 'ternhaven',
    affiliation: 'Ternhaven su işi haneleri',
    portrait: 'dalen-marr',
    source: 'new',
    power: 'ordinary',
    traits: ['Otuz dört yaşında', 'Düzeyi ölçer', 'İşi bölüştürür'],
    summary:
      'Dalen, Ternhaven’in sıcak su kanallarını ve küçük savaklarını onarır. Suya yakın birkaç bahçenin ürün vermesiyle bütün yerleşimin ısınması arasındaki farkı yaptığı dar, ölçülü işlerle anlatır.',
    background:
      'Taş yontan ailesinde ilk görevi hendekten çıkarılan parçaları ayırmaktı. Yeni bir savakta akıntının taşları neden gevşettiğini anlamak için yıkılan kısmı tekrar tekrar çizdi. Eğim hesabını, suyun kış başında ve sonunda değişen debisiyle birlikte tutmaya başladı. Bir iş kazasından sonra sağ kulağı az işitir; kalabalık bir talimat yerine sırayla konuşulmasını istemesi ortak işlerin düzenini de değiştirdi.',
    presence:
      'Bronz tenli, kare çeneli, dalgalı siyah saçlı ve kısa sakallı bir adamdır. Gri kolları sıvalı, soluk camgöbeği yeleğinin üstünde deri iş önlüğü vardır. Dinlerken sol kulağını konuşana çevirir. Eli taş üzerinde durmadan uzun bir açıklama yapamaz; anlattığı eğimi yakındaki yüzeyde tebeşirle gösterir.',
    related: ['ternhaven', 'mera-sorn', 'neris-vel', 'rydorn-sirti'],
    sections: [
      {
        title: 'Akıntının işi',
        paragraphs: [
          'Dalen’e bir süre babasının mesleğini yarım bıraktığı söylendi. Büyük yapı siparişleri yerine küçük su ağızlarıyla uğraşıyor, ücretinin bir kısmını lahana ve kuru yakacakla alıyordu. Ancak ilk sert kışta onardığı kanal çalışınca komşu haneler ortak bir bakım günü kurdu. Düzen büyüdükçe Dalen’in asıl işi taş kesmekten iş sırası ve malzeme hesaplamaya kaydı.',
          'Ternhaven’in ılık suyu her yere eşit ulaşmaz. Bir kanal genişletildiğinde aşağıdaki bahçenin payı azalabilir. Dalen yeni bir çıkış açmadan üst ve alt haneyle birlikte ölçüm yapar. Herkes anlaşamayınca işi ertelemesi sabırsız komşularına ağır gelir; tek bir sağlam ölçünün bütün hakkaniyet sorularını çözemediğini bilir.',
        ],
      },
      {
        title: 'Ortak bir bakım günü',
        paragraphs: [
          'Mera Sorn’un yerel masasına kullanılmış kireç, taş ve çalışma günü hesabı bırakır. Kendi ruhsatı veya büyü yetkisi yoktur. Neris Vel’in araştırmalarında bitkiyle ilgili soruyu araştırmacıya, suyun taş üstündeki izini ise kendi işine ayırır. Bir öneriyi denemeden önce küçük bir bölümde sınama ısrarı ikisinin birlikte çalışmasını mümkün kılar.',
          'Dalen yardım isteyeni hemen büyük işe sokmaz. Birine su seviyesini işaretletir, ötekine taşın arkasında biriken çamuru aldırır. İşi bölüştürmekte iyidir; başkası onun ölçüsünü değiştirince kişisel alınır. Yanıldığında savaktan aşağı beraber yürüyüp değişen suyu görmesi gerekir.',
        ],
      },
      {
        title: 'Karşılaşınca',
        paragraphs: [
          '“Hanginiz beni duyduğunu tekrar edecek?” diye sorar. Bu soruyu küçümsemek için sormaz; kalabalıkta yanlış anlaşılan bir hareketin bedelini ödemiştir. İş bitince en çok konuşanı değil, son taş yerine oturana kadar kalan kişiyi hatırlar.',
        ],
      },
    ],
  },
  {
    id: 'ressa-korr',
    name: 'Ressa Korr',
    role: 'Ambar tartı ve teslim denetçisi',
    city: 'dranthol',
    affiliation: 'Dranthol ikmal kayıtları',
    portrait: 'ressa-korr',
    source: 'new',
    power: 'ordinary',
    traits: ['Kırk yedi yaşında', 'Kuru ağırlık', 'İki taraflı tutanak'],
    summary:
      'Ressa, Dranthol depolarında teslim alınan çuvalları, tartı farklarını ve yıpranan mühürleri denetler. Kayıttaki miktarla eldeki yük ayrıldığında farkı ayrı satırda bırakır; stok görevlisinin yerine karar vermez.',
    background:
      'Liman çevresinde çuval onaran bir evde yetişti. Bezdeki eski dikişin yeni yük altında açılacağını çoğu yazıcıdan önce fark ediyordu. Garnizonun hızla büyüdüğü yıllarda teslim işine geçti; aynı terazi farklı saatlerde başka depolar için kullanıldığında küçük farkların nasıl büyük bir borca dönüştüğünü gördü. Sonradan tartı kayıtlarına saat ve hava durumunu da eklemeye başladı.',
    presence:
      'Çilli açık tenli, kırçıl kızıl kahverengi saçlarını kısa kesen bir kadındır. Mat koyu mor yün ceketinin yakası kapalıdır. Küçük teneke mühür damgasını bir ipte taşır. Bir çuvala bakarken karşısındaki kişinin yüzünden önce dikişe eğilir; hata bulunca kapıyı kapatıp yüz yüze konuşmayı seçer.',
    related: ['dranthol', 'maeron-vesk', 'garran-veyl', 'orsa-dren'],
    sections: [
      {
        title: 'Çuvalı iki kez tartmak',
        paragraphs: [
          'Ressa’nın ailesinin kazancı yeni çuval satmaktan çok eskisini yeniden kullanılır kılmaktan gelirdi. Ressa bir delik kapandığında yükün gerçekten taşınabilir sayılması için dikişin kimin eliyle atıldığını da bilmek gerektiğini öğrendi. İlk depo işinde bu bilgiyi yazıya çevirdi: hasarlı torba, eksik ürün ve ıslak ürün aynı kayda konmaz.',
          'Bir sevkte iki ayrı tartının farkını kendi hatası sandığı için haftalarca ek mesai yaptı. Sonunda farkın, dışarıda beklemiş çuval bezinin tuttuğu sudan geldiğini gösterdi. O günden beri hem teslim alan hem getiren tartı sonucunu görür. Bu usul hızlı sevki geciktirebilir; Ressa, geciken her yük için kendi hesabını da açık tutar.',
        ],
      },
      {
        title: 'Masanın öteki tarafı',
        paragraphs: [
          'Maeron Vesk ihtiyaç ve stok hesabını toplar; Ressa bir teslimin gerçekten hangi durumda yapıldığını kaydeder. Son sevk emrini veya garnizonun dağıtım kararını verme yetkisi yoktur. Garran Veyl’e giden raporda farkın yanında kimin itiraz ettiğini de yazar. Böylece doğru hesabın bir amirin hoşuna gidip gitmemesi, kaydın tek ölçüsü olamaz.',
          'Frostbay’den gelen yüklerde kayıkçıların taş ve su hesabını dinlemek için Orsa Dren’le birkaç kez çalıştı. Birinin ip düğümü ötekinin tartı çentiğine benzer: ikisi de daha sonra bakılabilecek bir iz bırakır. Ressa’nın zayıf yanı, açıklanabilir bir hatayı düzeltmek yerine bazen fazla uzun araştırmasıdır. Kendisine güvenilmesini isterken başkalarını beklettiğini geç fark eder.',
        ],
      },
      {
        title: 'Karşılaşınca',
        paragraphs: [
          'İlk sözü çoğu kez “Çuvalı yere koy, sen de yanıma gel” olur. Tartıyı uzaktan anlatmaz; getirenin görmesini ister. İyi bir teslim yapan genç taşıyıcıya adıyla teşekkür eder. Kötü bir teslimde ise kusuru sayar, kişiye lakap takmaz.',
        ],
      },
    ],
  },
]
