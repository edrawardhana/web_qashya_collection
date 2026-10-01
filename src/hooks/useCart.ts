import { useState } from 'react';
import type { CartItem, Product } from '../types/pos';

export interface CartLine {
  product: Product;
  qty: number;
  subtotal: number;
}

export function useCart(products: Product[]) {
  const [items, setItems] = useState<CartItem[]>([]);

  const lines: CartLine[] = items.
  map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? { product, qty: item.qty, subtotal: product.price * item.qty } : null;
  }).
  filter((line): line is CartLine => line !== null);

  const total = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

  function add(product: Product): string | null {
    const current = items.find((i) => i.productId === product.id)?.qty ?? 0;
    if (product.stock <= 0) return `${product.name} sedang habis.`;
    if (current + 1 > product.stock) return `Stok ${product.name} hanya tersisa ${product.stock}.`;
    setItems((prev) =>
    current > 0 ? prev.map((i) => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { productId: product.id, qty: 1 }]
    );
    return null;
  }

  function setQty(productId: string, qty: number): string | null {
    const product = products.find((p) => p.id === productId);
    if (!product) return null;
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return null;
    }
    const safeQty = Math.min(qty, product.stock);
    setItems((prev) => prev.map((i) => i.productId === productId ? { ...i, qty: safeQty } : i));
    return qty > product.stock ? `Stok ${product.name} hanya tersisa ${product.stock}.` : null;
  }

  function remove(productId: string): void {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clear(): void {
    setItems([]);
  }

  return { items, lines, total, itemCount, add, setQty, remove, clear };
}