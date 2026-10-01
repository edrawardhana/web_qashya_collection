import { paymentMethodLabel } from '../data/paymentMethods';
import { storeInfo } from '../data/store';
import type { Transaction } from '../types/pos';
import { formatRupiah } from './currency';
import { formatDateTime } from './date';

const receiptCss = `
@page { size: 80mm auto; margin: 4mm; }
body { font-family: 'Courier New', monospace; font-size: 12px; color: #000; margin: 0; }
.receipt { width: 72mm; margin: 0 auto; }
h1 { font-size: 15px; text-align: center; margin: 0 0 4px; }
.c { text-align: center; margin: 0; }
.r { text-align: right; }
table { width: 100%; border-collapse: collapse; }
td { padding: 1px 0; vertical-align: top; }
hr { border: none; border-top: 1px dashed #000; margin: 6px 0; }
.b td { font-weight: bold; font-size: 13px; }
`;

export function escapeHtml(value: string): string {
  return value.
  replace(/&/g, '&amp;').
  replace(/</g, '&lt;').
  replace(/>/g, '&gt;').
  replace(/"/g, '&quot;').
  replace(/'/g, '&#39;');
}

export function printHtml(title: string, bodyHtml: string, css = ''): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  Object.assign(iframe.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title><style>${css}</style></head><body>${bodyHtml}</body></html>`);
  doc.close();
  window.setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    window.setTimeout(() => iframe.remove(), 1000);
  }, 250);
}

export function printReceipt(trx: Transaction): void {
  const items = trx.items.
  map(
    (i) =>
    `<tr><td colspan="2">${escapeHtml(i.name)}</td></tr><tr><td>${i.qty} x ${formatRupiah(i.price)}</td><td class="r">${formatRupiah(i.qty * i.price)}</td></tr>`
  ).
  join('');
  const body = `
  <div class="receipt">
    <h1>${escapeHtml(storeInfo.name)}</h1>
    <p class="c">${escapeHtml(storeInfo.address)}<br/>${escapeHtml(storeInfo.phone)}</p>
    <hr/>
    <table>
      <tr><td>No</td><td class="r">${trx.id}</td></tr>
      <tr><td>Tanggal</td><td class="r">${formatDateTime(trx.date)}</td></tr>
      <tr><td>Kasir</td><td class="r">${escapeHtml(trx.cashierName)}</td></tr>
      <tr><td>Pembeli</td><td class="r">${escapeHtml(trx.customerName)}</td></tr>
    </table>
    <hr/>
    <table>${items}</table>
    <hr/>
    <table>
      <tr class="b"><td>TOTAL</td><td class="r">${formatRupiah(trx.total)}</td></tr>
      <tr><td>Bayar (${paymentMethodLabel[trx.method]})</td><td class="r">${formatRupiah(trx.paid)}</td></tr>
      <tr><td>Kembali</td><td class="r">${formatRupiah(trx.change)}</td></tr>
    </table>
    <hr/>
    <p class="c">${escapeHtml(storeInfo.footer)}</p>
  </div>`;
  printHtml(`Struk ${trx.id}`, body, receiptCss);
}