import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { upsertPreferences, updatePreferences } from "../../shared/firestore";
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

export const initPreferences = createAsyncThunk(
    "preferences/initPreferences",
    async (uid: string, { rejectWithValue }) => {
        const result = await upsertPreferences(uid);
        if (!result.success) return rejectWithValue("Failed to load preferences");
        return result.data;
    }
);

export const savePreferences = createAsyncThunk(
    "preferences/savePreferences",
    async ({ uid, updates }: { uid: string; updates: Partial<UserPreferences> }, { rejectWithValue }) => {
        const result = await updatePreferences(uid, updates);
        if (!result.success) return rejectWithValue("Failed to save preferences");
        return updates;
    }
);

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
        resetPreferences: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(initPreferences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initPreferences.fulfilled, (state, action) => {
                state.loading = false;
                Object.assign(state, action.payload);
            })
            .addCase(initPreferences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(savePreferences.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
            })
            .addCase(savePreferences.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { setTheme, setDefaultWatchStatus, resetPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;