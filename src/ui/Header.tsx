import { LogIn, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ProfileMenu from '../components/ProfileMenu';
import type { RootState } from '../store/store';
import NavMenu from './NavMenu';
import SearchBar from './SearchBar';
import Logo from '/logo_white.png';

const Header = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const handleFilterClick = () => navigate("/explore");
    const handleLogin = () => navigate("/login");

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
                                src={Logo}
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
                    {user ? (
                        <ProfileMenu />
                    ) : (
                        <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800" onClick={handleLogin}>
                            <LogIn size={20} />
                        </button>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header