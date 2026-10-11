import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { TAG_LABELS } from '../collections';
import { useCart } from '../context/CartContext';
import ProductCarousel from '../components/ProductCarousel';
import { useProducts } from '../useProducts';
import NotFound from './NotFound';

const SIZE_GUIDE = { S: 'UK 3-5', M: 'UK 6-8', L: 'UK 9-11' };

export default function Product() {
  const { slug } = useParams();
  const { add, busy } = useCart();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [image, setImage] = useState(0);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const related = useProducts(product ? `?category=${product.category}` : '');

  useEffect(() => {
    setStatus('loading');
    setImage(0);
    setSize('');
    setQty(1);
    setError('');
    api(`/products/${slug}`)
      .then((d) => {
        setProduct(d.product);
        setStatus('ok');
      })
      .catch((e) => setStatus(e.status === 404 ? 'missing' : 'error'));
  }, [slug]);

  if (status === 'missing') return <NotFound />;
  if (status === 'loading' || !product)
    return <p className="py-32 text-center text-sm uppercase tracking-widest text-muted">{status === 'error' ? 'Could not load product' : 'Loading…'}</p>;

  const addToCart = async () => {
    if (!size) return setError('Please select a size');
    setError('');
    try {
      await add(product.id, size, qty);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-2 md:gap-14 md:px-8 md:py-14">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <div className="flex gap-3 md:flex-col">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImage(i)}
                className={`w-20 border-2 ${i === image ? 'border-ink' : 'border-transparent'}`}
              >
                <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />
              </button>
            ))}
          </div>
          <img src={product.images[image]} alt={product.name} className="aspect-[4/5] w-full flex-1 bg-white object-cover" />
        </div>

        {/* Details */}
        <div className="md:sticky md:top-28 md:self-start">
          <nav className="text-[11px] uppercase tracking-widest text-muted">
            <Link to="/" className="hover:text-ink">Home</Link> / <Link to="/collections/all" className="hover:text-ink">Shop</Link> / {product.name}
          </nav>
          {product.tag && (
            <span className="mt-4 inline-block bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {TAG_LABELS[product.tag]}
            </span>
          )}
          <h1 className="mt-3 font-display text-4xl uppercase leading-none md:text-6xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3 text-xl">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-muted line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted">Tax included. Free shipping.</p>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-widest">
              Size {size && <span className="font-normal text-muted">: {size} ({SIZE_GUIDE[size] || ''})</span>}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    setError('');
                  }}
                  className={`h-12 min-w-14 border px-4 text-sm font-semibold ${
                    size === s ? 'border-ink bg-ink text-white' : 'border-ink/25 hover:border-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest">Quantity</p>
            <div className="mt-3 flex w-fit items-center border border-ink/25">
              <button className="px-4 py-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
              <span className="w-10 text-center">{qty}</span>
              <button className="px-4 py-3" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase">+</button>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-brand">{error}</p>}
          <button
            onClick={addToCart}
            disabled={busy}
            className="mt-6 w-full bg-ink py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-brand disabled:opacity-60"
          >
            {busy ? 'Adding…' : 'Add to Cart'}
          </button>

          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            <details open className="py-4">
              <summary className="cursor-pointer list-none text-xs font-bold uppercase tracking-widest">Description</summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{product.description}</p>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer list-none text-xs font-bold uppercase tracking-widest">Size Guide</summary>
              <ul className="mt-3 text-sm text-ink/80">
                {Object.entries(SIZE_GUIDE).map(([k, v]) => (
                  <li key={k}>{k}: {v}</li>
                ))}
              </ul>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer list-none text-xs font-bold uppercase tracking-widest">Shipping</summary>
              <p className="mt-3 text-sm text-ink/80">
                We're just getting started. Orders are confirmed instantly and delivered to your doorstep soon.
              </p>
            </details>
          </div>
        </div>
      </div>

      {related.products.length > 1 && (
        <ProductCarousel
          title="You May Also Like"
          products={related.products.filter((p) => p.id !== product.id)}
        />
      )}
    </>
  );
}
