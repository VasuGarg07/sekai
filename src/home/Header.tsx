import {
    Filter,
    Search,
    User
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../stores/themeStore';
import NavMenu from './NavMenu';
import ToggleTheme from './ToggleTheme';

const Header = () => {
    const { isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');


    return (
        <>
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Left Section - Menu & Logo */}
                        <div className="flex items-center space-x-4">
                            {/* Menu Button */}
                            <NavMenu />

                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <img
                                        src={isDark ? "/logo_white.png" : "/logo.png"}
                                        alt="Sekai Logo"
                                        className="h-12 w-12 object-contain"
                                    />
                                </div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">
                                    Sekai
                                </span>
                            </div>
                        </div>

                        {/* Center Section - Search */}
                        <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search anime..."
                                    className="block w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex items-center space-x-2 sm:space-x-3">

                            {/* Filter Button */}
                            <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Filter size={20} />
                            </button>

                            {/* Theme Toggle */}
                            <ToggleTheme />

                            {/* User Menu */}
                            <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <User size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header