import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CloseIcon } from './Icons';

export default function CartDrawer() {
  const { items, subtotal, count, open, setOpen, update, remove, busy } = useCart();
  const { user, requireLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  if (!open) return null;

  const proceed = () => {
    setOpen(false);
    if (user) navigate('/checkout');
    else requireLogin(() => navigate('/checkout'));
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="animate-fade-in absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <aside className="animate-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-2xl uppercase">
            Your Cart {count > 0 && <span className="text-muted">({count})</span>}
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
            <p className="font-display text-3xl uppercase">Your cart is empty</p>
            <Link
              to="/collections/all"
              onClick={() => setOpen(false)}
              className="bg-ink px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-brand"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className={`flex-1 divide-y divide-ink/10 overflow-y-auto px-5 ${busy ? 'opacity-60' : ''}`}>
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <Link to={`/products/${item.slug}`} onClick={() => setOpen(false)} className="w-24 shrink-0">
                    <img src={item.images[0]} alt={item.name} className="aspect-[4/5] w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        to={`/products/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-semibold leading-snug hover:text-brand"
                      >
                        {item.name}
                      </Link>
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <span className="mt-1 text-xs uppercase tracking-widest text-muted">Size {item.size}</span>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-ink/20">
                        <button
                          className="px-3 py-1 disabled:opacity-30"
                          disabled={busy || item.quantity <= 1}
                          onClick={() => update(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          className="px-3 py-1 disabled:opacity-30"
                          disabled={busy || item.quantity >= 10}
                          onClick={() => update(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        disabled={busy}
                        className="text-xs uppercase tracking-widest text-muted underline hover:text-brand"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink/10 p-5">
              <div className="flex justify-between text-sm font-semibold uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Shipping is free. No payment needed right now.</p>
              <button
                onClick={proceed}
                className="mt-4 w-full bg-ink py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-brand"
              >
                Proceed to Buy
              </button>
              {!user && <p className="mt-2 text-center text-xs text-muted">You'll be asked to log in or sign up</p>}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
