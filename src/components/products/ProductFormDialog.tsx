import React, { useEffect, useRef, useState } from 'react';
import { ImagePlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from '../Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog';
import { Input } from '../Input';
import { Select } from '../Select';
import { categories } from '../../data/categories';
import type { ActionResult, Product, ProductInput } from '../../types/pos';

interface ProductFormDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (input: ProductInput) => ActionResult<Product>;
}

interface FormState {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  minStock: string;
  description: string;
  image?: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = { name: '', sku: '', category: categories[0], price: '', stock: '', minStock: '5', description: '', image: undefined };
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

export function ProductFormDialog({ open, product, onClose, onSubmit }: ProductFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      product ?
      { name: product.name, sku: product.sku, category: product.category, price: String(product.price), stock: String(product.stock), minStock: String(product.minStock), description: product.description, image: product.image } :
      emptyForm
    );
  }, [open, product]);

  const set = <K extends keyof FormState,>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErrors((er) => ({ ...er, image: 'File harus berupa gambar (JPG/PNG/WebP).' }));
    if (file.size > MAX_IMAGE_BYTES) return setErrors((er) => ({ ...er, image: 'Ukuran gambar maksimal 1,5 MB.' }));
    const reader = new FileReader();
    reader.onload = () => set('image', String(reader.result));
    reader.readAsDataURL(file);
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Nama produk wajib diisi.';
    if (!form.sku.trim()) e.sku = 'SKU wajib diisi.';else
    if (!/^[A-Za-z0-9-]+$/.test(form.sku.trim())) e.sku = 'SKU hanya boleh huruf, angka, dan tanda hubung.';
    const price = Number(form.price);
    if (!form.price || !Number.isFinite(price) || price <= 0) e.price = 'Harga harus lebih dari 0.';
    const stock = Number(form.stock);
    if (form.stock === '' || !Number.isInteger(stock) || stock < 0) e.stock = 'Stok harus bilangan bulat ≥ 0.';
    const min = Number(form.minStock);
    if (form.minStock === '' || !Number.isInteger(min) || min < 0) e.minStock = 'Stok minimum harus bilangan bulat ≥ 0.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    const result = onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      description: form.description.trim(),
      image: form.image
    });
    if (!result.ok) setErrors({ sku: result.error });
  };

  return (
    <Dialog isOpen={open} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} noValidate>
        <DialogHeader>{product ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogHeader>
        <DialogContent>
          <div className="grid gap-6 md:grid-cols-[180px_1fr]">
            <div>
              <p className="mb-1.5 text-sm font-medium text-ink">Foto produk</p>
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50">
                {form.image ?
                <img src={form.image} alt="Pratinjau foto produk" className="h-full w-full object-cover" /> :

                <button type="button" onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-2 p-4 text-center text-xs text-muted hover:text-ink">
                    <ImagePlusIcon size={22} aria-hidden="true" />
                    Unggah foto
                  </button>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} aria-label="Unggah foto produk" />
              <div className="mt-2 flex gap-2">
                <Button type="button" size="small" variant="secondary" onClick={() => fileRef.current?.click()}>
                  {form.image ? 'Ganti' : 'Pilih file'}
                </Button>
                {form.image && <Button type="button" size="small" variant="tertiary" iconOnly={<Trash2Icon size={14} />} aria-label="Hapus foto" onClick={() => set('image', undefined)} />}
              </div>
              {errors.image ? <p className="mt-1 text-xs text-red-600">{errors.image}</p> : <p className="mt-1 font-mono text-[11px] text-muted">JPG/PNG · maks 1,5 MB</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input id="p-name" label="Nama produk" placeholder="mis. Gamis Syar'i Aisyah" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
              </div>
              <Input id="p-sku" label="SKU / Kode" placeholder="GMS-001" value={form.sku} onChange={(e) => set('sku', e.target.value.toUpperCase())} error={errors.sku} />
              <Select
                key={`cat-${open}-${product?.id ?? 'new'}`}
                label="Kategori"
                options={categories.map((c) => ({ value: c, label: c }))}
                value={form.category}
                onChange={(v) => set('category', v as string)} />
              
              <Input id="p-price" type="number" min={0} label="Harga jual (Rp)" placeholder="0" value={form.price} onChange={(e) => set('price', e.target.value)} error={errors.price} />
              <div className="grid grid-cols-2 gap-3">
                <Input id="p-stock" type="number" min={0} label="Stok" value={form.stock} onChange={(e) => set('stock', e.target.value)} error={errors.stock} />
                <Input id="p-min" type="number" min={0} label="Stok min." value={form.minStock} onChange={(e) => set('minStock', e.target.value)} error={errors.minStock} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="p-desc" className="mb-1.5 block text-sm font-medium text-ink">
                  Deskripsi singkat
                </label>
                <textarea
                  id="p-desc"
                  rows={3}
                  maxLength={200}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Bahan, ukuran, atau keterangan singkat"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200" />
                
                <p className="mt-1 text-right font-mono text-[11px] text-muted">{form.description.length}/200</p>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">{product ? 'Simpan perubahan' : 'Tambah produk'}</Button>
          </div>
        </DialogFooter>
      </form>
    </Dialog>);

}