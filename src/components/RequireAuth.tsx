import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePos } from '../contexts/PosContext';
import type { Role } from '../types/pos';

export function RequireAuth({ role }: {role?: Role;}) {
  const { currentUser } = usePos();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}