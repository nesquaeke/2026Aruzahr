import type { LoreArticle } from '../data'

export const fieldWildlife: LoreArticle[] = [
  {
    id: 'galeri-kiskaci',
    name: 'Galeri Kıskacı',
    kind: 'fauna',
    region: 'danstsud',
    mapLocation: 'marhalden',
    subtitle: 'Sıcak su galerilerinin taş renkli kabuklusu',
    summary:
      'Karlan’ın ılık, nemli yarıklarında yaşayan iri bir kabuklu. Soluk kireç kabuğu, suyun mineral bıraktığı taşlar arasında onu saklar; madenlere yiyecek artıkları ve sıcaklık için yaklaşır.',
    sections: [
      {
        title: 'Taşın içindeki yaşam',
        paragraphs: [
          'Erişkinin gövdesi yaklaşık bir metre uzunluğundadır. Altı kısa yürüme bacağı onu kaygan kayada tutar; öndeki iki kıskaç besini parçalar ve dar yuva ağzını savunur. Üst kabuğu sert olsa da karın altı yumuşaktır. Açıkta uzun süre kalmak yerine yarıklara geri çekilir.',
          'Küçük gözleri az ışıkta hareketi seçer. Asıl yönünü ağız çevresindeki duyargalarla ve suyun taşıdığı titreşimlerle bulur. Düzenli kazma sesi onu saklandığı yere iter; tabana dökülen sıcak et suyu ise işçiler gittikten sonra geri çağırır.',
        ],
      },
      {
        title: 'Ocaklarla ilişkisi',
        paragraphs: [
          'Başlıca besini yosun, suyla taşınan hayvan artıkları ve küçük galeri canlılarıdır. İnsan avlamak için dolaşmaz. Yiyeceğin yanında sıkıştırıldığında bir bacağa veya sallanan yüke kıskaç atabilir; arkasında bir yarık bırakmak çoğu zaman çatışmayı önler.',
          'Eski ocak çalışanları yemek artıklarını su giderine dökmez. Kullanılmayan geçitlerin önünde mineral kabuğun kesildiği dar çizgiler ve sürüklenmiş çuval ipleri ararlar. Hayvanın görülmesi bir lanetin işareti sayılmaz; sıcak ve besin sızıntısı aranır.',
        ],
      },
    ],
    sources: [
      '26 Ekim 2026 · Marhalden ekolojisi için yeni yazım; koşullu görev olayları içermez',
    ],
    related: ['marhalden', 'karlan-daglari'],
  },
]
