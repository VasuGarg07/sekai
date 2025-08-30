import AnimeShowcase from "./AnimeShowcase"
import CurrentSeasonAnime from "./CurrentSeasonAnime"
import SpotlightSection from "./Spotlight"

const Homepage = () => {
    return (
        <>
            <SpotlightSection />
            <AnimeShowcase />
            <CurrentSeasonAnime />
        </>
    )
}

export default Homepage;