import type { ReactNode } from "react";
import StatusState from "./StatusState";

interface EmptyStateProps {
    title?: string;
    message: ReactNode;
    actions?: ReactNode;
    size?: "page" | "section";
}

export default function EmptyState({
    title = "Nothing here yet",
    message,
    actions,
    size,
}: EmptyStateProps) {
    return <StatusState image="/empty.png" title={title} message={message} actions={actions} size={size} />;
}
