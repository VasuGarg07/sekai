import { Palette } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/reduxHooks';
import { setTheme } from '../store/slices/themeSlice';

export default function ThemeSelector() {
    const dispatch = useAppDispatch();
    const { currentTheme, availableThemes } = useAppSelector((state) => state.theme);

    const handleThemeChange = (themeName: string) => {
        dispatch(setTheme(themeName));
    };

    return (
        <div className="p-2">
            {/* Theme Selector Header */}
            <div className="flex items-center gap-3 px-4 py-1.5 text-sm text-zinc-300 mb-2">
                <Palette size={16} className="text-accent-500" />
                <span>Theme</span>
            </div>

            {/* Color Options */}
            <div className="flex items-center justify-center gap-3 px-4 pb-1">
                {availableThemes.map((theme) => (
                    <button
                        key={theme.name}
                        onClick={() => handleThemeChange(theme.name)}
                        className={`w-6 h-6 rounded-sm transition-all hover:scale-110 ${currentTheme === theme.name
                            ? 'ring-1 ring-white ring-offset-2 ring-offset-zinc-800'
                            : 'hover:ring-1 hover:ring-zinc-500'
                            }`}
                    >
                        <div className={`w-full h-full rounded-sm bg-${theme.name}-500`} />
                    </button>
                ))}
            </div>

        </div>
    );
};