import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    message: string;
}

export default function ErrorState({
    title = "Error Loading Anime",
    message,
}: ErrorStateProps) {
    return (
        <div className="w-full min-h-120 max-w-4xl mx-auto p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0 w-44 md:w-52 lg:w-60">
                <img
                    src="/not_found.png"
                    alt="Error illustration"
                    className="w-full h-auto object-contain"
                />
            </div>
            <div className="flex items-start gap-4 flex-1 w-full">
                <div className="shrink-0 rounded-full border border-red-500/40 bg-red-500/20 p-3 hidden sm:block">
                    <AlertCircle className="h-8 w-8 text-red-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-red-200 tracking-wide">
                        {title}
                    </h3>
                    <p className="mt-2 text-base text-red-300/90 leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
}