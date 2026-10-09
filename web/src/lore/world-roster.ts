import type { RegionId, Section } from '../data'
import type { Character } from './characters'
import type { PowerTier } from '../character-card-profiles'

export const worldRosterSource = 'Dünya kadroları · 8 Ekim 2026 yeni yazım; mevcut bölge kültürlerinden geliştirilen halka açık biyografiler'

type PersonDraft = {
  id: string; name: string; role: string; city: string; region: RegionId;
  affiliation: string; traits: string[]; summary: string; power: PowerTier;
  related?: string[]; sections: Section[];
}
const chapter = (title: string, ...paragraphs: string[]): Section => ({ title, paragraphs })
const person = (draft: PersonDraft): Character => ({
  ...draft, portrait: draft.id, source: 'new',
  background: draft.sections[0].paragraphs.join(' '),
  presence: draft.sections[draft.sections.length - 1].paragraphs.join(' '),
})

// These are newly written local people, not replacements for an established
// ruler or a claim that the source documents name a country's current monarch.
const establishedWorldCharacters: Character[] = [
  person({
    id: 'sahira-nemesh', name: 'Sahira Nemesh', role: 'Su ihtilafları hakemi', city: 'zarim-khet', region: 'xotar',
    affiliation: 'Zarim’khet kuyu meclisi', traits: ['Ölçü kabı', 'Aileye karşı hüküm', 'Susuzun tarafı'], power: 'powerful',
    summary: 'Zarim’khet’te kuyuların payını ve su borçlarını dinleyen Sahira, kendi ailesinin kervanına verdiği aleyhte kararla tanındı.', related: ['xotar', 'miraz-ipekcisi', 'rahim-vekk'],
    sections: [
      chapter('Bir kabın iki ölçüsü',
        'Sahira, kuyu taşıyan bir ailenin çocuğuydu. Annesi her akşam aynı bakır kapla eve su getirir, teslim sırasında kapın kenarındaki çentiği parmağıyla yoklardı. Sahira küçükken bunun dua olduğunu sandı; büyüdüğünde çentiğin, borç defterine yazılan miktarla elde kalan su arasındaki farkı gösterdiğini öğrendi.',
        'Bir kervan hesabında kâtiplik yaparken varlıklı bir hanenin eksik kabını yoksul müşterilere tam diye yazmayı reddetti. İşini kaybetti, fakat kaplarını yeniden tarttırmak isteyen komşular ona gelmeye başladı. Kuyu meclisine giden yolu bir soylunun himayesi değil, yıllar boyunca tuttuğu bu küçük hesaplar açtı.'),
      chapter('Kendi hanesine verilen karar',
        'Kız kardeşinin kervanı kurak bir mevsimde ücretini ödediği suyu önceden çekmek istediğinde Sahira, hastalar için ayrılan ortak paya dokunulamayacağına hükmetti. Kervanın gecikmesi aileyi zarara uğrattı. Kardeşi bugün bile aynı sofraya oturduğunda kabını ondan uzağa koyar.',
        'Karar şehre bir kahraman kazandırmadı; kuyunun başında bir hakemin sözünün satın alınmayabileceğini gösterdi. Sahira bu olayın her duruşmada anlatılmasından hoşlanmaz. İnsanların eski kararına güvenip yeni hesabını kontrol etmeyi bırakmasını da bir çeşit haksızlık sayar.'),
      chapter('Hakemin kapısında',
        'Görevi bütün Xotar’ı yönetmek değildir. Zarim’khet’te paylaşım, teslim ve borç uyuşmazlıklarını dinler; asker sevk edemez, din adına hüküm veremez. En büyük gücü, kuyu sahiplerinin bile bozduklarında itibar kaybettikleri açık kayıtları tutmasıdır.',
        'Sahira, suyu çalan kişiyi cezalandırmadan önce suyun niçin çalındığını sorar. Bu alışkanlık onu merhametli biri yaparken geciken kararlarından çıkar sağlayanları da cesaretlendirir. Masasında annesinin bakır kabı durur; görüşmeye gelen herkes onu kullanabilir.'),
    ],
  }),
  person({
    id: 'daren-khoss', name: 'Daren Khoss', role: 'Kervan muhafızları kaptanı', city: 'thariz', region: 'xotar',
    affiliation: 'Thariz yol ortaklığı', traits: ['Kayıp yük', 'Gece yürüyüşü', 'Geri dönenler'], power: 'distinguished',
    summary: 'Rüzgâr Hatları’nda yükü koruyan Daren, kum fırtınasında malları bırakıp işçileri döndürdüğü için hem aranır hem pahalı bulunur.', related: ['xotar', 'kumkavis'],
    sections: [
      chapter('Muhafız olmadan önce',
        'Daren’in ilk işi Thariz’de yük bağlamaktı. Yürümeyi kervanın en önünde öğrenmedi: kırılmış tekeri, yaralanmış hayvanı ve son su tulumunu en arkada taşıdı. Bir yolun ne kadar sürdüğünü soranlara hâlâ mesafeyi değil, en ağır arabanın durumunu sorar.',
        'Bir Kızıl Fırtına sırasında baş muhafız öne gidince genç Daren iki yaralı işçiyi geride buldu. Bir kumaş sandığını boşaltıp arabayı onlara ayırdı. Yük sahibi zararını istedi; kurtulan işçiler sonraki yolculukta kendi ücretlerinden pay ayırarak Daren’in borcunu kapattı.'),
      chapter('Kaptanın pahalı huyu',
        'Bugün yol ortaklığının muhafızlarını yönetir. Kendisini işe alan tüccara, insan kurtarmak için mal bırakabileceğini sözleşme başında söyler. Bazı tüccarlar bu şartı reddeder; bazıları ise mallarının neden geç ulaştığını anlayabilecek biri için daha çok öder.',
        'Öğrencisi Reşet, gerektiğinde yükün de bir ailenin bütün geçimi olabileceğini ona hatırlatır. Daren bu itirazı susturmaz. Bir canı kurtarmanın ardından borç ve açlık başlayabileceğini bilir; kahramanca kararın hesabını başkalarına sessizce bırakmak istemez.'),
      chapter('Thariz’e dönen yol',
        'Daren’in yetkisi birlikte yol alan muhafızlarla ve hizmet sözleşmesiyle sınırlıdır. Şehir kapısının askerlerine emir vermez. Devriyelerinde kumkavis sürülerinin bırakmış olduğu dar patikaları gözler, fakat hayvan izi diye her hattı güvenli kabul etmez.',
        'Han avlusunda eski bir deri kalkanı kendisi onarır. Sol kaşının üzerindeki izin büyük bir düellodan geldiği sanılır; gerçekte fırtına gecesi devrilen araba parçasıdır. Daren bu hikâyeyi kahramanlığı küçültmek için değil, yolun sıradan şeylerle de öldürebildiğini anlatmak için söyler.'),
    ],
  }),
  person({
    id: 'nemeh-sarun', name: 'Nemeh Sarun', role: 'Karutah şifahanesi rehberi', city: 'sahrim', region: 'xotar',
    affiliation: 'Sahrim Karutah ocağı', traits: ['Yaşlı şifacı', 'İlk su', 'Kibirle mücadele'], power: 'distinguished',
    summary: 'Nemeh, Sahrim’deki şifahanede dua, temizlik ve bakım işlerini birlikte yürütür; bir zamanlar kendisinden beklenen mucizeyi reddetmiştir.', related: ['xotar', 'sahira-nemesh'],
    sections: [
      chapter('Ocağın arka avlusu',
        'Nemeh’in babası su küplerinin kırıklarını onarırdı. Hastaların yakınları şifahanenin ön kapısında dua ederken küçük Nemeh arka avluda küp yıkardı. Rahipler arasında büyüdü; din bilgisini, iyi bir duanın temiz olmayan kabı temiz saydırmadığı yerde öğrendi.',
        'İlk öğretmeni gözünü kaybettiğinde bakımını üstlendi. Yaşlı adam, öğrencisinin kendisine daha büyük sözler vermesini değil, sabahları aynı saatte gelmesini istedi. Nemeh bu isteği yıllar sonra şifahanenin temel kuralı yaptı: vaatler değil, aksatılmadan verilen bakım kaydedilir.'),
      chapter('Bir mucizenin reddi',
        'Varlıklı bir tüccar, ağır hastalığı sürerken ailesine iyileştiğinin söylenmesini istedi. Nemeh, adamın ticari itibarını koruyacak bu yalana katılmadı. Tüccarın bağışı kesildi; ocak bir mevsim daha az yatakla çalışmak zorunda kaldı.',
        'Bunun bedelini kendisinin değil hastaların da ödediğini kabul eder. Kararını temiz bir zafer gibi anlatmaz. Öğrencilerine doğru sözü söylerken o sözden sonra bakımın nasıl sürdürüleceğini de düşünmelerini öğretir.'),
      chapter('Sahrim’in ilk suyu',
        'Nemeh’in ocağı Karutah öğretisi içinde danışmanlık ve şifa verir. Şehrin bütün rahipleri adına konuşmaz. Zahr ile Rah dengesini uzun nutuklardan önce hastayı dinleyebilmekle ilişkilendirir.',
        'Rav’Kalim gecesinde ilk su kabını kendisi içmez; hizmet eden gençlere dağıtır. Kolundaki eski yanık izi bakım sırasında devrilen bir ocaktan kalmıştır. Kibirden söz ettiğinde soyut bir kusuru değil, yardım isterken kendisini fazla güçlü sanan gençliğini hatırlar.'),
    ],
  }),
  person({
    id: 'rahim-vekk', name: 'Rahim Vekk', role: 'Kum İpeği ve tahıl simsarı', city: 'qal-nashar', region: 'xotar',
    affiliation: 'Qal’Nashar tartı ortaklığı', traits: ['Borç ağı', 'Açık pazarlık', 'Kıtlıktan kazanç'], power: 'powerful',
    summary: 'Qal’Nashar’da ipek ve tahılın borçlarını birbirine bağlayan Rahim, kervanları kurtarırken borçlu aileleri yıllarca kendisine çalıştırabilir.', related: ['miraz-ipekcisi', 'sahira-nemesh', 'daren-khoss'],
    sections: [
      chapter('Kırık tartının oğlu',
        'Rahim, babasının dükkânı yanlış tartı suçlamasıyla kapandığında on iki yaşındaydı. Tartının gerçekten bozuk olduğunu sonra öğrendi. Bu utanç onu dürüst bir ölçü kadar, ölçüye kimin hükmettiğini de önemseyen bir yetişkine dönüştürdü.',
        'İlk sermayesini pahalı bir taşla değil, gecikmiş üç tahıl yükünün alacaklarını satın alarak kurdu. Bekleyebilen kişi olmak, sıcak ve soğuk arasındaki kervan ekonomisinde bir silah kadar güç taşıyordu. Rahim çok geçmeden beklemek için başkalarından para almaya başladı.'),
      chapter('Kurtarılmış kervanın bedeli',
        'Kurak yılda bir ipekçi ortaklığını iflastan kurtardı. Buna karşılık birkaç yıllık ürünlerini önceden ve düşük bedelle kendisine bağladı. Atölyeler açık kaldı; çalışan ailelerin eline geçen para eski bolluğuna dönmedi.',
        'Rahim bunu yardım diye sunmaz. Sözleşmelerini yüksek sesle okur, ağır şartların nedenini anlatır. Bütün şartları bilmenin, aç kalmaktan başka seçeneği olmayan kişiyi gerçekten özgür bırakıp bırakmadığı ise onu sorgulayanların temel itirazıdır.'),
      chapter('Pazarda kalmak',
        'Şehirdeki gücü bir resmî hüküm makamından gelmez; yük, kredi ve bilgi ağından gelir. Sahira’nın kendi bölgesindeki su paylarını parayla esnetmediğini bilir. Onun açık karar defterleriyle Rahim’in açık fakat sert sözleşmeleri arasındaki fark pazarda sık sık konuşulur.',
        'Her akşam önce işçilerin ücretini ayırır, sonra kendi kazancını hesaplar. Bu düzen çalışanlarına bir güvence, ona ise sadakat sağlar. Rahim yalnızca açgözlü bir simsar değildir; iyiliğin bile ileride kendisine bir borç yazılmasını isteyen adamdır.'),
    ],
  }),
  person({
    id: 'ilvara-senn', name: 'Ilvara Senn', role: 'Liman toplantısı sözcüsü', city: 'morihael', region: 'murgul',
    affiliation: 'Morihael iskele ortakları', traits: ['İki dil', 'İşçi sözü', 'Yıpranan sabır'], power: 'powerful',
    summary: 'Morihael’in iskele ortaklarını bir araya getiren Ilvara, Azja ve Xotar kökenli haneler arasındaki ihtilaflarda sözü emeğe ve hesaba döndürür.', related: ['murgul', 'torren-azhal', 'kevar-nahl', 'yel-kuyruk'],
    sections: [
      chapter('İki kıyının çocuğu',
        'Ilvara’nın annesi Azja kökenli bir ağ ustası, babası Xotar’dan gelmiş bir yük kâtibiydi. Evde iki dil duydu; limanda iki tarafın da kendisine ait kabul etmediği şakalara alıştı. Küçükken tercüme ettiği şey kelimelerden önce insanların birbirine duyduğu kuşkuydu.',
        'Bir halatın kopmasıyla babası sakat kaldığında annesi gece vardiyasına geçti. Ilvara iskele gelirini takip etmeye o sırada başladı. Bir yükün kime ait olduğunun yazıldığını, o yükü taşıyanın yaralanmasının ise deftere zor girdiğini gördü.'),
      chapter('Fırtınadan sonraki toplantı',
        'Morihael’i vuran bir fırtınanın ardından onarım yükü en ucuz işçilere bırakıldı. Ilvara aileler arasında dolaşarak çalışma saatlerini topladı ve bunları iskele ortaklarının önünde tek tek okudu. Para hemen bulunmadı; fakat ilk kez zarar hesabına işçilerin kaybettiği günler de eklendi.',
        'Sözcü seçilmesinden beri toplantı başında yalnızca tüccarları değil, yükçüleri de dinler. Bu usul yavaş işler. Limana uğrayan kimi kaptan onu işi durduran kadın diye tanır; eski haneler ise acele kararın bedelini kimin ödeyeceğini soran kişi diye.'),
      chapter('Bir limanın sözcüsü',
        'Ilvara bütün Murgul’un yöneticisi değildir. Morihael’de ortakların görüşmesini ve iskele bakım paylarını koordine eder. Yerel geleneklerin tek bir resmî ses içinde erimesine karşı çıkar; iki topluluğun farklı ibadet saatlerini çalışma çizelgesinde ayrı ayrı tutar.',
        'Tersane paydaşı Kevar Nahl’ın ucuz sözleşmelerini en çok o sorgular. Buna rağmen yeni teknenin yapılabilmesi için Kevar’ın ustalarına ihtiyaç vardır. Ilvara’nın gücü rakibini yok etmekte değil, aynı masada otururken onun hesabını herkesin görebilmesinde durur.'),
    ],
  }),
  person({
    id: 'torren-azhal', name: 'Torren Azhal', role: 'Azja ocağı koruyucusu', city: 'morihael', region: 'murgul',
    affiliation: 'Morihael ata ocağı', traits: ['İsimsiz ölüler', 'Sakin el', 'Bağış kuşkusu'], power: 'distinguished',
    summary: 'Torren, Morihael’deki bir Azja ata ocağını ve fırtınada kaybolanların anısını korur; inancı gösterişli hediyelerden önce süren bakımda arar.', related: ['ilvara-senn', 'kevar-nahl', 'murgul'],
    sections: [
      chapter('Kıyıya vuran isimler',
        'Torren gençken ailesiyle tekne onarırdı. Bir kazadan sonra kıyıya vurmuş, kimliği bilinemeyen bir tayfayı gömdü. Adamın cebindeki oyulmuş küçük tahta parçayı yıllarca sakladı; sonunda onu kendisinin değil, ölüye bir ad arayan bütün ocağın koruması gerektiğine karar verdi.',
        'Ata ocağında bakım işlerine başladı. Öğretisi bir ruh rehberinin sözlerinden olduğu kadar, kışın tüten çatıyı onarmaktan ve ziyaretçiye yer açmaktan gelişti. Bugün taşıdığı değneğin sapı, o ilk teknenin sağlam kalmış ahşabından yapılmıştır.'),
      chapter('Hediye ve sessizlik',
        'Kevar Nahl, büyük bir tekne siparişinin ardından ocağa süslü bir sunak bağışladı. Torren teşekkür etti; fakat aynı hafta ödenmeyen işçi ücretlerini de toplantıda sordu. Bağışçının adını ocağın girişinde yüceltmeyi reddetmesi ikisinin ilişkisini bozdu.',
        'Torren yoksulluğu kutsamaz. İyi ahşap ve sıcak oda için para gerektiğini bilir. Yalnızca bir bağışın, verilmediği yerde bırakılan zararı kendiliğinden silmediğini söylemeye devam eder.'),
      chapter('Azja ocağında',
        'Atalara saygıyı ve doğayla uyumu öğretir; bütün adaların ruhani otoritesi olduğunu iddia etmez. Ocağa Karutah geleneğinden biri geldiğinde dua etmesini beklemek yerine kendi yası için bir yer bulmasına yardım eder.',
        'Yel Kuyruklarının yiyecek aramak için iskeleye geldiği günlerde ağları uzaklaştırır. Öğrencileri bu davranışı kutsal hayvana bağlılık sanır; Torren yalnızca canlıyla kavga ederek her gün yeniden ağ onarmanın akıllıca olmadığını söyler. İnancının gücü bazen bu kadar gündeliktir.'),
    ],
  }),
  person({
    id: 'kevar-nahl', name: 'Kevar Nahl', role: 'Tersane paydaşı', city: 'morihael', region: 'murgul',
    affiliation: 'Morihael gemi ustaları ortaklığı', traits: ['İşleten sermaye', 'Düşük ücret', 'Bağışçı'], power: 'powerful',
    summary: 'İflasa yakın bir tersaneyi yeniden çalıştıran Kevar, kurtardığı işlerin ücretini kısarak servetini büyüttü; Morihael’in hem ihtiyaç duyduğu hem tartıştığı biridir.', related: ['ilvara-senn', 'torren-azhal', 'murgul'],
    sections: [
      chapter('Ayakta kalan tersane',
        'Kevar marangoz çırağı olarak yetişti. Ustasının ölümüyle kalan borçlar tersaneyi kapatacakken sipariş sahiplerine gidip işi daha düşük fiyata bitirmeyi teklif etti. Ustalar çalışmaya devam etti, fakat kendi ücretlerinin bir bölümünü de beklemek zorunda kaldı.',
        'Kevar o gün öğrendiği yöntemi büyüttü: önce işi almak, bedeli sonra paylaşmak. Bu cesaret onu zenginleştirdi. Aradan geçen yıllarda mali yükün ne kadarını kendisinin, ne kadarını çalışanların taşıdığını ise ayrı defterlerde tutmayı seçti.'),
      chapter('Bir teknenin içindeki borç',
        'Bir balıkçı ortaklığı teknesinin tamir bedelini ödeyemeyince avlarının payını Kevar’a bağladı. Tekne denize döndü; aileler birkaç yıl boyunca kendi tuttukları balığın önemli kısmını başkasına verdi. Kevar, aç bir kışta işe yarayan anlaşmanın bollukta hâlâ adil olup olmadığını tartışmak istemez.',
        'İlvara bu sözleşmeleri açık toplantıda okuttuğundan beri ona kızgındır. Yine de liman onarımında Ilvara’nın desteğini arar. Üzerine basılan iskelenin çürümesi, kazanılmış bir tartışmayı bile değersiz kılabilir.'),
      chapter('İtibarın ahşabı',
        'Kevar’ın otoritesi resmî bir yöneticilikten değil, siparişler, borçlar ve ustaları bir arada tutan sermayeden gelir. Limandaki yoksul çocuklara marangozluk öğretmesi gerçektir; iyi çırakların yıllarca düşük ücretle çalışması da aynı gerçeğin içindedir.',
        'Torren’e verdiği sunak hediyesinin karşılığında saygı beklemişti. Karşılığında aldığı soru hâlâ onu rahatsız eder: Bir ustanın eliyle yapılmış tahta bağışlandığında ustanın borcu neden kalır? Kevar bu soruya henüz herkesin önünde cevap vermemiştir.'),
    ],
  }),
  person({
    id: 'haldrun-ylse', name: 'Haldrun Ylse', role: 'Sözlü kule öğretmeni', city: 'norrvar', region: 'honud',
    affiliation: 'Honud sözlü öğreti çevresi', traits: ['Hafıza', 'Yanlış sözcük', 'Sabırlı eğitim'], power: 'powerful',
    summary: 'Norrvar’daki sözlü öğretiyi taşıyan Haldrun, ezberi otoriteye çevirmeden öğrencilerin yanlışları açıkça düzeltebilmesini ister.', related: ['honud', 'buzkulak-serdi'],
    sections: [
      chapter('Annenin kesilen türküsü',
        'Haldrun çocukken uzun kış gecelerinde annesinin aktardığı av ve barınma sözlerini dinledi. Annesi aynı dizeyi kimi yıllar değiştirirdi. Haldrun önce hafızasının zayıfladığını düşündü; sonra nehrin ve av yollarının değiştiğini, yaşayan bilginin eski sözü bazen düzeltmesi gerektiğini öğrendi.',
        'Sözlü büyü eğitimine başladığında kusursuz tekrarlarıyla övüldü. İlk gerçek nöbetinde hocasının eksik bıraktığı bir uyarıyı fark etti, fakat onu düzeltmeye cesaret edemedi. Kimse ölmedi; yine de yanlış kurulmuş sığınaktan çıkarılan insanların ellerindeki donuk yaralar onun öğrenimindeki en ağır ders oldu.'),
      chapter('Yanlış söyleme hakkı',
        'Şimdi öğrencilerini kendi sözünü kesmeleri için teşvik eder. Birinin önce hata yaptığını, sonra bunu düzelttiğini bütün grup önünde anlatması eğitim sayılır. Bazı yaşlılar bunu hocalık saygınlığını azaltan bir gevşeklik olarak görür.',
        'Haldrun hiçbir öğrencisini ezberindeki eksik nedeniyle o günkü yiyeceğinden mahrum etmez. Sınavı geçemeyen genç yeniden çalışır; onu besleyen klan ise beklemeyi öğrenir. Kule çevresindeki güçlü bağları bu sabrın bedelini paylaşan hanelere dayanır.'),
      chapter('Kule ve klan arasında',
        'On beş kule geleneğinin bütününü yönetmez; Norrvar’daki öğretim çevresinde ustadır. Ardzenor’a duyulan inancın her klan ve hanede aynı olmadığını bilir. Öğrencinin bir kutsal sözle arasındaki kuşku, ders kapısını kapatmak için yeterli değildir.',
        'Buzkulak serdilerin yuva girişlerini taşıdığı zaman derslerini kıyıda değil daha içeride yapar. Bunu hayvanın geleceği bildiği için değil, açığa çıkan rüzgârın hem türe hem insana aynı bedeli yüklediği için yaptığını açıklar. Bir işareti anlamak ile ona mucize yüklemek arasındaki farkı sever.'),
    ],
  }),
  person({
    id: 'eyrik-voss', name: 'Eyrik Voss', role: 'Kış ambarları paylaştırıcısı', city: 'frostheimr', region: 'honud',
    affiliation: 'Frostheimr hane ortaklığı', traits: ['Erzak anahtarı', 'Sert hesap', 'Kendi hanesine ayrıcalık'], power: 'powerful',
    summary: 'Frostheimr’in ortak kış stoklarını tutan Eyrik, açık bir dağıtım düzeni kurdu; kendi akrabalarının kayıplarını önce telafi etmesi itibarını çatlatır.', related: ['honud', 'sigrun-nel'],
    sections: [
      chapter('Boş ambarın önünde',
        'Eyrik’in çocukluğu kötü av mevsimlerinden birine rastladı. Babası balıkçı teknesinden dönmedi; ailesi komşuların payıyla yaşadı. Yıllar sonra aynı ambarın kapağını tamir ederken insanların çocukken kendisine verdiği yemekleri tek tek sayabildiğini fark etti.',
        'Bu hafıza onu paylaştırıcı olmaya itti. Kimin ne verdiğini ve hangi hanenin neye ihtiyaç duyduğunu kapı önünde okuyarak ortak stoğu görünür kıldı. Payını erken çeken varlıklı bir avcıya da kalabalık önünde borç yazması ona güçlü bir itibar kazandırdı.'),
      chapter('Kardeşinin teknesi',
        'Kardeşinin yükü denizde kaybolunca Eyrik, kaybı bütün hanelerle görüşmeden ortak stoktan tamamladı. Karar duyulduğunda bunu kış başlamadan üretimin sürmesi için yaptığını söyledi. Aynı gerekçeyle yardım bekleyen başka aileler ise aylarca sırada kalmıştı.',
        'Sigrun Nel, yardımın geri alınmasını değil, kararın kayda doğru yazılmasını istedi. Eyrik bu isteği kabul etti; kardeşinin adını defterden silmedi. Hâlâ haksızlığının büyütüldüğünü düşünür. Bir zamanlar kendisini kurtaran dayanışmayı, kendi yakınlarına öncelik vermek için kullanmakla suçlanması ona ağır gelir.'),
      chapter('Anahtarı taşıyan adam',
        'Resmî bir kral ya da bütün klanların reisi değildir. Kış ambarının anahtarı ve onu yenileyen anlaşmalar, yerel etkisinin kaynağıdır. Kapının önünde herkesin okuyabildiği kayıt düzeni kendi hatasını da görünür tuttuğu için bütünüyle terk edilmemiştir.',
        'Kış bittiğinde öncelikle kilitleri ve havalandırmayı kontrol eder. İyi niyetin çürümüş balığı kurtarmayacağını söyler. Kendisi hakkında iyi niyetin haksız paylaştırmayı da haklı çıkarmadığını söyleyenlere ise çok daha az sabır gösterir.'),
    ],
  }),
  person({
    id: 'sigrun-nel', name: 'Sigrun Nel', role: 'Kıyı avcıları rehberi', city: 'skjornhvaldr', region: 'honud',
    affiliation: 'Skjornhvaldr kıyı haneleri', traits: ['Eski zıpkın', 'Geri çekilmeyi öğretir', 'Pay sözü'], power: 'distinguished',
    summary: 'Sigrun, Honud kıyısında avı ve dönüşü birlikte öğreten yaşlı bir rehberdir; ilk buyruğu, günün kazancının kışı tehlikeye atmamasıdır.', related: ['honud', 'eyrik-voss', 'veyna-korr'],
    sections: [
      chapter('Eli boş dönen gece',
        'Genç Sigrun’un adı, fırtına yaklaşırken büyük avın peşinde kaldığı bir yolculukla yayıldı. Tayfası ona güvenip izledi. Tekne döndü, fakat iki kişinin eli kalıcı zarar gördü. Eve avla geldiği için kutlandığında ilk kez başarının herkese aynı görünmediğini anladı.',
        'Sonraki yıllarda daha az büyük av getirdi; daha çok genci sağlam döndürdü. Öğrenimini adlandıracak bir okul yoktu. Her durduğu koy, elinden bir şey kaybetmeden ayrılabildiği bir ders hâline geldi.'),
      chapter('Bırakılan zıpkın',
        'Kıyı hanelerinin gençleri bugün onun yanında yol öğrenir. Kendisine ait eski zıpkını en başarılı avcıya değil, ilk kez büyük avı bırakıp dönüş kararı verebilene ödünç verir. Bu adet kimi gençler için korkaklığı ödüllendirmektir.',
        'Sigrun bir gencin cesaretini kırmak istemez; kime karşı cesur olması gerektiğini değiştirir. Tayfanın kınamasını göze alarak dönmek de güç ister. Çok konuşmaz, fakat yeniden gidilebilecek avla geri getirilemeyecek insanı aynı hesaba yazmaz.'),
      chapter('Kıyının ortak sözü',
        'Skjornhvaldr çevresindeki rehberliği ona askerî bir makam vermez. Haneler onun av kararını dinler, ortak pay üzerindeki tartışmada sözüne ağırlık tanır. Frostheimr’de Eyrik’in kayıtlarına yaptığı itiraz bu itibarın sınır dışına nasıl taşabildiğini gösterdi.',
        'Veyna Korr’un yasak yerde ağ açmasını onaylamaz, fakat onu kentten kovmayı da istemez. Dönüş yolunda bir rehberin işi yalnızca dürüst tayfayı taşımak değildir. Bu tavır Sigrun’u kusursuz bir yargıçtan çok, insanların geri dönebileceği bir kıyı yapar.'),
    ],
  }),
  person({
    id: 'veyna-korr', name: 'Veyna Korr', role: 'Kış kıyısı kayıkçısı', city: 'kaldryss', region: 'honud',
    affiliation: 'Kaldryss küçük tekne haneleri', traits: ['Genç rehber', 'Yasak ağ', 'Aile borcu'], power: 'distinguished',
    summary: 'Kaldryss kayıkçısı Veyna, dar buz açıklıklarında yol bulur; ailesini doyurmak için açtığı yasak ağlar, onu kıyıların hem aranan hem tartışılan yüzüne dönüştürdü.', related: ['honud', 'sigrun-nel'],
    sections: [
      chapter('Küçük teknenin borcu',
        'Veyna annesinin teknesinde büyüdü. Buzun açılıp kapandığı yerleri sözle tarif etmeyi, kürek çekmeden önce öğrendi. Annesi bir kış sakatlanınca teknenin borcu ve küçük kardeşinin bakımı onun üstüne kaldı.',
        'İlk bağımsız seferinde yüklü bir aileyi geçirmek için kendi balık yükünü kıyıda bıraktı. Aile ona ödeme yapamadı; fakat haber yayılınca başka haneler yol istedi. Veyna’nın geçimi yavaşça avdan rehberliğe kaydı. Evde daha düzenli yemek olması, eski borcu kendiliğinden bitirmedi.'),
      chapter('Korunaklı koydaki ağ',
        'Üreme mevsiminde avı azaltılmış bir koya gizlice ağ attığı görüldü. Veyna yaptığı şeyi inkâr etmedi; küçük kardeşinin açlığını anlattı. Koydaki genç balıkların azalmasının başka haneleri de yoksullaştıracağını söyleyenlere ise önce öfkeyle karşılık verdi.',
        'Sigrun’un araya girmesiyle ortak bakım işinde çalışmayı ve borcunu av hakkı üzerinden kapatmayı kabul etti. Birkaç kişi hâlâ onu hırsız diye çağırır. Veyna kendi hikâyesini masumiyet ilanı olarak anlatmaz; o geceye başka çıkış aramadığı için kızar.'),
      chapter('Bir kol boyu daha',
        'Kayığında yeni yolcuya ilk öğrettiği şey, güvenli sanılan kıyıya bile bir kol boyu mesafe bırakmaktır. Rüzgâr değişince açığın kapanabileceğini bilir. Bilgisi donmuş denizi yürüyerek geçmeyi mümkün kılan bir sır değildir.',
        'Haneler onu resmî bir klan lideri olarak değil, geri getiren bir kayıkçı olarak tanır. Veyna küçük bir rehber topluluğu kurmayı düşünür; bu kez tekneye binecek gençlere açlığın bütün kuralları silmediğini söylemek ister.'),
    ],
  }),
  person({
    id: 'borrak-tahr', name: 'Borrak Tahr', role: 'Ocakların meclis temsilcisi', city: 'baldrek', region: 'garmirk',
    affiliation: 'Baldrek zanaat ocakları', traits: ['Ağır söz', 'Çekiç izi', 'Unutulmayan borç'], power: 'powerful',
    summary: 'Borrak, Baldrek zanaat ocaklarının sözünü Demir Meclisi görüşmelerine taşıyan bir temsilcidir; bir yeminin işçiyi de bağlayıp bağlamadığını sorar.', related: ['garmirk', 'thena-vurg', 'mirga-senn'],
    sections: [
      chapter('Kırılan sap',
        'Borrak’ın ailesi demirciydi, fakat ilk işi cevher ayıklamaktı. Bir ustanın verdiği çekicin sapı kırılınca kendi dikkatsizliği nedeniyle cezalandırıldı. Yıllar sonra ustanın sapın kusurunu bildiğini öğrendi; karşı çıktığı şey yalnızca cezadan çok, sorumluluğun her zaman aşağıya düşmesiydi.',
        'Ocak toplantılarında işlerin ne zaman teslim edileceğini değil, kimin hangi şartla o sözü verdiğini sormaya başladı. Gençken sabırsızlığıyla tanındı. Yaş aldıkça başkalarının verdiği bir sözü bütün ocağın yemini saydırmamak için sabretmeyi öğrendi.'),
      chapter('Meclisteki işçi sözü',
        'Ocaklar onu görüşmelere temsilci seçti. Torgalların yerini almaz; klan liderlerine üretimin bedelini ve işçilerin itirazlarını taşır. Sözü bazen büyük silah anlaşmalarını yavaşlattığı için zengin haneler tarafından sevilmez.',
        'Bir siparişi durdurunca işçilerin ücretini kendi birikiminden tamamladı. Sonra birikimi bitti. Bu olay ona yalnızca direnmekle kazanılan itibarı değil, direnişin nasıl sürdürüleceğini de düşünmeyi öğretti. Artık ilk isteği, tartışmalı iş için bağımsız bir ücret payı ayrılmasıdır.'),
      chapter('Baldrek’te kalan yankı',
        'Borrak bütün Garmirk’i yöneten bir kral değildir. Demir Meclisi’yle bağı, temsil ve müzakere üzerinden kurulur. Baldrek’te bir işçi onun adını söylerken bir aile kökeninden önce, birlikte tutulmuş bir hesabı hatırlar.',
        'Thena Vurg’un kusurlu silahı kendi hanesine rağmen damgalamasını desteklemiştir. Mirga Senn’in bu olayı şarkısına almasını da istemiş, ancak kendi yardımını şarkıdan çıkarmasını rica etmiştir. Bir yemin şarkısında adı geçmeyince borcunun unutulacağına inananlardan değildir.'),
    ],
  }),
  person({
    id: 'thena-vurg', name: 'Thena Vurg', role: 'Dövme çeliği sınayıcısı', city: 'baldrek', region: 'garmirk',
    affiliation: 'Baldrek örs ocakları', traits: ['Çatlak damgası', 'Aile kırgınlığı', 'Titiz el'], power: 'distinguished',
    summary: 'Baldrek’in sınayıcısı Thena, çelikteki kusuru ustanın adından bağımsız kaydeder; kardeşinin dövdüğü kılıçları geri çevirmesi onu ailesinden uzaklaştırdı.', related: ['borrak-tahr', 'garmirk'],
    sections: [
      chapter('İsmi olan kılıç',
        'Thena ilk kılıcını babasının yanında izledi. Bitmiş silaha isim verilirken bir yemin gibi susulduğunu hatırlar. Babası bir gün çatlamış kılıcı yeniden dövdüğünde eski ismi kullanmadı. Thena için çeliğin ruhu, kusursuzluk iddiasından önce ustanın neyi kabul ettiğinde saklandı.',
        'Sınayıcı olmak istemesi ocakta şaşkınlık yarattı; bitmiş eseri övmek yerine kırabilecek işi seçiyordu. Uzun süre yalnızca küçük parçaları test etmesine izin verildi. İnce bir iç çatlağı teslimden önce bulması, başkalarının görmediği izlere dikkatinin değerini ortaya koydu.'),
      chapter('Kardeşin mühürsüz yükü',
        'Kardeşinin bir parti silahı sınırı karşılamadığında onay damgasını vermedi. Teslim gecikti, hanenin borcu büyüdü. Aile onu yabancı müşterinin yanında kendi kanını utandırmakla suçladı.',
        'Thena ürünün bir bölümünü birlikte yeniden işlemeyi teklif etti, fakat ilk kararını geri almadı. Kardeşi bugün onunla ancak ocakta konuşur. Bu kırgınlık, dürüst kararın ardından kişisel hayatın hemen düzelmediği bir şey olarak biyografisinde kalır.'),
      chapter('Taşın üzerindeki işaret',
        'Baldrek ocakları için çalışır; bütün Garmirk silahlarına tek başına yetki dağıtmaz. Her incelemesinde ürünü, ustayı ve sınamanın yöntemini ayrı işaretler. Aynı kusurun tekrarında kişinin adını gizleyemez, fakat tek hata yüzünden ustayı sonsuza kadar kötü saymaz.',
        'Bir öğrencisi ondan ünlü bir kılıç istediğinde ona ince bir test keski verdi. Keskinin sapında isim yoktur. Thena, bir eşyanın hikâyesinin kullanılmadan tamamlanmadığını düşünür; o genç hâlâ her sınamada aynı keskiyi taşır.'),
    ],
  }),
  person({
    id: 'keldan-rud', name: 'Keldan Rud', role: 'Geçit nöbetçilerinin kaptanı', city: 'stoneclans', region: 'garmirk',
    affiliation: 'Stoneclans geçit nöbeti', traits: ['Taş kayıt', 'Sert geçiş ücreti', 'Düzen tutkusu'], power: 'powerful',
    summary: 'Stoneclans çevresindeki geçit nöbetini yöneten Keldan, yolları açık tutarken küçük kafilelerden aldığı ağır bakım payıyla tartışılır.', related: ['garmirk', 'mirga-senn', 'taskiran-canakgagasi'],
    sections: [
      chapter('Sis içinde kalan kardeş',
        'Keldan’ın gençliğinde bir yük kafilesi sis içinde yanlış patikaya girdi. Kardeşi, geri getirilenler arasındaydı; yürüyebiliyordu fakat bir gözünü kaybetmişti. Keldan bunu yalnızca kötü havaya değil, kervana yanlış yön veren muhafızın hazırlıksızlığına bağladı.',
        'Nöbetçi olarak işe girince taş işaretleri ve vardiya defterlerini düzenledi. Eskiden aynı işi yıllarca yaptığı için deneyimli sayılan kişi, artık yeni gelen kadar yol bilgisini göstermek zorundaydı. Bu usul kazaları azalttı, eski nöbetçilerin gururunu ise incitti.'),
      chapter('Güvenli yolun ağır bedeli',
        'Kaptan olduğunda onarım için daha yüksek bakım payı topladı. Büyük kervanlar ödeyebildi; küçük haneler dolambaçlı yolları seçti. Keldan geçitte kimsenin ölmediğini söyleyerek usulünü savundu. Başka patikada düşen bir aile bu hesabın dışında kalmıştı.',
        'Borrak’ın temsil ettiği ocaklar küçük yüklerin payı için itiraz ettiğinde Keldan hemen geri adım atmadı. Duvar, köprü ve nöbetçinin gerçek maliyetini bilir; maliyeti karşılayamayan insanın da hâlâ o topraklarda yaşadığını kabul etmekte zorlanır.'),
      chapter('Bir kaptanın sınırı',
        'Yetkisi Stoneclans çevresindeki nöbet anlaşmasına dayanır. Bütün klanların üstünde bir komutan değildir. Bir kafilenin yolunu kayıtla açabilir, ancak bir torgalın yeminini geçersiz kılamaz.',
        'Taşkıran çanakgagalarının yuvalarını yol işaretlerinden uzak tutmaya çalışır; kuşların kopardığı taş parçaları geçitçilere zarar verebilir. Keldan, doğayı denetleyemediğini söylerken rahat, insanlardan gelen itirazı aynı şekilde dinlerken çok daha huzursuzdur.'),
    ],
  }),
  person({
    id: 'mirga-senn', name: 'Mirga Senn', role: 'Yemin şarkıcısı ve arabulucu', city: 'stoneclans', region: 'garmirk',
    affiliation: 'Stoneclans hafıza çevresi', traits: ['Eksik dize', 'Birlikte söylenen ad', 'Keskin hafıza'], power: 'distinguished',
    summary: 'Mirga, Stoneclans’ta yeminlerin geçmişini şarkıyla taşıyan bir anlatıcıdır; kaybedenlerin adını da aynı ezgide tutması ona hem güven hem düşman kazandırır.', related: ['garmirk', 'borrak-tahr', 'keldan-rud', 'golgeli-varnak'],
    sections: [
      chapter('Söylenmeyen ikinci ad',
        'Mirga çocukken bir zafer şarkısında babasının adını arardı. Babası savaştan dönen ustaları taşımış, kırık silahları toplamıştı; büyük ezgide hiçbirinin adı yoktu. Mirga ilk öğrendiği şarkıya bir dize eklediğinde öğretmeni onu susturdu.',
        'Yıllarca resmî törenlerde geleneksel sözleri, akşam ocaklarında ise yardımcıların adını söyledi. Bu ikili hayat sonunda saklanamaz oldu. Bir ustanın ailesi eklenen dizede kendi büyükannesini tanıyınca Mirga’yı törenin önüne çağırdı.'),
      chapter('Yeminle yüzleşmek',
        'İki hane bir anlaşmanın nasıl başladığı konusunda çatışınca Mirga her iki anlatıyı ayrı ayrı dinledi. Birini seçmek yerine ortak kalan kısmı birlikte söylemelerini istedi. Taraflar bütün ihtilafı çözmedi, fakat birbirinin varlığını inkâr edemeyecekleri bir söz buldu.',
        'Bu yöntem onu arabulucu olarak aranan biri yaptı. Bazen bir tarafın hatasını açık bırakmak yerine ezgiyle yumuşattığı eleştirisini alır. Mirga, barışın eski zararı sessizleştirmeye başladığı yerde söylemeyi kesmesi gerektiğini öğrenmeye çalışır.'),
      chapter('Şarkının siyasi ağırlığı',
        'Bir yemin şarkıcısı asker sevk etmez. Buna rağmen bir liderin söylediği sözün daha sonra unutulmasını zorlaştırır. Keldan’ın geçit ücretlerini anlatırken güvenliği ve dışarıda kalan küçük kafileleri aynı şarkıda tutar.',
        'Mağara girişlerinde gölgeli varnakların yankısını dinlemek için çocukları götürür; şarkının yalnızca insanın sesiyle dolu bir odada yaşamadığını anlatır. Bir varnağın sözcükleri anladığını iddia etmez. Sessizliğin de bütün aynı şey olmadığını duymalarını ister.'),
    ],
  }),
  person({
    id: 'ossan-tavren', name: 'Ossan Tavren', role: 'Klanlar arası yük hakemi', city: 'twinclans', region: 'ariki',
    affiliation: 'Twinclans liman sözleşmeleri', traits: ['İki mühür', 'Dostuna borç', 'Açık tartı'], power: 'powerful',
    summary: 'Twinclans’ta klanlar arası nakliye anlaşmalarını dinleyen Ossan, özgürlüğün ortak borçlardan kaçmak için kullanılmasına karşı çıkar.', related: ['ariki', 'yaren-morrik', 'delia-eryth'],
    sections: [
      chapter('İki mühür arasındaki çocuk',
        'Ossan’ın ailesi farklı klanlara ait yükleri aynı depoda saklardı. Bir sandığın kime ait olduğunu iki mührün bir arada duruşundan okumayı öğrendi. Bir mühür silindiğinde depocuya gelen öfke, onu çok erken yaşta kaydın ne kadar kişisel olabileceğiyle tanıştırdı.',
        'İlk işinde bir arkadaşının eksik yükünü defterde tam gösterdi. Arkadaşı o sefer iflastan kurtuldu, fakat zarar ortak depoya kaldı. Ossan yıllar sonra borcu kendi kazancıyla kapattı. O süre boyunca söylediği her dürüstlük öğüdünde bu eski hesabı duydu.'),
      chapter('Sözleşmenin içindeki özgürlük',
        'Liman sözleşmeleri için hakem olduğunda taraflardan yalnızca mührünü değil, yerine getiremeyeceği işi de açıklamasını ister. Ariki’nin özgürlük dilinin, güçlü kişinin küçük ortağını borçla susturmasına çevrilmesine karşı çıkar.',
        'Buna rağmen söz verilmiş yükü teslim etmek için ağır yaptırımları destekler. Zarar görmüş haneye yardım etmek ile güvenilir ticareti sürdürmek her dosyada yeniden çatışır. Ossan bu gerilimi bitirmiş bir bilge gibi konuşmaz; her kapalı dosyadan sonra dönüp aynı soruyu sorar.'),
      chapter('Twinclans’ta açık kapı',
        'Bütün Ariki’nin seçilmiş lideri değildir. Yerel hakemliği klan temsilcilerinin kabulüne bağlıdır. Gücü, anlaşmazlığı dinleyebilmesi ve herkesin aynı tartıya yük koymasını sağlayabilmesidir.',
        'Delia Eryth’in uzaktan gönderdiği kayıtlara güvenir, Yaren Morrik’in güvenlik ihtiyacını ise bazen fazla pahalı bulur. Evinin kapısındaki iki mühür, kendisinin iki klanın da üstünde olduğunu değil, iki tarafa da hesabı olduğunu hatırlatır.'),
    ],
  }),
  person({
    id: 'yaren-morrik', name: 'Yaren Morrik', role: 'Liman nöbeti kaptanı', city: 'northpact', region: 'ariki',
    affiliation: 'Northpact kıyı nöbeti', traits: ['Kesilmiş direk', 'Nöbet paylaşımı', 'Korkuya direnç'], power: 'powerful',
    summary: 'Northpact’ın kıyı nöbetini yöneten Yaren, güvenlik adına her yabancıyı düşman sayan eski usulü değiştirdi; bu tercih bir başarısızlıkta yeniden sorgulanır.', related: ['ariki', 'ossan-tavren', 'ruzgaryazari'],
    sections: [
      chapter('Direği kesmek',
        'Yaren genç tayfa olarak ilk fırtınasında geminin hasarlı direğini kesmeye yardım etti. Gemiyi kurtaran karar, kaptanın yıllarca gurur duyduğu yapıyı denize bıraktı. Eve döndüğünde cesaretin bazen tutmak değil, vazgeçmek olduğunu öğrendi.',
        'Kıyı nöbetine geçtiğinde bu hatırayı taşımaya devam etti. Eski işaretleri ve görevleri sırf atalar kullanmış diye korumadı. Küçük teknelerin büyüyen ticaretinde hangi nöbetin işe yaradığını kıyıda yürüyerek inceledi.'),
      chapter('Açık iskele',
        'Yaren, bütün yabancı tekneleri gün boyunca liman dışında bekletme usulünü gevşetti. Kimlik ve yük kontrolü sürdü, fakat küçük balıkçıların bozulacak avıyla gecikmesi azaldı. Kaptanlar rahatladı; bazı muhafızlar ona güvenliği ucuza sattığını söyledi.',
        'Bir hırsızlık olayından sonra suçlamalar geri döndü. Yaren yanlış denetimi araştırdı, kendisini temize çıkarmak için yabancıların hepsini kapıya dizmedi. Çalınan malın sahibine bu tutum teselli olmadı; kaptanlığının en zor konuşması onunla yaptı.'),
      chapter('Northpact’ın nöbeti',
        'Morrik geleneğiyle yetişmiştir, fakat klanın bütün askerî kuvvetini tek başına yönetmez. Northpact kıyı nöbetinin vardiyaları ve hazırlığı sorumluluğudur. Bir seçimin sonucunu kılıç gücüyle değiştirme hakkı olduğunu düşünmez.',
        'Rüzgâryazarlarının kıyı üstündeki alçak uçuşunu gemi planında bir gözlem olarak kullanır; hava bilgisi yerine koymaz. Yeni nöbetçilere ilk dersi, bir işaretin tek açıklaması olduğunu sandıklarında soru sormalarıdır.'),
    ],
  }),
  person({
    id: 'delia-eryth', name: 'Delia Eryth', role: 'Deniz kayıtları elçisi', city: 'eldrascar', region: 'ariki',
    affiliation: 'Eldrascar bilgi ve görüşme çevresi', traits: ['Kayıp mektup', 'Aile suskunluğu', 'Sabırlı dinleme'], power: 'distinguished',
    summary: 'Eldrascar’da deniz haberleriyle diplomatik kayıtları bir araya getiren Delia, susturulmuş bir mektubu ailesine rağmen açığa çıkararak görev kazandı.', related: ['ariki', 'ossan-tavren'],
    sections: [
      chapter('Mektuptaki boşluk',
        'Delia, Eryth çevresindeki bir kâtip hanesinde büyüdü. Küçükken kopyaladığı bir mektupta kesilmiş bir satır gördü; babası bunun kopya hatası olduğunu söyledi. Yıllar sonra satırın bir küçük klanın itirazı olduğunu anladı.',
        'İlk resmî görüşmesinde saklanan metnin aslını getirip tarafların önüne koydu. Görüşme uzadı, ailesinin itibarı sarsıldı. Delia, doğru kaydı teslim etmenin ardından ailesine dönüp suskunluğun nasıl başladığını dinlemek zorunda kaldı.'),
      chapter('Uzaktan gelen ses',
        'Bugün liman haberlerini, yük anlaşmalarını ve toplantı notlarını eşleştirir. Bir haberin kimden çıktığını, kimin yararına tekrarlandığını ve hangi hanenin sözünün eksik kaldığını sorar. Her söylentiyi aynı ağırlıkta yazmaz.',
        'Babasıyla arasındaki kırgınlık bütünüyle kapanmamıştır. Buna rağmen yaşlı adamın çizelge bilgisinden yararlanır, kopyalarda değişiklik yapılırsa bunu not düşer. İnsanla ilişkiyi sürdürmek, yaptığı yanlışı kayıttan silmek anlamına gelmez.'),
      chapter('Eldrascar’ın görüşme odası',
        'Delia adalar adına sınırsız yetkili bir elçi değildir; belirli görüşmelerde Eldrascar’ın bilgi çevresini temsil eder. İmzalayamayacağı sözü toplantı baskısıyla vermez. Kâğıdının arkasında gönderenlerin yetki sınırlarını da taşır.',
        'Ossan’ın Twinclans’taki ihtilaflarına gönderdiği notlar bu titizlikle hazırlanır. Delia’nın en sevdiği arma süslü bir mühür değil, her kopyada boş bıraktığı düzeltme payıdır. Söylenmemiş bir satıra yeniden yer açabilmek ister.'),
    ],
  }),
  person({
    id: 'vraska-bralk', name: 'Vraska Bralk', role: 'Hızlı kıyı gemisi kaptanı', city: 'hurnreach', region: 'gurbin',
    affiliation: 'Bralk denizcileri', traits: ['Keskin manevra', 'Pay pazarlığı', 'Kaybedilen tayfa'], power: 'powerful',
    summary: 'Hurnreach’te Bralk denizciliğiyle yetişen Vraska, hızı ün kazanmak için değil tayfasını geri getirmek için kullanmayı zor bir yenilgiden sonra öğrendi.', related: ['gurbin', 'nesren-tarn', 'yariksirt-varsak'],
    sections: [
      chapter('En hızlı dönmeyen tekne',
        'Vraska, bir kaptanın tekneye son binen çocuğuydu; boşalan yeri hemen doldurmak için sürekli koşardı. Gençliğinde hızı bir yetenekten çok kimliğe çevirdi. İlk yönetimini aldığı teknede rakibinden önce limana girmek uğruna ağır bir manevraya girişti.',
        'Tekne döndü, iki tayfa dönmedi. Vraska’ya soru soran ailelerin önünde kazayı dalgaya yüklemedi. Hızlı karar vermekle iyi karar vermeyi aynı saydığını söyledi. Bu söz kaybı düzeltmedi; tayfa seçerken artık kimi susturduğuna dikkat etmesini sağladı.'),
      chapter('Yeni tayfanın payı',
        'Bugün Bralk denizciliğinin hızlı teknelerinde kaptanlık eder. Yol bitiminde ücretleri yalnızca kıdeme değil, yapılan bakım ve nöbete göre ayırır. Deneyimli tayfaların bir kısmı bundan hoşlanmaz; gençler kendilerini yalnızca yedek el gibi görmemesini önemser.',
        'Kraenfall’daki Nesren Tarn’la pahalı bir ikmal anlaşması yüzünden kavgalıdır. Vraska söz verilmiş mal için para bulmak zorundadır; Nesren ise karşılığı geciken hızın kendi işçisini beslemediğini söyler. İkisinin de haklı olduğu kısım, limanda anlaşmayı daha kolay yapmaz.'),
      chapter('Hurnreach’te bağımsızlık',
        'Kaptanlık makamı bütün Bralk gemilerinin komutanlığı değildir. Vraska gemisini ve tayfasını temsil eder. Bir klanın bağımsızlığını savunmanın, o klanın her kararına ses çıkarmadan katılmakla aynı olmadığını kendi güvertesinde kabul ettirmeye çalışır.',
        'Yarıksırt varşakların kullandığı kaya kovuklarını bilir ve demirleme planında bu dar sahilleri boş bırakır. Geri çekilmeyi öğrenmesi onu her tehlikeden korkan biri yapmadı; hangi bedelin gösteriş için ödendiğini daha erken görmesini sağladı.'),
    ],
  }),
  person({
    id: 'nesren-tarn', name: 'Nesren Tarn', role: 'İkmal ve borç aracısı', city: 'kraenfall', region: 'gurbin',
    affiliation: 'Kraenfall yük çevresi', traits: ['Kredi sözü', 'Pahalı güven', 'Kaybolmayan alacak'], power: 'powerful',
    summary: 'Nesren, Kraenfall’de gemilere ikmal sağlayan ve klanlar arası krediye aracılık eden kişidir; verdiği güvence, çoğu borçluyu yıllarca kendisine bağlar.', related: ['gurbin', 'vraska-bralk', 'morvek-kryss'],
    sections: [
      chapter('Geri gelen alacak',
        'Nesren’in annesi küçük bir erzak deposu işletirdi. Bir kaptana güvenip bütün stokunu vadeli verdi; kaptan dönmeyince depo kapandı. Nesren, insanların sözünden vazgeçmedi ama hangi sözün hangi bedelle teminat sayılacağına takıntılı hâle geldi.',
        'Önce depocunun hesabını tuttu, sonra farklı yüklerin riskini bir araya getirdi. Tek bir teknenin kaybı bütün ortakları yıkmasın diye kurduğu düzen gerçekten işe yaradı. Ücretin içinde kendi korkusunun payı da büyüdü.'),
      chapter('Kırılmayan bağ',
        'Bir balıkçı hanesine verdiği yardım sayesinde tekneleri kurtuldu. Karşılığında av ve bakım işlerini uzun süre kendi ortaklarına bağladı. Nesren bunun kötü kışta kimsenin aç kalmamasını sağladığını söyler; iyi yazda borcunu bitirip ayrı iş yapmak isteyenlere ise ağır bedeller çıkarır.',
        'Gücü borcun kendisinden çok, borçluya diğer kapıların kapanmasını sağlayan ilişkilere dayanır. Morvek Kryss, ona sözünü tutan biri olarak saygı duyar fakat bu ilişkilerin haneleri sessizleştirdiğini düşünür. Nesren iki yargının aynı anda doğru olabileceğini sevmese de reddedemez.'),
      chapter('Kraenfall’de hesap',
        'Bir kral ya da klan reisi değildir. İkmal, kredi ve ortaklar arasındaki haber akışı yerel ağırlığını oluşturur. Dışarıdan gelen tüccara hangi anlaşmayı yapacağını söylerken kendi payının da anlaşmada olduğunu açıklar.',
        'Depolarında çalışanların kışlık stoğunu ayırır ve kayba rağmen ücretlerini öder. Bu güven, ona borçluları üzerinde daha ağır nüfuz kurma imkânı verir. Nesren’in iyi tarafı kötü tarafını ortadan kaldırmaz; ikisi aynı hesap yönteminden doğar.'),
    ],
  }),
  person({
    id: 'morvek-kryss', name: 'Morvek Kryss', role: 'Gölge Yemini eğitmeni', city: 'volriks-maw', region: 'gurbin',
    affiliation: 'Volrik’s Maw yemin çevresi', traits: ['Gözlem', 'Sınanan sadakat', 'Öğrenciye mesafe'], power: 'powerful',
    summary: 'Morvek, Volrik’s Maw’da gençlerin Gölge Yemini eğitimini yürütür; stratejiyi öğretirken kör itaati üstün başarı saymayı reddeder.', related: ['gurbin', 'nesren-tarn'],
    sections: [
      chapter('Yanlış efendinin emri',
        'Morvek’in ilk eğitmeni, emri sorgulamadan yerine getiren öğrencileri överdi. Genç Morvek bir nöbette başka bir hanenin erzağını alıkoyunca bunun bir sınama olduğunu sandı. Sonra işin gerçek bir aileyi aç bıraktığını gördü.',
        'Eğitmeninden ayrılması ona düzenli işini kaybettirdi. Kıyıda yük taşıyarak yaşadı, akşamları birkaç gence gözlem ve hazırlık çalıştırdı. Kendisiyle aynı yanlışı kolayca yapabilecek öğrenciler yetiştirmek istemediği için derslerde hedefin kime zarar verdiğini de sormaya başladı.'),
      chapter('Yeminin sınırı',
        'Şimdi yerel Gölge Yemini çevresinde kabul gören bir eğitmendir. Vahen öğretisinin güç ve başarı arayışını küçümsemez; başarının hangi koşulda alındığını saklamanın onu boşa çıkardığını söyler. Öğrencilerinden yalnızca kazandıkları denemeyi değil, bozdukları ilişkiyi de anlatmalarını ister.',
        'Bu usulünü paylaşmayanlar onu gençleri kararsızlaştırmakla suçlar. Morvek de bazen eski baskının korkusuyla gerekli bir emri fazla tartıştığını kabul eder. İtaatin zararını görmüş olması, bütün hızlı kararların kötü olduğuna kanıt değildir.'),
      chapter('Volrik’s Maw’daki ders',
        'Kryss geleneğiyle bağları vardır, bütün klanın ruhani liderliğini üstlenmez. Nesren’in kredi anlaşmalarını öğrencilerine strateji örneği olarak okutur. Anlaşmanın sağlamlığıyla adilliği üzerine iki ayrı tartışma açar.',
        'Sahada taşıdığı bıçak törenlik değildir; eski yük işinden kalmış sıradan bir araçtır. Bir gencin süslü silaha duyduğu hevesi aşağılamaz. Önce o aracın kimi koruyacağını ve her gün nasıl taşınacağını anlatmasını ister.'),
    ],
  }),
  person({
    id: 'seren-azh', name: 'Seren Azh', role: 'Sıcak kıyı kılavuzu', city: 'lakbar', region: 'lakbar',
    affiliation: 'Lakbar kıyı ustaları', traits: ['Gazı dinler', 'Sınırlı açıklık', 'Yabancı öğrenci'], power: 'distinguished',
    summary: 'Lakbar kıyılarında özel ahşap araçlarla yol alan Seren, dışarıdan gelenleri taşısa da her tekniğini satmayı reddeden bir ustadır.', related: ['lakbar', 'orun-vehl', 'koz-sirtli-neral'],
    sections: [
      chapter('Yanlış suya inen araç',
        'Seren çocukken kıyı araçlarının yapımına yardım etti. Bir ustanın en güzel yeni aracı, değişen sıcak su akışında zarar görünce iyi malzemenin iyi rota yerine geçmediğini öğrendi. Usta araç için üzülürken annesi geri dönen insanların ellerini tek tek kontrol etmişti.',
        'Kılavuzluğu üretimin devamı olarak seçti. Gaz, akıntı ve değişen kaya kıyısını gözlemleyebilmek yıllar aldı. Kıyıda bir yabancının anlayabileceği işaretleri ayrı, ustalık gerektiren bilgiyi ayrı öğretmeye başladı.'),
      chapter('Taşınan yabancı',
        'Bir tüccar ona pahalı ücretle bütün rotalarını yazmasını teklif etti. Seren sadece güvenle açıklayabileceği kıyı uyarılarını verdi. Tekniği saklamanın sıradan bir yabancıyı gereksiz tehlikede bırakmasını istemiyordu; her bilginin satılmasının da halkını korumadığını biliyordu.',
        'Bu tutumu bazı ustalara fazla açık, tüccarlara ise fazla kapalı gelir. Seren iki tarafı da bütünüyle memnun etmez. İlk yabancı öğrencisine verdiği ders, hangi sorunun cevaplanmayacağını nasıl söyleyeceği oldu.'),
      chapter('Kıyıdaki usta',
        'Lakbar’ın merkezi hükümdarı değildir. Kıyı araçları ve belirli yolculuklar için tanınan bir kılavuzdur. Ustalar bir tekniği ona emanet ederken bütün kıyının yönetimini vermiş olmaz; her yolculukta hangi hazırlığı kimin üstleneceği yeniden konuşulur.',
        'Közsırtlı neralların kaya aralarında toplandığı yerde ayağını yavaşlatır: hayvanlar hâlâ yeterince serin sığınak bulabildiğinin küçük bir işaretidir, lavın güvenli olduğu anlamına gelmez. Ustalığını en çok sınırını doğru anlatabildiğinde gösterir.'),
    ],
  }),
  person({
    id: 'orun-vehl', name: 'Orun Vehl', role: 'Ateş koruma halkası ustası', city: 'lakbar', region: 'lakbar',
    affiliation: 'Lakbar uygulama ustaları', traits: ['Kontrollü alev', 'Geri çağrılan ders', 'Yanık el'], power: 'powerful',
    summary: 'Orun, Lakbar’da ateşin gündelik kullanımında koruma ve bakım çalıştıran bir büyü ustasıdır; öğrencisini aceleye zorladığı bir uygulamanın izini elinde taşır.', related: ['lakbar', 'seren-azh', 'dessa-koru'],
    sections: [
      chapter('Tutulamayan halka',
        'Orun’un ailesi sıcak kaya çevresinde araç bakımından geçinirdi. Ateş büyüsü öğrenirken ilk hedefi başka insanlara üstünlük kurmak değil, çalışmanın güvenle sürdürülebileceği bir alan açmaktı. Teknikte hızla ilerledi; başkalarının aynı hızda öğrenmesini beklemeye başladı.',
        'Bir öğrenciyi henüz tamamlayamadığı koruma halkasını sürdürmeye zorladı. Halka bozulduğunda Orun gençle birlikte yandı. Elindeki kalıcı izden çok, öğrencinin artık kendisine soru sormamaya başlaması onu sarstı.'),
      chapter('Ustanın geri çağrısı',
        'Ders düzenini değiştirdi: yorulan öğrenci uygulamayı durdurabilir, ustanın bunu utanç saymaması gerekir. Eski çevresinin bir kısmı bu esnekliği güçsüzlük gördü. Orun bir süre açık gösterilerden uzaklaştı ve gündelik bakım işine döndü.',
        'Dessa Koru ile birlikte zarar gören araç ve alanları yenilerken bir korumanın kurulmasının ardından da sürekli bakım istediğini öğretti. Başarısı tek büyük alevde değil, ocağın ertesi gün yeniden ve güvenle çalışmasında ölçülmeye başladı.'),
      chapter('Lakbar’ın sınırları',
        'Lakbar ateş ve kaos ustalıklarının tamamı adına konuşmaz. Bir uygulama çevresinin tanınan ustasıdır. Danstsud ruhsat hukukunu bu ülkenin yerel geleneği diye sunmaz; iki kültürün kurallarının ayrı olduğunu belirtir.',
        'Seren Azh’ın kıyı uyarılarını kendi koruma sınamalarıyla birlikte değerlendirir. Büyüsü bir bütün denizi soğutamaz, sıcak kayayı sonsuza dek zararsız yapamaz. Öğrencilerine önce bunu söylemesi, bugün ona duyulan güvenin en somut parçasıdır.'),
    ],
  }),
  person({
    id: 'dessa-koru', name: 'Dessa Koru', role: 'Isıya dayanıklı ahşap işleyicisi', city: 'lakbar', region: 'lakbar',
    affiliation: 'Lakbar kıyı araçları atölyesi', traits: ['Yeniden kullanılan parça', 'İşçi öğretmeni', 'Kaybolmayan hata'], power: 'distinguished',
    summary: 'Dessa, Lakbar’ın özel ahşaplarını kıyı araçlarına dönüştüren ustadır; malzeme kıtlığı nedeniyle gelişmiş onarım bilgisi, onu üretim çevresinde aranan biri yapar.', related: ['lakbar', 'orun-vehl', 'nalis-orr', 'kara-yel-arisi'],
    sections: [
      chapter('Yeni olmayan tahta',
        'Dessa’nın ilk atölyesinde yeni tahta azdı. Eski araçlar parçalanır, sağlam kalan bölüm yeni yapıda kullanılırdı. Çıraklara güzel bir yüzey çıkarmadan önce parçanın eski çatlağını okumak öğretilirdi.',
        'Bir tamirde saklı çatlağı görmedi. Araç kıyıda bozuldu; kimse ölmedi ama günlerce yük taşınamadı. Dessa yaptığı hatayı parça üzerine işleyip atölyede bıraktı. Kusuru görünmez yapmanın, onu öğrenilmiş saydırmadığını anlatmak istedi.'),
      chapter('Onarımı küçümsemeyen ocak',
        'Kendi atölyesinde yeni eserle onarımı aynı saygınlıkta tuttu. Yeni araç satışından daha az kazandı, fakat pek çok küçük hanenin pahalı işi sürdürmesini sağladı. Nalis Orr bu yöntemlerin dışarıda daha pahalı satılabileceğini söylediğinde Dessa önce malzemenin kaynağını düşünmesini istedi.',
        'Usta her şeyi açıklamaz; özel ağaç bilgisinin bütünü dışarıya sunulmaz. Buna rağmen çırağın hata yapma hakkını korur. Bir kusur ortaya çıkınca kimin elinden geçtiğini saklamaz, kişiyi tek bir yanlışın içinde bırakmaz.'),
      chapter('Kıyı araçlarının günü',
        'Orun Vehl’le iş güvenliği için birlikte çalışır. Koruma büyüsü alet bakımını gereksiz kılmaz; daha iyi ahşap da gazlı bir kıyıyı kendiliğinden açmaz. Kullanıcıya ürünle birlikte bu sınırları anlatır.',
        'Kara Yel Arılarının reçineli ağaçlardaki yuvalarını kesimden önce izler. Her arılı ağacı kutsal saymaz; fakat bir ağacın çevresindeki küçük yaşam bozulduğunda gelecek kesimin de değişeceğini bilir. Onun atölyesinde malzeme yalnızca depoya girmiş kereste değildir.'),
    ],
  }),
  person({
    id: 'nalis-orr', name: 'Nalis Orr', role: 'Dış ticaret arabulucusu', city: 'lakbar', region: 'lakbar',
    affiliation: 'Lakbar sınırlı ticaret çevresi', traits: ['Çift fiyat', 'Korunan yöntem', 'Pazarlıkçı'], power: 'powerful',
    summary: 'Xotar ve Garmirk temaslarında Lakbar’ın sınırlı mallarına aracılık eden Nalis, yerel ustalığı korurken kendi aracılık payını da büyütür.', related: ['lakbar', 'dessa-koru', 'seren-azh', 'xotar', 'garmirk'],
    sections: [
      chapter('Dönen tüccarın hesabı',
        'Nalis ilk kez dışarıya çıkan bir yükün kâtibi olarak işe başladı. Satılan aracın yabancı limanda kendi aldığı ücretin çok üstünde fiyatlandığını gördü. Döndüğünde ustaların yalnızca üretim bedelini değil, pazara erişimin bedelini de konuşması gerektiğini söyledi.',
        'Temasları arttıkça kendisi bu erişimin sahibi hâline geldi. Küçük ustalar daha iyi ücret aldı; Nalis’in payı da her yeni anlaşmada büyüdü. Eskiden karşı çıktığı aracılık gücünün yeni yüzü olmaya başladığını fark etmek işine gelmedi.'),
      chapter('Bilgiyi satmayan sözleşme',
        'Sözleşmelerinde ürünün kullanımıyla üretimin bütün yöntemini ayrı tutar. Bir yabancıya güvenli bakım bilgisi verilmesini savunur, özel tekniklerin bütünüyle devredilmesini reddeder. Bu ayrım bazı işlerin gerçekleşmesini, bazı kârlı tekliflerin de kaybolmasını sağladı.',
        'Seren’in gizlediği rotaları ele geçirmeye çalışmamıştır; fakat daha çok yük taşımasını isteyerek kıyıların sınırını zorlar. Kendisini kültürü koruyan biri diye görürken korumayı yapan ustaların yorgunluğunu bazen ticari bir gecikme sayar.'),
      chapter('Arabulucunun payı',
        'Lakbar adına bütün anlaşmaları imzalayan bir hükümdar değildir. Yetkisi temsil ettiği belirli atölye ve ortaklıklardan gelir. Bir ustanın verdiği temsil izni bütün halkın sözünü ona bırakmaz; başka atölyenin işini aynı şartla sunmak için ayrıca görüşmesi gerekir.',
        'Dessa Koru, onun getirdiği siparişleri bazen geri çevirir. Nalis buna kızsa da elindeki kaliteli ürünlerin o bağımsız ustalıktan doğduğunu bilir. İlişkileri hem gerçek karşılıklı yarar hem de sürekli pazarlık taşır; tek bir iyi ya da kötü sıfatına sığmaz.'),
    ],
  }),
]

