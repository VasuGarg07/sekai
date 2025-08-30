import { Loader2 } from "lucide-react";

export default function LoadingState({ text }: { text: string }) {
    return (
        <div className="flex items-center justify-center min-h-64 bg-slate-800 rounded-lg max-w-6xl mx-auto">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                <p className="text-gray-300 font-medium">{text}</p>
            </div>
        </div>
    );
}
