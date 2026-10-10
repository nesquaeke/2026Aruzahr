// Public, pre-coup canon. Names and biographies are authorized new writing, not source-document quotations.
import type { Character } from './characters'
import type { LoreArticle } from '../data'
import { completedDanstsudCharacters } from './danstsud-roster-completion'

export type InstitutionRoster = { id: string; name: string; city: string; memberIds: string[] }
export const institutionRosters: InstitutionRoster[] = [
  {
    "id": "tac-on-iki",
    "name": "On İki Taç Şövalyesi",
    "city": "valdareth",
    "memberIds": [
      "ardel-veyran",
      "selka-orven",
      "beltran-sael",
      "miren-halvyr",
      "dain-torven",
      "ysra-fenhol",
      "ovel-rann",
      "thessa-morain",
      "garron-veldrith",
      "kelyra-esven",
      "nethan-caul",
      "adera-voss"
    ]
  },
  {
    "id": "mor-pelerin",
    "name": "Mor Pelerin",
    "city": "valdareth",
    "memberIds": [
      "vesren-kald",
      "fara-nidren"
    ]
  },
  {
    "id": "mavi-pelerin",
    "name": "Mavi Pelerin",
    "city": "valdareth",
    "memberIds": [
      "darsen-roth",
      "ivela-trost"
    ]
  },
  {
    "id": "mor-donanma",
    "name": "Mor Donanma",
    "city": "valdareth",
    "memberIds": [
      "nerath-omber",
      "veyla-dris",
      "tormal-fenn",
      "ceryn-hale"
    ]
  },
  {
    "id": "valdareth-kent-hizmetleri",
    "name": "Valdareth Kent Hizmetleri",
    "city": "valdareth",
    "memberIds": [
      "teren-halvek",
      "rickon",
      "sera-neld",
      "doran-kest",
      "odrissa-vey",
      "nolen-dur",
      "ensel-drunn",
      "erhan-telis",
      "sela-orven"
    ]
  },
  {
    "id": "lirendil-gorev-haneleri",
    "name": "Lirendil Görev Haneleri",
    "city": "lirendil",
    "memberIds": [
      "torena-vesk",
      "hadrik-solm",
      "nelra-ven",
      "jarek-ulven",
      "oswen-krehl",
      "maera-dell",
      "sevran-til"
    ]
  },
  {
    "id": "theramis-altin-yilan",
    "name": "Theramis Altın Yılan Hizmetleri",
    "city": "theramis",
    "memberIds": [
      "solan",
      "mavena-riel",
      "darom-selis",
      "erisa-thale",
      "vadren-hol",
      "liora-gent",
      "heskar-vale",
      "neral-thes"
    ]
  },
  {
    "id": "dorvenhall-sinir-koruculari",
    "name": "Dorvenhall Sınır Korucuları",
    "city": "dorvenhall",
    "memberIds": [
      "borren-keld",
      "sira-norrel",
      "endrik-vaun",
      "talvena-kord",
      "orvik-drel"
    ]
  },
  {
    "id": "marhalden-akcelik",
    "name": "Marhalden Akçelik Nöbeti",
    "city": "marhalden",
    "memberIds": [
      "savren-urn",
      "elva-korrin"
    ]
  },
  {
    "id": "elorwyn-adak-muhafizlari",
    "name": "Elorwyn Adak Muhafızları",
    "city": "elorwyn",
    "memberIds": [
      "caldris-evern",
      "rahela-dorn",
      "veyren-sahl",
      "orena-vel",
      "seldric-nove"
    ]
  },
  {
    "id": "kethra-kiyi-hizmetleri",
    "name": "Kethra Kıyı Hizmetleri",
    "city": "kethra",
    "memberIds": [
      "damian",
      "aveline",
      "rook",
      "tavera-oss",
      "branis-dov",
      "melra-shen",
      "seraphinia"
    ]
  },
  {
    "id": "hardlane-ocak-agi",
    "name": "Hardlane Ocak Ağı",
    "city": "frostbay",
    "memberIds": [
      "nera-veld",
      "odran-vehl",
      "ivren-vask",
      "hessa-rund",
      "garran-veyl",
      "orna-kehl",
      "dovek-raal",
      "mera-sorn",
      "selvi-arn",
      "teren-moll",
      "ivena-sarell",
      "sella-vorn"
    ]
  },
  {
    "id": "celikkalkan-loncasi",
    "name": "ÇelikKalkan Loncası",
    "city": "lirendil",
    "memberIds": [
      "vardek",
      "kaelen",
      "varric",
      "mrog",
      "ghorin",
      "zylara",
      "ellyn",
      "gil",
      "jeremiah",
      "volomiyr",
      "corvan",
      "torena-vesk",
      "hadrik-solm",
      "nelra-ven",
      "jarek-ulven",
      "oswen-krehl",
      "maera-dell"
    ]
  },
  {
    "id": "lirendil-buyu-akademisi",
    "name": "Lirendil Büyü Akademisi",
    "city": "lirendil",
    "memberIds": [
      "vaelcor",
      "lethan-orve"
    ]
  },
  {
    "id": "marhalden-uc-muhur",
    "name": "Marhalden Üç Mühür Meclisi",
    "city": "marhalden",
    "memberIds": ["edran-korr", "vessa-thol", "tervik-hann", "nesra-dolm", "karven-oll", "mereth-vann"]
  }
]

