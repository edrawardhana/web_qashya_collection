import React, { useMemo, useState } from 'react';
import { EyeIcon, PackageIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useToast } from '../components/ToastProvider';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ProductThumb } from '../components/ProductThumb';
import { StockBadge } from '../components/StockBadge';
import { ProductFormDialog } from '../components/products/ProductFormDialog';
import { usePos } from '../contexts/PosContext';
import { categories } from '../data/categories';
import type { Product, ProductInput } from '../types/pos';
import { formatRupiah } from '../utils/currency';
import { getStockStatus } from '../utils/stock';
import type { StockStatus } from '../utils/stock';

type StockFilter = 'semua' | StockStatus;

export function ProductsPage() {
  const { data, currentUser, addProduct, updateProduct, deleteProduct } = usePos();
  const { addToast } = useToast();
  const isAdmin = currentUser?.role === 'admin';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('semua');
  const [stockFilter, setStockFilter] = useState<StockFilter>('semua');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.products.filter((p) => {
      const matchQuery = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchCategory = category === 'semua' || p.category === category;
      const matchStock = stockFilter === 'semua' || getStockStatus(p) === stockFilter;
      return matchQuery && matchCategory && matchStock;
    });
  }, [data.products, query, category, stockFilter]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleSubmit = (input: ProductInput) => {
    const result = editing ? updateProduct(editing.id, input) : addProduct(input);
    if (result.ok) {
      addToast({ type: 'success', message: editing ? `Produk "${input.name}" diperbarui.` : `Produk "${input.name}" ditambahkan.` });
      setFormOpen(false);
      setEditing(null);
    }
    return result;
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteProduct(deleting.id);
    addToast({ type: 'success', message: `Produk "${deleting.name}" dihapus.` });
    setDeleting(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow={isAdmin ? 'KF1 · Kelola data produk' : 'KF6 · Lihat data produk'}
        title="Produk"
        description={isAdmin ? 'Tambah, ubah, dan hapus produk beserta harga, kategori, dan stok.' : 'Informasi harga dan stok sebagai referensi saat melayani pelanggan.'}
        actions={
        isAdmin &&
        <Button leftIcon={<PlusIcon size={16} />} onClick={openCreate}>
              Tambah produk
            </Button>

        } />
      

      {!isAdmin &&
      <div className="mb-4 flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-surface px-4 py-3 text-sm text-muted">
          <EyeIcon size={16} aria-hidden="true" /> Mode lihat saja — perubahan data produk hanya dapat dilakukan oleh admin.
        </div>
      }

      <div className="rounded-lg border border-line bg-surface">
        <div className="grid gap-3 border-b border-line p-4 md:grid-cols-[1fr_200px_200px]">
          <Input placeholder="Cari nama, SKU, atau deskripsi…" value={query} onChange={(e) => setQuery(e.target.value)} startAdornment={<SearchIcon size={16} />} aria-label="Cari produk" />
          <Select
            options={[{ value: 'semua', label: 'Semua kategori' }, ...categories.map((c) => ({ value: c, label: c }))]}
            value={category}
            onChange={(v) => setCategory(v as string)} />
          
          <Select
            options={[
            { value: 'semua', label: 'Semua status stok' },
            { value: 'aman', label: 'Stok aman' },
            { value: 'menipis', label: 'Stok menipis' },
            { value: 'habis', label: 'Stok habis' }]
            }
            value={stockFilter}
            onChange={(v) => setStockFilter(v as StockFilter)} />
          
        </div>

        {filtered.length === 0 ?
        <div className="p-6">
            <EmptyState
            icon={PackageIcon}
            title={data.products.length === 0 ? 'Belum ada produk' : 'Produk tidak ditemukan'}
            description={data.products.length === 0 ? 'Tambahkan produk pertama untuk mulai berjualan.' : 'Coba ubah kata kunci atau filter.'}
            action={isAdmin && data.products.length === 0 ? <Button onClick={openCreate}>Tambah produk</Button> : undefined} />
          
          </div> :

        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 font-mono text-[11px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Produk</th>
                  <th className="px-4 py-3 text-left font-medium">Kategori</th>
                  <th className="px-4 py-3 text-right font-medium">Harga</th>
                  <th className="px-4 py-3 text-left font-medium">Stok</th>
                  <th className="hidden px-4 py-3 text-left font-medium xl:table-cell">Deskripsi</th>
                  {isAdmin && <th className="px-4 py-3 text-right font-medium">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((p) =>
              <tr key={p.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductThumb product={p} />
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{p.name}</p>
                          <p className="font-mono text-[11px] text-muted">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-accent">{p.category}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatRupiah(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 font-mono">{p.stock}</span>
                        <StockBadge product={p} />
                      </div>
                    </td>
                    <td className="hidden max-w-xs px-4 py-3 text-xs text-muted xl:table-cell">
                      <p className="line-clamp-2">{p.description || '—'}</p>
                    </td>
                    {isAdmin &&
                <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                      size="small"
                      variant="tertiary"
                      iconOnly={<PencilIcon size={15} />}
                      aria-label={`Edit ${p.name}`}
                      onClick={() => {
                        setEditing(p);
                        setFormOpen(true);
                      }} />
                    
                          <Button size="small" variant="tertiary" iconOnly={<Trash2Icon size={15} />} aria-label={`Hapus ${p.name}`} onClick={() => setDeleting(p)} />
                        </div>
                      </td>
                }
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
        <div className="border-t border-line px-4 py-3 font-mono text-[11px] text-muted">
          Menampilkan {filtered.length} dari {data.products.length} produk
        </div>
      </div>

      {isAdmin &&
      <>
          <ProductFormDialog
          open={formOpen}
          product={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit} />
        
          <ConfirmDialog
          open={deleting !== null}
          title="Hapus produk?"
          description={
          <>
                Produk <strong className="text-ink">{deleting?.name}</strong> akan dihapus dari daftar. Riwayat transaksi yang sudah tercatat tetap tersimpan.
              </>
          }
          confirmLabel="Hapus"
          destructive
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)} />
        
        </>
      }
    </div>);

}