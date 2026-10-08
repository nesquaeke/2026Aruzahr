import type { LoreArticle, Place } from "./data";
import { primaryArtwork } from "./media";
import { characterCards } from "./lore/characters";
import { villageLife } from "./lore/village-life";

export type Power = { label: string; value: number; note: string };
export type PersonCard = {
  name: string;
  role: string;
  portrait?: string;
  article?: string;
};
export type Dossier = {
  badge: string;
  population: string;
  populationNote: string;
  ruler: string;
  government: string;
  climate: string;
  exports: string[];
  powers: [number, number, number, number];
  hooks: { title: string; text: string }[];
  people?: PersonCard[];
  art?: string;
  motto: string;
  tone?: string;
};

// Fictional estimates and ordinal comparisons added at the author's request.
// Frostbay and Dranthol retain the author's population figures. Other new
// estimates, officeholders and visual summaries are recorded in TASARIM_VE_KARTLAR.md.
export const dossiers: Record<string, Dossier> = {
  valdareth: {
    badge: "Taç şehri",
    population: "≈ 420.000",
    populationNote: "Hane ve çevre yerleşim tahmini",
    ruler: "Eryndorn Vaeranth",
    government: "Doğrudan kraliyet",
    climate: "Verimli nehir ovası",
    exports: ["Saray kiremitleri", "Tahıl", "Nehir ticareti"],
    powers: [5, 5, 5, 4],
    art: "valdareth",
    motto: "Beş sur. Bir taç. Bin ayrı hayat.",
    tone: "violet",
    hooks: [
      {
        title: "Beş surun şehri",
        text: "Her duvarı aştığında başka bir Valdareth’e girersin. Taç kuşağından Sabançeper’e servet ve hizmet azalır.",
      },
      {
        title: "Morun bedeli",
        text: "Sarayların mavi mor çatısı Dorvenhall’dan gelir. Bir kiremit, iki şehrin ustalığını taşır.",
      },
      {
        title: "Kara Ayna",
        text: "En iç duvarlarda obsidyen kilise ve kraliyet kalesi yan yana yükselir. Limanda İlk Işık hâlâ yanar.",
      },
    ],
    people: [
      {
        name: "Eryndorn Vaeranth",
        role: "Danstsud Kralı",
        portrait: "eryndorn",
        article: "eryndorn",
      },
      {
        name: "Maelis Dervan",
        role: "Kraliyet hazinedarı",
        article: "valdareth-saray-makamlari",
      },
    ],
  },
  frostbay: {
    badge: "Kadim liman",
    population: "45–50 bin",
    populationNote: "Nüfus kaydı eksik; kıyı tahmini",
    ruler: "Nera Veld",
    government: "Sınırlı iskele idaresi",
    climate: "Uzun kış · kısa tarım mevsimi",
    exports: ["Balık", "Post & av", "Kıyı pazarı"],
    powers: [2, 4, 3, 2],
    art: "frostbay",
    motto: "Taş eski. İçindeki hayat yeni.",
    tone: "ice",
    hooks: [
      {
        title: "Postahaneden eski",
        text: "Dairetaş’ın bilinmeyen ustaları kayboldu. Bıraktıkları binalarda bugün mektup tartılır, gümrük mührü vurulur.",
      },
      {
        title: "Korsan da uyur",
        text: "Korunaklı kıyı, aranan kaptana da yeni gelen aileye de sığınak olur. Aynı limana varırlar; aynı hayatı yaşamazlar.",
      },
      {
        title: "Kırık Kanat",
        text: "Eski değirmenlerin gövdeleri hâlâ ayakta. Bryndon’un sorusu basit: Bu kadar değirmen neyi öğütüyordu?",
      },
    ],
    people: [
      {
        name: "Nera Veld",
        role: "İskele vekili",
        portrait: "nera-veld",
        article: "nera-veld",
      },
      {
        name: "Kâtip Bryndon",
        role: "Eski kıyının araştırmacısı",
        portrait: "bryndon",
        article: "bryndon-kiyi-defteri",
      },
      { name: "Odran Vehl", role: "Garnizon nöbetbaşı" },
    ],
  },
  marhalden: {
    badge: "Karlan’ın eşiği",
    population: "≈ 12.000",
    populationNote: "Şehir içi tahmini; köyler hariç",
    ruler: "Edran Korr",
    government: "Üç Mühür lonca düzeni",
    climate: "2.350 m · kış −35 °C",
    exports: ["Veyralt", "İşlenmiş demir", "Geçit ticareti"],
    powers: [4, 4, 4, 5],
    art: "marhalden",
    motto: "Kralın Yolu burada biter.",
    tone: "iron",
    hooks: [
      {
        title: "Bir nehir, iki kale",
        text: "Doğu Mühür ile Batı Örs, Aldara’nın karşılıklı kıyılarında birbirini izler. Köprü yalnız iki yakayı bağlamaz.",
      },
      {
        title: "Üç ayrı mühür",
        text: "Kazı, işleme ve satış aynı elde toplanmaz. Lord sekiz, baş lonca üyesi dört yılda bir seçilir.",
      },
      {
        title: "Yük geçer, insan bekler",
        text: "Şehir mülteci girişine kapalıdır. İzinli erzak yüklerinin geçmesi, yanında yürüyen aileye kapıyı açmaz.",
      },
    ],
    people: [
      {
        name: "Edran Korr",
        role: "Seçilmiş şehir lordu",
        portrait: "edran-korr",
        article: "edran-korr",
      },
      {
        name: "Vessa Thol",
        role: "Baş lonca üyesi",
        article: "marhalden-uc-muhur",
      },
    ],
  },
  dranthol: {
    badge: "Reform kalesi",
    population: "≈ 15.000",
    populationNote: "Eski nüfus ≈ 1.500; toplam on kat",
    ruler: "Ser Garran Veyl",
    government: "Kraliyet garnizonu",
    climate: "Soğuk kıyı · açık liman",
    exports: ["Liman hizmeti", "Gemi onarımı", "Balık"],
    powers: [4, 2, 2, 5],
    art: "dranthol",
    motto: "Yeni duvarlar. Eski yoksulluk.",
    tone: "iron",
    hooks: [
      {
        title: "On kat büyüme",
        text: "Küçük garnizon bir anda Ocak Kalesi oldu. Yeni haneler geldi; inşaat bitince herkese yetecek iş kalmadı.",
      },
      {
        title: "Güvenliğin boş rıhtımı",
        text: "Hardlane’de kişi başına en güçlü güvenlik burada. Korsanın ardından hanın müşterisi ve tamircinin altını da gitti.",
      },
      {
        title: "Nöbet Işığı",
        text: "Yeni fener sisin içine bakar. Güneyde Ayaz Yutan, kuzeyde Soluk Su gemiciyi başka sınavlara çağırır.",
      },
    ],
    people: [{ name: "Ser Garran Veyl", role: "Ocak Kalesi komutanı" }],
  },
  ternhaven: {
    badge: "Sıcak su ocağı",
    population: "≈ 8.500",
    populationNote: "Şehir ve sıcak su haneleri tahmini",
    ruler: "Ocak Meclisi",
    government: "Yerel haneler · sözcü Mera Sorn",
    climate: "Rydorn sıcak su cepleri",
    exports: ["Kurutulmuş balık", "Küçük tarla ürünü", "Yün"],
    powers: [3, 2, 3, 3],
    art: "ternhaven",
    motto: "Kısa yazı birlikte uzatırlar.",
    tone: "moss",
    hooks: [
      {
        title: "Kışın içindeki sıcaklık",
        text: "Buhar küçük kanallardan yükselir. Rydorn’un suyu bostanları ve evleri korur; uzak yamaçlarda kış devam eder.",
      },
      {
        title: "Eski kıyının sesi",
        text: "Hardlane’in eski ocak gelenekleri burada güçlüdür. Haneler kurutma alanını, yakıtı ve kışlık işi paylaşır.",
      },
      {
        title: "Kâğıtta kalan çizgi",
        text: "Marhalden’e uzanacak Cevher Çizgisi hiç yapılmadı. Bugün yükleri uzun Kemiğe Basan Yol taşır.",
      },
    ],
    people: [{ name: "Mera Sorn", role: "Ocak meclisi sözcüsü" }],
  },
  vyssgard: {
    badge: "Beş iskelenin kenti",
    population: "≈ 11.000",
    populationNote: "Sürekli ve geçici sakinler tahmini",
    ruler: "Beş İskele",
    government: "Çete hâkimiyeti · kraliyet yok",
    climate: "Sisli, sert kıyı",
    exports: ["Kaçak ticaret", "Liman emeği", "Gemi tamiri"],
    powers: [1, 4, 3, 1],
    art: "vyssgard",
    motto: "Kanundan kaçtın. Defterden kaçamadın.",
    tone: "ember",
    hooks: [
      {
        title: "Beş kapının payı",
        text: "Kanca Rıhtımı, Kör Fener, Kırık Örs, Yaslı Halat ve Kül Deposu işi paylaşır. Birinin payını bozarsan beşi de kapısını kapatabilir.",
      },
      {
        title: "Kapalı Bıçak",
        text: "Pazarda kavga yasaktır; çetenin silahlı nöbetçisi dolaşır. Sözleşme ticareti korur, herkese eşit güvenlik vermez.",
      },
      {
        title: "Kürekle gelen altın",
        text: "Dranthol’dan çekilen korsanlar açıkta demirler. Rıhtıma küçük teknelerle gelen yük, şehrin büyük hesabını büyütür.",
      },
    ],
    people: [
      {
        name: "Beş İskele",
        role: "Limanı paylaşan beş güç odağı",
        article: "vyssgard-kanunlari",
      },
    ],
  },
  kaldmere: {
    badge: "Son umut",
    population: "≈ 6.500",
    populationNote: "Baraka ve ocak tahmini",
    ruler: "Mahalle ocakları",
    government: "Merkezî otorite yok",
    climate: "Donmuş kıyı · av ormanları",
    exports: ["Av postu", "Odun", "Buz balığı"],
    powers: [1, 1, 1, 1],
    art: "kaldmere",
    motto: "Bir isim geldi. Yol ve su gelmedi.",
    tone: "ice",
    hooks: [
      {
        title: "Şehir mi, baraka mı?",
        text: "Kamp köy oldu, köy şehir boyutuna ulaştı. Kaldmere’in statüsü var; düzenli suyu, yolu ve kraliyet muhafızı yok.",
      },
      {
        title: "Son Lokma",
        text: "Yeni evde pişen ilk sıcak yemekten komşuya bir pay ayrılır. Farklı dualar, aynı kışın içinde yan yana durur.",
      },
      {
        title: "Buzdaki küçük pencere",
        text: "Balıkçı delik açar, avcı ormana çıkar. Getirilen beceri ve komşudan öğrenilen bilgi ilk kışı atlatmanın sermayesidir.",
      },
    ],
  },
  dorvenhall: {
    badge: "Ustaların şehri",
    population: "≈ 93.000",
    populationNote: "Şehir ve üretim mahalleleri tahmini",
    ruler: "Lord Rovan Mereth",
    government: "Lordluk ve üretici loncaları",
    climate: "Bacalar ve maden yolları",
    exports: ["Menekşespatı", "Mavi mor kiremit", "Metal işleme"],
    powers: [4, 5, 5, 4],
    art: "dorvenhall",
    motto: "Başkentin moru burada doğar.",
    tone: "ember",
    hooks: [
      {
        title: "Tuğla ve duman",
        text: "Kırmızı bacalar şehrin uzaktan görülen imzasıdır. Sur içindeki ustalık, çevredeki yollar ve madenlerle beslenir.",
      },
      {
        title: "Mor Sır Hattı",
        text: "Menekşespatı burada çıkar; renk ve kiremit hem Dorvenhall’de hem Valdareth’te işlenir.",
      },
      {
        title: "İki ayrı maden",
        text: "Saray çatısının rengi menekşespatından gelir. Karlan’ın zırh metali Veyralt başka bir cevherdir.",
      },
    ],
    people: [{ name: "Rovan Mereth", role: "Dorvenhall lordu" }],
  },
  lirendil: {
    art: "lirendil",
    badge: "Lonca kalesi",
    population: "≈ 64.000",
    populationNote: "Kent ve kale haneleri tahmini",
    ruler: "Lord Averen Dhal",
    government: "Lordluk · ÇelikKalkan loncası",
    climate: "Kıyı ve kale yolları",
    exports: ["Demircilik", "Askerî eğitim", "Kervan hizmeti"],
    powers: [4, 4, 4, 5],
    motto: "Örsün sesi, surun ardına uzanır.",
    hooks: [
      {
        title: "Örsün etrafında",
        text: "Ghorin’in demirhanesi kılıcın ilk durağıdır. Revir, arşiv ve eğitim aynı kale yaşamında birleşir.",
      },
      {
        title: "Yolun başlangıcı",
        text: "Myrran üzerinden Luthen’e çıkan kervanlar, büyük şehrin gücünü küçük kıyı yerlerine taşır.",
      },
    ],
    people: [
      { name: "Averen Dhal", role: "Şehir lordu" },
      { name: "Ghorin", role: "Demirhane ustası" },
      { name: "Zylara", role: "Lonca hekimi" },
    ],
  },
  elorwyn: {
    art: "elorwyn",
    badge: "Hanedanın şehri",
    population: "≈ 58.000",
    populationNote: "Kent içi hane tahmini",
    ruler: "Elorwynder Hanedanı",
    government: "Kalıtsal yerel hanedan",
    climate: "Güneyde surlu kent",
    exports: ["Yerel pazar", "Ruhban hizmeti", "Lonca zanaatları"],
    powers: [4, 3, 4, 4],
    motto: "Aynı taşta nesillerin mührü.",
    hooks: [
      {
        title: "Şehir ve aile",
        text: "Elorwyn, bilinen tarihi boyunca aynı hanedanın elindedir. Şehrin adı Elorwyn; yönetici ailenin adı Elorwynder’dir.",
      },
      {
        title: "Dağa uzanan hizmet",
        text: "Elorwyn ruhbanları, Theramis büyücüleriyle Marhalden’in yerel iklim düzenine yardım eder.",
      },
    ],
    people: [
      {
        name: "Elorwynder Hanedanı",
        role: "Yönetici aile",
        article: "elorwynder-hanedani",
      },
    ],
  },
  theramis: {
    art: "theramis",
    badge: "Bilginin ocağı",
    population: "≈ 38.000",
    populationNote: "Kent ve lonca çevresi tahmini",
    ruler: "Lord Elyas Theren",
    government: "Lordluk · ruhsatlı büyü loncası",
    climate: "Güneyin bilgi kenti",
    exports: ["Ruhsatlı büyü", "Araştırma", "Kâtiplik"],
    powers: [4, 3, 4, 3],
    motto: "Bilginin de bir mührü vardır.",
    hooks: [
      {
        title: "Altın Yılan",
        text: "Solan’ın büyü geleneği ve lonca yaşamı şehrin tanınan yüzüdür. Eğitim ile uygulama ruhsatı aynı şey değildir.",
      },
      {
        title: "Kıyıya giden kâtip",
        text: "Bryndon buradan Frostbay’e gider. Taş ve değirmen izleri, bildiğini sandığı geçmişi yeniden düşündürür.",
      },
    ],
    people: [
      { name: "Elyas Theren", role: "Şehir lordu" },
      { name: "Solan", role: "Başbüyücü" },
      {
        name: "Kâtip Bryndon",
        role: "Araştırmacı",
        portrait: "bryndon",
        article: "bryndon-kiyi-defteri",
      },
    ],
  },
  kethra: {
    badge: "Antrepo limanı",
    population: "≈ 29.000",
    populationNote: "Liman ve yerleşim tahmini",
    ruler: "Damian Elorwynder",
    government: "Lordluk",
    climate: "Kıyı ve çevre dağları",
    exports: ["Liman ticareti", "Depolama", "Deniz hizmeti"],
    powers: [3, 4, 3, 3],
    motto: "Her sandığın bir numarası vardır.",
    hooks: [
      {
        title: "Paslı Kanca",
        text: "Meyhane ve numaralı antrepolar aynı liman hayatının parçalarıdır. Mal, haber ve insan burada yollarını kesiştirir.",
      },
    ],
    people: [
      {
        name: "Damian Elorwynder",
        role: "Kethra lordu",
        article: "elorwynder-hanedani",
      },
    ],
  },
  brannis: {
    badge: "Yol şehri",
    population: "≈ 17.000",
    populationNote: "Göçle değişen hane tahmini",
    ruler: "Lord Varlen Neth",
    government: "Yerel lordluk",
    climate: "Kraliyet yolları çevresi",
    exports: ["Konaklama", "Erzak pazarı", "Nakliye"],
    powers: [3, 3, 2, 3],
    motto: "Yoldan gelen, şehri değiştirir.",
    hooks: [
      {
        title: "Durağın yükü",
        text: "Kervan durağı büyüyen mülteci ihtiyacını da taşır. Gelen yolcunun kalması, şehrin işini ve yerini değiştirir.",
      },
    ],
    people: [{ name: "Varlen Neth", role: "Şehir lordu" }],
  },
  myrran: {
    badge: "Kıyı durağı",
    population: "≈ 1.800",
    populationNote: "Yerleşim tahmini",
    ruler: "İskele heyeti",
    government: "Yerel kıyı idaresi",
    climate: "Lirendil yakınındaki kıyı",
    exports: ["Kervan iaşesi", "Balık"],
    powers: [2, 2, 2, 2],
    motto: "Kervanın ilk küçük durağı.",
    hooks: [
      {
        title: "Luthen’e çıkan yol",
        text: "Lirendil’den ayrılan kafileler Myrran üzerinden Luthen’e gider. Küçük yerleşim, büyük kentin yolunu yaşatır.",
      },
    ],
  },
  luthen: {
    badge: "Karakol yerleşimi",
    population: "≈ 3.200",
    populationNote: "Karakol ve hane tahmini",
    ruler: "Karakol komutanlığı",
    government: "Yerel karakol idaresi",
    climate: "Kıyı kervan yolu",
    exports: ["Kervan hizmeti", "İaşe", "Yerel ticaret"],
    powers: [3, 2, 2, 3],
    motto: "Yolun bittiği yerde nöbet başlar.",
    hooks: [
      {
        title: "Kervanın hedefi",
        text: "Myrran’dan gelen yükler ve insanlar karakol çevresine ulaşır. Kıyıdaki kent ağı burada küçük bir ölçeğe iner.",
      },
    ],
  },
};

