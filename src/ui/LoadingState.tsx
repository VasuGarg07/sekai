interface LoadingStateProps {
    text?: string
}

const LoadingState = ({ text = 'Loading...' }: LoadingStateProps) => {
    return (
        <div className="flex items-center justify-center min-h-80 w-full max-w-6xl mx-auto p-10">
            <div className="flex flex-col items-center">
                {/* Dual ring spinner */}
                <div className="relative w-16 h-16 mb-4">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                    {/* Inner ring */}
                    <div className="absolute inset-2 border-4 border-accent-400 border-b-transparent rounded-full animate-spin-reverse"></div>
                </div>

                {/* Loading text */}
                <p className="text-gray-200 font-semibold tracking-wide animate-pulse">
                    {text}
                </p>
            </div>
        </div>
    );
}

export default LoadingState;