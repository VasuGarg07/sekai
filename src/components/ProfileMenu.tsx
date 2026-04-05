import { Bookmark, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { logout } from "../store/slices/authSlice";
import { toastService } from "../ui/toastService";

const ProfileMenu = ({ className = "" }) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setAvatarError(false);
    }, [user?.photoURL]);

    if (!user) return null;

    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random&rounded=true&size=96`;
    const avatarSrc = avatarError || !user.photoURL ? avatarFallback : user.photoURL;

    const handleAvatarError = () => setAvatarError(true);

    const handleLogout = () => {
        dispatch(logout());
        setOpen(false);
        toastService.success("Logged Out!");
        navigate("/");
    };

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            {/* Avatar Button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-accent-600 text-white font-bold
                   hover:opacity-90 transition active:scale-95"
                aria-haspopup="true"
                aria-expanded={open}
                aria-label="Profile menu"
            >
                <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                    onError={handleAvatarError}
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50
                     origin-top-right animate-scale-fade">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-700">
                        <img
                            src={avatarSrc}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={handleAvatarError}
                        />
                        <div className="flex flex-col min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user.displayName || "User"}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Menu Links */}
                    <div className="p-2">
                        <Link
                            to="/watchlist"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 rounded-md"
                        >
                            <Bookmark size={16} className="text-accent-500" />
                            My Watchlist
                        </Link>
                        <Link
                            to="/settings"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 rounded-md"
                        >
                            <Settings size={16} className="text-accent-500" />
                            Settings
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-zinc-700 p-2">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-accent-400 hover:bg-zinc-700 rounded-md"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;