export const powersFor = (profile: Dossier): Power[] => [
  {
    label: "İdare",
    value: profile.powers[0],
    note: "İşleyen kamu idaresi ve hizmet erişimi",
  },
  {
    label: "Ticaret",
    value: profile.powers[1],
    note: "Pazar, liman ve taşıma bağlantıları",
  },
  {
    label: "Ekonomi",
    value: profile.powers[2],
    note: "Üretim ve gelir kapasitesi; hanelerin refahıyla aynı değildir",
  },
  {
    label: "Savunma",
    value: profile.powers[3],
    note: "Tahkimat ve düzenli güvenlik; bütün sakinlere eşit koruma anlamına gelmez",
  },
];
export const artFor = (id: string, region = "danstsud"): string => {
  const primary = primaryArtwork(id);
  if (primary) return primary.src;
  const art = dossiers[id]?.art;
  if (art) return `/illustrations/${art}.webp`;
  if (
    [
      "hardlane",
      "bryndon-kiyi-defteri",
      "nera-veld",
      "kiragi-denizi",
      "hardlane-kulturu",
      "hardlane-otlak-hayvanlari",
    ].includes(id)
  )
    return "/illustrations/frostbay.webp";
  if (["ak-cam-denizi", "soluk-su", "ayaz-yutan", "kefen-denizi"].includes(id))
    return "/illustrations/ak-cam.webp";
  if (id === "cevher-cizgisi") return "/illustrations/ternhaven.webp";
  if (id === "frostmere-golu") return "/illustrations/frostmere.webp";
  if (
    [
      "karlan-daglari",
      "veyrakar",
      "aldaratac",
      "tholkar",
      "karlan-canlilari",
    ].includes(id)
  )
    return "/illustrations/karlan.webp";
  if (
    [
      "karlan-daglari",
      "veyrakar",
      "aldaratac",
      "tholkar",
      "veyralt",
      "karlan-canlilari",
      "edran-korr",
      "marhalden-uc-muhur",
      "marhalden-lordlugu",
      "frostmere-golu",
      "kemige-basan-yol",
      "kralin-yolu",
    ].includes(id)
  )
    return "/illustrations/marhalden.webp";
  if (id === "vyssgard-kanunlari") return "/illustrations/vyssgard.webp";
  if (id === "mor-sir-hatti") return "/illustrations/dorvenhall.webp";
  if (
    [
      "danstsud",
      "manorveil",
      "rilorn-korfezi",
      "eryndorn",
      "vaeranth-hanedani",
      "buyu-ruhsatlari",
      "kul-uzerine-ocak-kanunu",
      "mahrumiyet-iskan-sermaye",
    ].includes(id) ||
    id.startsWith("valdareth-")
  )
    return "/illustrations/valdareth.webp";
  return `/illustrations/region-${region}.webp`;
};

