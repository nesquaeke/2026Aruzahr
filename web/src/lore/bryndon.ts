import type { LoreArticle } from '../data'
import { hardlaneSources } from './hardlane'

export const bryndonArticles: LoreArticle[] = [
  {
    id: 'bryndon-kiyi-defteri', name: 'Bryndon’un Kıyı Defteri', kind: 'chronicle', region: 'danstsud', mapLocation: 'frostbay',
    subtitle: 'Kıştan Önceki Taşlar · Theramisli bir kâtibin saha defterinden',
    summary: 'Kâtip Bryndon’un Frostbay’deki yuvarlak taş yapılar ve eski değirmenler üzerine birinci şahıs anlatısı. Daha yeşil bir geçmiş ihtimalini araştırır; gördükleri ile tahminlerini ayrı tutar.',
    aliases: ['Kâtip Bryndon', 'Katip Bryndon', 'Kıştan Önceki Taşlar', 'Frostbay eski iklimi', 'yuvarlak taş yığma'],
    sources: hardlaneSources,
    related: ['frostbay', 'hardlane', 'hardlane-kulturu', 'hardlane-otlak-hayvanlari', 'theramis', 'kiragi-denizi'],
    sections: [
      { title: 'Önsöz — Defteri açana', paragraphs: [
        'Bu yaprakları Theramis’teki temiz masamın başında yazmaya niyet etmiştim. Frostbay’de tuttuğum notları sıraya koyacak, taşların ölçülerini temize çekecek, hangi çağın hangi ustasına ait olduklarını mümkünse gösterecektim. Şimdi masamın üzerinde üç kırık kiremit, tuzla sertleşmiş bir sicim ve bir değirmen taşından aldığım kömür sureti duruyor. Çağların adlarını yazacağım yerler boş kaldı.',
        'Okuyana borcum, bilmediğimi saklamamaktır. Bir duvarın yaşlı olması onu bildiğimiz en eski halkın işi kılmaz. Bir yaprağın taşta izi bulunması da bütün kıyının orman olduğunu ispat etmez. Yine de bir insan her şüpheyi susturmadan bakabilir. Bu defteri, bakmayı bırakmamak için tuttum.',
        'Bana Frostbay’in eski olduğunu söylediler. Oraya vardığımda eski kelimesinin ne kadar küçük olduğunu anladım.',
      ] },
      { title: 'Birinci yaprak — Kapısız bir duvar', paragraphs: [
        'Şehre ilk girişimde büyük bir kemerin altından yürüdüğümü sandım. Üzerime düşen gölgeyi izleyince kemerin iki yanının evlerden çok daha geniş bir yapıya ait olduğunu gördüm. Yapının kendisi yoktu. Bir yanında balık asılmıştı; ötekinde bir aile, çatısını eski taşın içine çaktığı tahtalarla tutturmuştu. Taş, ikisini de aynı kayıtsız sağlamlıkla taşıyordu.',
        'Dairetaş’taki postahanenin duvarını ölçmek için izin istediğimde görevli, “Yazıyı taşıyan yerden başla,” dedi. Eski bir sütun oyuntusuna mektupları koymuşlardı. Oyuntunun dibinde, bugünkü kâğıtlardan daha eski ve bir türlü okuyamadığım aşınmış çizgiler vardı. Ellerimi kaldırıp sütunun çevresini saydım. Bir mektubun saklandığı boşluk, benim boyumdan büyük bir kapının kenarı olabilirdi.',
        'Öğleden sonra postahaneden çıktığımda rüzgâr aynı duvarın arkasına iki yeni barakanın dumanını bastırıyordu. Şehrin geçmişi önümde tek bir manzara hâlinde durmadı. Her eski taşın üstüne yeni bir ihtiyaç binmişti.',
      ] },
      { title: 'İkinci yaprak — Yuvarlak taşların hesabı', paragraphs: [
        'Taş Halkaları ölçmeye başladım. Yerel ustalar bazı duvarları yığma usulle onarmış; ancak eski kısımlarda taşların yuvarlaklığına rağmen düzenli bir ağırlık dağılımı vardı. Dış yüzün iri taşları içte daha küçük dolguya bağlanıyor, aralarda suyun çıkabileceği boşluklar bırakılıyordu. Bunu her binada görmedim. Gördüğüm örnekleri defterime ayrı ayrı işledim; aynı kökenden geldiklerini varsaymadım.',
        'Bugün ayazdan korunmak için örülen duvarlarda açıklıklar kapatılır. Burada bazı eski açıklıklar avlulara bakıyordu. İçlerinden biri göğsüm hizasındaydı; dibi, suyu içeri değil dışarı taşıyan hafif bir eğimle kurulmuştu. Duvar donmuş havayı dışarıda tutmak için yapılmışsa, o açıklık neden böyle bırakılmıştı?',
        'Bir gümrük görevlisi, taşların denizden toplandığını söyledi. Bir oduncu, denizin onları sonradan yuvarladığını. İkisinin sözünü de yazdım. Kıyının nerede olduğunu bilmeden ilk ustanın taşı nereden aldığını bildiğimi söyleyemem. Eski yapının bugün karaya bakması, yapıldığında da karaya baktığını göstermez.',
        'Yine de bir avlunun dört duvarındaki su yollarının aynı işi düşünerek yerleştirilmiş olması tesadüf değildi. Usta, suyun geleceğini biliyordu. Ne kadar suyu, hangi mevsimde beklediğini ben bilmiyordum.',
      ] },
      { title: 'Üçüncü yaprak — Kırık Kanat', paragraphs: [
        'Değirmen denilen yapıya beni, dedesinin orada ağ onardığını söyleyen bir çocuk götürdü. Sokağın adı Kırık Kanat’tı. Ben önce bunu bir deniz kuşunun hikâyesine bağladım. Çocuk eliyle taş kulenin üstünü gösterdi ve orada bir zamanlar kanat olduğunu söyledi. Dedesi görmüş müydü, diye sordum. “Dedemin dedesi de görmemiş,” dedi.',
        'Kulenin içinde dairesel bir yatak, üst bölümünde dönen bir başlığın oturabileceği aşınmış taşlar buldum. Bir tahtanın izi kalmamıştı. Alt kattaki ağır taşı ters çeviremedik; kenarına ulaşınca yüzündeki olukları kömürle kâğıda geçirdim. Oluklar, tahılı ezmek için kullanılan taşlara benziyordu. Kesin hüküm vermek için başka örneklerle karşılaştırılmaları gerekir.',
        'Tek bir değirmen, dışarıdan gelen tahılı öğütebilir. Frostbay bugün de başka yerlerin unu ve danesiyle yaşar. Fakat kıyıda gördüğüm ikinci yuva, sonra üçüncüsü, beni sayıların önünde durmaya mecbur etti. Bunlar aynı dönemde çalışmışsa daha büyük bir iş düzeni vardı. Farklı dönemlere aitlerse, birileri aynı işe uzun zaman boyunca yeniden ihtiyaç duymuştu.',
        'Rüzgâr bugün de yeterince serttir. Değirmeni düşündüren asıl şey rüzgâr olmadı. Öğütülecek ürünün nereden geldiği oldu. Altı ay güçlükle ürün veren bu topraklar mı, çok daha düzenli bir liman mı, yoksa artık görünmeyen başka bir kıyı mı?',
      ] },
      { title: 'Dördüncü yaprak — Taşın altındaki yaz', paragraphs: [
        'Dar Soba’da çöken bir tabanın altından bir usta beni çağırdı. Yeniden kullanılan taşların arasında, ince damarları seçilen bir yaprak izi vardı. Taşı kimin getirdiğini bilmiyordu. Babasının evinde de bulunmuş olabilirdi; bir yük gemisinin safrasından da çıkmış olabilirdi. O akşam notuma, “Bulunduğu yer, oluştuğu yer değildir,” yazdım.',
        'Daha sonra eski bir avlunun kenarındaki açılmış toprakta koyu kök parçaları gördüm. Birkaçının çevresindeki toprağı ve üzerlerini örten taş sırasını çizdim. Köklerin yapıyla aynı yaşta olup olmadığını saptayacak bilgim yoktu. Bazı katmanlar fırtınalar ve yeni inşaat yüzünden karışmıştı. En düzgün görünen kesiti bile bir takvim gibi okuyamadım.',
        'Taşı ve toprağı ayrı düşündüğümde her bulgu küçüktü. Değirmen yuvalarını, geniş avluları, su kanallarını ve kökleri aynı masaya koyduğumda ise küçük bulgular birbirine soru sormaya başladı. O soruların en yalınını defterimin kenarına yazdım: Burada yaşayanlar, bizim bugün beklediğimizden daha uzun bir yaz mı bekliyorlardı?',
        'Bu cümlenin yanına bir tarih koymadım. Binlerce yıl geriye uzanabilecek katmanların hangisinin ötekinden önce geldiğini anlamak, tek bir ziyaretin ve tek bir kâtibin işi değildir.',
      ] },
      { title: 'Beşinci yaprak — Üç açıklama', paragraphs: [
        'Birinci ihtimal, kıyının daha yumuşak bir iklimde yaşamış olmasıdır. Uzun büyüme mevsimi, bugün harabe olan yapıların çevresinde daha fazla tarımı ve daha açık avluları mümkün kılmış olabilir. Böyleyse soğuk buraya yalnız insanları değil, bütün bir çalışma düzenini yerinden ederek gelmiştir.',
        'İkinci ihtimal, iklim aynı ölçüde sertken çok daha zengin bir ticaret ağının şehri beslemesidir. Daneler gemilerle taşınmış, değirmenler başka toprakların mahsulünü işlemiş olabilir. Büyük yapıların ihtişamı, yerel tarlaların bolluğundan değil denizden gelen güçten doğmuş olabilir.',
        'Üçüncü ihtimal, bu yapıların ve toprağın tek bir geçmişe ait olmamasıdır. Kıyı yer değiştirmiş, eski taşlar taşınmış, farklı dönemlerin duvarları birbirine eklenmiş olabilir. Bugün yan yana gördüğüm izler, aynı zamanda yan yana bulunmamış olabilir.',
        'Kâtibin kusuru bazen hiçbir şey bilmemek değildir; üç açıklamadan en güzelini seçip diğer ikisini silmektir. Ben üçünü de bıraktım. Daha yeşil bir kıyı düşüncesi aklımdan çıkmadı, ama onu bir hüküm yerine bir soru olarak yazdım.',
      ] },
      { title: 'Altıncı yaprak — Eski taşın yeni sakinleri', paragraphs: [
        'Honud’dan geldiğini söyleyen bir kadın, bir halkada küçük ocağını yakıyordu. Taşın arkasında rüzgârın kesildiğini, ancak içerideki rutubetin çocuğunun öksürüğünü artırdığını anlattı. Duvarın tarihini sordum. Önce bana baktı, sonra sobanın borusuna. “Dün gece yıkılmadı,” dedi. “Onu biliyorum.”',
        'Bu cevap defterimin yarısını susturacak kadar ağırdı. Ben duvarın hangi çağa ait olduğunu arıyordum; o, bir sonraki sabaha kadar ayakta kalıp kalmayacağını. İkimiz de aynı taşa bakıyorduk. Bilmek istediğimiz şeylerin uzaklığı, şehirdeki bütün servet farklarından büyük görünüyordu.',
        'Garnizonun nöbetçisi bizi dar bir sokaktan geçirdi. Eski duvarların arasına sıkışmış evlerin çoğunu kimin saydığını sordum. Biri saymışsa ötekinin haberi olmadığını söyledi. Frostbay’in nüfusu için duyduğum kırk beş bin ile elli bin arasındaki rakamlar böyle bir şehrin tahminleriydi. Taşları ölçmek, insanları saymaktan kolaydı.',
        'Postahanede bir mektup günlerce beklerken aynı avlunun öteki yanında bir yük bir gecede el değiştirebiliyordu. Gümrük memurunun elindeki mühür, birkaç sokak ötede geçmeyebilirdi. Bu şehrin eski düzenini anlamak için bugünkü düzensizliğini görmezden gelemem.',
      ] },
      { title: 'Yedinci yaprak — Otlakta açılan küçük pencere', paragraphs: [
        'Son açık günlerden birinde çobanlarla kıyının ardındaki otlağa çıktım. Tervanlar, başlarını yana çevirip boynuzlarının geniş yüzüyle ince donu kaldırıyordu. Norrukların burunları kısa aralıklarla toprağa vuruyor, Velkirler karın yığılmadığı saz ceplerini yokluyordu. Bir hayvanın görebildiği yiyecek, benim gözümde düz beyaz bir yüzeydi.',
        'Çoban, yazın biriktirdiği yemi gösterdi. Bu hayvanların toprağın içinden kışı yenerek çıktığını sanmamamı istedi. İnce kabuğun altında ot bulabilirlerdi; kalın buzun altında ot yoktu. Sürünün her başı, sıcak günlerden kalan bir hesabı tüketiyordu.',
        'Otlaktan dönerken değirmen kulesi göründü. Bugünkü kısa yazın hesabıyla o eski taşların hesabı birbirini tutmuyordu. Bunun geçmişte daha çok yeşil olduğu için mi, geçmişte daha çok gemi olduğu için mi böyle olduğunu hâlâ bilmiyordum. Çobanın kış için sakladığı küçücük yığın bile bana bir sonraki kazıda neyi aramam gerektiğini öğretti: yalnız mahsulü değil, onu saklayan yerleri.',
      ] },
      { title: 'Son yaprak — Pencerenin baktığı yer', paragraphs: [
        'Şehirden ayrılmadan önce su yolu bulunan avluya tekrar gittim. Kar çekilmişti. Taşın dibinde biriken erime suyunun, ustanın bıraktığı eski eğim boyunca dışarı yürüdüğünü gördüm. Duvarın ne zaman örüldüğünü öğrenememiştim. Duvar, buna rağmen hâlâ işini yapıyordu.',
        'İç tarafta alçak bir pencere vardı. Bugün dar bir geçide ve karşısındaki barakanın isli tahtalarına bakıyordu. Önüne oturdum. Tahtaları, üst üste eklenmiş çatıyı ve yeni yığılmış taşları düşüncemden kaldırdım. Pencerenin karşısında ne kaldığını bilmiyordum. Deniz mi, tarla mı, başka bir ev mi?',
        'Buraya gelen ilk ustanın pencereyi boşluğa açmadığını biliyorum. Bir şey görmek istemişti. Kitabımın sonuna o şeyi adlandırarak değil, yerini boş bırakarak varıyorum.',
        'Frostbay’de bir evin penceresi binlerce yıl sonra hâlâ durabilir. Onun bir zamanlar gördüğü dünya ise bütünüyle kaybolabilir. Beni Theramis’e döndüğümden beri uykumdan kaldıran, taşların nasıl dayandığı değil; o dünya kaybolurken son bakanın ne gördüğüdür.',
      ] },
    ],
  },
]
