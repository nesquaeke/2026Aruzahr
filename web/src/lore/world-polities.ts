import type { LoreArticle, RegionId, Section } from '../data'

export type WorldHouse = {
  id: string
  region: RegionId
  name: string
  seatId: string
  seatName?: string
  leaderId?: string
  leaderName: string
  kind: 'dynasty' | 'clan' | 'house'
  motto: string
  blazon: string
  colors: [string, string]
  symbol: string
  history: string[]
  relations: { houseId: string; nature: string; description: string }[]
  crestId: string
}
export type WorldPolity = {
  region: RegionId
  name: string
  population: number
  capitalId: string
  capitalName: string
  capitalPopulation: number
  capitalStatus: 'inhabited' | 'abandoned' | 'assembly' | 'dispersed'
  government: string
  hegemony: string
  tiers: { title: string; role: string; selection: string; limits: string }[]
  armed: {
    standing: number
    muster: number
    navalCrew: number
    ships: number
    elite: number
    caster: number
    logistics: string
    reservesNote: string
  }
  powerCenters: string[]
  sections: Section[]
}

export const politySource = '27 Ekim 2026 yazar kararları ve yeni dünya kurma: Valdareth 500.000, Morihael 1.000.000, Honud toplam 500.000 ve eski başkent 0; diğer sayılar anlatı ölçeği için yeni tahminlerdir'

