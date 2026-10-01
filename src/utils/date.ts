import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

type DateLike = string | Date;

export function formatDate(value: DateLike): string {
  return format(new Date(value), 'd MMM yyyy', { locale: localeId });
}

export function formatDateTime(value: DateLike): string {
  return format(new Date(value), 'd MMM yyyy, HH:mm', { locale: localeId });
}

export function formatTime(value: DateLike): string {
  return format(new Date(value), 'HH:mm');
}

export function formatLongDate(value: DateLike): string {
  return format(new Date(value), 'EEEE, d MMMM yyyy', { locale: localeId });
}

export function formatShortDay(value: DateLike): string {
  return format(new Date(value), 'd MMM', { locale: localeId });
}

export function toInputDate(value: DateLike): string {
  return format(new Date(value), 'yyyy-MM-dd');
}

export function fromInputDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}