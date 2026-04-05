import { useAppSelector } from "../store/reduxHooks";
import ProfileBannerImg from "/profile-2.jpg";
import UserIcon from "/usericon.jpg";

const ProfileBanner = () => {
    const { user } = useAppSelector((state) => state.auth);
    return (
        <div className="relative w-full h-75">
            {/* Background Banner Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={ProfileBannerImg}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content Container */}
            <div className="relative flex items-center justify-center z-10 h-full max-w-screen mx-auto p-4 sm:p-8 lg:p-16">
                {/* Profile Image */}
                <div className="hidden sm:flex shrink-0 mr-4 sm:mr-6 lg:mr-8">
                    <img
                        src={user?.photoURL || UserIcon}
                        alt={user?.displayName ?? "Anonymous"}
                        className="h-32 w-32 rounded-full ring-4 ring-white shadow-2xl"
                    />
                </div>

                {/* Right side - Content */}
                <div className="text-white">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight text-shadow-lg">
                        Welcome! {user?.displayName ?? "Anonymous"}
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default ProfileBanner;