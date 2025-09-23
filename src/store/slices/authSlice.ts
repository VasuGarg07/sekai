import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { fireAuth } from "../../shared/firebase";
import { registerProfile } from "../../shared/firestore";
import { serializeUser } from "../../shared/utilities";

interface AuthState {
    user: {
        uid: string;
        email: string | null;
        displayName: string | null;
        photoURL: string | null;
    } | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

// --- Async Thunks ---
export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(fireAuth, provider);
    await registerProfile(user);
    return serializeUser(user);
});

export const loginWithGitHub = createAsyncThunk("auth/loginWithGitHub", async () => {
    const provider = new GithubAuthProvider();
    const { user } = await signInWithPopup(fireAuth, provider);
    await registerProfile(user);
    return serializeUser(user);
});


export const logout = createAsyncThunk("auth/logout", async () => {
    await signOut(fireAuth);
    return null;
});

// --- Slice ---
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
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
                state.error = action.error.message ?? "Google login failed";
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
                state.error = action.error.message ?? "GitHub login failed";
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
