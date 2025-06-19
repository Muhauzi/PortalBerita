// src/layouts/HomeLayout.tsx
import React from "react";
import HomeNavbar from '@/components/home-navbar';
import HomeTopbar from '@/components/home-topbar';

interface NavSubItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  subcategories: NavSubItem[];
}

interface HomeLayoutProps {
  children?: React.ReactNode;
  navItems: NavItem[];
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children, navItems }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Top Bar */}
      <HomeTopbar />
      {/* Top Bar End */}

      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl font-bold">
            <a href="/">ZiphNews</a>
          </div>
          <HomeNavbar navItems={navItems} />
        </div>
      </nav>
      {/* Navigation Bar End */}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
      {/* Main Content End */}

      {/* Footer */}
      <footer className="bg-black px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">ZiphNews</h3>
            <p className="text-gray-400">
              Menyajikan berita akurat dan terkini sejak 2023.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Quick Links</h4>
            <ul className="space-y-2">
              {navItems.slice(0, 4).map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:text-white"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Kategori Populer</h4>
            <ul className="space-y-2">
              {navItems.slice(4, 8).map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:text-white"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Connect With Us</h4>
            <div className="mb-4 flex space-x-4">
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 transition hover:text-white"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 transition hover:text-white"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 transition hover:text-white"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 transition hover:text-white"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <p className="text-gray-400">contact@ziphnews.com</p>
            <p className="text-gray-400">+62 812-3456-7890</p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} ZiphNews. All rights reserved.</p>
        </div>
      </footer>
      {/* Footer End */}
    </div>
  );
};

export default HomeLayout;
