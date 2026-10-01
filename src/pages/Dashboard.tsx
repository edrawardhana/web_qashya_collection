import React from 'react';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { KasirDashboard } from '../components/dashboard/KasirDashboard';
import { usePos } from '../contexts/PosContext';

export function DashboardPage() {
  const { currentUser } = usePos();
  return currentUser?.role === 'admin' ? <AdminDashboard /> : <KasirDashboard />;
}