const establishedPortraitBriefs: Record<string, string> = {
  'sahira-nemesh': '52-year-old dark brown-skinned female water-court assessor of Zarim’khet; broad cheekbones, silver-threaded tightly curled hair beneath a cream linen wrap, weathered hands, indigo robe with an old copper water-measure token, thoughtful firm expression, muted ochre plaster and one small ceramic water cup, warm side light with cool violet shadow.',
  'daren-khoss': '44-year-old lean caravan captain of Thariz, copper complexion, close-cropped black beard and pale scar crossing left eyebrow, dust-rose headcloth, layered sand-colored traveling coat, repaired round leather shield, wary attentive gaze, red-sand painted background, tawny and ultramarine palette.',
  'nemeh-sarun': '63-year-old female Karutah healer of Sahrim, deep warm brown skin, short silver hair, strong crooked nose, calm unsentimental eyes, sun-faded saffron robe with simple white collar, holding folded linen bandages, green-blue oasis shadow and restrained amber light.',
  'rahim-vekk': '37-year-old compact male grain-and-silk broker of Qal’Nashar, warm brown complexion, uneven smile, wavy dark hair, trimmed mustache, burgundy embroidered coat with brass weight at belt, calculating eyes, ochre trade hall in loose indigo shadow, modest jewelry.',
  'ilvara-senn': '46-year-old female Morihael harbor convener, medium brown complexion, dense curly black hair bound back with faded sea-green cloth, strong broad nose and shoulders, practical teal robe beneath a salt-worn ochre sleeveless overcoat, coral-red cord bracelet, wooden tide marker, level gaze, deep blue loose-painted harbor background.',
  'torren-azhal': '58-year-old male Azja sanctuary keeper of Morihael, dark warm skin, very short graying hair, slender face, expressive deep-set eyes, plain brown and moss-green woven mantle, carved driftwood staff with worn smooth grip, gentle slightly tired posture, leaf-shadow and warm lantern ochre.',
  'kevar-nahl': '42-year-old prosperous Morihael shipyard shareholder, medium bronze complexion, stocky strong torso from carpentry, thick wavy dark hair streaked at temples, broad genial mouth and shrewd small eyes, polished teal wool coat over ochre work waistcoat, two practical brass rings, ship-timber ribs softly brushed behind him, warm copper light and cool sea shadows.',
  'haldrun-ylse': '35-year-old Honud female teacher of oral tower lore, broad pale face with wind-reddened cheeks, light gray eyes, ash-brown hair in short uneven braids, thick undyed ivory wool wrap over muted blue teaching robe, simple smooth wooden staff, alert listening posture with relaxed hands, dark blue-gray tower wall and one warm fire reflection; no ice crystal crown.',
  'eyrik-voss': '56-year-old Honud male winter granary distributor, very broad chest and rounded lined face, ruddy pale complexion, closely shaved head and heavy gray beard, thick muted brown felt coat with a plain iron storehouse key, confident but defensive gaze, ochre dried-fish racks loosely painted against cold indigo shadow, restrained warm side light.',
  'sigrun-nel': '66-year-old Honud female coastal hunting guide, weathered light skin with deep crow’s-feet, short white hair tied back, strong squared jaw and an amused firm mouth, charcoal wool and faded blue seal-oiled leather shoulder mantle, old plain harpoon partly visible, sturdy upright bearing, storm-gray sea with warm low amber rim light.',
  'veyna-korr': '27-year-old Honud female small-boat ice guide, pale skin with copper-red freckles and reddened nose, cropped chestnut hair escaping a hood, narrow alert face and tired hazel eyes, patched olive-blue fur-lined coat, rope loop across shoulder and a carved wooden paddle held low, cautious restless posture, sea-green black water and soft slate-blue ice, small warm face highlight.',
  'borrak-tahr': '61-year-old Garmirk male craft-hearth delegate, dark sun-browned lined face, wide nose, long salt-and-pepper hair tied low, squared black-gray beard, heavy charcoal wool coat with one simple copper clasp, thick scarred working fingers holding a worn hammer haft, grave patient eyes, loose russet forge shadows with subdued amber light; no crown.',
  'thena-vurg': '38-year-old Garmirk female steel assayer, warm olive complexion, tall narrow face with slightly bent nose, black hair cut just below jaw, strong muscular forearms, gray-blue work shirt and reddish-brown leather apron, a small plain testing chisel and blade sample held safely low, attentive candid expression, charcoal forge background with cream-gold side light.',
  'keldan-rud': '49-year-old Garmirk male pass-watch captain, weathered tawny skin, deep-set gray eyes, long blunt nose and thick dark mustache without beard, closely cropped dark hair, practical layered iron-gray armor beneath a rust red mountain cloak, etched stone route token rather than jewels, rigid straight posture, misty slate mountains painted loosely with muted warm edge light.',
  'mirga-senn': '47-year-old Garmirk female oath singer, light brown weathered complexion, broad expressive smiling face, dark curly hair threaded with silver tied by simple red cord, ochre woven tunic and indigo mantle, no instruments required, one hand marking the rhythm, calm communicative eyes, loosely brushed stone-arch background with warm cream light and quiet violet shadows.',
  'ossan-tavren': '45-year-old Ariki male inter-clan cargo arbitrator, golden-brown complexion, lean face with strong straight nose, close-cropped black hair and short beard, practical cream collar beneath deep emerald robe, two different plain seal tokens on cord, one hand beside an old brass weighing pan, thoughtful measured expression, muted warm wood and cool teal maritime background.',
  'yaren-morrik': '48-year-old Ariki female harbor-watch captain, medium brown skin, round strong face with cheek scar, short dense black curls with gray at front, robust shoulders, dark blue practical mail and sea-green cape, no ornate crown, weathered cut mast fragment softly painted behind her, vigilant gaze, warm ochre light set against cool blue sea haze.',
  'delia-eryth': '32-year-old Ariki female maritime records envoy, bronze complexion, angular cheeks and fine expressive brows, long black hair bound in a loose low knot, dark violet linen gown under faded blue traveling mantle, folded letters secured with plain red cord, thoughtful slightly wary gaze, lamp-lit muted gold desk edge and blue-gray sea window rendered with broad paint.',
  'vraska-bralk': '40-year-old Gurbin female fast coastal ship captain, dark olive skin, heavy brows and crooked grin, black hair shaved short at sides with a tied top section, long healed scar along chin, salt-worn charcoal leather coat over deep crimson knit, heavy rope at waist and a simple narrow knife sheath, decisive but tired eyes, storm-indigo background and restrained warm rust light.',
  'nesren-tarn': '53-year-old Gurbin male maritime credit intermediary, pale olive skin with smallpox texture expressed in paint, tall narrow forehead, receding wavy black-gray hair and neatly trimmed mustache, deep plum wool coat with wide plain belt, ink-marked fingers beside a folded cargo note, composed calculating expression, muted amber warehouse light and loose charcoal-violet shadows.',
  'morvek-kryss': '46-year-old Gurbin male oath and strategy tutor, deep warm brown skin, lean long neck, shaved head, calm almond-shaped dark eyes, small scar at temple, plain ash-green layered robe and dark brown weathered shoulder wrap, humble working knife at belt, seated attentive pose, smoky basalt-gray painted background with one warm terracotta light plane.',
  'seren-azh': '34-year-old Lakbar nonbinary coastal guide, medium dark bronze complexion, narrow face with high cheekbones, short black curls, expressive amber-brown eyes, heat-worn charcoal linen coat with copper-colored stitching, special dark wooden paddle held close, calm alert mouth, softly painted volcanic dark teal water and warm ochre sulfur haze; no glowing eyes.',
  'orun-vehl': '59-year-old Lakbar male practical fire-protection master, dark brown skin, broad older face, close white beard and shaved head, left hand with visible healed burn scarring, ochre and soot-black woven robe with plain rope belt, steady reflective gaze, only one small contained warm flame near a simple workshop bowl, plum-black painterly shadows and soft amber light; no huge magical effects.',
  'dessa-koru': '41-year-old Lakbar female heat-resistant boatwood craftsperson, copper-brown skin, short dense dark curls, square face and broad nose, muscular forearms, soot-blue work blouse beneath ochre leather apron, small wooden plane and repaired plank visible, thoughtful direct expression, hand-painted warm wood curls and volcanic deep-gray background with restrained copper highlights.',
  'nalis-orr': '50-year-old Lakbar male limited-trade negotiator, warm bronze complexion, long elegant face, silver-streaked black wavy hair to ears and clean-shaven jaw, soft charcoal and burnt orange layered coat, plain dark bead bracelet, one hand resting on a small carved trade box, courteous guarded smile, ochre painted wall with deep wine-purple cool shadow; no crown or excessive jewelry.',
}


