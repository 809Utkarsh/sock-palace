import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../useProducts';
import { CloseIcon, TrashIcon } from './Icons';

// "Would you like to add …?" suggestion: the first sock that isn't already in the cart.
function Upsell({ items, onAdd, busy }) {
  const { products } = useProducts();
  const inCart = new Set(items.map((i) => i.product_id));
  const pick = products.find((p) => !inCart.has(p.id) && p.category !== 'packs');
  if (!pick) return null;

  return (
    <div className="flex gap-4 border-b border-line/20 pb-5">
      <Link to={`/products/${pick.slug}`} className="w-20 shrink-0">
        <img src={pick.images[0]} alt="" className="aspect-square w-full object-contain" />
      </Link>
      <div className="flex-1">
        <p className="caps font-medium">Would you like to add {pick.name} to your cart?</p>
        <p className="mt-1 text-base">{formatPrice(pick.price)}</p>
        <button onClick={() => onAdd(pick.id, pick.sizes.includes('M') ? 'M' : pick.sizes[0])} disabled={busy} className="btn-outline mt-3">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { items, subtotal, count, open, setOpen, add, update, remove, busy } = useCart();
  const { user, requireLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) setError('');
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);
  const safely = (fn) => async (...args) => {
    setError('');
    try {
      await fn(...args);
    } catch (e) {
      setError(e.message);
    }
  };
  const checkout = () => {
    close();
    if (user) navigate('/checkout');
    else requireLogin(() => navigate('/checkout'));
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="animate-fade-in absolute inset-0 bg-black/60" onClick={close} />
      <aside className="animate-slide-in absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col border-l border-line/30 bg-panel">
        <div className="flex items-start justify-between px-5 pt-5">
          <div className="caps text-lg leading-snug tracking-[0.06em]">
            <p>Your Cart</p>
            <p>
              {count} {count === 1 ? 'Item' : 'Items'}
            </p>
          </div>
          <button onClick={close} aria-label="Close cart" className="hover:opacity-70">
            <CloseIcon width="30" height="30" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            <p className="display text-xl">Your cart is empty</p>
            <Link to="/collections/all" onClick={close} className="btn-outline max-w-xs">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className={`flex-1 overflow-y-auto px-5 pt-6 ${busy ? 'opacity-60' : ''}`}>
              <Upsell items={items} onAdd={safely((id, size) => add(id, size, 1))} busy={busy} />
              <ul>
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 border-b border-line/20 py-5">
                    <Link to={`/products/${item.slug}`} onClick={close} className="w-20 shrink-0">
                      <img src={item.images[0]} alt={item.name} className="aspect-square w-full object-contain" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <Link to={`/products/${item.slug}`} onClick={close} className="caps font-medium hover:opacity-80">
                          {item.name}
                        </Link>
                        <span className="text-base">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                      <p className="caps mt-1 text-muted">
                        <span className="font-bold text-fg">Size:</span> {item.size}
                        <span className="mx-2">·</span>
                        <span className="font-bold text-fg">Ships:</span> Coming soon
                      </p>
                      <div className="mt-3 flex items-center gap-6">
                        <div className="flex items-center gap-4 text-lg">
                          <button
                            className="px-1 disabled:opacity-30"
                            disabled={busy || item.quantity <= 1}
                            onClick={safely(() => update(item.id, item.quantity - 1))}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            className="px-1 disabled:opacity-30"
                            disabled={busy || item.quantity >= 10}
                            onClick={safely(() => update(item.id, item.quantity + 1))}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button onClick={safely(() => remove(item.id))} disabled={busy} className="hover:opacity-70" aria-label="Remove item">
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-5 pb-5 pt-4">
              {error && <p className="caps mb-3 text-danger">{error}</p>}
              <div className="flex items-end justify-between">
                <p className="caps text-lg leading-snug tracking-[0.06em]">
                  Subtotal
                  <br />
                  <span className="text-sm text-muted">Shipping free · no payment needed</span>
                </p>
                <span className="text-lg">{formatPrice(subtotal)}</span>
              </div>
              <button onClick={checkout} className="btn-outline mt-4 py-3">
                Checkout
              </button>
              {!user && <p className="caps mt-2 text-center text-[11px] text-muted">You'll log in or sign up at checkout</p>}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