// These houses are public political worldbuilding, not a list of quest factions.
export const worldHouses: WorldHouse[] = [
  {
    "id": "vaeranth",
    "region": "danstsud",
    "name": "Vaeranth Hanedanı",
    "seatId": "valdareth",
    "leaderName": "Kral Eryndorn Vaeranth",
    "kind": "dynasty",
    "motto": "Beş sur, tek yemin.",
    "blazon": "Koyu menekşe alanda iç içe beş gümüş kemer; en iç kemerin üzerinde taç yerine kesintisiz altın bir güneş halkası.",
    "colors": [
      "#342943",
      "#d6b265"
    ],
    "symbol": "five-walls-sun",
    "history": [
      "Vaeranthlar tacın kudretini yalnız soyda değil, birbirinden farklı şehirlerin aynı yol ve erzak düzeninde tutulmasında arar. Beş kemer Valdareth’in beş surunu gösterir; en dış kemer de armanın içindedir. Saray bu işareti kullanırken yoksul dış mahallelerin talepleri de hanedanın kendi sözüyle karşısına çıkar.",
      "Caedren ile Isolde’nin çocukları Eryndorn ve Mirelda’dır. Eryndorn tahtta, Alisande kraliçe, Ilyenne halka açık meşru çocuktur. Bilinen erkek varis yoktur. Bu kayıt bilinmeyen çocuklar veya gelecekteki darbe hakkında hüküm vermez.",
      "Manorveil’in vergisi doğrudan taç hazinesine gider. Hanedan bir lordu atayabilir veya azledebilir; Elorwyn’in yerleşik soy geleneğiyle Marhalden’in seçim usulü, bu yetkinin her yerde aynı kolaylıkla uygulanmasını engeller."
    ],
    "relations": [
      {
        "houseId": "elorwynder",
        "nature": "Taç ve yerel gelenek",
        "description": "Taç lordu azledebilir; Elorwyn’in eski hanedan bağının değiştirilmesi ise askeri emirden daha geniş bir yerel tepki doğurabilir."
      },
      {
        "houseId": "mereth",
        "nature": "Sipariş ve vergi",
        "description": "Sarayın mor çatıları Dorvenhall ürününe dayanır. Yüksek sipariş aynı anda ücret, yakıt ve teslim yüküdür."
      },
      {
        "houseId": "veyl",
        "nature": "Hizmet yemini",
        "description": "Dranthol garnizonu taç hizmetindedir; Veyl aile çıkarı ile askeri görev ayrı hesap verir."
      }
    ],
    "crestId": "crest-vaeranth",
    "leaderId": "eryndorn"
  },
  {
    "id": "elorwynder",
    "region": "danstsud",
    "name": "Elorwynder Hanedanı",
    "seatId": "elorwyn",
    "leaderName": "Lord Tharion Elorwynder",
    "kind": "dynasty",
    "motto": "Işığı taşır, kapıyı tutarız.",
    "blazon": "Fildişi alanda altın delikli bir kandil; aşağısında iki lacivert kapı kanadı, kandilin ışığı ikisinin arasından geçer.",
    "colors": [
      "#e8dcc1",
      "#ad8d42"
    ],
    "symbol": "radiant-censer",
    "history": [
      "Elorwyn’in yönetici adı değişse de şehrin hanedan bağı Elorwynder olarak kalmıştır. Aile kendi geçmişini bir fetih sırasından çok kapı, okul ve tapınakların devamlılığıyla anlatır. Her nesil eski bağışı hatırlar; hangi mahallenin o bağıştan pay alamadığı ise aile tarihinin daha az söylenen kısmıdır.",
      "Tharion şimdiki yöneticidir. Kethra’daki Damian ve eşi Aveline aynı hanedanın liman çevresindeki koludur; Rook Valdenar Damian’ın oğludur. Farklı soyadının varlığı bu babalık bağını değiştirmez.",
      "Paladinler, rahipler ve ruhban okulları güçlüdür. Krallıkta ruhsatlı büyünün yasal olması Elorwyn’de gevşek denetim anlamına gelmez; hanedan sıkı yerel uygulamadan siyasi destek toplar. Ser Valerius’un rakip nüfuzu kamuya açık bir gerilimdir; gizli soylar burada açıklanmaz."
    ],
    "relations": [
      {
        "houseId": "vaeranth",
        "nature": "Taç ve yerel gelenek",
        "description": "Taç lordu azledebilir; Elorwyn’in eski hanedan bağının değiştirilmesi ise askeri emirden daha geniş bir yerel tepki doğurabilir."
      }
    ],
    "crestId": "crest-elorwynder",
    "leaderId": "tharion"
  },
  {
    "id": "mereth",
    "region": "danstsud",
    "name": "Mereth Hanesi",
    "seatId": "dorvenhall",
    "leaderName": "Lord Rovan Mereth",
    "kind": "house",
    "motto": "Ham taşı değil, emeği tart.",
    "blazon": "Çam yeşili alanda ortasından ince bir gümüş çizgiyle ayrılmış örs; iki yarının arasından tek mor kristal yükselir.",
    "colors": [
      "#24413b",
      "#baa6d8"
    ],
    "symbol": "split-anvil",
    "history": [
      "Merethler Dorvenhall’ın ocak gelirini yalnız çıkarılan tonla sayan eski usule karşı işlenmiş parçanın kıymetini savunarak büyüdü. Menekşespatının moru armanın ortasındadır; örsün ayrılmış görünmesi maden sahibiyle ustanın aynı kişi olmadığını hatırlatır.",
      "Rovan’ın çevresinde aile akrabaları kadar ücret, kalite ve teslim hesabı tutan bağımsız ustalar bulunur. Lordun siparişi atölyeye iş getirir; tek alıcıya fazla bağlanmak ise şehrin pazarlık gücünü azaltır.",
      "Dorvenhall korucuları ve dağ binekleri hanenin özel av süsü sayılmaz. Geçit güvenliği lordluk hizmetidir; ücretli korucuya aile kavgası için emir verilmesi yerel mecliste itiraz doğurur."
    ],
    "relations": [
      {
        "houseId": "vaeranth",
        "nature": "Sipariş ve vergi",
        "description": "Sarayın mor çatıları Dorvenhall ürününe dayanır. Yüksek sipariş aynı anda ücret, yakıt ve teslim yüküdür."
      },
      {
        "houseId": "korr",
        "nature": "Metal ve geçit",
        "description": "Dorvenhall üretimi ile Karlan geçidi birbirine ihtiyaç duyar; aynı cevher veya bütün gümrük geliri sayılmaz."
      }
    ],
    "crestId": "crest-mereth",
    "leaderId": "rovan-mereth"
  },
  {
    "id": "dhal",
    "region": "danstsud",
    "name": "Dhal Hanesi",
    "seatId": "lirendil",
    "leaderName": "Lord Averen Dhal",
    "kind": "house",
    "motto": "Dönen yol, sönmeyen ışık.",
    "blazon": "Gece mavisi alanda ince uzun fildişi fener; kaidesinde yarım altın kervan tekeri, ışığın iki dar çizgisi tekerin açık uçlarına iner.",
    "colors": [
      "#24384a",
      "#d4b879"
    ],
    "symbol": "beacon-wheel",
    "history": [
      "Dhal ailesinin ilk büyük ayrıcalığı bir şehri kuşatmakla değil, fener bakımına ayrılan geliri düzenli ulaştırmakla anılır. Denizcinin gördüğü ışık ile kara kervanının kullandığı teker aynı armada bu yüzden birleşir.",
      "Averen’in şehir lordluğu, ÇelikKalkan’ın Büyük Üstadı Sir Vardek’in makamından ayrıdır. Aile sivil kapıları, pazar düzenini ve yerel vergiyi yönetir; loncanın bütün üyelerini akraba veya şahsi maiyet sayamaz.",
      "Büyük kütüphane ve kıyı ticareti Dhal’ın saygınlığını artırır. Küçük şehrin liman geliri uğruna taşıyıcıların dinlenmesini kısmak, hanenin kendi yol sözüyle çelişebilecek sürekli bir baskıdır."
    ],
    "relations": [
      {
        "houseId": "theren",
        "nature": "Fener ve bilgi",
        "description": "Kütüphane, okul ve yol hizmeti için uzman değişimi yaparlar; okul ruhsatı lordluk beratının yerine geçmez."
      }
    ],
    "crestId": "crest-dhal",
    "leaderId": "averen-dhal"
  },
  {
    "id": "theren",
    "region": "danstsud",
    "name": "Theren Hanesi",
    "seatId": "theramis",
    "leaderName": "Lord Elyas Theren",
    "kind": "house",
    "motto": "Bilgi akar; hesap kalır.",
    "blazon": "Soluk kuvars alanda üç koyu mavi ince kule; aralarındaki tek damla, aşağıda açık bir çeşme çanağına iner.",
    "colors": [
      "#d9dedb",
      "#326b83"
    ],
    "symbol": "quartz-fountain",
    "history": [
      "Therenlerin aile defterleri büyü formüllerinden önce su hakkı, okul bağışı ve tamir borcuyla doludur. Kulelerin arasındaki damla, şehrin bilgisinin sokakta bir hizmete dönüşmesi gerektiği iddiasıdır.",
      "Elyas şehrin lordudur; lonca ve okulların ilmî makamları ona kendiliğinden ait değildir. Başbüyücü veya ruhsatlı usta, mesleki yetkisini aileden almaz. Haneye bağlı olmayan bir araştırmacı da hukuk içinde çalışabilir.",
      "Beyaz kuvars taş, mavi işlemeler ve açık avlular refahı gösterir. Bu görünümün bedeli başka yerlerdeki ocak, yakıt ve ücret hesaplarına dayanır; aile kentin özgürlük geleneğini yalnız zengin okul öğrencilerine tanırsa desteğini kaybeder."
    ],
    "relations": [
      {
        "houseId": "dhal",
        "nature": "Fener ve bilgi",
        "description": "Kütüphane, okul ve yol hizmeti için uzman değişimi yaparlar; okul ruhsatı lordluk beratının yerine geçmez."
      }
    ],
    "crestId": "crest-theren",
    "leaderId": "elyas-theren"
  },
  {
    "id": "korr",
    "region": "danstsud",
    "name": "Korr Hanesi",
    "seatId": "marhalden",
    "leaderName": "Edran Korr",
    "kind": "house",
    "motto": "Geçit tutulur, makam geçer.",
    "blazon": "Arduvaz alanda iki gümüş kapı kulesi; aralarından bölünmeden geçen buz mavisi bir nehir ve üstünde tek küçük bakır perçin.",
    "colors": [
      "#34424a",
      "#a6cbd0"
    ],
    "symbol": "twin-gate-river",
    "history": [
      "Korrlar Marhalden’in iş ve savunma çevrelerinde nüfuz kazanmış bir ailedir. Armadaki iki kule karşı kıyıları, aradan geçen su ise bir tarafın tek başına sahiplenemediği ortak ihtiyacı anlatır.",
      "Edran’ın lordluğu sekiz yıllık seçimle belirlenir; Korr soyadı makamı çocuklarına miras bırakmaz. Kazı, işleme ve satış kollarının seçimi ile tacın atama ve azil yetkisi birlikte yürür. Aile nüfuzunu koruyabilir, seçimi kaybedebilir.",
      "Kapanan mülteci kapıları, geçit güvenliği ve erzak hesabı Edran’ın güncel sorumluluklarıdır. Korr hanesinin refahı bu kararların bütün hanelere aynı yararı verdiğini kanıtlamaz. Ressa Korr ile bir akrabalık bağı bu yeni kayıtta kurulmaz."
    ],
    "relations": [
      {
        "houseId": "thol",
        "nature": "Seçim ve denge",
        "description": "Sekiz yıllık lordluk ile dört yıllık baş lonca görevi ayrı seçilir; haneler seçim çevrelerinde rakip veya ortak olabilir."
      },
      {
        "houseId": "mereth",
        "nature": "Metal ve geçit",
        "description": "Dorvenhall üretimi ile Karlan geçidi birbirine ihtiyaç duyar; aynı cevher veya bütün gümrük geliri sayılmaz."
      }
    ],
    "crestId": "crest-korr",
    "leaderId": "edran-korr"
  },
  {
    "id": "thol",
    "region": "danstsud",
    "name": "Thol Hanesi",
    "seatId": "marhalden",
    "leaderName": "Vessa Thol",
    "kind": "house",
    "motto": "Üç el, bir sağlam iş.",
    "blazon": "Bakır renkli alanda uçları birbirine değmeyen üç koyu demir maşa; ortalarındaki açık halka fildişi renktedir.",
    "colors": [
      "#94694f",
      "#26363c"
    ],
    "symbol": "three-tongs",
    "history": [
      "Thollar işleme kolundaki eski ortaklıklardan gelir. Üç maşanın tek bir kapalı demire dönüşmemesi, lonca içindeki denge iddiasıdır: aynı aile hem cevheri çıkaranın hem ustanın hem satıcının bütün kaydını tutmamalıdır.",
      "Vessa’nın baş lonca üyeliği dört yıllık seçimle yenilenir. Bu hane bir oy çevresidir; baş lonca makamı kalıtsal bir soyluluk değildir. Vessa ile lordun iki ayrı kıyıda çalışması kurumsal ayrılığı taşta görünür kılar.",
      "İyi işin bedelini savunmaları aileyi destekleyen ustalar yaratmıştır. Aynı tavır, daha ucuz ihracat isteyen satıcılarla aralarını açar. Thol’un eski borçları bir seçimde aile sözünden daha ağır gelebilir."
    ],
    "relations": [
      {
        "houseId": "korr",
        "nature": "Seçim ve denge",
        "description": "Sekiz yıllık lordluk ile dört yıllık baş lonca görevi ayrı seçilir; haneler seçim çevrelerinde rakip veya ortak olabilir."
      }
    ],
    "crestId": "crest-thol",
    "leaderId": "vessa-thol"
  },
  {
    "id": "veyl",
    "region": "danstsud",
    "name": "Veyl Hizmet Hanesi",
    "seatId": "dranthol",
    "leaderName": "Ser Garran Veyl",
    "kind": "house",
    "motto": "Fener açık, yemin ayakta.",
    "blazon": "Koyu kiremit alanda fildişi kare kule; kulenin altından geçen çelik renkli çapa kancası yukarı, ışığa doğru kıvrılır.",
    "colors": [
      "#633d37",
      "#c6c8bf"
    ],
    "symbol": "harbour-hook-tower",
    "history": [
      "Veyl adı bir Hardlane krallığına değil, taç hizmetine bağlanmıştır. Yeni iskan ve yatırım kanunları aileye gelirden önce sorumluluk getirdi: büyüyen limanın, kalenin ve fenerin açık tutulması.",
      "Garran’ın Dranthol komutanlığı kraliyet görevidir. Aile arması kışlada bulunabilir; garnizon askeri Veyl’in özel mülkü değildir. Makamdan ayrılırsa aynı askerler onun şahsi davasını izlemek zorunda kalmaz.",
      "Dranthol’un yüksek güvenliği korsan gelirini başka iskelelere itti. Hane disiplininin başarısı bir tüccarın şehre neden gelmediği sorusunu cevaplamaz. Veyller güvenlikle geçim arasındaki bu dar aralıkta nüfuz kurar."
    ],
    "relations": [
      {
        "houseId": "vaeranth",
        "nature": "Hizmet yemini",
        "description": "Dranthol garnizonu taç hizmetindedir; Veyl aile çıkarı ile askeri görev ayrı hesap verir."
      }
    ],
    "crestId": "crest-veyl",
    "leaderId": "garran-veyl"
  },
  {
    "id": "nemesh",
    "region": "xotar",
    "name": "Nemesh Su Hanesi",
    "seatId": "zarim-khet",
    "leaderName": "Sahira Nemesh",
    "kind": "house",
    "motto": "Dolu kapta da payı gör.",
    "blazon": "Kum taşı alanda aynı seviyede duran iki turkuaz su kabı; aralarında ince koyu bir fitil, yukarıda küçük açık bir halka.",
    "colors": [
      "#bd9a63",
      "#2a7271"
    ],
    "symbol": "balanced-water-bowls",
    "history": [
      "Nemeshlerin eski işi kap üretimi ve su hesabıdır. Aile, kuraklıkta tuttuğu karşılıklı borçları kuyu meclislerinde açık okuyarak güç kazandı. İki eşit kap, bütün kuyu sahiplerinin eşit serveti değil, aynı ölçüyle dinlenme hakkını temsil eder.",
      "Sahira yerel su ihtilafları hakemidir; bu kayıtta ona bütün Xotar’ın tacı verilmez. Hanenin sözü açık karar tutma geleneğinden gelir. Kendi akrabalarının öncelik talebini reddetmiş olması aile içinde kapanmış bir hesap değildir.",
      "Kuyunun güvenliği için katkı verirler, fakat su payını değiştirmekle muhafız sevk etmek ayrı yetkilerdir. Nemesh adına verilen ücret, bir hakemin hükmünü satın alma hakkı yaratmaz."
    ],
    "relations": [
      {
        "houseId": "vekk",
        "nature": "Ölçü ve borç",
        "description": "Açık su hakkı, pahalı fakat açık kredi şartıyla çatışabilir. Aile yakınlığı hakem kararını satın alamaz."
      }
    ],
    "crestId": "crest-nemesh",
    "leaderId": "sahira-nemesh"
  },
  {
    "id": "vekk",
    "region": "xotar",
    "name": "Vekk Hanesi",
    "seatId": "qal-nashar",
    "leaderName": "Rahim Vekk",
    "kind": "house",
    "motto": "Uzak yük, yakın hesap.",
    "blazon": "Koyu erik alanda yatay ince altın terazi; bir kefesinde ipek mekiki, ötekinde tek açık tohum.",
    "colors": [
      "#50354c",
      "#d0b36e"
    ],
    "symbol": "silk-scale",
    "history": [
      "Vekkler beklemeyi bir servet biçimine çevirdi. Rahim geciken yüklerin alacağını satın aldığında kurtardığı atölyeler açık kaldı, fakat üretimlerini yıllarca düşük bedelle vermek zorunda kaldı.",
      "Hanenin gücü resmî taht veya rahiplikten gelmez. Kredi, depo ve kervan payları sayesinde bir seferin başlayıp başlayamayacağını etkiler. Bu güç, mecliste asker sayısından önce konuşabilir.",
      "Bir ailenin borçla satın aldığı güvence başka bir ailenin kışlık gelirini daraltabilir. Vekkler şartlarını saklamamakla övünür; kıtlıkta imzalanmış açık bir sözleşmenin ne kadar özgür olduğu Xotar’daki rakiplerinin temel itirazıdır."
    ],
    "relations": [
      {
        "houseId": "nemesh",
        "nature": "Ölçü ve borç",
        "description": "Açık su hakkı, pahalı fakat açık kredi şartıyla çatışabilir. Aile yakınlığı hakem kararını satın alamaz."
      },
      {
        "houseId": "khoss",
        "nature": "Yol sözleşmesi",
        "description": "Muhafız insan kurtarmak için yük bırakabileceğini baştan söyler; simsar kayıp yükün borcunu ayrıca arar."
      }
    ],
    "crestId": "crest-vekk",
    "leaderId": "rahim-vekk"
  },
  {
    "id": "khoss",
    "region": "xotar",
    "name": "Khoss Yol Hanesi",
    "seatId": "thariz",
    "leaderName": "Daren Khoss",
    "kind": "house",
    "motto": "Yük döner; yoldaş kalır.",
    "blazon": "Soluk kızıl alanda üç kez düğümlenmiş koyu bir ip; ipin altında iki ince kum çizgisi ve ortada tek geniş ayak izi.",
    "colors": [
      "#a66d56",
      "#303c43"
    ],
    "symbol": "dune-knot",
    "history": [
      "Khoss ailesi yol ortaklıkları ve muhafızlık çevresinde büyüdü. Bir tüccarın mallarını bırakıp işçileri döndürmek için verilen eski karar aileyi hem pahalı hem güvenilir kıldı.",
      "Daren’in kaptanlığı bir şehir hükümdarlığı değildir. Birlikte yürüdüğü muhafızlar sözleşme ve meslek yeminiyle bağlıdır; kapı askerinin emrine el koyamaz. Bir vaha naibine hizmet verirken de ücret ile vergi ayrı tutulur.",
      "Yol hanesinin mirası bir kılıçtan çok güvenilir dinlenme yerlerinin bilgisidir. Bu bilgi bir kere aşırı ücret için saklandığında, bir sonraki kervanın Khoss adına duyduğu güven de aşınır."
    ],
    "relations": [
      {
        "houseId": "vekk",
        "nature": "Yol sözleşmesi",
        "description": "Muhafız insan kurtarmak için yük bırakabileceğini baştan söyler; simsar kayıp yükün borcunu ayrıca arar."
      }
    ],
    "crestId": "crest-khoss",
    "leaderId": "daren-khoss"
  },
  {
    "id": "senn",
    "region": "murgul",
    "name": "Senn İskele Hanesi",
    "seatId": "morihael",
    "leaderName": "Ilvara Senn",
    "kind": "house",
    "motto": "Aynı kıyıya başka seslerle.",
    "blazon": "Derin deniz yeşili alanda uçları birbirini geçmeden birleşen iki fildişi kürek; aralarında üç bakır yuvarlak.",
    "colors": [
      "#244f51",
      "#d9d3bc"
    ],
    "symbol": "joined-oars",
    "history": [
      "Sennlerin ilk ortaklığı farklı diller konuşan üç iskelede aynı yük tesliminin tanınmasıyla kuruldu. Küreklerin birleştiği noktadaki üç işaret aile masasında her tarafın ayrı sandalyesi bulunduğunu hatırlatır.",
      "Ilvara liman toplantısı sözcüsüdür. Bir milyonluk Morihael’in bütün iradesi tek aileye ait değildir; sözcülüğü işçi, gemici ve depo ortaklarının itirazıyla her gün sınanır.",
      "Aile ana limandaki nüfuzunu küçük ada ortaklarına dayatmaya çalıştığında Azja ocaklarının ve dış iskelelerin desteğini kaybedebilir. Senn sözü bir merkez kurar, diğer halkları tek sese çevirmeyi vaat etmez."
    ],
    "relations": [
      {
        "houseId": "azhal",
        "nature": "Kent ve göç",
        "description": "İskele oyu ile ata ocağının bakım yükü ortak bir başkentte buluşur, her gelen aynı aile adına konuşmaz."
      },
      {
        "houseId": "nahl",
        "nature": "Bakım ve ücret",
        "description": "Tersanenin kapanması bütün limanı etkiler; bu bağımlılık işçi ücretini tek taraflı kısmayı tartışmasız kılmaz."
      }
    ],
    "crestId": "crest-senn",
    "leaderId": "ilvara-senn"
  },
  {
    "id": "azhal",
    "region": "murgul",
    "name": "Azhal Kök Ocağı",
    "seatId": "morihael",
    "leaderName": "Torren Azhal",
    "kind": "clan",
    "motto": "Kök suyu unutmaz.",
    "blazon": "Soluk kabuk alanda açık bir midye biçiminin içinden aşağı ve yana uzanan üç kök; köklerin arasında koyu yeşil boşluk.",
    "colors": [
      "#d1c6ac",
      "#375a4b"
    ],
    "symbol": "root-shell",
    "history": [
      "Azhal ocağı kaybolan denizcilerin adını tutan ailelerin ortak geleneğinden doğdu. Arma bir kıtayı sahiplenmez; uzak adalardan getirilen insanların aynı anma yerinde kök salmasını anlatır.",
      "Torren’in ata ocağındaki görevi liman yönetiminin yerini almaz. Aile ve evlatlık bağları güçlüdür, fakat bir haneye katılmak kişinin bütün inanç veya dilini bırakmasını gerektirmez.",
      "Büyük başkentin göçü, ocağa her yıl yeni anma ve bakım yükü getirir. Eski ailelerle yeni gelenlerin aynı payı alıp almayacağı, Azhal adının duygusal saygınlığını gerçek bir idare sorusuna dönüştürür."
    ],
    "relations": [
      {
        "houseId": "senn",
        "nature": "Kent ve göç",
        "description": "İskele oyu ile ata ocağının bakım yükü ortak bir başkentte buluşur, her gelen aynı aile adına konuşmaz."
      }
    ],
    "crestId": "crest-azhal",
    "leaderId": "torren-azhal"
  },
  {
    "id": "nahl",
    "region": "murgul",
    "name": "Nahl Omurga Hanesi",
    "seatId": "morihael",
    "leaderName": "Kevar Nahl",
    "kind": "house",
    "motto": "Denizi tahta taşır.",
    "blazon": "Gece mavisi alanda yelpaze gibi açılmış beş bakır gemi postası; üstlerinde küçük tek fildişi yıldız.",
    "colors": [
      "#263a50",
      "#b58159"
    ],
    "symbol": "keel-star",
    "history": [
      "Nahlların itibarını kıtlıkta bile kuru tutabildikleri kızaklar kurdu. Onarılmış bir omurga yeni gemiden ucuzdu; ailenin tersanesi bu farkı hem iş hem borç ağına çevirdi.",
      "Kevar bir tersane paydaşıdır. Donanma onun atölyesine bağımlı olabilir, ama amiralin sevk yetkisi aileden gelmez. Ücretli işçilerin düşürülmüş payları hane zenginliğinin tartışmalı bedelidir.",
      "Büyük Morihael nüfusu deniz yoluna dayanır. Nahl hanesi tersaneleri durdurmanın yalnız savaş gemilerini değil tahıl, odun ve içme suyu araçlarının bakımını da aksattığını bilir; bu bilgiyi siyasi baskı için kullanması diğer haneleri bir araya getirir."
    ],
    "relations": [
      {
        "houseId": "senn",
        "nature": "Bakım ve ücret",
        "description": "Tersanenin kapanması bütün limanı etkiler; bu bağımlılık işçi ücretini tek taraflı kısmayı tartışmasız kılmaz."
      }
    ],
    "crestId": "crest-nahl",
    "leaderId": "kevar-nahl"
  },
  {
    "id": "ylse",
    "region": "honud",
    "name": "Ylse Söz Ocağı",
    "seatId": "norrvar",
    "leaderName": "Haldrun Ylse",
    "kind": "clan",
    "motto": "Söz taşınır, yurt bekler.",
    "blazon": "Buz grisi alanda açık hilal biçimli bir taş; kenarında on beş koyu çentik, ortasında sönmemiş küçük bakır nokta.",
    "colors": [
      "#c1cccd",
      "#3f555e"
    ],
    "symbol": "fifteen-notches",
    "history": [
      "Ylse ocağı Norrvar kıyı çevresindeki sözlü öğretinin taşıyıcılarındandır. On beş çentik Honud’un kule geleneğini anımsatır; her çentik bugün içinde insan yaşayan bir kuleyi göstermez.",
      "Haldrun’un öğrencileri artık kıyı sığınaklarında aynı anlatıyı birbirlerinin eksiğini tamamlayarak söyler. Eski okul adı bir adres olmaktan çok göçen kayıt zincirinin adıdır. Norrvar yaşayan bir kıyı merkezidir; buraya ulaşan öğretinin iç ülkedeki eski kulelerinin hâlâ dolu olduğu ileri sürülmez.",
      "Hane, Ardzenor’a ilişkin farklı inançları aynı ezber içinde tekleştirmeye çalışmaz. Soğuğun ne zaman başladığını unutmamak ile niçin başladığını kesin bildiğini söylemek arasında bir sınır tutar."
    ],
    "relations": [
      {
        "houseId": "voss",
        "nature": "Söz ve stok",
        "description": "Kıyıya taşınan öğretinin kışı geçirmesi yiyecek payına bağlıdır; eski şöhret yeni ambarı doldurmaz."
      }
    ],
    "crestId": "crest-ylse",
    "leaderId": "haldrun-ylse",
    "seatName": "Norrvar’ın kıyıya taşınan söz ocağı"
  },
  {
    "id": "voss",
    "region": "honud",
    "name": "Voss Kış Hanesi",
    "seatId": "frostheimr",
    "leaderName": "Eyrik Voss",
    "kind": "clan",
    "motto": "Son pay da paydır.",
    "blazon": "Donuk mavi alanda yarısı görünen soluk güneş; altında kapalı küçük bir ambar ve kapısında tek bakır çizgi.",
    "colors": [
      "#3d5f72",
      "#d3c7a4"
    ],
    "symbol": "half-sun-granary",
    "history": [
      "Vossların eski ambar işareti, Honud’un her mevsim aynı beyaza kapanmadığı zamanlardan kalır. Bugün başak değil kapalı kapı taşırlar; zenginlik hasattan çok korunmuş stoktur.",
      "Eyrik kıyı ambarlarının payını düzenler. Frostheimr adıyla tutulan eski aile kayıtları korunur; yeni dağıtım kıyı depolarında yapılır. İçerideki eski yerleşimin evlerine sabit nüfus yazılmaz.",
      "Kendi yakınlarının kaybını önce telafi etmesi aileyi hem korudu hem kuşku altında bıraktı. Kış halkasının lideri olmanın bedeli, son pay verildiğinde de hesabı açık bırakmaktır."
    ],
    "relations": [
      {
        "houseId": "ylse",
        "nature": "Söz ve stok",
        "description": "Kıyıya taşınan öğretinin kışı geçirmesi yiyecek payına bağlıdır; eski şöhret yeni ambarı doldurmaz."
      },
      {
        "houseId": "nel",
        "nature": "Av ve pay",
        "description": "Avcıların kaybı ortak dağıtımı daraltır; ambar payı tek bir ailenin kaybını örtmek için gizlice değiştirilemez."
      }
    ],
    "crestId": "crest-voss",
    "leaderId": "eyrik-voss",
    "seatName": "Frostheimr kıyı depoları"
  },
  {
    "id": "nel",
    "region": "honud",
    "name": "Nel Kıyı Klanı",
    "seatId": "frostheimr",
    "leaderName": "Sigrun Nel",
    "kind": "clan",
    "motto": "Kıyı dar; yemin geniş.",
    "blazon": "Koyu arduvaz alanda sola eğilen tek çatallı boynuz; altından ince bir kayık çizgisi geçer.",
    "colors": [
      "#354850",
      "#b9c5bb"
    ],
    "symbol": "shore-antler",
    "history": [
      "Nellerin göç hikâyesi bir büyük savaşla değil, her yıl biraz daha doğuya alınan kış eşiğiyle anlatılır. Boynuz avı, kayık ise geri dönmeyi gösterir; biri ötekinden değerli sayılmaz.",
      "Sigrun av rehberidir ve kıyı kolunun deneyimli sözcülerindendir. Skjornhvaldr eski bağın adıdır; güncel halk güvenli kıyı şeritlerinde barınır. Kaldryss kayıkçılarıyla evlilik ve ortak av anlaşmaları sürer.",
      "İç kesime gönderilen küçük arama ekipleri hanenin yeni yurt fethetmesi sayılmaz. Dönmeyenleri aramakla yaşayanları riske atmak arasındaki sınır, her kış sözcünün yeniden cevaplamak zorunda olduğu sorudur."
    ],
    "relations": [
      {
        "houseId": "voss",
        "nature": "Av ve pay",
        "description": "Avcıların kaybı ortak dağıtımı daraltır; ambar payı tek bir ailenin kaybını örtmek için gizlice değiştirilemez."
      }
    ],
    "crestId": "crest-nel",
    "leaderId": "sigrun-nel",
    "seatName": "Skjornhvaldr adını koruyan kıyı kolları"
  },
  {
    "id": "volgar",
    "region": "garmirk",
    "name": "Volgar Klanı",
    "seatId": "baldrek",
    "leaderName": "Torgal Hravik Volgar",
    "kind": "clan",
    "motto": "Yüksek dur, boş övünme.",
    "blazon": "Koyu duman alanda iki gümüş dağ ucu; aralarına dik inen kısa bakır çekiç, tepesinde açık boşluk.",
    "colors": [
      "#3b4246",
      "#c09b6b"
    ],
    "symbol": "split-mountain-hammer",
    "history": [
      "Volgarlar yüksek geçitlerdeki ortak nöbetlerle itibar kazandı. Çekiç bir kralın asası değil, kardaki yolu açık tutan emeğin işaretidir. Her yeni Torgal meclise önce o yıl tutulabilen geçitlerin hesabını getirir.",
      "Hravik yeni yazımda klanın güncel Torgalıdır. Örsün önündeki yemini aile büyüklerinin ve ocak temsilcilerinin tanıklığıyla alır. Soyunun adı aday çıkarır; başarısız bir liderin ömür boyu kalmasını tek başına sağlamaz.",
      "Demir Meclisi’nde büyük birlik isterken Rudmar madenlerinin iaşesine muhtaçtır. Dağdan gelen gurur, aşağıdan gelen erzağı küçümserse Volgar nöbeti de kısalır."
    ],
    "relations": [
      {
        "houseId": "rudmar",
        "nature": "Geçit ve ocak",
        "description": "Nöbet için çelik ve erzak, ocak için açık geçit gerekir; iki klanın ortak askeri iki kez sayılmaz."
      },
      {
        "houseId": "skarv",
        "nature": "Hava ve komuta",
        "description": "Hava işareti seferin hızını sınırlar; büyük klanın emri fırtınayı yenmez."
      }
    ],
    "crestId": "crest-volgar"
  },
  {
    "id": "rudmar",
    "region": "garmirk",
    "name": "Rudmar Klanı",
    "seatId": "stoneclans",
    "leaderName": "Torgal Edda Rudmar",
    "kind": "clan",
    "motto": "Derine inen sözü uzatmaz.",
    "blazon": "Pas kızılı alanda koyu halka biçimli bir kuyu ağzı; içinden yükselen tek gümüş taş keskisi.",
    "colors": [
      "#7a4c41",
      "#c3c4b8"
    ],
    "symbol": "deep-chisel",
    "history": [
      "Rudmarların tünelleri katman katman aile borcu ve ustalıkla açıldı. Klan bir cevher damarını bulmayı sahip olmanın tek gerekçesi saymaz; tahkimatını ve havalandırmasını sürdürebilmek de hak iddiasının parçasıdır.",
      "Edda, maden sahipleriyle kazıcı ocaklarının ayrı tanıklık verdiği toplantıda seçildi. Torgal olarak asker çağırabilir; ocak kapısını süre sınırı olmadan kapatarak bütün işçiyi silahlı maiyete çeviremez.",
      "Bregin taş ustalarıyla ortak tahkimat işleri yürütürler. Silah satışı kesildiğinde bile nefes bacalarının onarımını sürdürmek, Rudmarların komşularından beklediği en eski yükümlülüktür."
    ],
    "relations": [
      {
        "houseId": "volgar",
        "nature": "Geçit ve ocak",
        "description": "Nöbet için çelik ve erzak, ocak için açık geçit gerekir; iki klanın ortak askeri iki kez sayılmaz."
      }
    ],
    "crestId": "crest-rudmar"
  },
  {
    "id": "tahrin",
    "region": "garmirk",
    "name": "Tahrin Klanı",
    "seatId": "baldrek",
    "leaderName": "Torgal Sorna Tahrin",
    "kind": "clan",
    "motto": "Yankımız geri döner.",
    "blazon": "Soluk kireç alanda birbirine bakmayan iki demir kıvrık boynuz; ortada küçük bakır tokmak.",
    "colors": [
      "#d0c9b5",
      "#66524a"
    ],
    "symbol": "ram-spiral",
    "history": [
      "Tahrinler dağ otlakları ve ortak dövüm çevresinde yaşamış birçok kolu bir arada tutar. Boynuzların dışa dönmesi, klanın yalnız kendi sofrasına bakmaması gerektiği şeklinde yorumlanır.",
      "Sorna’nın Torgallığı yeni yazımdır; Borrak Tahr gibi mevcut ocak temsilcilerinin görevini ortadan kaldırmaz. Temsilci, usta ve klan lideri aynı aile geçmişinden gelseler bile farklı sorumluluk taşırlar.",
      "Yemin Şarkıcıları bir anlaşmazlığın iki tarafını da ezberler. Tahrin adına verilen sözün farklı anlatılarını susturmak, geçmişte övünülen açıklığı da zayıflatır."
    ],
    "relations": [
      {
        "houseId": "bregin",
        "nature": "Yemin ve onarım",
        "description": "Taş sözleşmesinin iki anlatısı da saklanır; bir kuşatmadan sonra onarım borcu savaş şarkısında kaybolmaz."
      }
    ],
    "crestId": "crest-tahrin"
  },
  {
    "id": "bregin",
    "region": "garmirk",
    "name": "Bregin Klanı",
    "seatId": "stoneclans",
    "leaderName": "Torgal Veyda Bregin",
    "kind": "clan",
    "motto": "Taşın sesi bize yeter.",
    "blazon": "Mavi gri alanda dört köşeli taş çan; içinde aşağı sarkan küçük açık renkli dil.",
    "colors": [
      "#50616c",
      "#c5b69c"
    ],
    "symbol": "stone-bell",
    "history": [
      "Breginler kalelerdeki erken uyarı çanlarını ve dağ geçidi sığınaklarını onaran ocaklarla anılır. Bir kuşatma geçtikten sonra kalan kuleyi yeniden kullanılabilir kılmak da bir zafer sayılır.",
      "Veyda’nın hanesi meclis borçlarını yapı işiyle öder. Bunun getirdiği bilgi, başka klanların duvarlarının zayıf yerlerini bilmesidir. Bu bilgiyi kişisel üstünlük için saklamak aileye kısa kazanç, uzun güvensizlik getirir.",
      "Rudmar ile ortak işleri, Volgar ile nöbet anlaşmaları vardır. Torgalın taş mührü yalnız asker çağrısında değil, geri gönderilen ustanın ücretinde de geçer."
    ],
    "relations": [
      {
        "houseId": "tahrin",
        "nature": "Yemin ve onarım",
        "description": "Taş sözleşmesinin iki anlatısı da saklanır; bir kuşatmadan sonra onarım borcu savaş şarkısında kaybolmaz."
      }
    ],
    "crestId": "crest-bregin"
  },
  {
    "id": "skarv",
    "region": "garmirk",
    "name": "Skarv Klanı",
    "seatId": "stoneclans",
    "leaderName": "Torgal Ornek Skarv",
    "kind": "clan",
    "motto": "Rüzgâr geçer, çivi tutar.",
    "blazon": "Koyu çivit alanda hafif eğri tek gümüş çivi; etrafında birbirine kapanmayan dört soluk rüzgâr kıvrımı.",
    "colors": [
      "#303b56",
      "#b9c4c4"
    ],
    "symbol": "wind-nail",
    "history": [
      "Skarvlar fırtına yönünü ve dağın güvenilmez saatini okumakla öne çıkar. Armadaki eğri çivi yenilmemişlik övüncü değildir; doğru aleti geri bulup yeniden kullanma alışkanlığını gösterir.",
      "Ornek’in sözü, haber getiren izcilerinin dönme oranıyla ölçülür. Klan, yanlış hava işareti veren genci tek hatada dışarı atarsa kimsenin bir daha belirsizliği söylemeyeceğini bilir.",
      "Küçük ve hareketli birlikleri büyük klanların nöbetine eklenir. Bu eklenen birlikler sefer hesabında hem Skarv hem ev sahibi klan askeri olarak iki defa sayılmaz."
    ],
    "relations": [
      {
        "houseId": "volgar",
        "nature": "Hava ve komuta",
        "description": "Hava işareti seferin hızını sınırlar; büyük klanın emri fırtınayı yenmez."
      }
    ],
    "crestId": "crest-skarv"
  },
  {
    "id": "tavren",
    "region": "ariki",
    "name": "Tavren Klanı",
    "seatId": "twinclans",
    "leaderName": "Ossan Tavren",
    "kind": "clan",
    "motto": "Bağladığımız yolu açarız.",
    "blazon": "Deniz yeşili alanda üçgen katlanmış fildişi yelken; dibinde açık bir halat düğümü.",
    "colors": [
      "#2c6262",
      "#d7d0b6"
    ],
    "symbol": "sail-knot",
    "history": [
      "Tavrenler yük anlaşmalarını adaların birbirine bağımlılığını saklamadan yapar. Bir ada fazla tahıl, öteki sağlam kereste getirdiğinde ortak seferin kârı tek limana yazılmaz.",
      "Ossan klanlar arası yük hakemidir. Hanenin yüzü olması onu bütün Ariki’nin kalıtsal kralı yapmaz. Liderler diğer klanların katıldığı seçimle belirlenir; aile geçmişi oy ararken bir destek, tek başına berat değildir.",
      "Morrik nöbetine düzenli katkı verirler; Eryth kayıtlarının açılmasını da isterler. Başkasının defterinde görmek istedikleri açıklığı kendi sözleşmelerinde tutmaları, Tavren saygınlığının zor sınavıdır."
    ],
    "relations": [
      {
        "houseId": "morrik",
        "nature": "Ticaret ve koruma",
        "description": "Daha çok refakat daha çok ücret, yem ve nöbet ister. Koruma sözü donanmayı aynı anda her koya göndermez."
      }
    ],
    "crestId": "crest-tavren",
    "leaderId": "ossan-tavren"
  },
  {
    "id": "morrik",
    "region": "ariki",
    "name": "Morrik Klanı",
    "seatId": "northpact",
    "leaderName": "Yaren Morrik",
    "kind": "clan",
    "motto": "Kırılan dalga, tutulan kıyı.",
    "blazon": "Duman mavisi alanda suya doğru uzanan üç uçlu fildişi dalgakıran; önünde dar bakır bir yatay çizgi.",
    "colors": [
      "#3a5664",
      "#d4cbb3"
    ],
    "symbol": "breakwater-fork",
    "history": [
      "Morrikler liman nöbeti ve ortak savunma geleneğiyle bilinir. Dalgakıranın üç kolu ayrı koylardan aynı savunmaya gelmeyi anlatır; bir adanın ötekini ilhak etmesinin işareti değildir.",
      "Yaren’in kaptanlığı yerel liman hizmetidir. Sefer için seçilen yüksek komutan ayrı yetki alır ve süre sonunda onu geri verir. Kaptanın ailesi, savaş bittiğinde olağan vergi oranını tek taraflı belirleyemez.",
      "Tavrenlerin daha ucuz koruma talebiyle her mevsim tartışırlar. Birlikleri bütün ticari tekneye aynı anda refakat edemez; hangi seferin önce korunacağı açık bir meclis konusu olur."
    ],
    "relations": [
      {
        "houseId": "tavren",
        "nature": "Ticaret ve koruma",
        "description": "Daha çok refakat daha çok ücret, yem ve nöbet ister. Koruma sözü donanmayı aynı anda her koya göndermez."
      }
    ],
    "crestId": "crest-morrik",
    "leaderId": "yaren-morrik"
  },
  {
    "id": "eryth",
    "region": "ariki",
    "name": "Eryth Klanı",
    "seatId": "eldrascar",
    "leaderName": "Delia Eryth",
    "kind": "clan",
    "motto": "Gelen dalga bir iz bırakır.",
    "blazon": "Soluk gri alanda açılmış mavi kayıt rulosu; ortasında yazı yerine sarmal bir deniz kabuğu.",
    "colors": [
      "#cfcebf",
      "#3d7082"
    ],
    "symbol": "tide-scroll",
    "history": [
      "Erythlerin en değerli mirası birbirini düzeltebilen iki seyir nüshasıdır. Gemilerin dönüşü, elçilik sözleri ve kayıp malların hesabı aile sofralarında ayrı ayrı okunur.",
      "Delia deniz kayıtları elçisidir. Bilgi taşımak başka klanın kararını onun yerine vermek değildir. Sırf bir nüshayı tuttuğu için liman mülkiyeti veya donanma komutası kazanmaz.",
      "Valren ortaklıklarıyla adalar arası haber taşırlar. Bilgi geç kaldığında Eryth yalnız kâtibini değil, haberi taşımak için ne kadar tekne ve ücret ayırdığını da açıklamak zorundadır."
    ],
    "relations": [
      {
        "houseId": "valren",
        "nature": "Haber ve kefalet",
        "description": "Haber taşımakla başka ada adına karar vermek ayrı işlerdir; evlilik anlaşmaları kayıtların açıklığıyla sınanır."
      }
    ],
    "crestId": "crest-eryth",
    "leaderId": "delia-eryth"
  },
  {
    "id": "valren",
    "region": "ariki",
    "name": "Valren Klanı",
    "seatId": "twinclans",
    "leaderName": "Sözcü Alwen Valren",
    "kind": "clan",
    "motto": "Altı kıyı, açık bir söz.",
    "blazon": "Derin petrol alanda halka oluşturan altı açık renkli ada taşı; iki taş arasından geçen tek bakır bağ.",
    "colors": [
      "#244c54",
      "#d2b680"
    ],
    "symbol": "six-island-ring",
    "history": [
      "Valrenler adalar arası evlilik, konaklama ve karşılıklı kefalet ilişkileriyle büyüdü. Altı taş Ariki’nin anlatılan altı adasını gösterir; haritadaki üç yerleşimin yerine yeni şehir noktası koymaz.",
      "Alwen bu dönemin yeni yazılmış klan sözcüsüdür. Her ailenin oyunu buyuran tek hanedan başı yoktur. Büyük anlaşmaların küçük kıyı ortaklarına nasıl aktarılacağı Valrenlerin asıl siyasetidir.",
      "Diğer üç büyük klanın güçleri arasındaki aralıkta arabuluculuk ederler. Arabulucunun her zaman tarafsız sayılması, aile evliliklerinin getirdiği çıkarları görünmez kılabileceği için sıkça eleştirilir."
    ],
    "relations": [
      {
        "houseId": "eryth",
        "nature": "Haber ve kefalet",
        "description": "Haber taşımakla başka ada adına karar vermek ayrı işlerdir; evlilik anlaşmaları kayıtların açıklığıyla sınanır."
      }
    ],
    "crestId": "crest-valren"
  },
  {
    "id": "vahen",
    "region": "gurbin",
    "name": "Vahen Klanı",
    "seatId": "hurnreach",
    "leaderName": "Klanbaşı Avaren Vahen",
    "kind": "clan",
    "motto": "Gölge de kıyımızdır.",
    "blazon": "Koyu şarap alanda yandan görülen tek obsidyen göz; altından dik geçen açık renkli küreğin ucunda küçük bakır halka.",
    "colors": [
      "#4f303d",
      "#bcb9ab"
    ],
    "symbol": "shadow-eye-oar",
    "history": [
      "Vahen adı hem bir kültürel öğretiyi hem belirli bir klanı anlatabildiği için anlaşmalarda hangi anlamın kastedildiği yazılır. Bütün Vahen inananları bu ailenin siyasi maiyeti değildir.",
      "Avaren’in klanbaşılığı yeni yazımdır. Kendi limanına güçlü emir verir; diğer klanların kaptanlarını ancak açık sefer andıyla ortak komutaya alır. Hurnreach’in büyüklüğü tek başına Gurbin krallığı kurmaz.",
      "Bralk hızlı deniz gücünü, Tarn kayıt ve borç ilişkisini, Kryss ise gizli geçiş bilgilerini korur. Vahen bunların hepsini aynı masaya çağırabilecek kadar güçlü olmak ister; bu masa emir kadar pazarlık da gerektirir."
    ],
    "relations": [
      {
        "houseId": "bralk",
        "nature": "Ortak sefer",
        "description": "Hızlı gemi kaptanları yalnız üzerinde uzlaşılan sefer süresince ortak komutaya girer."
      }
    ],
    "crestId": "crest-vahen"
  },
  {
    "id": "bralk",
    "region": "gurbin",
    "name": "Bralk Klanı",
    "seatId": "hurnreach",
    "leaderName": "Vraska Bralk",
    "kind": "clan",
    "motto": "Önce dalgaya varırız.",
    "blazon": "Koyu deniz mavisi alanda ileri eğilmiş gümüş yüzgeç; arkasında kısa üç bakır dalga ucu.",
    "colors": [
      "#293f53",
      "#b6c4c5"
    ],
    "symbol": "swift-fin",
    "history": [
      "Bralkların gemileri ağır yükten çok hız ve kıyı geçişi için yapılır. Arma bir deniz canavarını değil, suyu keserken az yüzey gösteren yüzgeci taşır.",
      "Vraska hızlı kıyı gemisi kaptanıdır ve hanenin tanınan yüzüdür. Bütün klanın tek hükümdarı olarak ilan edilmez; ortak kaptan toplantısında güçlü bir oya sahiptir.",
      "Kaçak sefer ile meşru kıyı refakati arasındaki sınır her limanda aynı değildir. Bralk adına tutulan bir söz, ücretli kaptanın başkasına verdiği sözü otomatik olarak geçersiz kılmaz."
    ],
    "relations": [
      {
        "houseId": "vahen",
        "nature": "Ortak sefer",
        "description": "Hızlı gemi kaptanları yalnız üzerinde uzlaşılan sefer süresince ortak komutaya girer."
      }
    ],
    "crestId": "crest-bralk",
    "leaderId": "vraska-bralk"
  },
  {
    "id": "tarn",
    "region": "gurbin",
    "name": "Tarn Klanı",
    "seatId": "kraenfall",
    "leaderName": "Nesren Tarn",
    "kind": "clan",
    "motto": "Kapalı kabuk, açık hesap.",
    "blazon": "Mat bronz alanda iki yarısı tam kapanmış koyu kabuk; alt kenarında sola dönen fildişi kısa anahtar.",
    "colors": [
      "#a08256",
      "#363c43"
    ],
    "symbol": "closed-shell-key",
    "history": [
      "Tarnlar bir tekne kaybının birden fazla aileyi batırmasını önleyen kefalet ağlarıyla nüfuz kurdu. Aynı ağ, borcun kuşaktan kuşağa taşındığı sert sözleşmeler de üretti.",
      "Nesren’in mevcut kayıt ve borç işi bu hane içindeki özel yetkisidir; yüzünü aile armasıyla birlikte görmek onu bütün limanın hakimi yapmaz. Klanbaşılık ve hesapçılık ayrı usulle belirlenebilir.",
      "Vahen ortak sefere daha çok kredi isterken Tarn ödeme takvimi ister. Savaşın adı büyük olsa da o yıl hangi hanenin teknesinin onarılacağı kararını bu küçük tarihler belirler."
    ],
    "relations": [
      {
        "houseId": "kryss",
        "nature": "Borç ve yol bilgisi",
        "description": "Kredinin vadesi ile haberin zamanı ticareti belirler; ikisi tek klanın kalıcı tekeline dönüştürülmek istendiğinde itiraz büyür."
      }
    ],
    "crestId": "crest-tarn",
    "leaderId": "nesren-tarn"
  },
  {
    "id": "kryss",
    "region": "gurbin",
    "name": "Kryss Klanı",
    "seatId": "volriks-maw",
    "leaderName": "Sözcü Morvek Kryss",
    "kind": "clan",
    "motto": "İki kıyı arasını biliriz.",
    "blazon": "Koyu kömür alanda ağızları dışa bakan iki soluk kanca; ortalarında dar kırmızı bir geçit çizgisi.",
    "colors": [
      "#30353c",
      "#a8bbb6"
    ],
    "symbol": "twin-hook",
    "history": [
      "Krysslerin gücü her sırrı bildikleri iddiasından değil, dar bir kıyıda hangi bağın kime ait olduğunu unutmamalarından gelir. İki kanca karşı kıyıları birbirine zorla yapıştırmaz; arada geçilecek boşluk bırakır.",
      "Morvek, yeni yazımda kaptanlar ile kıyı kollarının ortak sözcüsüdür. Sözünün bedeli haber doğruluğudur. Yanlış gelen işaretin hesabını yalnız en genç gözcüye yıkarsa bir sonraki nöbet onu dinlemez.",
      "Bralklarla yol bilgisi paylaşırken bütün geçiş işaretlerini tek aileye vermekten kaçınırlar. Bu tutum bazen bağımsızlığı, bazen kârlı bir tekeli korur; ikisini aynı sözle savunmaları rakiplerini kızdırır."
    ],
    "relations": [
      {
        "houseId": "tarn",
        "nature": "Borç ve yol bilgisi",
        "description": "Kredinin vadesi ile haberin zamanı ticareti belirler; ikisi tek klanın kalıcı tekeline dönüştürülmek istendiğinde itiraz büyür."
      }
    ],
    "crestId": "crest-kryss"
  },
  {
    "id": "vehl",
    "region": "lakbar",
    "name": "Vehl Geçit Ocağı",
    "seatId": "lakbar",
    "leaderName": "Orun Vehl",
    "kind": "house",
    "motto": "Sıcaklığı geç, izi bırak.",
    "blazon": "Koyu bazalt alanda tek soluk köprü kemeri; altında birbirine değmeyen iki küçük bakır kor.",
    "colors": [
      "#303237",
      "#bc8056"
    ],
    "symbol": "cooling-bridge",
    "history": [
      "Vehllerin eski ayrıcalığı bir yanan akıntıyı yönetmek değil, güvenli geçişin hangi saatlerde açılacağını okumaktır. Kurdukları serinleme ve bekleme düzeni, birkaç ocağın birbirinden kopmamasını sağlar.",
      "Orun’un yerel işi ortak geçit ve bakım çevresidir. Bütün Lakbar’da hüküm süren bir kral sayılmaz. Bir köprüye emek veren aile, karşı kıyının bütün suyunu veya ustasını mülk edinmez.",
      "Geçit işaretini yanlış verdiğinde bedeli bir kişinin şanından büyük olur. Bu nedenle ailenin en eski töreni, tehlikeli günlerde geçişi kapatabilecek genç nöbetçinin sözünü yüksek sesle dinlemektir."
    ],
    "relations": [
      {
        "houseId": "koru",
        "nature": "Geçit ve kereste",
        "description": "Güvenli geçit ile bakımlı özel ağaçlar birbirini mümkün kılar; geçit ücreti her tohumu satın alma hakkı değildir."
      },
      {
        "houseId": "orr",
        "nature": "Alet ve emniyet",
        "description": "Geçit bakımına verilen kabın sınırı açık söylenir; pahalı malzeme yanlış planı güvenli yapmaz."
      }
    ],
    "crestId": "crest-vehl",
    "leaderId": "orun-vehl"
  },
  {
    "id": "koru",
    "region": "lakbar",
    "name": "Koru Tohum Ocağı",
    "seatId": "lakbar",
    "leaderName": "Dessa Koru",
    "kind": "clan",
    "motto": "Kül biter, kök kalır.",
    "blazon": "Toprak kırmızısı alanda üç parçalı soluk tohum kabuğu; içinde küçük koyu bir kor çekirdeği, dışarıda ince yeşil filiz.",
    "colors": [
      "#784b3d",
      "#c4bd98"
    ],
    "symbol": "ember-seed",
    "history": [
      "Korular ateş çevresinde yaşayabilen özel ağaçları ve bunların bakımını tutan hanelerden oluşur. Arma ateşte durmadan büyüyen mucize bitkiyi değil, doğru gölge ve toprak bulunmadığında kaybolan sınırlı hayatı anlatır.",
      "Dessa bu ocağın tanınan emek ve bilgi taşıyıcılarındandır. Ustalığı ona diğer bütün ailelerin emeğini buyurma hakkı vermez. Paylaşılmayan bir fidan bilgisi bir sezon ailenin gelirini, sonraki sezon ortak teknenin kerestesini etkileyebilir.",
      "Xotar ve Garmirk’le sınırlı ticaret bağlarını korurlar. Dışarıya her tohumun satılmaması yerel sır geleneğinin parçasıdır; bu kuralın hangi ustanın kazancını koruduğu içeride de tartışılır."
    ],
    "relations": [
      {
        "houseId": "vehl",
        "nature": "Geçit ve kereste",
        "description": "Güvenli geçit ile bakımlı özel ağaçlar birbirini mümkün kılar; geçit ücreti her tohumu satın alma hakkı değildir."
      }
    ],
    "crestId": "crest-koru",
    "leaderId": "dessa-koru"
  },
  {
    "id": "orr",
    "region": "lakbar",
    "name": "Orr Çanak Ocağı",
    "seatId": "lakbar",
    "leaderName": "Nalis Orr",
    "kind": "house",
    "motto": "Alevi tutan ele bak.",
    "blazon": "Mat siyah alanda geniş ağızlı fildişi bazalt çanak; üzerinde tek ince altın alev ve altında iki küçük kül çizgisi.",
    "colors": [
      "#292d30",
      "#c5a365"
    ],
    "symbol": "basalt-cup",
    "history": [
      "Orrlar ateş işini gösterişli bir büyüden önce kap, alet ve soluk hesabı sayar. Çanak, koruyabildiği kadar ısıyı taşır; her yüke aynı dayanıklılık sözü verilmez.",
      "Nalis’in yerel ustalık çevresi ortak ocak toplantısında temsil edilir. Ateş ve kaos uygulamalarını bilenler kendi hatalarının hesabını diğerlerinden daha az vermez. Gizli öğreti geleneği, yanan bir işliğin zararını komşuya susarak bırakma izni değildir.",
      "Vehl geçitlerine sağlam alet, Koru bakımına uygun kap sağlarlar. Bu karşılıklı ihtiyacın hiçbir tarafı tek başına Lakbar’ın başkenti veya kalıtsal tacı değildir."
    ],
    "relations": [
      {
        "houseId": "vehl",
        "nature": "Alet ve emniyet",
        "description": "Geçit bakımına verilen kabın sınırı açık söylenir; pahalı malzeme yanlış planı güvenli yapmaz."
      }
    ],
    "crestId": "crest-orr",
    "leaderId": "nalis-orr"
  }
]


