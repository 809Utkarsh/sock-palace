import { Link, useParams } from 'react-router-dom';
import { TruckIcon } from '../components/Icons';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center md:py-28">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand text-white">
        <TruckIcon />
      </div>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-muted">Order #{id} confirmed</p>
      <h1 className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">
        Coming soon to your doorstep
      </h1>
      <p className="mt-6 text-lg text-ink/80">
        Thank you for your order! 🧦 We're just getting started, so please be patient. Your socks are on their way.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/orders" className="border border-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-ink hover:text-white">
          View My Orders
        </Link>
        <Link to="/collections/all" className="bg-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-brand">
          Keep Shopping
        </Link>
      </div>
    </div>
  );
}
