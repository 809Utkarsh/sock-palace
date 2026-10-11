import { NavLink, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { COLLECTIONS } from '../collections';
import { useProducts } from '../useProducts';
import NotFound from './NotFound';

const FILTERS = ['all', 'crew', 'ankle', 'knee-high', 'packs', 'new-drops', 'limited-edition'];

export default function Collection() {
  const { handle } = useParams();
  const collection = COLLECTIONS[handle];
  const { products, loading, error } = useProducts(collection?.query ?? '');

  if (!collection) return <NotFound />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="font-display text-5xl uppercase md:text-7xl">{collection.title}</h1>
      <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {FILTERS.map((h) => (
          <NavLink
            key={h}
            to={`/collections/${h}`}
            className={({ isActive }) =>
              `shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest ${
                isActive ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'
              }`
            }
          >
            {COLLECTIONS[h].title}
          </NavLink>
        ))}
      </div>
      <p className="mt-6 text-xs uppercase tracking-widest text-muted">
        {loading ? 'Loading…' : `${products.length} products`}
      </p>
      {error && <p className="mt-6 text-sm text-brand">{error}</p>}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
