// Sample catalog. Images live in frontend/public/products/<slug>-1.svg and -2.svg.
// To use real photos later: drop them in that folder and change the paths in setup-db.js.
export default [
  {
    slug: 'midnight-crew',
    name: 'Midnight Crew Socks',
    description: 'Jet-black combed cotton crew socks with a ribbed cuff. Goes with everything, every day.',
    price: 299, category: 'crew', tag: 'bestseller',
  },
  {
    slug: 'varsity-stripe-crew',
    name: 'Varsity Stripe Crew',
    description: 'Classic white athletic sock with double stripes on the cuff. Cushioned sole for all-day comfort.',
    price: 349, category: 'crew', tag: 'bestseller',
  },
  {
    slug: 'sunset-ankle',
    name: 'Sunset Ankle Socks',
    description: 'Low-cut ankle socks striped in warm sunset tones. Breathable knit, made for sneakers.',
    price: 249, category: 'ankle', tag: 'new-drop',
  },
  {
    slug: 'polka-party-crew',
    name: 'Polka Party Crew',
    description: 'Playful polka dots on a deep navy base. Soft, stretchy and impossible to ignore.',
    price: 329, category: 'crew', tag: 'new-drop',
  },
  {
    slug: 'heritage-argyle-knee-high',
    name: 'Heritage Argyle Knee-High',
    description: 'Timeless argyle in a warm knee-high fit. Wool blend keeps you cosy in cooler weather.',
    price: 449, category: 'knee-high', tag: 'limited-edition',
  },
  {
    slug: 'checkerboard-crew',
    name: 'Checkerboard Crew',
    description: 'Black-and-white checkerboard crew socks. Skate-park classic, limited run.',
    price: 349, category: 'crew', tag: 'limited-edition',
  },
  {
    slug: 'everyday-no-show-3-pack',
    name: 'Everyday No-Show (3-Pack)',
    description: 'Three pairs of invisible no-show socks with silicone heel grip so they never slip.',
    price: 499, compareAt: 599, category: 'packs',
  },
  {
    slug: 'neon-wave-crew',
    name: 'Neon Wave Crew',
    description: 'Bright neon stripes for loud outfits. Reinforced heel and toe.',
    price: 349, category: 'crew', tag: 'new-drop',
  },
  {
    slug: 'forest-wool-hiker',
    name: 'Forest Wool Hiker',
    description: 'Thick merino-blend hiking socks in forest green. Extra cushioning where you need it.',
    price: 549, category: 'crew',
  },
  {
    slug: 'cloud-knee-high',
    name: 'Cloud Knee-High',
    description: 'Pastel striped knee-highs, super soft and stretchy. Pairs perfectly with skirts and shorts.',
    price: 399, category: 'knee-high', tag: 'new-drop',
  },
  {
    slug: 'mono-rib-ankle',
    name: 'Mono Rib Ankle',
    description: 'Minimal heather-grey ribbed ankle socks. The quiet essential.',
    price: 229, category: 'ankle',
  },
  {
    slug: 'rainbow-gift-box-5-pack',
    name: 'Rainbow Gift Box (5-Pack)',
    description: 'Five pairs in five colours, packed in a gift box. The easiest present ever.',
    price: 999, compareAt: 1299, category: 'packs', tag: 'limited-edition',
  },
];
