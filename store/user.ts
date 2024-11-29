import { create } from 'zustand';

export type UserData = {
  expire: string;
  role: string;
  token: string;
  username: string;
  [property: string]: any;
};

const useUserStore = create((set) => ({
  user: {} as UserData,
  setUser: (userData: UserData) => set({ user: userData }),
  clearUser: () => set({ user: {} as UserData })
}));

export default useUserStore;