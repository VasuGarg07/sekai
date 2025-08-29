import { ShowcaseStrip } from "../../components/ShowcaseStrip";

export default function AnimeShowcase() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-4 px-4 sm:px-6 lg:px-8 bg-slate-900">
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
