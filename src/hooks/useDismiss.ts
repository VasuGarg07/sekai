import { useEffect, useRef, type RefObject } from "react";

/**
 * Calls `onDismiss` when the user clicks outside `ref` or presses Escape.
 * Used by dropdown menus and the search results popup.
 */
export function useDismiss<T extends HTMLElement | null>(
    ref: RefObject<T>,
    onDismiss: () => void,
    enabled = true,
) {
    // Keep the latest callback without re-attaching listeners on every render
    const callbackRef = useRef(onDismiss);
    useEffect(() => {
        callbackRef.current = onDismiss;
    });

    useEffect(() => {
        if (!enabled) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callbackRef.current();
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") callbackRef.current();
        };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [ref, enabled]);
}
