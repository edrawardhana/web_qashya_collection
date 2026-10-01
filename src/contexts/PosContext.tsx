import React, { createContext, useContext } from 'react';
import { usePosStore } from '../hooks/usePosStore';
import type { StartAs } from '../hooks/usePosStore';

type PosStore = ReturnType<typeof usePosStore>;

const PosContext = createContext<PosStore | null>(null);

interface PosProviderProps {
  children: React.ReactNode;
  startAs?: StartAs;
}

export function PosProvider({ children, startAs = 'login' }: PosProviderProps) {
  const store = usePosStore(startAs);
  return <PosContext.Provider value={store}>{children}</PosContext.Provider>;
}

export function usePos(): PosStore {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error('usePos must be used within PosProvider');
  return ctx;
}