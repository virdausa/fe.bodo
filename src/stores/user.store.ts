import { User } from "@/api/schemas/auth.schema";
import { createStore } from "zustand/vanilla";

type UserState = {
  user: User;
  isInitialized: boolean;
};

type UserAction = {
  updateUser: (user: User) => void;
  updateInitialized: (isInitialized: boolean) => void;
};

type UserStore = UserState & UserAction;

const initialState: UserState = {
  user: { username: "", email: "", name: "" },
  isInitialized: false,
};

const createUserStore = (initState: UserState = initialState) => {
  return createStore<UserStore>((set) => ({
    ...initState,
    updateUser: (user) => set(() => ({ user })),
    updateInitialized: (isInitialized) =>
      set(() => ({
        isInitialized,
      })),
  }));
};

export type { UserState, UserAction, UserStore };
export { createUserStore };
