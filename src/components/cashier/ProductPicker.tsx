import React, { useMemo, useState } from 'react';
import { PackageSearchIcon, ScanLineIcon, SearchIcon } from 'lucide-react';
import { Input } from '../Input';
import { EmptyState } from '../EmptyState';
import { ProductThumb } from '../ProductThumb';
import { categories } from '../../data/categories';
import type { CartItem, Product } from '../../types/pos';
import { formatRupiah } from '../../utils/currency';
import { getStockStatus } from '../../utils/stock';

const SEARCH_ID = 'pos-product-search';

interface ProductPickerProps {
  products: Product[];
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
}

export function ProductPicker({ products, cartItems, onAdd }: ProductPickerProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => (category === 'Semua' || p.category === category) && (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)));
  }, [products, query, category]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const q = query.trim().toLowerCase();
    const exact = products.find((p) => p.sku.toLowerCase() === q);
    const target = exact ?? filtered.find((p) => p.stock > 0);
    if (target) {
      onAdd(target);
      setQuery('');
    }
  };

  return (
    <section aria-label="Pilih produk" className="min-w-0">
      <Input
        id={SEARCH_ID}
        autoFocus
        size="large"
        placeholder="Cari produk atau ketik SKU lalu tekan Enter…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        startAdornment={<SearchIcon size={18} />}
        endAdornment={<ScanLineIcon size={18} className="text-gray-400" />}
        aria-label="Cari produk" />
      
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Filter kategori">
        {['Semua', ...categories].map((c) =>
        <button
          key={c}
          type="button"
          role="tab"
          aria-selected={category === c}
          onClick={() => setCategory(c)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          category === c ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-accent hover:border-gray-400'}`
          }>
          
            {c}
          </button>
        )}
      </div>

      {filtered.length === 0 ?
      <div className="mt-4">
          <EmptyState icon={PackageSearchIcon} title="Produk tidak ditemukan" description="Periksa ejaan nama atau kode SKU." />
        </div> :

      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((p) => {
          const inCart = cartItems.find((i) => i.productId === p.id)?.qty ?? 0;
          const status = getStockStatus(p);
          const soldOut = status === 'habis';
          const maxed = inCart >= p.stock;
          return (
            <li key={p.id}>
                <button
                type="button"
                disabled={soldOut}
                onClick={() => {
                  onAdd(p);
                  document.getElementById(SEARCH_ID)?.focus();
                }}
                className={`relative flex h-full w-full flex-col rounded-lg border bg-surface p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
                inCart > 0 ? 'border-ink' : 'border-line hover:border-gray-400'} disabled:cursor-not-allowed disabled:opacity-50`
                }>
                
                  {inCart > 0 &&
                <span className="absolute right-2 top-2 z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 font-mono text-[11px] font-semibold text-white">
                      {inCart}
                    </span>
                }
                  <ProductThumb product={p} size="fill" />
                  <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-ink">{p.name}</p>
                  <p className="font-mono text-[10px] text-muted">{p.sku}</p>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                    <span className="text-sm font-bold">{formatRupiah(p.price)}</span>
                    <span className={`font-mono text-[11px] ${soldOut ? 'text-red-600' : status === 'menipis' || maxed ? 'text-amber-600' : 'text-muted'}`}>
                      {soldOut ? 'Habis' : `Stok ${p.stock}`}
                    </span>
                  </div>
                </button>
              </li>);

        })}
        </ul>
      }
    </section>);

}