import {create} from "zustand";
import {persist} from "zustand/middleware";
import {User} from "@/types/user";

type AuthStore = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    clearIsAuthenticated: () => void;
};
export const useAuthStore = create<AuthStore>()((set) => ({
    isAuthenticated: false,
    user: null,
    setUser: (user: User) => {
        set(() => ({ user, isAuthenticated: true }));
    },
    clearIsAuthenticated: () => {
        set(() => ({ user: null, isAuthenticated: false }));
    },
}));