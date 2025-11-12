import ProfileBanner from "../../components/ProfileBanner";
import { ExportWatchlist } from "./ExportWatchlist";
import { DefaultWatchStatus } from "./DefaultWatchStatus";
import { ThemeSelector } from "./ThemeSelector";

export default function Settings() {

    return (
        <>
            <ProfileBanner />
            <div className="bg-zinc-900 px-4 sm:px-6 lg:px-8 py-4 text-white">

                <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 space-y-10">
                    <ThemeSelector />
                    <DefaultWatchStatus />
                    <ExportWatchlist />
                </div>
            </div>
        </>
    )
}