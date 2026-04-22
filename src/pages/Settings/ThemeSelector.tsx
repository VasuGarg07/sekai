import { Palette } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAppSelector } from "../../store/reduxHooks";
import { SectionLayout } from "./SectionLayout";
import { AVAILABLE_THEMES } from "../../shared/constants";

export const ThemeSelector = () => {
    const { mutate: setTheme, isPending } = useTheme();
    const app_theme = useAppSelector((state) => state.preferences.app_theme);

    const handleThemeChange = (themeName: string) => {
        if (isPending) return;
        setTheme(themeName);
    };

    return (
        <SectionLayout
            icon={<Palette size={24} className="text-accent-500" />}
            title="App Theme"
            description="Personalize your experience by selecting your preferred accent color."
        >
            <div className="flex flex-wrap gap-4">
                {AVAILABLE_THEMES.map((theme) => (
                    <div key={theme.name} className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleThemeChange(theme.name)}
                            disabled={isPending}
                            aria-label={`Select ${theme.label} theme`}
                            className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-200 
                                hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-zinc-900
                                ${app_theme === theme.name ? "ring-2 ring-white shadow-lg scale-105" : "hover:ring-2 hover:ring-zinc-600"}`}
                        >
                            <div className={`absolute inset-0 rounded-lg ${theme.className}`} />
                            {app_theme === theme.name && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-white drop-shadow-md"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                        <span className="text-xs text-zinc-400">{theme.label}</span>
                    </div>
                ))}
            </div>
        </SectionLayout>
    );
};