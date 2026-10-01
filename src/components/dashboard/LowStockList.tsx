import React from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { EmptyState } from '../EmptyState';
import { ProductThumb } from '../ProductThumb';
import { StockBadge } from '../StockBadge';
import type { Product } from '../../types/pos';

export function LowStockList({ products }: {products: Product[];}) {
  if (products.length === 0) {
    return <EmptyState icon={CheckCircle2Icon} title="Semua stok aman" description="Tidak ada produk di bawah stok minimum." />;
  }
  return (
    <ul className="divide-y divide-line">
      {products.map((p) =>
      <li key={p.id} className="flex items-center gap-3 px-5 py-3">
          <ProductThumb product={p} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <p className="font-mono text-[11px] text-muted">
              Sisa {p.stock} · min. {p.minStock}
            </p>
          </div>
          <StockBadge product={p} />
        </li>
      )}
    </ul>);

}