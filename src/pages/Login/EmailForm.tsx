import { MailCheck } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import PasswordField from "../../components/PasswordField";
import { sendPasswordReset } from "../../shared/auth";
import { isStrongPassword } from "../../shared/passwordRules";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { clearAuthError, loginWithEmail, signUpWithEmail } from "../../store/slices/authSlice";
import { inputClass, labelClass } from "../../ui/formClasses";
import { toastService } from "../../ui/toastService";

export type EmailMode = "signin" | "signup" | "reset";

interface EmailFormProps {
    mode: EmailMode;
    onModeChange: (mode: EmailMode) => void;
}

const SUBMIT_LABELS: Record<EmailMode, { idle: string; busy: string }> = {
    signin: { idle: "Sign in", busy: "Signing in..." },
    signup: { idle: "Create account", busy: "Creating account..." },
    reset: { idle: "Send reset link", busy: "Sending..." },
};

const linkButtonClass = "text-accent-400 hover:underline cursor-pointer";

export default function EmailForm({ mode, onModeChange }: EmailFormProps) {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.auth.loading);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetState, setResetState] = useState<"idle" | "sending" | "sent">("idle");
    const [resetError, setResetError] = useState<string | null>(null);

    const nameId = useId();
    const emailId = useId();

    const busy = loading || resetState === "sending";
    const canSubmit =
        mode === "signup" ? !!name.trim() && !!email.trim() && isStrongPassword(password)
            : mode === "signin" ? !!email.trim() && !!password
                : !!email.trim();

    const switchTo = (next: EmailMode) => {
        dispatch(clearAuthError());
        setPassword("");
        setResetState("idle");
        setResetError(null);
        onModeChange(next);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!canSubmit || busy) return;

        if (mode === "signin") {
            dispatch(loginWithEmail({ email, password }));
        } else if (mode === "signup") {
            dispatch(signUpWithEmail({ name, email, password }))
                .unwrap()
                .then(() => toastService.success("Account created. We've emailed you a link to verify your address."))
                .catch(() => { /* shown under the form from the auth state */ });
        } else {
            setResetState("sending");
            setResetError(null);
            const result = await sendPasswordReset(email);
            if (result.success) {
                setResetState("sent");
            } else {
                setResetState("idle");
                setResetError(result.message);
            }
        }
    };

    if (mode === "reset" && resetState === "sent") {
        return (
            <div className="text-center">
                <MailCheck className="w-10 h-10 mx-auto text-accent-400 mb-3" aria-hidden="true" />
                <p className="text-sm text-zinc-200">
                    If an account exists for <span className="font-medium text-white">{email.trim()}</span>, we've sent it a link to reset the password.
                </p>
                <p className="text-xs text-zinc-400 mt-2">It can take a minute to arrive. Check your spam folder too.</p>
                <button type="button" onClick={() => switchTo("signin")} className={`${linkButtonClass} text-sm mt-5`}>
                    Back to sign in
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === "reset" && (
                <p className="text-sm text-zinc-300">
                    Enter the email you signed up with and we'll send you a link to choose a new password.
                </p>
            )}

            {mode === "signup" && (
                <div>
                    <label htmlFor={nameId} className={labelClass}>Name</label>
                    <input
                        id={nameId}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        maxLength={50}
                        required
                        className={inputClass}
                    />
                </div>
            )}

            <div>
                <label htmlFor={emailId} className={labelClass}>Email</label>
                <input
                    id={emailId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className={inputClass}
                />
            </div>

            {mode !== "reset" && (
                <PasswordField
                    value={password}
                    onChange={setPassword}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    showRules={mode === "signup"}
                />
            )}

            {mode === "signin" && (
                <div className="flex justify-end -mt-2">
                    <button type="button" onClick={() => switchTo("reset")} className={`${linkButtonClass} text-xs`}>
                        Forgot password?
                    </button>
                </div>
            )}

            {resetError && <p className="text-sm text-accent-400 text-center">{resetError}</p>}

            <button
                type="submit"
                disabled={!canSubmit || busy}
                className="w-full bg-accent-600 hover:bg-accent-700 text-white py-2 rounded-lg font-medium cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {busy ? SUBMIT_LABELS[mode].busy : SUBMIT_LABELS[mode].idle}
            </button>

            <p className="text-sm text-zinc-400 text-center">
                {mode === "signin" && (
                    <>New here? <button type="button" onClick={() => switchTo("signup")} className={linkButtonClass}>Create an account</button></>
                )}
                {mode === "signup" && (
                    <>Already have an account? <button type="button" onClick={() => switchTo("signin")} className={linkButtonClass}>Sign in</button></>
                )}
                {mode === "reset" && (
                    <button type="button" onClick={() => switchTo("signin")} className={linkButtonClass}>Back to sign in</button>
                )}
            </p>
        </form>
    );
}
