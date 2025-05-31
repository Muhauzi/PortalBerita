import React from "react"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

interface NavSubcategory {
  name: string
  href: string
}

interface NavItem {
  name: string
  subcategories: NavSubcategory[]
  href: string
}

interface NavbarProps {
  navItems: NavItem[]
}

const Navbar: React.FC<NavbarProps> = ({ navItems }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.slice(0, 5).map((item) => (
          <NavigationMenuItem key={item.name}>
            {item.subcategories.length > 0 ? (
              <>
                <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="min-w-[200px] p-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-2">
                    {item.subcategories.map((sub) => (
                      <NavigationMenuLink asChild key={sub.name}>
                        <a
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {sub.name}
                        </a>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <a
                  href={item.href}
                  className="px-4 py-2 font-medium text-gray-800 hover:text-gray-600"
                >
                  {item.name}
                </a>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}

        {/* More Dropdown */}
        {navItems.length > 5 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-1 p-2 w-[200px]">
                {navItems.slice(5).map((item) => (
                  <div key={item.name} className="relative group">
                    <NavigationMenuLink asChild>
                      <a
                        href={item.href}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {item.name}
                        {item.subcategories.length > 0 && (
                          <span className="ml-2 text-xs">&rsaquo;</span>
                        )}
                      </a>
                    </NavigationMenuLink>

                    {item.subcategories.length > 0 && (
                      <div className="absolute left-full top-0 ml-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2 z-50">
                        {item.subcategories.map((sub) => (
                          <a
                            href={sub.href}
                            key={sub.name}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default Navbar