export const newDanstsudInstitutions: LoreArticle[] = [
  {
    "id": "tac-on-iki",
    "name": "On İki Taç Şövalyesi",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "On iki isim, on iki ayrı sorumluluk",
    "mapLocation": "valdareth",
    "summary": "On İki Taç Şövalyesi, Eryndorn Vaeranth’a doğrudan bağlı tam on iki şövalyeden oluşur. Ser Ardel Veyran başlarında bulunur; üyeler yalnız sarayda parlak bir sıraya dizilmek için seçilmez. Yol refakati, arşiv koruması, hane belgeleri, tahkimat, yaralı taşıma, dilekçe heyetleri, ruhsatlı savunma büyüsü, aday denetimi ve kraliyet kabulü ayrı görevlerdir.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "valdareth",
      "ardel-veyran",
      "selka-orven",
      "beltran-sael",
      "miren-halvyr",
      "dain-torven",
      "ysra-fenhol",
      "ovel-rann",
      "thessa-morain",
      "garron-veldrith",
      "kelyra-esven",
      "nethan-caul",
      "adera-voss"
    ],
    "sections": [
      {
        "title": "Birliğin yeminli yüzü",
        "paragraphs": [
          "On İki Taç Şövalyesi, Eryndorn Vaeranth’a doğrudan bağlı tam on iki şövalyeden oluşur. Ser Ardel Veyran başlarında bulunur; üyeler yalnız sarayda parlak bir sıraya dizilmek için seçilmez. Yol refakati, arşiv koruması, hane belgeleri, tahkimat, yaralı taşıma, dilekçe heyetleri, ruhsatlı savunma büyüsü, aday denetimi ve kraliyet kabulü ayrı görevlerdir.",
          "Bir şövalyenin adı görevinden bağımsız değildir. Selka’nın yollardan getirdiği çamur, Miren’in belge üzerindeki kat izi, Thessa’nın yaralı defteri aynı bağlılığın farklı yüzleridir. On İki’nin hepsi başkentte taç hizmetindedir; gerektiğinde kendi görevleriyle başka yerlere giderler. Boşalan makamın doldurulması yeni bir on üçüncü şövalye yaratmak anlamına gelmez."
        ]
      },
      {
        "title": "Şövalye, özel birlik, kent nöbeti",
        "paragraphs": [
          "On İki, bütün kraliyet ordusunun sayısı değildir. Ardel’in yanında hane görevlileri ve refakat için ayrılan erler çalışır; şövalyelik listesi bunların tamamını şövalye ilan etmez. Mor Pelerin saray çevresinin seçkin nöbetini, Mavi Pelerin ayrı saha ve garnizon hizmetini yürütür. Valdareth şehir muhafızları ise sivil kent zincirinde kalır.",
          "Birlikler birlikte görev yaptığında emir sahibini önceden kaydeder. On İki’nin saraya yakınlığı, Sir Rickon’un sokak nöbetini, Doran’ın gümrüğünü veya Mor Donanma’nın gemi komutasını kendiliğinden ortadan kaldırmaz. Taç şövalyesinin nüfuzu bazen bu sınırları zorlayabilir; sınırın kayda geçirilmesi tam da bunun için önemlidir."
        ]
      },
      {
        "title": "Yemin kadar bakım",
        "paragraphs": [
          "Yemin adayları Nethan Caul’un hazırlığından ve Beltran Sael’in taliminden geçer. Büyük başarı kadar birlikte hareket etmek, nöbette ikameyi bilmek ve görev sonrası hesap vermek aranır. Kelyra Esven’in büyülü hizmeti ayrıca ruhsat alanına bağlıdır; şövalyelik unvanı izin dışı uygulamayı yasal yapmaz.",
          "Üyelerin ücret, bakım ve refakat ihtiyaçları kraliyet hesabında izlenir. Ardel’in defteri yalnız suç veya ödül listesi değildir; eksik kalan vardiyanın ve doğru devredilmemiş işin de izini tutar. Şatafatlı törenin altındaki gündelik disiplin, On İki’nin gerçekten birlikte çalışmasını sağlar."
        ]
      }
    ]
  },
  {
    "id": "mor-pelerin",
    "name": "Mor Pelerin",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "İç kapıda seçkin kraliyet nöbeti",
    "mapLocation": "valdareth",
    "summary": "Mor Pelerin, başkentte kraliyet saray çevresini koruyan seçkin askerî birliktir. Vesren Kald komutan, Fara Nidren iç kapı yüzbaşısıdır. Birlik yalnız bu iki kişiden oluşmaz: iç kapı nöbetleri, saray duvar devriyeleri, refakat takımları ve vardiya yedekleri ayrı alt gruplarla yürür; her grubun çavuşu ve günlük nöbet kaydı bulunur.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "valdareth",
      "vesren-kald",
      "fara-nidren"
    ],
    "sections": [
      {
        "title": "Kapının gerisindeki birlik",
        "paragraphs": [
          "Mor Pelerin, başkentte kraliyet saray çevresini koruyan seçkin askerî birliktir. Vesren Kald komutan, Fara Nidren iç kapı yüzbaşısıdır. Birlik yalnız bu iki kişiden oluşmaz: iç kapı nöbetleri, saray duvar devriyeleri, refakat takımları ve vardiya yedekleri ayrı alt gruplarla yürür; her grubun çavuşu ve günlük nöbet kaydı bulunur.",
          "Mor pelerin hizmet aidiyetini gösterir. Taç şövalyeleriyle aynı mekânda bulunmak, bütün erleri On İki’ye katmaz. Eğitim; kapıda kimlik denetimi, dar geçitte ortak hareket, kalabalık karşısında geçiş düzeni ve saray yangınına müdahaleyi de içerir."
        ]
      },
      {
        "title": "Yetki sınırı",
        "paragraphs": [
          "Mor Pelerin’in önceliği saraydır. Şehir muhafızlarıyla kovalamaca veya ortak refakat olduğunda teslim noktası belirlenir; Vesren sokakta görünen her sorunu saray emri sayamaz. Mavi Pelerin’in saha sevki ve Mor Donanma’nın güverte komutası ayrı kalır.",
          "Saray görevlisinin yüksek unvanı kapı usulünü ortadan kaldırmaz. Fara’nın nöbetçilerinden birinin sorusu kaba veya yavaş olabilir, ama bu soruyu yalnız ziyaretçinin nüfuzuyla susturmak birliğin güvenini zedeler. Bu yüzden yetkili geçişlerin yazılı izi korunur."
        ]
      },
      {
        "title": "Parlak kumaşın gündelik bedeli",
        "paragraphs": [
          "Seçkinlik, aynı vardiyayı uykusuz sürdürmek değildir. Fara dinlenme aralıklarını korumaya çalışırken Vesren masraf ve insan hesabını öne sürer. Bu gerilim birliğin kamuya açık hayatındadır; disiplin güçlü olsa da kusursuz insanlar topluluğu değildir.",
          "Zırh, kapı anahtarı, temiz su ve yedek mum saray hesabından temin edilir. Tören peleriniyle devriye giysisi aynı değildir. Mor Pelerin’in şöhreti, kapalı bir iç kapının ardında her gün yapılan sıradan işlerden beslenir."
        ]
      }
    ]
  },
  {
    "id": "mavi-pelerin",
    "name": "Mavi Pelerin",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Başkentten çıkan düzenli saha ve garnizon gücü",
    "mapLocation": "valdareth",
    "summary": "Mavi Pelerin, Danstsud’un başkentte barınan ve kraliyet emriyle saha ya da garnizon hizmetine ayrılabilen düzenli askerî birliklerinden biridir. Darsen Roth saha komutanı, Ivela Trost iaşe ve sevk yüzbaşısıdır. Yaya bölükleri, kalkan takımları, refakat erleri, levazım arabaları ve küçük tahkimat bakım grupları birlikte çalışır.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "valdareth",
      "darsen-roth",
      "ivela-trost"
    ],
    "sections": [
      {
        "title": "Ayrı bir askerî zincir",
        "paragraphs": [
          "Mavi Pelerin, Danstsud’un başkentte barınan ve kraliyet emriyle saha ya da garnizon hizmetine ayrılabilen düzenli askerî birliklerinden biridir. Darsen Roth saha komutanı, Ivela Trost iaşe ve sevk yüzbaşısıdır. Yaya bölükleri, kalkan takımları, refakat erleri, levazım arabaları ve küçük tahkimat bakım grupları birlikte çalışır.",
          "Mavi pelerin askerî aidiyettir; Valdareth şehir muhafızının üniforması veya Mor Pelerin’in saray nöbeti değildir. Birlikte görev alındığında saygınlık sırası yerine görev amacı belirlenir. Darsen’in askeri kapıda bulunabilir, fakat o kapının sivil kayıtları yine kent makamına aittir."
        ]
      },
      {
        "title": "Yürüyüşün arkasındaki iş",
        "paragraphs": [
          "Darsen’in sefer emri Ivela’nın araba, tahıl, dinlenme ve ikame hesabına ihtiyaç duyar. Birliğin düzeni yalnız kılıç ve mızrak sayısıyla kurulmaz: bez, su kabı, ayakkabı, hayvan yemi ve onarım takımları yola çıkmadan hazırlanır. Selka Orven yol koşullarını, Ovel Rann tahkimat ihtiyacını ayrıca bildirir.",
          "Theramis’ten sağlanan büyü desteği başka bir hizmet zinciridir. Vadren Hol’un uygulayıcıları kendi ruhsat alanlarını korur; Mavi Pelerin emri izin dışı büyüye yetki vermez. Asker ve büyücü aynı hedefe çalışırken sorumluluklarını kayda ayrı geçirir."
        ]
      },
      {
        "title": "Hız ile dayanma gücü",
        "paragraphs": [
          "Darsen’in hızlı yürüyüşlere düşkünlüğüyle Ivela’nın son arabanın durumunu sorması arasında sık gerilim çıkar. Bu, birliğin gücünü küçültmez; planın nasıl işleyeceği üzerine somut bir anlaşmazlıktır. Eksiksiz dönüş için ilk varışın alkışından vazgeçmek bazen gerekir.",
          "Mavi Pelerin’in güncel kadrosu burada bütün erleri tek tek sayan bir yoklama değildir. Adlandırılmış yöneticiler karşılaşılabilecek insanları gösterir; bunların altında gerçek bölük, takım, bakım ve iaşe görevleri vardır. Takımın yokluğu iki komutanın ünüyle kapatılmaz."
        ]
      }
    ]
  },
  {
    "id": "mor-donanma",
    "name": "Mor Donanma",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Rilorn’da bir araya gelen gemi, seyir ve tersane komutası",
    "mapLocation": "valdareth",
    "summary": "Mor Donanma, Rilorn Körfezi’nde güvenli demirleyen kraliyet deniz gücüdür. Amiral Nerath Omber genel gemi komutasını, Veyla Dris seyir kayıtlarını, Tormal Fenn tersane işçiliğini, Ceryn Hale konvoy refakatini yürütür. Bir geminin denize hazır olması bu dört sorumluluğun aynı gün tamamlanmasına bağlıdır.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "valdareth",
      "nerath-omber",
      "veyla-dris",
      "tormal-fenn",
      "ceryn-hale"
    ],
    "sections": [
      {
        "title": "Güvenli körfez, farklı sorumluluklar",
        "paragraphs": [
          "Mor Donanma, Rilorn Körfezi’nde güvenli demirleyen kraliyet deniz gücüdür. Amiral Nerath Omber genel gemi komutasını, Veyla Dris seyir kayıtlarını, Tormal Fenn tersane işçiliğini, Ceryn Hale konvoy refakatini yürütür. Bir geminin denize hazır olması bu dört sorumluluğun aynı gün tamamlanmasına bağlıdır.",
          "Kaptanların altında güverte çavuşları, dümenciler, yelken ve halat ustaları, kürek ve bakım tayfaları, gemi marangozları, kıyı refakat erleri ve erzak yazmanları çalışır. Donanma yalnız dört ün sahibi kişinin kayığı değildir. Her seferde görevdeki gemi ve tayfa ayrı listelenir; bu wiki bütün aktif gemiler için kesin bir sayı ilan etmez."
        ]
      },
      {
        "title": "Liman ile açık deniz",
        "paragraphs": [
          "Amiral gemiyi sevk eder, fakat Valdareth gümrük işini Doran Kest’in yerine kendi başına yapmaz. Yük devrinde kayıt ve teslim kullanılır. Ticaret gemilerinin korunması ile gümrük ücretinin toplanması aynı yetki değildir; başkent limanını ayıran duvar bu ayrımı gündelik hayatta görünür kılar.",
          "Ak Cam’ın donmamış suları fırtınasız değildir. Soluk Su’nun sis ve kayalıkları, Ayaz Yutan’ın eşiği ve don örtülerinden kopan parçalar seyir hesabına girer. Rilorn’daki güvenli bekleyiş, Hardlane kıyılarının aynı güvenliğe sahip olduğu anlamına gelmez."
        ]
      },
      {
        "title": "Bir geminin eksik parçası",
        "paragraphs": [
          "Tormal’ın hizmete hazır saymadığı gemi, Nerath’ın istediği gün yola çıkmayabilir. Veyla kötü hava raporu verdiğinde Ceryn daha yavaş bir konvoyu seçebilir. Bu anlaşmazlıklar yetkisiz ihanet hikâyesi değil, aynı donanmanın farklı işlerinin birbirini denetlemesidir.",
          "Tayfanın suyu, işçinin ücreti ve kerestenin kuruma süresi donanmanın görkemine dâhildir. Aşınmış halatın yerini üniforma alamaz. Kurumun gücü, denizdeki saldırı kadar her seferden önce ve sonra kıyıda yapılan bakım işinde görülür."
        ]
      }
    ]
  },
  {
    "id": "valdareth-kent-hizmetleri",
    "name": "Valdareth Kent Hizmetleri",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Beş surun gündelik işini taşıyan ayrı makamlar",
    "mapLocation": "valdareth",
    "summary": "Başkent vekili Teren Halvek mahalle hizmetlerinin sivil koordinasyonunu, Sir Rickon Thornhall şehir muhafızlığının kıdemli saha işini temsil eder. İaşe nazırı Sera Neld, liman nazırı Doran Kest ve gümrük tartı başı Ensel Drunn kendi kayıtlarıyla çalışır. Taç bunların üzerinde olsa da her iş aynı saray kapısından yönetilmez.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "valdareth",
      "teren-halvek",
      "rickon",
      "sera-neld",
      "doran-kest",
      "odrissa-vey",
      "nolen-dur",
      "ensel-drunn"
    ],
    "sections": [
      {
        "title": "Bir şehir tek makam değildir",
        "paragraphs": [
          "Başkent vekili Teren Halvek mahalle hizmetlerinin sivil koordinasyonunu, Sir Rickon Thornhall şehir muhafızlığının kıdemli saha işini temsil eder. İaşe nazırı Sera Neld, liman nazırı Doran Kest ve gümrük tartı başı Ensel Drunn kendi kayıtlarıyla çalışır. Taç bunların üzerinde olsa da her iş aynı saray kapısından yönetilmez.",
          "Şehir muhafızlarının kapı bölükleri, mahalle devriyeleri, gece nöbetleri ve teslim görevlileri vardır. Bunlar Mor Pelerin’in iç saray hizmetinden, Mavi Pelerin’in askerî sevkinden ayrılır. Beş sur kuşağında hizmet eşit dağılmaz; dış çeperde daha az insan ve daha uzun bekleme gündelik bir sorundur."
        ]
      },
      {
        "title": "Bakım, teslim ve inanç",
        "paragraphs": [
          "Büyük hapishanenin nöbet ve teslim düzenini Nolen Dur yönetir; ona yargılama veya istediği cezayı verme yetkisi tanınmaz. Odrissa Vey, Obsidyen Kilise hizmetleri, yardım mutfağı ve din görevlileri üzerinden şehirde başka bir otorite taşır. Bu makamların kaydı aynı hapishane ya da saray emrinin içine eritilmez.",
          "Kraliçe Alisande’nin yardım işleri, iaşe ve mahalle ihtiyaçlarıyla görüşür. Thessa Morain yaralı taşıma konusunda destek verir. Ruhsat gerektiren büyülü şifa, kilise veya kraliyet unvanıyla otomatik serbest sayılmaz; sıradan bakım ve büyülü uygulama ayrı izlenir."
        ]
      },
      {
        "title": "Kapıda karşılaşılabilecek insanlar",
        "paragraphs": [
          "Valdareth’in bir sakinle kurduğu ilişki çoğu zaman kralın kendisinden önce tartı memuru, nöbetçi, ambar görevlisi ve dilekçe yazmanı üzerinden olur. Bu kişiler bazen adil, bazen kaba, bazen kendi kolaylığını düşünen insanlardır. Ensel’in hızlı hesabı veya Nolen’in soğuk usulü, başkentin gündelik ahlakını da etkiler.",
          "Bir büyük hizmet kesintisinde görevler birbirini tamamlar: geçidi muhafız açar, yükü iaşe kaydeder, bakımı ilgili hizmet yürütür. Hiçbir makamın görünür olması şehrin bütün hanelerine eşit koruma ve refah ulaştığını kanıtlamaz. Beş surun içten dışa yoksullaşan düzeni yaşamaya devam eder."
        ]
      }
    ]
  },
  {
    "id": "lirendil-gorev-haneleri",
    "name": "Lirendil Görev Haneleri",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Bir sözleşmenin iki ucunda insanlar",
    "mapLocation": "lirendil",
    "summary": "Lirendil’de ücretli refakat, iz sürme, bakım ve keşif işleri tek bir kahramanın sözünden ibaret değildir. ÇelikKalkan’ın görev yazmanı Torena Vesk kayıtları tutar; Hadrik Solm kalkan eğitimi, Jarek Ulven keşif hazırlığı, Nelra Ven ruhsatlı gezgin şifa, Oswen Krehl levazım sağlar. Maera Dell sözleşmeli iz sürücülerden biridir.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "lirendil",
      "torena-vesk",
      "hadrik-solm",
      "nelra-ven",
      "jarek-ulven",
      "oswen-krehl",
      "maera-dell",
      "sevran-til"
    ],
    "sections": [
      {
        "title": "Görev masası ve hazırlık",
        "paragraphs": [
          "Lirendil’de ücretli refakat, iz sürme, bakım ve keşif işleri tek bir kahramanın sözünden ibaret değildir. ÇelikKalkan’ın görev yazmanı Torena Vesk kayıtları tutar; Hadrik Solm kalkan eğitimi, Jarek Ulven keşif hazırlığı, Nelra Ven ruhsatlı gezgin şifa, Oswen Krehl levazım sağlar. Maera Dell sözleşmeli iz sürücülerden biridir.",
          "Bunlar Sir Vardek’in, Kaelen’in ve Varric’in mevcut lonca rollerinin yerine geçen yeni başlar değildir. Görev masası farklı ustalıkları bir araya getirir. Lirendil lordu Averen Dhal’ın sivil yönetimi de loncanın yemin ve talim düzeninden ayrı kalır."
        ]
      },
      {
        "title": "Rakip bir pazar",
        "paragraphs": [
          "Sevran Til, Tunç Harcı adlı küçük serbest kılıç çevresini temsil eder. Ücret ve hız üzerinden loncayla rekabet eder; işçilerin ücretini geciktirmesi açık bir itibar sorunudur. Bu çevre bağımsız bir kraliyet birliği veya şehir mahkemesi değildir.",
          "Bir sözleşmenin cazibesi yalnız altın miktarında görülmez. Hazırlık, risk, dinlenme ve geri dönüş koşulları yazılmazsa ucuz iş başkasının yükünü büyütebilir. Torena ile Sevran’ın çekişmesi bu farkın şehirde görünen yüzlerinden biridir."
        ]
      },
      {
        "title": "Adı olmayan emeğin izi",
        "paragraphs": [
          "Ghorin’in ocağı, Zylara’nın reviri, Ellyn’in arşivi ve Mrog’un nöbeti aynı görevin hazırlığını taşır. Gil, Jeremiah ve Volomiyr gibi maceracılar yola çıkarken bu ortak düzenin içinden geçer. Bir grubun ünü arkasındaki bakım işlerini ortadan kaldırmaz.",
          "Lirendil Görev Haneleri ayrı bir üst devlet kurumu değil, bu bağlı işlerin okunabilir envanteridir. Büyülü hizmetin ruhsatı ayrıca aranır. Bir görev kartı dünyadaki gerçek yolu düzleştirmez; güvenilmez dağ geçidini yazılı bir işin içine koymak onu güvenli kılmaz."
        ]
      }
    ]
  },
  {
    "id": "theramis-altin-yilan",
    "name": "Theramis Altın Yılan Hizmetleri",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Okul, lonca ve ruhsatlı saha hizmeti",
    "mapLocation": "theramis",
    "summary": "Altın Yılan, Theramis loncasının amblemidir. Başbüyücü Solan kurumun tanınan ustasıdır; Lord Elyas Theren’in şehir yönetimi onun makamıyla aynı şey değildir. Okul dersleri, deney atölyeleri, hizmet masası ve sefer desteği farklı sorumluluklarla çalışır.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "theramis",
      "solan",
      "mavena-riel",
      "darom-selis",
      "erisa-thale",
      "vadren-hol",
      "liora-gent",
      "heskar-vale"
    ],
    "sections": [
      {
        "title": "Ustalık ile yönetim",
        "paragraphs": [
          "Altın Yılan, Theramis loncasının amblemidir. Başbüyücü Solan kurumun tanınan ustasıdır; Lord Elyas Theren’in şehir yönetimi onun makamıyla aynı şey değildir. Okul dersleri, deney atölyeleri, hizmet masası ve sefer desteği farklı sorumluluklarla çalışır.",
          "Mavena Riel eğitim değerlendirmesini, Darom Selis karşı-büyüyü, Heskar Vale deney güvenliğini yürütür. Erisa Thale dağ iklimi uygulamalarını hazırlar; Vadren Hol saha büyücülerini, Liora Gent staj ve kamu hizmeti kayıtlarını düzenler. Her ustanın altında öğrenciler, yardımcı uygulayıcılar ve bakım görevlileri vardır."
        ]
      },
      {
        "title": "Belge neyi sağlar",
        "paragraphs": [
          "Eğitim belgesi bir ustalığın öğrenildiğini, üyelik bir kurumun çevresinde bulunmayı, ruhsat ise belirli alanda yasal uygulama iznini gösterir. Bu üçü aynı kayıt değildir. Kraliyet Büyü Sicili ile iletişim korunur; Theramis amblemi sınırsız izin sayılmaz.",
          "Saha büyücüsü, askerî birliğe yardım ettiğinde de hizmet sınırını korur. İzinsiz büyü uygulaması ve kurban ritüelleri yasaktır. Kendi okulunun itibarı uğruna başarısız denemeyi saklamak, yalnız akademik bir sorun değil kamu hizmetinin güvenilirliğini etkileyen bir davranıştır."
        ]
      },
      {
        "title": "Bilginin uzak yerdeki bedeli",
        "paragraphs": [
          "Marhalden’deki uygulamalar bazı depo, çalışma ve bakım alanlarını daha dayanılır kılar; dağın sert iklimini bütünüyle değiştirmez. Yakıt, bakım ve etki süresi için yerel lordluk ve lonca ile somut iş paylaşılır. Elorwynli din görevlilerinin bakım hizmeti de farklı bir ustalık olarak bu işin yanında bulunabilir.",
          "Theramis’te iyi bir yeni uygulama kadar güvenle sona erdirilen bir başarısız deneme de öğretilir. Her öğrenci savaş büyücüsü, her usta bir ordu komutanı değildir. Kentin gücü bunların farklı yetenekler olarak birlikte çalışabilmesinden gelir."
        ]
      }
    ]
  },
  {
    "id": "dorvenhall-sinir-koruculari",
    "name": "Dorvenhall Sınır Korucuları",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Kaya bineği, yük yolu ve ocak güvenliği",
    "mapLocation": "dorvenhall",
    "summary": "Lord Rovan Mereth’e bağlı Dorvenhall korucuları, binekli devriye ve yük yolu refakati için düzenlenir. Borren Keld devriye başı, Endrik Vaun kuzey devriye yüzbaşısıdır. Sira Norrel orvel bineklerinin terbiyesi ve bakımını yürütür; binek ustaları ve yedek hayvan bakıcıları askerî gücün içinde somut iş yapar.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "dorvenhall",
      "borren-keld",
      "sira-norrel",
      "endrik-vaun",
      "talvena-kord",
      "orvik-drel"
    ],
    "sections": [
      {
        "title": "Dağdaki askerî iş",
        "paragraphs": [
          "Lord Rovan Mereth’e bağlı Dorvenhall korucuları, binekli devriye ve yük yolu refakati için düzenlenir. Borren Keld devriye başı, Endrik Vaun kuzey devriye yüzbaşısıdır. Sira Norrel orvel bineklerinin terbiyesi ve bakımını yürütür; binek ustaları ve yedek hayvan bakıcıları askerî gücün içinde somut iş yapar.",
          "Orvelin tutucu toynakları kayada dikkatli adım için uygundur; uzun at sıçrayışı veya sınırsız ağır yük üstünlüğü değildir. Devriyeler gerçek zemine, yüke ve dinlenmeye göre kurulur. Karlan’ın yaşamaya elverişsiz yüksek zirveleri sıradan bir askerî devriye alanı diye gösterilmez."
        ]
      },
      {
        "title": "Ocak ile sınır birbirine değer",
        "paragraphs": [
          "Talvena Kord cevher partilerinin yoklamasını, Orvik Drel ocak emniyetini temsil eder. Bu sivil ustalıklar korucu komutasıyla aynı rütbe zincirinde değildir, fakat yükler, yem ve yol tıkanmaları yüzünden birlikte karar vermek zorunda kalır. Sıradan bir maden sevki dağ geçidindeki asker kadar dikkat ister.",
          "Dorvenhall’ın menekşespatı Valdareth’in mavi mor kiremitlerine gider; Karlan’a özgü Veyralt’la aynı kaynak değildir. Üretim, işleme ve sınır korumasının birbiriyle ilişkisi yeni bir güvenilir batı geçidi yaratmaz. Marhalden tek bilinen düzenli kara geçidi olarak kalır."
        ]
      },
      {
        "title": "Yola çıkan son hayvan",
        "paragraphs": [
          "Korucuların seçkinliği tek bir komutanın cesareti değil, son bineğin de dönmesini sağlayan bakım düzenidir. Bir dar yolda geri dönmek bazen doğru görev kararıdır. Borren’in temkini, Endrik’in hızlı yükselme isteği ve Sira’nın hayvan sağlığını öne koyması aynı birliğin kamuya açık gerilimleridir.",
          "Talvena ve Orvik’in denetimi, çıkacak taşın kalitesi ile çıkarmayı sürdürecek insanların sağlığını birlikte görünür kılar. Güç yalnız dağda silah taşımak değildir. Düzenli kayıt, iyi yem, yedek bağ ve işi durdurma hakkı da Dorvenhall korumasının parçasıdır."
        ]
      }
    ]
  },
  {
    "id": "marhalden-akcelik",
    "name": "Marhalden Akçelik Nöbeti",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Küçük nüfustan büyük geçit gücü",
    "mapLocation": "marhalden",
    "summary": "Marhalden’in seçkin askerî gücüne Akçelik Nöbeti denir. Savren Urn askerî komutan, Elva Korrin nehir kaleleri yüzbaşısıdır. Az sayıdaki iyi eğitimli asker, kale ve geçit nöbetlerine ayrılır; küçük kuşatma düzeneklerini kullanan ve bakımını yapan ekipler ayrıca çalışır.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "marhalden",
      "savren-urn",
      "elva-korrin",
      "tervik-hann",
      "nesra-dolm",
      "karven-oll"
    ],
    "sections": [
      {
        "title": "Zırh ve geçit",
        "paragraphs": [
          "Marhalden’in seçkin askerî gücüne Akçelik Nöbeti denir. Savren Urn askerî komutan, Elva Korrin nehir kaleleri yüzbaşısıdır. Az sayıdaki iyi eğitimli asker, kale ve geçit nöbetlerine ayrılır; küçük kuşatma düzeneklerini kullanan ve bakımını yapan ekipler ayrıca çalışır.",
          "Özel açık renkli katmanlı zırhlar yerel ustalık ürünüdür. Sınırlı Veyralt parçaları aşınmanın yoğun olduğu kenar veya bağlantılarda kullanılır; her erin bütün zırhı bu nadir madenden yapılmış sayılmaz. Küçük nüfus, sürekli ikame ve bakım gerektiren bir savunma düzenini daha da önemli kılar."
        ]
      },
      {
        "title": "İki kale, üç kol",
        "paragraphs": [
          "Nehir karşısındaki iki kale yerleşimi lordun ve baş lonca makamının ayrı alanlarını korur. Edran Korr sekiz yıllık lordluk, Vessa Thol dört yıllık baş lonca göreviyle Üç Mühür düzenini taşır. Akçelik komutanı bu seçilmiş makamların yerine geçmez.",
          "Tervik Hann kazı, Nesra Dolm işleme, Karven Oll satış kolunun temsilcisidir. Üçü üretim ve ticaret tarafında çalışır; askerî birliğe zırh ve iaşe sağlamak onları kale komutanı yapmaz. Karşılıklı kayıt, bir kolun veya bir askerin bütün şehri kendi hesabına bağlamasını güçleştirir."
        ]
      },
      {
        "title": "Kapalı kapının dışı",
        "paragraphs": [
          "Marhalden son dönemde mülteci girişini kapatmıştır. Nöbetin gücü, bu kararın bekleyen insanlara verdiği zararı ortadan kaldırmaz. Elva taşıma ve teslim düzenini, Savren geçit güvenliğini savunurken haneler ve kervanlar aynı kapının dışında farklı ihtiyaçlarla bekler.",
          "Uldar, Tolvur ve Toran’dan erzak gelir; Hardlane tarafındaki Harven ve Mavric’te Marhalden’in koruma ve tahsilat ilişkisi sürer. Oraya gönderilen küçük nöbetler bütün batıyı egemenlik altına almaz. Duvarlar sağlamdır, su temizdir; yine de bakım, iaşe ve insan kararı şehrin savunmasının gerçek sınırlarıdır."
        ]
      }
    ]
  },
  {
    "id": "elorwyn-adak-muhafizlari",
    "name": "Elorwyn Adak Muhafızları",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Paladin, rahip ve rahibelerin ayrı hizmetleri",
    "mapLocation": "elorwyn",
    "summary": "Elorwyn, Tharion Elorwynder’in yönetiminde eski hanedan geleneğini sürdürür. Adak Muhafızları paladinlerin ön sıra ve refakat hizmetini, Siper Rahibeleri eğitimli savunma ve yaralı tahliyesini, sefer rahipleri bakım ve ibadet düzenini taşır. Bu kollar aynı şehirde bağlı işler yapar, aynı unvanı taşımaz.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "elorwyn",
      "caldris-evern",
      "rahela-dorn",
      "veyren-sahl",
      "orena-vel",
      "seldric-nove"
    ],
    "sections": [
      {
        "title": "Hanedan ve dinî askerî güç",
        "paragraphs": [
          "Elorwyn, Tharion Elorwynder’in yönetiminde eski hanedan geleneğini sürdürür. Adak Muhafızları paladinlerin ön sıra ve refakat hizmetini, Siper Rahibeleri eğitimli savunma ve yaralı tahliyesini, sefer rahipleri bakım ve ibadet düzenini taşır. Bu kollar aynı şehirde bağlı işler yapar, aynı unvanı taşımaz.",
          "Caldris Evern paladin komutanı, Rahela Dorn Siper Rahibeleri başı, Veyren Sahl sefer rahibidir. Altlarında yeminli savaşçılar, adaylar, refakat erleri, bakım yardımcıları ve depo görevlileri bulunur. Dinî gücün görünür yüzleri beş isimle sınırlı bir ordu demek değildir."
        ]
      },
      {
        "title": "Sert şehir, ortak hukuk",
        "paragraphs": [
          "Orena Vel yerel ruhsat ve ayin denetimini, Seldric Nove lordluk kayıtlarını yürütür. Elorwyn’in yerel denetimi serttir; genel krallık kanonundaki ruhsatlı büyü serbestliğini yok eden başka bir ülke hukuku değildir. Ruhsatsız uygulama ve kurban ritüelleri yasaktır; tapınak unvanı izin belgesinin yerine geçmez.",
          "Caldris ile Rahela aynı yemini farklı ölçülerle yorumlayabilir. Biri sıra ve bağlılığı, diğeri yaralının önceliğini savunur. Veyren bu tartışmaya bakım deneyimiyle katılır; din adamlarının tek bir irade gibi gösterilmesi şehirdeki gerçek kararları gizler."
        ]
      },
      {
        "title": "Bir ailenin ötesindeki sadakat",
        "paragraphs": [
          "Tharion güncel lorddur; Ser Valerius görünür bir siyasi rakiptir ve Rina Ironvale onun yaveridir. Yeni hizmet kadroları bu ilişkiyi gizli soy bilgisiyle açıklamaz. Bir şehrin insanı hanedana bağlı olabilir, aynı anda bazı uygulamalarına açıkça karşı çıkabilir.",
          "Paladinlerin zırhı, rahibelerin kalkanı ve rahiplerin bakım sandığı aynı pazar ve iaşe düzeninden geçer. Elorwyn’i oynatılabilir kılan şey yalnız büyük aile değil, bu aileyle görüşen, itiraz eden ve birlikte hizmet veren adlandırılmış insanlardır."
        ]
      }
    ]
  },
  {
    "id": "kethra-kiyi-hizmetleri",
    "name": "Kethra Kıyı Hizmetleri",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Hane, rıhtım ve kıyı bakımı",
    "mapLocation": "kethra",
    "summary": "Kethra’da Damian Elorwynder yönetimi, Aveline’nin hane görüşmeleri ve liman işlerinin gündelik hesabı yan yana bulunur. Tavera Oss liman devriyesi kaptanı, Branis Dov hane ve erzak vekili, Melra Shen kıyı şifacısı ve öğretmenidir. Bu işler bir tek hane unvanının içinde görünmez olmaz.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "kethra",
      "damian",
      "aveline",
      "rook",
      "tavera-oss",
      "branis-dov",
      "melra-shen",
      "seraphinia"
    ],
    "sections": [
      {
        "title": "Lordluk ile liman",
        "paragraphs": [
          "Kethra’da Damian Elorwynder yönetimi, Aveline’nin hane görüşmeleri ve liman işlerinin gündelik hesabı yan yana bulunur. Tavera Oss liman devriyesi kaptanı, Branis Dov hane ve erzak vekili, Melra Shen kıyı şifacısı ve öğretmenidir. Bu işler bir tek hane unvanının içinde görünmez olmaz.",
          "Liman devriyeleri iskele nöbetçileri ve teslim refakatçileriyle çalışır; Branis depo ve ödeme yazmanlarını, Melra bakım yardımcılarını ve stajyerleri düzenler. Şehir güvenliği bir kaptanın kılıcından, kıyı sağlığı bir şifacının adından daha geniş bir iştir."
        ]
      },
      {
        "title": "Gemi geldiğinde",
        "paragraphs": [
          "Tavera, Mor Donanma kaptanı Ceryn Hale’den teslim alırken açık deniz komutasını rıhtımın içinde sınırsız bir yetkiye çevirmesine izin vermez. Branis geciken erzağın haneye ve pazara etkisini hesaba katar. Bir fırtınanın yalnız gemiyi değil şehirde bekleyen ücretleri de değiştirdiğini bilirler.",
          "Melra’nın büyülü şifası ruhsat alanıyla sınırlıdır; bakım ve öğretim bütün dertleri tek bir uygulamayla silmez. Seraphinia gibi yerel yüzlerin karşılaştığı gecikme veya ihtiyaç, yüksek hane görüşmelerinin gündelik sonucunu gösterir."
        ]
      },
      {
        "title": "Harabelerin sahibi başka iş yapar",
        "paragraphs": [
          "Damian’ın oğlu Rook Valdenar, Rydorn Sırtı harabelerinin bulunduğu arazinin sahibidir. Bu mülkiyet bütün sırtın, her sıcak suyun veya Kethra liman komutasının ona ait olduğu anlamına gelmez. Mevcut kayıt ile bilinmeyen eski geçmiş ayrı tutulur.",
          "Kethra Kıyı Hizmetleri bir üst kraliyet dairesi değil, şehirdeki görevlerin envanteridir. Hane, devriye ve bakımın kendi sınırları vardır. Bu sınırlar çatışmayı kaldırmaz; karşılaşılabilir kişilerin neden birbirine itiraz edebildiğini anlaşılır kılar."
        ]
      }
    ]
  },
  {
    "id": "hardlane-ocak-agi",
    "name": "Hardlane Ocak Ağı",
    "kind": "institution",
    "region": "danstsud",
    "subtitle": "Bir bölgeyi aynı devlet gibi göstermeyen kıyı kadroları",
    "mapLocation": "frostbay",
    "summary": "Frostbay’de Nera Veld’in sınırlı idaresi, Odran Vehl’in yetersiz garnizonu, Ivren Vask’ın posta ve gümrük kaydı, Hessa Rund’ın aşevleri yan yana bulunur. Bu kadro bütün Hardlane’de güçlü bir yönetim kurmuş sayılmaz. Eski yuvarlak taş yapılar yeni işlerde kullanılır; bölgenin geçmiş iklimi hakkında kesin açıklama yapılmaz.",
    "sources": [
      "Şehirler ve Kadrolar · 8 Ekim 2026 yetkilendirilmiş yeni yazım",
      "Danstsud kamu kanonu · darbe öncesi"
    ],
    "related": [
      "frostbay",
      "nera-veld",
      "odran-vehl",
      "ivren-vask",
      "hessa-rund",
      "garran-veyl",
      "orna-kehl",
      "dovek-raal",
      "mera-sorn",
      "selvi-arn",
      "teren-moll"
    ],
    "sections": [
      {
        "title": "Kâğıttaki bağlılık, kıyıdaki insanlar",
        "paragraphs": [
          "Frostbay’de Nera Veld’in sınırlı idaresi, Odran Vehl’in yetersiz garnizonu, Ivren Vask’ın posta ve gümrük kaydı, Hessa Rund’ın aşevleri yan yana bulunur. Bu kadro bütün Hardlane’de güçlü bir yönetim kurmuş sayılmaz. Eski yuvarlak taş yapılar yeni işlerde kullanılır; bölgenin geçmiş iklimi hakkında kesin açıklama yapılmaz.",
          "Dranthol’da Ser Garran Veyl’in garnizonu ve Orna Kehl’in fener-batarya hizmeti farklı bir güvenlik ölçeği taşır. Ternhaven’de Mera Sorn’un ocak meclisiyle Selvi Arn’ın sıcak su bakımı, Kaldmere’de Teren Moll’un barınak halkası sınırlı yerel dayanışmayı sürdürür."
        ]
      },
      {
        "title": "Ağ bir taç kurumu değildir",
        "paragraphs": [
          "Buradaki Ocak Ağı, bütün bu şehirleri yöneten yeni bir üst makam adı değildir; mektuplar, bakım bilgisi ve erzak haberleriyle ilişki kuran kişilerin okunabilir envanteridir. Frostbay’in resmî bağlılığı çoğu yerde kâğıt üstünde kalır. Kaldmere’ye bir sözcü eklemek kamu altyapısı veya etkin kraliyet idaresi getirmez.",
          "Vyssgard’de Dovek Raal’ın iskele çevresi, zorla uygulanan çete düzeninin parçasıdır. Onun güvenlik vaadi eşit yurttaşlık değil kendi yararına zorla ayakta tutulan bir pazardır. İskeleden gelen mektubun ağı taşıması onu güvenilir bir kraliyet görevlisine dönüştürmez."
        ]
      },
      {
        "title": "Bir tasın dolaşımı",
        "paragraphs": [
          "Hessa’nın erzak isteği, Ivren’in paketlediği mektup ve Garron Veldrith’in sarayda izini sürdüğü dilekçe aynı zincirin farklı halkalarıdır. Her mektup cevaplanmaz, her tahsis teslim edilmez. Kül Üzerine Ocak ve yatırım reformlarının kâğıdı da bitmiş altyapı yerine geçmez.",
          "Kemiğe Basan Yol uzun ve güvensizdir; Cevher Çizgisi hiç yapılmamış proje olarak kalır. Bu nedenle bölgede iyi niyetli kişilerin varlığı güçlü bir devlet erişimi yaratmaz. Hardlane’in gündelik lore’u, yardım etmek isteyenle bundan çıkar sağlayanın aynı soğuk kıyıda yaşamasından güç alır."
        ]
      }
    ]
  }
]

