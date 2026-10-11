import { NavLink, useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
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
    <div className="px-4 pt-8 md:px-12">
      <h1 className="display text-center text-2xl md:text-4xl">{collection.title}</h1>
      <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:justify-center md:px-0">
        {FILTERS.map((h) => (
          <NavLink
            key={h}
            to={`/collections/${h}`}
            className={({ isActive }) =>
              `pill shrink-0 px-3 py-1 ${isActive ? 'bg-fg text-black' : 'border-line/50 hover:border-fg'}`
            }
          >
            {COLLECTIONS[h].title}
          </NavLink>
        ))}
      </div>
      <p className="caps mt-8 text-center text-muted">{loading ? 'Loading…' : `${products.length} products`}</p>
      {error && <p className="caps mt-6 text-center text-danger">{error}</p>}
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
