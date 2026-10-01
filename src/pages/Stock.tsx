import React, { useMemo, useState } from 'react';
import { AlertTriangleIcon, BoxesIcon, DownloadIcon, HistoryIcon, LayersIcon, PackageIcon, SearchIcon, SlidersHorizontalIcon, WalletIcon } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs';
import { useToast } from '../components/ToastProvider';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ProductThumb } from '../components/ProductThumb';
import { StatCard } from '../components/StatCard';
import { StockBadge } from '../components/StockBadge';
import { StockAdjustDialog } from '../components/stock/StockAdjustDialog';
import { usePos } from '../contexts/PosContext';
import { categories } from '../data/categories';
import type { StockLogType } from '../types/pos';
import { formatNumber, formatRupiah } from '../utils/currency';
import { formatDateTime } from '../utils/date';
import { exportStockExcel } from '../utils/export';
import { isLowStock } from '../utils/stock';

const logBadge: Record<StockLogType, {label: string;variant: 'success' | 'error' | 'warning';}> = {
  masuk: { label: 'Masuk', variant: 'success' },
  keluar: { label: 'Keluar', variant: 'error' },
  penyesuaian: { label: 'Penyesuaian', variant: 'warning' }
};

const th = 'px-4 py-3 text-left font-medium';
const thead = 'bg-gray-50 font-mono text-[11px] uppercase tracking-wider text-muted';

