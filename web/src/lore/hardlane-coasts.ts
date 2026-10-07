import type { LoreArticle } from '../data'
import { hardlaneSources } from './hardlane'

export const hardlaneCoastArticles: LoreArticle[] = [
  {
    id: 'kemige-basan-yol', name: 'Kemiğe Basan Yol', kind: 'geography', region: 'danstsud', mapLocation: 'marhalden',
    subtitle: 'Dört şehri bağlayan uzun ve güvensiz geçim hattı',
    summary: 'Ternhaven, Dranthol ve Frostbay’i Marhalden’e bağlayan gayriresmî güzergâhlar bütünü. Hardlane’e erzak taşır; tamamlanmış bir kraliyet yolu sayılmaz.',
    aliases: ['Kemiğe Basan', 'Hardlane ticaret yolu'], sources: hardlaneSources,
    related: ['hardlane', 'marhalden', 'ternhaven', 'dranthol', 'frostbay', 'cevher-cizgisi', 'karlan-daglari'],
    sections: [
      { title: 'Tek adın altındaki yollar', paragraphs: ['Kemiğe Basan Yol, her yerinde aynı genişliği ve zemini bulunan bir şose değildir. Kıyı patikaları, eski oduncu izleri, yük hayvanlarının açtığı dar geçitler ve Marhalden’in denetlediği yaklaşım hattı, tüccarların dilinde bu tek ad altında birleşir. Yol Ternhaven, Dranthol ve Frostbay arasında dolaşarak Marhalden’e ulaşır; hava ve kıyının durumu kullanılan kesimleri değiştirebilir.', 'Adının kökeni hakkında yolcular ayrı hikâyeler anlatır. Kimi, kar altında kırılmış yük hayvanı kemiklerine; kimi, aylarca yürüdükten sonra kendi kemiklerinin üzerine basıyor gibi hisseden hamallara bağlar. Güzergâhın tek bir kurucusu veya tek bir açılış günü yoktur.'] },
      { title: 'Geçidin gölgesinde', paragraphs: ['Marhalden, Karlan üzerinden düzenli kara ulaşımının bilinen tek güvenilir eşiğidir. Kemiğe Basan Yol da bu eşiğe dayanır; dağları aşan ikinci bir güvenli geçit oluşturmaz. Kralın Yolu Marhalden’de biter. Batıdaki yük taşımacılığı, kendi bakımını ve korumasını büyük ölçüde kendisi karşılar.', 'Marhalden’in mültecilere kapalı olması, kabul edilen tüccarların ve erzak yüklerinin hiç geçemediği anlamına gelmez. Aynı kafiledeki un çuvalı kayıtla içeri alınabilirken yanında yürüyen aile geri çevrilebilir. Yol üzerindeki en ağır çekişmelerden biri bu ayrımdır.'] },
      { title: 'Pahalı bir çuval un', paragraphs: ['Tüccarlar çoğu zaman birkaç hanenin siparişini birleştirir. Tuz, tahıl, bez, alet ve ocak yakıtı batıya; balık, deri, odun ve kıyıda el değiştiren başka mallar doğuya taşınır. Bozulan kızaklar, kaybolan hayvanlar ve ücretli korumalar, malın son fiyatına eklenir.', 'Bir kafilenin varmış olması sonrakinin güvenli geleceğini göstermez. Kar, sis, kıyıdan gelen buz yığınları ve yol kesen silahlı gruplar bekleme sürelerini uzatır. Yol, Hardlane’in bütün nüfusuna ucuz ve düzenli erzak sağlayacak kapasitede değildir.'] },
      { title: 'Yol evlerinin sözü', paragraphs: ['Yolun bazı duraklarında haneler, boş bir köşeyi gelen yolcuya ayırır. Ocak Hatırı, yiyeceğin ve yakacağın yeterli olduğu ölçüde ilk geceyi paylaşmayı öğütler. Misafirin kimliği hakkındaki korku ve ev sahibinin yoksulluğu bu geleneği zayıflatabilir; her durak açık bir han değildir.', 'Kafile başları köprüye benzeyen her tahta döşemeyi, yazın kullanılan her dere geçişini ve güvenilir her ocağı isimle hatırlar. Yazılı tariflerin hızla eskidiği bu yolda yaşayan hafıza, harita kadar değerlidir.'] },
      { title: 'Cevher Çizgisi’nin yerine', paragraphs: ['Cevher Çizgisi’nin kurulması, bu dağınık hattın en ağır yüklerini azaltacaktı. Projenin gerçekleşmemesiyle Kemiğe Basan Yol zorunlu olarak kullanılmaya devam etti. Güzergâhın varlığı, Hardlane’in ulaşım sorununun çözüldüğünü göstermez; sorunun ne kadar pahalıya taşınabildiğini gösterir.'] },
    ],
  },
  {
    id: 'cevher-cizgisi', name: 'Cevher Çizgisi', kind: 'geography', region: 'danstsud', mapLocation: 'ternhaven',
    subtitle: 'Ternhaven ile Marhalden arasında kâğıtta kalan yol',
    summary: 'Marhalden’in geçidini Ternhaven’e düzenli ulaşım ve bakım hattıyla bağlaması beklenen proje. Yol hiçbir zaman hayata geçirilmedi.',
    aliases: ['Cevher Çizgisi yolu', 'Ternhaven Marhalden yol projesi'], sources: hardlaneSources,
    related: ['ternhaven', 'marhalden', 'kemige-basan-yol', 'mahrumiyet-iskan-sermaye', 'vyssgard', 'hardlane'],
    sections: [
      { title: 'Cevher kadar önemli tahıl', paragraphs: ['Cevher Çizgisi adı, yolun maden ticaretini besleyeceği umudundan gelir. Ancak Hardlane haneleri için daha büyük vaat, tahılın ve yakacağın düzenli taşınmasıydı. Marhalden ile Ternhaven arasında bakım gören bir yük hattı; at değiştirme yerleri, kış depoları ve denetlenen geçişlerle birlikte düşünülmüştü.', 'Ternhaven’in ılıman küçük tarım alanları bütün Hardlane’i doyuramaz. Yolun açılması şehrin dışarıdan erzak ve alet almasını, karşılığında kendi ürünlerini daha düşük taşıma maliyetiyle satmasını sağlayacaktı.'] },
      { title: 'Tahsis bir yol değildir', paragraphs: ['İskân ve sermaye reformunun kayıtlarında bir güzergâha ödenek ayrılması, o güzergâhın açıldığı anlamına gelmez. Cevher Çizgisi için konuşulan finansman ve tasarılar, sürekli kullanılabilir bir yol olarak teslim edilmedi. Bugün adı bir beklentiyi taşır.', 'Köprü, drenaj, istinat, konaklama, güvenlik ve yıllık bakım birbirinden ayrı giderlerdir. Yalnızca ilk taşları satın almak, kışın geçilebilir bir hat kurmaya yetmez.'] },
      { title: 'Birbirini bekleyen makamlar', paragraphs: ['Marhalden’in giriş kısıtlamaları işgücü ve yerleşim düzenini güçleştirirken Vyssgard çevresindeki suç grupları, nakliye ve liman işlerini daha riskli hâle getirdi. Başkentteki iaşe sıkıntıları ve idari çekişmeler de fonların ve kararların devamlılığını sarstı.', 'Marhalden bakımın sınır lordluğuna yüklenmesine itiraz eder; kıyıdaki yöneticiler, hiç teslim alınmayan yol için gelir ayıramayacaklarını söyler. Bu karşılıklı bekleyişte ilk yatırımın kim tarafından korunacağı sorusu dahi çözülemez.'] },
      { title: 'Kaçırılan fırsat', paragraphs: ['Düzenli yol, Ternhaven’in üretimini büyütebilir; Dranthol’un askerî güvenliğini daha canlı bir ticaretle tamamlayabilir; Frostbay’in erzak baskısını hafifletebilirdi. Bunlar gerçekleşmiş sonuçlar değildir. Yolun açılması tek başına limanları, çeteleri veya Karlan’ın kışını ortadan kaldırmayacaktı.', 'Bugün aynı ihtiyaçları uzun ve güvensiz Kemiğe Basan Yol taşır. Ternhaven’de “çizgi” sözcüğü bu yüzden hem umutla hem kırgınlıkla söylenir: insanların hayatına değmeden kalan düzgün bir kâğıt çizgisi.'] },
    ],
  },
  {
    id: 'ak-cam-denizi', name: 'Ak Cam Denizi', kind: 'geography', region: 'danstsud', mapLocation: 'ternhaven',
    subtitle: 'Ternhaven ve Dranthol önündeki açık su',
    summary: 'Hardlane’in Ternhaven ve Dranthol kıyılarında donmamış kalan deniz. Açık suyu ticarete imkân verir; sis, soğuk ve sürüklenen buz tehlikesini kaldırmaz.',
    sources: hardlaneSources, related: ['ternhaven', 'dranthol', 'soluk-su', 'ayaz-yutan', 'kefen-denizi', 'hardlane'],
    sections: [
      { title: 'Açık suyun ışığı', paragraphs: ['Ak Cam Denizi, Ternhaven ve Dranthol önünde sürekli donmuş bir yüzey oluşturmayan sulardır. Alçak ışıkta solgun bir cam levhayı andıran deniz, kıyı halkının adlandırmasında ayrı bir yer tutar. Soğuk hava ile açık su bir arada bulunabilir; donmamış olmak, ılık olmak değildir.', 'Ternhaven’in Rydorn Sırtı’ndan gelen sıcak suları, bazı kıyı ceplerini ve şehirdeki yaşam alanlarını etkiler. Bütün Ak Cam Denizi’ni tek başına ısıtan bir kaynak olarak görülmez. Akıntıların karıştırdığı açık su ile yerel sıcak su etkisi farklı ölçeklerde işler.'] },
      { title: 'Limanların geçim alanı', paragraphs: ['Balıkçılık, kısa kıyı seferleri ve erzak taşımacılığı bu açık suya dayanır. Ternhaven’in küçük üretimi ve Dranthol’un yeni limanı, donmuş bir denizden çok bu suyla ilişki kurar. Günlerce limana yaklaşamayan bir geminin yükü, kıyıdaki pazar fiyatlarını değiştirebilir.', 'Dranthol’un feneri ve koruması, gemiler için düzenli bir uğrak sağlar; limana uğramaktan kaçınan korsan ve kaçakçıların taşıdığı altın ise başka kıyılara gider. Deniz üzerinde açık bir rota bulunması, o rotanın herkes için aynı ekonomik anlamı taşıdığını göstermez.'] },
      { title: 'Camın üzerindeki kefen parçaları', paragraphs: ['Kefen Denizi’nden kıyı akıntılarıyla sürüklenen kopuk buzlar Ak Cam’a ulaşabilir. Ayrı parçaların görülmesi, denizlerin kesintisiz bir buz tabakasıyla birleştiği anlamına gelmez. Açık suyun içinde dolaşan kalın levhalar bir geminin bordasını yaralayabilir veya bir koyun ağzını geçici olarak daraltabilir.', 'Balıkçılar suyun rengini, kıyıdaki sesi ve yüzen buzun hareketini izler. Yine de sis içinde bir parçayı zamanında görmek mümkün olmayabilir. Yerel tecrübe riski azaltır; güvenli seferi garanti etmez.'] },
      { title: 'Soluk Su ve Ayaz Yutan', paragraphs: ['Ternhaven ile Dranthol arasındaki sisli kıyı Soluk Su diye anılır. Dranthol’un aşağısındaki Ayaz Yutan boğazından sonra ise donmuş deniz alanına geçilir. Bu adlar, gemicilerin aynı kıyının değişen koşullarını ayırt etmesidir; denize çizilmiş sabit güvenlik sınırları değildir.'] },
    ],
  },
  {
    id: 'ayaz-yutan', name: 'Ayaz Yutan', kind: 'geography', region: 'danstsud', mapLocation: 'dranthol',
    subtitle: 'Dranthol’un aşağısındaki don eşiği',
    summary: 'Dranthol’un güneyindeki boğaz. Ak Cam’ın açık sularından sonra donmuş deniz koşullarının ağırlaştığı geçiş alanı.',
    aliases: ['Ayaz Yutan Boğazı'], sources: hardlaneSources,
    related: ['dranthol', 'ak-cam-denizi', 'kiragi-denizi', 'kefen-denizi', 'frostbay'],
    sections: [
      { title: 'Boğazın adı', paragraphs: ['Dranthol’dan aşağı inen gemiciler, donmuş sulara yaklaşırken boğazı Ayaz Yutan diye anar. Daralan kıyı ve değişen su koşulları, açık denizde yapılabilen manevraları sınırlar. Adı, kıyıdaki bir mezar veya tek bir eski kazadan çok kuşaklar boyunca biriken kayıplarla ilişkilendirilir.'] },
      { title: 'Don çizgisinin hareketi', paragraphs: ['Boğazın ardından deniz donmuş görünür; fakat buzun kenarı her gün aynı yerde durmaz. Rüzgâr ve akıntı, kopuk levhaları yığabilir, bir açıklığı kapatabilir veya kıyıdan uzaklaştırabilir. Gemiciler bu nedenle önceki seferin izine güvenerek ilerlemez.', 'Boğazda donmuş yüzeyin yanındaki açık su bazen dar bir geçit sunar. O geçit bir kaçış garantisi değildir: geride kapanan buz, gemiyi rüzgâr ve akıntı karşısında sıkıştırabilir.'] },
      { title: 'Beklemenin bedeli', paragraphs: ['Dranthol’da hava bekleyen tekneler erzak tüketir, rıhtım yeri işgal eder ve borç biriktirir. Bazı kaptanlar bu maliyeti göze alamayıp yola çıkar. Boğazın tehlikesi böylece yalnızca hava koşullarından değil, insanların beklemeye yetecek paralarının olmamasından da büyür.', 'Küçük balıkçı tekneleri ile ağır yük gemileri aynı şekilde davranamaz. Birinin kıyıya çekilebildiği yerde ötekinin omurgası buzun altında sıkışır. Bu yüzden tek bir “geçilebilir gün” hükmü bütün gemiler için yeterli değildir.'] },
      { title: 'Kıyının sessiz hesabı', paragraphs: ['Boğazdan dönmeyen bir teknenin ardından Dranthol’da kalanlar önce yük ortaklarını, sonra ailelerini arar. Bulunan bir tahta veya yelken parçası her zaman hangi gemiye ait olduğu bilinmeden kıyıya gelir. Ayaz Yutan’ın halk hafızasında taşıdığı ağırlık, bu tamamlanmamış haberlerden beslenir.'] },
    ],
  },
  {
    id: 'kiragi-denizi', name: 'Kırağı Denizi', kind: 'geography', region: 'danstsud', mapLocation: 'frostbay',
    subtitle: 'Danstsud ile Honud arasındaki Son Nefes Denizi',
    summary: 'Donmuş görünmesine rağmen yürüyerek aşılması neredeyse imkânsız olan deniz. Kırılan buz, hızlı akıntılar ve yeniden donan yüzey aynı döngü içinde yer değiştirir.',
    aliases: ['Son Nefes Denizi', 'Buz Solunumu'], sources: hardlaneSources,
    related: ['honud', 'frostbay', 'kaldmere', 'ayaz-yutan', 'kefen-denizi', 'hardlane-kulturu'],
    sections: [
      { title: 'İki ad, aynı deniz', paragraphs: ['Kırağı Denizi ile Son Nefes Denizi, Danstsud’u Honud’dan ayıran aynı donmuş denizin adlarıdır. İlki kıyının görünüşünü, ikincisi insanların onda kaybettiği hayatları hatırlatır. Uzakta kesintisiz beyaz görünen yüzey, karadan karaya uzanan bir yol olarak kullanılamaz.', 'Rüzgârın kesilmediği genişlikte korunacak bir duvar, tutunacak bir ağaç veya dinlenilecek düzenli bir sığınak yoktur. Donmuş denize çıkmak, kıyıdaki kısa bir buz balıkçılığıyla aynı iş değildir.'] },
      { title: 'Buz Solunumu', paragraphs: ['Kıyı halkı yüzeyin parçalanıp yeniden kapanmasına Buz Solunumu der. Akıntının ve rüzgârın yüklediği basınç, levhaları ayırır; açılan su kanallarında akış kimi zaman hızlı bir nehir gibi görünür. Daha sonra açıklık yeniden donar veya levhalar birbirine sürüklenir.', 'Birbirine dayanan levhalar yükselip kırıldığında, büyük bir patlamayı andıran sesler duyulur. Bazı buz parçaları yukarı savrulur, bazıları suyun altında sıkışır. Sonra yeni bir don tabakası yüzeyi örter. Bu döngünün her aşaması aynı yerde veya aynı süreyle gerçekleşmez.', 'Yeni kapanmış bir çatlak, üzerindeki kar yüzünden eski ve sağlam buz gibi görünebilir. Bir önceki gün yürünebilen yüzey, sonraki gün ince bir kabuğa veya birbirinden uzaklaşan adalara dönüşebilir.'] },
      { title: 'Yürüyenin kaybettiği yön', paragraphs: ['Kar fırtınası kıyının izini siler. Rüzgâr, açık alandaki bedeni ve taşınan yükü sürekli zorlar; durmak bile ısı kaybını ağırlaştırır. Açılan bir su kanalı yürüyeni başlangıç kıyısından ayırabilir. Çatlağın kapanması da kurtuluş sayılmaz, çünkü sıkışan buz bulunduğu yeri altüst edebilir.', 'Yüzeyin beyaz olması kalınlığını bildirmez. Kıyı balıkçıları yakın buz üzerinde yerel bilgiyle çalışsa da bu bilgi denizin tamamı için güvenli bir yürüyüş yolu oluşturmaz. Honud’dan gelen mültecilerin kıyıya varması, bu genişliğin kolayca aşıldığına kanıt değildir.'] },
      { title: 'Kayıpların kıyıya gelişi', paragraphs: ['Frostbay’de denizden çıkan her yabancı, nereden ve nasıl geldiği hemen anlaşılmadan karşılanır. Bazı aileler başka kıyı etaplarını ve tekneleri kullanmış, bazıları yolda yakınlarını kaybetmiştir. Limandaki bir şal, bir ad veya başka dilde söylenen bir dua, çoğu zaman yolculuğun tamamından daha uzun yaşar.', 'Son Nefes adı, kaybolanların hepsinin son anını bilen bir anlatıcıya ait değildir. Geride kalanların bekleyişine ait bir addır.'] },
      { title: 'Ayrı buzlar', paragraphs: ['Kefen Denizi’nin buz örtüsü Kırağı’nınkiyle kesintisiz biçimde birleşmez. Kıyı boyunca taşınan kopuk parçalar Kırağı sularına ulaşabilir; bu dolaşım, iki denizi yürünebilir bir köprüye dönüştürmez.'] },
    ],
  },
  {
    id: 'soluk-su', name: 'Soluk Su', kind: 'geography', region: 'danstsud', mapLocation: 'dranthol',
    subtitle: 'Ternhaven ile Dranthol arasındaki sisli kıyı',
    summary: 'Rüzgârın ve sisin gemileri kıyıya sürdüğü, kayalıkların omurgaları parçaladığı kıyı suları. Ak Cam’ın açık yüzeyinde saklı bir tehlike.',
    sources: hardlaneSources, related: ['ternhaven', 'dranthol', 'ak-cam-denizi', 'kefen-denizi', 'kemige-basan-yol'],
    sections: [
      { title: 'Ufkun silindiği yer', paragraphs: ['Soluk Su, Ternhaven ile Dranthol arasındaki kıyı ve küçük kıyı sularının adıdır. Sis, suyu ve karayı aynı soluk renge sokar. Rüzgâr tekneyi kıyıya sürerken kaptanın gördüğü açıklık, gerçekte kayalıkların arasındaki sığ bir cep olabilir.', 'Açık su bulunması bu kıyıyı kolay bir geçişe dönüştürmez. Dalga altında görünmeyen çıkıntılar ve kıyıya doğru taşınan gemi, burada aynı anda hesaba katılır.'] },
      { title: 'Fenerin ulaşamadığı bakış', paragraphs: ['Dranthol’un Nöbet Işığı ve kıyıda tutulan işaretler yol bulmaya yardım eder. Yoğun sisin içinde bu ışıklar kaybolabilir; bazen yalnızca belirsiz bir aydınlık görünür. Bir ışığın görülmesi, geminin önündeki suyun derinliğini bildirmez.', 'Yerel gemiciler sığlıklarda kullandıkları işaretleri ve rüzgârın kıyıya bastığı saatleri öğrenir. Kıyı değiştiğinde, bir fırtına taşları ve biriken malzemeyi yerinden oynattığında bu hafıza da yeniden sınanır.'] },
      { title: 'Kurtarma ve sahiplenme', paragraphs: ['Kıyı halkı karaya oturan teknelerden insan çekmeye çalışır; soğuk ve kırılan gövde, kurtarmayı güçleştirir. Ardından yükün kime ait olduğu kavgası başlayabilir. Gemicinin emaneti sayılan bir sandık, başka biri için kıyının verdiği kazançtır.', 'Dranthol yakınında muhafızlar yükü kayıt altına almaya çalışır. Daha zayıf denetlenen kıyılarda aynı uygulama sürmez. Bu fark, kazadan kurtulan birinin birkaç koy ötede bambaşka bir otoriteyle karşılaşmasına yol açar.'] },
      { title: 'Sürüklenen buzun eklediği risk', paragraphs: ['Kefen Denizi kökenli parçalar, Soluk Su’nun sisinde fark edilmeden hareket edebilir. Buz ile kayalık arasında sıkışan geminin manevra alanı azalır. Kıyı boyunca beyaz parçalar görmek, denizin bütünüyle donduğu veya parçalar arasında yürünebileceği anlamına gelmez.'] },
    ],
  },
  {
    id: 'kefen-denizi', name: 'Kefen Denizi', kind: 'geography', region: 'danstsud', mapLocation: 'danstsud',
    subtitle: 'Doğu kıyısının ayrı don örtüsü',
    summary: 'Danstsud’un doğuya bakan tarafındaki donmuş deniz. Buzları kıyı akıntılarıyla başka sulara taşınır; örtüsü Kırağı Denizi’yle birleşmez.',
    sources: hardlaneSources, related: ['danstsud', 'ak-cam-denizi', 'kiragi-denizi', 'soluk-su', 'hardlane'],
    sections: [
      { title: 'Doğunun beyaz örtüsü', paragraphs: ['Kefen Denizi, Danstsud’un doğuya bakan kıyısı boyunca donmuş hâlde bulunan denizdir. Adı, kıyıyı örten beyaz yüzeyden gelir. Bu örtü, başka bir denizin buzuyla kesintisiz bağlantı kuran tek bir levha değildir.', 'Uzakta duran örtü sakin görünse de kenarları, akıntı ve hava altında kırılıp ayrılabilir. Kıyı halkı denizin donmuş oluşunu hareketin bittiği bir durum olarak görmez.'] },
      { title: 'Kıyı boyunca taşınan parçalar', paragraphs: ['Kefen’in örtüsünden ayrılan buzlar kıyı akıntılarıyla taşınır. Parçalar Ak Cam Denizi’ne, Kırağı Denizi’ne ve Soluk Su çevresine ulaşabilir. Açık sularda dağılmaları, yığılmaları veya yeniden kıyıya oturmaları hava ve akış koşullarına bağlıdır.', 'Bu taşınma, deniz adlarının birbirine karışmasına neden olabilir: Ak Cam’daki bir balıkçı, gördüğü parçayı “Kefen geldi” diye anlatır. Söylediği, doğudaki denizin yer değiştirmesi değil, onun buzunun burada belirmesidir.'] },
      { title: 'Birleşmeyen beyazlık', paragraphs: ['Kefen ile Kırağı arasında ayrı buz örtüleri vardır. Tek tek parçaların bir denizden ötekine sürüklenmesi, aradaki suyun üzerine güvenilir bir yol döşemez. Kıyıdan bakıldığında uzaktaki parçalar birleşmiş görünebilir; aralarında su kanalları, ince don ve kopan kenarlar bulunur.', 'Gemiciler sürüklenen buzun yalnızca görünen yüksekliğini değil, su altında kalan kütlesini de düşünür. Kalın bir parça küçük bir tekneyi ezerken, daha büyük bir gemiyi de rotasından ve limana yaklaşma imkânından uzaklaştırabilir.'] },
      { title: 'Uzak kıyının ortak bedeli', paragraphs: ['Kefen’deki bir kırılma, günler sonra başka bir kıyının avını veya taşımacılığını etkileyebilir. Bu yüzden Hardlane’de açık ve donmuş denizler ayrı dünyalar değildir. Balıkçı, liman işçisi, yük sahibi ve kışlık tahıl bekleyen hane, aynı dolaşımın farklı ucunda yaşar.'] },
    ],
  },
]
