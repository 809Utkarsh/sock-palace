import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-28 text-center">
      <h1 className="font-display text-8xl uppercase">404</h1>
      <p className="text-muted">This page wandered off like a lost sock.</p>
      <Link to="/" className="bg-ink px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-brand">
        Back Home
      </Link>
    </div>
  );
}
