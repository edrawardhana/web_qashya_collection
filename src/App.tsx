import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';
import { RequireAuth } from './components/RequireAuth';
import { AppLayout } from './components/layout/AppLayout';
import { PosProvider } from './contexts/PosContext';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { ProductsPage } from './pages/Products';
import { CashierPage } from './pages/Cashier';
import { StockPage } from './pages/Stock';
import { UsersPage } from './pages/Users';
import { ReportsPage } from './pages/Reports';
import { TransactionsPage } from './pages/Transactions';

interface AppProps {
  startAs?: 'login' | 'admin' | 'kasir';
}

export function App({ startAs = 'login' }: AppProps) {
  return (
    <ToastProvider>
      <PosProvider startAs={startAs}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="produk" element={<ProductsPage />} />
                <Route path="riwayat" element={<TransactionsPage />} />
                <Route element={<RequireAuth role="kasir" />}>
                  <Route path="transaksi" element={<CashierPage />} />
                </Route>
                <Route element={<RequireAuth role="admin" />}>
                  <Route path="stok" element={<StockPage />} />
                  <Route path="pengguna" element={<UsersPage />} />
                  <Route path="laporan" element={<ReportsPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PosProvider>
    </ToastProvider>);

}