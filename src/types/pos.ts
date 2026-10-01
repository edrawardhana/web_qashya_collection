export type Role = 'admin' | 'kasir';
export type PaymentMethod = 'cash' | 'transfer';
export type StockLogType = 'masuk' | 'keluar' | 'penyesuaian';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
  image?: string;
}

export type ProductInput = Omit<Product, 'id'>;

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: Role;
  active: boolean;
  lastLogin?: string;
}

export type UserInput = Omit<User, 'id' | 'lastLogin'>;

export interface TransactionItem {
  productId: string;
  name: string;
  category: string;
  price: number;
  qty: number;
}

export interface Transaction {
  id: string;
  date: string;
  cashierId: string;
  cashierName: string;
  customerName: string;
  items: TransactionItem[];
  total: number;
  paid: number;
  change: number;
  method: PaymentMethod;
}

export interface StockLog {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: StockLogType;
  qty: number;
  stockAfter: number;
  note: string;
  by: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface CheckoutInput {
  items: CartItem[];
  method: PaymentMethod;
  paid: number;
  customerName: string;
}

export type ActionResult<T = null> =
{ok: true;data: T;} |
{ok: false;error: string;};