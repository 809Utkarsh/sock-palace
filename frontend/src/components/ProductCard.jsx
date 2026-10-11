import { Link } from 'react-router-dom';
import { formatPrice } from '../api';
import { TAG_LABELS } from '../collections';

export default function ProductCard({ product }) {
  const [front, back] = product.images;
  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        <img
          src={front}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-0"
        />
        {back && (
          <img
            src={back}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        )}
        {product.compare_at_price && (
          <span className="absolute left-3 top-3 bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            Sale
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="text-sm font-semibold leading-snug group-hover:underline">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span>{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-muted line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
        {product.tag && (
          <span className="mt-1 w-fit border border-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
            {TAG_LABELS[product.tag]}
          </span>
        )}
      </div>
    </Link>
  );
}
