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
    api('/orders')
      .then((d) => setOrders(d.orders))
      .catch(() => setOrders([]));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-28 text-center">
        <h1 className="display text-2xl md:text-3xl">My Orders</h1>
        <p className="caps text-muted">Log in to see your orders.</p>
        <button onClick={() => requireLogin()} className="btn-outline max-w-xs">Log In</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 md:px-8 md:pt-12">
      <h1 className="display text-2xl md:text-3xl">My Orders</h1>
      {orders === null && <p className="caps mt-8 text-muted">Loading…</p>}
      {orders?.length === 0 && (
        <p className="caps mt-8 text-muted">
          No orders yet. <Link to="/collections/all" className="text-fg underline underline-offset-4">Start shopping</Link>
        </p>
      )}
      <div className="mt-8 flex flex-col gap-6">
        {orders?.map((o) => (
          <div key={o.id} className="border border-line/40 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/20 pb-4">
              <div className="caps">
                <p className="font-bold">Order #{o.id}</p>
                <p className="text-muted">{new Date(o.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
              </div>
              <span className="pill">{STATUS[o.status]}</span>
            </div>
            <ul>
              {o.items.map((i, idx) => (
                <li key={idx} className="flex items-center gap-4 border-b border-line/10 py-3">
                  <img src={i.image} alt="" className="aspect-square w-14 object-contain" />
                  <div className="caps flex-1">
                    <Link to={`/products/${i.slug}`} className="font-medium hover:opacity-80">{i.name}</Link>
                    <p className="text-muted">Size {i.size} · Qty {i.quantity}</p>
                  </div>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="caps flex justify-between pt-4 text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
