// Generates placeholder product art: public/products/<slug>-1.svg (single sock)
// and <slug>-2.svg (pair). Replace these files with real photos whenever you like.
// Usage: npm run gen:images
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/products/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// leg: where the sock starts (lower number = taller sock)
const socks = {
  'midnight-crew':             { bg: '#e9e6e1', base: '#1b1b1f', accent: '#f4f1ea', pattern: 'cuffStripe', leg: 130 },
  'varsity-stripe-crew':       { bg: '#dfe7ef', base: '#fbfbf8', accent: '#c8102e', accent2: '#1f3a8a', pattern: 'varsity', leg: 130 },
  'sunset-ankle':              { bg: '#fdeedd', base: '#ff7a3d', accent: '#ffc94a', accent2: '#e2366b', pattern: 'stripes', leg: 330 },
  'polka-party-crew':          { bg: '#f6e6ea', base: '#1f2d5a', accent: '#ffd23f', pattern: 'dots', leg: 130 },
  'heritage-argyle-knee-high': { bg: '#ece5d8', base: '#7b2d26', accent: '#d9b26f', accent2: '#2c4a3e', pattern: 'argyle', leg: 40 },
  'checkerboard-crew':         { bg: '#e7e7e7', base: '#111111', accent: '#f5f5f5', pattern: 'checker', leg: 130 },
  'everyday-no-show-3-pack':   { bg: '#e8eef0', base: '#d8cfc4', accent: '#bfb3a5', pattern: 'solid', leg: 400 },
  'neon-wave-crew':            { bg: '#1a1a1a', base: '#14f195', accent: '#ff3cac', accent2: '#2b86ff', pattern: 'stripes', leg: 130 },
  'forest-wool-hiker':         { bg: '#e4eadf', base: '#2f5233', accent: '#c9a66b', pattern: 'cuffStripe', leg: 130 },
  'cloud-knee-high':           { bg: '#eef0fb', base: '#c9d7ff', accent: '#ffd1e8', accent2: '#fff6c9', pattern: 'stripes', leg: 40 },
  'mono-rib-ankle':            { bg: '#f1f1ef', base: '#9a9a9a', accent: '#8a8a8a', pattern: 'rib', leg: 330 },
  'rainbow-gift-box-5-pack':   { bg: '#fff4e0', base: '#ff595e', accent: '#ffca3a', accent2: '#1982c4', pattern: 'rainbow', leg: 130 },
};

function sockPath(top) {
  return `M220 ${top} L380 ${top} L380 470 Q380 515 420 540 L505 588 Q552 615 536 662 Q518 708 462 694 L300 645 Q220 620 220 545 Z`;
}

function patternFill(id, s) {
  const a2 = s.accent2 || s.accent;
  switch (s.pattern) {
    case 'stripes':
      return `<pattern id="${id}" width="60" height="90" patternUnits="userSpaceOnUse">
        <rect width="60" height="90" fill="${s.base}"/><rect y="0" width="60" height="30" fill="${s.accent}"/><rect y="45" width="60" height="22" fill="${a2}"/></pattern>`;
    case 'rainbow':
      return `<pattern id="${id}" width="60" height="150" patternUnits="userSpaceOnUse">
        <rect width="60" height="30" fill="#ff595e"/><rect y="30" width="60" height="30" fill="#ffca3a"/><rect y="60" width="60" height="30" fill="#8ac926"/>
        <rect y="90" width="60" height="30" fill="#1982c4"/><rect y="120" width="60" height="30" fill="#6a4c93"/></pattern>`;
    case 'dots':
      return `<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill="${s.base}"/><circle cx="11" cy="11" r="7" fill="${s.accent}"/><circle cx="33" cy="33" r="7" fill="${s.accent}"/></pattern>`;
    case 'checker':
      return `<pattern id="${id}" width="56" height="56" patternUnits="userSpaceOnUse">
        <rect width="56" height="56" fill="${s.accent}"/><rect width="28" height="28" fill="${s.base}"/><rect x="28" y="28" width="28" height="28" fill="${s.base}"/></pattern>`;
    case 'argyle':
      return `<pattern id="${id}" width="80" height="120" patternUnits="userSpaceOnUse">
        <rect width="80" height="120" fill="${s.base}"/><path d="M40 0 L80 60 L40 120 L0 60 Z" fill="${a2}"/>
        <path d="M0 0 L80 120 M80 0 L0 120" stroke="${s.accent}" stroke-width="3"/></pattern>`;
    case 'rib':
      return `<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="${s.base}"/><rect width="4" height="14" fill="${s.accent}"/></pattern>`;
    default:
      return `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${s.base}"/></pattern>`;
  }
}

function sock(id, s) {
  const top = s.leg;
  const clip = `${id}-clip`;
  const cuffH = s.leg >= 330 ? 36 : 60;
  let cuff = `<rect x="220" y="${top}" width="160" height="${cuffH}" fill="${s.base}" opacity="0.92"/>`;
  for (let x = 228; x < 380; x += 12) {
    cuff += `<rect x="${x}" y="${top}" width="4" height="${cuffH}" fill="#000" opacity="0.10"/>`;
  }
  if (s.pattern === 'cuffStripe') {
    cuff += `<rect x="220" y="${top + cuffH + 14}" width="160" height="14" fill="${s.accent}"/>`;
  }
  if (s.pattern === 'varsity') {
    cuff += `<rect x="220" y="${top + 18}" width="160" height="12" fill="${s.accent}"/><rect x="220" y="${top + 38}" width="160" height="12" fill="${s.accent2}"/>`;
  }
  const fill = ['cuffStripe', 'varsity', 'solid'].includes(s.pattern) ? s.base : `url(#${id}-p)`;
  return `
  <defs>${patternFill(`${id}-p`, s)}<clipPath id="${clip}"><path d="${sockPath(top)}"/></clipPath></defs>
  <g>
    <path d="${sockPath(top)}" fill="${fill}"/>
    <g clip-path="url(#${clip})">
      ${cuff}
      <path d="M220 520 Q220 600 300 640 L330 650 Q300 560 220 520 Z" fill="${s.accent}" opacity="0.85"/>
      <path d="M470 560 Q560 600 536 662 Q518 708 462 694 Q500 640 470 560 Z" fill="${s.accent}" opacity="0.85"/>
      <path d="M380 ${top} L380 470 Q380 515 420 540 L505 588" fill="none" stroke="#000" stroke-opacity="0.12" stroke-width="18"/>
    </g>
    <path d="${sockPath(top)}" fill="none" stroke="#000" stroke-opacity="0.18" stroke-width="2"/>
  </g>`;
}

function svg(body, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <rect width="600" height="750" fill="${bg}"/>
  <ellipse cx="380" cy="705" rx="190" ry="18" fill="#000" opacity="0.08"/>
  ${body}
</svg>
`;
}

for (const [slug, s] of Object.entries(socks)) {
  const single = svg(sock('a', s), s.bg);
  const pair = svg(
    `<g transform="translate(-95 10) rotate(-6 300 400)">${sock('b', s)}</g>
     <g transform="translate(70 30) rotate(5 300 400)">${sock('c', s)}</g>`,
    s.bg,
  );
  writeFileSync(new URL(`${slug}-1.svg`, OUT), single);
  writeFileSync(new URL(`${slug}-2.svg`, OUT), pair);
}
console.log(`Wrote ${Object.keys(socks).length * 2} images to public/products/`);