// Visible additional map labels audited against the original 8K image.
const mappedWorldDrafts: PersonDraft[] = [
  {
    "id": "nesima-raal",
    "name": "Nesima Raal",
    "city": "orunq",
    "region": "xotar",
    "role": "Su geçişleri toplantı sözcüsü",
    "affiliation": "Orunq su geçişleri ortaklığı",
    "traits": [
      "Değişen pay",
      "Oğluna hayır",
      "Açık kap"
    ],
    "power": "powerful",
    "summary": "Orunq’ta su geçişleri ve teslim sırasını görüşen Nesima, kendi oğlunun öncelik talebini reddederek ortaklığın kurallarını aile sözünden ayırdı.",
    "related": [
      "xotar",
      "sahira-nemesh"
    ],
    "sections": [
      {
        "title": "Taşınan kaplar",
        "paragraphs": [
          "Nesima çocukken su kabı taşırdı; ailesi başkalarının teslimlerine yardım ederek geçinirdi. En yorucu işin suyu kaldırmak değil, sırada kavga eden insanları ayırmak olduğunu gördü. Bir kış hesabında komşusuna yazılan borcun kendi ailesine ait olduğunu fark edip düzelttiğinde önce evinde azarlandı, sonra komşuların hesaplarına çağrılmaya başladı."
        ]
      },
      {
        "title": "Oğlunun sırası",
        "paragraphs": [
          "Yıllar sonra oğlunun işlettiği yük ortaklığı erken teslim istedi. Nesima bekleyen hanelerin onayı olmadan sırayı değiştirmedi. Yük gecikti, aralarındaki güven sarsıldı. Oğluna gizli pay vermek yerine kaybını herkesin katılabildiği açık görüşmede dinlemesi, dürüstlüğünü sevgi göstermemekle karıştıranlara hâlâ ağır gelir."
        ]
      },
      {
        "title": "Orunq’taki toplantı",
        "paragraphs": [
          "Nesima’nın yetkisi belirli ortaklığın teslim ve paylaşım görüşmesine dayanır; bütün Xotar adına emir vermez. Sahira’nın açık kayıt usulünden yararlanır, fakat her kentin ihtiyacının aynı olduğunu düşünmez. Görüşme başında boş kabı masaya koyar: önce herkesin aynı eksikliği gördüğünü, sonra nasıl paylaşılacağını konuşmak ister."
        ]
      }
    ]
  },
  {
    "id": "odrik-sel",
    "name": "Odrik Sel",
    "city": "vaelgrim",
    "region": "honud",
    "role": "Kış haberi ve yol payı sorumlusu",
    "affiliation": "Vaelgrim yol ve haber haneleri",
    "traits": [
      "Haber halkası",
      "Ağır pay",
      "Borçlu ulak"
    ],
    "power": "powerful",
    "summary": "Vaelgrim’de kış haberinin hangi haneye ne zaman ulaştığını tutan Odrik, sistemi ayakta tutan yol payını küçük ailelere de aynı ağırlıkta yükler.",
    "related": [
      "honud",
      "haldrun-ylse"
    ],
    "sections": [
      {
        "title": "Geciken haber",
        "paragraphs": [
          "Odrik gençken bir ailenin dönüş haberini yanlış haneye verdi. Arayanlar boş yere kıyıda bekledi; sonunda yolcular sağlam döndü, fakat bekleyen yaşlı kişi soğukta hastalandı. Odrik hatasını yalnız kötü havaya bağlamadı. Hangi haberin kime ait olduğunu teslim alanın önünde tekrar ederek öğrendi."
        ]
      },
      {
        "title": "Düzeni satın almak",
        "paragraphs": [
          "Bugünkü haber halkası emek ve yakacak ister. Odrik bunu karşılamak için sabit bir yol payı koydu. Varlıklı hane kolay öderken küçük hane gecikmeye başladı; en çok habere ihtiyaç duyanlardan bazıları düzenin dışında kaldı. Odrik, yetişmiş ulakların bedelini bildiği için eleştiriye kızar; payı bölmeyi teklif eden gençlere henüz yeterince kulak vermemiştir."
        ]
      },
      {
        "title": "Vaelgrim’in ulakları",
        "paragraphs": [
          "Bir kralın habercibaşısı değildir; Vaelgrim’de haber paylaşımını kabul eden haneler arasında görev taşır. Haldrun Ylse’nin öğrencilerinden biri yanlış bir kaydı düzelttiğinde onu cezalandırmamış, fakat kendi pay usulünü aynı açıklıkla sorgulamakta zorlanmıştır. Kapısındaki tahta levhada hem teslimler hem gecikmeler durur."
        ]
      }
    ]
  },
  {
    "id": "asta-vel",
    "name": "Asta Vel",
    "city": "dravenspire",
    "region": "honud",
    "role": "Taş yapı onarımı ustası",
    "affiliation": "Dravenspire yapı bakım ustaları",
    "traits": [
      "Örtülmeyen çatlak",
      "Çırak hakkı",
      "Taş tozu"
    ],
    "power": "distinguished",
    "summary": "Haritadaki Honud Dravenspire’ında yapı onarımı yapan Asta, ustasının sakladığı bir çatlağı ortaya çıkardıktan sonra güvenli bakımın yerel yüzü oldu.",
    "related": [
      "honud"
    ],
    "sections": [
      {
        "title": "Üstü boyanan taş",
        "paragraphs": [
          "Asta taş yapımında çıraktı; ustası ona düzgün yüzeyi taklit etmeyi öğretti. Bir onarımda yeni sıvanın altındaki çatlağı gördü, önce söylemeye çekindi. Duvardan parça düştüğünde kimse ölmedi, ama komşu hanenin bütün kışlık yükü zarar gördü. Asta o gün güzel görünümle sağlam yapının aynı şey olmadığını öğrendi."
        ]
      },
      {
        "title": "Ustanın yanında itiraz",
        "paragraphs": [
          "Sonraki işte kusuru sahibinin önünde gösterdi. Ustası onu atölyeden çıkardı. Bir süre küçük tamirlerle geçindi, zarar gören aileler güvenilir inceleme isteyince çalışması büyüdü. Kendi yetiştirdiği çırağın işi durdurma hakkını ilk sözleşmesine yazdırması bu olayın devamıdır."
        ]
      },
      {
        "title": "Dravenspire’da onarım",
        "paragraphs": [
          "Asta yerel yapı bakımının tanınan ustasıdır, şehrin veya bütün Honud’un yöneticisi değildir. Bir duvarı onarırken taşın yanında içeride yaşayan hanenin işini de dinler; pahalı güvenlik tavsiyesi karşılanamıyorsa aşamalı bakım arar. Masasında tuttuğu ilk çatlak parça, haksız ustanın hatırasından çok kendi sustuğu günü hatırlatır."
        ]
      }
    ]
  },
  {
    "id": "rennya-hald",
    "name": "Rennya Hald",
    "city": "wolfcrag",
    "region": "honud",
    "role": "Avcı haneleri temsilcisi",
    "affiliation": "Wolfcrag avcı haneleri",
    "traits": [
      "Paylaşılmış av",
      "Kesik gurur",
      "Açık mutfak"
    ],
    "power": "distinguished",
    "summary": "Wolfcrag avcı hanelerini görüşmelerde temsil eden Rennya, tek bir büyük avın ününden çok ardı kesilmeyen kış payıyla itibar kazandı.",
    "related": [
      "honud",
      "sigrun-nel"
    ],
    "sections": [
      {
        "title": "Payı olmayan başarı",
        "paragraphs": [
          "Rennya gençken büyük avdan dönenlerin sofrasını kurardı. Avı bulanın adı yüksek sesle söylenir, iz süren ve yükü taşıyanların payı daha sessiz belirlenirdi. İlk kendi avında yiyeceği başkalarına ayırınca ailesi onun ününü ucuza verdiğini söyledi."
        ]
      },
      {
        "title": "Kış boyunca süren pay",
        "paragraphs": [
          "Zor bir mevsimde avcı hanelerin sakladığı küçük fazlaları toplayıp çocuklu ve hasta hanelere ulaştırdı. Bu iş bir kahramanlık gecesi değil, her gün yeni itiraz ve eksik yük demekti. Rennya, katkı verenin adını kaydetti ama herkesin önünde teşekkür borcuna dönüştürmedi. Birkaç zengin avcı bu yüzden ona sırt çevirdi."
        ]
      },
      {
        "title": "Wolfcrag’ın masası",
        "paragraphs": [
          "Bugün avcı hanelerin temsilcisidir; bütün bölgenin askerî lideri değildir. Sigrun Nel’den dönüş kararını dinlemeyi öğrenmiş, kendi çevresinde avın ardından payı da tartıştırmıştır. Çalışması onu herkesin sevdiği biri yapmaz. Kurduğu açık mutfak, temsil ettiği sözün her akşam gerçekten yenebilen karşılığıdır."
        ]
      }
    ]
  },
  {
    "id": "tovan-isk",
    "name": "Tovan Isk",
    "city": "boreals-end",
    "region": "honud",
    "role": "Kış bakım ocağı görevlisi",
    "affiliation": "Boreal’s End kış bakım ocağı",
    "traits": [
      "Genç görevli",
      "Temiz bez",
      "Yardım isteyen el"
    ],
    "power": "ordinary",
    "summary": "Boreal’s End’de küçük bakım ocağını sürdüren Tovan, hocası hastalandığında ilk kez kendisinin de yardım istemesi gerektiğini öğrendi.",
    "related": [
      "honud",
      "eira-dorr"
    ],
    "sections": [
      {
        "title": "Hocanın yatağı",
        "paragraphs": [
          "Tovan, yaraları saran yaşlı hocasının yanına odun taşımak için gelmişti. Önce bez temizledi, sonra pansuman öğrendi. Hocası ağır hastalandığında aynı işi tek başına yapacağını sandı; uykusuzluk yüzünden iki hanenin bakım saatini karıştırması onu korkuttu."
        ]
      },
      {
        "title": "Kapıya bırakılan iş",
        "paragraphs": [
          "Komşulardan yardım isteyince bakımın bütününü öğretmek yerine parçalara ayırdı: biri suyu ısıttı, biri bez taşıdı, biri yemek hazırladı. Tovan yaranın bakımını yürüttü. Hiç kimse tek başına mucize yaratmadı; ocak kapanmadı. Genç adam için ustalık, başkasının elini kendi eksikliğinin kanıtı saymamayı öğrenmekti."
        ]
      },
      {
        "title": "Boreal’s End’de kalmak",
        "paragraphs": [
          "Bir dinin başrahibi veya büyük büyü ustası değildir. Basit bakımın sürekliliğine güvenilen genç bir görevlidir. Eira Dorr’dan kuru otların kullanımı hakkında bilgi alır, bilmediği hastalıkta kesin sonuç vaat etmez. Gece nöbetinden sonra kapısındaki levhaya kimin daha fazla yardıma ihtiyaç duyduğunu yazar; artık kendi adını da gerektiğinde ekler."
        ]
      }
    ]
  },
  {
    "id": "ilsa-mord",
    "name": "Ilsa Mord",
    "city": "deadveil",
    "region": "honud",
    "role": "Harabe dışı kamp rehberi",
    "affiliation": "Deadveil harabe dışı ziyaret kampı",
    "traits": [
      "Sınır çizgisi",
      "Geri dönen ziyaretçi",
      "Sade değnek"
    ],
    "power": "distinguished",
    "summary": "Deadveil’in yıkık kale alanına gelenlere rehberlik eden Ilsa, yaşamış bir lordluğun hükümdarı değil, tehlikeli taşlara mesafe koyan kamp bakımcısıdır.",
    "related": [
      "honud",
      "vela-hir",
      "norran-dhel"
    ],
    "sections": [
      {
        "title": "İçeri giden çocuk",
        "paragraphs": [
          "Ilsa gençken büyük harabenin her kemerinin geçit olduğuna inanırdı. Arkadaşıyla girdiği bir bölümde dönüş yolunu bulamayınca sabaha kadar bekledi. Onları dışarı çıkaran yaşlı rehber, cesaretlerinin değil acelelerinin bedelini anlattı. Ilsa yıllar sonra aynı işaretleri yenilemeye başladı."
        ]
      },
      {
        "title": "Satılmayan izin",
        "paragraphs": [
          "Bir ziyaretçi güvenli diye işaretlenmemiş bölüme girmek için ona fazla ücret önerdi. Ilsa reddetti. Adam başkasını buldu; döndüğünde eli yaralıydı. Ilsa yardım etti, fakat başına geleni saklamak isteyince kabul etmedi. Başka ziyaretçinin aynı parayı ödemesi, aynı taşın sağlam olması anlamına gelmez."
        ]
      },
      {
        "title": "Deadveil’in dışındaki ocak",
        "paragraphs": [
          "Harabe dışında küçük ziyaret kampının bakımını yürütür. Sorumluluğu güvenli ocak, ziyaretçinin gelişi ve dönüşüyle sınırlıdır; yıkık kale taşları üzerinde eski lordların yetkisini üstlendiğini söylemez. Vela Hir’in kayıt ve Norran Dhel’in gözlem işlerine yardım eder. Rehberliği her kapıyı açabilmekte değil, hangi kapının şimdilik kapalı kalacağını doğru söyleyebilmesinde durur."
        ]
      }
    ]
  },
  {
    "id": "korrin-nehl",
    "name": "Korrin Nehl",
    "city": "silent-cairn",
    "region": "honud",
    "role": "Taş kayıt ve ziyaret bakımcısı",
    "affiliation": "Silent Cairn ziyaret ve taş bakım çevresi",
    "traits": [
      "Düzeltilen isim",
      "Baba hesabı",
      "Küçük işaret"
    ],
    "power": "ordinary",
    "summary": "Silent Cairn’de taş işaretlerin ve ziyaret kayıtlarının bakımını yapan Korrin, hatırlamak için süslü bir anıttan önce doğru bir isim gerektiğini savunur.",
    "related": [
      "honud",
      "hedda-vaun"
    ],
    "sections": [
      {
        "title": "Taştaki yanlış ad",
        "paragraphs": [
          "Korrin bir taş ustasının oğluydu. Babasının yaptığı işaretlerden birinde bir adın yanlış işlendiğini çocukken fark etti. Aile işi zarar görmesin diye yıllarca sessiz kaldı. Adı taşıyan haneden yaşlı biri geldiğinde kusuru göstermesi, babasıyla arasında ilk büyük kırgınlığı yarattı."
        ]
      },
      {
        "title": "Yenilenen küçük yüzey",
        "paragraphs": [
          "Korrin taşı bütünüyle değiştirmek yerine yanlışın bulunduğu bölümü yenileyip tarihini kaydetti. Eski hata silinmiş gibi davranmadı. İnsanlar onun işine kusursuz başlangıç beklemek için değil, yanlışın düzeltilmesinin saklanmaması için gelmeye başladı."
        ]
      },
      {
        "title": "Silent Cairn’e uğramak",
        "paragraphs": [
          "Ziyaret ve taş bakımında yerel bir temas kişisidir; kral ya da büyük bir askerî makam taşımaz. Hedda Vaun’un hane kayıtlarıyla işaretlerin adlarını karşılaştırır, tartışmalı geçmişe tek başına hüküm vermez. Birinin susmak istemesini saygıyla dinler; suskunluğunu başkalarının adını değiştirme izni saymaz."
        ]
      }
    ]
  },
  {
    "id": "maara-sov",
    "name": "Maara Sov",
    "city": "skeldrun",
    "region": "honud",
    "role": "Küçük üretici ortaklığı sözcüsü",
    "affiliation": "Skeldrun küçük üretici ortaklığı",
    "traits": [
      "Genç sözcü",
      "Ayrı ücret",
      "Onarılan deri"
    ],
    "power": "distinguished",
    "summary": "Skeldrun’daki küçük üreticiler adına konuşan Maara, hanelerin borçlarını birlikte alırken her işçinin ücretinin ayrı görünmesini sağladı.",
    "related": [
      "honud",
      "torv-rell"
    ],
    "sections": [
      {
        "title": "Bir deri parçasının payı",
        "paragraphs": [
          "Maara ailesinin küçük işliğinde deri onardı. Büyük siparişte para haneye gelir, işin en uzun kısmını yapan gençlerin payı sonra konuşulurdu. Kendi ücretini istediğinde nankörlükle suçlandı; aileye yardım etmenin kendi emeğini isimsiz bırakmak olmadığını anlatmak için başka küçük işlikleri dinlemeye başladı."
        ]
      },
      {
        "title": "Ortak borç, ayrı ücret",
        "paragraphs": [
          "Bir malzeme alışında işlikleri birleştirdi ve daha iyi fiyat aldı. Ardından her çalışan için ayrı ödeme kaydı istedi. Bu ikinci şart ortaklığa girmek isteyen bazı yaşlı ustaları uzaklaştırdı. Maara küçük kazancı büyütürken onu tek bir aile büyüğünün eline geri vermemeyi öğrendi."
        ]
      },
      {
        "title": "Skeldrun’un sözcüsü",
        "paragraphs": [
          "Bütün hanelerin yöneticisi değildir; katılan üreticilerin görüşmelerini taşır. Torv Rell’in yakacak paylaşımında hem işin devamını hem ısınmayı gündeme getirir. Yaşı genç olduğu için kararına sık itiraz edilir. Her toplantıya gösterişli bir unvan değil, kendi yaptığı onarımın açık ücretini götürür."
        ]
      }
    ]
  },
  {
    "id": "eldran-vek",
    "name": "Eldran Vek",
    "city": "hjorthal",
    "region": "honud",
    "role": "Yem ortaklığı paylaştırıcısı",
    "affiliation": "Hjorthal yem ve hayvan bakımı ortaklığı",
    "traits": [
      "Kuru yem",
      "Geç bırakılan sürü",
      "Aileye ölçü"
    ],
    "power": "distinguished",
    "summary": "Hjorthal’de hanelerin yem ve hayvan bakımını eşleştiren Eldran, büyük sürünün her zaman büyük güvence olmadığını bir kötü kışta gördü.",
    "related": [
      "honud"
    ],
    "sections": [
      {
        "title": "Fazla hayvanın kışı",
        "paragraphs": [
          "Eldran’ın ailesi hayvan sayısını bereket sayardı. Gençken sürüyü büyütmek için çalıştı; sert mevsimde yem yetmeyince daha az hayvanla başlayan komşuların daha sağlam çıktığını gördü. Kaybını yalnız ayaza yüklemek yerine depoladıkları yiyeceği saymayı öğrendi."
        ]
      },
      {
        "title": "Paylaştırılan ot",
        "paragraphs": [
          "Ortak kuru yem işinde her hanenin ihtiyacını kayda aldı. Kendi kuzeninin sürüsü için fazladan pay isterken diğer hanelerin stoğunun azaldığını fark etti ve isteğini geri çekti. Akrabası hâlâ onu yardımı esirgeyen biri sayar. Eldran, bir hayvanı tutma kararının yemini başka ailenin ödememesi gerektiğini savunur."
        ]
      },
      {
        "title": "Hjorthal’in bakımı",
        "paragraphs": [
          "Yerel yem ortaklığının sorumlusudur; bütün Honud sürülerinin sahibi ya da klan kralı değildir. Yavruların bakımını ve yaşlı hayvanların gereksinimini aynı hesaba ekler. Hanelere çoğu kez daha büyük kazanım yerine daha küçük ama sürdürülebilir iş önerir; bu tutum ona güven kadar sabırsız düşman da kazandırır."
        ]
      }
    ]
  },
  {
    "id": "silven-ner",
    "name": "Silven Ner",
    "city": "winterhavn",
    "region": "honud",
    "role": "Kıyı erzak teslimi hakemi",
    "affiliation": "Winterhavn kıyı erzak ortakları",
    "traits": [
      "Islak tartı",
      "Eksik yük",
      "Eşit kayıp"
    ],
    "power": "powerful",
    "summary": "Winterhavn’da kıyıdan gelen erzak teslimlerini dinleyen Silven, kaybı yalnız yükü taşıyana yazdırmayan kayıt usulüyle tanınır.",
    "related": [
      "honud",
      "eyrik-voss"
    ],
    "sections": [
      {
        "title": "Yıkanmış sayılar",
        "paragraphs": [
          "Silven gençken ıslanmış teslim kayıtlarını yeniden yazardı. Bir yükün eksik kısmı her defasında en düşük ücretli taşıyana borç oluyordu. Bir gün teslimden önceki kayıtta da aynı eksikliği görüp gösterdi; kıdemli kâtip onu başını derde sokmakla suçladı."
        ]
      },
      {
        "title": "Kimden eksildi?",
        "paragraphs": [
          "Yerel ortaklar kayıtları baştan sona karşılaştırması için onu çağırdı. Silven, ürünün sahibi, depolayanı ve taşıyanı için ayrı teslim anı tuttu. Kaybın tamamen yok olmadığını, yalnız görünür hâle geldiğini söyledi. Büyük ortaklar bu düzeni kabul etse de kendi depolarının hatasına para ödemeyi hâlâ sevmez."
        ]
      },
      {
        "title": "Winterhavn’ın hesabı",
        "paragraphs": [
          "Bir donanmanın başında değildir; kıyı erzak ortaklarında teslim hakemidir. Eyrik Voss’un ambar hesabıyla görüşürken uzak depodaki kazancın yolda çalışan hanenin zararını saklamamasını ister. Kapısına gelenin elindeki belge okunamayacak kadar ıslaksa önce bezi ve sıcak yeri verir, sonra ihtilafı dinler."
        ]
      }
    ]
  },
  {
    "id": "torv-rell",
    "name": "Torv Rell",
    "city": "ashfrost",
    "region": "honud",
    "role": "Yakacak payı ve ocak bakımcısı",
    "affiliation": "Ashfrost yakacak haneleri",
    "traits": [
      "Yakacak çizgisi",
      "Gece nöbeti",
      "Eksik pay"
    ],
    "power": "distinguished",
    "summary": "Ashfrost’ta ortak yakacak ve ocak bakımını tutan Torv, küçük üretim işinin ısınma payına karışıp haneleri soğukta bırakmasını engellemeye çalışır.",
    "related": [
      "honud",
      "maara-sov"
    ],
    "sections": [
      {
        "title": "Sönen son ocak",
        "paragraphs": [
          "Torv’un ailesi yakacak hazırlardı. Kışın iyi bir sipariş için depodaki payın çoğunu sattılar; ertesi hafta kendi ocakları sönünce kazancın bütün bedelini gördüler. Torv tekrar stok oluşturmak için geceleri başka hanelerin bakım işine gitti."
        ]
      },
      {
        "title": "İki ayrı çizgi",
        "paragraphs": [
          "Ortaklıkta çalışmaya başladığında evleri ısıtacak payla üretime ayrılan payı ayırdı. Büyük atölyeler soğuk mevsimde daha çok yakıt isteyince tartışma çıktı. Torv işin kesilmesinin de haneleri yoksullaştırdığını kabul etti, fakat sıcak evin bedelini yalnız küçük aileye bırakmayı reddetti."
        ]
      },
      {
        "title": "Ashfrost’ta bakım",
        "paragraphs": [
          "Bir askerî lord değil, yakacak paylaşımının ve ocak bakımının yerel sorumlusudur. Maara Sov’la konuşurken çalışan ücreti kadar evdeki ısınmayı da ele alır. Kül lekeli defterinde hangi payın niçin değiştiği yazılıdır; aynı sözü her haneye vermek yerine ihtiyacı açıkça tartıştırır."
        ]
      }
    ]
  },
  {
    "id": "vela-hir",
    "name": "Vela Hir",
    "city": "white-woe",
    "region": "honud",
    "role": "Yıkık tapınak kayıtçısı",
    "affiliation": "White Woe harabe kayıt çalışması",
    "traits": [
      "Eksik satır",
      "Yıkık tapınak",
      "Dikkatli kopya"
    ],
    "power": "distinguished",
    "summary": "White Woe’nun yıkık tapınak alanında görünen izleri kaydeden Vela, eksik bir yazıyı kendi beklentisiyle tamamlamaktan vazgeçerek güvenilirliğini kazandı.",
    "related": [
      "honud",
      "ilsa-mord",
      "norran-dhel"
    ],
    "sections": [
      {
        "title": "Tamamlanan yanlış söz",
        "paragraphs": [
          "Vela sözlü öğretide iyi bir dinleyiciydi; sonra eski taşların yazısını kopyalamaya ilgi duydu. İlk aşınmış kaydında duymak istediği cümleyi eksik satıra yerleştirdi. Kopyası yayıldı, bir yaşlı taşın kalan izini gösterince yanlışını fark etti."
        ]
      },
      {
        "title": "Boş bırakılan bölüm",
        "paragraphs": [
          "Kopyasını geri çağırıp nerede yorum yaptığını açıkça not etti. Birkaç kişi onu bilgisiz saydı; başkaları düzeltmesi sayesinde yeniden güvenmeye başladı. Bugün okunmayan yeri boş bırakır, farklı yorumu farklı satırda tutar. Bilginin azlığı, iddiasını daha büyük yapması için bir izin değildir."
        ]
      },
      {
        "title": "White Woe’ya uğrayanlar",
        "paragraphs": [
          "Harabe araştırma çevresinin temas kişisidir; yeniden kurulmuş büyük tapınağın başrahibesi veya yıkık alanın hükümdarı değildir. Ilsa’nın güvenlik uyarısını çalışmadan önce dinler. Eski metinlerden şaşmaz bir kehanet çıkarmak yerine, gerçekten görülen izin gelecek ziyaretçiye doğru aktarılmasını önemser."
        ]
      }
    ]
  },
  {
    "id": "norran-dhel",
    "name": "Norran Dhel",
    "city": "whisperhold",
    "region": "honud",
    "role": "Harabe ziyaretleri rehberi",
    "affiliation": "Whisperhold harabe ziyaret bakım çevresi",
    "traits": [
      "Eski rehber",
      "Duruşma gibi anlatmaz",
      "Gevşek taş"
    ],
    "power": "ordinary",
    "summary": "Whisperhold çevresinde ziyaretçilere eşlik eden Norran, harabeyi esrarıyla satmak yerine herkesin gördüğü ve bilmediği şeyi ayıran yaşlı bir rehberdir.",
    "related": [
      "honud",
      "vela-hir",
      "ilsa-mord"
    ],
    "sections": [
      {
        "title": "Kendi hikâyesine inanmak",
        "paragraphs": [
          "Norran genç rehberken ziyaretçileri etkilemek için yıkık duvarlara görmediği törenler yakıştırırdı. Bir çocuk anlattığı geçidi arayıp kaybolduğunda birkaç gün bütün aramaya yardım etti. Çocuk bulundu, Norran’ın güzel hikâyesi artık kendi kulağına farklı gelmeye başladı."
        ]
      },
      {
        "title": "Görülen ve duyulan",
        "paragraphs": [
          "Sonraki ziyaretlerde gördüğü taşı, kendisine anlatılan öyküyü ve kendi yorumunu ayrı söyledi. Daha az ücret alır oldu. Yine de yıllar geçtikçe düzenli dönen kişiler onun aynı açıklığı koruduğunu anladı. Bilmediğini söylemek, rehberliğinin eksikliğinden çok asıl işine dönüştü."
        ]
      },
      {
        "title": "Whisperhold’un kenarı",
        "paragraphs": [
          "Yıkık alanı yaşayan büyük bir şehir gibi yönetmez. Ziyaret bakımında, güvenli durma noktalarında ve rehberlikte rol alır. Vela’nın kayıtlarına kendi gözlemini taşır, onun yorumuna bütün geçmişin hükmü gibi yaslanmaz. Değneği süslü bir makam işareti değil, gevşek taşı yoklamak için aşınmış bir araçtır."
        ]
      }
    ]
  },
  {
    "id": "hedda-vaun",
    "name": "Hedda Vaun",
    "city": "frostgrave",
    "region": "honud",
    "role": "Hane ve defin kayıtçısı",
    "affiliation": "Frostgrave hane kayıt çevresi",
    "traits": [
      "İki aynı isim",
      "Açık düzeltme",
      "Yavaş soru"
    ],
    "power": "distinguished",
    "summary": "Frostgrave’da hane ve defin kayıtlarını tutan Hedda, aynı adı taşıyan iki kişinin kaydını ayırırken bir ailenin yıllarca taşıdığı yanlış hatırayı düzeltti.",
    "related": [
      "honud",
      "korrin-nehl"
    ],
    "sections": [
      {
        "title": "Bir isimde iki hayat",
        "paragraphs": [
          "Hedda annesinin yanında hane kayıtlarını dinlerdi. Bir aile kayıp yakını için geldiğinde aynı adın başka kişinin kaydında bulunduğunu fark etti. İlk anda eski kaydı doğru kabul etti; sonra yaşlar ve yolculuklar birbirini tutmayınca yeniden sordu."
        ]
      },
      {
        "title": "Düzeltilen hatıra",
        "paragraphs": [
          "İki kaydı ayırması bir aileyi sevindirdi, diğerini öfkelendirdi. İnsanların yıllarca kurduğu hatırayı değiştirmek basit bir kâtiplik işi değildi. Hedda yeni bilgiyi saklamadı; yanlışın nasıl doğduğunu ve hangi bölümün hâlâ belirsiz kaldığını birlikte yazdı."
        ]
      },
      {
        "title": "Frostgrave’ın defteri",
        "paragraphs": [
          "Yerel hanelerin kabul ettiği kayıtçıdır; bütün Honud tarihi adına konuşmaz. Korrin Nehl’le taş üstündeki isimleri karşılaştırır. Bilinmeyen ölümü kesin bir kahramanlık ya da suç diye adlandırmaz. Kapısına gelen kişinin aynı soruyu üçüncü kez sormasına da izin verir; herkesin yeni hatıraya aynı hızla alışmadığını bilir."
        ]
      }
    ]
  },
  {
    "id": "jorvik-sann",
    "name": "Jorvik Sann",
    "city": "yatesh",
    "region": "honud",
    "role": "Av paylaşımı eğitmeni",
    "affiliation": "Yatesh ortak av çevresi",
    "traits": [
      "Onarılan mızrak",
      "Genç öğretmen",
      "Pay sorusu"
    ],
    "power": "distinguished",
    "summary": "Yatesh’te av paylaşımı ve güvenli dönüşü çalıştıran Jorvik, güçlü avcının tek başına başarı sayılması alışkanlığına kendi gençliğinden karşı çıkar.",
    "related": [
      "honud",
      "rennya-hald"
    ],
    "sections": [
      {
        "title": "Kendi adını duymak",
        "paragraphs": [
          "Jorvik ilk avında arkadaşlarının bulduğu izi kullandı, eve avı tek başına getirdi. İnsanlar adını söylediğinde öbür gençleri düzeltmedi. Bir sonraki sefer yanında kimsenin gönüllü olmaması başarıyı kiminle kurduğunu anlamasını sağladı."
        ]
      },
      {
        "title": "Payı anlatan ders",
        "paragraphs": [
          "Yıllar sonra gençleri hazırlamaya başladığında dönüşte herkesin yaptığı işi tek tek söylemesini istedi. Bir görevden hiç av çıkmadığında da iyi gözlem ve güvenli dönüşü değersiz saymadı. Bu yaklaşım bazı hanelere boş sofra için fazla yumuşaktı; Jorvik erzak kaygısını küçümsememeyi öğrendi."
        ]
      },
      {
        "title": "Yatesh’in gençleri",
        "paragraphs": [
          "Bir klanın askerî hükümdarı değil, ortak avın eğitmenidir. Rennya Hald’la pay usulleri üzerine görüşür. Hâlâ eski mızrağını kullanır; sapını başka bir genç onarmıştır. Dersinde bu onarımı kendi ustalığı gibi göstermemesi, ilk avından sonra verdiği sözün küçük ama görünür devamıdır."
        ]
      }
    ]
  },
  {
    "id": "arna-kess",
    "name": "Arna Kess",
    "city": "bleakmoor",
    "region": "honud",
    "role": "Haneler arası erzak arabulucusu",
    "affiliation": "Bleakmoor hane erzak görüşmeleri",
    "traits": [
      "Boş kâse",
      "İki haklı taraf",
      "Sert sabır"
    ],
    "power": "powerful",
    "summary": "Bleakmoor’da haneler arasındaki erzak ihtilafını dinleyen Arna, kendi yardımının karşılığında itaat istememeyi öğrenmiş bir arabulucudur.",
    "related": [
      "honud",
      "eyrik-voss"
    ],
    "sections": [
      {
        "title": "Yardımın ardından gelen söz",
        "paragraphs": [
          "Arna gençken zor durumdaki bir komşuya sürekli yiyecek taşıdı. Bir görüşmede komşunun kendi önerisine karşı çıkması onu yaraladı; yaptığı yardımı herkesin önünde hatırlattı. Komşu, açken yemek kabul etmenin bütün düşüncesini ona emanet etmek olmadığını söyledi."
        ]
      },
      {
        "title": "Borç olmayan destek",
        "paragraphs": [
          "Arna o konuşmayı yıllarca taşıdı. Paylaştırma işine çağrıldığında yardımın hangi koşulla verildiğini başta sorar oldu. Gerçek borcu kayda yazdı, yardım adına saklanmış söz hakkını ise tartışmaya açtı. Bu ayrım güçlü hanelerin onu eski kadar kolay desteklememesine neden oldu."
        ]
      },
      {
        "title": "Bleakmoor’un görüşmesi",
        "paragraphs": [
          "Yerel erzak görüşmelerinde arabulucudur, bütün klanlar üzerinde yönetim kurmaz. Eyrik Voss’un kendi hanesine öncelik vermesini eleştirirken benzer eğilimini unutmaz. Masadaki boş kâseyi kimin dolduracağını sorar; onu dolduranın masadaki bütün konuşmayı da satın aldığını kabul etmez."
        ]
      }
    ]
  },
  {
    "id": "keldir-ol",
    "name": "Keldir Ol",
    "city": "isenreach",
    "region": "honud",
    "role": "Yük ve geçiş hazırlığı ustası",
    "affiliation": "Isenreach yük hazırlama ustaları",
    "traits": [
      "İyi bağ",
      "Yüksüz deneme",
      "Sert kontrol"
    ],
    "power": "distinguished",
    "summary": "Isenreach’te yüklerin ve yol hazırlığının sağlamlığını sınayan Keldir, geçiş hızını güvenli bağın yerine koyan tüccarlarla sık sık çatışır.",
    "related": [
      "honud",
      "odrik-sel"
    ],
    "sections": [
      {
        "title": "Çözülen ilk düğüm",
        "paragraphs": [
          "Keldir gençken yükleri hızlı bağladığı için övülürdü. Bir seferde ucuz ipin çözüleceğini fark etmedi; zarar başka hanenin payına yazıldı. Tazminatı kendi ücretinden tamamlamak yıllar sürdü. O dönemde yalnız elinin değil, kullandığı malzemenin de hesabını tutmayı öğrendi."
        ]
      },
      {
        "title": "Önce boş geçiş",
        "paragraphs": [
          "Bugün yeni düzeneği yüklemeden önce boş denemeyi, sonra kademeli yükü ister. Bu usul hızlı yola çıkmak isteyenleri kızdırır. Keldir bazen eski hatasının korkusuyla gereğinden fazla kontrol yapar; yanında yetişen gencin bunu söylemesini susturmadığında iş gerçekten iyileşir."
        ]
      },
      {
        "title": "Isenreach’te hazırlık",
        "paragraphs": [
          "Bir askerin veya kralın bütün yollarını yönetmez; yerel yük hazırlığının ustasıdır. Odrik Sel’in ulak yüklerini kontrol ederken mesajın acelesini anlar ama kötü bağın haberin kendisini de kaybettirebileceğini söyler. Tuttuğu tahta blok, ödül değil yıllarca ağırlık altında denenmiş sıradan bir alettir."
        ]
      }
    ]
  },
  {
    "id": "eira-dorr",
    "name": "Eira Dorr",
    "city": "eirhollow",
    "region": "honud",
    "role": "Kuru ot ve yara bakımcısı",
    "affiliation": "Eirhollow yara ve kuru ot bakım çevresi",
    "traits": [
      "Ölçülü karışım",
      "Temiz bez",
      "Gösterişsiz usta"
    ],
    "power": "distinguished",
    "summary": "Eirhollow’da yara bakımı ve saklanan otların kullanımını öğreten Eira, bitkinin gücü kadar yanlış kullanımının da anlatılması gerektiğini savunur.",
    "related": [
      "honud",
      "tovan-isk"
    ],
    "sections": [
      {
        "title": "İyi gelenin fazlası",
        "paragraphs": [
          "Eira küçükken ailesinin sakladığı otları ayırırdı. Bir bakımda işe yarayan karışımın daha fazlasını verdiğinde hastanın durumunun bozulduğunu gördü. Hocası onu bütün bilgiden dışlamak yerine miktarı, zamanı ve kişinin hâlini ayrı kaydetmesini istedi."
        ]
      },
      {
        "title": "Unutulmayan ölçü",
        "paragraphs": [
          "Eira yıllarca küçük bakım işlerinde çalıştı. Ünü büyük bir mucizeden değil, aynı hizmeti sürdürebilmesinden geldi. İyi niyetle gelen yeni bir karışımı hemen onaylamaz; nereden geldiğini ve hangi durumda kullanıldığını sorar. Bazıları bu sabrı yardım gecikmesi olarak görür."
        ]
      },
      {
        "title": "Eirhollow’da öğrenmek",
        "paragraphs": [
          "Büyük bir büyü loncasının hükümdarı değildir; yerel bakım bilgisinin tanınan ustasıdır. Tovan Isk’a hastayı dinlemek kadar kendi sınırını söylemeyi de öğretir. Kıştan önce kuru ot kadar temiz bez stoklar. Bir bitkinin hikâyesinin temiz su ve doğru bakımla birlikte anlatılmadığında yarım kaldığını düşünür."
        ]
      }
    ]
  },
  {
    "id": "rasken-venn",
    "name": "Rasken Venn",
    "city": "varnskuld",
    "region": "honud",
    "role": "Ortak yemin tanığı",
    "affiliation": "Varnskuld haneler arası yemin görüşmeleri",
    "traits": [
      "İki tanık",
      "Korunmayan dost",
      "Saklı şart"
    ],
    "power": "distinguished",
    "summary": "Varnskuld’da anlaşmalara tanıklık eden Rasken, yakın arkadaşını korumak için bir şartı eksik söylediği olayın ardından açık tekrar usulü kurdu.",
    "related": [
      "honud",
      "hedda-vaun"
    ],
    "sections": [
      {
        "title": "Dostun eksik sözü",
        "paragraphs": [
          "Rasken ilk tanıklığında arkadaşının teslim borcunun bütününü söylemedi. İki hane uzlaşmış göründü, fakat sonraki kış eksik şart yüzünden yeniden çatıştı. Arkadaşını koruduğunu sanırken onun sözüne de güveni kaybettirmişti."
        ]
      },
      {
        "title": "Yeniden söylenen yemin",
        "paragraphs": [
          "Yeni görüşmelerde her tarafın şartlarını karşı tarafa kendi sözcükleriyle tekrar ettirmeye başladı. Bu, anlaşmayı yavaşlatır; yanlış anlaşılmayı başta gösterir. Dostu bir kez daha ayrıcalık istediğinde Rasken reddetti. Arkadaşlıkları sürüyor, fakat kolaylık eski yerini bulmuyor."
        ]
      },
      {
        "title": "Varnskuld’un tanığı",
        "paragraphs": [
          "Yerel anlaşmanın tanığıdır, tanrı-kral veya bütün klanların yargıcı değildir. Hedda Vaun’un kayıtlarına başvurur ama tanıklığı tek başına bütün geçmişi kanıt saymaz. Taşıdığı iki tahta işaret, kararın iki tarafça duyulması gerektiğini hatırlatır; gücünü gösteren büyülü bir arma değildir."
        ]
      }
    ]
  },
  {
    "id": "talla-skern",
    "name": "Talla Skern",
    "city": "nivor",
    "region": "honud",
    "role": "Yol haberi ve dönüş sorumlusu",
    "affiliation": "Nivor yol haberi ve dönüş çevresi",
    "traits": [
      "Dönüş levhası",
      "İlk bekleme",
      "Genç sorumlu"
    ],
    "power": "distinguished",
    "summary": "Nivor’da yola çıkan hanelerin haber ve dönüşlerini eşleştiren Talla, kaybolmakla gecikmenin aynı şey olmadığını anlatırken bekleyenlerin korkusunu küçümsemez.",
    "related": [
      "honud",
      "odrik-sel",
      "keldir-ol"
    ],
    "sections": [
      {
        "title": "Geri gelmeyen gün",
        "paragraphs": [
          "Talla’nın ailesi bir yolcuyu erken kayıp sayıp aramaya çıktı. Yolcu başka bir hanede dinleniyordu; arayanların gereksiz soğukta geçirdiği günlerden sonra Talla haberin yalnız yolda değil, bekleyen kapıda da işe yaradığını gördü. Gençken ilk işi gidiş ve beklenen dönüşü ayrı yazmak oldu."
        ]
      },
      {
        "title": "Gecikmeyi açıklamak",
        "paragraphs": [
          "Bir kafile dönmeyince kayıtları gösterip beklemeyi önerdi. Kafile ertesi gün geldi; fakat Talla’nın soğukkanlı sözleri korkmuş aileyi incitmişti. Sonra durum bilgisini vermekle insanın kaygısını dinlemenin ayrı işler olduğunu öğrendi. Şimdi belirsizliği saklamadan birlikte hangi durumda aramaya çıkılacağını konuşur."
        ]
      },
      {
        "title": "Nivor’un levhası",
        "paragraphs": [
          "Bütün Honud’un ulaklarını yöneten biri değildir; yerel dönüş çevresinin sorumlusudur. Odrik’in haberini ve Keldir’in hazırlık bilgisini kendi kaydına ekler. Levhasında kesin olmayan tarih kesin gibi yazılmaz. Sesi gençtir; insanların ona duyduğu güven, cevap veremediği soruyu başkasına taşımaktan kaçınmamasına dayanır."
        ]
      }
    ]
  }
]
const mappedPortraitBriefs: Record<string, string> = {
  "nesima-raal": "54-year-old Xotar female water-route convener, dark bronze skin, broad lined face, thick short silver-black curls, amber-brown eyes, simple indigo linen coat and cream scarf, plain copper cup hanging at belt, firm listening expression, ochre painted wall and soft cool blue shadow, warm side light.",
  "odrik-sel": "60-year-old Honud male winter-message coordinator, pale ruddy skin, long narrow forehead, one thick eyebrow interrupted by scar, rough gray mustache and short gray hair, heavy dark blue felt coat with worn red wool cuff, carved wood route tokens on cord, skeptical weathered gaze, slate background and restrained amber lamp light.",
  "asta-vel": "46-year-old Honud female masonry repair forewoman, pale olive skin, square sturdy face with strong cheekbones, ash-brown hair in short braid, dark hazel eyes, gray wool beneath rust-brown working leather overcoat, stone dust on fingers and simple wooden straightedge, direct attentive expression, cold gray stacked stone background with gentle ochre light.",
  "rennya-hald": "39-year-old Honud female hunting-household representative, weathered fair freckled skin, long auburn hair roughly bound at neck, strong straight nose and gray-green eyes, muted blue wool and patched charcoal fur shoulder cape, ordinary narrow knife sheath and small wrapped food packet, stern concerned expression, deep pine-gray painterly background with warm copper highlights.",
  "tovan-isk": "28-year-old Honud male winter sickroom attendant, medium tan complexion, gentle round face with slight asymmetrical smile, short curly dark hair and sparse chin beard, plain cream wool collar under muted moss-blue robe, holding clean folded cloth and simple ceramic bowl, attentive slightly tired eyes, ochre lamp glow against loose blue-gray shadow.",
  "ilsa-mord": "67-year-old Honud female guide to a ruined fortress, weathered pale face with deep horizontal forehead lines, white-gray hair tightly tied under plain slate wool cap, strong bent nose, alert light eyes, dark brown patched thick cloak, short rope coil and worn wooden route staff, calm wary stance, broken gray stone arch loosely painted in cold violet shadows with soft warm face light. No crown or grand noble attire.",
  "korrin-nehl": "43-year-old Honud male cairn visitor caretaker, pale copper complexion, closely shaven head and dense short brown beard, broad quiet face and narrow dark eyes, undyed gray wool tunic under muted green thick mantle, stone dust and small plain chisel in one hand, reflective grounded pose, simple piled stones painted loosely in blue-gray and warm ochre.",
  "maara-sov": "24-year-old Honud female small-workshop convener, fair freckled complexion, unruly shoulder-length dark red hair tied with plain brown cord, round youthful cheeks and clear hazel eyes, practical ochre wool coat with blue patched sleeve, leather offcut and needle roll, bright guarded direct expression, softly painted dark indigo workshop background with warm lamp highlight.",
  "eldran-vek": "51-year-old Honud male communal feed distributor, stocky body and warm light-brown weathered skin, thick salt-gray beard, close short black-gray hair, broad nose and deeply set brown eyes, rough moss-brown wool coat and plain cream scarf, tied dry grass bundle in hand, deliberate patient expression, dark slate and muted honey-ochre loose-painted stable wall.",
  "silven-ner": "58-year-old Honud female coastal provisions arbitrator, medium bronze lined skin, wavy gray hair to chin beneath faded blue hood, wide calm face with slightly crooked smile, thick sea-green wool and charcoal leather gloves, plain wooden weighing token and folded inventory strip, cool teal harbor strokes behind her and warm soft amber face lighting.",
  "torv-rell": "40-year-old Honud male communal-fuel keeper, ruddy fair skin soot-marked cheek, wiry strong shoulders, shaved sides with short dark hair on top, thick black brows and tired steel-gray eyes, rust-red felt coat beneath blackened plain leather apron, firewood tally sticks held low, serious restrained look, charcoal-painted room with one warm ochre light plane, no huge flames.",
  "vela-hir": "36-year-old Honud female ruin-record scholar, pale olive skin, long slender face and a bent nose, straight black hair in low braid, intent dark eyes, plain ivory wool scarf over muted lavender-gray expedition coat, small closed travel notebook and gloves, thoughtful cautious pose, loose cream-blue ice-covered broken stone background, small warm edge light. No archpriest crown, no ruling claim.",
  "norran-dhel": "69-year-old Honud male ruin visitor guide, deeply weathered tawny pale complexion, bald crown with wispy long gray side hair, thin gray beard, long expressive nose and watchful gray eyes, dark olive and ash-blue layered wool cloak, plain walking pole and rolled rope at shoulder, bent but steady body, soft violet-gray broken stone and muted amber face light. Humble caretaker rather than king.",
  "hedda-vaun": "50-year-old Honud female household and burial recorder, light reddish complexion, wide face with soft heavy eyelids, short silver-threaded brown curls, dark eyes, thick plain cream scarf over worn blue-black dress, ink-stained fingers holding a narrow wood-bound records book, patient melancholy expression, muted warm gray interior and deep cool blue painterly shadow.",
  "jorvik-sann": "31-year-old Honud male communal-hunt trainer, light tan skin with wind-red nose, lean long face and brown eyes, shaggy dark blond hair, a short incomplete beard, practical moss-green wool under tan leather shoulder wrap, plain rope and a small repaired spear at side, alert earnest expression, loose blue slate outdoors with warm ochre dawn rim light.",
  "arna-kess": "44-year-old Honud female household food-dispute mediator, dark olive freckled skin, rounded strong face, black curls under cream wool band, direct amber-brown eyes, burgundy wool coat patched in muted blue, plain iron clasp and one small empty bowl, skeptical kind expression, painted deep charcoal-violet background with softly blended ochre light.",
  "keldir-ol": "55-year-old Honud male load-and-route preparation master, pale deeply lined skin, heavy angular face and broad chin, short thick white-gray hair with one dark streak, clean-shaven face and blue-gray eyes, thick dull indigo quilted coat, simple rope harness and worn wooden block held beside chest, rigorous focused look, muted dark slate background and warm amber side light.",
  "eira-dorr": "62-year-old Honud female practical herbal wound caretaker, medium brown skin, slender long face with high cheekbones, silver-gray hair in loose bun, dark calm eyes, plain ochre and soft moss-green wool layers, dry herb bundle and clean cloth held together, small warm sympathetic smile, brown-gray painterly interior with subdued honey light and cool blue shadows.",
  "rasken-venn": "37-year-old Honud male agreement witness, fair copper freckled complexion, long square face, dark auburn hair cut at ears and neatly short beard, wary green eyes, modest ash-blue wool coat with dark brown collar, two plain differently carved wood oath tokens held on cord, formal thoughtful stance, soft slate-violet paint background with a warm cream face highlight.",
  "talla-skern": "29-year-old Honud female route-message dispatcher, pale weathered skin with rosy nose, short uneven ash-blond hair, wide blue-gray eyes and angular jaw, deep navy thick wool cape over cream linen collar, several small carved wood route boards bound at belt, attentive energetic pose and half-open mouth as if asking a question, loose cool gray background with restrained warm ochre lighting."
}

export const newWorldCharacters: Character[] = [...establishedWorldCharacters, ...mappedWorldDrafts.map(person)]
export const portraitBriefs: Record<string, string> = { ...establishedPortraitBriefs, ...mappedPortraitBriefs }
