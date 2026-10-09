import type { Character } from './characters'

type Draft = Pick<Character, 'id' | 'name' | 'role' | 'city' | 'affiliation' | 'power' | 'summary' | 'related' | 'traits'> & { story: [string, string, string, string] }
// Authorized original biographies, in the public pre-coup world. Offices below
// supplement existing rulers; they do not replace the author's institutions.
const drafts: Draft[] = [
  {
    id: 'savren-urn', name: 'Savren Urn', role: 'Marhalden Akçelik Nöbeti komutanı', city: 'marhalden', affiliation: 'Marhalden Akçelik Nöbeti', power: 'powerful',
    traits: ['Geçit disiplini', 'Eski dağ rehberi', 'Ağır kararlar'], related: ['edran-korr', 'elva-korrin', 'nesra-dolm', 'marhalden-akcelik'],
    summary: 'Akçelik Nöbeti’nin komutanı Savren, sağlam bir duvarın önünde bekleyen insanların da birer hayat taşıdığını unutmamaya çalışır.',
    story: [
      'Savren, Tolvur’dan erzak getiren katırcıların yanında büyüdü. Gençken fırtına yaklaşırken geçide girmeyi kabul etti; yük zamanında ulaştı, fakat bir katır ve onu geri almaya çalışan ağabeyi dönmedi. Kazancından kalan parayı yıllarca harcamadı. Askerliğe geçtiğinde hava işaretlerini emirden önce dinlemesi bu kaybın devamıydı.',
      'Marhalden nöbetlerinde küçük birlikleri geri çekmekten çekinmediği için önce korkak sayıldı. Bir kopmuş köprüyü tutmak yerine karşı kıyıya güvenli çekilmesi, daha sonra nehir kaleleri hizmetinin başına yükselmesini sağladı. Lord Edran Korr ona komuta verdiğinde Savren kendi vardiyasını da denetime açtı.',
      'Elva Korrin kale değişimlerini yönetir; Nesra Dolm zırhın hangi parçasının yeniden işlenmesi gerektiğini onunla tartışır. Savren çatlamış bir bağlantıyı ustaya gizleyip kusuru askerin hatası saymaz. Komuta gücünü, loncaların sivil yetkisini ortadan kaldıracak bir ayrıcalık gibi kullanmasına karşı çıkanlar da vardır.',
      'Mülteci girişinin kapatılması onu rahatlatmamıştır. Emri uygular, kapıdaki nöbetin zorbalığa dönüşmesini engellemeye çalışır; bu çaba kapının dışında bekleyenleri içeri almaz. Kürkünün içinde ağabeyinin eski yük ipinden bir düğüm taşır. Onu en çok kızdıran söz, bir kaybın yalnız gereken bedel diye geçiştirilmesidir.',
    ],
  },
  {
    id: 'elva-korrin', name: 'Elva Korrin', role: 'Marhalden nehir kaleleri yüzbaşısı', city: 'marhalden', affiliation: 'Marhalden Akçelik Nöbeti', power: 'distinguished',
    traits: ['Kale değişimi', 'Halat köprü ustalığı', 'Sert mizah'], related: ['savren-urn', 'vessa-thol', 'tervik-hann'],
    summary: 'Elva, nehrin iki kıyısındaki kale nöbetlerini aynı saatte değiştirmeden şehri açıkta bırakmamayı öğrenmiştir.',
    story: [
      'Elva’nın annesi Marhalden’de yük ipi örerdi. Çocukluğu nehrin iki yakasındaki teslim noktaları arasında geçti; bir ucun hazır olmaması yüzünden ötekinin nasıl boşuna yorulduğunu küçük yaşta gördü. Askere girdiğinde iyi kılıç kullanması kadar işi devretme titizliğiyle dikkat çekti.',
      'Bir kış değişiminde karşı kalenin çanı duyulmadığında vardiyasını geri göndermedi. İki saat sonra haberci yıkılan merdivenin haberini getirdi. O günden sonra çanı tek işaret saymak yerine haberci ve nöbet kaydını birlikte kullandı; bu düzen onu nehir kaleleri yüzbaşılığına taşıdı.',
      'Savren’le geçit emniyetinde anlaşır, onun sert sessizliğine karşı askerlerin açıkça soru sormasını ister. Baş lonca makamındaki Vessa Thol ile sivil teslim saatlerini belirler. Tervik Hann’ın işçileri gece vardiyasından çıkınca askerî yükün önüne geçebileceği durumlar konusunda sık sık tartışırlar.',
      'Güldüğünde önce kendisinin yaptığı küçük hatayı anlatır. Kapalı kapıda bekleyenlere yardımın kurallara bağlanmasını savunur, fakat kuralların kendiliğinden adalet olmadığını bilir. Kemerindeki eski örgülü ip bir süs değil, köprü bakımında hâlâ kullandığı ölçüdür.',
    ],
  },
  {
    id: 'tervik-hann', name: 'Tervik Hann', role: 'Marhalden kazı kolu temsilcisi', city: 'marhalden', affiliation: 'Marhalden Üç Mühür düzeni', power: 'distinguished',
    traits: ['Kazı kolu', 'Ocak hafızası', 'İnat'], related: ['vessa-thol', 'nesra-dolm', 'karven-oll', 'orvik-drel'],
    summary: 'Kazı kolunun temsilcisi Tervik, iyi bir damar haberini önce güvenli çıkışın nerede olduğuyla birlikte verir.',
    story: [
      'Tervik ilk ücretini bir ocaktan değil, ocak girişindeki suyu boşaltmaktan kazandı. Babası iyi taşın görünür yerde olmasını şans sayardı; Tervik taşın altındaki boşluğun ne sakladığını merak etti. Çökme yüzünden kapanan eski bir galeride günlerce çıkarma işine katılması bu merakı sorumluluğa çevirdi.',
      'Kazı ustalığı yükseldikçe üretimi durdurduğu günlerin hesabını vermek zorunda kaldı. Bir destek direğini değiştirmek için kaybedilen vardiyayı kendi payından karşılaması işçilerin güvenini kazandırdı. Küçük lord ve ocak sahiplerinin masasında kazı kolunu temsil ederken aynı güveni bütünüyle servete dönüştürmemeye çalışır.',
      'Nesra Dolm çıkarılan taşın işlenebilirliğini, Karven Oll satılabilecek partiyi sorar. Üç Mühür’ün başındaki Vessa Thol bu hesapların birbirini denetlemesini ister. Dorvenhall’dan Orvik Drel’le hava ve vardiya ölçümlerini paylaşır; her dağın aynı usulle kazılamayacağını özellikle hatırlatır.',
      'Eski pirinç lambasının yamuk sapını düzeltmez. Gençken bir düşme anında o sap elinde kalmış, kendisini duvara çarparak kurtarmasına yardım etmiştir. Tervik konuşkan ve pazarlıkta yorucudur; bir damarın değeri için büyük sözler verirken çıkışın güvenliği konusunda aynı cömertliği göstermez.',
    ],
  },
  {
    id: 'nesra-dolm', name: 'Nesra Dolm', role: 'Marhalden işleme kolu temsilcisi', city: 'marhalden', affiliation: 'Marhalden Üç Mühür düzeni', power: 'distinguished',
    traits: ['Dövme ve sınama', 'Sessiz öfke', 'Ustalık borcu'], related: ['tervik-hann', 'karven-oll', 'savren-urn', 'veyralt'],
    summary: 'Nesra, Veyralt’ın ününü her sınamada yeniden kazanması gereken bir malzeme olarak görür.',
    story: [
      'Nesra’nın yetiştiği atölyede kışın ocak başında uyunurdu. Çırakken gösterişli bir bıçak dövdü; bıçak ilk yük sınamasında kırılınca ustasının övgüsü yerine müşterinin boş eline baktı. Kırık parçayı geri alıp yenisini kendi ücretinden yapması yıllar süren bir çalışma alışkanlığının başlangıcı oldu.',
      'Isı ve soğutma kayıtlarıyla tanındığında bazı ustalar onu eski hüneri kâğıda bağlamakla suçladı. Nesra bütün ustalığı deftere sığdıramayacağını kabul etti; buna rağmen kaydın aynı hatayı ikinci kez yapmamak için tutulmasını savundu. İşleme kolundaki aristokratlar onu kendi sözcüleri seçtiğinde bu tartışma sona ermedi.',
      'Tervik’in cevherini önce küçük örneklerle sınar, Karven’in acele teslim sözlerini yavaşlatır. Akçelik Nöbeti için Savren Urn’la aşınmış parçaları inceler. Nadir Veyralt’ı her zırhın bütün gövdesine dağıtmak yerine gereken yerde kullanır; kıtlık ustalığı da pazarlığı da keskinleştirir.',
      'Ücretini alamamış bir çırağın adını sipariş tahtasından silmez. Sertliği kimi müşteriyi kaçırır, fakat kendi başarısını kusursuzluk efsanesi hâline getiren övgüden hoşlanmaz. İlk kırık bıçağın küçük parçası hâlâ örnek kutusunda durur.',
    ],
  },
  {
    id: 'karven-oll', name: 'Karven Oll', role: 'Marhalden satış kolu temsilcisi', city: 'marhalden', affiliation: 'Marhalden Üç Mühür düzeni', power: 'distinguished',
    traits: ['Cevher sözleşmeleri', 'İkna', 'Pay hesabı'], related: ['tervik-hann', 'nesra-dolm', 'edran-korr', 'vessa-thol'],
    summary: 'Karven’in ikna gücü, henüz çıkarılmamış bir damarın parasını bugünden konuşabilmesinden gelir.',
    story: [
      'Karven, Uldar’dan Marhalden’e erzak taşıyan bir ailenin oğludur. Bir kış geciken ödemenin bütün arabaları yolda bırakmasına tanık oldu. Kâtiplik öğrenerek girdiği ticarethanelerde, sözün hangi satıra yazıldığını kılıcın nerede taşındığından daha erken fark ederdi.',
      'Bir alıcının peşin avansıyla iki küçük ocağın kışı çıkarmasına yardım etmesi satış kolunda adını yükseltti. Aynı sözleşmede alıcının uzun yıllar düşük bedelle mal alma hakkı bulunuyordu. Ocağı kurtaran anlaşmanın ustaları yeni bir bağımlılığa sokması, Karven’in övünürken anlatmadığı kamuya açık itirazdır.',
      'Tervik onun aceleciliğini, Nesra teslim vaatlerini denetler. Edran Korr’un lordluğu ve Vessa Thol’un baş lonca makamı karşısında satış kolunun ayrı ağırlığını savunur; sekiz yıllık lordlukla dört yıllık baş lonca seçimini birbiri yerine kullanmaz.',
      'İnsanların adını ve çayını nasıl içtiğini iyi hatırlar. İyiliği çoğu zaman bir ödeme takvimine bağlıdır; zarar verdiğinde açık şiddet yerine sabırlı bir sözleşme kullanır. Cevher ticaretini oynatırken Karven’le anlaşmak, onun bütün hesabını kabul etmek demek değildir.',
    ],
  },
  {
    id: 'caldris-evern', name: 'Caldris Evern', role: 'Elorwyn Adak Muhafızları paladin komutanı', city: 'elorwyn', affiliation: 'Elorwyn Adak Muhafızları', power: 'powerful',
    traits: ['Paladin disiplini', 'Sert yemin', 'Hane hizmeti'], related: ['tharion', 'rahela-dorn', 'veyren-sahl', 'elorwyn-adak-muhafizlari'],
    summary: 'Caldris, bağlılığını bir insana verilmiş sınırsız izin olarak görmek istemeyen, sert bir paladin komutanıdır.',
    story: [
      'Caldris’in babası Elorwyn surlarının bakımında çalışırdı. Çocukken askerlerin parlayan göğüslüklerini görür, babasının isli ellerini görmezden gelirdi. İlk paladin taliminde çöken bir platformun altında kalınca onu çıkaran yine duvar ustaları oldu. Hayatının geri kalanında bakım işini savaşın gerisinde saymamaya uğraştı.',
      'Yeminli refakat hizmetinde bir soylunun öfkesine rağmen teslim alınan yaralıyı sorguya hazır saymayı reddetti. Bunun bedeli yükselişinin gecikmesiydi. Tharion Elorwynder’in hizmetinde komutanlığa ulaştığında kendi adaylarını da böyle kararlar üzerinden sınamaya başladı.',
      'Rahela Dorn’la yaralıların tahliyesinde, Veyren Sahl’la sefer bakımında çalışır. Rahibelerin önceliğiyle askerî sıranın çeliştiği anlarda hemen anlaşamazlar. Bir emrin sert olması onu iyi saymaya yetmez; Caldris’in bu sözü her olayda aynı cesaretle uyguladığı da söylenemez.',
      'Zırhının tokasında annesinin diktiği eski bir yemin kordonu taşır. Adaylardan kusursuz görünmeyi değil hatayı sahiplenmeyi ister. Paladinliği ruhsat hukukunun üstünde değildir; yasak bir uygulamayı tapınak görevi diye yeniden adlandırmasına izin vermez.',
    ],
  },
  {
    id: 'rahela-dorn', name: 'Rahela Dorn', role: 'Elorwyn Siper Rahibeleri başı', city: 'elorwyn', affiliation: 'Elorwyn Siper Rahibeleri', power: 'powerful',
    traits: ['Kalkan hattı', 'Yaralı tahliyesi', 'Açık itiraz'], related: ['caldris-evern', 'veyren-sahl', 'orena-vel'],
    summary: 'Rahela, savunmayı yalnız bir hattı tutmakla değil o hattın gerisinden kimlerin canlı döndüğüyle ölçer.',
    story: [
      'Rahela bir tahıl ambarının yanında büyüdü. Gençken yangında iki çocuğu dışarı çıkaran teyzesinin ardından koştu; üçüncü kez içeri girmelerine kırılan kiriş engel oldu. Sonraki yıllarda yardımın cesaret kadar düzen gerektirdiğini öğrenmek için tapınak bakımına katıldı.',
      'Kalkan talimini yaralı taşıma eğitimiyle birlikte kurması Siper Rahibeleri içinde etkisini büyüttü. İlk yönetiminde herkesin aynı anda aynı kapıya yönelmesi yüzünden bir sedye devrildi. Olayı örtmek yerine kendi talimatını değiştirdi; baş rahibeliği kabul ederken eğitimin açık eleştiriden muaf tutulmamasını istedi.',
      'Caldris’le askerî öncelik, Veyren’le bakım kapasitesi, Orena’yla ruhsat sınırı üzerine çalışır. İbadet görevi ile savaşçı eğitiminin aynı emek olmadığını savunur. Kalkanını taşıyan bir rahibenin her acıyı mucizeyle gidermesi beklenince önce gerçek imkânı anlatır.',
      'Sofrada en son konuşur, karar verildiğinde ilk itiraz eden olabilir. Topluluğuna bağlıdır; yanlış bulduğu bir emri yalnız bağlılık gerekçesiyle temiz saymaz. Bu tavır onu sevilen bir koruyucu kadar yorucu bir müzakereci yapar.',
    ],
  },
  {
    id: 'veyren-sahl', name: 'Rahip Veyren Sahl', role: 'Elorwyn sefer rahibi', city: 'elorwyn', affiliation: 'Elorwyn sefer rahipleri', power: 'distinguished',
    traits: ['Sefer bakımı', 'Sabır', 'Yaşlı öğretmen'], related: ['rahela-dorn', 'caldris-evern', 'volomiyr'],
    summary: 'Veyren, uzun hizmetinde bir yaralının hangi yemini taşıdığından önce neresi ağrıdığını sormayı öğrenmiştir.',
    story: [
      'Veyren ilk gençliğinde Elorwyn’in konuşmayı seven bir tapınak öğrencisiydi. Bir sınır refakatinde duasının uzunluğu yüzünden yaralı taşıma işini geciktirdiğini fark etti. Eski hocasının onu azarlamak yerine sedyenin öbür ucuna göndermesi, sözlerinin ne zaman susması gerektiğini öğretti.',
      'Yıllarca sefer bakımı ve aday eğitiminde çalıştı. İnsanların inancı sarsıldığında tek bir cevap vermeyi bıraktı; bazen dinlemek, bazen yemek dağıtmak, bazen aileye mektup yazmak gerektiğini gördü. Yaşı ilerlediğinde bile bakım sandığının en ağır bağını kendi taşımakta ısrar eder.',
      'Rahela’nın tahliye düzenini destekler, Caldris’in katı talimine dinlenme araları ekletir. Elorwynli paladinlerle ortak ibadetlerde bulunur; Volomiyr gibi kentten ayrılmış kişileri aynı göreve zorlamak yerine hizmet ettikleri yeri sorar.',
      'Boncuklarının biri diğerlerinden koyudur; ilk görevinde kaybettiği hastanın ailesi vermiştir. Şifa için ruhsat sınırına uyar, bakımını büyünün yerine geçmeyen işler üzerinden de sürdürür. Sakinliğinin altında her yeni kaybı hâlâ şahsen taşıyan bir yorgunluk vardır.',
    ],
  },
  {
    id: 'orena-vel', name: 'Orena Vel', role: 'Elorwyn ruhsat ve ayin denetçisi', city: 'elorwyn', affiliation: 'Elorwyn lordluk hizmetleri', power: 'distinguished',
    traits: ['Ruhsat denetimi', 'Kesin söz', 'Hukukî ısrar'], related: ['tharion', 'buyu-ruhsatlari', 'rahela-dorn', 'seldric-nove'],
    summary: 'Orena, Elorwyn’in sert yerel denetimini krallığın ruhsatlı büyü hukukuyla birlikte yürütür.',
    story: [
      'Orena’nın annesi dokumacı, amcası tapınak yazmanıydı. Bir mahalle şifacısının izni belirsiz olduğu için işinin kapatılması ve kış boyunca bakımın aksaması çocukluğunda iz bıraktı. İzin belgesinin yalnız ceza için değil hizmetin güvenle sürmesi için de açık olması gerektiğini o olaydan çıkardı.',
      'Kâtiplikten denetime yükselirken ruhsatın kapsamını herkesin aynı kelimelerle okuyabilmesini istedi. Bir soylu ayininin belgelerini eksik bulup geri çevirmesi makamını tehlikeye soktu. Seldric Nove itirazı resmî kayda taşıyınca karar tek bir öfkenin içinde kaybolmadı.',
      'Tharion’un şehir hizmetindedir; bağlılığı, kurban ritüelini veya izinsiz uygulamayı meşrulaştırmaz. Rahela’yla seferde hangi büyülü bakımın kimin iznine bağlı olduğunu belirler. Krallıkta ruhsatlı büyünün serbest olduğu kuralını Elorwyn’in yerel sıkılığıyla silmez.',
      'Bir ziyaretçiye önce belgesini, sonra neye ihtiyacı olduğunu sorar. Bazen bu sıralama yüzünden yardım gecikir ve eleştiriyi hak eder. Açık kural sevgisi insanın hikâyesini dinlemeyi zorlaştırsa da verdiği kararı kimin denetleyebileceğini saklamaz.',
    ],
  },
  {
    id: 'seldric-nove', name: 'Seldric Nove', role: 'Elorwyn lordluk başkâtibi', city: 'elorwyn', affiliation: 'Elorwynder hane hizmetleri', power: 'distinguished',
    traits: ['Eski fermanlar', 'Ölçülü hırs', 'Hanedan hafızası'], related: ['tharion', 'orena-vel', 'damian'],
    summary: 'Seldric, eski hanedan geleneğini bugünkü kararın önüne koyabilen, zarif ve zor bir başkâtiptir.',
    story: [
      'Seldric küçük bir yazman ailesinden gelir. Babasının hazırladığı bir kopyadaki eksik tarih yüzünden iki hane aynı araziyi istemiş, yıllarca süren çekişme aileyi yoksullaştırmıştı. Genç Seldric harf güzelliğinden önce belgenin nereden geldiğini öğrenmeye karar verdi.',
      'Eski hane kayıtlarını karşılaştırarak Elorwynder hizmetinde yükseldi. Bir lord vekilinin işine yarayan eksik kopyayı kabul etmemesi ona güven kazandırdı; aynı titizliği, zayıf bir hanenin sözlü iddiasını dışlamak için kullandığı zamanlar da oldu. Yazının gücü her defasında adaletin gücü olmadı.',
      'Tharion’un başkâtibi olarak Orena’nın denetim kayıtlarını tutar, Damian’ın kıyı hanesiyle belge alışverişini yürütür. Eski geleneği bugünkü ihtiyaca karşı kalkan gibi kullanabilir. Bir kararı değiştirmek isteyen kişinin önce hangi eski metnin neden hâlâ uygulandığını açıklamasını ister.',
      'Gülümsediğinde eldivenlerini yavaşça çıkarır; masasına oturanlar bu hareketten sonra daha dikkatli konuşur. Elinde büyü veya kılıç yoktur, fakat bir başvurunun hangi gün görüleceğini bilmek ona büyük nüfuz verir.',
    ],
  },
  {
    id: 'tavera-oss', name: 'Tavera Oss', role: 'Kethra liman devriyesi kaptanı', city: 'kethra', affiliation: 'Kethra Kıyı Hizmetleri', power: 'distinguished',
    traits: ['İskele nöbeti', 'Sert pazarlık', 'Deniz kökeni'], related: ['damian', 'ceryn-hale', 'branis-dov'],
    summary: 'Tavera, bir donanma kaptanının ününü rıhtımın bütün kuralları üzerinde yetki saymaz.',
    story: [
      'Tavera Kethra’da ağ tamircilerinin yanında büyüdü. Gençken bir yük gemisinde çalışırken fırtınaya rağmen çıkış isteyen kaptana itiraz etti; ücretini alamadan kıyıya dönmek zorunda kaldı. O gece hasar alan geminin dönüşünü görmesi, güvenliği yalnız denizdeki cesaretle ölçmemesine neden oldu.',
      'Liman nöbetine girdikten sonra yük teslimiyle gemi komutası arasındaki sınırı açık tutmasıyla tanındı. Bir soylunun sandığını bekletmesi üzerine soruşturuldu; eksik teslim belgesi ortaya çıkınca kaptanlığa yükseldi. Bu başarı onu her şüphede haklı sayan birine de dönüştürebilir.',
      'Damian’ın kıyı hizmetindedir. Mor Donanma’dan Ceryn Hale ile teslim noktalarını, Branis Dov’la bekleyen erzağı konuşur. Kendi devriyelerini hızlı emirlerle yönetir; Melra’nın bakım için istediği geçişlerde aynı aceleyi her zaman göstermediği için eleştirilir.',
      'Kırık burnunu eski bir güverte kavgasından taşır. Birine güvenmesi uzun sürer, güvendiği nöbetçiyi açıkça savunur. Mızrağını kalabalık içinde yere yakın tutar; konuşmayı gereksiz saydığı anlar meslektaşlarının ona en çok itiraz ettiği anlardır.',
    ],
  },
  {
    id: 'branis-dov', name: 'Branis Dov', role: 'Kethra hane ve erzak vekili', city: 'kethra', affiliation: 'Kethra Kıyı Hizmetleri', power: 'distinguished',
    traits: ['İaşe hesabı', 'Güler yüz', 'Uzun borçlar'], related: ['damian', 'aveline', 'tavera-oss', 'melra-shen'],
    summary: 'Branis’in sıcak sofrası ve dikkatli borç defteri Kethra’da aynı şöhretin iki yüzüdür.',
    story: [
      'Branis, küçük bir tahıl dükkânında çıraklık yaptı. Ustası bir kötü mevsimde müşterilere borç verdi, sonra yeni ürün gelmeden öldü. Branis dükkânı kapatmak yerine borçların bir bölümünü yeniden takvimlendirdi; bazı haneler toparlandı, bazıları yıllarca ona bağlı kaldı.',
      'Liman iaşesinde çalışırken bir gecikmenin yalnız yüksek hane sofrasını değil yükçü ücretini de değiştirdiğini gösterdi. Aveline’nin hane görüşmelerinde bu hesabı anlatması onu Damian’ın erzak vekilliğine taşıdı. Yükselişinde yararlı hizmet kadar doğru insanla doğru sofraya oturması da etkili oldu.',
      'Tavera bekleyen malın emniyetini, Melra bakım evlerinin payını ister. Branis iki isteği aynı gün karşılayamadığında yakın olduğu haneye öncelik verebilir. Kötülüğü açık bir tehditten çok, bir hanenin borcunu ne kadar bekleteceğine karar verirken ortaya çıkar.',
      'Küçük ahşap sayma çerçevesini yemekte bile yanında tutar. Konuğunu doyurmaktan zevk alır, ama cömertliğinin karşılığında sadakat bekleyebilir. Onunla konuşan biri sıcak karşılamanın hangi hesaba yazıldığını da öğrenmelidir.',
    ],
  },
  {
    id: 'melra-shen', name: 'Melra Shen', role: 'Kethra kıyı şifacısı ve öğretmeni', city: 'kethra', affiliation: 'Kethra Kıyı Hizmetleri', power: 'ordinary',
    traits: ['Ruhsatlı bakım', 'Öğretmenlik', 'İnatçı merhamet'], related: ['branis-dov', 'tavera-oss', 'zylara'],
    summary: 'Melra, bir çocuğun adını öğrendiğinde ailesinin hangi haneye bağlı olduğunu sormak için acele etmez.',
    story: [
      'Melra bir fener işçisinin kızıdır. Babasının yarası iyileşirken ücretinin kesildiği günlerde bakımın yalnız ilaçtan ibaret olmadığını gördü. Okuma öğrendiğinde önce komşuların ücret ve teslim belgelerini anlamasına yardım etti; şifa eğitimini bu küçük işin yanında sürdürdü.',
      'Ruhsatını alması uzun sürdü; liman işini bırakacak parası yoktu. Eğitimi tamamlandığında tek başına büyük bir şifahane açmak yerine küçük bakım derslerini kıyı hanelerine taşıdı. Bu tercih daha az ün, daha çok kapı ziyareti getirdi.',
      'Branis’ten erzak, Tavera’dan yaralı geçişi ister. Lirendil’de Zylara’yla basit bakım malzemesi ve çırak eğitimini paylaşır. Büyülü hizmetini izin kapsamıyla sınırlar; ateş ölçmek, yarayı temizlemek ve aileye doğru kullanım öğretmek de işinin büyük bölümüdür.',
      'Gençlere önce düzgün düğüm atmayı öğretir. Haksızlık karşısında sesi yükselir, yüksek unvan önünde rahat konuşamaz; yine de bir sonraki gün aynı kapıya geri gelir. Onun gücü savaşta değil, bakımın kesilmesine razı olmamasındadır.',
    ],
  },
  {
    id: 'ivren-vask', name: 'Ivren Vask', role: 'Frostbay gümrük ve posta kâtibi', city: 'frostbay', affiliation: 'Frostbay Dairetaş idaresi', power: 'ordinary',
    traits: ['Posta kayıtları', 'Gümrük tartısı', 'Kıt kâğıt'], related: ['nera-veld', 'hessa-rund', 'odran-vehl'],
    summary: 'Ivren’in tuttuğu küçük posta defteri Frostbay’de devletin hâlâ ulaşabildiği az sayıdaki masadan biridir.',
    story: [
      'Ivren’in ailesi Frostbay’e sonradan yerleşti. Babasının gönderdiği mektuplar düzensiz ulaştığı için çocukluğu her teknenin getirdiği paketleri saymakla geçti. Bir mektubun kaybolması bazen yalnız haber değil, beklenen para ve dönüş niyetinin de kaybolmasıydı.',
      'Eski taş yapıda posta yardımcılığına başladığında kullanılmış kâğıdın temiz kenarlarına yeni kayıtlar yazardı. Nera Veld onu gümrük tartısına da verdi; iki işi aynı masada yürütmek beklemeyi azaltıyor, hatayı da kolaylaştırıyordu. Ivren bir kez yanlış haneye teslim ettiği paketin bedelini aylarca ödedi.',
      'Hessa Rund’a erzak mektuplarını, Odran Vehl’e garnizon teslimlerini ayırır. Nera’nın yetkisi kadar kendi elindeki kâğıt ve insan da sınırlıdır. Bir damganın bulunması bütün Hardlane’de aynı belgenin korunacağı anlamına gelmez.',
      'Paketlerin ipini kesmeden çözmeye uğraşır; bağ bir sonraki teslimde yine işe yarar. Küçük ücretler istemesi kimi zaman yolsuzluk sanılır, kimi zaman gerçekten adaletsiz bir gecikmeye dönüşür. Defterine yazamadığı vaatleri vermemeye çalışır.',
    ],
  },
  {
    id: 'hessa-rund', name: 'Hessa Rund', role: 'Frostbay aşevleri sözcüsü', city: 'frostbay', affiliation: 'Frostbay kıyı haneleri', power: 'ordinary',
    traits: ['Ortak kazanlar', 'Mülteci bakımı', 'Sert cömertlik'], related: ['nera-veld', 'ivren-vask', 'garron-veldrith'],
    summary: 'Hessa, Frostbay’e yeni gelenlerin ilk gecesini sıcak bir tasla geçirmesine uğraşır; her geleni doyuracak kaynağı yoktur.',
    story: [
      'Hessa’nın ilk ortak kazanı bir iş değil, fırtınada eve dönemeyen üç komşuya verdiği akşam yemeğiydi. Honud’dan gelenler arttığında evindeki yer yetmedi; terk edilmiş bir taş avluda pişirmeye başladı. Ona yardım edenlerin bir bölümü kendisi de yeni gelmiş insanlardı.',
      'Kazanlar büyüdükçe bağışın hangi sofraya gideceği tartışma oldu. Hessa bazı eski komşularını gücendirmek pahasına çocuk ve yaralıya önce pay ayırdı. Bir tüccarın yalnız kendi adamlarını doyurma şartını kabul etmeyince birkaç hafta daha az yemek çıkarabildi.',
      'Ivren mektuplarını, Nera küçük tahsislerini izler. Başkentte Garron Veldrith’e ulaşabilen dilekçeler gönderir; cevabın gelmesi erzağın geleceğini garanti etmez. Marhalden’in kapalı kapısı yüzünden Frostbay’de bekleyiş uzadıkça yardımın sınırları daha acı görünür.',
      'Sıcak tası verirken uzun minnet konuşmalarını dinlemek istemez. Öfkesini yardım isteyenlere de gösterebildiği için pişmandır. Bir şövalye veya zengin hayırsever değildir; ortak kazanların ertesi gün yeniden yanabilmesi için komşuları ikna eden bir kent sakinidir.',
    ],
  },
  {
    id: 'orna-kehl', name: 'Orna Kehl', role: 'Dranthol fener ve kıyı bataryası başı', city: 'dranthol', affiliation: 'Dranthol garnizonu', power: 'distinguished',
    traits: ['Fener bakımı', 'Kıyı savunması', 'Keskin sabır'], related: ['garran-veyl', 'mera-sorn', 'dranthol'],
    summary: 'Orna, Dranthol’ün yeni fenerini ve kıyı savunmasını aynı gece vardiyasının iki ayrı sorumluluğu olarak tutar.',
    story: [
      'Orna kıyıda ip ve yelken onararak büyüdü. Reformlarla Dranthol’e yeni işçiler geldiğinde ilk ücretli işi fener inşaatında yük taşımaktı. Yüksek merdivenlerde korkusunu yenmesi kahramanlık için değil eve düzenli ekmek götürebilmek içindi.',
      'Lamba ve işaret bakımında ustalaşınca kıyı savunma hizmetine geçti. Sisli bir gecede hedef belirsizken ateş emrini bekletmesi soruşturmaya yol açtı; yaklaşanın yanlış rotaya düşmüş yük teknesi olduğu anlaşılınca Ser Garran Veyl onu görev başında tuttu.',
      'Garran güvenliği, Orna ışığın ve bataryanın sürekliliğini savunur. Ternhaven’den gelen malzemeleri Mera Sorn’un görevlileriyle teslim alır. Donanma gemisinin güverte komutası onun işi değildir; görev alanı Dranthol kıyısı ve feneridir.',
      'Yeni bir nöbetçiye önce lambanın nasıl söndürüleceğini öğretir. Güvenli Dranthol’ün zayıf ticaretini görür; limanın tenhalığına razı olup bütün yabancıları tehlike saymaz. Yine de şüphelendiğinde iyi niyeti kadar sertliğiyle de tanınır.',
    ],
  },
  {
    id: 'dovek-raal', name: 'Dovek Raal', role: 'Vyssgard iskele halkası sözcüsü', city: 'vyssgard', affiliation: 'Vyssgard iskele halkası', power: 'distinguished',
    traits: ['Zorla düzen', 'İskele borçları', 'Soğuk nezaket'], related: ['vyssgard', 'vyssgard-kanunlari', 'teren-moll'],
    summary: 'Dovek’in koruma sözü Vyssgard’de nefes aldırabilir; aynı söz bir insanı iskeleye borçlu da bırakır.',
    story: [
      'Dovek Vyssgard’e yük taşıyan bir teknenin tayfası olarak geldi. Parasını alamayınca gemiden indi ve yıllarca küçük teslim işlerinde çalıştı. Bir iskele kavgasında iki çetenin mallarını ayırıp ertesi gün pazarı yeniden açması ilk etkisini kazandırdı.',
      'Zamanla tarafların anlaşamadığı teslimlerde hakemlik yaptı. Kayıt tuttuğu için güvenilir sayıldı; kayda kimin itiraz edebileceğini de kendi adamları belirliyordu. Güvenlik bedelleri yalnız hizmet ücreti olmaktan çıkınca Dovek buna düzenin zorunlu masrafı demeye başladı.',
      'Beş İskele’nin zorla korunan dengesinde pazarlık yürütür, rakip iskelelerin borçlarını gözler. Kraliyet görevlisi değildir. Kaldmere’den yardım isteyen bir hane için yük ayarlayabilir, sonra bu yardımı kendi iskele işlerine adam sağlamak için kullanabilir.',
      'Sesini yükseltmeden konuşur ve söz verdiği küçük işleri çoğunlukla bitirir. Bu tutarlılık onu iyi biri yapmaz; bir borcu insanın özgürlüğünden daha değerli gördüğü anlarda gerçek yüzü anlaşılır. Vyssgard’in kendi kanunlarına uyarken bu kanunların çıkarını da korur.',
    ],
  },
  {
    id: 'selvi-arn', name: 'Selvi Arn', role: 'Ternhaven sıcak su ve ocak ustası', city: 'ternhaven', affiliation: 'Ternhaven ocak meclisi', power: 'ordinary',
    traits: ['Sıcak su kanalları', 'Bakım ustalığı', 'Uzun bekleyiş'], related: ['mera-sorn', 'ternhaven', 'cevher-cizgisi'],
    summary: 'Selvi, Rydorn sıcak sularının evlere ulaşmasının kendiliğinden gerçekleşmediğini herkesten iyi bilir.',
    story: [
      'Selvi’nin dedesi Ternhaven’in taş su kanallarını onarırdı. Çocukken sıcak suya elini sokmaya heves ettiğinde dedesi onu aynı kanaldaki soğuk çatlağa götürdü. Sıcak bir kaynak, bakımı yapılmayan evin kendiliğinden sıcak olacağı anlamına gelmiyordu.',
      'İskân reformlarıyla yeni haneler kurulunca küçük ustalığı sürekli bir hizmete dönüştü. Fazla evin aynı kanala bağlanmasına itiraz ettiği için bir yatırımcının öfkesini çekti. Kışın suyun kesilmesini önleyen düzeni işe yaradığında ücret değil daha çok bakım işi kazandı.',
      'Mera Sorn’la ocak paylarını ve onarım sırasını belirler. Cevher Çizgisi projesi için ayrılan çalışmalardan yerel bakım işi beklemişti; yol hiç yapılmayınca elde kalan bazı aletleri meclis izniyle kanallarda kullanmaya devam etti.',
      'Kırmızı bağla tuttuğu kısa anahtar takımını komşularına ödünç verir, geri gelmeyen parçalar için uzun süre söylenir. Göçmenlerin varlığına bütünüyle karşı değildir; aynı suyu daha çok haneye pay ederken eski komşusunu önceleme eğilimini yenmekte zorlanır.',
    ],
  },
  {
    id: 'teren-moll', name: 'Teren Moll', role: 'Kaldmere barınak halkası sözcüsü', city: 'kaldmere', affiliation: 'Kaldmere barınak haneleri', power: 'ordinary',
    traits: ['Baraka tamiri', 'Ortak odun', 'Göçmen hafızası'], related: ['kaldmere', 'hessa-rund', 'ivren-vask'],
    summary: 'Teren, Kaldmere’de bir barakanın çatısını kapatabilen insanların birlikte konuşmasını sağlayan bir sözcüdür.',
    story: [
      'Teren Kaldmere’ye gelirken yanında bir testere, bir battaniye ve annesinin bakır tası vardı. İlk barakasının çatısı iki kış dayanmadı. Yeniden kurarken tek başına sağlam duvar yapmanın komşunun boş ocağını düzeltmediğini gördü; odun paylaşımına bu ihtiyaçla katıldı.',
      'Haneler çoğaldıkça ortak kesim ve tamir günlerini duyurmaya başladı. Her anlaşmazlığı çözmedi; bir aileye fazladan odun ayırması kendi akrabalarını kayırdığı iddiasını doğurdu. Sözcülüğü lordluk veya resmî belediye görevi değildir, güvenin geri çekilebildiği bir komşuluk işidir.',
      'Frostbay’de Hessa’ya erzak, Ivren’e haber gönderir. Az sayıdaki tüccarla pazarlık yaparken teknenin getirdiği malın bir bölümüyle taşıma ücretini karşılamak zorunda kalır. Kaldmere’nin kraliyet otoritesinden ve altyapıdan yoksun oluşunu bir toplantı halkası ortadan kaldırmaz.',
      'Annesinin tasını misafire verir; ardından ertesi gün hangi işi yapabileceğini sorar. Bazıları bu soruyu kabalık sayar, Teren ortak yükü konuşmanın yolu olarak görür. Son Umut’un bir mucizeye değil her sabah yeniden kaldırılan karlara dayandığını bilir.',
    ],
  },
  {
    id: 'savra-nell', name: 'Savra Nell', role: 'Brannis kayıt ve piyasa vekili', city: 'brannis', affiliation: 'Brannis lordluk hizmetleri', power: 'distinguished',
    traits: ['Pazar kayıtları', 'Keskin hesap', 'Eski borçlar'], related: ['varlen-neth', 'uldrin-fael', 'brannis'],
    summary: 'Savra, Brannis’te pazarın sakin görünmesiyle bütün borçların adil olması arasında fark bulunduğunu bilir.',
    story: [
      'Savra’nın ailesi Brannis’te tahıl satardı. Çocukken ıslak bir çuvalın kuru diye tartılması yüzünden haftalık kazançlarını kaybettiler. Babasının hesabı hatırladığını ama yazılı kanıtının olmadığını görünce tartı işaretlerini öğrenmeye başladı.',
      'Pazar kâtipliğinde aynı terazinin farklı müşteriye farklı tartmaması için çift kayıt tuttu. Küçük satıcılar onu destekledi, bazı büyük tüccarlar işinin gereksiz yavaşlığından şikâyet etti. Lord Varlen Neth’in hizmetinde vekilliğe geldiğinde açık kayıt kadar kimin şikâyetini ne zaman dinleyeceğinin gücünü de kazandı.',
      'Uldrin Fael’le pazar nöbetlerini belirler. Varlen’in gelir hesabına bütünüyle karşı değildir; iyi ürünün şehirde kalması ile fazla yükün dışarı satılması arasında çıkar görür. Bazı eski borçların kapatılmasını savunurken kendi ailesinin hesabında aynı kolaylığı beklediği olur.',
      'Küçük bir tahta ağırlığı avucunda çevirerek düşünür. Pazarın tartışmalarını sever, kararı ertelemeyi de iyi bilir. Onunla anlaşmanın zor yanı açık bir düşmanlık değil, aynı satırın ertesi gün başka bir sırada okunmasıdır.',
    ],
  },
  {
    id: 'uldrin-fael', name: 'Uldrin Fael', role: 'Brannis ruhsatlı pazar muhafızı', city: 'brannis', affiliation: 'Brannis pazar nöbeti', power: 'ordinary',
    traits: ['Pazar nöbeti', 'Dar yetki', 'Aile yükü'], related: ['savra-nell', 'varlen-neth'],
    summary: 'Uldrin, Brannis pazarında bir tartışmayı büyütmeden bitirmesi beklenen, gücü sınırlı bir muhafızdır.',
    story: [
      'Uldrin atölyelerde yük taşıyarak çalışmaya başladı. Bir kavga sırasında kardeşinin tezgâhı devrilince suçlu aramadan önce malları kurtarmaya uğraştı. Nöbet başı bu sakinliği fark ederek ona pazar devriyesinde iş verdi.',
      'Ruhsatlı nöbet yetkisi belirli pazar alanı ve teslim işlerine bağlıdır; büyü ruhsatı veya ülke çapında tutuklama hakkı değildir. İlk aylarında bir nüfuzlu satıcının sözünü doğrulamadan kabul etmesi haksız bir gecikmeye neden oldu. O günden sonra iki tarafı ayrı dinler.',
      'Savra Nell ona hangi tartının ve hangi tezgâhın denetleneceğini iletir. Lordluk emrini yerine getirir, fakat düşük ücretli bir nöbetçinin geçimini sürdüren pazardan bütünüyle bağımsız olması zordur. Ailesinin borcu onu küçük hediyelere karşı savunmasız bırakabilir.',
      'Kalkanı eskidir ve kayışı kendi dikimidir. Cesaretini büyük bir savaş için değil kalabalıkta tek bir kişiyi ezdirmemek için kullanır. Her başvuranı kurtaracak gücü yoktur; yardım istemesi de onun oynatılabilir hikâyesinin parçasıdır.',
    ],
  },
  {
    id: 'nalven-rieth', name: 'Nalven Rieth', role: 'Luthen köprü ve yol yüzbaşısı', city: 'luthen', affiliation: 'Luthen yol nöbeti', power: 'distinguished',
    traits: ['Köprü nöbeti', 'Refakat düzeni', 'Eski marangoz'], related: ['buyu-ruhsatlari', 'myrran-luthen-yolu', 'elric-marn'],
    summary: 'Nalven, Luthen’e gelen yolun yükünü taşıyan tahtayı da onu koruyan askeri de ayrı ayrı denetler.',
    story: [
      'Nalven gençliğinde köprü marangozlarına çıraklık yaptı. Sağlam görünen bir tahtanın içten çürüdüğünü ağır araba geçerken öğrenmesi, yaralanan arkadaşını yıllarca suçlulukla hatırlamasına neden oldu. Askerliğe geçtiğinde kendi güvenliğinden çok geçişi kullanan son arabayı düşünürdü.',
      'Luthen nöbetlerinde taşıma sırasını yükün ağırlığına göre değiştirmesi tüccarlarla kavga getirdi. Bir bayram kalabalığında geçişi erken kapatması büyük tepki çekti; hasarlı taşıyıcı bulunduğunda nöbet yüzbaşılığı ona verildi. Doğru çıkmış olması sonraki her kararını doğru yapmadı.',
      'Theramis’ten büyülü onarım hizmeti geldiğinde ustanın ruhsat alanını ve işin sürekliliğini sorar. Myrran’dan Elric Marn’la yol borcu ve zarar başvurularını görüşür. Myrran–Luthen bağlantısındaki görevini bütün kraliyet yollarının komutası gibi sunmaz.',
      'Taşıdığı ölçü ipinin düğümleri nöbetçilerine fazla uzun konuşmalar yapmasına yol açar. Ustalığından gurur duyar, acele etmek zorunda kalan sıradan yolcuyu bazen küçümser. Birinin onu bu yüzden durdurup hesap sormasını mesleğinin gerekli ama sevimsiz yanı sayar.',
    ],
  },
  {
    id: 'elric-marn', name: 'Elric Marn', role: 'Myrran mahkeme ve sivil arabulucusu', city: 'myrran', affiliation: 'Myrran sivil görüşme masası', power: 'distinguished',
    traits: ['Zarar uzlaşmaları', 'Sessiz nüfuz', 'İskele ailesi'], related: ['nalven-rieth', 'maera-dell', 'myrran'],
    summary: 'Elric, Myrran’da bir sözün neyi kapattığını kadar kime yeni bir borç açtığını da dinler.',
    story: [
      'Elric’in ailesi Myrran’da küçük bir kayık işletirdi. Babasının bozuk bir halat yüzünden uğradığı zararı tanıklar farklı anlatınca aile uzun bir ödeme kavgasına girdi. Çocukluğu masaya oturan herkesin doğru konuştuğuna inanmamayı, fakat hepsini dinlemeyi öğrenmekle geçti.',
      'Yazman olarak başladığı sivil görüşmelerde yüksek sesli tarafı kararın sahibi saymamaya çalıştı. Bir zengin yük sahibinin lehine hazırlanan uzlaşmayı eksik tanık nedeniyle geri çevirmesi itibarını artırdı. Aynı itibar, daha sonra kendi adının masada tehdit gibi kullanılmasına da yaradı.',
      'Nalven Rieth’le yol ve köprü zararlarını, Maera Dell’le kıyı dışında kaybolan yüklerin izini görüşür. Yetkisi bir kralın yargıçlığı değildir; yerel başvurularda görüşme ve uzlaşma yürütür. Tarafların reddettiği bir anlaşmayı yalnız kendi sözüyle zorla kabul ettiremez.',
      'Bir konuşma uzadığında masadaki bardağın yerini değiştirir ve iki tarafa da yeniden su koyar. Bu küçük alışkanlık öfkeyi kesebilir, gerçeği ortaya çıkarmaz. İyi bir uzlaşmanın güçsüz tarafı sessiz bırakan kolay bir kapanışa dönüşmesini kendi mesleğinin en büyük tehlikesi sayar.',
    ],
  },
]

export const completedDanstsudCharacters: Character[] = drafts.map(({ story, ...draft }) => ({
  ...draft, portrait: draft.id, region: 'danstsud', source: 'new', background: story[0], presence: story[3],
  sections: [{ title: 'Hayatını değiştiren seçim', paragraphs: story.slice(0, 2) }, { title: 'Bugünkü bağlar ve sorumluluk', paragraphs: story.slice(2) }],
}))
