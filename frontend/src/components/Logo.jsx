import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`whitespace-nowrap font-display font-black uppercase leading-none tracking-[0.08em] ${className}`}
      aria-label="Sock Palace home"
    >
      Sock Palace
    </Link>
  );
}
