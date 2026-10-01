import React, { useMemo, useState } from 'react';
import { differenceInCalendarDays, subDays } from 'date-fns';
import { BarChart3Icon, FileSpreadsheetIcon, FileTextIcon, ReceiptTextIcon, ShoppingBagIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/ToastProvider';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Panel } from '../components/Panel';
import { SalesTrendChart } from '../components/SalesTrendChart';
import { StatCard } from '../components/StatCard';
import { usePos } from '../contexts/PosContext';
import { paymentMethodLabel } from '../data/paymentMethods';
import type { ReportPeriod } from '../types/report';
import { formatNumber, formatRupiah } from '../utils/currency';
import { toInputDate } from '../utils/date';
import { exportSalesExcel, exportSalesPdf } from '../utils/export';
import { getReportRange } from '../utils/reportPeriod';
import { buildSalesReport, filterByRange, sumTotal } from '../utils/sales';

const periods: {value: ReportPeriod;label: string;}[] = [
{ value: 'harian', label: 'Harian' },
{ value: 'mingguan', label: 'Mingguan' },
{ value: 'bulanan', label: 'Bulanan' },
{ value: 'kustom', label: 'Rentang tanggal' }];


export function ReportsPage() {
  const { data } = usePos();
  const { addToast } = useToast();
  const [period, setPeriod] = useState<ReportPeriod>('mingguan');
  const [customStart, setCustomStart] = useState(toInputDate(subDays(new Date(), 13)));
  const [customEnd, setCustomEnd] = useState(toInputDate(new Date()));

  const range = useMemo(() => getReportRange(period, customStart, customEnd), [period, customStart, customEnd]);
  const report = useMemo(() => buildSalesReport(data.transactions, range.start, range.end, range.label), [data.transactions, range]);

  const days = differenceInCalendarDays(range.end, range.start) + 1;
  const prevTotal = sumTotal(filterByRange(data.transactions, subDays(range.start, days), subDays(range.start, 1)));
  const growth = prevTotal ? Math.round((report.total - prevTotal) / prevTotal * 100) : null;
  const maxCategory = Math.max(1, ...report.categories.map((c) => c.revenue));
  const bestDay = report.daily.reduce((best, d) => d.total > best.total ? d : best, report.daily[0]);

  const handleExport = (kind: 'pdf' | 'excel') => {
    if (report.count === 0) {
      addToast({ type: 'warning', message: 'Tidak ada transaksi pada periode ini untuk diekspor.' });
      return;
    }
    try {
      if (kind === 'pdf') exportSalesPdf(report);else
      exportSalesExcel(report);
      addToast({ type: 'success', message: `Laporan ${kind === 'pdf' ? 'PDF' : 'Excel'} berhasil diunduh.` });
    } catch {
      addToast({ type: 'error', message: 'Gagal membuat file laporan. Coba lagi.' });
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="KF3 · Laporan penjualan"
        title="Laporan Penjualan"
        description="Rekap penjualan otomatis per periode, lengkap dengan rincian produk dan analisis tren."
        actions={
        <>
            <Button variant="secondary" leftIcon={<FileSpreadsheetIcon size={16} />} onClick={() => handleExport('excel')}>
              Export Excel
            </Button>
            <Button leftIcon={<FileTextIcon size={16} />} onClick={() => handleExport('pdf')}>
              Export PDF
            </Button>
          </>
        } />
      

      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1.5 text-sm font-medium">Periode</p>
          <div className="inline-flex flex-wrap rounded-md border border-line p-1" role="radiogroup" aria-label="Periode laporan">
            {periods.map((p) =>
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={period === p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${period === p.value ? 'bg-ink text-white' : 'text-accent hover:bg-gray-100'}`}>
              
                {p.label}
              </button>
            )}
          </div>
        </div>
        {period === 'kustom' ?
        <div className="grid grid-cols-2 gap-3 sm:w-[380px]">
            <Input id="r-start" type="date" size="small" label="Dari tanggal" value={customStart} max={customEnd} onChange={(e) => setCustomStart(e.target.value)} />
            <Input id="r-end" type="date" size="small" label="Sampai tanggal" value={customEnd} min={customStart} onChange={(e) => setCustomEnd(e.target.value)} />
          </div> :

        <p className="font-mono text-xs text-muted">{range.label}</p>
        }
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total penjualan"
          value={formatRupiah(report.total)}
          icon={<WalletIcon size={16} />}
          hint={
          growth === null ?
          'Tidak ada data periode sebelumnya' :

          <span className="inline-flex items-center gap-1">
                {growth >= 0 ? <TrendingUpIcon size={13} /> : <TrendingDownIcon size={13} />}
                {growth >= 0 ? '+' : ''}
                {growth}% vs periode sebelumnya
              </span>

          } />
        
        <StatCard label="Jumlah transaksi" value={formatNumber(report.count)} icon={<ReceiptTextIcon size={16} />} hint={`${days} hari`} />
        <StatCard label="Item terjual" value={formatNumber(report.items)} icon={<ShoppingBagIcon size={16} />} hint={`${report.products.length} produk berbeda`} />
        <StatCard label="Rata-rata transaksi" value={formatRupiah(report.average)} icon={<BarChart3Icon size={16} />} hint="Nilai per struk" />
      </div>

      {report.count === 0 ?
      <div className="mt-6 rounded-lg border border-line bg-surface p-6">
          <EmptyState icon={BarChart3Icon} title="Belum ada penjualan pada periode ini" description="Pilih periode lain atau ubah rentang tanggal." />
        </div> :

      <>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Panel className="xl:col-span-2" title="Tren penjualan" description={bestDay && bestDay.total > 0 ? `Penjualan tertinggi: ${bestDay.label} (${formatRupiah(bestDay.total)})` : undefined}>
              <SalesTrendChart data={report.daily} height={280} />
            </Panel>
            <div className="space-y-6">
              <Panel title="Per kategori">
                <ul className="space-y-3">
                  {report.categories.map((c) =>
                <li key={c.category}>
                      <div className="flex justify-between text-sm">
                        <span>{c.category}</span>
                        <span className="font-mono text-xs text-muted">{formatRupiah(c.revenue)}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${c.revenue / maxCategory * 100}%` }} />
                      </div>
                    </li>
                )}
                </ul>
              </Panel>
              <Panel title="Metode pembayaran">
                <div className="grid grid-cols-2 gap-3">
                  {report.methods.map((m) =>
                <div key={m.method} className="rounded-md border border-dashed border-gray-300 p-3">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{paymentMethodLabel[m.method]}</p>
                      <p className="mt-1 text-sm font-bold">{formatRupiah(m.total)}</p>
                      <p className="text-xs text-muted">{m.count} transaksi</p>
                    </div>
                )}
                </div>
              </Panel>
            </div>
          </div>

          <Panel className="mt-6" title="Rincian produk terjual" description="Diurutkan berdasarkan pendapatan" bodyClassName="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-gray-50 font-mono text-[11px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Produk</th>
                  <th className="px-4 py-3 text-left font-medium">Kategori</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Pendapatan</th>
                  <th className="px-4 py-3 text-left font-medium">Kontribusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {report.products.map((p, i) => {
                const share = Math.round(p.revenue / report.total * 100);
                return (
                  <tr key={p.productId}>
                      <td className="px-4 py-3 font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-accent">{p.category}</td>
                      <td className="px-4 py-3 text-right font-mono">{p.qty}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatRupiah(p.revenue)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-accent" style={{ width: `${share}%` }} />
                          </div>
                          <span className="font-mono text-xs text-muted">{share}%</span>
                        </div>
                      </td>
                    </tr>);

              })}
              </tbody>
              <tfoot className="border-t border-line bg-gray-50 font-semibold">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{report.items}</td>
                  <td className="px-4 py-3 text-right">{formatRupiah(report.total)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </Panel>
        </>
      }
    </div>);

}