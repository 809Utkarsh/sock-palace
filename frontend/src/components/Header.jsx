import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV } from '../collections';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import { BagIcon, ChevronIcon, CloseIcon, MenuIcon, UserIcon } from './Icons';

function AccountButton() {
  const { user, requireLogin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <button onClick={() => requireLogin()} className="flex items-center gap-1.5 hover:text-brand" aria-label="Log in">
        <UserIcon />
        <span className="hidden text-xs font-semibold uppercase tracking-widest md:inline">Account</span>
      </button>
    );
  }
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 hover:text-brand">
        <UserIcon />
        <span className="hidden max-w-24 truncate text-xs font-semibold uppercase tracking-widest md:inline">
          {user.name.split(' ')[0]}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 w-44 border border-ink/10 bg-white py-2 text-sm shadow-lg">
          <Link to="/orders" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-paper">
            My Orders
          </Link>
          <button onClick={logout} className="block w-full px-4 py-2 text-left hover:bg-paper">
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 md:px-8">
        {/* Left: desktop nav with dropdowns / mobile menu button */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((group) => (
            <div key={group.label} className="group relative py-6">
              <NavLink
                to={group.to}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] hover:text-brand"
              >
                {group.label}
                <ChevronIcon dir="down" width="14" height="14" />
              </NavLink>
              <div className="invisible absolute left-0 top-full z-50 min-w-52 translate-y-1 border border-ink/10 bg-white py-3 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  to={group.to}
                  className="block px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-paper hover:text-brand"
                >
                  View All
                </Link>
                {group.links.map(([label, to]) => (
                  <Link
                    key={to}
                    to={to}
                    className="block px-5 py-2 text-xs font-medium uppercase tracking-widest hover:bg-paper hover:text-brand"
                  >
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

        {/* Center: logo */}
        <Logo className="text-2xl md:text-4xl" />

        {/* Right: account + cart */}
        <div className="flex items-center justify-end gap-5">
          <AccountButton />
          <button onClick={() => setOpen(true)} className="relative flex items-center gap-1.5 hover:text-brand" aria-label="Open cart">
            <BagIcon />
            <span className="hidden text-xs font-semibold uppercase tracking-widest md:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white md:static md:ml-0.5">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-fade-in absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-paper">
            <div className="flex items-center justify-between border-b border-ink/10 p-4">
              <Logo className="text-2xl" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {NAV.map((group) => (
                <details key={group.label} className="border-b border-ink/10 py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl uppercase">
                    {group.label}
                    <ChevronIcon dir="down" />
                  </summary>
                  <div className="mt-2 flex flex-col gap-2 pl-1">
                    <Link to={group.to} className="text-sm font-semibold uppercase tracking-widest">
                      View All
                    </Link>
                    {group.links.map(([label, to]) => (
                      <Link key={to} to={to} className="text-sm uppercase tracking-widest text-muted">
                        {label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
              <Link to="/orders" className="mt-4 block font-display text-2xl uppercase">
                My Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
