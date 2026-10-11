import { Link, useParams } from 'react-router-dom';
import { TruckIcon } from '../components/Icons';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center md:py-28">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-line">
        <TruckIcon />
      </div>
      <span className="pill mt-8">Order #{id} confirmed</span>
      <h1 className="display mt-6 text-3xl leading-tight md:text-5xl">Coming soon to your doorstep</h1>
      <p className="caps mt-6 max-w-lg text-base leading-relaxed text-muted">
        Thank you for your order! We're just getting started, so please be patient. Your socks are on their way.
      </p>
      <div className="mt-10 grid w-full max-w-md gap-3 sm:grid-cols-2">
        <Link to="/orders" className="btn-outline">View My Orders</Link>
        <Link to="/collections/all" className="btn-solid">Keep Shopping</Link>
      </div>
    </div>
  );
}
