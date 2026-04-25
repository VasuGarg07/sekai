import { useEffect, type RefObject } from "react"

export function useClickOutside<T extends HTMLElement | null>(ref: RefObject<T>, callback: () => void) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        }

        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [ref]);
}