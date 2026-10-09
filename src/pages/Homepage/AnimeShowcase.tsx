import { ShowcaseStrip } from "../../components/ShowcaseStrip";

export default function AnimeShowcase() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:p-4 lg:px-6 bg-zinc-900">
            <ShowcaseStrip
                title="Top Airing"
                path="/top-airing"
                sort={["TRENDING_DESC"]}
                status="RELEASING" />
            <ShowcaseStrip
                title="Most Popular"
                path="/popular"
                sort={["POPULARITY_DESC"]} />
            <ShowcaseStrip
                title="Most Favourite"
                path="/favourite"
                sort={["FAVOURITES_DESC"]} />
            <ShowcaseStrip
                title="Latest Completed"
                path="/completed"
                sort={["END_DATE_DESC"]}
                status="FINISHED" />
        </div>
    );
}