const tier = (title: string, role: string, selection: string, limits: string) => ({ title, role, selection, limits })
const section = (title: string, ...paragraphs: string[]): Section => ({ title, paragraphs })

// Country totals are working estimates for this campaign's opening date. City
// counts exclude their rural tax districts. Elite and caster are SUBSETS of
// standing; navalCrew and muster are separate people, not additional labels.
export const worldPolities: WorldPolity[] = [
  {
    region: 'danstsud', name: 'Danstsud Krallığı', population: 6200000,
    capitalId: 'valdareth', capitalName: 'Valdareth', capitalPopulation: 500000,
    capitalStatus: 'inhabited', government: 'Taç altında feodal krallık',
    hegemony: 'Eryndorn Vaeranth tahtta. Kraliyet beratı makamı verir; yerel gelenek, lonca ve erzak bağı o makamın ne kadar işlediğini belirler.',
    tiers: [
      tier('Kral / Kraliçe', 'Taç, dış ilişkiler ve lordluk beratları', 'Vaeranth veraseti ve tanınmış taç merasimi.', 'Bilinen erkek varis yoktur. Kraliyet mührü Marhalden seçimini ve Elorwyn geleneğini tek emirle ortadan kaldırmaz.'),
      tier('Büyük Lord / Büyük Leydi', 'Ana şehir ve bağlı vergi havzası', 'Taç atar veya azleder; yerleşik hanedanlar yerel tanınma sağlar.', 'Bağlı köylerin ürünü ve askeri yükümlülüğü beratla sınırlıdır. Manorveil vergisi doğrudan taç içindir.'),
      tier('Geçit Lordu', 'Marhalden’in iki kale ve geçit yönetimi', 'Kazı, şekillendirme ve satış çevrelerinin küçük lordları sekiz yılda bir seçer; taç beratı tanır.', 'Dört yılda bir seçilen baş lonca üyesi ayrı makamdır. Tek hane iki seçimi kalıtsal mülk sayamaz.'),
      tier('Baron / Baronessa · Kale Beyi', 'Bağlı kale, küçük şehir ve yol görevi', 'Lordluk önerisi ve kraliyet ya da üst lord beratı.', 'Kendi gümrüğünü sınırsız koyamaz; sefer çağrısı tarlada gerekli emeği hesaba katar.'),
      tier('Muhtar · Ocak Sözcüsü', 'Mahalle, köy ve ortak stok', 'Yerel usule göre hanelerin kabulü; bazı köylerde lordun onayı.', 'Köylülerin kişisel sahibi değildir. Hardlane’de gerçek uzlaşma kâğıttaki beratın önüne geçebilir.'),
    ],
    armed: { standing: 26000, muster: 42000, navalCrew: 6400, ships: 72, elite: 3400, caster: 210,
      logistics: 'Daimî kara sayısının 8.000’i başkentte, 2.200’ü Lirendil’de, 3.300’ü Dorvenhall’da, 3.400’ü Elorwyn’de, 1.600’ü Theramis’te, 900’ü Marhalden’de, 5.700’ü diğer doğu lordluklarında, 900’ü Hardlane’deki küçük düzenli garnizonlardadır. Bunlar aynı 26.000’in dağılımıdır. Mor Donanma’nın 6.400 mürettebatı ayrı sayılır; 72 görev gemisi farklı büyüklüklerde devriye ve savaş gövdesidir, ticaret filosu değildir.',
      reservesNote: '42.000 yükümlü tek anda silah altında değildir; hasat, ücret, yol ve ambar sınırlaması vardır. Seçkin 3.400 ve görevli büyücü 210 zaten kara mevcudunun içindedir; birbirinden ayrı görev kadrolarıdır. Lonca üyeliği tek başına taç askeri sayılmaz.' },
    powerCenters: ['valdareth', 'lirendil', 'dorvenhall', 'elorwyn', 'theramis', 'marhalden', 'dranthol', 'frostbay'],
    sections: [
      section('Beş surun nöbeti', 'Valdareth’in 8.000 kişilik kara mevcudu; 4.300 şehir muhafızı, 1.600 mor pelerinli seçkin, 1.850 mavi pelerinli sur ve yol askeri, 12 taç şövalyesi ve 238 saray koruma/irtibat personelinden oluşur. On İki yalnız saygın yüzler değil ayrı nöbet, maiyet ve emir sorumluluğu taşıyan küçük bir çekirdektir. Bu alt sayılar yeniden ülke toplamına eklenmez.', 'Mor pelerin saray çevresinin hızlı ve seçilmiş gücüdür; mavi pelerin dış kapı, yol ve köprü nöbetinde görünür. Şehir muhafızı pazar kavgasını ve yangın boşluğunu yönetir. Birinin soylu bir adı olması bütün bu farklı görevleri tek kişiye devretmez.'),
      section('Şehre göre kuvvet', 'Elorwyn’in 3.400 kadrosu içinde 300 paladin ve 60 hizmet rahibi/rahibesi vardır; bunlar ülke seçkin ve büyücü alt toplamlarına dahildir. Theramis’in 1.600’ünde 110 ruhsatlı büyücü, okul ve sarnıç hizmetinden sefer görevine ayrılmıştır. Marhalden’in 900 daimi personelinin 240’ı ağır donanımlı geçit muhafızıdır; küçük kuşatma aletlerini kullanır ve Harven ile Mavric ileri nöbetlerini besler.', 'Dorvenhall’ın 3.300’ünde 420 dağ ve sınır korucusu vardır. Kayalık bineklere her askerin erişimi yoktur; hayvanın yemi ve dinlenme yeri devriye güzergâhını belirler. Lirendil’de ÇelikKalkan’ın sözleşmeli görevdeki 700 üyesi 2.200 sayısına dahildir; loncanın bütün kayıtlı üyeleri otomatik kraliyet askeri değildir.'),
      section('Karlan’ın batısında emir', 'Hardlane’deki 900 düzenli kadronun 600’ü Dranthol, 250’si Frostbay, 50’si Ternhaven hizmetine ayrılmıştır. Yerel iskele nöbetleri, suç çeteleri ve geçici avcı grupları bu düzenli toplamda yoktur. Vyssgard ve Kaldmere’ye çalışan bir kraliyet garnizonu yazılmaz.', 'Frostbay’in batı yerleşimleri üzerindeki yetkisi kâğıtta geniş, gerçekte parçalıdır. Hardlane’de genel vergi tahsilatı işlemez; Frostbay’de az miktarda liman, gümrük ve güvenlik geliri vardır. Dranthol’un ücretli askerini çevredeki köylerden düzenli vergi çıkıyormuş gibi finanse etmek yerine taç sevki ve geciken ödeneklerle açıklamak gerekir.'),
    ],
  },
  {
    region: 'xotar', name: 'Xotar Vaha Birliği', population: 4100000,
    capitalId: 'zarim-khet', capitalName: 'Zarim’khet', capitalPopulation: 210000,
    capitalStatus: 'assembly', government: 'Vaha beratları ve ortak su meclisi',
    hegemony: 'Nemesh, Vekk ve Khoss gibi haneler kuyu, pazar ve yol gelirini paylaşır; Karutah öğretisi ortak ölçüdür, her kuyunun mülkiyet belgesi değildir.',
    tiers: [
      tier('Yüce Sâki', 'Vahalar arası su ve sefer uyuşmazlıklarının başhakemi', 'Vaha temsilcileri yedi yıllığına seçer; mevcut makamı Sahira Nemesh taşır.', 'İçme suyunu toplu ceza diye kesemez; ortak sefer için vaha onayı gerekir.'),
      tier('Vaha Emiri / Emîresi', 'Yerleşim, kuyu çevresi ve bağlı bahçeler', 'Tanınmış hanenin adayı yerel su meclisince kabul edilir.', 'Kuyu ölçüleri rahip ve ölçücünün ortak kaydına tabidir; soy tek başına sınırsız tahsilat vermez.'),
      tier('Hat Beyi / Hat Hanımı', 'Kervan durağı, yol muhafazası ve konak payı', 'Vaha beratı ve kervan ortaklarının güvencesi.', 'Su hakkı olmayan yeni bir konak açamaz; geçiş ücretinin karşılığında gölge ve koruma sağlar.'),
      tier('Kuyu Emini', 'Gündelik su sırası ve hazne bakımı', 'Su kullanan hanelerin seçimi ve ölçü kaydı.', 'Sıra hakkını satmak ile kuyunun kendisini satmak ayrı işlerdir.'),
    ],
    armed: { standing: 14500, muster: 24000, navalCrew: 1200, ships: 18, elite: 1400, caster: 160,
      logistics: 'Daimî kuvvet vaha kapıları, kuyu korumaları ve kervan eskortları arasında dağılır. Uzun seferin sınırı asker sayısından önce hayvanların içeceği su ve kuyular arasındaki mesafedir. 18 kıyı gemisi liman ve ikmal devriyesidir; çölde iş gören kervan hayvanları gemi sayısına katılmaz.',
      reservesNote: '24.000 yükümlü ancak kuyu ve bahçe nöbetleri korunarak kısım kısım toplanabilir. 1.400 seçkin hat muhafızı ve 160 görevli büyücü daimi kara toplamının içindedir.' },
    powerCenters: ['zarim-khet', 'qal-nashar', 'thariz', 'sahrim'],
    sections: [section('Bir kırbanın siyaseti', 'Nemeshlerin payı su düzeni, Vekklerin ağırlığı pazar sözleşmesi, Khossların gücü Rüzgâr Hatları üzerindeki konaklardır. Üçünün arması aynı kapıya asılınca birinin ötekinin kuyusuna sahip olduğu anlaşılmaz.', 'Zarim’khet ortak meclise ev sahipliği yapar ve 210.000 kişilik bir kenttir. Ülkenin 4.100.000 sayısı bütün vahaları ve hareketli kervan hanelerini kapsayan yeni çalışma tahminidir; kent nüfusu bunun içindedir.')],
  },
  {
    region: 'murgul', name: 'Murgul Ada Birliği', population: 9000000,
    capitalId: 'morihael', capitalName: 'Morihael · Kılıç ve Dal', capitalPopulation: 1000000,
    capitalStatus: 'inhabited', government: 'İkili meclis ve ada beratları',
    hegemony: 'Morihael’in Kılıç ve Dal meclisleri ortak liman masasında buluşur. Ilvara Senn ortak masayı yürütür; Azja ocakları ile Xotar kökenli haneler temsil haklarını korur.',
    tiers: [
      tier('İki Mühür Sözcüsü', 'Ortak dış sözleşme ve ada ikmalinin koordinasyonu', 'Kılıç ve Dal meclislerinin birlikte kabul ettiği beş yıllık görev.', 'İki mühürden yalnız biriyle ortak vergi veya ada savaşı ilan edilemez.'),
      tier('Ada Naibi / Naibesi', 'Ada hizmetleri, yargı ve liman yükümlülüğü', 'Yerel ada meclisi seçer; ortak masa kayda geçirir.', 'Komşu adanın balık suyunu tek başına tahsis edemez; görev geri çağrılabilir.'),
      tier('İskele Başı', 'Rıhtım, tersane, yük tartısı ve gece nöbeti', 'Liman ortakları ile mahallelerin birlikte verdiği dönemlik yetki.', 'Gemici ücretini hane özel borcuna dönüştüremez; kamu tartısı denetlenir.'),
      tier('Mahalle Emini · Azja Ocak Sözcüsü', 'Su, barınma, yerel uzlaşma ve kayıt', 'Mahalle veya ocağın kendi kabul usulü.', 'Ruhani saygınlık liman bütçesini tek elde toplama yetkisi değildir.'),
    ],
    armed: { standing: 22500, muster: 36000, navalCrew: 18000, ships: 190, elite: 2100, caster: 280,
      logistics: '190 görev gövdesi, ağır muhafaza gemileri kadar küçük boğaz teknelerini de kapsar. 18.000 tayfa kara gücünden ayrıdır. Morihael’deki daimi kara/şehir kadrosu 9.000; diğer adaların toplamı 13.500’dür. Tersane ustaları ve ticaret tayfaları aktif askeri kayda girmedikçe bu sayılara eklenmez.',
      reservesNote: '36.000 ek yükümlü ada paylarıyla çağrılır. Balıkçılığı ve bir milyonluk kentin ikmalini aynı anda durdurmak mümkün değildir. Seçkin 2.100 ve büyücü 280 kara toplamının alt gruplarıdır.' },
    powerCenters: ['morihael'],
    sections: [section('Bir milyon kişilik iki yüz', 'Kılıç ve Dal’ın birlikte şehir nüfusu 1.000.000’dur. Kılıç tersaneler, gümrük avluları ve koruma düzeniyle; Dal bahçeler, mahalle toplantıları ve Azja ocaklarıyla anılır. İki ad, aynı kent içindeki bütün insanların iki ayrı soyla kusursuzca bölündüğü anlamına gelmez.', 'Senn hanesi rıhtım sözleşmelerinde, Azhal ocağı ortak bahçe ve su geleneğinde, Nahl hanesi omurga ve gemi onarımında güç sahibidir. Büyük limanın yaşayabilmesi için çevre adaların erzağı, tatlı su havzaları ve devamlı kısa mesafe taşımacılık gerekir. 9.000.000 ülke toplamı yeni ölçek tahminidir; bir milyonluk şehir bunun içindedir.')],
  },
  {
    region: 'honud', name: 'Honud Kıyı Ocakları', population: 500000,
    capitalId: 'hurnas-ithil', capitalName: 'Hurnas Ithíl · Donmuş Taç', capitalPopulation: 0,
    capitalStatus: 'abandoned', government: 'Kıyıya taşınmış klan ve ocak uzlaşmaları',
    hegemony: 'Eski başkentte yaşayan hükümdar ve başkent garnizonu yoktur. Ardzenor’un kutsal otoritesine verilen anlam kıyı toplulukları arasında değişir; gündelik erzak kararları yaşayan ocaklarda alınır.',
    tiers: [
      tier('Ardzenor · Kutsal tanınma', 'Atalar, korunma ve ortak geçmişin otorite adı', 'İnanç ve sözlü gelenek; tek bir yaşayan saraya indirgenmez.', 'Gündelik bütün emirlerin kaynağı veya boş başkentte nüfus bulunduğunun delili sayılmaz.'),
      tier('Kış Halkası Sözcüsü', 'Birden fazla kıyı ocağının erzak ve yer paylaşımı', 'Katılan klanlar her kış için uzlaşmayla görevlendirir.', 'Diğer kıyı halkalarını fethedilmiş bağlıları gibi yönetemez; toplantı yeri kalıcı başkent değildir.'),
      tier('Ocakbaşı', 'Yaşayan hane topluluğunun barınma ve savunması', 'Klan usulü, beceri ve hanelerin kabulü.', 'Boş iç ülkeye dönme buyruğu tek başına aileleri bağlamaz; av ve yakıt hesabı açık olmalıdır.'),
      tier('Söz Taşıyıcısı · Kıyı Gözcüsü', 'Öğreti, mevsim kaydı ve güvenli dönüş işareti', 'Ustalık zinciri ve birlikte çalışanların tanıması.', 'On beş kule geleneğini taşımak on beş dolu garnizona komuta etmek değildir.'),
    ],
    armed: { standing: 1600, muster: 6200, navalCrew: 650, ships: 26, elite: 160, caster: 45,
      logistics: '1.600 görevli kıyı ocaklarının ortak nöbet, ağ ve stok koruma kadrolarıdır. 650 askerî kayıkçı 26 buz aralığı ve kıyı görev teknesinde dönüşümlü çalışır; bunlar okyanus savaş filosu değildir. Yakıt ve insan kaybı, büyük fetih ordusundan daha yakın tehlikedir.',
      reservesNote: '6.200 ek savunucu yalnız kısa süre ve yerel mesafede çağrılabilir. Uzun süre kıyıdan ayrılmaları avı ve yakıtı durdurur. 160 seçkin izci ve 45 sözlü büyü uygulayıcısı zaten kara mevcudundadır; nüfusun kalanına ayrıca iç ülke garnizonu eklenmez.' },
    powerCenters: ['frostheimr', 'norrvar', 'skeldrun', 'hjorthal'],
    sections: [section('Batıdan gelen soğuğun hesabı', 'Honud’un bütün nüfusu 500.000’dir: adı kayıtlı kıyı merkezlerinde 158.000, küçük kıyı ocaklarında 262.000, hareketli kıyı hanelerinde 80.000. Hurnas Ithíl ve kalıcı yaşama elverişsiz iç ülke bu toplama sıfır ekler. Bir hane kışı limanda geçirince iki kez sayılmaz.', 'Soğuk batıdan doğuya ilerler. İnsanlar donmuş denizin yanına soğuktan kurtuldukları için değil, buz altı akıntısının, balığın ve dışarıdan gelen yakıtın bıraktığı dar yaşama aralığı için toplanır. Nellerin Skjornhvaldr adı bugünkü ikametleri değil kökenidir; yaşayan kolları Frostheimr çevresindeki kıyıda barınır.')],
  },
  {
    region: 'garmirk', name: 'Garmirk Demir Meclisi', population: 1800000,
    capitalId: 'kardum-canagi', capitalName: 'Kardum Çanağı', capitalPopulation: 0,
    capitalStatus: 'assembly', government: 'Torgalların klan meclisi',
    hegemony: 'Volgar, Rudmar, Tahrin, Bregin ve Skarv kendi halkını yönetir. Kardum’daki örs ortak kararı duyurur; diğer bütün klanları mirasla alan bir demir kral yoktur.',
    tiers: [
      tier('Meclis Çekici', 'Ortak toplantının sözü ve savaş koordinasyonu', 'Torgallar sefer veya toplantı süresi için kendi aralarından seçer.', 'Barışta öteki Torgalların üstünde kalıtsal egemenlik kurmaz.'),
      tier('Torgal', 'Klanın savaş ve barıştaki önderi', 'Klanın kendi soy, yemin ve kabul usulü.', 'Klan örfü ve ortak yeminle bağlıdır; diğer klanın cevherini tek başına tahsis edemez.'),
      tier('Ocak Beyi / Ocak Hanımı', 'Maden, atölye ve bağlı yerleşim çevresi', 'Usta hanelerin tanınması ve Torgalın kabulü.', 'Çıkarılan maden payı işçinin bütün emeği üzerinde sınırsız hak doğurmaz.'),
      tier('Geçitbaşı · Yemin Şarkıcısı', 'Yol nöbeti veya geçmişin kaydı', 'Görev becerisi ve topluluğun tanıması.', 'Askerî emir ile yemin tanıklığı ayrı yetkilerdir; şarkıcı ordu komutanı olmak zorunda değildir.'),
    ],
    armed: { standing: 8900, muster: 18000, navalCrew: 900, ships: 20, elite: 1800, caster: 95,
      logistics: '8.900 daimi kadro klan kaleleri ve geçitlerde yaşar; ortak meclisin tek kışlada duran ordusu değildir. 20 kıyı teknesi maden limanı ve ikmal korur. Kış yolları kapandığında komşu kalelerin bile aynı gün birleşmesi beklenmez.',
      reservesNote: '18.000 ek yükümlü klan paylarıyla çağrılabilir; maden ve ocak bakımı durdurulamaz. 1.800 ağır geçit savaşçısı ve 95 görevli uygulayıcı kara toplamının alt gruplarıdır.' },
    powerCenters: ['baldrek', 'stoneclans'],
    sections: [section('Örse inen beş çekiç', 'Volgarın dağ gücü, Rudmarın ocak disiplini, Tahrinin iz bilgisi, Breginin taş işi ve Skarvın yemin hafızası birbirinin yerini tutmaz. Beş büyük klanın dışında küçük haneler de vardır; büyük armaların görünürlüğü bütün dağların yalnız beş aileye ait olduğu anlamına gelmez.', 'Kardum Çanağı toplantı yeridir. Buraya kent nüfusu yazılmaz; toplantı günü gelen insanlar kendi kalıcı yerlerinde sayılır. Kaynak haritada doğrulanmış nokta bulunmadığından yeni bir başkent pini uydurulmaz.')],
  },
  {
    region: 'ariki', name: 'Ariki Ada Klanları', population: 1150000,
    capitalId: 'twinclans', capitalName: 'Twinclans · ortak toplantı limanı', capitalPopulation: 48000,
    capitalStatus: 'assembly', government: 'Seçimli ada ve klan birliği',
    hegemony: 'Tavren, Morrik, Eryth ve Valren önemli seslerdir; küçük klanların oyunu ortadan kaldırmazlar. Bir adayı yönetmek bütün denizi miras almak değildir.',
    tiers: [
      tier('Rüzgâr Sözcüsü', 'Ortak deniz anlaşması ve toplantı çağrısı', 'Ada temsilcileri dört yıllığına seçer; ardışık dönem için yeniden açık kabul gerekir.', 'Tek başına bütün ada vergisini veya savaşını ilan edemez.'),
      tier('Ada Reisi', 'Adanın gündelik hizmet ve savunması', 'Diğer klanların da katıldığı yerel seçim.', 'Kendi klanı dışındaki oyları ve küçük ocakların anlaşılmış haklarını korur.'),
      tier('Klan Sözcüsü', 'Hanelerin temsil ve yükümlülüğü', 'Her klanın kendi seçim ya da kabul usulü.', 'Soy adı adaylık sağlayabilir; seçilmiş ada makamını otomatik devretmez.'),
      tier('İskele Reisi · Gemi Reisi', 'Liman vardiyası veya tek geminin seyri', 'Liman meclisi ya da tayfa sözleşmesi.', 'Denizdeki acil komuta yetkisi karada sınırsız yargı yetkisi değildir.'),
    ],
    armed: { standing: 3900, muster: 9200, navalCrew: 3400, ships: 54, elite: 520, caster: 60,
      logistics: '54 görev gemisinin çoğu dar boğaz ve kısa ada geçişine uygundur. 3.400 tayfa kara kadrosundan ayrıdır. Morriklerin güvenlik uzmanlığı gemilerin tamamına tek başına sahip oldukları anlamına gelmez; bakım gideri ada paylarıyla karşılanır.',
      reservesNote: '9.200 ek kuvvet, balık ve tuz işinin mevsimine göre toplanır. 520 seçkin kıyı savaşçısı ve 60 hizmet büyücüsü 3.900 kara kadrosuna dahildir.' },
    powerCenters: ['twinclans', 'northpact', 'eldrascar'],
    sections: [section('Seçimin ertesi sabahı', 'Twinclans’ın 48.000 kişilik limanı ortak toplantıları ağırlayan yeni çalışma merkezi olarak kullanılır; tek kalıtsal başkent değildir. Seçimi kaybeden klanın da iskelesi ertesi sabah çalışmalıdır. Altın Oruç bu nedenle yalnız törenden ibaret değil, kazananın ötekinin sofrasına oturacağı bir kamu sözü sayılır.', 'Tavren ticaretin, Morrik güvenliğin, Eryth bilgi ve diplomasinin, Valren adalar arası uzlaşmanın ağırlığını taşır. Aynı adayın iki konuda usta olması bütün klan görevlerini tek kişiye devretmez.')],
  },
  {
    region: 'gurbin', name: 'Gurbin Dört Klanı', population: 900000,
    capitalId: 'hurnreach', capitalName: 'Hurnreach · ortak deniz masası', capitalPopulation: 62000,
    capitalStatus: 'assembly', government: 'Dört klanın bağımsızlık antlaşması',
    hegemony: 'Vahen, Bralk, Tarn ve Kryss ortak savunma için birleşir; her biri kendi halkı ve yeteneği üzerindeki sözü korur.',
    tiers: [
      tier('Dört Yemin Sözcüsü', 'Dış anlaşma ve ortak savunma kararı', 'Dört klan bir toplantı veya sefer için ortak adayı kabul eder.', 'Sözcünün kendi klanı diğer üçünü bağlı hane sayamaz; sözleşme dışında vergi koyamaz.'),
      tier('Klanbaşı', 'Klan halkı, hakemliği ve savunma payı', 'Klan içi başarı, kabul ve soy geleneğinin birleşimi.', 'Gölge Yemini kişisel sadakat kadar önderin yükümlülüğüdür; ortak kararı tek başına bozamaz.'),
      tier('Yemin Kaptanı', 'Birlik veya deniz grubunun belirli görevi', 'Klanbaşının açık görev sözü ve savaşçıların tanıması.', 'Barış limanında ganimet yetkisini sürdürmez; görevi bittiğinde hesabını verir.'),
      tier('Kıyıbaşı · Hane Sözcüsü', 'Yerel geçim ve nöbet', 'Hanelerin kabulü.', 'Yerel güç dışarıdan gelen her kişiyi düşman veya köle ilan etme hakkı değildir.'),
    ],
    armed: { standing: 4200, muster: 7600, navalCrew: 2900, ships: 46, elite: 700, caster: 70,
      logistics: 'Bralk hızlı gemilerin önemli bölümünü donatır; Vahen kara ve yemin bağlarını, Tarn bilgi ve haber zincirini, Kryss mistik hizmeti güçlendirir. 46 görev gemisi ve 2.900 tayfa, küçük tarım alanlarının kaldırabileceği sürekli seferi tek başına garanti etmez.',
      reservesNote: '7.600 ek yükümlü kısa yerel savunma içindir; bütün halkı birden denize sürmek besin üretimini keser. 700 seçkin ve 70 büyücü 4.200 kara toplamına dahildir.' },
    powerCenters: ['hurnreach', 'kraenfall', 'volriks-maw'],
    sections: [section('Güç, ertesi gün de bir iştir', 'Hurnreach’in 62.000 kişilik limanı ortak masaya ev sahipliği yapar; diğer adaların hanesini kendine bağlı köy sayan bir krallık başkenti değildir. Klanlar bağımsızlığı yalnız yabancı orduya karşı değil, içeride tek tarafın bütün gemileri veya haberleri tutmasına karşı da korur.', 'Vahen öğretisinin başarı dili, yanlış zamanda kazanılmış bir deniz zaferinin bile erzak kaybı getirebileceğini kabul eder. Tayfayı kurtaran kaptan şan kazanır; emanet yükü kendi ganimeti sayarsa aynı yemin onu sınırlamaya döner.')],
  },
  {
    region: 'lakbar', name: 'Lakbar Ocakları', population: 180000,
    capitalId: 'lakbar', capitalName: 'Dağıtılmış geçit ve ocak toplantıları', capitalPopulation: 0,
    capitalStatus: 'dispersed', government: 'Ustalık ve ortak bakım çevreleri',
    hegemony: 'Kalıcı bir kral ve tek başkent yoktur. Geçit, ağaç ve ateş ustalığı farklı ocaklarda tutulur; birlikte yaşamak ortak bakımı zorunlu kılar.',
    tiers: [
      tier('Ortak Ocak Sözcüsü', 'Belirli bir bakım veya dış ticaret anlaşmasının yürütülmesi', 'İlgili ocaklar işin süresi için görevlendirir.', 'Bütün adaların insanlarını, sırlarını veya ürünlerini kendi mülkü sayamaz.'),
      tier('Usta Taşıyıcı', 'Geçit, fidan, kap ve ateş tekniğinin korunması', 'Uzun çıraklık ve diğer ustaların tanıması.', 'Beceri gündelik tehlike kararına ağırlık verir; kalıtsal soyluluk değildir.'),
      tier('Geçit Gözcüsü', 'Bir geçişi açmak veya kapatmak', 'Ortak nöbet ve açık güvenlik görevi.', 'Tehlike varsa güçlü bir hane için de kapatabilir; borç tahsili diye insanı ateşe süremez.'),
      tier('Ocak Hanesi', 'Yaşam alanı, ortak stok ve çıraklık', 'Yerel kabul ve karşılıklı emek.', 'Dışarıya sır vermemek, komşunun su veya dönüş yolunu kesme izni değildir.'),
    ],
    armed: { standing: 620, muster: 1700, navalCrew: 180, ships: 12, elite: 120, caster: 65,
      logistics: '620 daimi görevli çoğunlukla geçit koruması ve stok nöbetidir. 12 özel kıyı teknesinin 180 görev tayfası ayrı sayılır; sıcak akıntıya dayanıklı araçlar açık denizde sınırsız savaş yeteneği vermez. Yakıt, temiz hava ve dönüş saati savunma planının parçasıdır.',
      reservesNote: '1.700 ek kişi ancak kısa bir ortak savunmada toplanabilir. 120 seçkin geçit koruyucusu ile 65 ateş/kaos uygulayıcısı kara mevcuduna dahildir. Büyü kullanan herkes her durumda güvenilir savaş büyücüsü sayılmaz.' },
    powerCenters: ['lakbar'],
    sections: [section('Bir başkent yerine üç ihtiyaç', 'Vehl geçidi, Koru fidanı, Orr kabı ve aleti korur. Hiçbiri diğerinin işi olmadan tek başına herkesi yaşatamaz. Ocak toplantısı bu ihtiyaca göre farklı yerde kurulur; ülke harita işaretini yeni bir kent pini veya sıfır nüfuslu hayalî başkent gibi kullanmaz.', '180.000 kişi bütün adaların yeni çalışma tahminidir. Ortak merkez için yazılan sıfır, Lakbar’da kimsenin yaşamadığı değil tek bir başkent nüfusu olmadığı anlamına gelir. İnsanlar ocak ve kıyı yerleşimlerinde sayılır.')],
  },
]

