import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_PREFERENCES } from "../../shared/constants";
import { upsertPreferences } from "../../shared/firestore";
import type { UserPreferences } from "../../shared/interfaces";

interface PreferencesState extends UserPreferences {
    loading: boolean;
    error: string | null;
}

const initialState: PreferencesState = {
    ...DEFAULT_PREFERENCES,
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

const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        /** Applies (or rolls back) preference values locally. Persisting is done by the mutation hooks. */
        applyPreferences(state, action: PayloadAction<Partial<UserPreferences>>) {
            Object.assign(state, action.payload);
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
            });
    },
});

export const { applyPreferences, resetPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
