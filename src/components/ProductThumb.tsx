import React from 'react';
import { ImageIcon } from 'lucide-react';
import type { Product } from '../types/pos';

interface ProductThumbProps {
  product: Pick<Product, 'name' | 'image'>;
  size?: 'sm' | 'md' | 'fill';
}

const sizes = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  fill: 'h-24 w-full'
};

export function ProductThumb({ product, size = 'sm' }: ProductThumbProps) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className={`${sizes[size]} shrink-0 rounded-md border border-line object-cover`} />;
  }
  return (
    <div className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-gray-400`} aria-hidden="true">
      <ImageIcon className="h-4 w-4" />
    </div>);

}