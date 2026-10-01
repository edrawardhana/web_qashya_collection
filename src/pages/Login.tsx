import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, LockIcon, StoreIcon, UserIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { usePos } from '../contexts/PosContext';

const demoAccounts = [
{ role: 'Admin', username: 'admin', password: 'admin123' },
{ role: 'Kasir', username: 'kasir', password: 'kasir123' }];


const highlights = ['Transaksi penjualan real-time', 'Stok otomatis & notifikasi minimum', 'Laporan harian, mingguan, bulanan', 'Hak akses Admin & Kasir'];

export function LoginPage() {
  const { login, currentUser } = usePos();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{username?: string;password?: string;}>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (currentUser && !loading) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {username?: string;password?: string;} = {};
    if (!username.trim()) errors.username = 'Username wajib diisi.';
    if (!password) errors.password = 'Password wajib diisi.';
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length) return;
    setLoading(true);
    window.setTimeout(() => {
      const result = login(username, password);
      setLoading(false);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      navigate('/', { replace: true });
    }, 400);
  };

  return (
    <div className="grid min-h-screen w-full bg-canvas lg:grid-cols-2">
      <section className="hidden flex-col justify-between border-r border-line bg-surface p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink">
            <StoreIcon size={20} />
          </span>
          <div>
            <p className="font-bold">Qashya Collection</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Point of Sales</p>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Sistem POS berbasis web</p>
          <h1 className="mt-3 text-5xl font-extrabold leading-tight tracking-tight text-ink">
            Kelola penjualan,
            <br />
            stok & laporan
            <br />
            dalam satu tempat.
          </h1>
          <ul className="mt-10 grid grid-cols-2 gap-3">
            {highlights.map((h) =>
            <li key={h} className="rounded-md border border-dashed border-gray-300 p-4 font-mono text-xs text-accent">
                {h}
              </li>
            )}
          </ul>
        </div>
        <p className="font-mono text-xs text-muted">© 2026 Qashya Collection</p>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink">
              <StoreIcon size={20} />
            </span>
            <p className="font-bold">Qashya Collection POS</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-8">
            <h2 className="text-2xl font-bold tracking-tight">Masuk ke akun</h2>
            <p className="mt-1 text-sm text-muted">Gunakan username dan password yang diberikan admin.</p>

            {formError &&
            <div role="alert" className="mt-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />
                {formError}
              </div>
            }

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <Input
                id="username"
                label="Username"
                placeholder="mis. kasir"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={fieldErrors.username}
                startAdornment={<UserIcon size={16} />} />
              
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                startAdornment={<LockIcon size={16} />} />
              
              <Button type="submit" size="large" loading={loading} className="w-full">
                Masuk
              </Button>
            </form>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Akun demo</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {demoAccounts.map((a) =>
              <button
                key={a.username}
                type="button"
                onClick={() => {
                  setUsername(a.username);
                  setPassword(a.password);
                  setFieldErrors({});
                  setFormError(null);
                }}
                className="rounded-md border border-line bg-surface px-3 py-2 text-left hover:border-gray-400">
                
                  <p className="text-sm font-semibold">{a.role}</p>
                  <p className="font-mono text-[11px] text-muted">
                    {a.username} / {a.password}
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>);

}