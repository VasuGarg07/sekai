import { useState, type ReactNode } from "react";

interface TooltipProps {
    text: string;
    children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
    const [visible, setVisible] = useState(false);

    return (
        <span
            className="relative inline-flex items-center"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <span className="absolute top-full mt-2 w-56 bg-zinc-950 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-50">
                    {text}
                </span>
            )}
        </span>
    );
}
