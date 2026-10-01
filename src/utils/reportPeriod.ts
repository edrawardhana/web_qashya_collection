import { endOfMonth, startOfDay, startOfMonth, subDays } from 'date-fns';
import type { ReportPeriod } from '../types/report';
import { formatDate, fromInputDate } from './date';

export interface ReportRange {
  start: Date;
  end: Date;
  label: string;
}

export function getReportRange(period: ReportPeriod, customStart: string, customEnd: string, now = new Date()): ReportRange {
  const today = startOfDay(now);
  switch (period) {
    case 'harian':
      return { start: today, end: today, label: `Harian · ${formatDate(today)}` };
    case 'mingguan':{
        const start = subDays(today, 6);
        return { start, end: today, label: `Mingguan · ${formatDate(start)} – ${formatDate(today)}` };
      }
    case 'bulanan':{
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        return { start, end, label: `Bulanan · ${formatDate(start)} – ${formatDate(end)}` };
      }
    case 'kustom':{
        let start = customStart ? fromInputDate(customStart) : today;
        let end = customEnd ? fromInputDate(customEnd) : today;
        if (start > end) [start, end] = [end, start];
        return { start, end, label: `Kustom · ${formatDate(start)} – ${formatDate(end)}` };
      }
  }
}