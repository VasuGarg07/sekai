import { useState, useRef, useEffect } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { Link } from 'react-router';
import { navigationLinks } from '../shared/constants';

const NavMenu = ({ className = '' }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={className} ref={menuRef}>
            {/* Trigger */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-all duration-200 active:scale-95"
                aria-haspopup="true"
                aria-expanded={open}
            >
                <MenuIcon size={20} />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute mt-2 min-w-48 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 py-2 z-50 
                               origin-top-right animate-scale-fade"
                >
                    {navigationLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.path}
                            onClick={() => setOpen(false)} // close on selection
                            className="flex items-center space-x-3 mx-2 rounded-md px-4 py-2 text-sm text-zinc-300 
                                       outline-none cursor-pointer hover:bg-zinc-100 hover:dark:bg-zinc-700 
                                       hover:text-zinc-950 hover:dark:text-white active:bg-zinc-200 
                                       active:dark:bg-zinc-600 transition-all duration-200"
                        >
                            <link.icon
                                size={16}
                                className="text-rose-500 transition-colors duration-200"
                            />
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NavMenu;