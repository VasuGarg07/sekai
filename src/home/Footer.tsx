import { Github, Globe, Heart, Twitter } from "lucide-react";
import { useTheme } from "../stores/themeStore";
import Logo from '/logo.png';
import LogoW from '/logo_white.png';
import { navigationLinks } from "../shared/constants";

const Footer = () => {
    const { isDark } = useTheme();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-blue-400' },
        { icon: Github, label: 'GitHub', href: '#', color: 'hover:text-slate-300' },
        { icon: Globe, label: 'Website', href: '#', color: 'hover:text-green-400' }
    ];

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 mt-auto px-6 sm:px-6 lg:px-10">
            {/* Main Footer Content */}
            <div className="py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">

                    {/* Brand Section */}
                    <div className="flex-1 max-w-md space-y-4">
                        <div className="flex items-center space-x-2">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <img
                                    src={isDark ? LogoW : Logo}
                                    alt="Sekai Logo"
                                    className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                                />
                            </div>
                            {/* Brand Name */}
                            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                Sekai
                            </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                            Your ultimate destination for anime discovery. Explore thousands of titles,
                            get personalized recommendations, and stay updated with the latest releases.
                        </p>

                        {/* Social Links */}
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Socials:</span>
                            <div className="flex space-x-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className={`text-slate-400 ${social.color} transition-colors duration-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800`}
                                        aria-label={social.label}
                                    >
                                        <social.icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex-shrink-0 text-right">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                            {navigationLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.path}
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 py-1"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-800"></div>

            {/* Bottom Section */}
            <div className="flex flex-col space-y-4 sm:space-y-3 py-6">

                {/* Copyright */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Copyright © Sekai {currentYear}. All Rights Reserved
                    </p>

                    {/* Made with love indicator */}
                    <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-500">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500 fill-current" />
                        <span>for anime fans</span>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
                    This site does not store any files on its server. All contents are provided by non-affiliated third parties.
                </p>
            </div>
        </footer>
    );
};

export default Footer;