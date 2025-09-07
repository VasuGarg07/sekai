import { Search, User } from 'lucide-react';
import { useTheme } from '../stores/themeStore';
import NavMenu from './NavMenu';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router';

const Header = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const handleFilterClick = () => navigate("/explore");

    return (
        <>
            {/* Header */}
            <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50 transition-colors duration-200">
                <div className="flex items-center justify-center h-16 mx-auto px-4 lg:px-10 gap-2">
                    {/* Menu Button */}
                    <NavMenu />

                    {/* Logo */}
                    <div className="flex items-center space-x-2" onClick={() => navigate('/')}>
                        <div className="flex-shrink-0 hover:cursor-pointer">
                            <img
                                src={isDark ? "/logo_white.png" : "/logo.png"}
                                alt="Sekai Logo"
                                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                            />
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-white hover:cursor-pointer">
                            Sekai
                        </span>
                    </div>

                    <span className='grow'></span>

                    {/* Search Button */}
                    <SearchBar className='grow hidden sm:block' />

                    <button className="p-2 rounded-lg text-zinc-400 block sm:hidden"
                        onClick={handleFilterClick}>
                        <Search size={20} />
                    </button>

                    {/* Theme Toggle */}
                    {/* <ToggleTheme /> */}

                    {/* User Menu */}
                    <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800">
                        <User size={20} />
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header