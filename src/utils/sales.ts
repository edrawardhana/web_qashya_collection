import { eachDayOfInterval, endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import type { PaymentMethod, Transaction } from '../types/pos';
import type { CategorySale, DailySale, MethodSale, ProductSale, SalesReport } from '../types/report';
import { formatShortDay, toInputDate } from './date';

export function filterByRange(transactions: Transaction[], start: Date, end: Date): Transaction[] {
  const [a, b] = start <= end ? [start, end] : [end, start];
  const interval = { start: startOfDay(a), end: endOfDay(b) };
  return transactions.filter((t) => isWithinInterval(new Date(t.date), interval));
}

export function sumTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.total, 0);
}

export function countItems(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.qty, 0), 0);
}

export function salesByDay(transactions: Transaction[], start: Date, end: Date): DailySale[] {
  const [a, b] = start <= end ? [start, end] : [end, start];
  const days = eachDayOfInterval({ start: startOfDay(a), end: startOfDay(b) });
  const map = new Map<string, {total: number;count: number;}>();
  transactions.forEach((t) => {
    const key = toInputDate(t.date);
    const prev = map.get(key) ?? { total: 0, count: 0 };
    map.set(key, { total: prev.total + t.total, count: prev.count + 1 });
  });
  return days.map((day) => {
    const key = toInputDate(day);
    const entry = map.get(key) ?? { total: 0, count: 0 };
    return { date: key, label: formatShortDay(day), ...entry };
  });
}

export function productBreakdown(transactions: Transaction[]): ProductSale[] {
  const map = new Map<string, ProductSale>();
  transactions.forEach((t) =>
  t.items.forEach((i) => {
    const prev = map.get(i.productId) ?? { productId: i.productId, name: i.name, category: i.category, qty: 0, revenue: 0 };
    map.set(i.productId, { ...prev, qty: prev.qty + i.qty, revenue: prev.revenue + i.qty * i.price });
  })
  );
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

export function categoryBreakdown(transactions: Transaction[]): CategorySale[] {
  const map = new Map<string, CategorySale>();
  transactions.forEach((t) =>
  t.items.forEach((i) => {
    const prev = map.get(i.category) ?? { category: i.category, qty: 0, revenue: 0 };
    map.set(i.category, { ...prev, qty: prev.qty + i.qty, revenue: prev.revenue + i.qty * i.price });
  })
  );
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

export function methodBreakdown(transactions: Transaction[]): MethodSale[] {
  const methods: PaymentMethod[] = ['cash', 'transfer'];
  return methods.map((method) => {
    const list = transactions.filter((t) => t.method === method);
    return { method, count: list.length, total: sumTotal(list) };
  });
}

export function sortByNewest(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function buildSalesReport(all: Transaction[], start: Date, end: Date, rangeLabel: string): SalesReport {
  const transactions = sortByNewest(filterByRange(all, start, end));
  const total = sumTotal(transactions);
  const count = transactions.length;
  return {
    start,
    end,
    rangeLabel,
    transactions,
    total,
    count,
    items: countItems(transactions),
    average: count ? Math.round(total / count) : 0,
    daily: salesByDay(transactions, start, end),
    products: productBreakdown(transactions),
    categories: categoryBreakdown(transactions),
    methods: methodBreakdown(transactions)
  };
}