for (const [city, profile] of Object.entries(dossiers)) {
  const people = characterCards(city);
  if (people.length) profile.people = people;
  if (["brannis", "luthen", "myrran", "kethra"].includes(city)) profile.art = city;
}
dossiers.elorwyn.ruler = "Lord Tharion Elorwynder";
dossiers.frostbay.people!.push({name:'Kâtip Bryndon',role:'Kıyı araştırmacısı',portrait:'bryndon',article:'bryndon-kiyi-defteri'});

export const visualPeopleArticles: LoreArticle[] = [
  {
    id: "nera-veld",
    name: "Nera Veld",
    kind: "person",
    region: "danstsud",
    subtitle: "Frostbay’in iskele vekili",
    mapLocation: "frostbay",
    summary:
      "Dairetaş’ın posta, tartı, sınırlı gümrük ve bakım işlerini yürüten vekil. Yetkisi bütün Hardlane’e ulaşmaz; kent içinde bile kaynak ve erişim sınırları vardır.",
    sources: ["Hardlane — 8 Ekim 2026 yeni yazım"],
    related: ["frostbay", "hardlane", "bryndon-kiyi-defteri"],
    sections: [
      {
        title: "Eski taşların içindeki makam",
        paragraphs: [
          "Nera Veld’in makamı eski idare binaları kadar görkemli değildir. Postanın teslimi, tartının tutulması ve gümrük kaydının sürmesi günlük işinin ölçüsüdür. Kayıtların tamamlanması, sokakların tamamında hükmünün geçtiğini göstermez.",
        ],
      },
      {
        title: "Vekil ve nöbetbaşı",
        paragraphs: [
          "Nöbetbaşı Odran Vehl’in garnizonu, vekilin sivil işlerinden ayrı görev taşır. Şehrin büyüklüğü, sınırlı gelir ve yeni gelen hanelerin ihtiyaçları iki makamın da erişimini aşar.",
        ],
      },
    ],
  },
  {
    id: "edran-korr",
    name: "Edran Korr",
    kind: "person",
    region: "danstsud",
    subtitle: "Marhalden’in Üç Mühür lordu",
    mapLocation: "marhalden",
    summary:
      "Kazı, işleme ve satış çevrelerinin sekiz yıllık usulle seçtiği şehir lordu. Kraliyet beratı, lonca gücü ve sınırın erzak ihtiyacı aynı makamda buluşur.",
    sources: ["Marhalden — 7 Ekim 2026 yeni yazım"],
    related: [
      "marhalden",
      "marhalden-uc-muhur",
      "marhalden-lordlugu",
      "danstsud-lordluk-hukuku",
    ],
    sections: [
      {
        title: "Bir lordun üç dayanağı",
        paragraphs: [
          "Edran Korr, Üç Mühür Meclisi’nin kazı, işleme ve satış çevrelerine dayanır. Lordluk makamı seçilmiş olsa da tacın atama ve azil yetkisi devam eder. Şehrin kapısı kadar bu bağın korunması da görevin parçasıdır.",
        ],
      },
      {
        title: "Vessa Thol ve denge",
        paragraphs: [
          "Baş lonca üyesi Vessa Thol’un dört yıllık görevi, lordun sekiz yıllık süresiyle aynı değildir. İki makamın ayrılması, bir üretim kolunun bütün kararları kendi eline toplamasını sınırlayan yerel usulün parçasıdır.",
        ],
      },
    ],
  },
];

