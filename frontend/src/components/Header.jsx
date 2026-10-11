import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV } from '../collections';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import SearchOverlay from './SearchOverlay';
import { CartIcon, ChevronIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from './Icons';

function AccountButton() {
  const { user, requireLogin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <button onClick={() => requireLogin()} className="hover:opacity-70" aria-label="Log in">
        <UserIcon />
      </button>
    );
  }
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button onClick={() => setOpen((o) => !o)} className="hover:opacity-70" aria-label="Account menu">
        <UserIcon />
      </button>
      {open && (
        <div className="caps absolute right-0 top-full z-50 w-52 border border-line/40 bg-panel py-2 shadow-2xl">
          <p className="truncate px-4 py-2 text-muted">Hi, {user.name.split(' ')[0]}</p>
          <Link to="/orders" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-white/5">
            My Orders
          </Link>
          <button onClick={logout} className="caps block w-full px-4 py-2 text-left hover:bg-white/5">
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="relative z-40">
      <div className="grid h-[76px] grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
        {/* Left: dropdown nav (desktop) / menu button (mobile) */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((group) => (
            <div key={group.label} className="group relative py-6">
              <Link to={group.to} className="flex items-center gap-1 font-display text-[13px] font-extrabold uppercase tracking-[0.06em] hover:opacity-70">
                {group.label}
                <ChevronIcon />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 border border-line/40 bg-panel py-3 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link to={group.to} className="caps block px-5 py-2 font-bold hover:bg-white/5">
                  View All
                </Link>
                {group.links.map(([label, to]) => (
                  <Link key={to} to={to} className="caps block px-5 py-2 hover:bg-white/5">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <button className="justify-self-start lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <MenuIcon />
        </button>

        {/* Center: wordmark */}
        <Logo className="text-[22px] sm:text-3xl md:text-[40px]" />

        {/* Right: search, account, cart */}
        <div className="flex items-center justify-end gap-4 md:gap-6">
          <button onClick={() => setSearchOpen(true)} className="hidden hover:opacity-70 sm:block" aria-label="Search">
            <SearchIcon />
          </button>
          <AccountButton />
          <button onClick={() => setOpen(true)} className="relative hover:opacity-70" aria-label="Open cart">
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-fg px-1 text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={closeSearch} />}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-fade-in absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col border-r border-line/30 bg-panel">
            <div className="flex items-center justify-between border-b border-line/30 p-4">
              <Logo className="text-xl" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="caps mb-2 flex w-full items-center gap-2 border-b border-line/30 py-3"
              >
                <SearchIcon width="18" height="18" /> Search
              </button>
              {NAV.map((group) => (
                <details key={group.label} className="border-b border-line/30 py-3">
                  <summary className="display flex cursor-pointer list-none items-center justify-between text-base">
                    {group.label}
                    <ChevronIcon />
                  </summary>
                  <div className="mt-3 flex flex-col gap-3 pl-1">
                    <Link to={group.to} className="caps font-bold">View All</Link>
                    {group.links.map(([label, to]) => (
                      <Link key={to} to={to} className="caps text-muted">{label}</Link>
                    ))}
                  </div>
                </details>
              ))}
              <Link to="/orders" className="display mt-4 block text-base">My Orders</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
