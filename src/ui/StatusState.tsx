import type { ReactNode } from "react";

export type StatusTone = "neutral" | "error";

export interface StatusStateProps {
    title: string;
    message?: ReactNode;
    /** Illustration in /public; omitted for a text-only state */
    image?: string;
    tone?: StatusTone;
    /** Buttons or links shown under the message */
    actions?: ReactNode;
    /**
     * "page" fills most of the viewport (whole-page states),
     * "section" is sized for a block inside a page (e.g. a homepage row).
     */
    size?: "page" | "section";
}

const toneStyles: Record<StatusTone, { glow: string; title: string }> = {
    neutral: { glow: "bg-accent-500/15", title: "text-white" },
    error: { glow: "bg-red-500/15", title: "text-red-100" },
};

/** Shared layout for empty, error and "not available" states. */
export default function StatusState({
    title,
    message,
    image,
    tone = "neutral",
    actions,
    size = "page",
}: StatusStateProps) {
    const styles = toneStyles[tone];

    return (
        <div
            role={tone === "error" ? "alert" : "status"}
            className={`w-full flex flex-col items-center justify-center text-center px-6 ${size === "page" ? "min-h-[60vh] py-12" : "py-10"
                }`}
        >
            {image && (
                <div className="relative mb-6">
                    {/* Soft glow so the transparent illustration doesn't float on flat grey */}
                    <div className={`absolute inset-4 rounded-full blur-3xl ${styles.glow}`} aria-hidden="true" />
                    <img
                        src={image}
                        alt=""
                        className={`relative object-contain drop-shadow-xl ${size === "page" ? "h-40 sm:h-48" : "h-28 sm:h-32"}`}
                        loading="lazy"
                    />
                </div>
            )}

            <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${styles.title}`}>
                {title}
            </h2>

            {message && (
                <p className="mt-2 max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed">
                    {message}
                </p>
            )}

            {actions && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
}
