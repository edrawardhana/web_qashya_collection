import React from 'react';
import { ReceiptTextIcon } from 'lucide-react';
import { EmptyState } from '../EmptyState';
import { paymentMethodLabel } from '../../data/paymentMethods';
import type { Transaction } from '../../types/pos';
import { formatRupiah } from '../../utils/currency';
import { formatDateTime } from '../../utils/date';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onSelect: (trx: Transaction) => void;
}

export function RecentTransactions({ transactions, onSelect }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return <EmptyState icon={ReceiptTextIcon} title="Belum ada transaksi" description="Transaksi yang diproses akan muncul di sini." />;
  }
  return (
    <ul className="divide-y divide-line">
      {transactions.map((t) =>
      <li key={t.id}>
          <button type="button" onClick={() => onSelect(t)} className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left hover:bg-gray-50">
            <div className="min-w-0">
              <p className="font-mono text-xs font-semibold text-ink">{t.id}</p>
              <p className="mt-0.5 truncate text-xs text-muted">
                {formatDateTime(t.date)} · {t.customerName} · {t.items.reduce((s, i) => s + i.qty, 0)} item
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatRupiah(t.total)}</p>
              <p className="font-mono text-[11px] text-muted">{paymentMethodLabel[t.method]}</p>
            </div>
          </button>
        </li>
      )}
    </ul>);

}