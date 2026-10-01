import type { Product } from '../types/pos';

export type StockStatus = 'habis' | 'menipis' | 'aman';

export const stockStatusLabel: Record<StockStatus, string> = {
  habis: 'Habis',
  menipis: 'Menipis',
  aman: 'Aman'
};

export function getStockStatus(product: Pick<Product, 'stock' | 'minStock'>): StockStatus {
  if (product.stock <= 0) return 'habis';
  if (product.stock <= product.minStock) return 'menipis';
  return 'aman';
}

export function isLowStock(product: Pick<Product, 'stock' | 'minStock'>): boolean {
  return getStockStatus(product) !== 'aman';
}