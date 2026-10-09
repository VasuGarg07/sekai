import type { AnimeWatchList } from "./interfaces";
import { formatDateEpoch, formatKey } from "./utilities";
import Papa from 'papaparse';

interface FormattedAnimeData {
    id: number;
    titleEnglish: string;
    titleRomaji: string;
    type: string;
    episodes: string;
    duration: string;
    score: string;
    status: string;
    watchStatus: string;
    season: string;
    seasonYear: string;
    genres: string;
    synopsis: string;
    addedAt: string;
    image: string;
}

// Format the data consistently for all export types
const formatData = (items: AnimeWatchList[]): FormattedAnimeData[] => {
    return items.map(item => ({
        id: item.id,
        titleEnglish: item.title_english || "N/A",
        titleRomaji: item.title_romaji || "N/A",
        type: item.type || "N/A",
        episodes: item.episodes?.toString() || "N/A",
        duration: item.duration ? `${item.duration} mins` : "N/A",
        score: item.score?.toString() || "N/A",
        status: item.status || "N/A",
        watchStatus: formatKey(item.watchStatus),
        season: item.season || "N/A",
        seasonYear: item.seasonYear?.toString() || "N/A",
        genres: item.genres?.length ? item.genres.join(", ") : "N/A",
        // Raw text: each exporter does its own escaping (Papa for CSV, escapeXML for XML)
        synopsis: item.synopsis || "N/A",
        addedAt: formatDateEpoch(item.addedAt),
        image: item.image || "N/A"
    }));
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Revoke after the click has been handled; revoking synchronously can cancel the download in some browsers
    setTimeout(() => URL.revokeObjectURL(url), 0);
};

const escapeXML = (str: string | number): string => {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

const toCSV = (items: AnimeWatchList[]): void => {
    const formattedData = formatData(items);

    const csvContent = Papa.unparse(formattedData, {
        quotes: true,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ",",
        header: true,
        newline: "\n",
    });

    downloadFile(csvContent, "watchlist.csv", "text/csv");
};

const toJSON = (items: AnimeWatchList[]): void => {
    const formattedData = formatData(items);
    const jsonContent = JSON.stringify(formattedData, null, 2);
    downloadFile(jsonContent, "watchlist.json", "application/json");
};

const toXML = (items: AnimeWatchList[]): void => {
    const formattedData = formatData(items);

    const xmlItems = formattedData.map(item => `
    <anime>
        <id>${item.id}</id>
        <titleEnglish>${escapeXML(item.titleEnglish)}</titleEnglish>
        <titleRomaji>${escapeXML(item.titleRomaji)}</titleRomaji>
        <type>${escapeXML(item.type)}</type>
        <episodes>${escapeXML(item.episodes)}</episodes>
        <duration>${escapeXML(item.duration)}</duration>
        <score>${escapeXML(item.score)}</score>
        <status>${escapeXML(item.status)}</status>
        <watchStatus>${escapeXML(item.watchStatus)}</watchStatus>
        <season>${escapeXML(item.season)}</season>
        <seasonYear>${escapeXML(item.seasonYear)}</seasonYear>
        <genres>${escapeXML(item.genres)}</genres>
        <synopsis>${escapeXML(item.synopsis)}</synopsis>
        <addedAt>${escapeXML(item.addedAt)}</addedAt>
        <image>${escapeXML(item.image)}</image>
    </anime>`).join("\n");

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<watchlist>
${xmlItems}
</watchlist>`;

    downloadFile(xmlContent, "watchlist.xml", "application/xml");
};

export const WatchlistExporter = {
    toCSV,
    toJSON,
    toXML
};