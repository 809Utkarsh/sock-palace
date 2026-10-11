import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`font-display uppercase leading-none tracking-wide ${className}`} aria-label="Sock Palace home">
      Sock<span className="text-brand">/</span>Palace
    </Link>
  );
}
