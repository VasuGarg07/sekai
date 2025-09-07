import { Menu } from '@base-ui-components/react/menu';
import { Menu as MenuIcon } from 'lucide-react';
import { Link } from 'react-router';
import { navigationLinks } from '../shared/constants';

const NavMenu = ({ className = '' }) => {
    return (
        <div className={className}>
            <Menu.Root>
                <Menu.Trigger className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-all duration-200 active:scale-95">
                    <MenuIcon size={20} />
                </Menu.Trigger>

                <Menu.Portal>
                    <Menu.Positioner sideOffset={8}>
                        <Menu.Popup className="min-w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50 origin-[var(--transform-origin)] transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
                            {navigationLinks.map((link, index) => (
                                <Menu.Item key={index}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center space-x-3 mx-2 rounded-md px-4 py-2 text-sm text-slate-300 outline-none cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-700 hover:text-slate-900 hover:dark:text-white active:bg-slate-200 active:dark:bg-slate-600 data-[highlighted]:bg-slate-100 data-[highlighted]:dark:bg-slate-700 data-[highlighted]:text-slate-900 data-[highlighted]:dark:text-white transition-all duration-200"
                                    >
                                        <link.icon size={16} className="transition-colors duration-200" />
                                        <span>{link.name}</span>
                                    </Link>
                                </Menu.Item>
                            ))}
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
        </div>
    );
};

export default NavMenu;