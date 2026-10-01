import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</p>
        {icon && <span className="rounded-md border border-dashed border-gray-300 p-2 text-accent">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{value}</p>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>);

}