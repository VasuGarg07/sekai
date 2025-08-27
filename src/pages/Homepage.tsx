import AnimeShowcase from "../components/AnimeShowcase"
import CurrentSeasonAnime from "../components/CurrentSeasonAnime"
import SpotlightSection from "../components/Spotlight"

const Homepage = () => {
    return (
        <>
            <SpotlightSection />
            <AnimeShowcase />
            <CurrentSeasonAnime />
        </>
    )
}

export default Homepage