import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React, { useRef, useState } from 'react';

interface NavSubcategory {
    name: string;
    href: string;
}

interface NavItem {
    name: string;
    subcategories: NavSubcategory[];
    href: string;
}

interface NavbarProps {
    navItems: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ navItems }) => {
    const [showMore, setShowMore] = useState(false);
    const [activeMoreSub, setActiveMoreSub] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMoreEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setShowMore(true);
    };

    const handleMoreLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowMore(false);
            setActiveMoreSub(null);
        }, 150); // Delay to allow user to reach dropdown
    };

    const handleSubEnter = (name: string) => {
        setActiveMoreSub(name);
    };

    const handleSubLeave = () => {
        setActiveMoreSub(null);
    };

    // State for mobile menu
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            {/* Desktop Navbar */}
            <div className="hidden space-x-8 md:flex">
                {navItems.slice(0, 5).map((item) => (
                    <div className="group relative" key={item.name}>
                        <a href={`/berita/${item.name}`} className="nav-link flex items-center font-medium hover:text-gray-700">
                            {item.name}
                            {item.subcategories.length > 0 && (
                                <i className="fas fa-chevron-down ml-1 text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                            )}
                        </a>

                        {item.subcategories.length > 0 && (
                            <div className="absolute top-full left-0 z-50 hidden w-48 rounded-md border border-gray-100 bg-white py-2 shadow-lg group-hover:block">
                                {item.subcategories.map((sub) => (
                                    <a
                                        href={`/berita/${item.name}/${sub.name}`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        key={sub.name}
                                    >
                                        {sub.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {navItems.length > 5 && (
                    <div className="relative" onMouseEnter={handleMoreEnter} onMouseLeave={handleMoreLeave}>
                        <button className="nav-link flex items-center font-medium hover:text-gray-700">
                            More <i className="fas fa-chevron-down ml-1 text-xs transition-transform duration-200"></i>
                        </button>

                        {showMore && (
                            <div className="absolute top-full left-0 z-50 w-48 rounded-md border border-gray-100 bg-white py-2 shadow-lg">
                                <a href="/" className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                                    Home
                                </a>
                                {navItems.slice(5).map((item) => (
                                    <div
                                        key={item.name}
                                        className="relative"
                                        onMouseEnter={() => handleSubEnter(item.name)}
                                        onMouseLeave={handleSubLeave}
                                    >
                                        <a
                                            href={`/berita/${item.name}`}
                                            className="block flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {item.name}
                                            {item.subcategories.length > 0 && <i className="fas fa-chevron-right ml-1 text-xs"></i>}
                                        </a>

                                        {item.subcategories.length > 0 && activeMoreSub === item.name && (
                                            <div
                                                className="absolute top-0 left-full z-50 w-48 rounded-md border border-gray-100 bg-white py-2 shadow-lg"
                                                onMouseEnter={() => setActiveMoreSub(item.name)}
                                                onMouseLeave={handleSubLeave}
                                            >
                                                {/* Hover bridge */}
                                                <div className="absolute top-0 -left-4 h-full w-4" />

                                                {item.subcategories.map((sub) => (
                                                    <a
                                                        href={`/berita/${item.name}/${sub.name}`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        key={sub.name}
                                                    >
                                                        {sub.name}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center">
                    {auth.user ? (
                        auth.user.role === 'user' ? (
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="nav-link flex items-center font-medium hover:text-gray-700 inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] ml-4"
                            >
                                Logout
                            </Link>
                        ) : (
                            <Link
                                href={route('dashboard')}
                                className="nav-link flex items-center font-medium hover:text-gray-700 inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] ml-4"
                            >
                                Dashboard
                            </Link>
                        )
                    ) : (
                        <Link
                            href={route('login')}
                            className="nav-link flex items-center font-medium hover:text-gray-700 inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] ml-4"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Navbar */}
            <div className="flex items-center md:hidden">
                <button className="p-2 focus:outline-none" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu">
                    <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                </button>
            </div>
            {mobileOpen && (
                <div className="bg-opacity-40 fixed inset-0 z-50 bg-black md:hidden" onClick={() => setMobileOpen(false)}>
                    <div className="absolute top-0 left-0 h-full w-64 overflow-y-auto bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button className="mb-4 p-2 focus:outline-none" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                        <nav>
                            {navItems.map((item) => (
                                <div key={item.name} className="mb-2">
                                    <button
                                        className="flex w-full items-center justify-between rounded px-2 py-2 text-left font-medium text-gray-800 hover:bg-gray-100"
                                        onClick={() => setActiveMobileSub((prev) => (prev === item.name ? null : item.name))}
                                    >
                                        <span>
                                            <a href={`/berita/${item.name}`}>{item.name}</a>
                                        </span>
                                        {item.subcategories.length > 0 && (
                                            <i
                                                className={`fas fa-chevron-down ml-2 text-xs transition-transform duration-200 ${
                                                    activeMobileSub === item.name ? 'rotate-180' : ''
                                                }`}
                                            ></i>
                                        )}
                                    </button>
                                    {item.subcategories.length > 0 && activeMobileSub === item.name && (
                                        <div className="mt-1 ml-4">
                                            {item.subcategories.map((sub) => (
                                                <a
                                                    href={`/berita/${item.name}/${sub.name}`}
                                                    className="block rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                                    key={sub.name}
                                                >
                                                    {sub.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
