import type { StockLog } from '../types/pos';

export const stockLogs: StockLog[] = [
{ id: 'SLG-008', date: '2026-09-27T11:30:00', productId: 'p1', productName: "Gamis Syar'i Aisyah", type: 'keluar', qty: -1, stockAfter: 14, note: 'Penjualan TRX-260927-003', by: 'Putri Anjani' },
{ id: 'SLG-007', date: '2026-09-27T10:45:00', productId: 'p9', productName: 'Cardigan Rajut Zahra', type: 'keluar', qty: -1, stockAfter: 7, note: 'Penjualan TRX-260927-002', by: 'Siti Rahmawati' },
{ id: 'SLG-006', date: '2026-09-27T09:20:00', productId: 'p3', productName: 'Pashmina Ceruty Babydoll', type: 'keluar', qty: -3, stockAfter: 62, note: 'Penjualan TRX-260927-001', by: 'Siti Rahmawati' },
{ id: 'SLG-005', date: '2026-09-24T08:30:00', productId: 'p12', productName: 'Bros Mutiara Set', type: 'penyesuaian', qty: -2, stockAfter: 4, note: 'Stock opname: 2 pcs rusak', by: 'Hana Pratiwi' },
{ id: 'SLG-004', date: '2026-09-22T09:10:00', productId: 'p3', productName: 'Pashmina Ceruty Babydoll', type: 'masuk', qty: 40, stockAfter: 73, note: 'Restock dari supplier', by: 'Hana Pratiwi' },
{ id: 'SLG-003', date: '2026-09-20T12:15:00', productId: 'p7', productName: 'Tunik Crinkle Salsa', type: 'keluar', qty: -2, stockAfter: 0, note: 'Penjualan TRX-260920-001', by: 'Putri Anjani' },
{ id: 'SLG-002', date: '2026-09-15T08:45:00', productId: 'p10', productName: 'Mukena Katun Jepang', type: 'masuk', qty: 10, stockAfter: 13, note: 'Restock dari supplier', by: 'Hana Pratiwi' },
{ id: 'SLG-001', date: '2026-09-13T09:00:00', productId: 'p1', productName: "Gamis Syar'i Aisyah", type: 'masuk', qty: 12, stockAfter: 20, note: 'Restock dari supplier', by: 'Hana Pratiwi' }];