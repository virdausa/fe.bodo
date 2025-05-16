import { User } from "@/api/schemas/auth.schema";
import { Profile } from "@/api/schemas/profile.schema";
import { createStore } from "zustand/vanilla";

type UserState = {
  user: User;
  profile: Profile;
};

type UserAction = {
  updateUser: (user: User) => void;
  updateProfile: (profile: Profile) => void;
};

type UserStore = UserState & UserAction;

const initialState: UserState = {
  user: { username: "" },
  profile: { name: "" },
};

const createUserStore = (initState: UserState = initialState) => {
  return createStore<UserStore>((set) => ({
    ...initState,
    updateUser: (user) => set(() => ({ user })),
    updateProfile: (profile) => set(() => ({ profile })),
  }));
};

export type { UserState, UserAction, UserStore };
export { createUserStore };
