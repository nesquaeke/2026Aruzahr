import type { LoreArticle } from '../data'

// Public court and law records. Family identities kept in the author documents
// are deliberately absent: do not import the author family tree into this module.
const canonSource = 'Danstsud kanonu — 7 Ekim 2026 tarihli yazar kararları'
const newWritingSource = 'Danstsud: hanedanlar ve büyü hukuku — 7 Ekim 2026 yeni yazım'
const openingSource = '21.11.2025 aruzhar bolum 1.docx — genel kişiler ve kurumlar'

export const danstsudArticles: LoreArticle[] = [
  {
    id: 'vaeranth-hanedani', name: 'Vaeranth Hanedanı', kind: 'dynasty', region: 'danstsud',
    subtitle: 'Valdareth’in kraliyet ailesi', mapLocation: 'valdareth',
    summary: 'Danstsud’un güncel kraliyet hanedanı. Kral Eryndorn Vaeranth, babası Caedren’in ardından tahtta bulunur. Kraliçe Alisande, Leydi Mirelda ve Prenses Ilyenne, hanedanın saray yaşamındaki diğer üyeleridir.',
    sources: [canonSource, newWritingSource], aliases: ['Vaeranth ailesi', 'kraliyet ailesi'],
    related: ['valdareth', 'eryndorn', 'manorveil', 'elorwynder-hanedani'],
    sections: [
      { title: 'Tahtın yakın geçmişi', paragraphs: [
        'Vaeranth, Danstsud’un güncel kraliyet ailesinin adıdır. Eryndorn’un babası Caedren önceki hükümdardır; Caedren ve eşi Isolde ölmüştür. Eryndorn’un tahtı, bu yakın aile geçmişi üzerinden sarayın hafızasına bağlanır.',
        'Caedren ile Isolde’nin çocukları Eryndorn ve Mirelda’dır. Kralın küçük kız kardeşi Mirelda, saray ile lord aileleri arasındaki görüşmelerde hanedanı temsil eder. Bu görevi ona ilişkiler ve anlaşmazlıklar hakkında doğrudan bilgi kazandırır.',
      ] },
      { title: 'Alisande ve Ilyenne', paragraphs: [
        'Kraliçe Alisande, Eryndorn’un eşidir. Sarayın erzak, yardım ve harcama ihtiyaçlarını izler. Bir araştırmanın ya da büyük emrin maliyetini yalnızca saray defterleriyle değil, kentin günlük ihtiyaçlarıyla da değerlendiren bir kişidir.',
        'Eryndorn ve Alisande’nin kızı Prenses Ilyenne genç yetişkindir. Sarayda yerel yönetim, kayıt ve hukuk konularını öğrenir. Aile içindeki konumu, ülkenin yönetimini öğrenmesine imkân verir; kişisel geleceği ise taht hakkının nasıl tanımlanacağıyla da ilişkilidir.',
      ] },
      { title: 'Bilinen erkek varisin yokluğu', paragraphs: [
        'Eryndorn’un bilinen bir erkek varisi yoktur. Hanedanın halka açık meşru çocuğu Ilyenne’dir. Bu durum sarayın geleceğiyle ilgili tartışmalarda belirgin bir unsur oluşturur.',
        'Ilyenne’nin ailedeki yeri ile resmen belirlenmiş bir veliaht olmak farklı durumlardır. Kraliyet ailesi, yaşayan üyeleri ve mevcut hükümdarıyla tanınır; gelecekte tacın kime geçeceği, yalnızca bir kişinin cinsiyetinden çıkarılabilecek bir cevap değildir.',
      ] },
      { title: 'Kraliyet ve yerel hanedanlar', paragraphs: [
        'Manorveil doğrudan kraliyet topraklarıdır ve vergisi krala toplanır. Danstsud’un diğer lordluklarında yerel hanedanlar kendi yönetim güçlerini taşır. Tahtın ailesi ile bir şehri yöneten lord ailesi bu feodal yapıda farklı makamları temsil eder.',
        'Elorwyn şehrini yöneten Elorwynder Hanedanı bu yerel sürekliliğin örneklerindendir. Vaeranth ile Elorwynder ayrı hanedan adlarıdır; şehir adı Elorwyn olarak kalır.',
      ] },
    ],
  },
  {
    id: 'eryndorn', name: 'Eryndorn Vaeranth', kind: 'person', region: 'danstsud',
    subtitle: 'Danstsud’un hüküm süren kralı', mapLocation: 'valdareth',
    summary: 'Vaeranth Hanedanı’ndan Kral Eryndorn, Valdareth’te hüküm sürer. Bilgiye ve araştırmaya verdiği önem, kraliyet yönetiminin sert uygulamalarıyla birlikte onun hükümdarlığının tanınan yönleridir.',
    sources: [canonSource, newWritingSource, openingSource], aliases: ['Kral Eryndorn'],
    related: ['valdareth', 'vaeranth-hanedani', 'manorveil', 'buyu-ruhsatlari'],
    sections: [
      { title: 'Vaeranth kralı', paragraphs: [
        'Eryndorn, Caedren ve Isolde Vaeranth’ın oğludur. Babası önceki hükümdardır. Eryndorn’un eşi Alisande, kızı Ilyenne ve küçük kız kardeşi Mirelda saray ailesini oluşturur.',
        'Bilinen erkek varisinin olmaması, hükümdarlığının geleceğiyle ilgili tartışmalarda yer tutar. Ilyenne’nin varlığı bu aile kaydının parçasıdır; kralın gelecekteki halefi burada kesinleştirilmiş bir kişi olarak anlatılmaz.',
      ] },
      { title: 'Bilgi ve hükümdarlık', paragraphs: [
        'Eryndorn zeki ve bilgi arayışına büyük önem veren bir hükümdardır. Araştırma, onun ilgisini geçici bir uğraştan çok daha fazla meşgul eder. Bu arayışın yorgunluğu hükümdarın görünümünde ve çalışma düzeninde hissedilir.',
        'Krallıkta onu herkes aynı biçimde değerlendirmez. Bazıları sarayın sertliğini ve ağır baskısını “deli kral” ifadesiyle anlatır. Bu adlandırma, farklı kişilerin hükümdara ilişkin yargısını taşır.',
      ] },
      { title: 'Yetkinin eriştiği yerler', paragraphs: [
        'Manorveil’de vergi doğrudan kralın otoritesine toplanır. Lordluk arazilerinde tahsilatı lordlar yürütür. Eryndorn’un tacı aynı ülkenin üzerinde bulunurken yönetim her bölgede aynı ölçüde işlemez.',
        'Karlan Dağları’nın Hardlane tarafında kraliyet erişimi zayıftır. Frostbay’in sınırlı idaresi ile Valdareth’in merkezî düzeni arasındaki fark, krallığın günlük yönetiminin eşit dağılmadığını gösterir.',
      ] },
    ],
  },
  {
    id: 'elorwynder-hanedani', name: 'Elorwynder Hanedanı', kind: 'dynasty', region: 'danstsud',
    subtitle: 'Elorwyn’in süreklilik taşıyan yönetici ailesi', mapLocation: 'elorwyn',
    summary: 'Elorwyn şehrinin bilinen tarihi boyunca yönetimini elinde tutan hanedan. Elorwynder aile adıdır; Elorwyn şehir adıdır. Elorwyn’i Lord Tharion yönetir; Kethra lordu Damian aynı hanedanın mensubudur.',
    sources: [canonSource, newWritingSource, openingSource],
    aliases: ['Elorwyn Hanedanı', 'Elorwyn ailesi', 'Tharion Elorwyn', 'Damian Elorwyn', 'Tharion Elorwynder', 'Damian Elorwynder'],
    related: ['elorwyn', 'kethra', 'tharion', 'damian', 'aveline', 'rook', 'vaeranth-hanedani', 'danstsud'],
    sections: [
      { title: 'Şehirle birlikte anılan soy', paragraphs: [
        'Elorwyn’in yönetim tarihi aynı aileyle süreklilik gösterir. Şehir hep bu hanedanın yönetiminde kalmıştır. Bu yüzden yerel yönetimin geçmişi ile ailenin geçmişi birbirinden kolayca ayrılmaz.',
        'Güncel aile adı Elorwynder’dir. Şehrin adı Elorwyn olarak kullanılır. Daha eski anlatılarda Tharion ve Damian’ın aile adı Elorwyn şeklinde de geçer.',
      ] },
      { title: 'Tharion ve Damian', paragraphs: [
        'Lord Tharion Elorwynder, Elorwyn’in güncel yöneticisidir. Lord Damian Elorwynder, Kethra lordudur; böylece aile adı Elorwyn dışında başka bir şehirle de ilişkilidir.',
        'Bir hanedana ait olmak, aile üyelerinin aynı makamı veya aynı çıkarı taşıdığı anlamına gelmez. Elorwynder adı yerel bir yönetim geçmişini ve birden çok siyasi kişiyi bir araya getirir.',
      ] },
      { title: 'Danstsud’un feodal düzeni', paragraphs: [
        'Vaeranth kraliyet ailesi ile Elorwynder şehrin yönetici ailesi ayrı kayıtlardır. Danstsud’da doğrudan kraliyet toprakları ve lordların vergi topladığı araziler aynı feodal krallığın içinde bulunur.',
        'Elorwyn’in hanedan sürekliliği, krallığın yalnızca başkentteki hükümdardan oluşmadığını gösterir. Kentin kendi yönetim geçmişi ve yerel iktidarı vardır.',
      ] },
    ],
  },
  {
    id: 'buyu-ruhsatlari', name: 'Büyü Ruhsatları', kind: 'law', region: 'danstsud',
    subtitle: 'Danstsud’da yasal uygulama ve denetim', mapLocation: 'valdareth',
    summary: 'Danstsud’da eğitimli ve ruhsatlı büyücüler okul dışında da yasal hizmet verebilir. İzinsiz uygulama ve kurban ritüelleri yasaktır. Kraliyet Büyü Sicili, uygulayıcıyı ve izin verilen hizmet alanını kaydeder.',
    sources: [canonSource, newWritingSource, 'Valhunar.pdf — büyünün bedeli ve denetimli okullar'],
    aliases: ['büyü hukuku', 'ruhsatlı büyü', 'Kraliyet Büyü Sicili'],
    related: ['valdareth', 'theramis', 'lirendil', 'hardlane', 'eryndorn'],
    sections: [
      { title: 'Eğitim ve uygulama izni', paragraphs: [
        'Büyü eğitimi almak ile yasal uygulama ruhsatı taşımak ayrı durumlardır. Geçerli ruhsatı olan eğitimli büyücü, izin verilen alan içinde okul dışında da hizmet verebilir. İzinsiz uygulama yasaktır.',
        'Şifa, koruma veya başka bir büyü hizmetinin hukuk karşısındaki durumu, nerede yapıldığından önce uygulayıcının izin kapsamıyla ilgilidir. Ruhsat her tür uygulama için sınırsız yetki vermez.',
      ] },
      { title: 'Elorwyn’in katı yerel uygulaması', paragraphs: ['Elorwyn, büyüye Danstsud’un en katı yaklaşan kentidir. Yerel gelenek, kamusal büyü gösterilerini yasaklar; ruhsatlı hizmetlerin uygulanmasını da sıkı denetler. Krallıkta ruhsatın varlığı, kentte her kapının aynı kolaylıkla açılacağı anlamına gelmez.', 'Ruhban görevi veya paladin kimliği, yapılan her işin büyü olduğu anlamına gelmez. Gerçek büyü uygulaması varsa izin kapsamı ve yerel denetim birlikte değerlendirilir. Elorwynli birinin Lirendil akademisinde çalışması da iki şehrin aynı kültürel tutuma sahip olduğunu göstermez.'] },
      { title: 'Kraliyet Büyü Sicili', paragraphs: [
        'Merkez kaydı Valdareth’te tutulan Kraliyet Büyü Sicili, uygulayıcının adını, eğitimini doğrulayan kurum veya ustayı ve izin verilen hizmet alanını kaydeder. Bir okulun eğitim belgesi, tek başına uygulama ruhsatının yerine geçmez.',
        'Büyü hizmeti alan kişi, uygulayıcının ruhsatını kontrol ettirebilir. Lordlukların yerel görevlileri de ruhsatı denetleyebilir. Kural aynı krallığın bütününde geçerlidir; denetimin fiilî gücü yönetimin erişimine bağlıdır.',
      ] },
      { title: 'Ruhsatın izin vermediği şeyler', paragraphs: [
        'İzinsiz büyü kullanımı ve ruhsat kapsamı dışındaki hizmet yasal değildir. Büyüye güç sağlamak için canlı kurban veya başkasının yaşamını soğurma ise ruhsatla da yasal hâle gelmez.',
        'Sıradan dua, büyü içermeyen bakım veya zanaat, yalnızca tapınak ya da lonca çevresinde yapıldığı için büyü uygulaması sayılmaz. Gerçek büyü kullanımı varsa kurumun adı uygulama izninin yerine geçmez.',
      ] },
      { title: 'Loncalar, şifacılar ve tapınaklar', paragraphs: [
        'Theramis gibi büyücülerin yer aldığı bir lonca, ruhsatlı üyeleri aracılığıyla yasal hizmet verebilir. Lonca üyeliği tek başına ruhsat değildir. Aynı ayrım tapınak görevlileri için de geçerlidir.',
        'Büyüyle yapılan tedavi ruhsat kapsamına girer. Büyü içermeyen hekimlik ve sıradan ilaç hazırlama, aynı uygulama biçimi değildir. Bir şifacının her işini büyü diye sınıflandırmak doğru olmaz.',
      ] },
      { title: 'Kırılma’nın mirası ve bölgesel erişim', paragraphs: [
        'Büyük Kırılma’nın bıraktığı büyü korkusu, denetimli eğitim ve kayıt düzeninin tarihsel arka planıdır. Büyünün öğrenilebilir ve yararlı olması, tehlikeli uygulamaların denetimsiz bırakıldığı anlamına gelmez.',
        'Hardlane de aynı krallık hukukunun içindedir. Fakat Karlan’ın bu tarafındaki zayıf kraliyet erişimi, denetimin gündelik hayatta daha az işlemesine yol açar. Yazılı kural ile gerçekten yürüyen idare arasındaki fark burada büyü hizmetlerinde de görünür olur.',
      ] },
    ],
  },
]
