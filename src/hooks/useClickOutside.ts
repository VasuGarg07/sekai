import { useEffect, useRef, type RefObject } from "react"

export function useClickOutside<T extends HTMLElement | null>(ref: RefObject<T>, callback: () => void) {
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callbackRef.current();
            }
        }

        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [ref]);
}