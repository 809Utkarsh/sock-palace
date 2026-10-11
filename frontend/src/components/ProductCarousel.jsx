import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { ChevronIcon } from './Icons';

export default function ProductCarousel({ title, viewAll, products }) {
  const track = useRef(null);
  const scroll = (dir) => {
    const el = track.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-display text-4xl uppercase md:text-5xl">{title}</h2>
        <div className="flex items-center gap-3">
          {viewAll && (
            <Link to={viewAll} className="text-xs font-bold uppercase tracking-[0.18em] underline underline-offset-4 hover:text-brand">
              View All
            </Link>
          )}
          <button
            onClick={() => scroll(-1)}
            className="hidden h-10 w-10 items-center justify-center border border-ink hover:bg-ink hover:text-white sm:flex"
            aria-label="Previous"
          >
            <ChevronIcon dir="left" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="hidden h-10 w-10 items-center justify-center border border-ink hover:bg-ink hover:text-white sm:flex"
            aria-label="Next"
          >
            <ChevronIcon />
          </button>
        </div>
      </div>
      <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:gap-6 md:px-0">
        {products.map((p) => (
          <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-[calc(25%-18px)]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
