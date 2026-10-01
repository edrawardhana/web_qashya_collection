import React from 'react';
import { paymentMethodLabel } from '../data/paymentMethods';
import { storeInfo } from '../data/store';
import type { Transaction } from '../types/pos';
import { formatRupiah } from '../utils/currency';
import { formatDateTime } from '../utils/date';

export function ReceiptView({ transaction: t }: {transaction: Transaction;}) {
  const divider = <div className="my-3 border-t border-dashed border-gray-300" />;
  const meta = [
  ['No. Transaksi', t.id],
  ['Tanggal', formatDateTime(t.date)],
  ['Kasir', t.cashierName],
  ['Pembeli', t.customerName]];

  return (
    <div className="mx-auto w-full max-w-sm rounded-md border border-dashed border-gray-300 bg-white p-5 font-mono text-xs text-ink">
      <div className="text-center">
        <p className="font-sans text-base font-bold">{storeInfo.name}</p>
        <p className="mt-1 text-muted">{storeInfo.address}</p>
        <p className="text-muted">{storeInfo.phone}</p>
      </div>
      {divider}
      <dl className="space-y-1">
        {meta.map(([label, value]) =>
        <div key={label} className="flex justify-between gap-4">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right">{value}</dd>
          </div>
        )}
      </dl>
      {divider}
      <ul className="space-y-2">
        {t.items.map((item) =>
        <li key={item.productId}>
            <p>{item.name}</p>
            <div className="flex justify-between text-muted">
              <span>
                {item.qty} x {formatRupiah(item.price)}
              </span>
              <span className="text-ink">{formatRupiah(item.qty * item.price)}</span>
            </div>
          </li>
        )}
      </ul>
      {divider}
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-bold">
          <span>TOTAL</span>
          <span>{formatRupiah(t.total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Bayar ({paymentMethodLabel[t.method]})</span>
          <span>{formatRupiah(t.paid)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Kembali</span>
          <span>{formatRupiah(t.change)}</span>
        </div>
      </div>
      {divider}
      <p className="text-center text-muted">{storeInfo.footer}</p>
    </div>);

}