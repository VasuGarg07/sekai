import { useNavigate } from "react-router";

/** URL of an anime's detail page */
export const animePath = (id: number) => `/anime/${id}`;

export function useAnimeNavigation() {
    const navigate = useNavigate();

    const goToAnime = (id: number) => {
        if (!id) return;
        navigate(`/anime/${id}`);
    };

    return { goToAnime };
}