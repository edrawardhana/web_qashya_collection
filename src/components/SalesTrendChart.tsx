import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DailySale } from '../types/report';
import { formatCompactRupiah, formatRupiah } from '../utils/currency';

interface SalesTrendChartProps {
  data: DailySale[];
  height?: number;
}

const tick = { fontSize: 11, fill: '#6b7280', fontFamily: 'JetBrains Mono, monospace' };

export function SalesTrendChart({ data, height = 260 }: SalesTrendChartProps) {
  return (
    <div className="w-full" style={{ height }} role="img" aria-label="Grafik tren penjualan harian">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} minTickGap={12} />
          <YAxis tickFormatter={(v) => formatCompactRupiah(Number(v))} tick={tick} width={60} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }}
            formatter={(value) => [formatRupiah(Number(value)), 'Penjualan']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
          
          <Bar dataKey="total" fill="#4b5563" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>);

}