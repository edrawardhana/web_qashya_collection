import type { Transaction } from '../types/pos';

export const transactions: Transaction[] = [
{ id: 'TRX-260914-001', date: '2026-09-14T10:12:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Umum', method: 'cash', total: 375000, paid: 400000, change: 25000, items: [
  { productId: 'p1', name: "Gamis Syar'i Aisyah", category: 'Gamis', price: 285000, qty: 1 },
  { productId: 'p3', name: 'Pashmina Ceruty Babydoll', category: 'Hijab', price: 45000, qty: 2 }]
},
{ id: 'TRX-260915-001', date: '2026-09-15T13:40:00', cashierId: 'u3', cashierName: 'Putri Anjani', customerName: 'Rina', method: 'transfer', total: 298000, paid: 298000, change: 0, items: [
  { productId: 'p6', name: 'Tunik Rayon Nadia', category: 'Tunik', price: 149000, qty: 2 }]
},
{ id: 'TRX-260916-001', date: '2026-09-16T11:05:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Umum', method: 'cash', total: 225000, paid: 250000, change: 25000, items: [
  { productId: 'p4', name: 'Segiempat Voal Motif', category: 'Hijab', price: 65000, qty: 3 },
  { productId: 'p11', name: 'Inner Ninja Rajut', category: 'Aksesoris', price: 15000, qty: 2 }]
},
{ id: 'TRX-260917-001', date: '2026-09-17T15:22:00', cashierId: 'u3', cashierName: 'Putri Anjani', customerName: 'Dewi', method: 'transfer', total: 245000, paid: 245000, change: 0, items: [
  { productId: 'p10', name: 'Mukena Katun Jepang', category: 'Mukena', price: 245000, qty: 1 }]
},
{ id: 'TRX-260918-001', date: '2026-09-18T09:48:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Umum', method: 'cash', total: 220000, paid: 220000, change: 0, items: [
  { productId: 'p8', name: 'Outer Kimono Basic', category: 'Outer', price: 175000, qty: 1 },
  { productId: 'p3', name: 'Pashmina Ceruty Babydoll', category: 'Hijab', price: 45000, qty: 1 }]
},
{ id: 'TRX-260919-001', date: '2026-09-19T16:30:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Fatimah', method: 'cash', total: 395000, paid: 400000, change: 5000, items: [
  { productId: 'p2', name: 'Gamis Linen Humaira', category: 'Gamis', price: 325000, qty: 1 },
  { productId: 'p5', name: 'Bergo Instan Jersey', category: 'Hijab', price: 35000, qty: 2 }]
},
{ id: 'TRX-260920-001', date: '2026-09-20T12:15:00', cashierId: 'u3', cashierName: 'Putri Anjani', customerName: 'Umum', method: 'transfer', total: 330000, paid: 330000, change: 0, items: [
  { productId: 'p7', name: 'Tunik Crinkle Salsa', category: 'Tunik', price: 165000, qty: 2 }]
},
{ id: 'TRX-260920-002', date: '2026-09-20T17:02:00', cashierId: 'u3', cashierName: 'Putri Anjani', customerName: 'Nisa', method: 'cash', total: 230000, paid: 250000, change: 20000, items: [
  { productId: 'p3', name: 'Pashmina Ceruty Babydoll', category: 'Hijab', price: 45000, qty: 4 },
  { productId: 'p12', name: 'Bros Mutiara Set', category: 'Aksesoris', price: 25000, qty: 2 }]
},
{ id: 'TRX-260921-001', date: '2026-09-21T10:30:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Umum', method: 'transfer', total: 570000, paid: 570000, change: 0, items: [
  { productId: 'p1', name: "Gamis Syar'i Aisyah", category: 'Gamis', price: 285000, qty: 2 }]
},
{ id: 'TRX-260922-001', date: '2026-09-22T14:10:00', cashierId: 'u3', cashierName: 'Putri Anjani', customerName: 'Laila', method: 'cash', total: 234000, paid: 250000, change: 16000, items: [
  { productId: 'p9', name: 'Cardigan Rajut Zahra', category: 'Outer', price: 189000, qty: 1 },
  { productId: 'p11', name: 'Inner Ninja Rajut', category: 'Aksesoris', price: 15000, qty: 3 }]
},
{ id: 'TRX-260923-001', date: '2026-09-23T11:45:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Umum', method: 'cash', total: 214000, paid: 220000, change: 6000, items: [
  { productId: 'p6', name: 'Tunik Rayon Nadia', category: 'Tunik', price: 149000, qty: 1 },
  { productId: 'p4', name: 'Segiempat Voal Motif', category: 'Hijab', price: 65000, qty: 1 }]
},
{ id: 'TRX-260924-001', date: '2026-09-24T13:20:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Aminah', method: 'transfer', total: 490000, paid: 490000, change: 0, items: [
  { productId: 'p10', name: 'Mukena Katun Jepang', category: 'Mukena', price: 245000, qty: 2 }]
},
{ id: 'TRX-260925-001', date: '2026-09-25T10:05:00', cashierId: 'u3', cashierName: 'Putri Anjani', customerName: 'Umum', method: 'cash', total: 195000, paid: 200000, change: 5000, items: [
  { productId: 'p5', name: 'Bergo Instan Jersey', category: 'Hijab', price: 35000, qty: 3 },
  { productId: 'p3', name: 'Pashmina Ceruty Babydoll', category: 'Hijab', price: 45000, qty: 2 }]
},
{ id: 'TRX-260925-002', date: '2026-09-25T16:40:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Yuni', method: 'cash', total: 350000, paid: 350000, change: 0, items: [
  { productId: 'p8', name: 'Outer Kimono Basic', category: 'Outer', price: 175000, qty: 2 }]
},
{ id: 'TRX-260926-001', date: '2026-09-26T11:11:00', cashierId: 'u3', cashierName: 'Putri Anjani', customerName: 'Umum', method: 'transfer', total: 350000, paid: 350000, change: 0, items: [
  { productId: 'p2', name: 'Gamis Linen Humaira', category: 'Gamis', price: 325000, qty: 1 },
  { productId: 'p12', name: 'Bros Mutiara Set', category: 'Aksesoris', price: 25000, qty: 1 }]
},
{ id: 'TRX-260926-002', date: '2026-09-26T15:55:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Sarah', method: 'cash', total: 415000, paid: 450000, change: 35000, items: [
  { productId: 'p1', name: "Gamis Syar'i Aisyah", category: 'Gamis', price: 285000, qty: 1 },
  { productId: 'p4', name: 'Segiempat Voal Motif', category: 'Hijab', price: 65000, qty: 2 }]
},
{ id: 'TRX-260927-001', date: '2026-09-27T09:20:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Umum', method: 'cash', total: 195000, paid: 200000, change: 5000, items: [
  { productId: 'p3', name: 'Pashmina Ceruty Babydoll', category: 'Hijab', price: 45000, qty: 3 },
  { productId: 'p11', name: 'Inner Ninja Rajut', category: 'Aksesoris', price: 15000, qty: 4 }]
},
{ id: 'TRX-260927-002', date: '2026-09-27T10:45:00', cashierId: 'u2', cashierName: 'Siti Rahmawati', customerName: 'Maya', method: 'transfer', total: 338000, paid: 338000, change: 0, items: [
  { productId: 'p6', name: 'Tunik Rayon Nadia', category: 'Tunik', price: 149000, qty: 1 },
  { productId: 'p9', name: 'Cardigan Rajut Zahra', category: 'Outer', price: 189000, qty: 1 }]
},
{ id: 'TRX-260927-003', date: '2026-09-27T11:30:00', cashierId: 'u3', cashierName: 'Putri Anjani', customerName: 'Umum', method: 'cash', total: 285000, paid: 300000, change: 15000, items: [
  { productId: 'p1', name: "Gamis Syar'i Aisyah", category: 'Gamis', price: 285000, qty: 1 }]
}];