export const polityHouseArticleId = (house: WorldHouse) => house.id === 'vaeranth' ? 'vaeranth-hanedani' : house.id === 'elorwynder' ? 'elorwynder-hanedani' : 'hane-' + house.id
export const polityHouseSections = (house: WorldHouse): Section[] => [
  section('Hanenin sözü ve işareti', '“' + house.motto + '”', house.blazon),
  section('Geçmişten bugünkü makama', ...house.history),
  section('Bağlılıklar ve çıkarlar', ...house.relations.map(r => (worldHouses.find(h => h.id === r.houseId)?.name || r.houseId) + ' · ' + r.nature + ': ' + r.description)),
]
const format = (value: number) => value.toLocaleString('tr-TR')
export const polityArticles: LoreArticle[] = [
  ...worldHouses.filter(h => !['vaeranth', 'elorwynder'].includes(h.id)).map((house): LoreArticle => ({
    id: polityHouseArticleId(house), name: house.name, kind: 'dynasty', region: house.region,
    subtitle: house.leaderName + ' · ' + (house.seatName || house.seatId),
    summary: house.history[0], sections: polityHouseSections(house), sources: [politySource],
    related: [house.seatId, ...(house.leaderId ? [house.leaderId] : []), ...house.relations.map(r => 'hane-' + r.houseId)],
  })),
  ...worldPolities.map((polity): LoreArticle => ({
    id: polity.region + '-yonetim-ve-kuvvet', name: polity.name + ' · Yönetim ve kuvvet', kind: 'institution', region: polity.region,
    subtitle: polity.government, summary: polity.hegemony,
    sections: [
      section('Nüfus ve merkez', 'Ülke toplamı ' + format(polity.population) + '; ' + polity.capitalName + ' için merkez nüfusu ' + format(polity.capitalPopulation) + '. Ülke toplamı merkez nüfusunu içerir; yeniden eklenmez. Sayılar kampanya başlangıcının açık çalışma tahminleridir.'),
      { title: 'Unvan, görev ve sınır', paragraphs: [], table: { columns: ['Unvan', 'Görev', 'Makama geliş', 'Yetkinin sınırı'], rows: polity.tiers.map(t => [t.title, t.role, t.selection, t.limits]) } },
      { title: 'Silahlı mevcut', paragraphs: [polity.armed.logistics, polity.armed.reservesNote], table: { columns: ['Kademe', 'Mevcut', 'Sayım'], rows: [
        ['Daimî kara ve şehir gücü', format(polity.armed.standing), 'Görevdeki ayrı kişiler'],
        ['Çağrılabilir ek kuvvet', format(polity.armed.muster), 'Barışta silah altında olmayan ek kişiler'],
        ['Donanma tayfası', format(polity.armed.navalCrew), 'Kara toplamından ayrı kişiler'],
        ['Görev gemisi', format(polity.armed.ships), 'Gövde; insan toplamına eklenmez'],
        ['Seçkin personel', format(polity.armed.elite), 'Daimî kara toplamının içinde'],
        ['Görevli büyücü', format(polity.armed.caster), 'Daimî kara toplamının içinde'],
      ] } }, ...polity.sections,
    ], sources: [politySource], related: [polity.region, ...polity.powerCenters, ...worldHouses.filter(h => h.region === polity.region).map(h => 'hane-' + h.id)],
  })),
  { id: 'hurnas-ithil', name: 'Hurnas Ithíl', kind: 'geography', region: 'honud', subtitle: 'Donmuş Taç · kalıcı nüfus 0 · kesin konumu doğrulanmamış', summary: 'Honud’un terk edilmiş eski başkenti. İç ülkenin kalıcı soğuğunda nüfusu sıfırdır; bugünkü kıyı toplantıları burada yapılmaz.', sections: [section('Şehirden kalan ad', 'Batı Kapanışı iç ülkeyi yaşanmaz kıldığında başkentin sürekli hayatı da sona erdi. Kıyıya ulaşan haneler eski mühürleri, dua kalıplarını ve kayıp akrabalarının adlarını taşıdı. Şehrin adının yaşaması sokaklarının hâlâ açık olduğu anlamına gelmez.', 'Eski başkentin kesin harita konumu doğrulanmadı. Bu kayıt için nokta uydurulmaz. Oyuncu haritasındaki mevcut yerleşim işaretleri korunur; bir gün kente yapılacak yolculuk ayrıca hazırlanmış, dönüşü belirsiz bir sefer olmalıdır.')], sources: [politySource], related: ['honud', 'honud-yonetim-ve-kuvvet'] },
]