export const taxVillages: Place[] = [
  [
    "pilorn",
    "Pilorn",
    0.617,
    0.627,
    "valdareth",
    "Kraliyet havzasının kıyı ve yük durağı.",
  ],
  [
    "fehar",
    "Fehar",
    0.633,
    0.672,
    "valdareth",
    "Başkentin doğrudan tahsilat havzasındaki ova yerleşimi.",
  ],
  [
    "gaalmire",
    "Gaalmire",
    0.605,
    0.548,
    "valdareth",
    "Kraliyet kıyı havzasında küçük pazar ve taşıma yerleşimi.",
  ],
  [
    "naeron",
    "Naeron",
    0.637,
    0.72,
    "valdareth",
    "Valdareth çevresinde doğrudan krala vergi veren yerleşim.",
  ],
  [
    "fevric",
    "Fevric",
    0.635,
    0.763,
    "valdareth",
    "Başkentin ova ve iaşe havzasındaki yerleşim.",
  ],
  [
    "theld",
    "Theld",
    0.775,
    0.789,
    "valdareth",
    "Valdareth’in güney çevresinde doğrudan kraliyet vergi yerleşimi.",
  ],
  [
    "korhenden",
    "Korhenden",
    0.729,
    0.68,
    "valdareth",
    "Başkentin doğrudan vergi havzasındaki yerleşim.",
  ],
  [
    "uldar",
    "Uldar",
    0.641,
    0.799,
    "marhalden",
    "Dağların doğusunda hayvancılık ve ticaretle Marhalden’e erzak sağlayan yerleşim.",
  ],
  [
    "tolvur",
    "Tolvur",
    0.676,
    0.98,
    "marhalden",
    "Doğu yamaçlarında hayvancılık ve yük ticareti yapan yerleşim.",
  ],
  [
    "toran",
    "Toran",
    0.666,
    0.894,
    "marhalden",
    "Marhalden’in doğu erzak ve ticaret ağına bağlı yerleşim.",
  ],
  [
    "harven",
    "Harven",
    0.611,
    0.97,
    "marhalden",
    "Hardlane’de Marhalden garnizonuyla korunan av ve odun yerleşimi.",
  ],
  [
    "mavric",
    "Mavric",
    0.546,
    0.918,
    "marhalden",
    "Hardlane’de tarımsız, av ve odunculuğa dayanan Marhalden bağlı yerleşimi.",
  ],
].map(([id, name, x, y, lordship, summary]) => ({
  id: id as string,
  name: name as string,
  region: "danstsud",
  point: [x as number, y as number],
  kind: "settlement",
  positionStatus: "approximate",
  subregion: ["harven", "mavric"].includes(id as string)
    ? "hardlane"
    : undefined,
  subtitle: `${lordship === "valdareth" ? "Kraliyet" : "Marhalden"} vergi yerleşimi`,
  summary: summary as string,
  sources: [
    "7 Ekim 2026 vergi yerleşimleri",
    "8 Ekim 2026 yaklaşık atlas yerleşimi",
  ],
  related: [
    lordship as string,
    `${lordship === "valdareth" ? "valdareth-vergi-havzasi" : "marhalden-lordlugu"}`,
  ],
  sections: [
    {
      title: "Vergi ve bağlılık",
      paragraphs: [
        summary as string,
        lordship === "valdareth"
          ? "Tahsilat yerel bir lord yerine doğrudan Valdareth’in kraliyet düzenine gider."
          : "Vergi Marhalden lordluğuna verilir. Geçit kentinin güvenlik ve erzak ağı, bu bağlılığı somutlaştırır.",
      ],
    },
    {
      title: "Haritada bul",
      paragraphs: [
        "Yerleşimin atlas işareti yaklaşık konumu gösterir. Yerel adların eski harita yazımlarıyla eşleştirilmesi ve kesin konumları geliştirilirken bu işaret bir yön bulma noktasıdır.",
      ],
    },
  ],
}));

