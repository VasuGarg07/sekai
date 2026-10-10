import { KeyRound, MailWarning, UserRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import PasswordField from "../../components/PasswordField";
import { resendVerification, setPassword } from "../../shared/auth";
import { isStrongPassword } from "../../shared/passwordRules";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { reloadUser } from "../../store/slices/authSlice";
import { toastService } from "../../ui/toastService";
import { SectionLayout } from "./SectionLayout";

const PROVIDER_LABELS: Record<string, string> = {
    "google.com": "Google",
    "github.com": "GitHub",
    "password": "Email & password",
};

const secondaryButtonClass = "px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
const primaryButtonClass = "px-4 py-2 rounded-lg text-sm font-medium bg-accent-600 hover:bg-accent-700 text-white transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

export const AccountSettings = () => {
    const user = useAppSelector(state => state.auth.user);
    const dispatch = useAppDispatch();

    const hasPassword = !!user?.providers.includes("password");
    const needsVerification = hasPassword && !user?.emailVerified;

    // Picks up a verification done in another tab or on another device since this session started
    useEffect(() => {
        if (needsVerification) dispatch(reloadUser());
    }, [needsVerification, dispatch]);

    if (!user) return null;

    const methods = user.providers.map(p => PROVIDER_LABELS[p] ?? p).join(", ");

    return (
        <SectionLayout
            icon={<UserRound size={24} className="text-accent-500" />}
            title="Account"
            description="How you sign in to Sekai."
        >
            <dl className="rounded-lg border border-zinc-700 bg-zinc-800/40 px-4 py-3 space-y-2 text-sm">
                <div className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-zinc-400">Email</dt>
                    <dd className="text-white break-all">{user.email ?? "Not available"}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-zinc-400">Sign-in methods</dt>
                    <dd className="text-white">{methods || "None"}</dd>
                </div>
            </dl>

            {needsVerification && <VerifyEmailNote />}
            {!hasPassword && user.email && <SetPasswordForm email={user.email} />}
        </SectionLayout>
    );
};

function VerifyEmailNote() {
    const dispatch = useAppDispatch();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [checking, setChecking] = useState(false);

    const handleResend = async () => {
        setSending(true);
        const result = await resendVerification();
        setSending(false);
        if (result.success) {
            setSent(true);
            toastService.success("Verification email sent. Check your spam folder too.");
        } else {
            toastService.error(result.message);
        }
    };

    const handleCheck = async () => {
        setChecking(true);
        try {
            const user = await dispatch(reloadUser()).unwrap();
            if (user?.emailVerified) toastService.success("Email verified. Thanks!");
            else toastService.info("Not verified yet. Open the link in the email, then try again.");
        } catch {
            toastService.error("Couldn't check right now. Please try again.");
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="mt-4 rounded-lg border border-yellow-700/60 bg-yellow-900/20 px-4 py-3">
            <div className="flex gap-3">
                <MailWarning className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                    <p className="text-sm font-medium text-white">Verify your email</p>
                    <p className="text-xs text-zinc-300 mt-1">
                        We sent you a link when you signed up. Verifying makes sure you can reset your password if you ever forget it.
                        It's optional, and everything works without it.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <button type="button" onClick={handleResend} disabled={sending || sent} className={secondaryButtonClass}>
                            {sending ? "Sending..." : sent ? "Email sent" : "Resend email"}
                        </button>
                        <button type="button" onClick={handleCheck} disabled={checking} className={secondaryButtonClass}>
                            {checking ? "Checking..." : "I've verified it"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SetPasswordForm({ email }: { email: string }) {
    const dispatch = useAppDispatch();
    const [password, setPasswordValue] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isStrongPassword(password) || saving) return;

        setSaving(true);
        const result = await setPassword(password);
        setSaving(false);

        if (result.success) {
            toastService.success("Password set. You can now also sign in with your email.");
            setPasswordValue("");
            dispatch(reloadUser());
        } else {
            toastService.error(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800/40 px-4 py-3 space-y-3" noValidate>
            <div className="flex gap-3">
                <KeyRound className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                    <p className="text-sm font-medium text-white">Set a password</p>
                    <p className="text-xs text-zinc-400 mt-1">
                        Add a password to also sign in with <span className="text-zinc-200">{email}</span>, for example in the mobile app.
                    </p>
                </div>
            </div>

            {/* Lets password managers save the new password against the right account */}
            <input type="email" value={email} autoComplete="username" readOnly hidden />
            <PasswordField value={password} onChange={setPasswordValue} label="New password" autoComplete="new-password" showRules />

            <div className="flex justify-end">
                <button type="submit" disabled={!isStrongPassword(password) || saving} className={primaryButtonClass}>
                    {saving ? "Saving..." : "Set password"}
                </button>
            </div>
        </form>
    );
}
