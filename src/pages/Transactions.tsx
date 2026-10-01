import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, PrinterIcon, ReceiptTextIcon, RotateCcwIcon, SearchIcon } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ReceiptDialog } from '../components/ReceiptDialog';
import { usePos } from '../contexts/PosContext';
import { paymentMethodLabel } from '../data/paymentMethods';
import type { Transaction } from '../types/pos';
import { formatRupiah } from '../utils/currency';
import { formatDate, formatTime, fromInputDate } from '../utils/date';
import { printReceipt } from '../utils/print';
import { filterByRange, sortByNewest, sumTotal } from '../utils/sales';

const PAGE_SIZE = 10;

export function TransactionsPage() {
  const { data, currentUser } = usePos();
  const isAdmin = currentUser?.role === 'admin';
  const [query, setQuery] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [method, setMethod] = useState('semua');
  const [cashier, setCashier] = useState('semua');
  const [resetKey, setResetKey] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const base = useMemo(
    () => isAdmin ? data.transactions : data.transactions.filter((t) => t.cashierId === currentUser?.id),
    [data.transactions, isAdmin, currentUser?.id]
  );

  const filtered = useMemo(() => {
    let list = base;
    if (start || end) {
      list = filterByRange(list, start ? fromInputDate(start) : new Date(2000, 0, 1), end ? fromInputDate(end) : new Date(2100, 0, 1));
    }
    const q = query.trim().toLowerCase();
    return sortByNewest(
      list.filter(
        (t) =>
        (!q || t.id.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q) || t.items.some((i) => i.name.toLowerCase().includes(q))) && (
        method === 'semua' || t.method === method) && (
        cashier === 'semua' || t.cashierId === cashier)
      )
    );
  }, [base, query, start, end, method, cashier]);

  useEffect(() => setPage(1), [query, start, end, method, cashier]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilter = query || start || end || method !== 'semua' || cashier !== 'semua';
  const cashiers = data.users.filter((u) => u.role === 'kasir');

  const resetFilters = () => {
    setQuery('');
    setStart('');
    setEnd('');
    setMethod('semua');
    setCashier('semua');
    setResetKey((k) => k + 1);
  };

  return (
    <div>
      <PageHeader
        eyebrow={isAdmin ? 'KF4 · Riwayat semua transaksi' : 'KF7 · Riwayat transaksi saya'}
        title="Riwayat Transaksi"
        description={isAdmin ? 'Telusuri seluruh transaksi, lihat detail pembeli dan barang, serta cetak ulang struk.' : 'Transaksi yang telah Anda proses. Cetak ulang struk bila diminta pelanggan.'} />
      

      <div className="rounded-lg border border-line bg-surface">
        <div className={`grid gap-3 border-b border-line p-4 md:grid-cols-2 ${isAdmin ? 'xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]' : 'xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto]'} xl:items-end`}>
          <Input label="Cari" placeholder="No. transaksi, pembeli, atau produk" value={query} onChange={(e) => setQuery(e.target.value)} startAdornment={<SearchIcon size={16} />} />
          <Input type="date" label="Dari tanggal" value={start} max={end || undefined} onChange={(e) => setStart(e.target.value)} />
          <Input type="date" label="Sampai tanggal" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} />
          <Select
            key={`method-${resetKey}`}
            label="Metode"
            options={[
            { value: 'semua', label: 'Semua metode' },
            { value: 'cash', label: 'Tunai' },
            { value: 'transfer', label: 'Transfer' }]
            }
            value={method}
            onChange={(v) => setMethod(v as string)} />
          
          {isAdmin &&
          <Select
            key={`cashier-${resetKey}`}
            label="Kasir"
            options={[{ value: 'semua', label: 'Semua kasir' }, ...cashiers.map((c) => ({ value: c.id, label: c.name }))]}
            value={cashier}
            onChange={(v) => setCashier(v as string)} />

          }
          <Button variant="tertiary" leftIcon={<RotateCcwIcon size={15} />} onClick={resetFilters} disabled={!hasFilter}>
            Reset
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-gray-50 px-4 py-2.5 font-mono text-[11px] text-muted">
          <span>{filtered.length} transaksi ditemukan</span>
          <span>Total {formatRupiah(sumTotal(filtered))}</span>
        </div>

        {visible.length === 0 ?
        <div className="p-6">
            <EmptyState
            icon={ReceiptTextIcon}
            title={base.length === 0 ? 'Belum ada transaksi' : 'Transaksi tidak ditemukan'}
            description={base.length === 0 ? 'Transaksi yang diproses akan tercatat di sini.' : 'Periksa nomor transaksi atau ubah filter.'}
            action={hasFilter ? <Button variant="secondary" onClick={resetFilters}>Reset filter</Button> : undefined} />
          
          </div> :

        <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="font-mono text-[11px] uppercase tracking-wider text-muted">
                <tr className="border-b border-line">
                  <th className="px-4 py-3 text-left font-medium">No. Transaksi</th>
                  <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                  <th className="px-4 py-3 text-left font-medium">Jam</th>
                  <th className="px-4 py-3 text-left font-medium">Pembeli</th>
                  <th className="px-4 py-3 text-left font-medium">Barang terjual</th>
                  {isAdmin && <th className="px-4 py-3 text-left font-medium">Kasir</th>}
                  <th className="px-4 py-3 text-left font-medium">Metode</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((t) => {
                const qty = t.items.reduce((s, i) => s + i.qty, 0);
                return (
                  <tr key={t.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 font-mono text-xs font-semibold">{t.id}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatDate(t.date)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted">{formatTime(t.date)}</td>
                      <td className="px-4 py-3">{t.customerName}</td>
                      <td className="max-w-[240px] px-4 py-3">
                        <p className="truncate text-xs text-accent" title={t.items.map((i) => `${i.name} x${i.qty}`).join(', ')}>
                          {t.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}
                        </p>
                        <p className="font-mono text-[11px] text-muted">{qty} item</p>
                      </td>
                      {isAdmin && <td className="px-4 py-3 text-xs text-accent">{t.cashierName}</td>}
                      <td className="px-4 py-3">
                        <Badge variant="secondary" size="small" style="bordered">
                          {paymentMethodLabel[t.method]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{formatRupiah(t.total)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button size="small" variant="tertiary" iconOnly={<EyeIcon size={15} />} aria-label={`Lihat detail ${t.id}`} onClick={() => setSelected(t)} />
                          <Button size="small" variant="tertiary" iconOnly={<PrinterIcon size={15} />} aria-label={`Cetak ulang struk ${t.id}`} onClick={() => printReceipt(t)} />
                        </div>
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }

        {filtered.length > PAGE_SIZE &&
        <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <span className="font-mono text-[11px] text-muted">
              Halaman {page} dari {pageCount}
            </span>
            <div className="flex gap-2">
              <Button size="small" variant="secondary" iconOnly={<ChevronLeftIcon size={15} />} aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage((p) => p - 1)} />
              <Button size="small" variant="secondary" iconOnly={<ChevronRightIcon size={15} />} aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)} />
            </div>
          </div>
        }
      </div>

      <ReceiptDialog transaction={selected} onClose={() => setSelected(null)} title="Detail Transaksi" />
    </div>);

}