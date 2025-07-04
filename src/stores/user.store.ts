import { User } from "@/api/schemas/auth.schema";
import { Profile } from "@/api/schemas/profile.schema";
import { createStore } from "zustand/vanilla";

type UserState = {
  user: User;
  profile: Profile;
  isInitialized: boolean;
};

type UserAction = {
  updateUser: (user: User) => void;
  updateProfile: (profile: Profile) => void;
  updateInitialized: (isInitialized: boolean) => void;
};

type UserStore = UserState & UserAction;

const initialState: UserState = {
  user: { username: "", email: "", name: "" },
  profile: { id: 0, name: "", isProfessor: false },
  isInitialized: false,
};

const createUserStore = (initState: UserState = initialState) => {
  return createStore<UserStore>((set) => ({
    ...initState,
    updateUser: (user) => set(() => ({ user })),
    updateProfile: (profile) => set(() => ({ profile })),
    updateInitialized: (isInitialized) =>
      set(() => ({
        isInitialized,
      })),
  }));
};

export type { UserState, UserAction, UserStore };
export { createUserStore };
