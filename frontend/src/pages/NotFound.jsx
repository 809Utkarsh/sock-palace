import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-32 text-center">
      <h1 className="display text-6xl">404</h1>
      <p className="caps text-muted">This page wandered off like a lost sock.</p>
      <Link to="/" className="btn-outline max-w-xs">Back Home</Link>
    </div>
  );
}
