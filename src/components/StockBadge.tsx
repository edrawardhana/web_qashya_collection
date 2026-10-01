import React from 'react';
import { Badge } from './Badge';
import type { Product } from '../types/pos';
import { getStockStatus, stockStatusLabel } from '../utils/stock';

export function StockBadge({ product }: {product: Pick<Product, 'stock' | 'minStock'>;}) {
  const status = getStockStatus(product);
  const variant = status === 'habis' ? 'error' : status === 'menipis' ? 'warning' : 'success';
  return (
    <Badge variant={variant} size="small" style="bordered">
      {stockStatusLabel[status]}
    </Badge>);

}