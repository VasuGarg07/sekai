import { Heart } from "lucide-react";
import { navigationLinks } from "../shared/constants";
import Logo from '/logo_white.png';

const socialLinks = [
    {
        icon: '/icons/x.svg',
        label: 'X (formerly Twitter)',
        href: 'https://x.com/_vasugarg_',
        color: 'hover:bg-blue-500/20'
    },
    {
        icon: '/icons/github.svg',
        label: 'GitHub',
        href: 'https://github.com/VasuGarg07',
        color: 'hover:bg-zinc-500/20'
    },
    {
        icon: '/icons/instagram.svg',
        label: 'Instagram',
        href: 'https://www.instagram.com/_.vasugarg.07._',
        color: 'hover:bg-pink-500/20'
    },
    {
        icon: '/icons/portfolio.svg',
        label: 'Portfolio',
        href: 'https://vasu-garg.vercel.app/',
        color: 'hover:bg-purple-500/20'
    },
];

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-zinc-900 border-t border-zinc-800">
            {/* Main Footer Content */}
            <div className="px-4 py-6 sm:px-6 sm:py-8">
                <div className="flex flex-col gap-6 sm:gap-8 md:flex-row lg:justify-between">

                    {/* Brand Section */}
                    <div className="flex-1 lg:max-w-md space-y-3 sm:space-y-4">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-2">
                            <img
                                src={Logo}
                                alt="Sekai Logo"
                                className="h-7 w-7 object-contain sm:h-8 sm:w-8"
                            />
                            <span className="text-xl font-bold text-white sm:text-2xl">
                                Sekai
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-zinc-400">
                            Your ultimate destination for anime discovery. Explore thousands of titles,
                            get personalized recommendations, and stay updated with the latest releases.
                        </p>

                        {/* Social Links */}
                        <div className="hidden sm:flex items-center gap-3">
                            <span className="text-xs text-zinc-400 sm:text-sm">Socials:</span>
                            <div className="flex gap-2">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`rounded-full bg-zinc-800 p-1.5 text-zinc-400 transition-colors duration-200 ${social.color} sm:p-2`}
                                        aria-label={social.label}
                                    >
                                        <img
                                            src={social.icon}
                                            alt={social.label}
                                            width={16}
                                            height={16}
                                            className="sm:w-4.5 sm:h-4.5 opacity-70 group-hover:opacity-100"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col shrink-0 md:text-right">
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
                            Quick Links
                        </h3>
                        <nav className="flex flex-col gap-1.5 sm:gap-3">
                            {navigationLinks.map((link) => (
                                <a
                                    key={link.path}
                                    href={link.path}
                                    className="text-xs text-zinc-400 transition-colors duration-200 hover:text-white sm:text-sm"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-800" />

            {/* Bottom Section */}
            <div className="px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                        <p className="text-xs text-zinc-400 sm:text-sm">
                            Copyright © Sekai {currentYear}. All Rights Reserved
                        </p>
                        <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-500 sm:text-sm">
                            <span>Made with</span>
                            <Heart size={12} className="fill-current text-red-500 sm:w-3.5 sm:h-3.5" />
                            <span>for anime fans</span>
                        </div>
                    </div>
                    <p className="hidden sm:block text-xs leading-relaxed text-zinc-500">
                        This site does not store any files on its server. All contents are provided by non-affiliated third parties.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;