const establishedDanstsudCharacters: Character[] = [
  {
    "id": "ardel-veyran",
    "name": "Ser Ardel Veyran",
    "role": "On İki Taç Şövalyesi başı",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "ardel-veyran",
    "traits": [
      "Görev disiplini",
      "Taşçı kökeni",
      "Ölçülü sadakat"
    ],
    "summary": "On İki Taç Şövalyesi’nin başındaki Ardel, saray hizmetini bir kahraman gösterisinden çok birbirini denetleyen on iki ayrı sorumluluk olarak kurar.",
    "background": "Ardel Veyran, Valdareth’in taşçı ailelerinden birinde büyüdü. Gençliğinde sur onarım ekiplerine eşlik ederken bir kapı çökmesinin meydan savaşından daha çok insan öldürebileceğini gördü. Bir baskın sırasında kapıyı düşmana bırakmamak için verilen emri uyguladı; ardından sıkışan işçileri çıkarmak için kendi nöbetini yarıda bıraktı. Hem cesareti hem itaatsizliği aynı rapora yazıldı.",
    "presence": "Cebinde tuttuğu küçük deri defterde parlak zaferler değil, yerine gelmeyen nöbetler vardır. Hükümdara sadıktır; bu sadakati insanların yerini kâğıttan silmek olarak görmez. Valdareth’te bugün On İki’nin görevini dağıtır, bir saray emrinin hangi birliğe ait olduğunu açık tutar ve kendisinin de hesap vermesi gereken kayıtları saklar.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "eryndorn",
      "vesren-kald",
      "rickon",
      "selka-orven"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Ardel Veyran, Valdareth’in taşçı ailelerinden birinde büyüdü. Gençliğinde sur onarım ekiplerine eşlik ederken bir kapı çökmesinin meydan savaşından daha çok insan öldürebileceğini gördü. Bir baskın sırasında kapıyı düşmana bırakmamak için verilen emri uyguladı; ardından sıkışan işçileri çıkarmak için kendi nöbetini yarıda bıraktı. Hem cesareti hem itaatsizliği aynı rapora yazıldı.",
          "Bu raporu okuyan Eryndorn onu affedip unutmak yerine saray muhafaza hizmetine aldı. Ardel yıllar içinde hükümdarın çevresindeki şövalyeler arasında görev çizelgesi, ikame nöbeti ve yazılı sorumluluk usulünü yerleştirdi. On İki’nin başına gelmesi bir düellonun değil, birbirini sevmeyen yetenekli insanları aynı kapıyı korur hâle getirmesinin sonucuydu."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Vesren Kald ile saray güvenliği konusunda çalışır; fakat Mor Pelerin’in komutasını kendi makamına katmaz. Sir Rickon Thornhall’a eski kapı olayından beri saygı duyar ve şehir muhafızının bilgisine saray haritasından daha çok güvenebilir. Şövalyelerden Selka Orven’in yol raporlarını ise kâtibin temize çekmesini beklemeden okur.",
          "Cebinde tuttuğu küçük deri defterde parlak zaferler değil, yerine gelmeyen nöbetler vardır. Hükümdara sadıktır; bu sadakati insanların yerini kâğıttan silmek olarak görmez. Valdareth’te bugün On İki’nin görevini dağıtır, bir saray emrinin hangi birliğe ait olduğunu açık tutar ve kendisinin de hesap vermesi gereken kayıtları saklar."
        ]
      }
    ]
  },
  {
    "id": "selka-orven",
    "name": "Dame Selka Orven",
    "role": "Taç şövalyesi · kral yolu görevlisi",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "selka-orven",
    "traits": [
      "Yol deneyimi",
      "Açık sözlü",
      "Arabacıların dostu"
    ],
    "summary": "Kralın Yolu’ndaki kraliyet refakatlerini denetleyen Selka, sarayda yolun çamurunu unutmayan şövalyedir.",
    "background": "Selka’nın annesi Doğu Aldara kıyısında araba tamir ederdi. Selka önce tekerlek yapmayı, sonra at sürmeyi öğrendi; uzun süre taşra kervanlarına ücretli refakatçi olarak katıldı. Bir bahar selinde kraliyet yük arabalarını kurtarmak yerine köprüde mahsur kalan yolcuları karşıya taşıması sözleşmesini kaybetmesine yol açtı.",
    "presence": "Annesinin iki kez onardığı katlanır haritayı yanında taşır; düzgün saray kopyaları kadar temiz değildir. Kraliyet heyetleri ve önemli erzak refakatleri görev alanıdır. Marhalden’in batısına uzanmış tamamlanmış bir kral yolu varmış gibi emir vermez; geçit dışındaki koşulları sözlü güvenceyle geçiştirmekten hoşlanmaz.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "ardel-veyran",
      "darsen-roth",
      "nalven-rieth",
      "kralin-yolu"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Selka’nın annesi Doğu Aldara kıyısında araba tamir ederdi. Selka önce tekerlek yapmayı, sonra at sürmeyi öğrendi; uzun süre taşra kervanlarına ücretli refakatçi olarak katıldı. Bir bahar selinde kraliyet yük arabalarını kurtarmak yerine köprüde mahsur kalan yolcuları karşıya taşıması sözleşmesini kaybetmesine yol açtı.",
          "Olay büyüdüğünde yükün sahibi onu cezalandırmak istedi. Ardel Veyran, sağlam kalan köprü ayağının Selka’nın kurduğu halat düzeniyle korunduğunu ortaya koydu. Selka taç hizmetine alındı, yıllar sonra şövalye yeminini etti. Yalnız güzel havada geçilen bir yolun tamamlanmış sayılmasına hâlâ itiraz eder."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Darsen Roth, asker sevki için yolun açık tutulmasını isterken Selka arabacıların dinlenme aralıklarını savunur. Nalven Rieth’in Luthen karakolundan gelen bakım notlarını kendi dosyasına ekler; böylece küçük bir köprü sorunu başkentte adı olmayan bir gecikmeye dönüşmez.",
          "Annesinin iki kez onardığı katlanır haritayı yanında taşır; düzgün saray kopyaları kadar temiz değildir. Kraliyet heyetleri ve önemli erzak refakatleri görev alanıdır. Marhalden’in batısına uzanmış tamamlanmış bir kral yolu varmış gibi emir vermez; geçit dışındaki koşulları sözlü güvenceyle geçiştirmekten hoşlanmaz."
        ]
      }
    ]
  },
  {
    "id": "beltran-sael",
    "name": "Ser Beltran Sael",
    "role": "Taç şövalyesi · silah talimi ustası",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "beltran-sael",
    "traits": [
      "Eski gösterici",
      "Sabırlı eğitmen",
      "Yamayı sever"
    ],
    "summary": "Taç şövalyelerinin silah talimini yürüten Beltran, yaşlanmış bir bedenin yerini alacak doğru hareketleri öğretir.",
    "background": "Beltran, Valdareth’te nalbant yanında çalışırken meydandaki kılıç gösterilerinden para kazanıyordu. Gençliğinin en çok alkış alan hareketi, bir gerçek çatışmada kolunu yaralattı. Aylarca ağır iş yapamayınca gösteriyle hayatta kalma arasındaki farkı kılıçtan daha uzun süre elinde tuttu.",
    "presence": "Kullanımı aşınmış kösele eldivenlerini yenilemek yerine yamalar. Çocuklarıyla yemek masasında tartışmamak için talim sırasında biriktirdiği öfkeyi avluda tükettiğini söyler. Başkentin On İki şövalyesinden biri olsa da zırhsız aceminin önünde kendi hatasını göstermeyi küçüklük saymaz.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "nethan-caul",
      "fara-nidren",
      "ghorin",
      "hadrik-solm"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Beltran, Valdareth’te nalbant yanında çalışırken meydandaki kılıç gösterilerinden para kazanıyordu. Gençliğinin en çok alkış alan hareketi, bir gerçek çatışmada kolunu yaralattı. Aylarca ağır iş yapamayınca gösteriyle hayatta kalma arasındaki farkı kılıçtan daha uzun süre elinde tuttu.",
          "Sonraki yıllarda şehir muhafızlarına talim verdi. Kralın önündeki seçme sırasında parlak bir hamle yapmadı; yorulan eşinin açık tarafını kapattı. Bu yüzden saray çevresine kabul edildi. Bugün yaşlı bir talim ustası olarak kılıcın keskinliğinden önce ayakkabının yere nasıl bastığını sorar."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Nethan Caul’un adaylara tanıdığı ikinci deneme hakkını destekler; Fara Nidren’in hızlı nöbet değişimlerini ise gereğinden sık düzeltir. Tek-Göz Ghorin’den alınan eski eğitim bıçaklarının dengesini iyi bilir ve Lirendil’deki Hadrik Solm ile kalkan talimi notları değiştirir.",
          "Kullanımı aşınmış kösele eldivenlerini yenilemek yerine yamalar. Çocuklarıyla yemek masasında tartışmamak için talim sırasında biriktirdiği öfkeyi avluda tükettiğini söyler. Başkentin On İki şövalyesinden biri olsa da zırhsız aceminin önünde kendi hatasını göstermeyi küçüklük saymaz."
        ]
      }
    ]
  },
  {
    "id": "miren-halvyr",
    "name": "Dame Miren Halvyr",
    "role": "Taç şövalyesi · saray arşivi koruyucusu",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "miren-halvyr",
    "traits": [
      "Dikkatli göz",
      "Kayıt koruması",
      "Sert sınırlar"
    ],
    "summary": "Miren Halvyr, saray arşivinin kapısında belgeyi okuyanın unvanından önce erişim hakkını sorar.",
    "background": "Miren’in ailesi başkentte mühür kutuları ve kitap kapakları yapardı. Babasının atölyesinde deri ile balmumunun kokusu içinde yetişti. Bir taşra beratının yanlış dolaba kaldırılması yüzünden ailelerin yıllarca aynı arazi için dava açtığını izleyince askerî hizmette bile kaydın yerini önemsemeye başladı.",
    "presence": "Kemerindeki anahtarları her gece aynı sırayla dizer. Temiz bir kopyaya güvenmektense eskisinin neden yırtıldığını sorar. Görevi saray arşivinin güvenliğini ve ziyaret refakatini sağlamak; sahip olmadığı hukuk yetkisiyle bir kaydı ortadan kaldırmak değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "orren-vask",
      "ellyn",
      "adera-voss"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Miren’in ailesi başkentte mühür kutuları ve kitap kapakları yapardı. Babasının atölyesinde deri ile balmumunun kokusu içinde yetişti. Bir taşra beratının yanlış dolaba kaldırılması yüzünden ailelerin yıllarca aynı arazi için dava açtığını izleyince askerî hizmette bile kaydın yerini önemsemeye başladı.",
          "Sarayda ilk görevi gece kapısı nöbetiydi. Üzerinde gerçek bir mühür bulunan ama başka bir emre ait zarfı içeri almaması, öfkeli bir asilzadenin şikâyetine yol açtı. Orren Vask kayıtları açınca Miren haklı çıktı. On İki’ye girişi, kimsenin bakmadığı bir kat izini fark etmesiyle başladı."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Başmühürdar Orren Vask ile usulü paylaşır, onun makamını kullanarak içerik kararı vermez. Ellyn Marowen’den belge koruma öğrendi; Dame Adera Voss ile kabul günlerinde kimin hangi kayıtla görüşebileceğini planlar. Üçü de beklemeyi sever görünür, fakat yanlış insanın bekletilmesine farklı ölçülerle kızar.",
          "Kemerindeki anahtarları her gece aynı sırayla dizer. Temiz bir kopyaya güvenmektense eskisinin neden yırtıldığını sorar. Görevi saray arşivinin güvenliğini ve ziyaret refakatini sağlamak; sahip olmadığı hukuk yetkisiyle bir kaydı ortadan kaldırmak değildir."
        ]
      }
    ]
  },
  {
    "id": "dain-torven",
    "name": "Ser Dain Torven",
    "role": "Taç şövalyesi · hane ve berat refakati",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "dain-torven",
    "traits": [
      "Belge refakati",
      "Eski utanç",
      "Düzeltme isteği"
    ],
    "summary": "Dain Torven, lordluk beratları ve kraliyet görevlileriyle yolculuk eden bir taç şövalyesidir; onuru kimin imza attığını sormakta bulur.",
    "background": "Dain çocukken han avlusunda ağır bavullar taşırdı. Adı soylu müşterilere benzediği için bir ara kendisini uzak bir ailenin oğlu diye tanıttı; gerçek anlaşılınca han sahibi onu kovmadı, ama hesabı kendi adıyla tutmasını istedi. O utancı hiçbir tören kıyafeti silemedi.",
    "presence": "Dain mühürleri taşıdığı kutunun içine eski han hesabından kesilmiş bir parça deri yerleştirir. Naziktir, fakat kendi hatasını bir başkasında görünce fazla sertleşebilir. Bugün görevi beratları güvenle götürmek ve hane görevlilerini korumak; bir mektubun arkasındaki lordluğu ele geçirmek değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "orren-vask",
      "mirelda",
      "ensel-drunn"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Dain çocukken han avlusunda ağır bavullar taşırdı. Adı soylu müşterilere benzediği için bir ara kendisini uzak bir ailenin oğlu diye tanıttı; gerçek anlaşılınca han sahibi onu kovmadı, ama hesabı kendi adıyla tutmasını istedi. O utancı hiçbir tören kıyafeti silemedi.",
          "Kraliyet ulağına gönüllü refakat ederken bir taşra lordunun mühürlü talebini saray buyruğu sanıp kapı açtırdı. Sonuçta iki yük tüccarın itirazını dinlemeden alıkondu. Dain hatasını kayda geçirdi ve zararın ödenmesi için kendi ücretini bıraktı. Orren Vask onu cezadan sonra belge refakati hizmetine önerdi."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Mirelda Vaeranth’ın taşra görüşmelerinde güvenilir bir refakatçidir; onun nezaketini bir emrin yerine koymaz. Ensel Drunn ile tartı evrakı üzerinde sık tartışır, çünkü Dain’in düzgün mühür arayışı Ensel’in limandaki aceleci hesabını yavaşlatır.",
          "Dain mühürleri taşıdığı kutunun içine eski han hesabından kesilmiş bir parça deri yerleştirir. Naziktir, fakat kendi hatasını bir başkasında görünce fazla sertleşebilir. Bugün görevi beratları güvenle götürmek ve hane görevlilerini korumak; bir mektubun arkasındaki lordluğu ele geçirmek değildir."
        ]
      }
    ]
  },
  {
    "id": "ysra-fenhol",
    "name": "Dame Ysra Fenhol",
    "role": "Taç şövalyesi · kraliçe maiyeti",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "ysra-fenhol",
    "traits": [
      "Kraliçe refakati",
      "Dış sur kökeni",
      "Kalabalık yönetimi"
    ],
    "summary": "Kraliçe Alisande’nin yakın refakat şövalyesi Ysra, başkentte güvende kalmakla dış mahallelere erişebilmek arasındaki dengeyi korur.",
    "background": "Ysra beş surun dış kuşağında bir fırıncı ailesinde yetişti. İlk askerlik yılında hasat yükleri kapıda yığılınca kapıyı daha erken açtırması disiplin cezası getirdi. Ekmeklerin bozulmadığı günü ailesi bayram saydı; nöbet çizelgesi ise onu aynı şekilde anmadı.",
    "presence": "Evindeki küçük fırından hâlâ haftada bir ekmek alır; eski komşular onu unvanından önce adıyla çağırır. Kraliçenin yolunu güvenli tutar, fakat o yolun sokağa hiç çıkmamasını iyi bir güvenlik başarısı saymaz. Yılların deneyimi onu şefkatli olduğu kadar inatçı da yapmıştır.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "alisande",
      "sera-neld",
      "thessa-morain",
      "ardel-veyran"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Ysra beş surun dış kuşağında bir fırıncı ailesinde yetişti. İlk askerlik yılında hasat yükleri kapıda yığılınca kapıyı daha erken açtırması disiplin cezası getirdi. Ekmeklerin bozulmadığı günü ailesi bayram saydı; nöbet çizelgesi ise onu aynı şekilde anmadı.",
          "Yıllar sonra saray yardım dağıtımında çıkan izdihamı kılıç çekmeden durdurdu. İnsanları itmek yerine arabaların etrafında iki boş geçit açması Alisande’nin dikkatini çekti. Kraliçenin maiyetine alındığında saray korumasının dışarıdaki yoksulu uzaklaştırmakla aynı şey olmadığını savundu."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Alisande’ye bağlıdır ve Sera Neld ile yardım taşıyan arabaların düzenini kurar. Thessa Morain’e gençken büyüttüğü bir nöbetçiyi yaralı hâlde emanet ettiği için güveni kişiseldir. Ardel ile anlaşmazlığı, bir iç kapının kapanmasının kimin gününü bozduğu sorusunda çıkar.",
          "Evindeki küçük fırından hâlâ haftada bir ekmek alır; eski komşular onu unvanından önce adıyla çağırır. Kraliçenin yolunu güvenli tutar, fakat o yolun sokağa hiç çıkmamasını iyi bir güvenlik başarısı saymaz. Yılların deneyimi onu şefkatli olduğu kadar inatçı da yapmıştır."
        ]
      }
    ]
  },
  {
    "id": "ovel-rann",
    "name": "Ser Ovel Rann",
    "role": "Taç şövalyesi · tahkimat danışmanı",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "ovel-rann",
    "traits": [
      "İskele ustalığı",
      "İnatçı temkin",
      "Duvar bakımı"
    ],
    "summary": "Taç şövalyesi Ovel Rann’ın savaş bilgisi, duvarın nasıl yıkıldığı kadar insanların onu nasıl ayakta tuttuğunu bilmekten gelir.",
    "background": "Ovel’in ilk maaşı bir marangoz çırağı ücretidir. Başkent surlarında iskele kurarken taşın ağırlığını, kötü kerestenin sesini ve acele işin bedelini öğrendi. Tahkimat hizmetine geçtiğinde bunları bir çizimden daha iyi anlatabiliyordu.",
    "presence": "Babasının ahşap gönye aletini taşıdığı için sarayda alay edilir. Yine de masraflı taş görünümüne güvenmektense drenajı açtırır. On İki içinde tahkimat ve geçici savunma görevini üstlenir; yüksek surun arkasında saklanan ihmalin de bir düşman olduğunu düşünür.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "tormal-fenn",
      "savren-urn",
      "darsen-roth"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Ovel’in ilk maaşı bir marangoz çırağı ücretidir. Başkent surlarında iskele kurarken taşın ağırlığını, kötü kerestenin sesini ve acele işin bedelini öğrendi. Tahkimat hizmetine geçtiğinde bunları bir çizimden daha iyi anlatabiliyordu.",
          "Bir fırtına gecesi iskeleye asker çıkarmayı reddetti; ertesi sabah bağlardan biri gerçekten koptu. Korkaklık suçlamasından kurtulması ödül getirmedi, fakat işçilerin güvenini kazandırdı. Sarayda bir iç kale güçlendirmesini tamamlayınca şövalye yeminine davet edildi; ölçü ipini kılıcından önce masaya koydu."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Tormal Fenn ile kereste kalitesi üzerine eski ve sert bir dostluğu vardır. Savren Urn’a Marhalden’deki küçük kuşatma düzeneklerinin bakımını öğretirken dağ şehrinin yöntemlerinden de yararlandı. Mavi Pelerin komutanı Darsen Roth’un hız isteği, Ovel’in en sık karşı koyduğu baskıdır.",
          "Babasının ahşap gönye aletini taşıdığı için sarayda alay edilir. Yine de masraflı taş görünümüne güvenmektense drenajı açtırır. On İki içinde tahkimat ve geçici savunma görevini üstlenir; yüksek surun arkasında saklanan ihmalin de bir düşman olduğunu düşünür."
        ]
      }
    ]
  },
  {
    "id": "thessa-morain",
    "name": "Dame Thessa Morain",
    "role": "Taç şövalyesi · sefer hastanesi refakati",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "thessa-morain",
    "traits": [
      "Yaralı refakati",
      "Bakım disiplini",
      "Sert şefkat"
    ],
    "summary": "Sefer hastanelerinin refakat şövalyesi Thessa, iyileşemeyen bir askerin adını başarı raporunun dışında bırakmaz.",
    "background": "Thessa’nın ailesi Valdareth’te bez boyardı. Gençliğinde yaralılar için temiz bez hazırlayarak bir askerî revirde işe başladı; kalkan kullanmayı, revir arabalarının başına binen saldırılar yüzünden öğrendi. İlk gerçek çatışmasında düşmanı kovalamak yerine devrilen hastane arabasını kaldırdı.",
    "presence": "Boya atölyesinden kalan soluk mavi bir bez kesesini ilaç listeleri için kullanır. Yaralıya yaklaşırken adını sorar, ama ihmalkâr bir komutana karşı oldukça serttir. Güncel görevi hastane refakati ve tahliye güvenliğidir; ruhsatlı hekimlerin yerine kendi başına şifa dağıtmaz.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "ysra-fenhol",
      "nelra-ven",
      "zylara"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Thessa’nın ailesi Valdareth’te bez boyardı. Gençliğinde yaralılar için temiz bez hazırlayarak bir askerî revirde işe başladı; kalkan kullanmayı, revir arabalarının başına binen saldırılar yüzünden öğrendi. İlk gerçek çatışmasında düşmanı kovalamak yerine devrilen hastane arabasını kaldırdı.",
          "Kaçış sayılan bu davranışı, taşıdığı yaralıların tanıklığı değiştirdi. Sonraki yıllarda refakat birliğine geçti; ruhsatlı şifacıların işini anlamak için büyü öğrenmedi, bakım kayıtlarını okumayı öğrendi. On İki’ye seçildiğinde seferde yaralı taşımanın bir yan görev olmaktan çıkarılmasını istedi."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Ysra Fenhol ile yardım güzergâhlarını, Nelra Ven ile hareketli revirlerin ne taşıyabileceğini konuşur. Zylara’nın tavsiyesiyle saray raporlarında yaralanmadan sonra işe dönebilme durumuna da yer açmıştır. Bu ilişki iyileşmenin tek bir iyi büyüden ibaret olmadığını sürekli hatırlatır.",
          "Boya atölyesinden kalan soluk mavi bir bez kesesini ilaç listeleri için kullanır. Yaralıya yaklaşırken adını sorar, ama ihmalkâr bir komutana karşı oldukça serttir. Güncel görevi hastane refakati ve tahliye güvenliğidir; ruhsatlı hekimlerin yerine kendi başına şifa dağıtmaz."
        ]
      }
    ]
  },
  {
    "id": "garron-veldrith",
    "name": "Ser Garron Veldrith",
    "role": "Taç şövalyesi · dilekçe heyetleri refakati",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "garron-veldrith",
    "traits": [
      "Heyet refakati",
      "Han kökeni",
      "Gerilimi yatıştırır"
    ],
    "summary": "Garron, taşradan gelen dilekçe heyetlerinin saraya ulaşmasını sağlayan şövalyedir; dinlenmenin de güvenlik olduğunu bilir.",
    "background": "Garron yıllarca Valdareth kapılarında han işletmiş bir ailenin oğludur. Yüksek salona ulaşmak için gelenlerin en parlak konuşmalarını değil, en yorgun gecelerini gördü. Şehir muhafızlığına katıldığında heyetlerin kötü konaklama yüzünden birbirine girdiği bir olayda taraf tutmayı reddetti.",
    "presence": "Yürüyüş değneğinin sapına eski hanın küçük işareti kazılıdır. Gösterişli değildir; bazen huzuru korumak için insanların öfkesini gereğinden çabuk susturabilir. Bugün onuru, saraya gelenin aynı adla geri çıkmasını ve sözü duyulduysa bunun gerçekten kayıt altında olmasını sağlamaktadır.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "teren-halvek",
      "adera-voss",
      "hessa-rund"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Garron yıllarca Valdareth kapılarında han işletmiş bir ailenin oğludur. Yüksek salona ulaşmak için gelenlerin en parlak konuşmalarını değil, en yorgun gecelerini gördü. Şehir muhafızlığına katıldığında heyetlerin kötü konaklama yüzünden birbirine girdiği bir olayda taraf tutmayı reddetti.",
          "Kapıdaki huzursuzluğu bastırmak yerine boş bir depo açtırıp aileleri ayrı ayrı yatırdı. Teren Halvek bu küçük çözümü göreve çevirdi. Garron sonradan saray refakatine geçti ve taç şövalyesi oldu; saygınlığı büyük bir düşmanı öldürmesinden değil, büyümeden önlediği kavgalardan gelir."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Teren’le konaklama düzenini, Dame Adera Voss ile kabul sırasını planlar. Hessa Rund’ın Frostbay’den gönderdiği dilekçelerin başkentte kaybolmaması için de aracı olur; ona özel bir zafer sözü vermez, yalnız dosyanın izini sürer.",
          "Yürüyüş değneğinin sapına eski hanın küçük işareti kazılıdır. Gösterişli değildir; bazen huzuru korumak için insanların öfkesini gereğinden çabuk susturabilir. Bugün onuru, saraya gelenin aynı adla geri çıkmasını ve sözü duyulduysa bunun gerçekten kayıt altında olmasını sağlamaktadır."
        ]
      }
    ]
  },
  {
    "id": "kelyra-esven",
    "name": "Dame Kelyra Esven",
    "role": "Taç şövalyesi · ruhsatlı savunma büyücüsü",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "kelyra-esven",
    "traits": [
      "Ruhsatlı savunma",
      "Deneme kayıtları",
      "Açık sınırlar"
    ],
    "summary": "Kelyra, On İki’nin ruhsatlı savunma büyücüsüdür; duvara eklediği bir işaretin sınırını kılıcının menzili kadar açık söyler.",
    "background": "Kelyra taşra bir bakır atölyesinde büyüdü. Ustaların aynı kalıptan çıkardığı parçaların neden farklı davrandığını merak ederek Theramis’e gitti. İlk yıllarında iyi bir uygulayıcıdan çok titiz bir deneme yazmanıydı; yanlış çıkan bir ölçümü saklamayı reddetmesi eğitiminin en pahalı kararına dönüştü.",
    "presence": "Çatlak olmayan küçük bir bakır diski deneme için taşır, büyüsüz hâlini de gösterir. Nüfuzunu bilir ve bunun verdiği rahatlıktan korkar. Saray savunma büyüsünü kayıtlı sınırlar içinde uygular; izinsiz uygulama ve kurban ritüellerini hiçbir görev zorunluluğuyla haklı göstermez.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "lethan-orve",
      "mavena-riel",
      "darom-selis",
      "ardel-veyran",
      "buyu-ruhsatlari"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Kelyra taşra bir bakır atölyesinde büyüdü. Ustaların aynı kalıptan çıkardığı parçaların neden farklı davrandığını merak ederek Theramis’e gitti. İlk yıllarında iyi bir uygulayıcıdan çok titiz bir deneme yazmanıydı; yanlış çıkan bir ölçümü saklamayı reddetmesi eğitiminin en pahalı kararına dönüştü.",
          "Koruyucu bir düzeneğin gösteride başarılı olup uzun nöbette bozulduğunu açıkça yazdı. Darom Selis onu karşı-büyü eğitimine aldı. Sonradan ruhsatlı tahkimat hizmeti ve kılıç eğitimi birleşince saraya çağrıldı. Taç şövalyeliği ona okulun veya sicilin üstünde bir büyü yetkisi vermedi."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Lethan Orve’ye hizmet alanlarını düzenli bildirir; Mavena Riel ise onun ölçüm kayıtlarını öğrencilerle tartışır. Ardel’le yaptığı anlaşma, sihirli bir önlemin nöbetçinin yerini bütünüyle almayacağıdır. Bu yüzden sıradan muhafızların sorularını susturmak yerine çoğu zaman dinler.",
          "Çatlak olmayan küçük bir bakır diski deneme için taşır, büyüsüz hâlini de gösterir. Nüfuzunu bilir ve bunun verdiği rahatlıktan korkar. Saray savunma büyüsünü kayıtlı sınırlar içinde uygular; izinsiz uygulama ve kurban ritüellerini hiçbir görev zorunluluğuyla haklı göstermez."
        ]
      }
    ]
  },
  {
    "id": "nethan-caul",
    "name": "Ser Nethan Caul",
    "role": "Taç şövalyesi · yemin ve aday denetçisi",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "nethan-caul",
    "traits": [
      "Aday eğitimi",
      "İkinci şans",
      "Hamallık geçmişi"
    ],
    "summary": "Taç şövalyesi Nethan, yeni yemin adaylarının gücünden önce birlikte görev yapabilmesini sınar.",
    "background": "Nethan gençken dış surdaki hamallarla birlikte çalıştı ve askerlik sınavına üç kez girdi. İlkinde zayıf kılıcı, ikincisinde öfkesi yüzünden elendi. Üçüncüsünde daha güçlü değildi; talimde devrilen arkadaşını kaldırmak için kendi süresini kaybetmeyi kabul etmişti.",
    "presence": "Kardeşinin ördüğü yün bileklik zırhın altından görünür. İnsanlara ikinci bir deneme verir, fakat hatasını başkasına yükleyene üçüncüyü vermek istemez. Görevi taç hizmetindeki yemin adaylarını denetlemek; hiçbir taşra gencine soyadından dolayı hazır bir yer ya da hazır bir ret sunmamaktır.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "beltran-sael",
      "fara-nidren",
      "torena-vesk"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Nethan gençken dış surdaki hamallarla birlikte çalıştı ve askerlik sınavına üç kez girdi. İlkinde zayıf kılıcı, ikincisinde öfkesi yüzünden elendi. Üçüncüsünde daha güçlü değildi; talimde devrilen arkadaşını kaldırmak için kendi süresini kaybetmeyi kabul etmişti.",
          "Beltran Sael onu eğitmek için aldı. Hizmet yıllarında disiplin cezası verilen bir askerin başarısızlığının okunamayan talimatlardan kaynaklandığını ortaya çıkardı. O olaydan sonra aday eğitimine okuma ve bakım bilgisi eklenmesini istedi; saray şövalyeleri arasına girişi de bu ısrarla anılır."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Beltran’a borcunu onun bütün yöntemlerini aynen sürdürerek ödemez; yaşlı ustanın alaycı sözlerine bazen karşı çıkar. Fara Nidren’e iç kapı adayları yetiştirir, Torena Vesk’ten loncada kullanılan daha anlaşılır görev kâğıtlarını ister.",
          "Kardeşinin ördüğü yün bileklik zırhın altından görünür. İnsanlara ikinci bir deneme verir, fakat hatasını başkasına yükleyene üçüncüyü vermek istemez. Görevi taç hizmetindeki yemin adaylarını denetlemek; hiçbir taşra gencine soyadından dolayı hazır bir yer ya da hazır bir ret sunmamaktır."
        ]
      }
    ]
  },
  {
    "id": "adera-voss",
    "name": "Dame Adera Voss",
    "role": "Taç şövalyesi · kabul ve tören düzeni",
    "city": "valdareth",
    "affiliation": "On İki Taç Şövalyesi",
    "portrait": "adera-voss",
    "traits": [
      "Tören düzeni",
      "Terzi kökeni",
      "Sessiz inat"
    ],
    "summary": "Adera Voss, kraliyet kabul günlerinin düzenini taşır; bir törenin kimi dışarıda bıraktığını da izler.",
    "background": "Adera bir saray terzisinin kızıydı. Gençliğinde kıyafet dikmekten çok insanların o kıyafetle nasıl yürüdüğünü gözlemledi. Kraliyet maiyetinde görev aldığında birbirini tanımayan iki heyetin aynı renk işaret yüzünden yanlış salona gönderilmesini engelledi; küçücük ayrıntı bir görüşmeyi kurtardı.",
    "presence": "Eski terzi yüksüğünü boynunda bir bağın ucunda taşır. Görkemli bir günün başarısını, son konuğun da çıkış yolunu bulmasıyla ölçer. Kraliyet kabulü ve tören güvenliği onun görev alanıdır; sarayın kapısını açar, fakat taht adına karar veren kişi olduğunu ileri sürmez.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "miren-halvyr",
      "garron-veldrith",
      "mirelda"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Adera bir saray terzisinin kızıydı. Gençliğinde kıyafet dikmekten çok insanların o kıyafetle nasıl yürüdüğünü gözlemledi. Kraliyet maiyetinde görev aldığında birbirini tanımayan iki heyetin aynı renk işaret yüzünden yanlış salona gönderilmesini engelledi; küçücük ayrıntı bir görüşmeyi kurtardı.",
          "Saray hizmeti, refakat eğitimi ve yıllarca süren kabul nöbeti sonunda On İki’ye katıldı. İlk düzenlediği büyük törende zengin konukların arabalarıyla taşralıların yaya kuyruğunu ayırdı. Soylular bunu ayrıcalık sandı; yaya başvuruların daha erken içeri alındığını fark edince itiraz ettiler."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Miren Halvyr ile belge erişimini, Garron Veldrith ile heyetlerin dinlenmesini planlar. Mirelda’nın diplomatik inceliklerine saygı duyar ama nezaket uğruna bir itirazın kayıttan çıkarılmasına razı olmaz. Bu tavrı ona az dost, dayanıklı dostlar kazandırmıştır.",
          "Eski terzi yüksüğünü boynunda bir bağın ucunda taşır. Görkemli bir günün başarısını, son konuğun da çıkış yolunu bulmasıyla ölçer. Kraliyet kabulü ve tören güvenliği onun görev alanıdır; sarayın kapısını açar, fakat taht adına karar veren kişi olduğunu ileri sürmez."
        ]
      }
    ]
  },
  {
    "id": "vesren-kald",
    "name": "Vesren Kald",
    "role": "Mor Pelerin komutanı",
    "city": "valdareth",
    "affiliation": "Mor Pelerin",
    "portrait": "vesren-kald",
    "traits": [
      "Saray komutası",
      "Katı usul",
      "Parlak üniforma"
    ],
    "summary": "Mor Pelerin’in komutanı Vesren, saray çevresindeki seçkin nöbeti yönetir; kusursuz görünen düzenin insana verdiği yükü küçümseyebilir.",
    "background": "Vesren’in babası başkentte mahkeme kapılarında sıra tutan bir görevlidir. Genç Vesren, her gün değişen zengin ziyaretçiler karşısında üniformanın değişmeyen bir değer olduğuna inandı. Askerliğe çok erken girdi; emrin kaynağını bilmeden uygulamanın birliği nasıl parçalayabildiğini iç kapıdaki bir yetki kavgasında öğrendi.",
    "presence": "Üniformasındaki metal tokaları her sabah aynı bezle siler. Bağlılığı sağlamdır, şefkati ise disiplinin gerisinde kalabilir. Mor Pelerin onun elinde güçlü bir saray birliğidir; bütün Valdareth’in sokaklarını yöneten şehir muhafızı veya sahaya çıkan Mavi Pelerin değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "ardel-veyran",
      "fara-nidren",
      "rickon"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Vesren’in babası başkentte mahkeme kapılarında sıra tutan bir görevlidir. Genç Vesren, her gün değişen zengin ziyaretçiler karşısında üniformanın değişmeyen bir değer olduğuna inandı. Askerliğe çok erken girdi; emrin kaynağını bilmeden uygulamanın birliği nasıl parçalayabildiğini iç kapıdaki bir yetki kavgasında öğrendi.",
          "Bir saray geçişini kapatırken kraliyet refakatçilerini de bekletmesi ona düşman kazandırdı. Olayı çözen Ardel, Vesren’in yönteminin kaba ama hesabının doğru olduğunu kabul etti. Vesren Mor Pelerin’in komutasına geldiğinde komutan sözü ile ziyaretçi talebini ayrı kaydetme usulünü yerleştirdi."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Ardel Veyran ile görev sınırlarını sık tartışır; On İki’yi kendi yüzbaşıları gibi yönetemez. Fara Nidren’e güvenir, fakat onun nöbetçileri dinlendirme talebini gereğinden pahalı bulur. Sir Rickon ile şehir ve saray arasında kovalamacanın nerede devredileceğini belirler.",
          "Üniformasındaki metal tokaları her sabah aynı bezle siler. Bağlılığı sağlamdır, şefkati ise disiplinin gerisinde kalabilir. Mor Pelerin onun elinde güçlü bir saray birliğidir; bütün Valdareth’in sokaklarını yöneten şehir muhafızı veya sahaya çıkan Mavi Pelerin değildir."
        ]
      }
    ]
  },
  {
    "id": "fara-nidren",
    "name": "Fara Nidren",
    "role": "Mor Pelerin iç kapı yüzbaşısı",
    "city": "valdareth",
    "affiliation": "Mor Pelerin",
    "portrait": "fara-nidren",
    "traits": [
      "İç kapı nöbeti",
      "Metal işçiliği",
      "İnsanları okur"
    ],
    "summary": "Mor Pelerin yüzbaşısı Fara, sarayın iç kapılarını korur; geçişi engellemek kadar nöbetçinin ayakta kalmasını da görev sayar.",
    "background": "Fara, Valdareth’te kuyumcu çıraklığını sıkıcı bulup asker oldu. Ayrıntıya yatkın gözünü önce kayışın çatlağını, sonra kapıda kullanılan işaretlerin sahtesini fark etmek için kullandı. Genç bir nöbetçi iken yanlış isimle giren bir teslimatçıyı yakaladı; adamın yalnızca okuma bilmediği ortaya çıkınca aynı sertliği geri alamadı.",
    "presence": "Görev dışı günlerde küçük metal kuşlar yapar; birini eski teslimatçıya verdiği bilinir. İç kapı yüzbaşılığı ona büyük bir nüfuz verir, fakat bu gücü insanlara keyfine göre bekleme cezası vermek için kullanmaktan sakınır. Her zaman sakin değildir; belirsizlik onu hâlâ hızlı şüpheye iter.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "vesren-kald",
      "nethan-caul",
      "ensel-drunn"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Fara, Valdareth’te kuyumcu çıraklığını sıkıcı bulup asker oldu. Ayrıntıya yatkın gözünü önce kayışın çatlağını, sonra kapıda kullanılan işaretlerin sahtesini fark etmek için kullandı. Genç bir nöbetçi iken yanlış isimle giren bir teslimatçıyı yakaladı; adamın yalnızca okuma bilmediği ortaya çıkınca aynı sertliği geri alamadı.",
          "O utanç, onu daha iyi bir kapı görevlisine çevirdi. Kimlik sormayı tek bir şifreye bağlamadı; işin türünü ve tanığı da sormayı öğrendi. Mor Pelerin’de yükseldiğinde yeni nöbetçilere küçük kararların insanları ne kadar kolay aşağılayabildiğini anlatmaya başladı."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Vesren Kald ile disiplin konusunda anlaşır, dinlenme çizelgesinde kavga eder. Nethan Caul’un yetiştirdiği adayları kapıya alır; Ensel Drunn ile limandan içeri gelen saray yüklerinin kontrollerini birlikte yapar. İkisi de aceleye karşı farklı bahaneler bulur.",
          "Görev dışı günlerde küçük metal kuşlar yapar; birini eski teslimatçıya verdiği bilinir. İç kapı yüzbaşılığı ona büyük bir nüfuz verir, fakat bu gücü insanlara keyfine göre bekleme cezası vermek için kullanmaktan sakınır. Her zaman sakin değildir; belirsizlik onu hâlâ hızlı şüpheye iter."
        ]
      }
    ]
  },
  {
    "id": "darsen-roth",
    "name": "Darsen Roth",
    "role": "Mavi Pelerin saha komutanı",
    "city": "valdareth",
    "affiliation": "Mavi Pelerin",
    "portrait": "darsen-roth",
    "traits": [
      "Saha komutası",
      "Hız tutkusu",
      "İaşe deneyimi"
    ],
    "summary": "Mavi Pelerin saha komutanı Darsen, başkentin düzenli askerini sefer ve garnizon arasında taşır; hızı çoğu zaman güvenin önüne koyar.",
    "background": "Darsen ova köylerinde askerî arabalara yem hazırlayan bir hanede büyüdü. Erzak akışının savaşın gürültüsünden önce geldiğini gördü, ama genç asker olarak adını hızlı yürüyüşlerle duyurmayı seçti. Bir tatbikatta hedefe erken varırken yük arabalarını geride bırakması bölüğünü iki gün aç tuttu.",
    "presence": "İlk aç tatbikattan kalmış boş bir erzak etiketi harita kutusunda durur. Mavi Pelerin saraya yakın bulunur, ama Mor Pelerin’den ayrı saha ve garnizon zinciridir. Darsen kent sokaklarına her gelişinde şehir muhafızının görevini devralmış sayılmaz; askerî emir ve sivil sorumluluk farklı kayıtlardır.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "ivela-trost",
      "selka-orven",
      "ovel-rann"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Darsen ova köylerinde askerî arabalara yem hazırlayan bir hanede büyüdü. Erzak akışının savaşın gürültüsünden önce geldiğini gördü, ama genç asker olarak adını hızlı yürüyüşlerle duyurmayı seçti. Bir tatbikatta hedefe erken varırken yük arabalarını geride bırakması bölüğünü iki gün aç tuttu.",
          "Bu başarısızlık rütbesini bir süre durdurdu. Sonraki görevi iaşe biriminde geçti; Ivela Trost’un çizelgeleri ona kayıp bir çuvalın kayıp bir emre benzediğini öğretti. Mavi Pelerin’in komutasına geldiğinde daha iyi hesap yapıyordu, fakat acele etmekten aldığı gururu bütünüyle bırakmadı."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Ivela onun güvendiği, aynı zamanda en sık itiraz eden yüzbaşıdır. Selka Orven yol koşullarını, Ovel Rann tahkimatın bekleme süresini önüne koyar. Darsen bu itirazları sevmez; sefer sonunda haklı çıkarlarsa açıkça takdir etmeyi öğrenmiştir.",
          "İlk aç tatbikattan kalmış boş bir erzak etiketi harita kutusunda durur. Mavi Pelerin saraya yakın bulunur, ama Mor Pelerin’den ayrı saha ve garnizon zinciridir. Darsen kent sokaklarına her gelişinde şehir muhafızının görevini devralmış sayılmaz; askerî emir ve sivil sorumluluk farklı kayıtlardır."
        ]
      }
    ]
  },
  {
    "id": "ivela-trost",
    "name": "Ivela Trost",
    "role": "Mavi Pelerin iaşe ve sevk yüzbaşısı",
    "city": "valdareth",
    "affiliation": "Mavi Pelerin",
    "portrait": "ivela-trost",
    "traits": [
      "Sevk hesabı",
      "Renkli düğümler",
      "Sert adalet"
    ],
    "summary": "Ivela Trost, Mavi Pelerin’in erzak ve sevk yüzbaşısıdır; bir askerin nereye gittiğini bilenin onun ne yediğini de bilmesi gerektiğini savunur.",
    "background": "Ivela başkentte bir değirmenin un hesabını tutarak çalışmaya başladı. Bütün hanelerin aynı boy çuval aldığını sanan müşterilerle kavga ederdi. Askerî iaşeye geçtiğinde şekli aynı olan kayıtların içinde birbirinden farklı ihtiyaçlar bulunduğunu hemen fark etti.",
    "presence": "Her yükün üstüne renkli bir düğüm atar; okuyamayan er de doğru arabayı bulabilir. Cömert değildir, fakat adaletsiz bir dağıtımı görmezden gelmez. Bugün Mavi Pelerin’in levazımını ve sevk kayıtlarını yönetir; başarıyı ön cephede adının okunmasından çok, geri dönen askerin sağlığıyla ölçer.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "darsen-roth",
      "sera-neld",
      "oswen-krehl",
      "alisande"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Ivela başkentte bir değirmenin un hesabını tutarak çalışmaya başladı. Bütün hanelerin aynı boy çuval aldığını sanan müşterilerle kavga ederdi. Askerî iaşeye geçtiğinde şekli aynı olan kayıtların içinde birbirinden farklı ihtiyaçlar bulunduğunu hemen fark etti.",
          "Darsen Roth’un aç kalan tatbikatından sonra dağıtılan erzağı yeniden sayan kişi Ivela’ydı. Eksikliği alt rütbelilerin çalmasına bağlamak yerine terk edilen arabaların yerini buldu. Böylece askerî terfisi güçlü bir efendinin himayesine değil, görünür bir hesap hatasını çözmesine dayandı."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Darsen’i izler, fakat onun aceleci emrini kâğıda almadan uygulamaz. Sera Neld ile tahıl teslimini, Oswen Krehl ile loncaya yapılan donanım değişimlerini konuşur. Şehir depolarının asker için boşaltılmasının dış mahalledeki ekmeği etkileyeceğini Alisande’nin toplantılarında açıkça söyler.",
          "Her yükün üstüne renkli bir düğüm atar; okuyamayan er de doğru arabayı bulabilir. Cömert değildir, fakat adaletsiz bir dağıtımı görmezden gelmez. Bugün Mavi Pelerin’in levazımını ve sevk kayıtlarını yönetir; başarıyı ön cephede adının okunmasından çok, geri dönen askerin sağlığıyla ölçer."
        ]
      }
    ]
  },
  {
    "id": "nerath-omber",
    "name": "Amiral Nerath Omber",
    "role": "Mor Donanma amirali",
    "city": "valdareth",
    "affiliation": "Mor Donanma",
    "portrait": "nerath-omber",
    "traits": [
      "Konvoy deneyimi",
      "Rilorn komutası",
      "İhtiyatlı hırs"
    ],
    "summary": "Mor Donanma amirali Nerath, Rilorn’daki gemilerin komutasını taşır; güvenli körfezin ona verdiği rahatlıktan kuşkulanır.",
    "background": "Nerath bir kıyı kayığının oğludur; çocukken yelken dikmek ve balık kasası taşımak dışında bir meslek düşünmedi. Donanmaya girdiğinde ilk görevi kürek ve halat işiydi. Bir fırtınada gemiyi korumak için yük boşaltırken hangi yükün önce atılacağına yanlış karar verdi; kıyıdaki bir mahallenin kış erzağı onun elinden denize gitti.",
    "presence": "Eski balık kayığından kalan tek pirinç halka kulağındadır. Kendi yükselişini haklı bulduğu kadar bazı genç kaptanlara geç fırsat verdiğini de bilir. Krala bağlı donanmayı yönetir; gümrük mührünü veya şehir nöbetini amiral emriyle ortadan kaldıramaz.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "veyla-dris",
      "ceryn-hale",
      "tormal-fenn",
      "doran-kest",
      "rilorn-korfezi"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Nerath bir kıyı kayığının oğludur; çocukken yelken dikmek ve balık kasası taşımak dışında bir meslek düşünmedi. Donanmaya girdiğinde ilk görevi kürek ve halat işiydi. Bir fırtınada gemiyi korumak için yük boşaltırken hangi yükün önce atılacağına yanlış karar verdi; kıyıdaki bir mahallenin kış erzağı onun elinden denize gitti.",
          "Sonraki yıllarda iaşe ve seyir işlerini birlikte öğrenmesinin nedeni bu kayıptır. Korsanla çatışmada gösterdiği cesaret yükselmesini sağladı, fakat amiralliği konvoyların düzenli dönmesiyle kazandı. Mor Donanma’nın Rilorn’daki güvenli demir yerini açık denizde başarı gibi anlatmaz."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Veyla Dris’in kötü hava uyarılarını siyasi ziyaretlerden önce dinler. Ceryn Hale’in konvoy disiplinine güvenir; Tormal Fenn ile kullanılabilir gemi sayısı yüzünden sürekli tartışır. Doran Kest’le liman yönetimini paylaşmaz, yük devrini açık kayıtla yapar.",
          "Eski balık kayığından kalan tek pirinç halka kulağındadır. Kendi yükselişini haklı bulduğu kadar bazı genç kaptanlara geç fırsat verdiğini de bilir. Krala bağlı donanmayı yönetir; gümrük mührünü veya şehir nöbetini amiral emriyle ortadan kaldıramaz."
        ]
      }
    ]
  },
  {
    "id": "veyla-dris",
    "name": "Veyla Dris",
    "role": "Mor Donanma seyir ustası",
    "city": "valdareth",
    "affiliation": "Mor Donanma",
    "portrait": "veyla-dris",
    "traits": [
      "Seyir ölçümleri",
      "Belirsizliği söyler",
      "Fener kökeni"
    ],
    "summary": "Veyla, Mor Donanma’nın seyir ustasıdır; haritada açık görünen suyun o gün gerçekten açık olup olmadığını sorar.",
    "background": "Veyla gençken Valdareth fenerinde mercek ve ışık kapağı temizlerdi. Rüzgârın bir liman vardiyasını nasıl bozduğunu buradan öğrenip gemiye geçti. İlk ölçüm defteri, deneyimli bir kaptanın hava konusunda yanılabileceğini yazdığı için güverteye atıldı.",
    "presence": "Küçük pirinç pergeli babasının kumaş kutusunda taşır. Ak Cam’ın donmamış olmasını sakin bir denizle karıştırmaz; Soluk Su’nun sisinde tek işarete güvenmez. Bugünkü işi seyir planı, kıyı işaretleri ve hava kayıtlarıdır; her gemiye kendi başına hareket emri vermek değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "nerath-omber",
      "ceryn-hale",
      "bryndon-kiyi-defteri",
      "ivren-vask",
      "ak-cam-denizi"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Veyla gençken Valdareth fenerinde mercek ve ışık kapağı temizlerdi. Rüzgârın bir liman vardiyasını nasıl bozduğunu buradan öğrenip gemiye geçti. İlk ölçüm defteri, deneyimli bir kaptanın hava konusunda yanılabileceğini yazdığı için güverteye atıldı.",
          "Kaptanı değiştiremedi; ölçümlerini daha açık tutmayı öğrendi. Aynı kıyıda ikinci kez gemi oturunca Veyla’nın kayıtları Nerath Omber’e ulaştı. Donanmanın seyir hizmetine alınması onu her şeyi bilen biri yapmadı; yalnız yanlış bir tahminin de saklanmadan korunabileceği bir yer verdi."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Nerath’la karar öncesi, Ceryn Hale’le karar sonrası çalışır. Kâtip Bryndon’un kıyı notlarından yararlanır, fakat geçmiş iklim iddialarını günlük bir sefer güvencesi saymaz. Frostbay’den gelen Ivren Vask’ın gecikmiş mektupları da onun hava defterinde tarihleriyle yer bulur.",
          "Küçük pirinç pergeli babasının kumaş kutusunda taşır. Ak Cam’ın donmamış olmasını sakin bir denizle karıştırmaz; Soluk Su’nun sisinde tek işarete güvenmez. Bugünkü işi seyir planı, kıyı işaretleri ve hava kayıtlarıdır; her gemiye kendi başına hareket emri vermek değildir."
        ]
      }
    ]
  },
  {
    "id": "tormal-fenn",
    "name": "Tormal Fenn",
    "role": "Mor Donanma tersane başustası",
    "city": "valdareth",
    "affiliation": "Mor Donanma",
    "portrait": "tormal-fenn",
    "traits": [
      "Tersane ustalığı",
      "Cila düşmanı",
      "Çırak yetiştirir"
    ],
    "summary": "Tersane başustası Tormal, bir geminin adını tören kürsüsünden önce çürük kaburgalarından tanır.",
    "background": "Tormal gençliğinde küçük nehir tekneleri yaptı; iyi cilalanmış bir teknenin suya indirildikten sonra yana yatması ustalık anlayışını değiştirdi. Kardeşi o teknede değildi, kimse ölmedi; ama bütün birikimini ve ilk işinin itibarını kaybetti. Güzel görünümün güvenilir işçilikle aynı olmadığını ucuz bir dersle öğrenmedi.",
    "presence": "Her yeni tekne yanında küçük bir tahta kaburga maketi tutar; çırağın hatasını orada düzeltir. Çıraklarına karşı cömert, tacirlerin parlak vaatlerine karşı kaba olabilir. Güncel sorumluluğu Mor Donanma tersanesinin onarım, tezgâh ve işçilik düzenidir; gemiyi savaşa gönderen emir onun mührüyle çıkmaz.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "nerath-omber",
      "ovel-rann",
      "ivela-trost"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Tormal gençliğinde küçük nehir tekneleri yaptı; iyi cilalanmış bir teknenin suya indirildikten sonra yana yatması ustalık anlayışını değiştirdi. Kardeşi o teknede değildi, kimse ölmedi; ama bütün birikimini ve ilk işinin itibarını kaybetti. Güzel görünümün güvenilir işçilikle aynı olmadığını ucuz bir dersle öğrenmedi.",
          "Valdareth tersanesinde yıllarca kusurlu keresteyi ayırdı. Amirallik ziyaretinde boyası yeni bir gemiyi hizmete sokmayı reddettiğinde işini kaybetmek üzereydi; iç kiriş açılınca çürüme görüldü. Başustalığa atanması o günün ardından geldi, zaferden sonra yapılan bir hediye olarak değil."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Nerath Omber’le hazır gemi listesi üzerinde sürekli gerilir. Ovel Rann’a sağlam kereste ayırır, Ovel’den taş iskelelerde suyun davranışını öğrenir. Ivela Trost ile tersanenin askerî sevk için alacağı araba ve erzak düzenini konuşur.",
          "Her yeni tekne yanında küçük bir tahta kaburga maketi tutar; çırağın hatasını orada düzeltir. Çıraklarına karşı cömert, tacirlerin parlak vaatlerine karşı kaba olabilir. Güncel sorumluluğu Mor Donanma tersanesinin onarım, tezgâh ve işçilik düzenidir; gemiyi savaşa gönderen emir onun mührüyle çıkmaz."
        ]
      }
    ]
  },
  {
    "id": "ceryn-hale",
    "name": "Ceryn Hale",
    "role": "Mor Donanma konvoy kaptanı",
    "city": "valdareth",
    "affiliation": "Mor Donanma",
    "portrait": "ceryn-hale",
    "traits": [
      "Konvoy disiplini",
      "Tayfayı düşünür",
      "Kısa sabır"
    ],
    "summary": "Konvoy kaptanı Ceryn Hale, küçük ticaret gemisinin büyük savaş gemisine yetişemeyeceğini unutmayan denizcidir.",
    "background": "Ceryn ticaret gemilerinde su ve halat taşıyarak çalıştı. Bir kez kaptanı daha hızlı bir filoya yetişmek için yelkeni zorladığında direk çatladı ve bütün yükün limana varması gecikti. O gecikmede ücretini alamayan tayfaların evlerine kendisi mektup yazdı.",
    "presence": "Güvertede sıradan ve kısa bir pala taşır; pahalı bir silah yerine sağlam bir can halatı satın almayı tercih eder. Kendine uymayan tacire karşı sabrı azdır. Bugün donanmanın konvoy refakatini yürütür, ticaret kaydı ve ruhsat işlerini ilgili kıyı makamlarına teslim eder.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "nerath-omber",
      "veyla-dris",
      "tavera-oss"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Ceryn ticaret gemilerinde su ve halat taşıyarak çalıştı. Bir kez kaptanı daha hızlı bir filoya yetişmek için yelkeni zorladığında direk çatladı ve bütün yükün limana varması gecikti. O gecikmede ücretini alamayan tayfaların evlerine kendisi mektup yazdı.",
          "Mor Donanma’ya geçtiğinde yük gemilerinin hızına göre refakat düzeni önerdi. İlk başta yavaşlıkla suçlandı; ikinci konvoyun eksiksiz varışı ona kendi gemisinin komutasını getirdi. Başarıyı takip ettiği yüklerin değeriyle birlikte içinde yaşayan insanlarla ölçmeyi sürdürdü."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Nerath Omber ona sınırlı karar alanı tanır, Veyla Dris ise rotanın günlük risklerini anlatır. Kethra kaptanı Tavera Oss ile liman tesliminde birbirlerini sınırlarlar; açık denizdeki komuta, rıhtımda her tartışmayı çözme hakkı değildir.",
          "Güvertede sıradan ve kısa bir pala taşır; pahalı bir silah yerine sağlam bir can halatı satın almayı tercih eder. Kendine uymayan tacire karşı sabrı azdır. Bugün donanmanın konvoy refakatini yürütür, ticaret kaydı ve ruhsat işlerini ilgili kıyı makamlarına teslim eder."
        ]
      }
    ]
  },
  {
    "id": "odrissa-vey",
    "name": "Başrahibe Odrissa Vey",
    "role": "Obsidyen Kilise hizmetlerinin başı",
    "city": "valdareth",
    "affiliation": "Valdareth Kent Hizmetleri",
    "portrait": "odrissa-vey",
    "traits": [
      "Din hizmeti",
      "Bakım mutfağı",
      "Kurumsal gurur"
    ],
    "summary": "Obsidyen Kilise’nin başrahibesi Odrissa, büyük törenlerle gündelik bakım arasında kendi otoritesini kurmuş bir din görevlisidir.",
    "background": "Odrissa başkentte taş cilalayan işçilerin yanında büyüdü. Kilisenin siyah yüzeyini çocukken yağlı bezle temizledi; kapıyı dolduran cenazeleri ve düğünleri aynı gözle gördü. Din hizmetine girmesi tek bir vahiyden değil, burada kimsenin gündelik işini tamamıyla bırakmadığını fark etmesinden geldi.",
    "presence": "Kendi elleriyle ciltlediği dua kitabını bütün gösterişli ciltlere tercih eder. Merhametlidir, fakat kurumunu eleştirenlere zaman zaman üstten bakar. Obsidyen Kilise’nin hizmetlerini ve görevlilerini yönetir; ruhsat gerektiren büyülü şifa için din unvanını yasal iznin yerine koymaz.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "alisande",
      "sera-neld",
      "veyren-sahl",
      "buyu-ruhsatlari"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Odrissa başkentte taş cilalayan işçilerin yanında büyüdü. Kilisenin siyah yüzeyini çocukken yağlı bezle temizledi; kapıyı dolduran cenazeleri ve düğünleri aynı gözle gördü. Din hizmetine girmesi tek bir vahiyden değil, burada kimsenin gündelik işini tamamıyla bırakmadığını fark etmesinden geldi.",
          "Bir yardım töreninde yemeğin konuklara ayrılıp kapıdakilere kalmadığını gördü. Tören masasını küçültüp kalan malzemeyi sokağa çıkartması üstleriyle kavga doğurdu. Yıllar sonra başrahibe olduğunda bu olayı mucize diye anlatmadı; ilk yanlış hesabını düzelttiği gün olarak kayda geçti."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Alisande ile yardım düzenini, Sera Neld ile kilise mutfağının aldığı erzağı konuşur. Elorwyn’den Rahip Veyren Sahl ile sefer bakımını paylaşır; iki şehirdeki din görevlilerinin her konuda tek ağızla konuşmasını istemez.",
          "Kendi elleriyle ciltlediği dua kitabını bütün gösterişli ciltlere tercih eder. Merhametlidir, fakat kurumunu eleştirenlere zaman zaman üstten bakar. Obsidyen Kilise’nin hizmetlerini ve görevlilerini yönetir; ruhsat gerektiren büyülü şifa için din unvanını yasal iznin yerine koymaz."
        ]
      }
    ]
  },
  {
    "id": "nolen-dur",
    "name": "Nolen Dur",
    "role": "Valdareth büyük hapishanesi nazırı",
    "city": "valdareth",
    "affiliation": "Valdareth Kent Hizmetleri",
    "portrait": "nolen-dur",
    "traits": [
      "Katı teslim usulü",
      "Dar güvenlik anlayışı",
      "Anahtar takıntısı"
    ],
    "summary": "Büyük hapishane nazırı Nolen Dur, düzeni insanın önüne koyma eğilimiyle başkentte korku ve sınırlı saygı uyandırır.",
    "background": "Nolen’in annesi adliye avlusunda yiyecek satardı. Gençken kaçan bir mahkûmun kim olduğunu değil, ardında bıraktığı paniği hatırladı; güvenliği önce kapının kapanması olarak öğrendi. Askerlikten sonra hapishane nöbetine geçti ve sıkı çizelgelerle yükseldi.",
    "presence": "Kemerindeki anahtarların ağırlığı onun için makamın rahatlatıcı işaretidir. Zalimce bir gösteriyi sevmez, ama soğuk bir usulle aynı acıyı üretebilir. Bugün hapishanenin nöbet ve teslim düzenini yürütür; yargılama yetkisi veya istediği cezayı verme hakkı ona ait değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "rickon",
      "teren-halvek",
      "thessa-morain"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Nolen’in annesi adliye avlusunda yiyecek satardı. Gençken kaçan bir mahkûmun kim olduğunu değil, ardında bıraktığı paniği hatırladı; güvenliği önce kapının kapanması olarak öğrendi. Askerlikten sonra hapishane nöbetine geçti ve sıkı çizelgelerle yükseldi.",
          "Bir kış sevkinde belgeleri eksik tutukluları aynı koğuşa yerleştirmeyi reddetti. Günlerce soğukta bekleyen insanlar yüzünden ağır eleştiri aldı; buna karşılık iki ayrı dosyanın aynı isimle yazıldığını buldu. Nolen bu olaydan yalnız doğru yarıyı öğrendi: yanılmamak için çok bekletmenin de zarar verdiğini kabul etmekte zorlanır."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Sir Rickon Thornhall’dan kişiyi teslim alır, Teren Halvek’e tesis ihtiyaçlarını bildirir. Thessa Morain’in yaralıların bakım talepleriyle tartışır; hekim önerisini dinlese de kendi düzenini bozan her isteği önce tehdit gibi karşılar.",
          "Kemerindeki anahtarların ağırlığı onun için makamın rahatlatıcı işaretidir. Zalimce bir gösteriyi sevmez, ama soğuk bir usulle aynı acıyı üretebilir. Bugün hapishanenin nöbet ve teslim düzenini yürütür; yargılama yetkisi veya istediği cezayı verme hakkı ona ait değildir."
        ]
      }
    ]
  },
  {
    "id": "ensel-drunn",
    "name": "Ensel Drunn",
    "role": "Başkent gümrük tartı başı",
    "city": "valdareth",
    "affiliation": "Valdareth Kent Hizmetleri",
    "portrait": "ensel-drunn",
    "traits": [
      "Tartı ustalığı",
      "Hediye sever",
      "Hızlı hesap"
    ],
    "summary": "Ensel Drunn, başkent gümrüğünde tartı ve yük kaydını yönetir; küçük ayrıcalıkların büyük gelirini iyi bilir.",
    "background": "Ensel, Valdareth limanında yük sepeti onaran bir ailenin oğludur. Çocukken her tüccarın farklı taşla tartılmak istediğini görüp sayı işine merak sardı. Tartı çırağı olduğunda yanlış ayarlanmış bir teraziyi düzelterek işvereninin kârını azalttı; önce kovuldu, sonra rakip bir evde iş buldu.",
    "presence": "Avucunda çevirdiği küçük pirinç ağırlığı annesinin sepetinden kalmadır. Zeki, işini bilen ve kendi rahatına düşkün bir adamdır. Tartı başılığı bir gümrük vergisini kendi başına yaratma hakkı değildir; Ensel’in gücü daha çok sıranın, zamanın ve görünür hesabın içinde yatar.",
    "source": "new",
    "region": "danstsud",
    "power": "ordinary",
    "related": [
      "doran-kest",
      "dain-torven",
      "fara-nidren"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Ensel, Valdareth limanında yük sepeti onaran bir ailenin oğludur. Çocukken her tüccarın farklı taşla tartılmak istediğini görüp sayı işine merak sardı. Tartı çırağı olduğunda yanlış ayarlanmış bir teraziyi düzelterek işvereninin kârını azalttı; önce kovuldu, sonra rakip bir evde iş buldu.",
          "Kamusal tartı hizmetine geçince dürüst ölçünün tek başına adil sıra yaratmadığını öğrendi. Zengin bir yükü önce tartmanın yoksul bir teknenin bekleme ücretini büyüttüğünü bilir. Buna rağmen iyi bir hediye sepetini geri çevirmek onun en güçlü erdemi değildir; davranışı limanda açıkça eleştirilir."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Doran Kest ona kayıt sorumluluğu verir; Dain Torven saray yükleri üzerinden hesabını sık kontrol eder. Fara Nidren ile iç kapıya gönderilen sandıkları sayar. İki nöbetçinin soğuk soruları, onun limanda rahatça kurduğu şakaları genellikle durdurur.",
          "Avucunda çevirdiği küçük pirinç ağırlığı annesinin sepetinden kalmadır. Zeki, işini bilen ve kendi rahatına düşkün bir adamdır. Tartı başılığı bir gümrük vergisini kendi başına yaratma hakkı değildir; Ensel’in gücü daha çok sıranın, zamanın ve görünür hesabın içinde yatar."
        ]
      }
    ]
  },
  {
    "id": "torena-vesk",
    "name": "Torena Vesk",
    "role": "ÇelikKalkan görev yazmanı",
    "city": "lirendil",
    "affiliation": "Lirendil Görev Haneleri",
    "portrait": "torena-vesk",
    "traits": [
      "Görev yazmanı",
      "Renkli kayıtlar",
      "Belirsizliğe karşı"
    ],
    "summary": "ÇelikKalkan görev yazmanı Torena, bir görevin ödülünden önce kimin geri döneceğinin sorulmasını sağlar.",
    "background": "Torena bir iplik tüccarının kızı olarak farklı renklerle borç ayırmayı öğrendi. Lonca yemekhanesine mal taşıdığı yıllarda aynı görevin savaşçılar için macera, depodaki insanlar için uzun bir hazırlık olduğunu gördü. Yazmanlığa geçtiğinde ilk kusuru, iki farklı erzak talebini aynı kâğıtta birleştirmekti.",
    "presence": "Masasındaki renkli ipler genç üyelerin adlarını değil iş durumlarını işaretler. Bir insanın bütün kişiliğini tek başarısızlıkla mühürlememeye çalışır; buna karşılık belirsiz söz veren kimseye kolay güvenmez. Loncanın karar ve ödeme makamı değildir, ama kararın gerçekten anlaşılmasını sağlayan güçlü bir gündelik yüzdür.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "varric",
      "vardek",
      "nelra-ven",
      "jeremiah",
      "sevran-til",
      "celikkalkan-loncasi"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Torena bir iplik tüccarının kızı olarak farklı renklerle borç ayırmayı öğrendi. Lonca yemekhanesine mal taşıdığı yıllarda aynı görevin savaşçılar için macera, depodaki insanlar için uzun bir hazırlık olduğunu gördü. Yazmanlığa geçtiğinde ilk kusuru, iki farklı erzak talebini aynı kâğıtta birleştirmekti.",
          "Bu hata yüzünden yola çıkamayan bir grup onu azarladı; Varric Draven ise o günkü bütün işleri yeniden yazdırdı. Torena kayıtları yalnız temiz tutmayı değil, insanın okuyabileceği biçimde düzenlemeyi burada öğrendi. Sir Vardek daha sonra görev masasını ona emanet etti; büyük üstat karar verir, Torena kararın izini tutar."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Varric ile hazırlık saatlerini, Nelra Ven ile sağlık sınırlarını konuşur. Jeremiah’ın son anda bulduğu kurnaz çözümleri sever ama eksilen malzemeyi şakaya saymaz. Rakip temsilci Sevran Til’in cazip sözleşmelerini ise ücret, risk ve geri dönüş koşulları birlikte yazılmadıkça görev saymaz.",
          "Masasındaki renkli ipler genç üyelerin adlarını değil iş durumlarını işaretler. Bir insanın bütün kişiliğini tek başarısızlıkla mühürlememeye çalışır; buna karşılık belirsiz söz veren kimseye kolay güvenmez. Loncanın karar ve ödeme makamı değildir, ama kararın gerçekten anlaşılmasını sağlayan güçlü bir gündelik yüzdür."
        ]
      }
    ]
  },
  {
    "id": "hadrik-solm",
    "name": "Hadrik Solm",
    "role": "ÇelikKalkan kalkan hattı eğitmeni",
    "city": "lirendil",
    "affiliation": "Lirendil Görev Haneleri",
    "portrait": "hadrik-solm",
    "traits": [
      "Kalkan talimi",
      "Gürültülü mizah",
      "Birlikte hareket"
    ],
    "summary": "Kalkan hattı eğitmeni Hadrik, loncada tek kişinin güçlü kolundan önce yanındaki insanın yerini öğretir.",
    "background": "Hadrik, gençliğinde kervan refakatinde kuvvetiyle iş buldu. Bir dar sokak çatışmasında kendi saldırısını takip ederken arkasındaki zayıf halkayı açık bıraktı; kimse ölmedi ama kervanın iki çalışanı aylarca iş yapamadı. Yıllar sonra o günü anlatırken kazandığı düellonun adını söylemez.",
    "presence": "Eski talim kalkanının içinde kendisinin açtığı boşluğun bir çizimi vardır. Gürültülü güler, ancak korkan acemiyi sınıfın önünde küçük düşürmez. Lonca üyelerini ortak harekete hazırlar; kent askeri veya saray birliği komutanı gibi emir vermek onun işi değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "kaelen",
      "beltran-sael",
      "volomiyr",
      "celikkalkan-loncasi"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Hadrik, gençliğinde kervan refakatinde kuvvetiyle iş buldu. Bir dar sokak çatışmasında kendi saldırısını takip ederken arkasındaki zayıf halkayı açık bıraktı; kimse ölmedi ama kervanın iki çalışanı aylarca iş yapamadı. Yıllar sonra o günü anlatırken kazandığı düellonun adını söylemez.",
          "ÇelikKalkan’a katılınca Yüzbaşı Kaelen’in sert eğitimini önce küçümsedi. Kalkan sırasındaki yerini korumayı öğrenmesi, tekli mücadeledeki ününü azalttı ve ekip görevlerinde değerini artırdı. Bugün Kaelen’in yanında ayrı bir kalkan talimi yürütür; ikisinin yöntemi aynı değildir."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Kaelen’le disiplin konusunda anlaşır, dinlenme sürelerinde ayrılır. Beltran Sael’den yaşlı bedenin talime nasıl katılabileceğini öğrenmiştir. Volomiyr’e güvenli bir ön sıra kurmayı öğretirken paladinin yemininin arkadaşlarının yerini düşünmeyi gerektirdiğini de hatırlatır.",
          "Eski talim kalkanının içinde kendisinin açtığı boşluğun bir çizimi vardır. Gürültülü güler, ancak korkan acemiyi sınıfın önünde küçük düşürmez. Lonca üyelerini ortak harekete hazırlar; kent askeri veya saray birliği komutanı gibi emir vermek onun işi değildir."
        ]
      }
    ]
  },
  {
    "id": "nelra-ven",
    "name": "Nelra Ven",
    "role": "ÇelikKalkan gezgin şifacısı",
    "city": "lirendil",
    "affiliation": "Lirendil Görev Haneleri",
    "portrait": "nelra-ven",
    "traits": [
      "Ruhsatlı şifa",
      "Yol bakımı",
      "Gerçekçi umut"
    ],
    "summary": "Ruhsatlı gezgin şifacı Nelra, ÇelikKalkan’ın yola çıkan gruplarına bakımın da taşınacak bir yük olduğunu öğretir.",
    "background": "Nelra küçük yaşta bir otacının yanında çalıştı. Uzun kervan yolculuklarında basit bir yaraya kirli bezin ne yapabileceğini gördü; büyü öğrenmeye karar vermesi bu sıradan bakım deneyiminden sonra geldi. Theramis’te eğitim aldı ve hizmet alanı belli bir şifa ruhsatıyla Lirendil’e döndü.",
    "presence": "Kesesinde annesinin yetiştirdiği otların küçük bir bağı bulunur. Şefkatlidir, fakat her acıyı hemen giderebildiğini söyleyen bir şifacıya sert davranır. Bugünkü hizmeti ruhsat sınırlarıyla kayıtlıdır; bir loncanın veya tapınağın adı, onun elindeki izin belgesinin yerine geçmez.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "zylara",
      "thessa-morain",
      "gil",
      "torena-vesk",
      "buyu-ruhsatlari"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Nelra küçük yaşta bir otacının yanında çalıştı. Uzun kervan yolculuklarında basit bir yaraya kirli bezin ne yapabileceğini gördü; büyü öğrenmeye karar vermesi bu sıradan bakım deneyiminden sonra geldi. Theramis’te eğitim aldı ve hizmet alanı belli bir şifa ruhsatıyla Lirendil’e döndü.",
          "İlk büyük görevinde herkesin bir günde iyileşmesini istemelerine karşı çıktı. Hastaları yürütmek yerine birkaç gün beklemek sözleşmenin süresini aştı. Torena Vesk bunu görevin gerçek bedeline yazdı; Zylara ise Nelra’ya bakım kararını açık anlatmanın korkuyu da azalttığını öğretti."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Zylara loncadaki ustasıdır; Thessa Morain ile taşınabilir revirin sınırlarını paylaşır. Gil’in yaradan önce yürüyüş ayakkabısını göstermesini istemesi, genç maceracının şakalarına konu olur. O şakalar yüzünden kontrolü bırakmaz.",
          "Kesesinde annesinin yetiştirdiği otların küçük bir bağı bulunur. Şefkatlidir, fakat her acıyı hemen giderebildiğini söyleyen bir şifacıya sert davranır. Bugünkü hizmeti ruhsat sınırlarıyla kayıtlıdır; bir loncanın veya tapınağın adı, onun elindeki izin belgesinin yerine geçmez."
        ]
      }
    ]
  },
  {
    "id": "jarek-ulven",
    "name": "Jarek Ulven",
    "role": "ÇelikKalkan keşif eğitmeni",
    "city": "lirendil",
    "affiliation": "Lirendil Görev Haneleri",
    "portrait": "jarek-ulven",
    "traits": [
      "İz kaydı",
      "Sabırlı keşif",
      "Kesinlikten kaçınır"
    ],
    "summary": "Keşif eğitmeni Jarek, ormandaki izi bir tahmin olarak okumayı ve tahminin yanlış çıkabileceğini öğretir.",
    "background": "Jarek, oduncu akrabalarıyla orman kenarlarında büyüdü. Ayak izinden geçeni bulmak çocukluk oyunu iken ilk kervan görevinde iki ayrı izi tek bir gruba bağladı. İşi bitirdiğini sanarak başka yola yönelmesi refakatçileri yarım gün boşa yürüttü; ailesi bile sonra onun kesin konuşmasına güvenmemeye başladı.",
    "presence": "Yol defterinin boş sayfalarını koparmayı sevmez; başarısız tahminler de kalmalıdır. Sabırlı, içine kapanık ve kent içi sohbetlerde beklenmedik ölçüde beceriksizdir. ÇelikKalkan’da keşif hazırlığı ve iz okuma öğretir, haritada gösterilmemiş yeni dağ geçitlerini varmış gibi vaat etmez.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "varric",
      "maera-dell",
      "hadrik-solm",
      "jeremiah"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Jarek, oduncu akrabalarıyla orman kenarlarında büyüdü. Ayak izinden geçeni bulmak çocukluk oyunu iken ilk kervan görevinde iki ayrı izi tek bir gruba bağladı. İşi bitirdiğini sanarak başka yola yönelmesi refakatçileri yarım gün boşa yürüttü; ailesi bile sonra onun kesin konuşmasına güvenmemeye başladı.",
          "Lirendil’de yeniden öğrenmek için loncaya geldi. Varric Draven ona en iyi iz sürücülerin hata kaydı da tuttuğunu söyledi. Jarek her tahminin yanına gördüğü kanıtı yazmaya başlayınca saygınlığını geri kazandı ve eğitim görevine geçti."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Maera Dell ile sık çalışır; ikisinin rakip gibi görünmesi aynı izi ayrı okuyup sonuçlarını karşılaştırmalarından gelir. Hadrik Solm’dan dar yerde ekip yürüyüşünü öğrenir. Jeremiah’ın hızlı çözümlerine merakla yaklaşır ama iz olmayan yerde onun parlak açıklamasını kanıt saymaz.",
          "Yol defterinin boş sayfalarını koparmayı sevmez; başarısız tahminler de kalmalıdır. Sabırlı, içine kapanık ve kent içi sohbetlerde beklenmedik ölçüde beceriksizdir. ÇelikKalkan’da keşif hazırlığı ve iz okuma öğretir, haritada gösterilmemiş yeni dağ geçitlerini varmış gibi vaat etmez."
        ]
      }
    ]
  },
  {
    "id": "oswen-krehl",
    "name": "Oswen Krehl",
    "role": "ÇelikKalkan levazım ustası",
    "city": "lirendil",
    "affiliation": "Lirendil Görev Haneleri",
    "portrait": "oswen-krehl",
    "traits": [
      "Levazım ustası",
      "Deri onarımı",
      "Sert cömertlik"
    ],
    "summary": "Levazım ustası Oswen, ÇelikKalkan’ın depolarında ucuz kemerin pahalı bir yenilgiye dönüşmesini engeller.",
    "background": "Oswen bir kemer ustasının yanında yetişti. Gençken daha çok sipariş alabilmek için kuruma süresini kısaltan bir deri işlemi denedi; yağmurda açılan kayışlar bütün satışını geri getirdi. Borcunu yıllarca yama yaparak ödedi. Kendisini büyük bir usta saymasının önünde hep o acele durur.",
    "presence": "Büyük iğnesini babasının ahşap kutusunda taşır. Herkese bir şey saklar ama kimseye sınırsız malzeme vermez. Loncanın levazım ustası, kahramanlara yalnız silah değil sağlam çorap, yedek bağ ve geri dönüşte teslim edilecek doğru hesabı da hazırlatır.",
    "source": "new",
    "region": "danstsud",
    "power": "ordinary",
    "related": [
      "ghorin",
      "ivela-trost",
      "mrog",
      "vardek"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Oswen bir kemer ustasının yanında yetişti. Gençken daha çok sipariş alabilmek için kuruma süresini kısaltan bir deri işlemi denedi; yağmurda açılan kayışlar bütün satışını geri getirdi. Borcunu yıllarca yama yaparak ödedi. Kendisini büyük bir usta saymasının önünde hep o acele durur.",
          "Lonca malzemelerini onarmaya başladığında Tek-Göz Ghorin ona metal ile derinin ayrı ayrı değil birlikte yorulduğunu öğretti. Bir görevde çok güzel görünen ama ağırlığı yanlış dağılan koşumları reddetmesi Sir Vardek’in dikkatini çekti. Levazım işini gösterişsiz kalmayı göze alarak üstlendi."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Ghorin’le donanım bakımını, Ivela Trost’la askerî depodan yapılan değişimleri konuşur. Mrog’un uzun nöbet için istediği sessiz tokaları tek tek denemiştir; Vakvak’ın kayışları kemirmesi ise ikisinin bitmeyen şakasıdır.",
          "Büyük iğnesini babasının ahşap kutusunda taşır. Herkese bir şey saklar ama kimseye sınırsız malzeme vermez. Loncanın levazım ustası, kahramanlara yalnız silah değil sağlam çorap, yedek bağ ve geri dönüşte teslim edilecek doğru hesabı da hazırlatır."
        ]
      }
    ]
  },
  {
    "id": "maera-dell",
    "name": "Maera Dell",
    "role": "ÇelikKalkan sözleşmeli iz sürücü",
    "city": "lirendil",
    "affiliation": "Lirendil Görev Haneleri",
    "portrait": "maera-dell",
    "traits": [
      "Sözleşmeli iz sürücü",
      "Aile yükü",
      "İş sınırları"
    ],
    "summary": "Sözleşmeli iz sürücü Maera, loncanın kâğıdında yazan işi tamamlar; kâğıdın görmediği insanları bırakmakta ise zorlanır.",
    "background": "Maera, Lowvale’de av ve kış yemi arasında yaşayan bir hanede büyüdü. Şehre gelirken aile borcunu kapatmak için iz sürme işini seçti; hayvanın izini iyi okusa da müşterinin niyetini aynı kolaylıkla okuyamıyordu. Kaybolan bir yükü bulduğu bir işte ücretin başka bir işçinin payından kesildiğini sonradan öğrendi.",
    "presence": "Dedesinden kalma küçük yayını yeni bir unvan için değiştirmedi. Az konuşur, kolay güvenir görünmez; fakat bir insanı iş dışı saymakta zorlanması para kaybetmesine neden olur. Lirendil’de işi iz sürmek ve keşif refakatidir, her anlatılan tehlikeyi tek başına çözen bir kahraman değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "jarek-ulven",
      "nelra-ven",
      "torena-vesk",
      "sevran-til"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Maera, Lowvale’de av ve kış yemi arasında yaşayan bir hanede büyüdü. Şehre gelirken aile borcunu kapatmak için iz sürme işini seçti; hayvanın izini iyi okusa da müşterinin niyetini aynı kolaylıkla okuyamıyordu. Kaybolan bir yükü bulduğu bir işte ücretin başka bir işçinin payından kesildiğini sonradan öğrendi.",
          "O günden sonra sözleşme koşullarını sözlü güvenceyle bırakmadı. Torena Vesk’in açık kayıt usulü onu ÇelikKalkan’a bağlayan şeylerden biridir. Loncaya yeminli bir eğitmen değil, tecrübeli bir sözleşmeli çalışan olarak katılır; zaman zaman aile işleri için uzun süre ayrılır."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Jarek Ulven’le farklı iz okumalarını karşılaştırır. Nelra Ven onun yalnız avcıların değil yol üzerindeki hanelerin de bakımını istemesine yardım eder. Sevran Til’in daha yüksek ücret önerilerini tamamen reddetmez; onun tuttuğu kısa vadeli hesabın bedelini iyi bilir.",
          "Dedesinden kalma küçük yayını yeni bir unvan için değiştirmedi. Az konuşur, kolay güvenir görünmez; fakat bir insanı iş dışı saymakta zorlanması para kaybetmesine neden olur. Lirendil’de işi iz sürmek ve keşif refakatidir, her anlatılan tehlikeyi tek başına çözen bir kahraman değildir."
        ]
      }
    ]
  },
  {
    "id": "sevran-til",
    "name": "Sevran Til",
    "role": "Tunç Harcı serbest kılıçlarının temsilcisi",
    "city": "lirendil",
    "affiliation": "Lirendil Görev Haneleri",
    "portrait": "sevran-til",
    "traits": [
      "Sözleşme aracılığı",
      "Çıkarcı",
      "Etkili konuşur"
    ],
    "summary": "Tunç Harcı serbest kılıçlarının temsilcisi Sevran, Lirendil’de iyi ücret ve kötü koşulları aynı gülümsemeyle satabilen bir rakiptir.",
    "background": "Sevran, savaşçı bir aileden değil, şehirde ilan kopyalayan bir yazı evinden geldi. Kimin gerçekten çalıştığını değil kimin işi aldığına dair konuşulduğunu erken fark etti. Gençliğinde kervan sözleşmelerine aracılık ederek kendi küçük refakat çevresini kurdu.",
    "presence": "Annesinin verdiği boş bir sözleşme rulosunu iyi şans işareti sayar. İnsanlara zarar vermeyi amaçlamaz; kendi kazancını gerekçe yaparak zararlarını küçümser. Tunç Harcı çevresini temsil eder ve ÇelikKalkan’ın görev pazarındaki rakibidir, kraliyet veya lonca mahkemesi değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "averen-dhal",
      "torena-vesk",
      "maera-dell",
      "lirendil-gorev-haneleri"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Sevran, savaşçı bir aileden değil, şehirde ilan kopyalayan bir yazı evinden geldi. Kimin gerçekten çalıştığını değil kimin işi aldığına dair konuşulduğunu erken fark etti. Gençliğinde kervan sözleşmelerine aracılık ederek kendi küçük refakat çevresini kurdu.",
          "Bir kez ucuz güvenlik vaadiyle aldığı işte yeterli insanı bulamadı; kaybı çalışanların ücretini geciktirerek karşıladı. Şehirde bu davranışı gizli değildir. Yine de yükü zamanında ulaştırması ve sonraki borçları ödemesi onu tamamen dışarıda bırakmadı; kötü itibarı kadar kullanışlı bağlantıları da vardır."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Averen Dhal onun resmî başvurularını dinler ama loncaya eşit bir makam vermez. Torena Vesk sözleşme boşluklarını önüne koyar; Maera Dell ise para kadar koşul sorarak onu zorlar. Sevran bunları kişisel düşmanlık gibi anlatsa da daha sağlam kayıt tutmayı onlardan öğrenmiştir.",
          "Annesinin verdiği boş bir sözleşme rulosunu iyi şans işareti sayar. İnsanlara zarar vermeyi amaçlamaz; kendi kazancını gerekçe yaparak zararlarını küçümser. Tunç Harcı çevresini temsil eder ve ÇelikKalkan’ın görev pazarındaki rakibidir, kraliyet veya lonca mahkemesi değildir."
        ]
      }
    ]
  },
  {
    "id": "mavena-riel",
    "name": "Mavena Riel",
    "role": "Theramis ruhsat sınavları başı",
    "city": "theramis",
    "affiliation": "Theramis Altın Yılan Hizmetleri",
    "portrait": "mavena-riel",
    "traits": [
      "Sınav usulü",
      "Uygulama sınırları",
      "Soğuk adalet"
    ],
    "summary": "Theramis ruhsat sınavları başı Mavena, iyi bir gösterinin denetimsiz bir hizmete dönüşmesine izin vermeyen ustadır.",
    "background": "Mavena, Theramis’te kitap taşıyan bir ailenin kızıydı. Eğitimine başlarken ellerindeki yeteneğin kendisini herkesten öne taşıyacağını düşündü. Bir gösteri sınavında başarılı oldu; aynı işlemi uzun süre sürdürmesi istendiğinde düzenek dağıldı ve aylarca yaptığı işe güvenemedi.",
    "presence": "İlk başarısız düzenekten kalan ölçü cetvelini masasının kenarında tutar. Adil olmak için bazen gereğinden soğuk davranır; öğrencilerin bu yüzden soru sormaktan çekindiğini Liora Gent sıkça hatırlatır. Görevi eğitim değerlendirmesidir; krallığın bütün büyü uygulamalarını kendi adıyla serbest bırakmaz.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "solan",
      "lethan-orve",
      "kelyra-esven",
      "liora-gent",
      "buyu-ruhsatlari"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Mavena, Theramis’te kitap taşıyan bir ailenin kızıydı. Eğitimine başlarken ellerindeki yeteneğin kendisini herkesten öne taşıyacağını düşündü. Bir gösteri sınavında başarılı oldu; aynı işlemi uzun süre sürdürmesi istendiğinde düzenek dağıldı ve aylarca yaptığı işe güvenemedi.",
          "O başarısızlık onu uygulamanın sınırlarını öğretmeye yöneltti. Başbüyücü Solan’ın yanında yıllarca eğitim ve kamu hizmeti dosyaları okudu. Sınavların başına geldiğinde tek bir etkileyici uygulama yerine hazırlık, süre ve durdurma usulünü de değerlendirmeye aldı."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Solan ile ustalık konusunda çalışır; Lethan Orve ile eğitim belgesi ve uygulama ruhsatını ayrı tutar. Kelyra Esven’in hata kayıtlarını öğrencilerle paylaşması eski alışkanlıklarını yumuşatmıştır. İyi öğrencileri hızlı ilerletmeyi ister, fakat saray isteği diye sınav atlatmaz.",
          "İlk başarısız düzenekten kalan ölçü cetvelini masasının kenarında tutar. Adil olmak için bazen gereğinden soğuk davranır; öğrencilerin bu yüzden soru sormaktan çekindiğini Liora Gent sıkça hatırlatır. Görevi eğitim değerlendirmesidir; krallığın bütün büyü uygulamalarını kendi adıyla serbest bırakmaz."
        ]
      }
    ]
  },
  {
    "id": "darom-selis",
    "name": "Darom Selis",
    "role": "Theramis karşı-büyü eğitmeni",
    "city": "theramis",
    "affiliation": "Theramis Altın Yılan Hizmetleri",
    "portrait": "darom-selis",
    "traits": [
      "Karşı-büyü",
      "İtirazı öğretir",
      "Hata hafızası"
    ],
    "summary": "Karşı-büyü eğitmeni Darom, bir işaretin nasıl yapılacağını bilenin onun nasıl durdurulacağını da öğrenmesini ister.",
    "background": "Darom’un ilk işi okulda bozulan alıştırma levhalarını temizlemekti. Uygulayıcılar başarılı olan parçaları saklıyor, başarısız olanları ona veriyordu. Bu çöplerden okuduğu tekrarlar, eğitimine başladığında ustalarının anlattığından daha gerçek bir hata haritası sundu.",
    "presence": "Çatlak bir alıştırma levhasını derslerin başında masaya koyar. Korkuyu bir zaaf olarak görmez, fakat korkunun yanlış bir itaate dönüşmesine kızar. Bugünkü görevi Theramis eğitim ve savunma hizmetlerinde uygulamayı güvenli kesmek; sınırsız güç vadeden bir okul yaratmak değildir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "kelyra-esven",
      "vadren-hol",
      "heskar-vale",
      "mavena-riel"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Darom’un ilk işi okulda bozulan alıştırma levhalarını temizlemekti. Uygulayıcılar başarılı olan parçaları saklıyor, başarısız olanları ona veriyordu. Bu çöplerden okuduğu tekrarlar, eğitimine başladığında ustalarının anlattığından daha gerçek bir hata haritası sundu.",
          "Bir toplu derste koruyucu düzeneğin kesilmesi gerektiğini fark etti ama hocasına karşı çıkmaya çekindi. Kimse ölmedi; iki öğrenci ağır biçimde yaralandı. Sonraki yıllarda eğitmen olduğunda öğrencisine itiraz hakkını tekrar tekrar anlatması bu sessizliğin bedelidir."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Kelyra Esven’i yalnız iyi uygulayıcı diye değil, yanlış ölçümünü açıkça yazdığı için destekledi. Vadren Hol ile seferde karşı-büyü hazırlığını, Heskar Vale ile denemenin fiziksel güvenliğini konuşur. Üçü aynı risk hakkında her zaman aynı karara varmaz.",
          "Çatlak bir alıştırma levhasını derslerin başında masaya koyar. Korkuyu bir zaaf olarak görmez, fakat korkunun yanlış bir itaate dönüşmesine kızar. Bugünkü görevi Theramis eğitim ve savunma hizmetlerinde uygulamayı güvenli kesmek; sınırsız güç vadeden bir okul yaratmak değildir."
        ]
      }
    ]
  },
  {
    "id": "erisa-thale",
    "name": "Erisa Thale",
    "role": "Theramis dağ iklimi ustası",
    "city": "theramis",
    "affiliation": "Theramis Altın Yılan Hizmetleri",
    "portrait": "erisa-thale",
    "traits": [
      "Dağ iklimi hizmeti",
      "Küçük alan hesabı",
      "Sürdürülebilir iş"
    ],
    "summary": "İklim ustası Erisa, dağ şehrini bir yaz ovasına çevirmeyen ama insanların kışı daha güvenli geçirmesine yardım eden büyücüdür.",
    "background": "Erisa, soğuk evlerin bacalarını temizleyen bir ustanın kızıydı. Bir sobanın iyi yanmasının bütün odayı eşit ısıtmadığını çok erken gördü. Theramis’te büyü öğrendiğinde denemelerini büyük meydanlar yerine su deposu, küçük revir ve çalışma avlusu gibi ölçülebilir yerlerle sınırladı.",
    "presence": "Babadan kalma küçük bir metal sıcaklık göstergesini büyüsüz karşılaştırma için kullanır. İnsanların umutlarını kırmak istemez ama yanlış umutla iş almak istemez. Theramis’teki görevi dağ hizmetini hazırlamak; Marhalden’de yerel lord ve lonca adına karar vermek değil, izinli uygulamayı yürütmektir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "vessa-thol",
      "elva-korrin",
      "veyren-sahl",
      "marhalden",
      "buyu-ruhsatlari"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Erisa, soğuk evlerin bacalarını temizleyen bir ustanın kızıydı. Bir sobanın iyi yanmasının bütün odayı eşit ısıtmadığını çok erken gördü. Theramis’te büyü öğrendiğinde denemelerini büyük meydanlar yerine su deposu, küçük revir ve çalışma avlusu gibi ölçülebilir yerlerle sınırladı.",
          "Marhalden’de ilk hizmetinde fazla geniş bir alanı dengede tutmaya çalıştı; etki söndüğünde tesis yeniden dondu. Kaybı kayıt altına alıp sözleşmesini küçülttü. Böylece ustalığı etkileyici bir vaat değil, sürdürülebilir bir iş oldu. Şehrin -35 dereceyi bulan kışı yok olmadı; kritik yerler daha dayanılır hâle geldi."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Vessa Thol ile yakıt ve bakım hesabını, Elva Korrin ile kalelerdeki uygulama saatlerini paylaşır. Elorwynli Rahip Veyren Sahl’dan büyüye bağımlı olmayan bakım yöntemleri öğrenir. Bu ortaklık iki kurumun her konuda aynı düşünmesini gerektirmez.",
          "Babadan kalma küçük bir metal sıcaklık göstergesini büyüsüz karşılaştırma için kullanır. İnsanların umutlarını kırmak istemez ama yanlış umutla iş almak istemez. Theramis’teki görevi dağ hizmetini hazırlamak; Marhalden’de yerel lord ve lonca adına karar vermek değil, izinli uygulamayı yürütmektir."
        ]
      }
    ]
  },
  {
    "id": "vadren-hol",
    "name": "Vadren Hol",
    "role": "Theramis sefer büyücüleri bölük başı",
    "city": "theramis",
    "affiliation": "Theramis Altın Yılan Hizmetleri",
    "portrait": "vadren-hol",
    "traits": [
      "Sefer büyücüsü",
      "Ayrı emir zinciri",
      "Öğrenilmiş tevazu"
    ],
    "summary": "Sefer büyücüleri bölük başı Vadren, Theramis ustalarını bir saha birliği olarak düzenler; bilgiyle emir vermeyi birbirine karıştırdığı zamanları hatırlar.",
    "background": "Vadren kervan izni kopyalayan bir yazı evinden büyü okuluna gitti. Genç bir usta iken daha az eğitimli askerin önerisini küçümseyip rüzgârı yanlış okudu. Kurduğu işaret iki kez yenilenmek zorunda kaldı; seferin saatlerini kaybetti ve yanındaki birim ona güvenmez oldu.",
    "presence": "İlk yanlış seferin boş tarih kâğıdı kutusunda durur. Yeteneği güçlü, kibri bütünüyle iyileşmiş değildir. Theramis’in ruhsatlı saha büyücülerini hazırlar; kurban ritüeli veya izin dışı bir uygulamayı savaş gerekçesiyle kendiliğinden meşru saymaz.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "solan",
      "darom-selis",
      "heskar-vale",
      "darsen-roth",
      "liora-gent"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Vadren kervan izni kopyalayan bir yazı evinden büyü okuluna gitti. Genç bir usta iken daha az eğitimli askerin önerisini küçümseyip rüzgârı yanlış okudu. Kurduğu işaret iki kez yenilenmek zorunda kaldı; seferin saatlerini kaybetti ve yanındaki birim ona güvenmez oldu.",
          "Başbüyücü Solan onu bir süre saha yerine ortak hazırlık masasında çalıştırdı. Vadren burada büyücünün kendi işini iyi yapmasının öteki işleri yönetme yetkisi yaratmadığını öğrendi. Sonradan sefer hizmetinin bölük başına geldiğinde büyü desteği ile asker komutasını aynı çizelgede ama ayrı satırlarda tuttu."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Darom Selis ile karşı-büyü, Heskar Vale ile malzeme güvenliği hazırlığı yapar. Mavi Pelerin komutanı Darsen Roth’a hizmet verdiğinde emir zincirlerini önceden yazdırır. Liora Gent’in eksik belge yüzünden ertelediği bir sevki artık kişisel hakaret saymamayı öğrenmektedir.",
          "İlk yanlış seferin boş tarih kâğıdı kutusunda durur. Yeteneği güçlü, kibri bütünüyle iyileşmiş değildir. Theramis’in ruhsatlı saha büyücülerini hazırlar; kurban ritüeli veya izin dışı bir uygulamayı savaş gerekçesiyle kendiliğinden meşru saymaz."
        ]
      }
    ]
  },
  {
    "id": "liora-gent",
    "name": "Liora Gent",
    "role": "Theramis staj ve kamu hizmetleri kâtibi",
    "city": "theramis",
    "affiliation": "Theramis Altın Yılan Hizmetleri",
    "portrait": "liora-gent",
    "traits": [
      "Staj kayıtları",
      "Açık dil",
      "Kendi hatasını saklar"
    ],
    "summary": "Staj ve kamu hizmetleri kâtibi Liora, bir genç büyücünün sınıfta başarılı olmakla sokağa hazır olmak arasındaki yolunu izler.",
    "background": "Liora’nın annesi şehirde dilekçe yazardı. Küçük yaşta farklı insanların aynı isteği aynı kelimelerle anlatamadığını gördü. Okulda güçlü bir uygulayıcı olma hevesi vardı; kendi yeteneğinin yavaş gelişmesi onu bir süre başkalarının başarılarına karşı sertleştirdi.",
    "presence": "Eski bir mavi kurdeleyle başarısız formlarını da saklar. Herkese yardım etmek ister ve bu yüzden bazen kendi işini geciktirir. Görevi staj, eğitim ve hizmet kayıtları arasındaki geçişi kolaylaştırmaktır; kâtip mührü uygulayıcıya bir büyü ruhsatı vermez.",
    "source": "new",
    "region": "danstsud",
    "power": "ordinary",
    "related": [
      "mavena-riel",
      "vadren-hol",
      "melra-shen"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Liora’nın annesi şehirde dilekçe yazardı. Küçük yaşta farklı insanların aynı isteği aynı kelimelerle anlatamadığını gördü. Okulda güçlü bir uygulayıcı olma hevesi vardı; kendi yeteneğinin yavaş gelişmesi onu bir süre başkalarının başarılarına karşı sertleştirdi.",
          "Bir stajda öğrencilerin evlere gitmeden önce hangi hizmet için izinli olduğunu karıştırdı. Zarar doğmadan iş durdu, ama iki aile günlerce yardım bekledi. Bu hatadan sonra formları yalınlaştırmak için çalıştı; Mavena Riel onu kamu hizmeti kayıtlarına aldı."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Mavena’ya öğrencilerin çekindiği soruları taşır. Vadren Hol’un sefer taleplerini hazırlar, Melra Shen’in kıyıdaki staj hizmetleriyle düzenli mektuplaşır. Kethra’daki gündelik dil, onun Theramis’te yazdığı kalıpları sürekli düzeltmesine neden olur.",
          "Eski bir mavi kurdeleyle başarısız formlarını da saklar. Herkese yardım etmek ister ve bu yüzden bazen kendi işini geciktirir. Görevi staj, eğitim ve hizmet kayıtları arasındaki geçişi kolaylaştırmaktır; kâtip mührü uygulayıcıya bir büyü ruhsatı vermez."
        ]
      }
    ]
  },
  {
    "id": "heskar-vale",
    "name": "Heskar Vale",
    "role": "Theramis iksir ve güvenlik ustası",
    "city": "theramis",
    "affiliation": "Theramis Altın Yılan Hizmetleri",
    "portrait": "heskar-vale",
    "traits": [
      "Deney güvenliği",
      "Açık etiketler",
      "Boya atölyesi kökeni"
    ],
    "summary": "İksir ve deney güvenliği ustası Heskar, Theramis’te merakın çevresine görünmez değil somut sınırlar koyar.",
    "background": "Heskar, boya karıştıran bir atölyede büyüdü. Genç bir simya öğrencisi iken daha parlak bir karışım arayışıyla iki malzemeyi aynı kapta ısıttı; taşan buhar duvarı kararttı ve bir çırağın elini yaktı. Başarısızlığı bir şaşırtıcı keşif diye anlatmayı reddettiğinde ustasıyla yolları ayrıldı.",
    "presence": "Her kapta açık bir malzeme adı ister, gizemli kısaltmalardan hoşlanmaz. İyi huyludur ama izinsiz deneyi romantik bir cesaret gibi sunanlara öfkelidir. Theramis’te güvenli deney ve iksir hazırlığı hizmetinin ustasıdır; hiçbir karışımı kullananın bütün sonuçlarını ortadan kaldıran bir mucize diye pazarlamaz.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "darom-selis",
      "vadren-hol",
      "zylara",
      "solan"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Heskar, boya karıştıran bir atölyede büyüdü. Genç bir simya öğrencisi iken daha parlak bir karışım arayışıyla iki malzemeyi aynı kapta ısıttı; taşan buhar duvarı kararttı ve bir çırağın elini yaktı. Başarısızlığı bir şaşırtıcı keşif diye anlatmayı reddettiğinde ustasıyla yolları ayrıldı.",
          "Daha sonra Theramis’te deney bakımına girdi. Temizlik, etiket ve kapak düzenini sıkıcı bulan öğrencileri önce kendi eski kazasının raporunu okumaya yönlendirdi. Başbüyücü Solan’ın verdiği güvenlik sorumluluğunu yeni bir parlak unvandan çok her gün yeniden yapılacak iş olarak gördü."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Darom Selis ile durdurma usullerini, Vadren Hol ile sahaya taşınabilecek malzemeleri belirler. Zylara’ya sıradan bakım ilaçları gönderir; ruhsat gerektiren büyülü şifayı bu sevkiyatın içine belirsizce katmaz.",
          "Her kapta açık bir malzeme adı ister, gizemli kısaltmalardan hoşlanmaz. İyi huyludur ama izinsiz deneyi romantik bir cesaret gibi sunanlara öfkelidir. Theramis’te güvenli deney ve iksir hazırlığı hizmetinin ustasıdır; hiçbir karışımı kullananın bütün sonuçlarını ortadan kaldıran bir mucize diye pazarlamaz."
        ]
      }
    ]
  },
  {
    "id": "borren-keld",
    "name": "Borren Keld",
    "role": "Dorvenhall binekli sınır korucuları başı",
    "city": "dorvenhall",
    "affiliation": "Dorvenhall Sınır Korucuları",
    "portrait": "borren-keld",
    "traits": [
      "Binekli devriye",
      "Güvenli dönüş",
      "Dağ bakımı"
    ],
    "summary": "Dorvenhall binekli sınır korucuları başı Borren, dağın erişilemeyen yerini bir askerî hedefe dönüştürmeden devriye planlar.",
    "background": "Borren’in ailesi Dorvenhall dışındaki yük yollarında hayvan bakardı. Gençlik gururuyla bir orvel bineğini yokuşta fazla yüklediğinde hayvan düşmedi, ama ayak tabanı günlerce kullanılamayacak biçimde yaralandı. O zarar, kendi bedeninin yorulması kadar öğretici olmadığını düşündüğü bakım işini hayatının merkezine taşıdı.",
    "presence": "Babadan kalma boynuz düdüğü farklı dönüş işaretlerinde kullanır. Gençlerin kendisine yavaş demesine dayanır, hayvanın ağrısını görmezden gelmesine dayanmaz. Dorvenhall’daki binekli sınır korucularını yönetir; Karlan’ın 13.000 metrelik zirvelerini insan ve binek için yaşanabilir bir devriye alanı saymaz.",
    "source": "new",
    "region": "danstsud",
    "power": "powerful",
    "related": [
      "rovan-mereth",
      "sira-norrel",
      "endrik-vaun",
      "orvel-kaya-binegi",
      "karlan-daglari"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Borren’in ailesi Dorvenhall dışındaki yük yollarında hayvan bakardı. Gençlik gururuyla bir orvel bineğini yokuşta fazla yüklediğinde hayvan düşmedi, ama ayak tabanı günlerce kullanılamayacak biçimde yaralandı. O zarar, kendi bedeninin yorulması kadar öğretici olmadığını düşündüğü bakım işini hayatının merkezine taşıdı.",
          "Sınır korucularına katıldığında hızlı sürüş yerine güvenli dönüşle tanındı. Dar bir geçitte devriyeyi geri çevirip yolun açılması için beklemesi kaçakçı kaçırmakla suçlandı. Daha sonra taş düşmesi gözle görülür hâle gelince Lord Rovan Mereth onu devriye başına aldı."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Sira Norrel onun en güvendiği binek ustasıdır; Endrik Vaun genç devriyelerin yüzbaşısıdır. Rovan ile görev alanlarını açık tutar. Marhalden’in tek düzenli kara geçidinin yerine gizli bir ikinci yol bulmayı başarı gibi anlatmaz.",
          "Babadan kalma boynuz düdüğü farklı dönüş işaretlerinde kullanır. Gençlerin kendisine yavaş demesine dayanır, hayvanın ağrısını görmezden gelmesine dayanmaz. Dorvenhall’daki binekli sınır korucularını yönetir; Karlan’ın 13.000 metrelik zirvelerini insan ve binek için yaşanabilir bir devriye alanı saymaz."
        ]
      }
    ]
  },
  {
    "id": "sira-norrel",
    "name": "Sira Norrel",
    "role": "Dorvenhall orvel terbiyecisi",
    "city": "dorvenhall",
    "affiliation": "Dorvenhall Sınır Korucuları",
    "portrait": "sira-norrel",
    "traits": [
      "Orvel terbiyesi",
      "Yem eğitimi",
      "Sabırlı göz"
    ],
    "summary": "Orvel terbiyecisi Sira, Dorvenhall korucularının en iyi eğitimini çoğu zaman ahırda verir.",
    "background": "Sira çocukken sürü bakımı yaptı; inatçı bir hayvanı aç bırakarak itaat ettirmenin kısa süreli bir sonuç olduğunu çok erken gördü. Dorvenhall’a geldiğinde yük ustaları onun küçük bedeniyle ağır hayvan yönetemeyeceğini düşündü. Sabırlı yem, ses ve ayak alıştırmalarıyla bu önyargıyı bozdu.",
    "presence": "Babasının tahta yem kabını deneme ölçüsü olarak taşır. Hayvana karşı sabırlı, insanın aceleciliğine karşı kolay sinirlenen biridir. Orvelleri bir savaş atı gibi uzun sıçrayışa zorlamaz; tutucu toynaklarının avantajını yük ve zemin hesabıyla birlikte öğretir.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "borren-keld",
      "endrik-vaun",
      "orvik-drel",
      "orvel-kaya-binegi"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Sira çocukken sürü bakımı yaptı; inatçı bir hayvanı aç bırakarak itaat ettirmenin kısa süreli bir sonuç olduğunu çok erken gördü. Dorvenhall’a geldiğinde yük ustaları onun küçük bedeniyle ağır hayvan yönetemeyeceğini düşündü. Sabırlı yem, ses ve ayak alıştırmalarıyla bu önyargıyı bozdu.",
          "İlk askerî işinde hazır denilen bir bineğin dar kayaya alışmadığını söyledi. Sevk ertelendiği için ücretini kaybetti; aynı hayvanın yük indirildiğinde sakin biçimde geçtiğini gösterince Borren Keld onu korucu ahırlarına çağırdı. Eğitim usulünde ceza kadar dinlenme de görünür bir kayıt oldu."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Borren’le devriye sınırlarını, Endrik Vaun’la genç binicilerin oturuşunu çalışır. Orvik Drel, ocak atıklarının hayvanların yemine karışmaması için ona yardım eder. Bu ilişki bir sınır birliğinin yalnız silah satın alarak kurulamayacağını gösterir.",
          "Babasının tahta yem kabını deneme ölçüsü olarak taşır. Hayvana karşı sabırlı, insanın aceleciliğine karşı kolay sinirlenen biridir. Orvelleri bir savaş atı gibi uzun sıçrayışa zorlamaz; tutucu toynaklarının avantajını yük ve zemin hesabıyla birlikte öğretir."
        ]
      }
    ]
  },
  {
    "id": "endrik-vaun",
    "name": "Endrik Vaun",
    "role": "Dorvenhall kuzey devriye yüzbaşısı",
    "city": "dorvenhall",
    "affiliation": "Dorvenhall Sınır Korucuları",
    "portrait": "endrik-vaun",
    "traits": [
      "Genç yüzbaşı",
      "Hızla hesaplaşma",
      "Arka sırayı sayar"
    ],
    "summary": "Kuzey devriye yüzbaşısı Endrik, Dorvenhall dağlarında hız arzusunu bineğin dikkatli adımına uydurmayı öğrenir.",
    "background": "Endrik gençliğinde ova at yarışlarına meraklıydı. Dorvenhall hizmetine geldiğinde aynı hızla dağda ün kazanabileceğini düşündü. İlk devriyesinde önden gidip geride kalan yaralı bineği fark etmemesi, bütün grubun yürüyüşünü durdurdu.",
    "presence": "Eski yarış ipini kırbaç değil bileklik olarak taşır. Cesur ve öğrenmeye açıktır, takdir edilme isteği onu hâlâ kolay hızlandırır. Kuzey devriyelerini yönetir; yeni bir güvenilir Hardlane geçidi bulmuş gibi rapor yazmayı kariyerine kısa yol saymaz.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "borren-keld",
      "sira-norrel",
      "talvena-kord"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Endrik gençliğinde ova at yarışlarına meraklıydı. Dorvenhall hizmetine geldiğinde aynı hızla dağda ün kazanabileceğini düşündü. İlk devriyesinde önden gidip geride kalan yaralı bineği fark etmemesi, bütün grubun yürüyüşünü durdurdu.",
          "Borren Keld onu rütbe yerine ahır işine verdi. Sira Norrel’in yanında haftalar geçirince binekli birliğin gücünün son hayvanın durumu kadar olduğunu gördü. Sonraki görevlerde en gerideki ikiliyi de sayarak yükseldi; yüzbaşılığı hâlâ genç olduğu için herkesin hoşuna gitmedi."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Borren’in ihtiyatını bazen fazla ağır bulur, ama onu açıkça dinler. Sira’ya aldığı kararın hayvan üzerindeki sonucunu sorar. Talvena Kord ile maden yüklerinin korucu yolunu tıkadığı günlerde sert tartışır; ikisinin hesabı aynı dar yeri farklı amaçlarla kullanır.",
          "Eski yarış ipini kırbaç değil bileklik olarak taşır. Cesur ve öğrenmeye açıktır, takdir edilme isteği onu hâlâ kolay hızlandırır. Kuzey devriyelerini yönetir; yeni bir güvenilir Hardlane geçidi bulmuş gibi rapor yazmayı kariyerine kısa yol saymaz."
        ]
      }
    ]
  },
  {
    "id": "talvena-kord",
    "name": "Talvena Kord",
    "role": "Dorvenhall cevher yoklama ustası",
    "city": "dorvenhall",
    "affiliation": "Dorvenhall Sınır Korucuları",
    "portrait": "talvena-kord",
    "traits": [
      "Cevher yoklama",
      "Parti kaydı",
      "Ustalık gururu"
    ],
    "summary": "Cevher yoklama ustası Talvena, Dorvenhall’ın mavi mor kiremitlerine giden taşın değerini parıltısından önce partisinden okur.",
    "background": "Talvena atölyede taş ayıran işçilerin yanında büyüdü. Gençliğinde parlak parçaları iyi sanarak ayırdığı bir sevkiyat işlenirken çatladı. Kendi payını kaybetmekten çok aynı partide çalışan arkadaşlarının ücretinin düşmesi onu etkiledi; taşın yalnız gözle değil örnek ve işlem kaydıyla tanınmasını öğrendi.",
    "presence": "Çatlamış ilk sevkiyatından küçük bir taş parçasını örnek tepsisinde tutar. İnsanlara karşı yumuşak, ölçüm hakkında serttir. Dorvenhall cevherini Valdareth’teki işleme sonucuyla birlikte izler; menekşespatını Karlan’a özgü Veyralt’la aynı maden diye anlatmaz.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "rovan-mereth",
      "orvik-drel",
      "tormal-fenn",
      "endrik-vaun",
      "mor-sir-hatti"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Talvena atölyede taş ayıran işçilerin yanında büyüdü. Gençliğinde parlak parçaları iyi sanarak ayırdığı bir sevkiyat işlenirken çatladı. Kendi payını kaybetmekten çok aynı partide çalışan arkadaşlarının ücretinin düşmesi onu etkiledi; taşın yalnız gözle değil örnek ve işlem kaydıyla tanınmasını öğrendi.",
          "Dorvenhall’ın menekşespatı sevkiyatında açık parti kaydı tutması, tüccarlar için başlangıçta yeni bir masraf oldu. Başkentten geri gelen hatalı yükte hangi işleme aşamasının aksadığı böyle bulununca Lord Rovan Mereth ona yoklama hizmetini emanet etti."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Rovan ile satış değerini, Orvik Drel ile çıkarma koşullarını konuşur. Tormal Fenn’in tersane için aldığı taş ve kaplama örneklerini değerlendirir; Endrik Vaun ile yükler devriye yolunda beklediğinde karşı karşıya gelir. Ustalık, herkesin aynı önceliği taşıması değildir.",
          "Çatlamış ilk sevkiyatından küçük bir taş parçasını örnek tepsisinde tutar. İnsanlara karşı yumuşak, ölçüm hakkında serttir. Dorvenhall cevherini Valdareth’teki işleme sonucuyla birlikte izler; menekşespatını Karlan’a özgü Veyralt’la aynı maden diye anlatmaz."
        ]
      }
    ]
  },
  {
    "id": "orvik-drel",
    "name": "Orvik Drel",
    "role": "Dorvenhall ocak emniyeti başı",
    "city": "dorvenhall",
    "affiliation": "Dorvenhall Sınır Korucuları",
    "portrait": "orvik-drel",
    "traits": [
      "Ocak emniyeti",
      "Vardiya sınırı",
      "Hava ölçümleri"
    ],
    "summary": "Ocak emniyeti başı Orvik, Dorvenhall’da vardiya sayılarını üretim hesabı kadar dikkatle tutar.",
    "background": "Orvik küçük bir maden ocağında çalışmaya başladı. İyi ücret için fazla vardiya aldığında nefesini kesen bir gaz ceplerini zamanında fark edemedi; ustası işi durdurdu ve ücretler gecikti. Genç Orvik ustaya kızdı, sonra gazın ölçümünü görünce kendi aceleciliğinden utandı.",
    "presence": "Taşıdığı bakır ölçü aletini herkesin önünde kontrol eder. Tedbiri bazen insanları bıktırır, ama eksik ölçümü yalnız kendi sezgisiyle tamamlamaz. Dorvenhall’da ocak güvenliği ve vardiya denetimi onun görevidir; bir madencinin emeğini yalnız çıkan taşın miktarıyla ölçmeyi reddeder.",
    "source": "new",
    "region": "danstsud",
    "power": "distinguished",
    "related": [
      "talvena-kord",
      "sira-norrel",
      "tervik-hann",
      "rovan-mereth"
    ],
    "sections": [
      {
        "title": "Hayatını değiştiren seçim",
        "paragraphs": [
          "Orvik küçük bir maden ocağında çalışmaya başladı. İyi ücret için fazla vardiya aldığında nefesini kesen bir gaz ceplerini zamanında fark edemedi; ustası işi durdurdu ve ücretler gecikti. Genç Orvik ustaya kızdı, sonra gazın ölçümünü görünce kendi aceleciliğinden utandı.",
          "Ocak emniyetinde yetiştiği yıllarda zarar oluşmadan duran vardiyaların başarısız sayılmaması için uğraştı. Bir işverenin şikâyetine karşı işçilerin dinlenme kayıtlarını savunması lordluk hizmetindeki yükselişini geciktirdi. Sonunda Rovan Mereth’in verdiği yetkiyi çalışma usulüne yazdırdı."
        ]
      },
      {
        "title": "Bugünkü bağlar ve sorumluluk",
        "paragraphs": [
          "Talvena Kord ile iyi cevherin kötü çalışma koşulunu gizleyemeyeceğini tartışır. Sira Norrel ahır atıklarının güvenli uzaklaştırılmasında ona yardım eder. Marhalden’den Tervik Hann’la farklı ocakların hava ve vardiya yöntemlerini karşılaştırır.",
          "Taşıdığı bakır ölçü aletini herkesin önünde kontrol eder. Tedbiri bazen insanları bıktırır, ama eksik ölçümü yalnız kendi sezgisiyle tamamlamaz. Dorvenhall’da ocak güvenliği ve vardiya denetimi onun görevidir; bir madencinin emeğini yalnız çıkan taşın miktarıyla ölçmeyi reddeder."
        ]
      }
    ]
  }
]

