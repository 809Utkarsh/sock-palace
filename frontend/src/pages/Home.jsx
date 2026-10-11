import { Link } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';
import { useProducts } from '../useProducts';

function Hero({ products }) {
  const picks = products.slice(0, 3);
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-8 md:py-24">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand">New Season Drop</p>
          <h1 className="mt-4 font-display text-6xl uppercase leading-[0.9] md:text-8xl">
            Loud socks.
            <br />
            Bold feet.
          </h1>
          <p className="mt-6 max-w-md text-white/70">
            Crew, ankle and knee-high socks in colours that refuse to be boring. Limited runs, made to be noticed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/collections/new-drops"
              className="bg-brand px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-ink"
            >
              Shop New Drops
            </Link>
            <Link
              to="/collections/all"
              className="border border-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-ink"
            >
              Shop All
            </Link>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-3 md:gap-4">
          {picks.map((p, i) => (
            <Link
              key={p.id}
              to={`/products/${p.slug}`}
              className={`block overflow-hidden transition hover:-translate-y-1 ${i === 1 ? 'translate-y-8' : ''}`}
            >
              <img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const TILES = [
  { title: 'Crew', to: '/collections/crew', img: '/products/varsity-stripe-crew-2.svg' },
  { title: 'Ankle', to: '/collections/ankle', img: '/products/sunset-ankle-2.svg' },
  { title: 'Knee-High', to: '/collections/knee-high', img: '/products/heritage-argyle-knee-high-2.svg' },
  { title: 'Gift Packs', to: '/collections/packs', img: '/products/rainbow-gift-box-5-pack-2.svg' },
];

function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h2 className="mb-6 font-display text-4xl uppercase md:text-5xl">Shop by Style</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {TILES.map((t) => (
          <Link key={t.to} to={t.to} className="group relative block overflow-hidden">
            <img src={t.img} alt="" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="font-display text-3xl uppercase text-white">{t.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Banner() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid items-center gap-8 bg-brand p-8 text-white md:grid-cols-2 md:p-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]">Limited Edition</p>
          <h2 className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">The Gift Box</h2>
          <p className="mt-4 max-w-sm text-white/85">Five pairs, five colours, one box. Once they're gone, they're gone.</p>
          <Link
            to="/products/rainbow-gift-box-5-pack"
            className="mt-6 inline-block bg-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-ink"
          >
            View Product
          </Link>
        </div>
        <img src="/products/rainbow-gift-box-5-pack-1.svg" alt="Rainbow gift box" className="mx-auto aspect-[4/5] w-full max-w-xs object-cover" />
      </div>
    </section>
  );
}

export default function Home() {
  const { products, loading, error } = useProducts();
  const byTag = (tag) => products.filter((p) => p.tag === tag);

  return (
    <>
      <Hero products={products} />
      {loading && <p className="py-20 text-center text-sm uppercase tracking-widest text-muted">Loading socks…</p>}
      {error && <p className="py-20 text-center text-sm text-brand">Couldn't load products: {error}</p>}
      {!loading && !error && (
        <>
          <ProductCarousel title="New Drops" viewAll="/collections/new-drops" products={byTag('new-drop')} />
          <CategoryTiles />
          <ProductCarousel title="Bestsellers" viewAll="/collections/bestsellers" products={[...byTag('bestseller'), ...products.filter((p) => p.category === 'crew' && !p.tag)]} />
          <Banner />
          <ProductCarousel title="Shop All" viewAll="/collections/all" products={products} />
        </>
      )}
    </>
  );
}
