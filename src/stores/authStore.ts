// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    provider: 'google' | 'discord';
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (user: User) => {
                set({ user, isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
                // Clear any other user data
                localStorage.removeItem('sekai-watchlist');
            },
        }),
        {
            name: 'sekai-auth', // localStorage key
        }
    )
);