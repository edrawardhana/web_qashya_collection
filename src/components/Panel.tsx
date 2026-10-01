import React from 'react';
import { Card } from './Card';

interface PanelProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, description, actions, children, className = '', bodyClassName = 'p-5' }: PanelProps) {
  return (
    <Card padding="none" className={`bg-surface ${className}`}>
      {(title || actions) &&
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
          {actions}
        </div>
      }
      <div className={bodyClassName}>{children}</div>
    </Card>);

}