import { ShowcaseStrip } from "./ShowcaseStrip";

export function AnimeShowcase() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 bg-slate-900">
            <ShowcaseStrip
                title="Top Airing"
                queryKey="topAiring"
                sort={["TRENDING_DESC"]}
                status="RELEASING" />
            <ShowcaseStrip
                title="Most Popular"
                queryKey="mostPopular"
                sort={["POPULARITY_DESC"]} />
            <ShowcaseStrip
                title="Most Favourite"
                queryKey="mostFavourite"
                sort={["FAVOURITES_DESC"]} />
            <ShowcaseStrip
                title="Latest Completed"
                queryKey="latestCompleted"
                sort={["END_DATE_DESC"]}
                status="FINISHED" />
        </div>
    );
}
