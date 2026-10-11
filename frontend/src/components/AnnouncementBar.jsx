const MESSAGES = [
  'Free shipping on orders over ₹999',
  'New drop: Neon Wave Crew is here',
  'Limited Edition argyle, while stocks last',
  'Gift boxes now available',
];

export default function AnnouncementBar() {
  const row = [...MESSAGES, ...MESSAGES];
  return (
    <div className="overflow-hidden bg-ink text-white">
      <div className="animate-marquee flex w-max gap-12 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
        {row.map((m, i) => (
          <span key={i} className="flex items-center gap-12">
            {m}
            <span className="text-brand">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
