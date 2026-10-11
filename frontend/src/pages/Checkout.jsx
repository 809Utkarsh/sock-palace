import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const input = 'w-full border border-ink/20 bg-white px-4 py-3 text-sm outline-none focus:border-ink';

export default function Checkout() {
  const { user, requireLogin } = useAuth();
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', pincode: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, fullName: f.fullName || user.name }));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
        <h1 className="font-display text-5xl uppercase">Almost there</h1>
        <p className="text-muted">Log in or create an account to place your order.</p>
        <button
          onClick={() => requireLogin()}
          className="bg-ink px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-brand"
        >
          Log In / Sign Up
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
        <h1 className="font-display text-5xl uppercase">Your cart is empty</h1>
        <Link to="/collections/all" className="bg-ink px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-brand">
          Shop Socks
        </Link>
      </div>
    );
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const place = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const { order } = await api('/orders', { method: 'POST', body: form });
      clear();
      navigate(`/order-success/${order.id}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_400px] md:px-8 md:py-14">
      <form onSubmit={place} className="flex flex-col gap-3">
        <h1 className="mb-3 font-display text-5xl uppercase">Checkout</h1>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest">Delivery details</p>
        <input className={input} placeholder="Full name" value={form.fullName} onChange={set('fullName')} required />
        <input className={input} placeholder="Phone number" type="tel" value={form.phone} onChange={set('phone')} required />
        <textarea className={input} rows={3} placeholder="House no., street, area" value={form.address} onChange={set('address')} required />
        <div className="grid grid-cols-2 gap-3">
          <input className={input} placeholder="City" value={form.city} onChange={set('city')} required />
          <input className={input} placeholder="Pincode" inputMode="numeric" value={form.pincode} onChange={set('pincode')} required />
        </div>
        <div className="mt-2 border border-dashed border-ink/30 bg-white p-4 text-sm">
          <p className="font-semibold">No payment needed right now</p>
          <p className="mt-1 text-muted">We're launching soon. Your order will be saved and delivered to your doorstep.</p>
        </div>
        {error && <p className="text-sm text-brand">{error}</p>}
        <button
          disabled={placing}
          className="mt-2 bg-ink py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-brand disabled:opacity-60"
        >
          {placing ? 'Placing order…' : `Place Order · ${formatPrice(subtotal)}`}
        </button>
      </form>

      <aside className="h-fit bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-widest">Order summary</p>
        <ul className="mt-4 divide-y divide-ink/10">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3 py-3">
              <div className="relative w-16 shrink-0">
                <img src={i.images[0]} alt="" className="aspect-[4/5] w-full object-cover" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
                  {i.quantity}
                </span>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-semibold">{i.name}</p>
                <p className="text-xs text-muted">Size {i.size}</p>
              </div>
              <span className="text-sm">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
          <div className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
        </div>
      </aside>
    </div>
  );
}