export function StockPage() {
  const { data, adjustStock } = usePos();
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustProductId, setAdjustProductId] = useState<string | null>(null);

  const lowStock = data.products.filter(isLowStock);
  const totalUnits = data.products.reduce((s, p) => s + p.stock, 0);
  const totalValue = data.products.reduce((s, p) => s + p.stock * p.price, 0);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...data.products].filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).sort((a, b) => a.stock - a.minStock - (b.stock - b.minStock));
  }, [data.products, query]);

  const byCategory = categories.map((c) => {
    const list = data.products.filter((p) => p.category === c);
    return {
      category: c,
      count: list.length,
      units: list.reduce((s, p) => s + p.stock, 0),
      value: list.reduce((s, p) => s + p.stock * p.price, 0),
      low: list.filter(isLowStock).length
    };
  });

  const openAdjust = (productId: string | null) => {
    setAdjustProductId(productId);
    setAdjustOpen(true);
  };

  const handleAdjust = (productId: string, type: StockLogType, qty: number, note: string) => {
    const result = adjustStock(productId, type, qty, note);
    if (result.ok) {
      addToast({ type: 'success', message: `Stok ${result.data.name} kini ${result.data.stock}.` });
      setAdjustOpen(false);
    }
    return result;
  };

  return (
    <div>
      <PageHeader
        eyebrow="Manajemen stok"
        title="Stok Produk"
        description="Pantau stok per produk dan kategori. Stok otomatis berkurang setiap transaksi selesai."
        actions={
        <>
            <Button variant="secondary" leftIcon={<DownloadIcon size={16} />} onClick={() => exportStockExcel(data.products)}>
              Export Excel
            </Button>
            <Button leftIcon={<SlidersHorizontalIcon size={16} />} onClick={() => openAdjust(null)}>
              Sesuaikan stok
            </Button>
          </>
        } />
      

      {lowStock.length > 0 &&
      <div role="status" className="mb-6 flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-amber-900">{lowStock.length} produk mencapai stok minimum</p>
              <p className="mt-0.5 text-xs text-amber-800">{lowStock.map((p) => `${p.name} (${p.stock})`).join(' · ')}</p>
            </div>
          </div>
        </div>
      }

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jumlah produk" value={formatNumber(data.products.length)} icon={<PackageIcon size={16} />} hint={`${categories.length} kategori`} />
        <StatCard label="Total unit" value={formatNumber(totalUnits)} icon={<BoxesIcon size={16} />} hint="Seluruh gudang/toko" />
        <StatCard label="Nilai stok" value={formatRupiah(totalValue)} icon={<WalletIcon size={16} />} hint="Berdasarkan harga jual" />
        <StatCard label="Menipis / habis" value={formatNumber(lowStock.length)} icon={<AlertTriangleIcon size={16} />} hint={`${data.products.filter((p) => p.stock === 0).length} produk habis`} />
      </div>

      <div className="mt-6 rounded-lg border border-line bg-surface p-4">
        <Tabs defaultTab="produk" variant="underlined">
          <TabList>
            <Tab id="produk" icon={<PackageIcon size={15} />}>
              Stok per produk
            </Tab>
            <Tab id="kategori" icon={<LayersIcon size={15} />}>
              Per kategori
            </Tab>
            <Tab id="riwayat" icon={<HistoryIcon size={15} />}>
              Riwayat perubahan
            </Tab>
          </TabList>

          <TabPanel id="produk">
            <div className="mt-4 max-w-md">
              <Input placeholder="Cari produk atau SKU…" value={query} onChange={(e) => setQuery(e.target.value)} startAdornment={<SearchIcon size={16} />} aria-label="Cari produk" />
            </div>
            <div className="mt-4 overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[720px] text-sm">
                <thead className={thead}>
                  <tr>
                    <th className={th}>Produk</th>
                    <th className={th}>Kategori</th>
                    <th className={`${th} text-right`}>Stok</th>
                    <th className={`${th} text-right`}>Minimum</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Nilai stok</th>
                    <th className={`${th} text-right`}>Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredProducts.map((p) =>
                  <tr key={p.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductThumb product={p} />
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="font-mono text-[11px] text-muted">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-accent">{p.category}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold">{p.stock}</td>
                      <td className="px-4 py-3 text-right font-mono text-muted">{p.minStock}</td>
                      <td className="px-4 py-3">
                        <StockBadge product={p} />
                      </td>
                      <td className="px-4 py-3 text-right">{formatRupiah(p.stock * p.price)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button size="small" variant="secondary" onClick={() => openAdjust(p.id)}>
                          Sesuaikan
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel id="kategori">
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {byCategory.map((c) => {
                const share = totalUnits ? Math.round(c.units / totalUnits * 100) : 0;
                return (
                  <div key={c.category} className="rounded-md border border-line p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{c.category}</p>
                      {c.low > 0 &&
                      <Badge variant="warning" size="small" style="bordered">
                          {c.low} menipis
                        </Badge>
                      }
                    </div>
                    <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
                      <div>
                        <dt className="text-muted">Produk</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-ink">{c.count}</dd>
                      </div>
                      <div>
                        <dt className="text-muted">Unit</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-ink">{c.units}</dd>
                      </div>
                      <div>
                        <dt className="text-muted">Porsi</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-ink">{share}%</dd>
                      </div>
                    </dl>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${share}%` }} />
                    </div>
                    <p className="mt-3 text-xs text-muted">Nilai stok {formatRupiah(c.value)}</p>
                  </div>);

              })}
            </div>
          </TabPanel>

          <TabPanel id="riwayat">
            {data.stockLogs.length === 0 ?
            <div className="mt-4">
                <EmptyState icon={HistoryIcon} title="Belum ada riwayat stok" />
              </div> :

            <div className="mt-4 overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className={thead}>
                    <tr>
                      <th className={th}>Waktu</th>
                      <th className={th}>Produk</th>
                      <th className={th}>Jenis</th>
                      <th className={`${th} text-right`}>Perubahan</th>
                      <th className={`${th} text-right`}>Stok akhir</th>
                      <th className={th}>Keterangan</th>
                      <th className={th}>Oleh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {data.stockLogs.map((log) =>
                  <tr key={log.id}>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">{formatDateTime(log.date)}</td>
                        <td className="px-4 py-3 font-medium">{log.productName}</td>
                        <td className="px-4 py-3">
                          <Badge variant={logBadge[log.type].variant} size="small" style="bordered">
                            {logBadge[log.type].label}
                          </Badge>
                        </td>
                        <td className={`px-4 py-3 text-right font-mono font-semibold ${log.qty > 0 ? 'text-green-700' : 'text-red-600'}`}>
                          {log.qty > 0 ? `+${log.qty}` : log.qty}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">{log.stockAfter}</td>
                        <td className="px-4 py-3 text-xs text-accent">{log.note}</td>
                        <td className="px-4 py-3 text-xs text-muted">{log.by}</td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            }
          </TabPanel>
        </Tabs>
      </div>

      <StockAdjustDialog open={adjustOpen} products={data.products} initialProductId={adjustProductId} onClose={() => setAdjustOpen(false)} onSubmit={handleAdjust} />
    </div>);

}