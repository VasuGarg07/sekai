import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ThemeColor {
    name: string;
    label: string;
    className: string;
}

const availableThemes: ThemeColor[] = [
    { name: 'rose', label: 'Rose', className: 'bg-rose-500' },
    { name: 'cyan', label: 'cyan', className: 'bg-cyan-500' },
    { name: 'orange', label: 'orange', className: 'bg-orange-500' },
    { name: 'emerald', label: 'Emerald', className: 'bg-emerald-500' },
    { name: 'fuchsia', label: 'Fuchsia', className: 'bg-fuchsia-500' },
    { name: 'slate', label: 'slate', className: 'bg-slate-500' },
];

interface ThemeState {
    currentTheme: string;
    availableThemes: ThemeColor[];
}

const initialState: ThemeState = {
    currentTheme: 'rose', // default theme
    availableThemes,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            const themeExists = availableThemes.find(t => t.name === action.payload);
            if (themeExists) {
                localStorage.setItem("theme-color", action.payload);
                state.currentTheme = action.payload;
            }
        },
        initializeTheme: (state) => {
            const savedTheme = localStorage.getItem('theme-color');
            if (savedTheme && availableThemes.find(t => t.name === savedTheme)) {
                state.currentTheme = savedTheme;
            }
        },
    },
});

export const { setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
