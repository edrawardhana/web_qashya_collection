import React, { useState } from 'react';
import { useToast } from '../components/ToastProvider';
import { PageHeader } from '../components/PageHeader';
import { ReceiptDialog } from '../components/ReceiptDialog';
import { CartPanel } from '../components/cashier/CartPanel';
import { ProductPicker } from '../components/cashier/ProductPicker';
import { usePos } from '../contexts/PosContext';
import { useCart } from '../hooks/useCart';
import type { PaymentMethod, Transaction } from '../types/pos';

export function CashierPage() {
  const { data, checkout, currentUser } = usePos();
  const { addToast } = useToast();
  const cart = useCart(data.products);
  const [customerName, setCustomerName] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [paidInput, setPaidInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Transaction | null>(null);

  const paid = method === 'transfer' ? cart.total : Number(paidInput || 0);
  const change = Math.max(0, paid - cart.total);
  const canPay = cart.lines.length > 0 && (method === 'transfer' || paid >= cart.total);

  const notify = (message: string | null) => {
    setError(null);
    if (message) addToast({ type: 'warning', message });
  };

  const handleCheckout = () => {
    setProcessing(true);
    setError(null);
    window.setTimeout(() => {
      const result = checkout({ items: cart.items, method, paid, customerName });
      setProcessing(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setReceipt(result.data);
      cart.clear();
      setCustomerName('');
      setPaidInput('');
      setMethod('cash');
      addToast({ type: 'success', message: `Transaksi ${result.data.id} berhasil. Stok telah diperbarui.` });
    }, 300);
  };

  return (
    <div>
      <PageHeader eyebrow="KF5 · Transaksi penjualan" title="Kasir" description={`Melayani sebagai ${currentUser?.name}. Pilih produk, atur jumlah, lalu selesaikan pembayaran.`} />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <ProductPicker products={data.products} cartItems={cart.items} onAdd={(p) => notify(cart.add(p))} />
        <CartPanel
          lines={cart.lines}
          total={cart.total}
          itemCount={cart.itemCount}
          customerName={customerName}
          method={method}
          paidInput={paidInput}
          change={change}
          canPay={canPay}
          processing={processing}
          error={error}
          onQty={(id, qty) => notify(cart.setQty(id, qty))}
          onRemove={cart.remove}
          onClear={cart.clear}
          onCustomerName={setCustomerName}
          onMethod={setMethod}
          onPaidInput={setPaidInput}
          onCheckout={handleCheckout} />
        
      </div>
      <ReceiptDialog transaction={receipt} onClose={() => setReceipt(null)} title="Transaksi Berhasil" closeLabel="Transaksi baru" />
    </div>);

}