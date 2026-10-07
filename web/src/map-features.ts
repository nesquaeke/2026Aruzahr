import type { LoreArticle, RegionId } from "./data";

export type MapFeature = {
  id: string;
  name: string;
  kind: "sea" | "lake" | "mountain" | "bay" | "route";
  region: RegionId;
  point: [number, number];
  box: [number, number, number, number];
  article: string;
  summary: string;
  fact: string;
  paths?: [number, number][][];
  status?: "open" | "dangerous" | "planned";
};
// The author's spatial descriptions guide these approximate label anchors and
// schematic routes. They do not replace the original map or survey boundaries.
export const mapFeatures: MapFeature[] = [
  {
    id: "ak-cam-denizi",
    name: "Ak Cam Denizi",
    kind: "sea",
    region: "danstsud",
    point: [0.439, 0.706],
    box: [0.395, 0.655, 0.18, 0.17],
    article: "ak-cam-denizi",
    summary:
      "Ternhaven ve Dranthol önündeki açık su. Sürüklenen buz ve soğuk, donmamış denizde de gemileri sınar.",
    fact: "Açık su · kıyı ticareti",
    status: "open",
  },
  {
    id: "soluk-su",
    name: "Soluk Su",
    kind: "sea",
    region: "danstsud",
    point: [0.479, 0.752],
    box: [0.42, 0.705, 0.15, 0.13],
    article: "soluk-su",
    summary:
      "Ternhaven ile Dranthol arasındaki sisli ve kayalık kıyı. Rüzgâr gemileri karaya sürebilir.",
    fact: "Sis · kayalık · sürüklenme",
    status: "dangerous",
  },
  {
    id: "ayaz-yutan",
    name: "Ayaz Yutan",
    kind: "sea",
    region: "danstsud",
    point: [0.42, 0.817],
    box: [0.373, 0.772, 0.16, 0.12],
    article: "ayaz-yutan",
    summary:
      "Dranthol’un aşağısındaki boğaz. Açık suyun ardından donmuş deniz koşulları ağırlaşır.",
    fact: "Don eşiği · boğaz",
    status: "dangerous",
  },
  {
    id: "kiragi-denizi",
    name: "Kırağı · Son Nefes Denizi",
    kind: "sea",
    region: "danstsud",
    point: [0.377, 0.896],
    box: [0.31, 0.8, 0.18, 0.2],
    article: "kiragi-denizi",
    summary:
      "Honud ile Danstsud arasındaki donmuş deniz. Çatlaklar ve hızlı akıntı yüzünden yürünebilir bir köprü değildir.",
    fact: "Hareketli buz · aşırı tehlikeli",
    status: "dangerous",
  },
  {
    id: "kefen-denizi",
    name: "Kefen Denizi",
    kind: "sea",
    region: "danstsud",
    point: [0.977, 0.87],
    box: [0.87, 0.72, 0.13, 0.28],
    article: "kefen-denizi",
    summary:
      "Doğuya bakan kıyının ayrı don örtüsü. Kopuk buzları kıyı akıntılarıyla başka sulara taşınır.",
    fact: "Ayrı buz örtüsü",
    status: "dangerous",
  },
  {
    id: "frostmere-golu",
    name: "Frostmere Gölü",
    kind: "lake",
    region: "danstsud",
    point: [0.565, 0.843],
    box: [0.49, 0.77, 0.16, 0.16],
    article: "frostmere-golu",
    summary:
      "Batı Aldara’nın döküldüğü göl. Yılın yaklaşık yarısı donuk, yarısı açık sudur.",
    fact: "Altı ay buz · Batı Aldara",
  },
  {
    id: "veyrakar",
    name: "Veyrakar",
    kind: "mountain",
    region: "danstsud",
    point: [0.555, 0.765],
    box: [0.515, 0.725, 0.105, 0.12],
    article: "karlan-daglari",
    summary:
      "Karlan’ın en yüksek kuzey zirvesi; Velthar ve Brolin çevresine bakar.",
    fact: "13.000 m · kuzey zirvesi",
  },
  {
    id: "aldaratac",
    name: "Aldarataç",
    kind: "mountain",
    region: "danstsud",
    point: [0.59, 0.804],
    box: [0.54, 0.755, 0.13, 0.14],
    article: "karlan-daglari",
    summary:
      "Marhalden Dağı’nın orta kütlesindeki zirve. Aldara’nın iki kolu ortak buzul kaynak alanından doğar.",
    fact: "8.400 m · buzul kaynakları",
  },
  {
    id: "tholkar",
    name: "Tholkar",
    kind: "mountain",
    region: "danstsud",
    point: [0.576, 0.958],
    box: [0.52, 0.87, 0.17, 0.13],
    article: "karlan-daglari",
    summary: "Harven ve Tolvur çevresine bakan güney Karlan kütlesi.",
    fact: "11.200 m · güney zirvesi",
  },
  {
    id: "rilorn-korfezi",
    name: "Rilorn Körfezi",
    kind: "bay",
    region: "danstsud",
    point: [0.594, 0.64],
    box: [0.55, 0.595, 0.17, 0.15],
    article: "valdareth",
    summary:
      "Mor Donanma’nın beklediği korunaklı körfez. Başkentin deniz gücünün sığınağı.",
    fact: "Mor Donanma · güvenli demirleme",
  },
  {
    id: "brolin-korfezi",
    name: "Brolin Körfezi",
    kind: "bay",
    region: "danstsud",
    point: [0.571, 0.713],
    box: [0.52, 0.67, 0.16, 0.14],
    article: "karlan-daglari",
    summary:
      "Kuzey Karlan çevresindeki körfez; Veyrakar’ın baktığı kıyı alanlarından.",
    fact: "Karlan’ın kuzey kıyısı",
  },
  {
    id: "kemige-basan-yol",
    name: "Kemiğe Basan Yol",
    kind: "route",
    region: "danstsud",
    point: [0.534, 0.849],
    box: [0.4, 0.68, 0.27, 0.25],
    article: "kemige-basan-yol",
    summary:
      "Ternhaven, Dranthol ve Frostbay’i Marhalden’e bağlayan uzun, güvensiz gayriresmî yük hattı.",
    fact: "Gayriresmî · uzun · güvensiz",
    status: "dangerous",
    paths: [
      [
        [0.52, 0.736],
        [0.513, 0.755],
        [0.483, 0.766],
        [0.45, 0.794],
        [0.461, 0.81],
        [0.478, 0.824],
        [0.514, 0.835],
        [0.55, 0.85],
        [0.586, 0.851],
        [0.61, 0.853],
      ],
    ],
  },
  {
    id: "cevher-cizgisi",
    name: "Cevher Çizgisi",
    kind: "route",
    region: "danstsud",
    point: [0.566, 0.787],
    box: [0.47, 0.7, 0.19, 0.2],
    article: "cevher-cizgisi",
    summary:
      "Ternhaven–Marhalden yol projesi. Hayata geçmedi; çizgi planlanan bağlantıyı gösterir.",
    fact: "Planlandı · inşa edilmedi",
    status: "planned",
    paths: [
      [
        [0.52, 0.736],
        [0.55, 0.753],
        [0.569, 0.791],
        [0.59, 0.82],
        [0.61, 0.853],
      ],
    ],
  },
  {
    id: "kralin-yolu",
    name: "Kralın Yolu",
    kind: "route",
    region: "danstsud",
    point: [0.654, 0.804],
    box: [0.56, 0.66, 0.19, 0.25],
    article: "kralin-yolu",
    summary:
      "Kraliyet merkezinden Marhalden eşiğine uzanan kara bağlantısı. Bakımlı yol Hardlane’in batı şehirlerine devam etmez.",
    fact: "Kraliyet yolu · Marhalden’de biter",
    status: "open",
    paths: [
      [
        [0.734, 0.667],
        [0.699, 0.694],
        [0.679, 0.75],
        [0.658, 0.8],
        [0.65, 0.831],
        [0.61, 0.853],
      ],
    ],
  },
  {
    id: "mor-sir-hatti",
    name: "Mor Sır Hattı",
    kind: "route",
    region: "danstsud",
    point: [0.741, 0.62],
    box: [0.62, 0.49, 0.22, 0.31],
    article: "mor-sir-hatti",
    summary:
      "Dorvenhall menekşespatını ve kiremit ustalığını Valdareth saraylarına bağlayan ticaret zinciri.",
    fact: "Menekşespatı · saray kiremitleri",
    status: "open",
    paths: [
      [
        [0.782, 0.553],
        [0.763, 0.577],
        [0.749, 0.61],
        [0.734, 0.667],
      ],
    ],
  },
  {
    id: "myrran-luthen-yolu",
    name: "Myrran–Luthen Yolu",
    kind: "route",
    region: "danstsud",
    point: [0.456, 0.498],
    box: [0.32, 0.41, 0.24, 0.17],
    article: "myrran-luthen-yolu",
    summary:
      "Lirendil’den Myrran üzerinden Luthen’e giden kıyı kervan bağlantısı.",
    fact: "Kervan · kıyı yerleşimleri",
    status: "open",
    paths: [
      [
        [0.367, 0.446],
        [0.431, 0.485],
        [0.458, 0.493],
        [0.482, 0.497],
      ],
    ],
  },
];
export const featureById = (id: string) =>
  mapFeatures.find((feature) => feature.id === id);
