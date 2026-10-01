import React, { useEffect, useState } from 'react';
import { PrinterIcon } from 'lucide-react';
import { Button } from './Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './Dialog';
import { ReceiptView } from './ReceiptView';
import type { Transaction } from '../types/pos';
import { printReceipt } from '../utils/print';

interface ReceiptDialogProps {
  transaction: Transaction | null;
  onClose: () => void;
  title?: string;
  closeLabel?: string;
}

export function ReceiptDialog({ transaction, onClose, title = 'Struk Transaksi', closeLabel = 'Tutup' }: ReceiptDialogProps) {
  const [shown, setShown] = useState<Transaction | null>(transaction);

  useEffect(() => {
    if (transaction) setShown(transaction);
  }, [transaction]);

  return (
    <Dialog isOpen={transaction !== null} onClose={onClose} size="sm">
      <DialogHeader>{title}</DialogHeader>
      <DialogContent>{shown && <ReceiptView transaction={shown} />}</DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            {closeLabel}
          </Button>
          <Button leftIcon={<PrinterIcon size={16} />} onClick={() => shown && printReceipt(shown)}>
            Cetak Struk
          </Button>
        </div>
      </DialogFooter>
    </Dialog>);

}