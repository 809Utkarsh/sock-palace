// Every collection page is driven by this list (URL /collections/<handle>).
export const COLLECTIONS = {
  all: { title: 'Shop All', query: '' },
  crew: { title: 'Crew Socks', query: '?category=crew' },
  ankle: { title: 'Ankle Socks', query: '?category=ankle' },
  'knee-high': { title: 'Knee-High', query: '?category=knee-high' },
  packs: { title: 'Packs & Gifts', query: '?category=packs' },
  'new-drops': { title: 'New Drops', query: '?tag=new-drop' },
  bestsellers: { title: 'Bestsellers', query: '?tag=bestseller' },
  'limited-edition': { title: 'Limited Edition', query: '?tag=limited-edition' },
};

export const NAV = [
  {
    label: 'Collections',
    to: '/collections/all',
    links: [
      ['New Drops', '/collections/new-drops'],
      ['Bestsellers', '/collections/bestsellers'],
      ['Limited Edition', '/collections/limited-edition'],
    ],
  },
  {
    label: 'Socks',
    to: '/collections/all',
    links: [
      ['Crew', '/collections/crew'],
      ['Ankle', '/collections/ankle'],
      ['Knee-High', '/collections/knee-high'],
    ],
  },
  {
    label: 'Gifts',
    to: '/collections/packs',
    links: [['Packs & Gift Boxes', '/collections/packs']],
  },
];

export const TAG_LABELS = {
  'new-drop': 'New Drop',
  bestseller: 'Bestseller',
  'limited-edition': 'Limited Edition',
};
