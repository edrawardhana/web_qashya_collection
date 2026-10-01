import type { PaymentMethod } from '../types/pos';

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  cash: 'Tunai',
  transfer: 'Transfer'
};