export const featureLabels = {
  sea: "Deniz",
  lake: "Göl",
  mountain: "Zirve",
  bay: "Körfez",
  route: "Ticaret yolu",
};
export const atlasRouteArticles: LoreArticle[] = mapFeatures
  .filter((f) =>
    ["kralin-yolu", "mor-sir-hatti", "myrran-luthen-yolu"].includes(f.id),
  )
  .map((feature) => ({
    id: feature.id,
    name: feature.name,
    kind: "geography",
    region: feature.region,
    subtitle: feature.fact,
    summary: feature.summary,
    mapLocation: feature.id,
    sources: [
      "Danstsud genel ulaşım ve üretim lore’u",
      "8 Ekim 2026 görsel atlas yazımı",
    ],
    related:
      feature.id === "mor-sir-hatti"
        ? ["dorvenhall", "valdareth", "valdareth-loncalari"]
        : feature.id === "kralin-yolu"
          ? ["valdareth", "marhalden", "kemige-basan-yol"]
          : ["lirendil", "myrran", "luthen"],
    sections: [
      {
        title: "Yolun taşıdığı hayat",
        paragraphs: [
          feature.summary,
          feature.id === "mor-sir-hatti"
            ? "Mor Sır Hattı, tek bir yeni devlet yolunun resmî adı yerine üretim ve taşıma zincirinin atlas adıdır. Maden, arıtma, pişirme ve saray işi iki şehirdeki farklı ustaların emeğine dayanır."
            : feature.id === "kralin-yolu"
              ? "Marhalden’in batısında Kemiğe Basan Yol gibi gayriresmî güzergâhlar kullanılır. Kraliyet yolunun varlığı, Hardlane’e ikinci güvenilir dağ geçidi açmaz."
              : "Kervanlar büyük kale kentinden küçük kıyı duraklarına uzanır. Konaklama, yiyecek ve karakol hizmetleri bu hattın gündelik işidir.",
        ],
      },
      {
        title: "Haritada izini sür",
        paragraphs: [
          "Atlas çizgisi bağlantıyı şematik olarak gösterir. Etapların kesin ölçüsü, mevsimlik kullanılabilirliği ve yol güvenliği yalnız bu çizgiden çıkarılamaz.",
        ],
      },
    ],
  }));
