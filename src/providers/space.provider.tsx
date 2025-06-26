// src/providers/SpaceProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

type SpaceContextType = {
  spaceId: string | null;
  setSpaceId: (id: string | null) => void;
};

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

const SpaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [spaceId, setSpaceIdState] = useState<string | null>(null);

  useEffect(() => {
    const stored = getCookie("space_id");
    if (stored) setSpaceIdState(stored as string);
  }, []);

  const setSpaceId = (id: string | null) => {
    setSpaceIdState(id);
    if(id){
      setCookie("space_id", id, { maxAge: 60 * 60 * 24 * 7 }); // 7 hari
    } else {
      deleteCookie("space_id");
    }
  };

  return (
    <SpaceContext.Provider value={{ spaceId, setSpaceId }}>
      {children}
    </SpaceContext.Provider>
  );
};

const useSpace = () => {
  const context = useContext(SpaceContext);
  if (!context) throw new Error("useSpace must be used within SpaceProvider");
  return context;
};

export { SpaceProvider, useSpace };