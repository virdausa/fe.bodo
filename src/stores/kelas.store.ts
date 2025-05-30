import { Kelas } from "@/api/schemas/kelas.schema";
import { createStore } from "zustand";

type KelasState = { kelas: Kelas };

type KelasAction = { updateKelas: (kelas: Kelas) => void };

type KelasStore = KelasState & KelasAction;

const initialState: KelasState = {
  kelas: {
    id: 0,
    name: "",
  },
};

const createKelasStore = (initState: KelasState = initialState) => {
  return createStore<KelasStore>((set) => ({
    ...initState,
    updateKelas: (kelas) => set(() => ({ kelas })),
  }));
};

export type { KelasState, KelasAction, KelasStore };
export { createKelasStore };
