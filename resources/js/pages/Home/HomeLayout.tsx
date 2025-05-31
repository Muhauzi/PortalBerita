// File: resources/js/components/HomeLayout.tsx
import React from 'react';

export type Category = {
  id: number;
  name: string;
};

type Props = {
  children: React.ReactNode;
  maincategories: Category[];
  subcategories: Record<number, Category[]>;
};

const HomeLayout: React.FC<Props> = ({ children, maincategories, subcategories }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-black px-6 py-2 text-sm text-white">
        <div className="font-medium">{currentDate}</div>
        <div className="flex space-x-4">
          <a href="#" className="transition hover:text-gray-300"><i className="fab fa-twitter"></i></a>
          <a href="#" className="transition hover:text-gray-300"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="transition hover:text-gray-300"><i className="fab fa-instagram"></i></a>
          <a href="#" className="transition hover:text-gray-300"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl font-bold">SITE NAME</div>
          <div className="hidden space-x-8 md:flex">
            {maincategories.map((cat) => (
              <div key={cat.id} className="dropdown relative">
                <button className="nav-link flex items-center font-medium hover:text-gray-700">
                  {cat.name} <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                {subcategories[cat.id]?.length > 0 && (
                  <div className="dropdown-menu absolute z-10 mt-2 hidden w-48 rounded-md border border-gray-100 bg-white py-2 shadow-lg">
                    {subcategories[cat.id].map((sub) => (
                      <a key={sub.id} href="#" className="block px-4 py-2 hover:bg-gray-100">
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="md:hidden">
            <button className="text-black focus:outline-none">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-black px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">Daily Chronicle</h3>
            <p className="text-gray-400">Delivering accurate and timely news since 1995.</p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'World', 'Business', 'Technology'].map((link, index) => (
                <li key={index}><a href="#" className="text-gray-400 transition hover:text-white">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Products</h4>
            <ul className="space-y-2">
              {['Politics', 'Sports', 'Entertainment', 'Science'].map((link, index) => (
                <li key={index}><a href="#" className="text-gray-400 transition hover:text-white">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Connect With Us</h4>
            <div className="mb-4 flex space-x-4">
              <a href="#" className="text-gray-400 transition hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 transition hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 transition hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 transition hover:text-white"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <p className="text-gray-400">contact@sitename.com</p>
            <p className="text-gray-400">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2023 Daily Chronicle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
