import { useNavigate } from "react-router";

export function useAnimeNavigation() {
    const navigate = useNavigate();

    const goToAnime = (id: number) => {
        if (!id) return;
        navigate(`/anime/${id}`);
    };

    return { goToAnime };
}