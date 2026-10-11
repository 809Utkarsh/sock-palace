import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../api';
import { useProducts } from '../useProducts';
import { CloseIcon, SearchIcon } from './Icons';

export default function SearchOverlay({ onClose }) {
  const { products } = useProducts();
  const [q, setQ] = useState('');
  const input = useRef(null);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const term = q.trim().toLowerCase();
  const results = term
    ? products.filter((p) => `${p.name} ${p.category} ${p.tag || ''}`.toLowerCase().includes(term))
    : [];

  return (
    <div className="fixed inset-0 z-[55]">
      <div className="animate-fade-in absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="animate-fade-in relative border-b border-line/30 bg-panel px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3 border-b border-line pb-2">
          <SearchIcon />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search socks"
            className="caps flex-1 bg-transparent py-2 outline-none placeholder:text-muted"
          />
          <button onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </button>
        </div>
        {term && (
          <ul className="mx-auto mt-4 max-h-[60vh] max-w-3xl overflow-y-auto">
            {results.length === 0 && <li className="caps py-3 text-muted">No socks found for “{q}”</li>}
            {results.map((p) => (
              <li key={p.id}>
                <Link to={`/products/${p.slug}`} onClick={onClose} className="flex items-center gap-4 py-2 hover:opacity-80">
                  <img src={p.images[0]} alt="" className="h-16 w-14 border border-line/40 object-contain p-1" />
                  <span className="display flex-1 text-sm">{p.name}</span>
                  <span className="caps">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
