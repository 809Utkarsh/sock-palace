import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS = {
  pending: 'Coming soon to your doorstep',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function Orders() {
  const { user, requireLogin } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user) return;
    api('/orders').then((d) => setOrders(d.orders)).catch(() => setOrders([]));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
        <h1 className="font-display text-5xl uppercase">My Orders</h1>
        <p className="text-muted">Log in to see your orders.</p>
        <button onClick={() => requireLogin()} className="bg-ink px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-brand">
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="font-display text-5xl uppercase md:text-6xl">My Orders</h1>
      {orders === null && <p className="mt-8 text-sm text-muted">Loading…</p>}
      {orders?.length === 0 && (
        <p className="mt-8 text-muted">
          No orders yet. <Link to="/collections/all" className="underline">Start shopping</Link>
        </p>
      )}
      <div className="mt-8 flex flex-col gap-6">
        {orders?.map((o) => (
          <div key={o.id} className="bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest">Order #{o.id}</p>
                <p className="text-xs text-muted">{new Date(o.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
              </div>
              <span className="bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">🚚 {STATUS[o.status]}</span>
            </div>
            <ul className="divide-y divide-ink/10">
              {o.items.map((i, idx) => (
                <li key={idx} className="flex items-center gap-4 py-3">
                  <img src={i.image} alt="" className="aspect-[4/5] w-14 object-cover" />
                  <div className="flex-1 text-sm">
                    <Link to={`/products/${i.slug}`} className="font-semibold hover:underline">{i.name}</Link>
                    <p className="text-xs text-muted">Size {i.size} · Qty {i.quantity}</p>
                  </div>
                  <span className="text-sm">{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-ink/10 pt-4 text-sm font-bold">
              <span>Total</span>
              <span>{formatPrice(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
