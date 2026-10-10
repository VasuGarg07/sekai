import { Bookmark, LogOut, Settings } from "lucide-react";
import { useRef, useState } from "react";
import { useDismiss } from "../hooks/useDismiss";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { logout } from "../store/slices/authSlice";
import { toastService } from "../ui/toastService";
import { userDisplayName } from "../shared/utilities";

const ProfileMenu = ({ className = "" }) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    // Remember which photo URL failed, so a new photo is tried again automatically
    const [failedPhotoURL, setFailedPhotoURL] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useDismiss(menuRef, () => setOpen(false), open);

    if (!user) return null;

    const name = userDisplayName(user);
    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&rounded=true&size=96`;
    const avatarSrc = !user.photoURL || failedPhotoURL === user.photoURL ? avatarFallback : user.photoURL;

    const handleAvatarError = () => setFailedPhotoURL(user.photoURL);

    const handleLogout = async () => {
        setOpen(false);
        try {
            await dispatch(logout()).unwrap();
            toastService.success("Logged out.");
            navigate("/");
        } catch {
            toastService.error("Couldn't log out. Please try again.");
        }
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
                                {name}
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