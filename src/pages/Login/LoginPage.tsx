import { Navigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { loginWithGoogle, loginWithGitHub } from "../../store/slices/authSlice";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const { user, loading, error } = useAppSelector((state) => state.auth);

    if (user) return <Navigate to="/" replace />;

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-zinc-900 text-white overflow-hidden px-4">
            {/* Sparkles background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Sparkles className="absolute top-10 left-10 text-accent-500 opacity-30 animate-[spin_3s_linear_infinite] w-8 h-8" />
                <Sparkles className="absolute bottom-20 right-16 text-accent-400 opacity-30 animate-spin-reverse w-6 h-6" />
                <Sparkles className="absolute top-1/3 right-1/4 text-accent-600 opacity-20 animate-bounce w-10 h-10" />
                <Sparkles className="absolute bottom-1/3 left-1/4 text-accent-300 opacity-20 animate-bounce w-12 h-12" />
            </div>

            {/* Card */}
            <div className="relative w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-2xl p-8 shadow-xl">
                {/* Logo + App Name */}
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo_white.png" alt="Sekai Logo" className="h-12 w-12 mb-2" />
                    <h1 className="text-2xl font-bold">Sekai</h1>
                </div>

                {/* Google Login */}
                <button
                    onClick={() => dispatch(loginWithGoogle())}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 hover:bg-gray-300 transition py-2 rounded-lg font-medium cursor-pointer mb-4"
                >
                    <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="Google"
                        className="h-5 w-5"
                    />
                    Continue with Google
                </button>

                {/* GitHub Login */}
                <button
                    onClick={() => dispatch(loginWithGitHub())}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 transition py-2 rounded-lg font-medium cursor-pointer"
                >
                    <img
                        src="https://www.svgrepo.com/show/475654/github-color.svg"
                        alt="GitHub"
                        className="h-5 w-5"
                    />
                    Continue with GitHub
                </button>

                {/* Error */}
                {error && <p className="mt-4 text-sm text-accent-400 text-center">{error}</p>}

                {/* Footer */}
                <p className="mt-6 text-xs text-zinc-500 text-center">
                    © {new Date().getFullYear()} Sekai. All rights reserved.
                </p>
            </div>
        </div>
    );
}
