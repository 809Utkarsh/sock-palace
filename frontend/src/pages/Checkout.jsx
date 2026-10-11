import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Centered({ title, text, children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-28 text-center">
      <h1 className="display text-2xl md:text-3xl">{title}</h1>
      {text && <p className="caps text-muted">{text}</p>}
      {children}
    </div>
  );
}

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
      <Centered title="Almost there" text="Log in or create an account to place your order.">
        <button onClick={() => requireLogin()} className="btn-outline max-w-xs">Log In / Sign Up</button>
      </Centered>
    );
  }

  if (items.length === 0) {
    return (
      <Centered title="Your cart is empty">
        <Link to="/collections/all" className="btn-outline max-w-xs">Shop Socks</Link>
      </Centered>
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
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-8 md:grid-cols-[1fr_400px] md:px-8 md:pt-12">
      <form onSubmit={place} className="flex flex-col gap-3">
        <h1 className="display mb-4 text-2xl md:text-3xl">Checkout</h1>
        <p className="caps mb-1 text-lg tracking-[0.06em]">Delivery details</p>
        <input className="field" placeholder="Full name" value={form.fullName} onChange={set('fullName')} required />
        <input className="field" placeholder="Phone number" type="tel" value={form.phone} onChange={set('phone')} required />
        <textarea className="field" rows={3} placeholder="House no., street, area" value={form.address} onChange={set('address')} required />
        <div className="grid grid-cols-2 gap-3">
          <input className="field" placeholder="City" value={form.city} onChange={set('city')} required />
          <input className="field" placeholder="Pincode" inputMode="numeric" value={form.pincode} onChange={set('pincode')} required />
        </div>
        <div className="mt-3 border border-dashed border-line/50 p-4">
          <p className="caps font-bold">No payment needed right now</p>
          <p className="caps mt-1 text-muted">We're launching soon. Your order is saved and will be delivered to your doorstep.</p>
        </div>
        {error && <p className="caps text-danger">{error}</p>}
        <button disabled={placing} className="btn-solid mt-3">
          {placing ? 'Placing order…' : `Place Order · ${formatPrice(subtotal)}`}
        </button>
      </form>

      <aside className="h-fit border border-line/40 p-6">
        <p className="caps text-lg tracking-[0.06em]">Order summary</p>
        <ul className="mt-4">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 border-b border-line/20 py-3">
              <div className="relative w-16 shrink-0">
                <img src={i.images[0]} alt="" className="aspect-square w-full object-contain" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-fg text-[10px] font-bold text-black">
                  {i.quantity}
                </span>
              </div>
              <div className="caps flex-1">
                <p className="font-medium">{i.name}</p>
                <p className="text-muted">Size {i.size}</p>
              </div>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="caps mt-4 space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
          <div className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
        </div>
      </aside>
    </div>
  );
}
