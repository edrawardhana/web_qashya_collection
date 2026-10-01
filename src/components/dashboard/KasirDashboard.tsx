import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PackageSearchIcon, ReceiptTextIcon, ShoppingBagIcon, ShoppingCartIcon, WalletIcon } from 'lucide-react';
import { PageHeader } from '../PageHeader';
import { Panel } from '../Panel';
import { StatCard } from '../StatCard';
import { ReceiptDialog } from '../ReceiptDialog';
import { LowStockList } from './LowStockList';
import { RecentTransactions } from './RecentTransactions';
import { usePos } from '../../contexts/PosContext';
import type { Transaction } from '../../types/pos';
import { formatNumber, formatRupiah } from '../../utils/currency';
import { formatLongDate } from '../../utils/date';
import { countItems, filterByRange, sortByNewest, sumTotal } from '../../utils/sales';
import { isLowStock } from '../../utils/stock';

export function KasirDashboard() {
  const { data, currentUser } = usePos();
  const [selected, setSelected] = useState<Transaction | null>(null);
  const today = new Date();
  const mine = data.transactions.filter((t) => t.cashierId === currentUser?.id);
  const myToday = filterByRange(mine, today, today);
  const recent = sortByNewest(mine).slice(0, 6);
  const lowStock = data.products.filter(isLowStock).sort((a, b) => a.stock - b.stock);

  return (
    <div>
      <PageHeader eyebrow={formatLongDate(today)} title={`Selamat bertugas, ${currentUser?.name.split(' ')[0]}`} description="Ringkasan transaksi Anda hari ini." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Link
          to="/transaksi"
          className="group flex flex-col justify-between rounded-lg border-2 border-ink bg-ink p-6 text-white transition-colors hover:bg-gray-800 lg:row-span-2">
          
          <ShoppingCartIcon size={28} aria-hidden="true" />
          <div className="mt-10">
            <p className="font-mono text-xs uppercase tracking-wider text-gray-300">Aksi utama</p>
            <p className="mt-1 text-2xl font-bold">Mulai transaksi baru</p>
            <p className="mt-2 flex items-center gap-1 text-sm text-gray-300">
              Buka layar kasir <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
            </p>
          </div>
        </Link>
        <StatCard label="Penjualan saya hari ini" value={formatRupiah(sumTotal(myToday))} icon={<WalletIcon size={16} />} />
        <StatCard label="Transaksi hari ini" value={formatNumber(myToday.length)} icon={<ReceiptTextIcon size={16} />} />
        <StatCard label="Item terjual" value={formatNumber(countItems(myToday))} icon={<ShoppingBagIcon size={16} />} />
        <Link to="/produk" className="flex items-center justify-between rounded-lg border border-dashed border-gray-300 bg-surface p-5 hover:border-gray-400">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Referensi</p>
            <p className="mt-1 text-sm font-semibold">Cek harga & stok produk</p>
          </div>
          <PackageSearchIcon size={20} className="text-accent" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Transaksi terakhir saya"
          bodyClassName=""
          actions={
          <Link to="/riwayat" className="flex items-center gap-1 text-xs font-medium text-accent hover:text-ink">
              Semua riwayat <ArrowRightIcon size={14} />
            </Link>
          }>
          
          <RecentTransactions transactions={recent} onSelect={setSelected} />
        </Panel>
        <Panel title="Info stok" description="Produk hampir habis — informasikan ke admin" bodyClassName="max-h-[360px] overflow-y-auto">
          <LowStockList products={lowStock} />
        </Panel>
      </div>

      <ReceiptDialog transaction={selected} onClose={() => setSelected(null)} title="Detail Transaksi" />
    </div>);

}