import AnimeShowcase from "./AnimeShowcase"
import CurrentSeasonAnime from "./CurrentSeasonAnime"
import SpotlightCarousel from "./SpotlightCarousel";

const Homepage = () => {
    return (
        <>
            <SpotlightCarousel />
            <AnimeShowcase />
            <CurrentSeasonAnime />
        </>
    )
}

export default Homepage;