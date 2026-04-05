import { LogIn, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import ProfileMenu from './ProfileMenu';
import type { RootState } from '../store/store';
import NavMenu from './NavMenu';
import SearchBar from './SearchBar';
import Logo from '/logo_white.png';

const Header = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    return (
        <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 transition-colors duration-200">
            <div className="flex items-center justify-center h-16 mx-auto px-4 lg:px-10 gap-2">
                {/* Menu Button */}
                <NavMenu />

                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2 shrink-0">
                    <img
                        src={Logo}
                        alt="Sekai Logo"
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                    />
                    <span className="text-lg sm:text-xl font-bold text-white">
                        Sekai
                    </span>
                </Link>

                <span className="grow" />

                {/* Search Bar — desktop */}
                <SearchBar className="grow hidden sm:block" />

                {/* Search icon — mobile, navigates to explore */}
                <button
                    type="button"
                    className="p-2 rounded-lg text-zinc-400 block sm:hidden"
                    onClick={() => navigate("/explore")}
                    aria-label="Search"
                >
                    <Search size={20} />
                </button>

                {/* User Menu */}
                {user ? (
                    <ProfileMenu />
                ) : (
                    <button
                        type="button"
                        className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800"
                        onClick={() => navigate("/login")}
                        aria-label="Log in"
                    >
                        <LogIn size={20} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;