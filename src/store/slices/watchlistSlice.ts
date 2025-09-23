import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WatchlistState {
    ids: string[];
}

const initialState: WatchlistState = {
    ids: [],
}

const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState,
    reducers: {
        setWatchlistIds(state, action: PayloadAction<string[]>) {
            state.ids = action.payload;
        },
        addWatchlistId(state, action: PayloadAction<string>) {
            if (!state.ids.includes(action.payload)) {
                state.ids.push(action.payload);
            }
        },
        removeWatchlistId(state, action: PayloadAction<string>) {
            state.ids = state.ids.filter((id) => id !== action.payload);
        },
        clearWatchlist(state) {
            state.ids = [];
        },
    }
});

export const { setWatchlistIds, addWatchlistId, removeWatchlistId, clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;