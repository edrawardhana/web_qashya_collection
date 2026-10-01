import React from 'react';
import { AlertCircleIcon, BanknoteIcon, LandmarkIcon, MinusIcon, PlusIcon, ShoppingCartIcon, Trash2Icon, XIcon } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import type { CartLine } from '../../hooks/useCart';
import type { PaymentMethod } from '../../types/pos';
import { formatRupiah } from '../../utils/currency';

interface CartPanelProps {
  lines: CartLine[];
  total: number;
  itemCount: number;
  customerName: string;
  method: PaymentMethod;
  paidInput: string;
  change: number;
  canPay: boolean;
  processing: boolean;
  error: string | null;
  onQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCustomerName: (value: string) => void;
  onMethod: (method: PaymentMethod) => void;
  onPaidInput: (value: string) => void;
  onCheckout: () => void;
}

function quickAmounts(total: number): number[] {
  if (total <= 0) return [];
  const list = [total, Math.ceil(total / 50000) * 50000, Math.ceil(total / 100000) * 100000, Math.ceil(total / 100000) * 100000 + 100000];
  return [...new Set(list)].slice(0, 4);
}

export function CartPanel(props: CartPanelProps) {
  const { lines, total, itemCount, customerName, method, paidInput, change, canPay, processing, error } = props;
  const paid = Number(paidInput || 0);
  const shortfall = method === 'cash' && paidInput !== '' && paid < total;

  return (
    <aside aria-label="Keranjang belanja" className="flex flex-col rounded-lg border border-line bg-surface xl:sticky xl:top-24 xl:max-h-[calc(100vh-7.5rem)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon size={18} aria-hidden="true" />
          <h2 className="text-sm font-semibold">Keranjang</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-accent">{itemCount} item</span>
        </div>
        {lines.length > 0 &&
        <button type="button" onClick={props.onClear} className="flex items-center gap-1 text-xs text-muted hover:text-red-600">
            <XIcon size={14} /> Kosongkan
          </button>
        }
      </div>

      <div className="min-h-[140px] flex-1 overflow-y-auto">
        {lines.length === 0 ?
        <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
            <div className="rounded-md border border-dashed border-gray-300 p-3 text-gray-400">
              <ShoppingCartIcon size={20} />
            </div>
            <p className="mt-3 text-sm font-medium">Keranjang kosong</p>
            <p className="mt-1 text-xs text-muted">Klik produk atau scan SKU untuk menambahkan.</p>
          </div> :

        <ul className="divide-y divide-line">
            {lines.map(({ product, qty, subtotal }) =>
          <li key={product.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="font-mono text-[11px] text-muted">
                      {formatRupiah(product.price)} · stok {product.stock}
                    </p>
                  </div>
                  <button type="button" onClick={() => props.onRemove(product.id)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600" aria-label={`Hapus ${product.name}`}>
                    <Trash2Icon size={14} />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-line">
                    <button type="button" onClick={() => props.onQty(product.id, qty - 1)} className="p-1.5 text-accent hover:bg-gray-50" aria-label="Kurangi jumlah">
                      <MinusIcon size={14} />
                    </button>
                    <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={qty}
                  onChange={(e) => props.onQty(product.id, Math.floor(Number(e.target.value) || 0))}
                  className="w-12 border-x border-line bg-transparent py-1 text-center font-mono text-sm focus:outline-none"
                  aria-label={`Jumlah ${product.name}`} />
                
                    <button
                  type="button"
                  onClick={() => props.onQty(product.id, qty + 1)}
                  disabled={qty >= product.stock}
                  className="p-1.5 text-accent hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Tambah jumlah">
                  
                      <PlusIcon size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-semibold">{formatRupiah(subtotal)}</span>
                </div>
              </li>
          )}
          </ul>
        }
      </div>

      <div className="space-y-4 border-t border-line p-5">
        <Input id="customer" size="small" label="Nama pembeli (opsional)" placeholder="Umum" value={customerName} onChange={(e) => props.onCustomerName(e.target.value)} />

        <div>
          <p className="mb-1.5 text-sm font-medium">Metode pembayaran</p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Metode pembayaran">
            {([
            { value: 'cash', label: 'Tunai', icon: BanknoteIcon },
            { value: 'transfer', label: 'Transfer', icon: LandmarkIcon }] as
            const).map(({ value, label, icon: Icon }) =>
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={method === value}
              onClick={() => props.onMethod(value)}
              className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              method === value ? 'border-ink bg-ink text-white' : 'border-line text-accent hover:border-gray-400'}`
              }>
              
                <Icon size={16} aria-hidden="true" /> {label}
              </button>
            )}
          </div>
        </div>

        {method === 'cash' ?
        <div>
            <Input
            id="paid"
            type="number"
            min={0}
            size="small"
            label="Uang diterima (Rp)"
            placeholder="0"
            value={paidInput}
            onChange={(e) => props.onPaidInput(e.target.value)}
            error={shortfall ? `Kurang ${formatRupiah(total - paid)}` : undefined} />
          
            <div className="mt-2 flex flex-wrap gap-1.5">
              {quickAmounts(total).map((amount, i) =>
            <button key={amount} type="button" onClick={() => props.onPaidInput(String(amount))} className="rounded border border-dashed border-gray-300 px-2 py-1 font-mono text-[11px] text-accent hover:border-gray-500">
                  {i === 0 ? 'Uang pas' : formatRupiah(amount)}
                </button>
            )}
            </div>
          </div> :

        <p className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-xs text-muted">Pastikan dana transfer sebesar total belanja sudah diterima sebelum menyelesaikan transaksi.</p>
        }

        <dl className="space-y-1.5 rounded-md bg-gray-50 p-4 text-sm">
          <div className="flex justify-between text-muted">
            <dt>Subtotal ({itemCount} item)</dt>
            <dd>{formatRupiah(total)}</dd>
          </div>
          {method === 'cash' &&
          <div className="flex justify-between text-muted">
              <dt>Kembalian</dt>
              <dd className="font-medium text-ink">{formatRupiah(change)}</dd>
            </div>
          }
          <div className="flex justify-between border-t border-dashed border-gray-300 pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatRupiah(total)}</dd>
          </div>
        </dl>

        {error &&
        <p role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <AlertCircleIcon size={14} className="mt-0.5 shrink-0" /> {error}
          </p>
        }

        <Button size="large" className="w-full" disabled={!canPay} loading={processing} onClick={props.onCheckout}>
          Bayar {total > 0 ? formatRupiah(total) : ''}
        </Button>
      </div>
    </aside>);

}