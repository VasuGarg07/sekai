import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeStore {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

// Get initial theme (prevents flash)
const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('sekai-theme');
    if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.state?.theme || 'dark';
    }
    return 'dark';
};

// Set initial theme immediately
const initialTheme = getInitialTheme();
if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', initialTheme);
}

export const useTheme = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: initialTheme,
            isDark: initialTheme === 'dark',

            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                set({ theme: newTheme, isDark: newTheme === 'dark' });
                document.documentElement.setAttribute('data-theme', newTheme);
            },
        }),
        {
            name: 'sekai-theme',
        }
    )
);