for (const place of taxVillages) {
  const life = villageLife[place.id];
  if (!life) continue;
  const royal = ['pilorn','fehar','gaalmire','naeron','fevric','theld','korhenden'].includes(place.id);
  const ruler = royal ? 'Eryndorn Vaeranth' : 'Edran Korr';
  place.sections = [place.sections![0], { title: life.title, paragraphs: [life.scene] }, { title: 'Geçimin kırılgan tarafı', paragraphs: [life.tension] }];
  place.sources!.push('8 Ekim 2026 yerleşim yaşamı · yeni yazım ve nüfus taslakları');
  dossiers[place.id] = {
    badge: royal ? 'Kraliyet vergi yerleşimi' : 'Marhalden bağlı yerleşimi',
    population: life.population, populationNote: 'Kurgu nüfus taslağı · sayım kaydı değildir', ruler,
    government: royal ? 'Doğrudan kraliyet tahsilatı' : 'Marhalden lordluğuna bağlılık',
    climate: life.hardlane ? 'Hardlane · sert orman iklimi' : royal ? 'Valdareth ova havzası' : 'Karlan’ın doğu yamaçları',
    exports: life.exports, powers: life.hardlane ? [2,1,1,3] : [2,2,2,1], art: place.id,
    motto: life.title,
    hooks: [{title: 'Geçim', text: life.scene.split('. ')[0] + '.'}, {title: 'Bağlılık',text: royal ? 'Vergi doğrudan Valdareth’in kraliyet düzenine gider.' : 'Marhalden’in erzak ve güvenlik ağına bağlıdır.'}],
    people: [{name:ruler,role:royal?'Kraliyet otoritesi':'Bağlı olunan lord',article:royal?'eryndorn':'edran-korr',portrait:royal?'eryndorn':'edran-korr'}],
  };
}
