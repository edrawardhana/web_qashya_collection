import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { subDays } from 'date-fns';
import { AlertTriangleIcon, ArrowRightIcon, BarChart3Icon, BoxesIcon, PackageIcon, ReceiptTextIcon, ShoppingBagIcon, UsersIcon, WalletIcon } from 'lucide-react';
import { PageHeader } from '../PageHeader';
import { Panel } from '../Panel';
import { StatCard } from '../StatCard';
import { SalesTrendChart } from '../SalesTrendChart';
import { ReceiptDialog } from '../ReceiptDialog';
import { LowStockList } from './LowStockList';
import { RecentTransactions } from './RecentTransactions';
import { usePos } from '../../contexts/PosContext';
import type { Transaction } from '../../types/pos';
import { formatNumber, formatRupiah } from '../../utils/currency';
import { formatLongDate } from '../../utils/date';
import { countItems, filterByRange, productBreakdown, salesByDay, sortByNewest, sumTotal } from '../../utils/sales';
import { isLowStock } from '../../utils/stock';

const quickLinks = [
{ to: '/produk', label: 'Kelola Produk', icon: PackageIcon },
{ to: '/stok', label: 'Manajemen Stok', icon: BoxesIcon },
{ to: '/laporan', label: 'Laporan Penjualan', icon: BarChart3Icon },
{ to: '/pengguna', label: 'Kelola Pengguna', icon: UsersIcon }];


export function AdminDashboard() {
  const { data, currentUser } = usePos();
  const [selected, setSelected] = useState<Transaction | null>(null);
  const today = new Date();
  const todayTrx = filterByRange(data.transactions, today, today);
  const yesterdayTotal = sumTotal(filterByRange(data.transactions, subDays(today, 1), subDays(today, 1)));
  const todayTotal = sumTotal(todayTrx);
  const diff = yesterdayTotal ? Math.round((todayTotal - yesterdayTotal) / yesterdayTotal * 100) : null;
  const weekStart = subDays(today, 6);
  const trend = salesByDay(data.transactions, weekStart, today);
  const topProducts = productBreakdown(filterByRange(data.transactions, weekStart, today)).slice(0, 5);
  const lowStock = data.products.filter(isLowStock).sort((a, b) => a.stock - b.stock);
  const recent = sortByNewest(data.transactions).slice(0, 6);

  return (
    <div>
      <PageHeader eyebrow={formatLongDate(today)} title={`Halo, ${currentUser?.name.split(' ')[0]}`} description="Ringkasan penjualan dan kondisi toko hari ini." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Penjualan hari ini"
          value={formatRupiah(todayTotal)}
          icon={<WalletIcon size={16} />}
          hint={diff === null ? 'Belum ada data kemarin' : `${diff >= 0 ? '+' : ''}${diff}% dibanding kemarin`} />
        
        <StatCard label="Transaksi hari ini" value={formatNumber(todayTrx.length)} icon={<ReceiptTextIcon size={16} />} hint="Seluruh kasir" />
        <StatCard label="Item terjual" value={formatNumber(countItems(todayTrx))} icon={<ShoppingBagIcon size={16} />} hint="Hari ini" />
        <StatCard
          label="Stok menipis"
          value={formatNumber(lowStock.length)}
          icon={<AlertTriangleIcon size={16} />}
          hint={<Link to="/stok" className="underline underline-offset-2 hover:text-ink">Lihat manajemen stok</Link>} />
        
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Tren penjualan 7 hari"
          description="Total penjualan per hari"
          actions={
          <Link to="/laporan" className="flex items-center gap-1 text-xs font-medium text-accent hover:text-ink">
              Laporan lengkap <ArrowRightIcon size={14} />
            </Link>
          }>
          
          <SalesTrendChart data={trend} />
        </Panel>
        <Panel title="Peringatan stok" description="Produk di bawah stok minimum" bodyClassName="max-h-[330px] overflow-y-auto">
          <div className="p-0">
            <LowStockList products={lowStock} />
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Transaksi terbaru"
          bodyClassName=""
          actions={
          <Link to="/riwayat" className="flex items-center gap-1 text-xs font-medium text-accent hover:text-ink">
              Semua riwayat <ArrowRightIcon size={14} />
            </Link>
          }>
          
          <RecentTransactions transactions={recent} onSelect={setSelected} />
        </Panel>
        <div className="space-y-6">
          <Panel title="Akses cepat">
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(({ to, label, icon: Icon }) =>
              <Link key={to} to={to} className="flex flex-col gap-2 rounded-md border border-dashed border-gray-300 p-3 text-sm font-medium text-accent hover:border-gray-400 hover:text-ink">
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </Link>
              )}
            </div>
          </Panel>
          <Panel title="Produk terlaris" description="7 hari terakhir">
            <ol className="space-y-3">
              {topProducts.map((p, i) =>
              <li key={p.productId} className="flex items-center gap-3 text-sm">
                  <span className="w-5 font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  <span className="font-mono text-xs text-muted">{p.qty} pcs</span>
                </li>
              )}
              {topProducts.length === 0 && <li className="text-sm text-muted">Belum ada penjualan.</li>}
            </ol>
          </Panel>
        </div>
      </div>

      <ReceiptDialog transaction={selected} onClose={() => setSelected(null)} title="Detail Transaksi" />
    </div>);

}