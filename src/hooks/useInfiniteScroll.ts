import { useEffect, type RefObject } from "react";

export const useInfiniteScroll = (
    ref: RefObject<HTMLDivElement | null>,
    fetchFn: () => void,
    isFetching: boolean,
    hasMore: boolean
) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore && !isFetching) {
                fetchFn();
            }
        })

        observer.observe(element);

        return () => observer.unobserve(element);
    }, [fetchFn, isFetching, hasMore]);
}