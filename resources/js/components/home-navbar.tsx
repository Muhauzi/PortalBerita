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

    return (
        <div className="hidden space-x-8 md:flex">
            {navItems.slice(0, 5).map((item) => (
                <div className="group relative" key={item.name}>
                    <a href={item.href} className="nav-link flex items-center font-medium hover:text-gray-700">
                        {item.name}
                        {item.subcategories.length > 0 && (
                            <i className="fas fa-chevron-down ml-1 text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                        )}
                    </a>

                    {item.subcategories.length > 0 && (
                        <div className="absolute top-full left-0 z-50 hidden w-48 rounded-md border border-gray-100 bg-white py-2 shadow-lg group-hover:block">
                            {item.subcategories.map((sub) => (
                                <a href={sub.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" key={sub.name}>
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
                            {navItems.slice(5).map((item) => (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => handleSubEnter(item.name)}
                                    onMouseLeave={handleSubLeave}
                                >
                                    <a
                                        href={item.href}
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
                                                <a href={sub.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" key={sub.name}>
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
        </div>
    );
};

export default Navbar;
