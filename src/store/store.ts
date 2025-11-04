import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import watchlistReducer from './slices/watchlistSlice';
import preferencesReducer from './slices/preferencesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        watchlist: watchlistReducer,
        preferences: preferencesReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
