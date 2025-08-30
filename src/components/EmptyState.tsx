import { Frown } from "lucide-react";

export default function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-yellow-900 border border-yellow-500 p-6 rounded-lg max-w-3xl mx-auto">
            <div className="flex items-center mb-4">
                <Frown className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-semibold text-yellow-200">No Anime Found</h3>
            </div>
            <p className="text-yellow-300">{message}</p>
        </div>
    );
}