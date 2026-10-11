const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const BagIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const UserIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
);
export const MenuIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);
export const CloseIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const ChevronIcon = ({ dir = 'right', ...p }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : dir === 'down' ? 'M5 9l7 7 7-7' : 'M9 5l7 7-7 7'} />
  </svg>
);
export const TruckIcon = (p) => (
  <svg viewBox="0 0 24 24" width="48" height="48" {...base} {...p}>
    <path d="M2 6h11v10H2zM13 10h4l4 4v2h-8z" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

// Simple generic social glyphs for the footer.
export const SOCIALS = [
  {
    name: 'Instagram',
    path: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01',
  },
  { name: 'X', path: 'M4 4l16 16M20 4 4 20' },
  { name: 'YouTube', path: 'M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Zm7 1v6l5-3Z' },
  { name: 'Facebook', path: 'M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2Z' },
];
