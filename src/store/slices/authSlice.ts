import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { fireAuth } from "../../shared/firebase";
import { serializeUser } from "../../shared/utilities";
import type { SekaiUser } from "../../shared/interfaces";

interface AuthState {
    user: SekaiUser | null;
    /** True once Firebase has reported the initial auth state (restored session or signed out). */
    initialized: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    initialized: false,
    loading: false,
    error: null,
};

export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(fireAuth, provider);
    return serializeUser(user);
});

export const loginWithGitHub = createAsyncThunk("auth/loginWithGitHub", async () => {
    const provider = new GithubAuthProvider();
    const { user } = await signInWithPopup(fireAuth, provider);
    return serializeUser(user);
});

export const logout = createAsyncThunk("auth/logout", async () => {
    await signOut(fireAuth);
    return null;
});

const getAuthErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
        case "auth/popup-closed-by-user":
            return "Login canceled.";
        case "auth/network-request-failed":
            return "Network error, please try again.";
        default:
            return "Login failed. Please try again.";
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<SekaiUser | null>) {
            state.user = action.payload;
            state.initialized = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = getAuthErrorMessage(action.error.code);
            })
            .addCase(loginWithGitHub.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGitHub.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginWithGitHub.rejected, (state, action) => {
                state.loading = false;
                state.error = getAuthErrorMessage(action.error.code);
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;