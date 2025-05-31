// resources/js/Pages/Home/Index.tsx

import HomeNavbar from '@/components/home-navbar';
import HomeTopbar from '@/components/home-topbar';
import React from 'react';

interface mainCategory {
    id: number;
    name: string;
}

interface subCategory {
    id: number;
    name: string;
    id_main_categories: number;
}

interface newsItem {
    id: number;
    author: string;
    subcategory_id: number;
    title: string;
    content: string;
    image: string;
    created_at: string;
    updated_at: string;
    status: string;
    views_count: number;
    likes_count: number;
}

interface Props {
    newsData: {
        news: newsItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    mainCategories: mainCategory[];
    subCategories: subCategory[];
}

const Index: React.FC<Props> = ({mainCategories, subCategories }) => {
    // Example data for main categories and subcategories
    const navItems = mainCategories.map((category) => ({
        name: category.name,
        subcategories: subCategories
            .filter((sub) => sub.id_main_categories === category.id)
            .map((sub) => ({
                name: sub.name,
                href: `/category/${category.id}/${sub.id}`,
            })),
        href: `/category/${category.id}`,
    }));

    return (
        <div className="flex min-h-screen flex-col bg-white text-black">
            {/* Top Bar */}
            <HomeTopbar />
            {/* Top Bar End */}

            {/* Navigation Bar */}
            <nav className="border-b border-gray-200 bg-white px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="text-2xl font-bold">SITE NAME</div>
                    <HomeNavbar
                        navItems={navItems}
                    />
                </div>
            </nav>

            {/* Navigation Bar End */}

            {/* Main News Sections */}
            <main className="flex-grow">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    {/* Top News Section */}
                    <section className="mb-12">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Recent News</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="relative col-span-2 h-[30rem] overflow-hidden rounded-xl">
                                <img src="https://source.unsplash.com/random/800x600/?news" alt="Top News" className="h-full w-full object-cover" />
                                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-6">
                                    <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">TOP STORY</span>
                                    <h2 className="mt-2 text-3xl font-bold text-white">Global Summit Addresses Climate Change Crisis</h2>
                                    <p className="mt-2 text-gray-200">
                                        World leaders gather to discuss urgent measures against rising global temperatures.
                                    </p>
                                    <div className="mt-4 flex items-center text-sm text-gray-300">
                                        <span>By John Smith</span>
                                        <span className="mx-2">•</span>
                                        <span>2 hours ago</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {/* Example News Cards */}
                                {['Politics', 'Tech', 'Health'].map((category) => (
                                    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm" key={category}>
                                        <span className="text-xs font-bold text-blue-600">{category}</span>
                                        <h3 className="mt-1 font-bold">Example News Title</h3>
                                        <p className="mt-1 text-sm text-gray-600">Example description for {category} news.</p>
                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                            <span>45 min ago</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Additional Sections (Trending, Videos, Latest News) */}
                    <section className="mb-12">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Top News</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Gambar besar kiri */}
                            <div className="relative col-span-2 h-96 overflow-hidden rounded-xl">
                                <img src="https://source.unsplash.com/random/800x600/?news" alt="Top News" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-transparent p-6">
                                    <span className="inline-block bg-red-600 px-2 py-1 text-xs font-bold text-white" style={{ width: 'fit-content' }}>
                                        TOP STORY
                                    </span>
                                    <h2 className="mt-2 text-3xl font-bold text-white">Global Summit Addresses Climate Change Crisis</h2>
                                    <p className="mt-2 text-gray-200">
                                        World leaders gather to discuss urgent measures against rising global temperatures.
                                    </p>
                                    <div className="mt-4 flex items-center text-sm text-gray-300">
                                        <span>By John Smith</span>
                                        <span className="mx-2">•</span>
                                        <span>2 hours ago</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dua gambar kecil kanan */}
                            <div className="flex flex-col gap-6">
                                {[1, 2].map((_, index) => (
                                    <div key={index} className="relative h-44 overflow-hidden rounded-xl">
                                        <img
                                            src={`https://source.unsplash.com/random/400x300/?news,${index}`}
                                            alt="Small Story"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-transparent p-4">
                                            <span
                                                className="inline-block bg-red-600 px-2 py-1 text-xs font-bold text-white"
                                                style={{ width: 'fit-content' }}
                                            >
                                                NEWS
                                            </span>
                                            <h3 className="mt-1 text-lg leading-tight font-semibold text-white">
                                                Shorter Headline For Small Story {index + 1}
                                            </h3>
                                            <div className="mt-1 text-xs text-gray-300">
                                                <span>By Jane Doe</span>
                                                <span className="mx-1">•</span>
                                                <span>1 hour ago</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Trending News</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <img
                                        src={`https://source.unsplash.com/random/100x100?sig=${i}`}
                                        alt="Story Thumbnail"
                                        className="h-24 w-24 rounded-md object-cover"
                                    />
                                    <div className="flex flex-col justify-between">
                                        <span className="inline-block w-fit rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white">NEWS</span>
                                        <h3 className="text-md mt-1 leading-snug font-bold">
                                            Judul Berita Lorem Ipsum Dolor Sit Lorem Ipsum Dolor Sit Amet
                                        </h3>
                                        <p className="mt-2 text-xs text-gray-500">Nama Jurnalis</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-12 bg-gray-900 p-6 text-white">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Videos</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Video besar */}
                            <div className="relative col-span-2 h-96 overflow-hidden rounded-2xl bg-gray-700">
                                <img src="https://source.unsplash.com/800x600/?video" alt="Main Video" className="h-full w-full object-cover" />
                                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <span className="inline-block rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white">VIDEO</span>
                                    <h3 className="mt-2 text-2xl leading-snug font-bold">Judul Video Lorem Ipsum Dolor Sit Amet Judul Video Lorem</h3>
                                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-300">
                                        <span>Nama Jurnalis</span>
                                        <span>dd-mm-yyyy</span>
                                    </div>
                                </div>
                            </div>

                            {/* List video kecil */}
                            <div className="flex flex-col gap-6">
                                {[1, 2, 3, 4].map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <img
                                            src={`https://source.unsplash.com/100x100/?video,${i}`}
                                            alt="Video Thumbnail"
                                            className="h-20 w-20 rounded-md bg-gray-500 object-cover"
                                        />
                                        <div className="flex flex-col justify-center text-white">
                                            <span className="text-xs text-gray-400">Category</span>
                                            <h4 className="text-md leading-tight font-semibold">Video Lorem Ipsum Dolor Sit Amet</h4>
                                            <p className="mt-1 text-xs text-gray-400">Nama Jurnalis</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Latest News</h2>
                        <div className="flex flex-col items-center gap-12">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex w-full max-w-6xl gap-8">
                                    {/* Gambar thumbnail */}
                                    <img
                                        src={`https://source.unsplash.com/600x360/?news,${i}`}
                                        alt="News Thumbnail"
                                        className="h-48 w-96 rounded-xl bg-gray-200 object-cover"
                                    />

                                    {/* Konten berita */}
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <span className="inline-block rounded bg-blue-600 px-3 py-1 text-sm font-bold text-white">KATEGORI</span>
                                            <h3 className="mt-2 text-lg leading-snug font-bold">
                                                Judul Berita Lorem Ipsum Dolor Sit Amet Judul Berita Lorem
                                            </h3>
                                            <p className="mt-2 text-base text-gray-600">
                                                Deskripsi Berita Lorem Ipsum Dolor Sit Amet Judul Berita Lorem
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                                            <span>Nama Jurnalis</span>
                                            <span>dd-mm-yyyy</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* You can replicate the structure above for other sections */}
                </div>
            </main>

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
                            <li>
                                <a href="#" className="text-gray-400 transition hover:text-white">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition hover:text-white">
                                    World
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition hover:text-white">
                                    Business
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition hover:text-white">
                                    Technology
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-bold">Products</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 transition hover:text-white">
                                    Politics
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition hover:text-white">
                                    Sports
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition hover:text-white">
                                    Entertainment
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition hover:text-white">
                                    Science
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-bold">Connect With Us</h4>
                        <div className="mb-4 flex space-x-4">
                            <a href="#" className="text-gray-400 transition hover:text-white">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="text-gray-400 transition hover:text-white">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-gray-400 transition hover:text-white">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" className="text-gray-400 transition hover:text-white">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
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

export default Index;
