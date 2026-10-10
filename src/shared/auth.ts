import {
    EmailAuthProvider,
    linkWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    type User,
} from "firebase/auth";
import { fireAuth } from "./firebase";

type AuthResult =
    | { success: true }
    | { success: false; message: string };

export const getAuthErrorMessage = (errorCode?: string, fallback = "Something went wrong. Please try again.") => {
    switch (errorCode) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
            return "Login canceled.";
        case "auth/network-request-failed":
            return "Network error, please try again.";
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Incorrect email or password.";
        case "auth/invalid-email":
            return "That email address doesn't look right.";
        case "auth/email-already-in-use":
            return "An account with this email already exists. Sign in instead, or continue with Google.";
        case "auth/account-exists-with-different-credential":
            return "An account with this email already exists. Sign in the way you did before.";
        case "auth/weak-password":
        case "auth/password-does-not-meet-requirements":
            return "That password doesn't meet the requirements.";
        case "auth/too-many-requests":
            return "Too many attempts. Please wait a few minutes and try again.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        case "auth/requires-recent-login":
            return "For security, sign out and sign in again, then try once more.";
        case "auth/provider-already-linked":
            return "Your account already has a password.";
        case "auth/credential-already-in-use":
            return "This email is already used by another account.";
        default:
            return fallback;
    }
};

const errorCode = (error: unknown) => (error as { code?: string } | null)?.code;

/** Where the "Continue" button on Firebase's verify/reset pages takes the user. */
const actionCodeSettings = () => ({ url: window.location.origin });

export const sendVerification = async (user: User): Promise<AuthResult> => {
    try {
        await sendEmailVerification(user, actionCodeSettings());
        return { success: true };
    } catch (error) {
        return { success: false, message: getAuthErrorMessage(errorCode(error), "Couldn't send the verification email. Please try again.") };
    }
};

export const resendVerification = async (): Promise<AuthResult> => {
    const user = fireAuth.currentUser;
    if (!user) return { success: false, message: "Log in to verify your email." };
    return sendVerification(user);
};

/** Succeeds for unknown emails too, so the form can't be used to find out who has an account. */
export const sendPasswordReset = async (email: string): Promise<AuthResult> => {
    try {
        await sendPasswordResetEmail(fireAuth, email.trim(), actionCodeSettings());
        return { success: true };
    } catch (error) {
        const code = errorCode(error);
        if (code === "auth/user-not-found") return { success: true };
        return { success: false, message: getAuthErrorMessage(code, "Couldn't send the reset email. Please try again.") };
    }
};

/** Adds email + password sign-in to the current (Google/GitHub) account. */
export const setPassword = async (password: string): Promise<AuthResult> => {
    const user = fireAuth.currentUser;
    if (!user?.email) return { success: false, message: "Your account has no email address to sign in with." };

    try {
        await linkWithCredential(user, EmailAuthProvider.credential(user.email, password));
        return { success: true };
    } catch (error) {
        return { success: false, message: getAuthErrorMessage(errorCode(error), "Couldn't set your password. Please try again.") };
    }
};
