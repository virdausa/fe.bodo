"use client";

import { createContext, ReactNode, useContext, useRef } from "react";
import { createKelasStore, KelasStore } from "@/stores/kelas.store";
import { useStore } from "zustand";

type KelasStoreApi = ReturnType<typeof createKelasStore>;

const KelasStoreContext = createContext<KelasStoreApi | undefined>(undefined);

interface KelasStoreProviderProps {
  children: ReactNode;
}

const KelasStoreProvider = ({ children }: KelasStoreProviderProps) => {
  const storeRef = useRef<KelasStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createKelasStore();
  }

  return (
    <KelasStoreContext.Provider value={storeRef.current}>
      {children}
    </KelasStoreContext.Provider>
  );
};

const useKelasStore = <T,>(selector: (store: KelasStore) => T): T => {
  const kelasStoreContext = useContext(KelasStoreContext);

  if (!kelasStoreContext) {
    throw new Error("useKelasStore must be used within UserStoreProvider");
  }

  return useStore(kelasStoreContext, selector);
};

export { KelasStoreProvider, useKelasStore };
