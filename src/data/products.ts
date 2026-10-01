import type { Product } from '../types/pos';

export const products: Product[] = [
{ id: 'p1', sku: 'GMS-001', name: "Gamis Syar'i Aisyah", category: 'Gamis', price: 285000, stock: 14, minStock: 5, description: 'Gamis syar\'i bahan wolfis premium, busui friendly.' },
{ id: 'p2', sku: 'GMS-002', name: 'Gamis Linen Humaira', category: 'Gamis', price: 325000, stock: 4, minStock: 5, description: 'Gamis linen adem dengan detail kancing depan.' },
{ id: 'p3', sku: 'HJB-001', name: 'Pashmina Ceruty Babydoll', category: 'Hijab', price: 45000, stock: 62, minStock: 15, description: 'Pashmina ceruty 175x75 cm, mudah dibentuk.' },
{ id: 'p4', sku: 'HJB-002', name: 'Segiempat Voal Motif', category: 'Hijab', price: 65000, stock: 38, minStock: 15, description: 'Hijab segiempat voal lasercut motif floral.' },
{ id: 'p5', sku: 'HJB-003', name: 'Bergo Instan Jersey', category: 'Hijab', price: 35000, stock: 9, minStock: 10, description: 'Bergo instan jersey dengan pet, tanpa peniti.' },
{ id: 'p6', sku: 'TNK-001', name: 'Tunik Rayon Nadia', category: 'Tunik', price: 149000, stock: 21, minStock: 6, description: 'Tunik katun rayon motif, panjang selutut.' },
{ id: 'p7', sku: 'TNK-002', name: 'Tunik Crinkle Salsa', category: 'Tunik', price: 165000, stock: 0, minStock: 5, description: 'Tunik crinkle airflow, tidak perlu disetrika.' },
{ id: 'p8', sku: 'OTR-001', name: 'Outer Kimono Basic', category: 'Outer', price: 175000, stock: 12, minStock: 4, description: 'Outer kimono polos bahan moscrepe.' },
{ id: 'p9', sku: 'OTR-002', name: 'Cardigan Rajut Zahra', category: 'Outer', price: 189000, stock: 7, minStock: 4, description: 'Cardigan rajut halus, cocok untuk harian.' },
{ id: 'p10', sku: 'MKN-001', name: 'Mukena Katun Jepang', category: 'Mukena', price: 245000, stock: 10, minStock: 3, description: 'Mukena katun jepang lengkap dengan tas.' },
{ id: 'p11', sku: 'AKS-001', name: 'Inner Ninja Rajut', category: 'Aksesoris', price: 15000, stock: 85, minStock: 20, description: 'Ciput ninja rajut, elastis dan nyaman.' },
{ id: 'p12', sku: 'AKS-002', name: 'Bros Mutiara Set', category: 'Aksesoris', price: 25000, stock: 3, minStock: 10, description: 'Set 3 bros mutiara untuk hijab.' }];