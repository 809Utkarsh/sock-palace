import { Link } from 'react-router-dom';
import Logo from './Logo';
import { SOCIALS } from './Icons';

const LINKS = ['Help & Support', 'Shipping', 'Returns', 'Terms', 'Privacy'];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line/20">
      <div className="flex flex-col gap-8 px-4 py-10 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Logo className="text-2xl md:text-[28px]" />
          <div className="flex gap-6">
            {SOCIALS.map((s) => (
              <a key={s.name} href="#" aria-label={s.name} className="hover:opacity-70">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d={s.path} fillRule="evenodd" />
                </svg>
              </a>
            ))}
          </div>
        </div>
        <p className="caps max-w-3xl text-base leading-relaxed md:px-4">
          Need help with an order or using a screen reader? Contact our support team and we'll be happy to assist.
        </p>
        <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[12px] uppercase tracking-[0.18em] md:px-4">
          {LINKS.map((l) => (
            <Link key={l} to="/" className="hover:opacity-70">
              {l}
            </Link>
          ))}
        </nav>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted md:px-4">
          © {new Date().getFullYear()} Sock Palace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
