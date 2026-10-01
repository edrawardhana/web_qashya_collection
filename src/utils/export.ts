import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { paymentMethodLabel } from '../data/paymentMethods';
import { storeInfo } from '../data/store';
import type { Product } from '../types/pos';
import type { SalesReport } from '../types/report';
import { formatRupiah } from './currency';
import { formatDateTime, toInputDate } from './date';
import { getStockStatus, stockStatusLabel } from './stock';

function reportFileName(report: SalesReport, ext: string): string {
  return `laporan-penjualan_${toInputDate(report.start)}_${toInputDate(report.end)}.${ext}`;
}

export function exportSalesExcel(report: SalesReport): void {
  const wb = XLSX.utils.book_new();
  const summary = [
  { Keterangan: 'Toko', Nilai: storeInfo.name },
  { Keterangan: 'Periode', Nilai: report.rangeLabel },
  { Keterangan: 'Total Penjualan', Nilai: report.total },
  { Keterangan: 'Jumlah Transaksi', Nilai: report.count },
  { Keterangan: 'Item Terjual', Nilai: report.items },
  { Keterangan: 'Rata-rata per Transaksi', Nilai: report.average }];

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Ringkasan');
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(report.daily.map((d) => ({ Tanggal: d.date, Transaksi: d.count, Penjualan: d.total }))),
    'Harian'
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(report.products.map((p) => ({ Produk: p.name, Kategori: p.category, Qty: p.qty, Pendapatan: p.revenue }))),
    'Per Produk'
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      report.transactions.map((t) => ({
        'ID Transaksi': t.id,
        Tanggal: formatDateTime(t.date),
        Pembeli: t.customerName,
        Kasir: t.cashierName,
        Metode: paymentMethodLabel[t.method],
        Barang: t.items.map((i) => `${i.name} x${i.qty}`).join(', '),
        Total: t.total
      }))
    ),
    'Transaksi'
  );
  XLSX.writeFile(wb, reportFileName(report, 'xlsx'));
}

function finalY(doc: jsPDF): number {
  return (doc as unknown as {lastAutoTable: {finalY: number;};}).lastAutoTable.finalY;
}

export function exportSalesPdf(report: SalesReport): void {
  const doc = new jsPDF();
  const head = { fillColor: [75, 85, 99] as [number, number, number], textColor: 255 };
  doc.setFontSize(16);
  doc.text('Laporan Penjualan', 14, 18);
  doc.setFontSize(10);
  doc.text(`${storeInfo.name} — ${report.rangeLabel}`, 14, 25);
  doc.text(`Dicetak: ${formatDateTime(new Date())}`, 14, 31);
  autoTable(doc, {
    startY: 37,
    theme: 'grid',
    headStyles: head,
    head: [['Ringkasan', 'Nilai']],
    body: [
    ['Total Penjualan', formatRupiah(report.total)],
    ['Jumlah Transaksi', String(report.count)],
    ['Item Terjual', String(report.items)],
    ['Rata-rata per Transaksi', formatRupiah(report.average)]]

  });
  autoTable(doc, {
    startY: finalY(doc) + 8,
    theme: 'grid',
    headStyles: head,
    head: [['#', 'Produk', 'Kategori', 'Qty', 'Pendapatan']],
    body: report.products.map((p, i) => [String(i + 1), p.name, p.category, String(p.qty), formatRupiah(p.revenue)])
  });
  autoTable(doc, {
    startY: finalY(doc) + 8,
    theme: 'grid',
    headStyles: head,
    styles: { fontSize: 8 },
    head: [['ID Transaksi', 'Tanggal', 'Pembeli', 'Kasir', 'Metode', 'Total']],
    body: report.transactions.map((t) => [t.id, formatDateTime(t.date), t.customerName, t.cashierName, paymentMethodLabel[t.method], formatRupiah(t.total)])
  });
  doc.save(reportFileName(report, 'pdf'));
}

export function exportStockExcel(products: Product[]): void {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      products.map((p) => ({
        SKU: p.sku,
        Produk: p.name,
        Kategori: p.category,
        Harga: p.price,
        Stok: p.stock,
        'Stok Minimum': p.minStock,
        Status: stockStatusLabel[getStockStatus(p)],
        'Nilai Stok': p.price * p.stock
      }))
    ),
    'Stok'
  );
  XLSX.writeFile(wb, `laporan-stok_${toInputDate(new Date())}.xlsx`);
}