import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOutIcon, MenuIcon, StoreIcon, XIcon } from 'lucide-react';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { useToast } from '../ToastProvider';
import { usePos } from '../../contexts/PosContext';
import { navItems } from '../../data/navigation';
import { useIdleTimeout } from '../../hooks/useIdleTimeout';
import { formatLongDate } from '../../utils/date';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function AppLayout() {
  const { currentUser, logout } = usePos();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useIdleTimeout(SESSION_TIMEOUT_MS, () => {
    logout();
    addToast({ type: 'warning', message: 'Sesi berakhir karena tidak ada aktivitas selama 30 menit.' });
    navigate('/login', { replace: true });
  });

  if (!currentUser) return null;
  const items = navItems.filter((item) => item.roles.includes(currentUser.role));
  const active = items.find((item) => item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to));

  const handleLogout = () => {
    logout();
    addToast({ type: 'info', message: 'Anda telah keluar dari sistem.' });
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-canvas text-ink">
      {mobileOpen && <div className="fixed inset-0 z-30 bg-gray-900/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
        }
        aria-label="Navigasi utama">
        
        <div className="flex h-16 items-center justify-between gap-3 border-b border-line px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink text-ink">
              <StoreIcon size={18} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">Qashya Collection</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Point of Sales</p>
            </div>
          </div>
          <button type="button" className="rounded-md p-1.5 text-muted hover:bg-gray-100 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
            <XIcon size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-wider text-muted">Menu {currentUser.role === 'admin' ? 'Admin' : 'Kasir'}</p>
          <ul className="space-y-1">
            {items.map(({ to, label, icon: Icon }) =>
            <li key={to}>
                <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-ink font-semibold text-white' : 'text-accent hover:bg-gray-100 hover:text-ink'}`

                }>
                
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <Avatar name={currentUser.name} alt={currentUser.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{currentUser.name}</p>
              <p className="font-mono text-[11px] text-muted">@{currentUser.username}</p>
            </div>
            <button type="button" onClick={handleLogout} className="rounded-md p-2 text-muted hover:bg-gray-100 hover:text-ink" aria-label="Keluar">
              <LogOutIcon size={17} />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-line bg-surface px-4 md:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="rounded-md border border-line p-2 text-accent lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
              <MenuIcon size={18} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{active?.label ?? 'Qashya POS'}</p>
              <p className="hidden font-mono text-[11px] text-muted sm:block">{formatLongDate(new Date())}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" size="small" style="bordered">
              {currentUser.role === 'admin' ? 'Admin' : 'Kasir'}
            </Badge>
            <button type="button" onClick={handleLogout} className="hidden items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm text-accent hover:bg-gray-50 md:flex">
              <LogOutIcon size={15} aria-hidden="true" />
              Keluar
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>);

}