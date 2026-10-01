const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

export function formatCompactRupiah(value: number): string {
  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`;
  }
  if (value >= 1000) return `Rp${Math.round(value / 1000)}rb`;
  return `Rp${value}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('id-ID');
}