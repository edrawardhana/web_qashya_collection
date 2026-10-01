import { BarChart3Icon, BoxesIcon, LayoutDashboardIcon, PackageIcon, ReceiptTextIcon, ShoppingCartIcon, UsersIcon } from 'lucide-react';
import type { NavItem } from '../types/navigation';

export const navItems: NavItem[] = [
{ to: '/', label: 'Dashboard', description: 'Ringkasan harian', icon: LayoutDashboardIcon, roles: ['admin', 'kasir'] },
{ to: '/transaksi', label: 'Transaksi Penjualan', description: 'Proses penjualan', icon: ShoppingCartIcon, roles: ['kasir'] },
{ to: '/produk', label: 'Produk', description: 'Data produk', icon: PackageIcon, roles: ['admin', 'kasir'] },
{ to: '/stok', label: 'Manajemen Stok', description: 'Stok & riwayat', icon: BoxesIcon, roles: ['admin'] },
{ to: '/pengguna', label: 'Pengguna', description: 'Akun & hak akses', icon: UsersIcon, roles: ['admin'] },
{ to: '/laporan', label: 'Laporan Penjualan', description: 'Rekap per periode', icon: BarChart3Icon, roles: ['admin'] },
{ to: '/riwayat', label: 'Riwayat Transaksi', description: 'Semua transaksi', icon: ReceiptTextIcon, roles: ['admin', 'kasir'] }];