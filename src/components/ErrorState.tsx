import { AlertCircle } from "lucide-react";

export default function ErrorState({ message }: { message: string }) {
    return (
        <div className="bg-red-900 border border-red-400 p-6 rounded-lg max-w-3xl mx-auto">
            <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
                <h3 className="text-lg font-semibold text-red-200">Error Loading Anime</h3>
            </div>
            <p className="text-red-300">{message}</p>
        </div>
    );
}
