import React from 'react';
import { Button } from './Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './Dialog';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel = 'Konfirmasi', destructive = false, onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <Dialog isOpen={open} onClose={onClose} size="sm">
      <DialogHeader>{title}</DialogHeader>
      <DialogContent>
        <div className="text-sm text-muted">{description}</div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>);

}