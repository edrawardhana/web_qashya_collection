import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { products as seedProducts } from '../data/products';
import { stockLogs as seedStockLogs } from '../data/stockLogs';
import { transactions as seedTransactions } from '../data/transactions';
import { users as seedUsers } from '../data/users';
import type {
  ActionResult,
  CheckoutInput,
  Product,
  ProductInput,
  StockLog,
  StockLogType,
  Transaction,
  User,
  UserInput } from
'../types/pos';

export type StartAs = 'login' | 'admin' | 'kasir';

export interface PosData {
  products: Product[];
  users: User[];
  transactions: Transaction[];
  stockLogs: StockLog[];
}

const STORAGE_KEY = 'qashya-pos-data-v1';
const SESSION_KEY = 'qashya-pos-session-v1';

const seedData: PosData = {
  products: seedProducts,
  users: seedUsers,
  transactions: seedTransactions,
  stockLogs: seedStockLogs
};

function loadData(): PosData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PosData>;
      if (parsed.products && parsed.users && parsed.transactions && parsed.stockLogs) return parsed as PosData;
    }
  } catch {

    // ignore corrupted storage and fall back to seed data
  }return seedData;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function usePosStore(startAs: StartAs = 'login') {
  const [data, setData] = useState<PosData>(loadData);
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => window.sessionStorage.getItem(SESSION_KEY));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {

      // storage quota exceeded (e.g. large images) — keep in-memory state
    }}, [data]);

  useEffect(() => {
    if (sessionUserId) window.sessionStorage.setItem(SESSION_KEY, sessionUserId);else
    window.sessionStorage.removeItem(SESSION_KEY);
  }, [sessionUserId]);

  useEffect(() => {
    if (startAs === 'login') return;
    const user = data.users.find((u) => u.role === startAs && u.active);
    if (user) setSessionUserId(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAs]);

  const currentUser = data.users.find((u) => u.id === sessionUserId && u.active) ?? null;
  const actorName = currentUser?.name ?? 'Sistem';

  function login(username: string, password: string): ActionResult<User> {
    const user = data.users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user || user.password !== password) return { ok: false, error: 'Username atau password salah. Silakan coba lagi.' };
    if (!user.active) return { ok: false, error: 'Akun Anda sedang nonaktif. Hubungi admin untuk mengaktifkan.' };
    const lastLogin = new Date().toISOString();
    setData((d) => ({ ...d, users: d.users.map((u) => u.id === user.id ? { ...u, lastLogin } : u) }));
    setSessionUserId(user.id);
    return { ok: true, data: user };
  }

  function logout(): void {
    setSessionUserId(null);
  }

  function makeLog(product: Product, type: StockLogType, qty: number, stockAfter: number, note: string): StockLog {
    return { id: createId('SLG'), date: new Date().toISOString(), productId: product.id, productName: product.name, type, qty, stockAfter, note, by: actorName };
  }

  function addProduct(input: ProductInput): ActionResult<Product> {
    if (data.products.some((p) => p.sku.toLowerCase() === input.sku.trim().toLowerCase())) {
      return { ok: false, error: 'SKU sudah digunakan produk lain.' };
    }
    const product: Product = { ...input, sku: input.sku.trim().toUpperCase(), id: createId('PRD') };
    setData((d) => ({
      ...d,
      products: [product, ...d.products],
      stockLogs: product.stock > 0 ? [makeLog(product, 'masuk', product.stock, product.stock, 'Stok awal produk baru'), ...d.stockLogs] : d.stockLogs
    }));
    return { ok: true, data: product };
  }

  function updateProduct(id: string, input: ProductInput): ActionResult<Product> {
    const existing = data.products.find((p) => p.id === id);
    if (!existing) return { ok: false, error: 'Produk tidak ditemukan.' };
    if (data.products.some((p) => p.id !== id && p.sku.toLowerCase() === input.sku.trim().toLowerCase())) {
      return { ok: false, error: 'SKU sudah digunakan produk lain.' };
    }
    const updated: Product = { ...existing, ...input, sku: input.sku.trim().toUpperCase() };
    const delta = updated.stock - existing.stock;
    setData((d) => ({
      ...d,
      products: d.products.map((p) => p.id === id ? updated : p),
      stockLogs: delta !== 0 ? [makeLog(updated, 'penyesuaian', delta, updated.stock, 'Perubahan stok melalui edit produk'), ...d.stockLogs] : d.stockLogs
    }));
    return { ok: true, data: updated };
  }

  function deleteProduct(id: string): ActionResult {
    setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));
    return { ok: true, data: null };
  }

  function adjustStock(productId: string, type: StockLogType, qty: number, note: string): ActionResult<Product> {
    const product = data.products.find((p) => p.id === productId);
    if (!product) return { ok: false, error: 'Produk tidak ditemukan.' };
    if (!Number.isInteger(qty) || qty < 0 || type !== 'penyesuaian' && qty === 0) return { ok: false, error: 'Jumlah harus berupa bilangan bulat positif.' };
    const newStock = type === 'masuk' ? product.stock + qty : type === 'keluar' ? product.stock - qty : qty;
    if (newStock < 0) return { ok: false, error: `Stok tidak cukup. Stok saat ini ${product.stock}.` };
    const delta = newStock - product.stock;
    if (delta === 0) return { ok: false, error: 'Tidak ada perubahan stok.' };
    const updated = { ...product, stock: newStock };
    const defaultNote = type === 'masuk' ? 'Stok masuk' : type === 'keluar' ? 'Stok keluar' : 'Penyesuaian stok';
    setData((d) => ({
      ...d,
      products: d.products.map((p) => p.id === productId ? updated : p),
      stockLogs: [makeLog(updated, type, delta, newStock, note.trim() || defaultNote), ...d.stockLogs]
    }));
    return { ok: true, data: updated };
  }

  function activeAdminCountAfter(change: (u: User) => User | null): number {
    return data.users.map(change).filter((u): u is User => u !== null && u.role === 'admin' && u.active).length;
  }

  function addUser(input: UserInput): ActionResult<User> {
    if (data.users.some((u) => u.username.toLowerCase() === input.username.trim().toLowerCase())) {
      return { ok: false, error: 'Username sudah digunakan.' };
    }
    const user: User = { ...input, username: input.username.trim().toLowerCase(), id: createId('USR') };
    setData((d) => ({ ...d, users: [...d.users, user] }));
    return { ok: true, data: user };
  }

  function updateUser(id: string, input: Partial<UserInput>): ActionResult<User> {
    const existing = data.users.find((u) => u.id === id);
    if (!existing) return { ok: false, error: 'Pengguna tidak ditemukan.' };
    if (input.username && data.users.some((u) => u.id !== id && u.username.toLowerCase() === input.username?.trim().toLowerCase())) {
      return { ok: false, error: 'Username sudah digunakan.' };
    }
    const updated: User = {
      ...existing,
      ...input,
      username: (input.username ?? existing.username).trim().toLowerCase(),
      password: input.password ? input.password : existing.password
    };
    if (activeAdminCountAfter((u) => u.id === id ? updated : u) === 0) {
      return { ok: false, error: 'Minimal harus ada satu admin aktif.' };
    }
    if (id === currentUser?.id && (!updated.active || updated.role !== existing.role)) {
      return { ok: false, error: 'Anda tidak dapat menonaktifkan atau mengubah role akun sendiri.' };
    }
    setData((d) => ({ ...d, users: d.users.map((u) => u.id === id ? updated : u) }));
    return { ok: true, data: updated };
  }

  function deleteUser(id: string): ActionResult {
    if (id === currentUser?.id) return { ok: false, error: 'Anda tidak dapat menghapus akun sendiri.' };
    if (activeAdminCountAfter((u) => u.id === id ? null : u) === 0) return { ok: false, error: 'Minimal harus ada satu admin aktif.' };
    setData((d) => ({ ...d, users: d.users.filter((u) => u.id !== id) }));
    return { ok: true, data: null };
  }

  function checkout(input: CheckoutInput): ActionResult<Transaction> {
    if (!currentUser) return { ok: false, error: 'Sesi berakhir. Silakan login kembali.' };
    if (input.items.length === 0) return { ok: false, error: 'Keranjang masih kosong.' };
    const lines: {product: Product;qty: number;}[] = [];
    for (const item of input.items) {
      const product = data.products.find((p) => p.id === item.productId);
      if (!product) return { ok: false, error: 'Salah satu produk di keranjang sudah tidak tersedia.' };
      if (item.qty > product.stock) return { ok: false, error: `Stok ${product.name} tidak cukup (tersisa ${product.stock}).` };
      lines.push({ product, qty: item.qty });
    }
    const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const paid = input.method === 'transfer' ? total : input.paid;
    if (paid < total) return { ok: false, error: 'Nominal pembayaran kurang dari total belanja.' };

    const now = new Date();
    const prefix = `TRX-${format(now, 'yyMMdd')}`;
    const seq = data.transactions.filter((t) => t.id.startsWith(prefix)).length + 1;
    const trx: Transaction = {
      id: `${prefix}-${String(seq).padStart(3, '0')}`,
      date: now.toISOString(),
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      customerName: input.customerName.trim() || 'Umum',
      items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, category: l.product.category, price: l.product.price, qty: l.qty })),
      total,
      paid,
      change: paid - total,
      method: input.method
    };
    const logs = lines.map((l) => makeLog(l.product, 'keluar', -l.qty, l.product.stock - l.qty, `Penjualan ${trx.id}`));
    setData((d) => ({
      ...d,
      transactions: [trx, ...d.transactions],
      products: d.products.map((p) => {
        const line = lines.find((l) => l.product.id === p.id);
        return line ? { ...p, stock: p.stock - line.qty } : p;
      }),
      stockLogs: [...logs, ...d.stockLogs]
    }));
    return { ok: true, data: trx };
  }

  function resetDemoData(): void {
    setData(seedData);
  }

  return {
    data,
    currentUser,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    addUser,
    updateUser,
    deleteUser,
    checkout,
    resetDemoData
  };
}