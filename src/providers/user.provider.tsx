"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type UserStore, createUserStore } from "@/stores/user.store";

type UserStoreApi = ReturnType<typeof createUserStore>;

const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

interface UserStoreProviderProps {
  children: ReactNode;
}

const UserStoreProvider = ({ children }: UserStoreProviderProps) => {
  const storeRef = useRef<UserStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createUserStore();
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error("useUserStore must be used within UserStoreProvider");
  }

  return useStore(userStoreContext, selector);
};

export { UserStoreProvider, useUserStore };
