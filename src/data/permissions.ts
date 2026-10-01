export const permissions = [
{ feature: 'Kelola data produk (tambah, ubah, hapus)', admin: true, kasir: false },
{ feature: 'Lihat data produk (harga & stok)', admin: true, kasir: true },
{ feature: 'Kelola pengguna & hak akses', admin: true, kasir: false },
{ feature: 'Manajemen & riwayat stok', admin: true, kasir: false },
{ feature: 'Transaksi penjualan', admin: false, kasir: true },
{ feature: 'Laporan penjualan & export', admin: true, kasir: false },
{ feature: 'Riwayat transaksi', admin: true, kasir: true }];