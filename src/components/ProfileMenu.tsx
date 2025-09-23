import { Bookmark, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { logout } from "../store/slices/authSlice";
import { toastService } from "../shared/toastr";

const ProfileMenu = ({ className = "" }) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null; // Hide if not logged in

    const avatarFallback =
        user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U";

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-rose-600 text-white font-bold 
                   hover:opacity-90 transition active:scale-95"
                aria-haspopup="true"
                aria-expanded={open}
            >
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <span>{avatarFallback}</span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50 
                     origin-top-right animate-scale-fade"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-700">
                        {/* Avatar */}
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-600 text-white font-bold">
                                {avatarFallback}
                            </div>
                        )}

                        {/* User Info */}
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
                            <Bookmark size={16} className="text-rose-500" />
                            My Watchlists
                        </Link>
                        <Link
                            to="/settings"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 rounded-md"
                        >
                            <Settings size={16} className="text-rose-500" />
                            Account Settings
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-zinc-700">
                        <button
                            onClick={() => {
                                dispatch(logout());
                                setOpen(false);
                                toastService.success("Logged Out!")
                            }}
                            className="w-60 m-2 h-8 flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-zinc-700 rounded-md"
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