export const newDanstsudCharacters: Character[] = [...establishedDanstsudCharacters, ...completedDanstsudCharacters]

export const portraitBriefs: Record<string, string> = {
  "ardel-veyran": "A lean man aged 52, dark greying cropped hair, long face and crooked nose, watchful brown eyes. Battle-worn navy plate with restrained golden crown clasps, no actual crown, purple sash. Holds a closed leather duty book. Warm palace window light across the face, dark plum shadow, loosely painted golden stone background.",
  "selka-orven": "A tall broad-shouldered woman aged 39 with medium-brown skin, black hair in a thick braided crown, a small eyebrow notch and alert eyes. Practical blue-grey armor and faded violet riding cloak, a folded map in her hand. Ochre morning light, cool river-blue shadows, suggestive distant bridge.",
  "beltran-sael": "A stout man aged 61, balding white hair, rounded weathered face, neatly cut moustache and cheerful challenging eyes. Worn iron training cuirass over russet wool, no lavish jewels; leather fencing gloves and an unsharpened practice sword. Warm yellow courtyard sunlight, muted red and slate paint.",
  "miren-halvyr": "A slim woman aged 34 with pale olive skin, jaw-length straight black hair, pointed brows and a composed unsmiling gaze. Dark indigo brigandine with tiny gold rivets, purple collar, simple key chain. Side-lit by a high honey-colored window, cool bookcase silhouettes rendered in broad brush marks.",
  "dain-torven": "A man aged 42 with curly copper hair, freckled cheeks, a square chin and one slightly clouded eye. Lacquered midnight breastplate, plum cloak, a wax-seal case suspended at his belt. Amber sidelight, dark olive shadow, minimal soft painted administrative chamber.",
  "ysra-fenhol": "A sturdy woman aged 47 with deep brown skin, closely shaved black hair, strong cheekbones and a calm protective expression. Black steel armor with brass edges over ivory wool, short violet mantle. Her hand rests on an ordinary sword hilt. Warm cream light and quiet dark blue shadows, loose garden background.",
  "ovel-rann": "A very tall narrow man aged 45 with sandy hair tied low, a long fair face, hooked nose and stubbled jaw. Dented gunmetal plate and a folded engineer apron, a small wooden measuring square in hand. Strong ochre light against grey blue masonry, painterly scaffold silhouettes.",
  "thessa-morain": "A woman aged 31 with tawny skin, short wavy dark brown hair, broad nose and thoughtful hazel eyes. Simple steel scale armor beneath a white-and-purple tabard, stitched medical pouch at belt. Warm copper light over the face, soft teal shadows, clean restrained brushwork and sparse infirmary curtains.",
  "garron-veldrith": "A broad man aged 50 with ash-brown skin, short silver-flecked beard, high forehead and deep-set dark eyes. Weathered blue steel armor, dark violet scarf, a plain walking stick rather than heroic raised weapon. Late afternoon gold and muted sepia, indistinct petition hall painted loosely.",
  "kelyra-esven": "A woman aged 38 with warm olive skin, curly black hair pinned with one bronze clip, a slender asymmetric face and steady green eyes. Indigo coat reinforced with narrow steel plates, purple embroidered cuffs, a small etched copper ward disk held without neon glow. Honey light and deep cobalt shadow, visibly painted scholarly warrior portrait.",
  "nethan-caul": "A heavyset man aged 36, light brown skin, shaved head and short dark beard, a wide compassionate face. Plain dark iron breastplate and wool plum cloak, an old knitted wrist cord visible. Warm yellow paint against burgundy and charcoal, a humble practice yard behind him.",
  "adera-voss": "A woman aged 56 with pale skin, long silver hair in a low knot, thin mouth and sharp grey eyes. Elegant but practical black plate with aged gold trim and a violet shoulder mantle; no jeweled crown. Deep amber stage-like daylight across one cheek, cool indigo drapery in broad visible strokes.",
  "vesren-kald": "A square-built man aged 48 with dark brown skin, salt-and-pepper cropped hair and a trimmed angular beard. Rich purple military cloak over engraved dark steel, bronze command baton held low. Golden light, deep violet shadows, strongly painted stern face and restrained palace wall.",
  "fara-nidren": "A wiry woman aged 29 with fair freckled skin, a close red undercut and lively suspicious eyes. Short violet cloak, blackened scale armor, ring of iron gate keys. Warm orange light contrasts with cold plum shadows, low-detail painted inner gate.",
  "darsen-roth": "A tall man aged 44 with tan skin, dark wavy hair, scarred chin and serious round eyes. Dusty cobalt cloak and heavy field breastplate, plain leather map tube. Ochre sun and dark river-blue shadow, broadly brushed distant military tents.",
  "ivela-trost": "A short woman aged 41 with deep brown skin, black hair gathered into tight small braids and a patient practical expression. Cobalt wool military coat reinforced with iron shoulder plates, leather tally board. Soft golden warehouse light, earth brown and blue pigments, readable expressive hands.",
  "nerath-omber": "A man aged 58 with weathered olive skin, sweeping white moustache and curly grey hair, one gold earring. Navy coat with violet lining and aged brass fasteners, no modern uniform, hand on a wooden rail. Warm low harbor sun, teal sea shadows and loosely painted ship rigging.",
  "veyla-dris": "A woman aged 33 with medium-brown skin, thick black shoulder-length curls, broad cheeks and keen dark eyes. Deep purple sea coat, blue scarf, a brass dividers instrument above a rolled chart. Muted sunlit ivory and cool turquoise, visible brush planes, indistinct ancient lighthouse.",
  "tormal-fenn": "A burly man aged 54 with pale ruddy skin, long chestnut beard streaked white, heavy brows and an amused squint. Rolled ochre sleeves, leather workshop apron and a small violet authority patch, a wooden ship rib template. Copper light and soot-grey shadows, painterly dry-dock beams.",
  "ceryn-hale": "A lean woman aged 45 with sun-browned skin, short dark hair streaked white at the temples and a blunt determined face. Worn navy brigandine beneath a purple captain coat, short plain cutlass at hip. Golden spray-lit cheek against slate and deep green sea paint, loose deck ropes.",
  "odrissa-vey": "A woman aged 64 with warm brown skin, short white curls and strong intelligent eyes. Ivory and deep charcoal ceremonial wool with muted gold stitching, small obsidian pendant, hands resting calmly on a worn prayer book. Honey light against near-black painted stone, no magical halo.",
  "nolen-dur": "A stocky man aged 46 with pale olive skin, close black hair, pockmarked cheek and tired narrowed eyes. Plain iron-grey coat, heavy iron key chain, no heroic armor. A warm narrow shaft of light on the face against olive-black stone brushwork, unsettling restrained expression.",
  "ensel-drunn": "A small man aged 37 with ruddy skin, thinning blond hair and a neat brown goatee, quick calculating eyes. Ochre civilian vest, dark blue sleeves and fingerless ink-stained gloves, tiny balance weight between his fingers. Warm harbor gold and tobacco brown, loose crates behind him.",
  "torena-vesk": "A woman aged 40 with brown skin, greying black braid, wide-set eyes and an amused serious mouth. Faded blue-green coat with a small steel shield badge, inked fingers and several colored task cords. Amber desk light, deep navy paint, broad loose guild hall strokes.",
  "hadrik-solm": "A thick-necked man aged 53 with light skin, wiry grey hair, blunt nose and cheerful crowfeet. Scratched iron cuirass over russet gambeson, an old rectangular training shield. Warm ochre courtyard light and plum shadows, palpable broad paint marks.",
  "nelra-ven": "A slim woman aged 28 with olive skin, very curly dark hair, large kind brown eyes and a crooked smile. Moss green travelling robe under short chain sleeves, brass licensed healer token, bundles of dried leaves. Warm gold against green-blue, clearly painted face and textured cloth.",
  "jarek-ulven": "A rangy man aged 35 with dark skin, close tightly curled hair and a thin face with a small upper-lip scar. Slate-blue hooded cloak, light leather armor and rope coil, hands resting on a field notebook. Side-lit ochre and mist-green, sparse painterly forest border.",
  "oswen-krehl": "A round-bodied older man aged 60 with fair skin, big white eyebrows, bald pate and an affectionate frown. Tobacco leather apron over indigo wool, large repair needle and folded belt. Soft honey light and warm umber, simple guild storeroom painted with generous brushwork.",
  "maera-dell": "A woman aged 32 with deep brown skin, a thick side braid and a long serious face. Weather-worn ochre scarf, blue-grey leather coat and a compact bow lowered at her side. Golden afternoon light against dull green, loose reed and woodland strokes.",
  "sevran-til": "A lean man aged 34 with pale skin, glossy black jaw-length hair and a narrow confidently smiling face. Carefully polished bronze-trimmed leather armor over a burgundy coat, plain merchant contract roll. Red-gold light and slate-blue shadow, loose painted urban backdrop.",
  "mavena-riel": "A woman aged 57 with tawny skin, short silver curls and stern rounded features. Deep blue academic robes with narrow gold serpent embroidery, copper measuring caliper and closed notebook. Warm golden window light against indigo, no luminous special effects, visibly painted fabric.",
  "darom-selis": "A slender man aged 43 with dark skin, black hair cropped close and a long thoughtful face. Plum and muted ochre scholarly coat with reinforced forearms, a cracked training ward tile in one hand. Soft amber and aubergine shadow, loose workshop wall.",
  "erisa-thale": "A woman aged 36 with fair freckled skin, copper-red hair braided low and calm grey eyes. Layered teal wool robe under a weathered dark blue coat, brass thermic gauge and heavy mittens. Warm firelight contrasting with icy blue brushed window, tactile opaque painting.",
  "vadren-hol": "A man aged 46 with medium-brown skin, dark wavy hair pulled back, hooked nose and short beard. Dark teal military-academic coat with copper clasps and one steel shoulder plate, unlit engraved staff. Warm yellow light and ultramarine shadows, loose painted field tent.",
  "liora-gent": "A woman aged 26 with olive skin, straight black hair pinned high and lively angular eyebrows. Plain blue student robe with ochre cuffs, ink-stained hands and ribbon-bound forms. Soft cream daylight and warm green shadows, broad book-stack shapes.",
  "heskar-vale": "A stout man aged 49 with brown skin, thinning dark curls, a generous nose and slightly worried eyes. Mustard workshop apron over violet wool, simple protective gloves and a small opaque ceramic reagent jar. Golden light and cool blue shadows, painterly laboratory without neon glow.",
  "borren-keld": "A tall man aged 47 with sunburned fair skin, thick grey beard and light eyes. Weathered iron scale armor and dark green wool cloak, carved horn whistle and leather riding reins. Warm ochre face against snow-blue mountain brushwork; a small blurred shaggy mountain-mount silhouette behind.",
  "sira-norrel": "A compact woman aged 38 with deep brown skin, many tight braids tied with a plain red cord and a patient smile. Russet hide coat, blue wool scarf, rounded wooden feed bowl. Warm golden stable light with cool slate shadow, loose shaggy mountain-mount mane near one shoulder.",
  "endrik-vaun": "A man aged 30 with pale skin, cropped sandy hair, thin moustache and sharp grey eyes. Dark leather and iron riding armor, moss cloak, sheathed short spear, saddle straps crossing his chest. Ochre sunset and muted icy violet, clear painted face and broad mountain forms.",
  "talvena-kord": "A broad woman aged 51 with olive skin, short black-and-grey curls, heavy eyelids and a knowing expression. Deep blue work tunic, leather apron, sample tray of blue-purple stone fragments. Warm golden furnace light and smoky plum shadow, strongly visible brush texture.",
  "orvik-drel": "A man aged 42 with warm brown skin, shaved head, broad nose and dark expressive eyes. Sooted ochre work coat with iron shoulder guards, copper ventilation meter held at chest. Amber lamplight against charcoal and indigo mine brushwork, dignified restrained pose.",
  "savren-urn": "A man aged 44 with fair olive skin, long dark hair bound back, grey streak in beard and narrow steely eyes. Distinctive pale matte metal lamellar armor, charcoal fur-lined cape and ordinary short spear. Golden lamp light, ice blue shadows, visible broad painted armor planes, no glowing magic armor.",
  "elva-korrin": "A tall woman aged 33 with dark skin, short twisted hair and a triangular alert face. Pale grey layered metal plates over cobalt padded cloth, braided rope at belt, folded watch chart. Warm cream light against deep turquoise river shadow, loose bridge and wall brushwork.",
  "tervik-hann": "A heavyset man aged 55 with light ruddy skin, thick white moustache, broad cheeks and shrewd small eyes. Black miner coat, amber scarf and battered brass survey lamp. Warm orange light, dark brown and blue-grey texture, painterly timbered mine background.",
  "nesra-dolm": "A slim woman aged 41 with tan skin, curly dark hair tied back and serious bright eyes. Indigo work gown, reddish leather apron and simple ear protection cord, a small metal test strip. Warm forge light and muted purple shadow, boldly painted tool silhouettes.",
  "karven-oll": "A man aged 39 with deep brown skin, long thin moustache, neatly braided hair and a polished persuasive expression. Tobacco velvet coat with blue trim, a small brass stamp and folded trade ledger. Honey window light against dark burgundy, tactile hand-painted dignified civilian portrait.",
  "caldris-evern": "A broad man aged 50 with olive skin, short black-and-grey curls, shaved chin and a strong sober face. Ivory tabard over aged brass-trimmed dark plate, small sun-shaped oath clasp, plain sword held downward. Warm church gold and cool grey-blue, painted surfaces without halos.",
  "rahela-dorn": "A woman aged 48 with brown skin, tightly wrapped dark hair, strong chin and determined hazel eyes. Cream head cloth, indigo robe over steel mail sleeves, rectangular shield with a modest geometric chapel mark. Honey light, deep teal shadows, loose painted stone arch.",
  "veyren-sahl": "A slim man aged 62 with fair skin, shoulder-length white hair and gentle tired grey eyes. Worn ivory and slate-blue clerical wool, practical mail collar, modest wooden prayer beads and a field medical case. Quiet warm gold and soft green-grey shadows, generous visible paint strokes.",
  "orena-vel": "A woman aged 37 with tawny skin, straight black chin-length hair and a precise unsmiling gaze. Dark green civic robe with ivory collar, metal seal case and thin reading spectacles held in hand. Amber desk light and blue-green shadow, visibly painted plain administrative room.",
  "seldric-nove": "A man aged 45 with pale olive skin, receding dark hair, long nose and a self-contained half smile. Fine burgundy civilian coat with muted gold clasp, folded ancestral charter and dark leather gloves. Rich ochre light against charcoal-green, broad painterly columns.",
  "tavera-oss": "A muscular woman aged 34 with tan skin, black hair in a high short ponytail and a flattened broken nose. Dark teal sea coat with bronze shoulder plates, salt-marked plum scarf and lowered boarding pike. Copper dock light against blue-grey, painterly mist and rope.",
  "branis-dov": "A round man aged 52 with warm brown skin, silver-flecked beard and laugh lines framing serious eyes. Ochre merchant coat with burgundy sleeves, palm-sized wood counting frame and a folded harbor invoice. Gold window light and indigo shadow, thick opaque painting.",
  "melra-shen": "A woman aged 43 with pale freckled skin, tied-back chestnut hair and a broad attentive face. Soft blue healer robe, russet shawl, practical leather satchel and modest brass license token. Warm peach light with sea-green shadow, painterly simple clinic window.",
  "ivren-vask": "A man aged 31 with olive skin, wavy black hair, large ears and a cautious eager expression. Patched grey-blue wool with a tiny violet civic cord, ink stains, a parcel of reed-wrapped letters. Warm oil lamp light against frost-blue ancient rounded masonry, visibly painted.",
  "hessa-rund": "A sturdy woman aged 58 with deep brown skin, thick grey braids and a weathered caring face. Patched rust wool shawl over indigo linen, plain wooden soup ladle and a small tally cord. Soft honey light and slate-blue shadow, loose old harbor stone and steam.",
  "orna-kehl": "A woman aged 40 with pale ruddy skin, cropped fair hair, strong cheekbones and pale watchful eyes. Navy military wool and modest iron breastplate, heavy grey sea scarf, old brass signal shutter handle. Ochre beacon light and cold ultramarine sea shadow, strong brush marks.",
  "dovek-raal": "A narrow man aged 46 with tan skin, wiry dark hair, asymmetrical nose and an unsettling cheerful mouth. Faded burgundy coat over patched dark leather, tarnished rings and a small wooden pier token, no crown. Murky golden lamplight and deep teal-black harbor paint.",
  "selvi-arn": "A woman aged 35 with warm olive skin, long dark hair rolled into a loose bun and a thoughtful open face. Moss-green wool, cream scarf, soot-darkened gloves and a small copper pipe wrench. Warm pale golden steam light against slate and sage brushwork.",
  "teren-moll": "A thin older man aged 63 with sun-weathered brown skin, shaggy grey hair, short beard and gentle deep-set eyes. Patched blue-brown coat, loose rope belt and a wooden carved house token. Small warm hearth light against broad cold grey snow brushwork, dignified restrained face.",
  "savra-nell": "A woman aged 42 with brown skin, short dark curls and a wide smiling face whose eyes remain calculating. Deep ochre robe with a purple sash, simple brass city stamp and rolled market accounts. Warm gold and plum shadows, loose painted stalls and awnings.",
  "uldrin-fael": "A man aged 28 with olive skin, close black hair, narrow shoulders and a serious long face. Simple brown leather guard coat with blue collar, plain spear upright beside his shoulder. Amber street light against cool blue-grey, readable hand-painted modest common soldier.",
  "nalven-rieth": "A woman aged 46 with pale skin, thick ash-brown braid, rounded nose and alert kindly eyes. Worn iron mail collar and muted green cloak, a wooden bridge inspection mallet. Golden river light and soft violet shadow, suggestive painted bridge arches.",
  "elric-marn": "A man aged 56 with tawny skin, greying dark hair, full cheeks and expressive thoughtful eyes. Plain indigo legal robe with a rust scarf, folded grievance letters and a small wooden stylus. Warm amber and pale sage, visibly painted interior with spare archival shelves."
}
