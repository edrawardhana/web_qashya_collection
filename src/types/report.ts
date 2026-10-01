import type { PaymentMethod, Transaction } from './pos';

export type ReportPeriod = 'harian' | 'mingguan' | 'bulanan' | 'kustom';

export interface DailySale {
  date: string;
  label: string;
  total: number;
  count: number;
}

export interface ProductSale {
  productId: string;
  name: string;
  category: string;
  qty: number;
  revenue: number;
}

export interface CategorySale {
  category: string;
  qty: number;
  revenue: number;
}

export interface MethodSale {
  method: PaymentMethod;
  count: number;
  total: number;
}

export interface SalesReport {
  start: Date;
  end: Date;
  rangeLabel: string;
  transactions: Transaction[];
  total: number;
  count: number;
  items: number;
  average: number;
  daily: DailySale[];
  products: ProductSale[];
  categories: CategorySale[];
  methods: MethodSale[];
}