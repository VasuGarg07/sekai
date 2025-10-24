import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AnimeWatchList } from "../../shared/interfaces";

interface WatchlistState {
    items: AnimeWatchList[];
}

const initialState: WatchlistState = {
    items: [],
}

const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState,
    reducers: {
        setWatchlist(state, action: PayloadAction<AnimeWatchList[]>) {
            state.items = action.payload;
        },
        addItemToWatchlist(state, action: PayloadAction<AnimeWatchList>) {
            if (!state.items.includes(action.payload)) {
                state.items.push(action.payload);
            }
        },
        removeItemFromWatchlist(state, action: PayloadAction<string | number>) {
            state.items = state.items.filter((item) => item.id != action.payload);
        },
        updateWatchlistStatus(state, action: PayloadAction<{ id: string | number; status: string }>) {
            const item = state.items.find((item) => item.id == action.payload.id);
            if (item) {
                item.status = action.payload.status;
            }
        },
        clearWatchlist(state) {
            state.items = [];
        },
    }
});

export const { setWatchlist, addItemToWatchlist, removeItemFromWatchlist, clearWatchlist, updateWatchlistStatus } = watchlistSlice.actions;
export default watchlistSlice.reducer;