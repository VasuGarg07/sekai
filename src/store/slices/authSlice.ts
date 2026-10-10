import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, type PayloadAction } from "@reduxjs/toolkit";
import {
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    reload,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { getAuthErrorMessage, sendVerification } from "../../shared/auth";
import { fireAuth } from "../../shared/firebase";
import { registerProfile } from "../../shared/firestore";
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

export const loginWithEmail = createAsyncThunk(
    "auth/loginWithEmail",
    async ({ email, password }: { email: string; password: string }) => {
        const { user } = await signInWithEmailAndPassword(fireAuth, email.trim(), password);
        return serializeUser(user);
    }
);

export const signUpWithEmail = createAsyncThunk(
    "auth/signUpWithEmail",
    async ({ name, email, password }: { name: string; email: string; password: string }) => {
        const { user } = await createUserWithEmailAndPassword(fireAuth, email.trim(), password);

        // The account exists from here on, so the remaining steps must not fail the sign-up
        try {
            // Name first: the verification email greets the user by name
            await updateProfile(user, { displayName: name.trim() });
            // The auth listener may already have created the profile without the name
            await registerProfile(user);
        } catch (error) {
            console.warn("Couldn't save the display name:", error);
        }
        await sendVerification(user);

        return serializeUser(user);
    }
);

/** Re-reads the user from Firebase, e.g. after they verified their email in another tab. */
export const reloadUser = createAsyncThunk("auth/reloadUser", async () => {
    const user = fireAuth.currentUser;
    if (!user) return null;
    await reload(user);
    return serializeUser(user);
});

export const logout = createAsyncThunk("auth/logout", async () => {
    await signOut(fireAuth);
    return null;
});

const loginThunks = [loginWithGoogle, loginWithGitHub, loginWithEmail, signUpWithEmail] as const;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<SekaiUser | null>) {
            state.user = action.payload;
            state.initialized = true;
        },
        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(reloadUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            .addMatcher(isPending(...loginThunks), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(isFulfilled(...loginThunks), (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addMatcher(isRejected(...loginThunks), (state, action) => {
                state.loading = false;
                state.error = getAuthErrorMessage(action.error.code, "Login failed. Please try again.");
            });
    },
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
