import { useState, useId, type ReactNode } from "react";

interface TooltipProps {
    text: string;
    children: ReactNode;
    position?: "top" | "bottom";
}

export default function Tooltip({ text, children, position = "bottom" }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const tooltipId = useId();

    const positionClass =
        position === "top"
            ? "bottom-full mb-2"
            : "top-full mt-2";

    return (
        <span
            className="relative inline-flex items-center"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
            onTouchStart={() => setVisible(v => !v)}
            aria-describedby={visible ? tooltipId : undefined}
        >
            {children}
            {visible && (
                <span
                    id={tooltipId}
                    role="tooltip"
                    className={`absolute left-1/2 -translate-x-1/2 ${positionClass} w-56 bg-zinc-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-50 pointer-events-none`}
                >
                    {text}
                </span>
            )}
        </span>
    );
}