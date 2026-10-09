interface LoadingStateProps {
    text?: string;
    size?: "page" | "section";
}

const LoadingState = ({ text = 'Loading...', size = "page" }: LoadingStateProps) => {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex items-center justify-center w-full px-6 ${size === "page" ? "min-h-[60vh] py-12" : "py-10"}`}
        >
            <div className="flex flex-col items-center">
                {/* Dual ring spinner */}
                <div className="relative w-14 h-14 mb-4">
                    <div className="absolute inset-0 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-accent-400 border-b-transparent rounded-full animate-spin-reverse"></div>
                </div>
                <p className="text-sm text-zinc-300 font-medium tracking-wide animate-pulse">
                    {text}
                </p>
            </div>
        </div>
    );
}

export default LoadingState;
