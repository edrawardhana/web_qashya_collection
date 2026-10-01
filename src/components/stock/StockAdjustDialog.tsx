import React, { useEffect, useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '../Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog';
import { Input } from '../Input';
import { Select } from '../Select';
import type { ActionResult, Product, StockLogType } from '../../types/pos';

interface StockAdjustDialogProps {
  open: boolean;
  products: Product[];
  initialProductId: string | null;
  onClose: () => void;
  onSubmit: (productId: string, type: StockLogType, qty: number, note: string) => ActionResult<Product>;
}

const typeOptions: {value: StockLogType;label: string;hint: string;}[] = [
{ value: 'masuk', label: 'Stok masuk', hint: 'Restock dari supplier' },
{ value: 'keluar', label: 'Stok keluar', hint: 'Rusak, retur, hilang' },
{ value: 'penyesuaian', label: 'Stock opname', hint: 'Set sesuai hitung fisik' }];


export function StockAdjustDialog({ open, products, initialProductId, onClose, onSubmit }: StockAdjustDialogProps) {
  const [productId, setProductId] = useState('');
  const [type, setType] = useState<StockLogType>('masuk');
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setProductId(initialProductId ?? '');
    setType('masuk');
    setQty('');
    setNote('');
    setError(null);
  }, [open, initialProductId]);

  const product = products.find((p) => p.id === productId);
  const n = Number(qty);
  const valid = qty !== '' && Number.isInteger(n) && n >= 0;
  const preview = product && valid ? type === 'masuk' ? product.stock + n : type === 'keluar' ? product.stock - n : n : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return setError('Pilih produk terlebih dahulu.');
    if (!valid) return setError('Masukkan jumlah berupa bilangan bulat.');
    const result = onSubmit(product.id, type, n, note);
    if (!result.ok) setError(result.error);
  };

  return (
    <Dialog isOpen={open} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} noValidate>
        <DialogHeader>Sesuaikan Stok</DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <Select
              key={`adj-${open}-${initialProductId ?? 'none'}`}
              label="Produk"
              searchable
              placeholder="Pilih produk"
              options={products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})`, group: p.category }))}
              value={productId}
              onChange={(v) => {
                setProductId(v as string);
                setError(null);
              }} />
            
            <div>
              <p className="mb-1.5 text-sm font-medium">Jenis perubahan</p>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Jenis perubahan stok">
                {typeOptions.map((o) =>
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={type === o.value}
                  onClick={() => setType(o.value)}
                  className={`rounded-md border p-2.5 text-left transition-colors ${type === o.value ? 'border-ink bg-gray-50' : 'border-line hover:border-gray-400'}`}>
                  
                    <p className="text-xs font-semibold">{o.label}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{o.hint}</p>
                  </button>
                )}
              </div>
            </div>
            <Input
              id="adj-qty"
              type="number"
              min={0}
              label={type === 'masuk' ? 'Jumlah masuk' : type === 'keluar' ? 'Jumlah keluar' : 'Stok hasil hitung fisik'}
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                setError(null);
              }} />
            
            <Input id="adj-note" label="Keterangan" placeholder="mis. Restock supplier Bandung" value={note} onChange={(e) => setNote(e.target.value)} />
            {product &&
            <div className="flex items-center justify-between rounded-md border border-dashed border-gray-300 px-4 py-3 font-mono text-sm">
                <span className="text-muted">Stok saat ini {product.stock}</span>
                <ArrowRightIcon size={14} className="text-gray-400" aria-hidden="true" />
                <span className={preview !== null && preview < 0 ? 'text-red-600' : 'font-semibold'}>Stok baru {preview ?? '—'}</span>
              </div>
            }
            {error &&
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            }
          </div>
        </DialogContent>
        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan perubahan</Button>
          </div>
        </DialogFooter>
      </form>
    </Dialog>);

}