import { useTheme } from '../stores/themeStore';

const ToggleTheme = ({ className = '' }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg hover:bg-zinc-800 transition-all duration-200 active:scale-95 ${className}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
            <span className="transition-transform duration-300 hover:rotate-12">
                {isDark ? '☀️' : '🌙'}
            </span>
        </button>
    );
};

export default ToggleTheme;