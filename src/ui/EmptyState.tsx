import { Frown } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    message: string;
}

export default function EmptyState({
    title = "No Anime Found",
    message,
}: EmptyStateProps) {
    return (
        <div className="w-full min-h-80 max-w-4xl mx-auto p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 w-56 md:w-64 lg:w-72">
                <img
                    src="/empty.png"
                    alt="Empty illustration"
                    className="w-full h-auto object-contain"
                />
            </div>
            <div className="flex items-start gap-4 flex-1 w-full">
                <div className="shrink-0 rounded-full border border-yellow-500/40 bg-yellow-500/10 p-3">
                    <Frown className="h-8 w-8 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-yellow-200 tracking-wide">
                        {title}
                    </h3>
                    <p className="mt-2 text-base text-yellow-300/90 leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
}