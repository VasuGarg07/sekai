import { User } from 'lucide-react';
import { useTheme } from '../stores/themeStore';
import NavMenu from './NavMenu';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router';

const Header = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    return (
        <>
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">

                        {/* Left Section - Menu & Logo */}
                        <div className="flex items-center space-x-4">
                            {/* Menu Button */}
                            <NavMenu />

                            {/* Logo */}
                            <div className="flex items-center space-x-3" onClick={() => navigate('/')}>
                                <div className="flex-shrink-0 hover:cursor-pointer">
                                    <img
                                        src={isDark ? "/logo_white.png" : "/logo.png"}
                                        alt="Sekai Logo"
                                        className="h-12 w-12 object-contain"
                                    />
                                </div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block hover:cursor-pointer">
                                    Sekai
                                </span>
                            </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex items-center space-x-2 sm:space-x-3 justify-items-end w-1/2">

                            {/* Search Button */}
                            <SearchBar className='grow' />

                            {/* Theme Toggle */}
                            {/* <ToggleTheme /> */}

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