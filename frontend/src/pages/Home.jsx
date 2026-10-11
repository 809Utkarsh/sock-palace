import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../useProducts';

// Limited editions first, then new drops and bestsellers, then everything else.
const RANK = { 'limited-edition': 0, 'new-drop': 1, bestseller: 2 };

export default function Home() {
  const { products, loading, error } = useProducts();
  const sorted = [...products].sort((a, b) => (RANK[a.tag] ?? 3) - (RANK[b.tag] ?? 3));

  return (
    <div className="px-4 pt-6 md:px-12 md:pt-8">
      {loading && <p className="caps py-32 text-center text-muted">Loading socks…</p>}
      {error && <p className="caps py-32 text-center text-danger">Couldn't load products: {error}</p>}
      {!loading && !error && <ProductGrid products={sorted} />}
    </div>
  );
}
