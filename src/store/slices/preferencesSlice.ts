import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { registerPreferences, updatePreferences } from "../../shared/firestore";
import type { UserPreferences, WatchStatus } from "../../shared/interfaces";

interface PreferencesState extends UserPreferences {
    loading: boolean;
    error: string | null;
}

const initialState: PreferencesState = {
    app_theme: "rose",
    default_watch_status: "watching",
    loading: false,
    error: null,
};

// --- Async Thunks ---
export const fetchPreferences = createAsyncThunk(
    "preferences/fetchPreferences",
    async (uid: string) => {
        return await registerPreferences(uid);
    }
);

export const savePreferences = createAsyncThunk(
    "preferences/savePreferences",
    async ({ uid, updates }: { uid: string; updates: Partial<UserPreferences> }) => {
        await updatePreferences(uid, updates);
        return updates;
    }
);

// --- Slice ---
const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<string>) {
            state.app_theme = action.payload;
        },
        setDefaultWatchStatus(state, action: PayloadAction<WatchStatus>) {
            state.default_watch_status = action.payload;
        },
        resetPreferences: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPreferences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPreferences.fulfilled, (state, action) => {
                state.loading = false;
                Object.assign(state, action.payload);
            })
            .addCase(fetchPreferences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch preferences";
            })
            .addCase(savePreferences.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
            });
    },
});

export const { setTheme, setDefaultWatchStatus, resetPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
