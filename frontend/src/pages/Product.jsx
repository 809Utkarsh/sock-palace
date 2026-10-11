import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { TAG_LABELS } from '../collections';
import { useCart } from '../context/CartContext';
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
  if (status !== 'ok' || !product) {
    return (
      <p className="caps py-40 text-center text-muted">{status === 'error' ? 'Could not load product' : 'Loading…'}</p>
    );
  }

  const addToCart = async () => {
    if (!size) return setError('Please select a size');
    setError('');
    try {
      await add(product.id, size, qty);
    } catch (e) {
      setError(e.message);
    }
  };

  const badge = product.tag ? TAG_LABELS[product.tag] : product.compare_at_price ? 'Sale' : null;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-6 md:grid-cols-2 md:gap-10 md:px-8 md:pt-20">
      {/* Gallery: framed main image + thumbnails */}
      <div>
        <div className="relative aspect-square border border-line">
          <img src={product.images[image]} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-[10%]" />
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImage(i)}
                className={`aspect-square w-20 border ${i === image ? 'border-fg' : 'border-line/30 hover:border-line/70'}`}
                aria-label={`Image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain p-2" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="max-w-md md:sticky md:top-8 md:self-start">
        <h1 className="display text-xl leading-snug md:text-[22px]">{product.name}</h1>
        {badge && <span className="pill mt-3 bg-fg text-black">{badge}</span>}
        <div className="mt-4 flex items-center gap-3 text-lg tracking-wide">
          <span>{formatPrice(product.price)}</span>
          {product.compare_at_price && <span className="text-base text-muted line-through">{formatPrice(product.compare_at_price)}</span>}
        </div>

        <p className="caps mt-6 text-lg tracking-[0.06em]">Size</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setError('');
              }}
              className={`h-10 min-w-12 border px-3 text-sm font-medium tracking-wider ${
                size === s ? 'border-fg bg-fg text-black' : 'border-line/50 hover:border-fg'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {size && <p className="caps mt-2 text-muted">Fits {SIZE_GUIDE[size]}</p>}

        <p className="caps mt-6 text-lg tracking-[0.06em]">Quantity</p>
        <div className="mt-1 flex items-center gap-6 px-5 text-lg">
          <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">-</button>
          <span className="w-6 text-center">{qty}</span>
          <button onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase">+</button>
        </div>

        {error && <p className="caps mt-4 text-danger">{error}</p>}
        <button onClick={addToCart} disabled={busy} className="btn-outline mt-5 py-2.5">
          {busy ? 'Adding…' : 'Add to Cart'}
        </button>

        <p className="caps mt-6 text-lg tracking-[0.06em]">
          <span className="font-bold">Ships:</span> Coming soon to your doorstep
        </p>
        <div className="mt-5 space-y-4 text-[13px] font-bold uppercase leading-relaxed tracking-[0.02em]">
          <p>{product.description}</p>
          <p>
            Sizes: S (UK 3-5) · M (UK 6-8) · L (UK 9-11)
            <br />
            Free shipping. No payment needed right now.
          </p>
        </div>
      </div>
    </div>
  );
}
