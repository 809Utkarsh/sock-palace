import { Link } from 'react-router-dom';
import { formatPrice } from '../api';
import { TAG_LABELS } from '../collections';

export default function ProductCard({ product }) {
  const [front, back] = product.images;
  const href = `/products/${product.slug}`;
  const badge = product.tag ? TAG_LABELS[product.tag] : product.compare_at_price ? 'Sale' : null;

  return (
    <div className="flex flex-col">
      <Link to={href} className="group relative block aspect-square border border-line">
        {badge && <span className="pill absolute left-3 top-3 z-10 bg-bg/40">{badge}</span>}
        <img
          src={front}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-[12%] transition duration-500 group-hover:opacity-0"
        />
        {back && (
          <img
            src={back}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-[10%] opacity-0 transition duration-500 group-hover:opacity-100"
          />
        )}
      </Link>
      <Link to={href} className="display mt-3 text-[15px] leading-tight hover:opacity-80 md:text-base">
        {product.name}
      </Link>
      <div className="mt-2 flex items-center gap-3 text-base tracking-wide">
        <span>{formatPrice(product.price)}</span>
        {product.compare_at_price && (
          <span className="text-sm text-muted line-through">{formatPrice(product.compare_at_price)}</span>
        )}
      </div>
      <Link to={href} className="btn-outline mt-4">
        View Product
      </Link>
    </div>
  );
}
