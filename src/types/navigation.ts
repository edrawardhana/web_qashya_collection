import type { LucideIcon } from 'lucide-react';
import type { Role } from './pos';

export interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  roles: Role[];
}