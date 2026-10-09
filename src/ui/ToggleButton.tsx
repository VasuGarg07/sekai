import { LayoutGrid, Grip } from "lucide-react";

interface ToggleButtonProps {
    showTiles: boolean;
    setShowTiles: (value: boolean) => void;
}

export default function ToggleButton({ showTiles, setShowTiles }: ToggleButtonProps) {
    return (
        <div role="group" aria-label="View" className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg">
            {/* Tiles view */}
            <button
                type="button"
                aria-label="Tile view"
                title="Tile view"
                aria-pressed={showTiles}
                onClick={() => setShowTiles(true)}
                className={`p-1 rounded-md transition-colors duration-300 ${showTiles ? "bg-accent-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
            >
                <LayoutGrid className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Large cards view */}
            <button
                type="button"
                aria-label="Grid view"
                title="Grid view"
                aria-pressed={!showTiles}
                onClick={() => setShowTiles(false)}
                className={`p-1 rounded-md transition ${!showTiles ? "bg-accent-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
            >
                <Grip className="w-5 h-5" aria-hidden="true" />
            </button>
        </div>
    );
}
