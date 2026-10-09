import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import StatusState from "./StatusState";
import { statusActionClass } from "./statusActionClass";

interface ErrorStateProps {
    title?: string;
    message: ReactNode;
    /** Shows a "Try again" button when provided */
    onRetry?: () => void;
    actions?: ReactNode;
    size?: "page" | "section";
}

export default function ErrorState({
    title = "Something went wrong",
    message,
    onRetry,
    actions,
    size,
}: ErrorStateProps) {
    return (
        <StatusState
            image="/not_found.png"
            tone="error"
            title={title}
            message={message}
            size={size}
            actions={(onRetry || actions) && (
                <>
                    {onRetry && (
                        <button type="button" onClick={onRetry} className={statusActionClass.primary}>
                            <RotateCw className="w-4 h-4" />
                            Try again
                        </button>
                    )}
                    {actions}
                </>
            )}
        />
    );
}
