import { Link } from 'react-router-dom';
import Logo from './Logo';
import { SOCIALS } from './Icons';

const LINKS = ['Help & Support', 'Shipping', 'Returns', 'Terms', 'Privacy'];

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 text-center md:px-8">
        <Logo className="text-5xl md:text-7xl" />
        <p className="max-w-md text-sm text-white/60">
          Join the list for new drops and limited editions.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-md">
          <input
            type="email"
            placeholder="Email address"
            className="min-w-0 flex-1 border border-white/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white"
          />
          <button className="bg-brand px-6 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-ink">
            Sign Up
          </button>
        </form>
        <div className="flex gap-5">
          {SOCIALS.map((s) => (
            <a key={s.name} href="#" aria-label={s.name} className="text-white/70 hover:text-brand">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
          {LINKS.map((l) => (
            <Link key={l} to="/" className="hover:text-white">
              {l}
            </Link>
          ))}
        </nav>
        <p className="text-[11px] text-white/40">© {new Date().getFullYear()} Sock Palace. All rights reserved.</p>
      </div>
    </footer>
  );
}
