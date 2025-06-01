// resources/js/Pages/Home/Index.tsx

import HomeNavbar from '@/components/home-navbar';
import HomeTopbar from '@/components/home-topbar';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
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
    author: {
        id: number;
        name: string;
    };
    subcategory: {
        id: number;
        name: string;
    };
    title: string;
    content: string;
    image: string;
    created_at: string;
    updated_at: string;
    status: string;
    views_count: number;
    likes_count: number;
}
interface Video {
    id: number;
    gallery_id: string;
    video_url: string;
    created_at: string;
}
interface videoGallery {
    id: number;
    title: string;
    description: string;
    type: string;
    author: {
        id: number;
        name: string;
    };
    videos: Video[];
    subcategory: {
        id: number;
        name: string;
    };
}

interface Props {
    topNews: newsItem[];
    recentNews: newsItem[];
    trendingNews: newsItem[];
    videoGalleries: videoGallery[];
    mainCategories: mainCategory[];
    subCategories: subCategory[];
}

const Index: React.FC<Props> = ({ topNews, recentNews, trendingNews, mainCategories, subCategories, videoGalleries }) => {
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
    const { auth } = usePage<SharedData>().props;

    // Example data for news items

    return (
        <div className="flex min-h-screen flex-col bg-white text-black">
            {/* Top Bar */}
            <HomeTopbar />
            {/* Top Bar End */}

            {/* Navigation Bar */}
            <nav className="border-b border-gray-200 bg-white px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="text-2xl font-bold">ZiphNews</div>
                    <HomeNavbar navItems={navItems} />
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035]"
                            >
                                Log in
                            </Link>
                        </>
                    )}
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
                            {/* Main Recent News */}
                            <a
                                href={`/berita/${recentNews[0]?.id}`}
                                className="group relative col-span-2 h-[30rem] overflow-hidden rounded-xl transition-transform duration-500 will-change-transform hover:scale-[1.02] hover:shadow-2xl animate-fadeInUp"
                                style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
                            >
                                <div className="relative col-span-2 h-[30rem] overflow-hidden rounded-xl">
                                    <img
                                        src={
                                            recentNews[0]?.image
                                                ? `/storage/images/news/${recentNews[0].image}`
                                                : 'https://picsum.photos/1920/1080?random'
                                        }
                                        alt={recentNews[0]?.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                                    />
                                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-6 transition-all duration-500 group-hover:bg-black/40">
                                        <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white transition-transform duration-300 group-hover:scale-110" style={{ width: 'fit-content' }}>
                                            RECENT
                                        </span>
                                        <h2 className="mt-2 text-3xl font-bold text-white transition-colors duration-300 group-hover:text-red-300">{recentNews[0]?.title}</h2>
                                        <p className="mt-2 text-gray-200 transition-opacity duration-300 group-hover:opacity-80">{recentNews[0]?.content.slice(0, 100)}...</p>
                                        <div className="mt-4 flex items-center text-sm text-gray-300">
                                            <span>By {recentNews[0]?.author.name}</span>
                                            <span className="mx-2">•</span>
                                            <span>{recentNews[0]?.created_at ? new Date(recentNews[0].created_at).toLocaleDateString() : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* Side Recent News Cards */}
                            <div className="space-y-4">
                                {recentNews.slice(1, 4).map((news, idx) => (
                                    <a
                                        key={news.id}
                                        href={`/berita/${news.id}`}
                                        className="flex items-start gap-3 no-underline hover:no-underline animate-fadeInUp"
                                        style={{ animationDelay: `${0.2 + idx * 0.1}s`, animationFillMode: 'both' }}
                                    >
                                        <div className="flex flex-row items-center mb-5 rounded-lg border border-gray-100 bg-white p-4 shadow-sm w-full transition-all duration-300 group hover:shadow-lg hover:scale-[1.025] hover:border-blue-400 relative overflow-hidden">
                                            {/* <img
                                                className="h-20 w-20 rounded-md bg-gray-500 object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
                                                src={news.image ? `/storage/images/news/${news.image}` : 'https://picsum.photos/80/80?random'}
                                                alt={news.title}
                                            /> */}
                                            <div className="flex-1">
                                                <span className="text-xs font-bold text-blue-600 transition-colors duration-300 group-hover:text-blue-800">{news.subcategory.name}</span>
                                                <h3 className="mt-1 font-bold transition-colors duration-300 group-hover:text-blue-700 group-hover:underline group-hover:underline-offset-2">{news.title}</h3>
                                                {/* <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">{news.content.slice(0, 60)}...</p> */}
                                                <div className="mt-2 flex items-center text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-700">
                                                    <span>{new Date(news.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            {/* Animated overlay on hover */}
                                            <div className="pointer-events-none absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <style>{`
                            @keyframes fadeInUp {
                                from {
                                    opacity: 0;
                                    transform: translateY(40px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                            .animate-fadeInUp {
                                animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
                            }
                        `}</style>
                    </section>

                    {/* Top News */}
                    <section className="mb-12">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Top News</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Gambar besar kiri */}
                            {topNews[0] && (
                                <a
                                    href={`/berita/${topNews[0].id}`}
                                    className="relative col-span-2 h-96 overflow-hidden rounded-xl group transition-transform duration-500 will-change-transform animate-fadeInUp"
                                    style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
                                >
                                    <img
                                        src={topNews[0].image ? `/storage/images/news/${topNews[0].image}` : 'https://picsum.photos/1920/1080?random'}
                                        alt={topNews[0].title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-transparent p-6 transition-all duration-500 group-hover:bg-black/40">
                                        <span
                                            className="inline-block bg-red-600 px-2 py-1 text-xs font-bold text-white transition-transform duration-300 group-hover:scale-110"
                                            style={{ width: 'fit-content' }}
                                        >
                                            TOP STORY
                                        </span>
                                        <h2 className="mt-2 text-3xl font-bold text-white transition-colors duration-300 group-hover:text-red-300">{topNews[0].title}</h2>
                                        <p className="mt-2 text-gray-200 transition-opacity duration-300 group-hover:opacity-80">{topNews[0].content.slice(0, 100)}...</p>
                                        <div className="mt-4 flex items-center text-sm text-gray-300">
                                            <span>By {topNews[0].author.name}</span>
                                            <span className="mx-2">•</span>
                                            <span>{topNews[0].created_at ? new Date(topNews[0].created_at).toLocaleDateString() : ''}</span>
                                        </div>
                                    </div>
                                </a>
                            )}

                            {/* Dua gambar kecil kanan */}
                            <div className="flex flex-col gap-6">
                                {topNews.slice(1, 3).map((news, idx) => (
                                    <a
                                        key={news.id}
                                        href={`/berita/${news.id}`}
                                        className="relative h-44 overflow-hidden rounded-xl group transition-transform duration-500 will-change-transform animate-fadeInUp"
                                        style={{ animationDelay: `${0.2 + idx * 0.1}s`, animationFillMode: 'both' }}
                                    >
                                        <img
                                            src={news.image ? `/storage/images/news/${news.image}` : `https://picsum.photos/1920/1080?random`}
                                            alt={news.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                                        />
                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-transparent p-4 transition-all duration-500 group-hover:bg-black/40">
                                            <span
                                                className="inline-block bg-red-600 px-2 py-1 text-xs font-bold text-white transition-transform duration-300 group-hover:scale-110"
                                                style={{ width: 'fit-content' }}
                                            >
                                                NEWS
                                            </span>
                                            <h3 className="mt-1 text-lg leading-tight font-semibold text-white transition-colors duration-300 group-hover:text-red-300">{news.title}</h3>
                                            <div className="mt-1 text-xs text-gray-300">
                                                <span>By {news.author.name}</span>
                                                <span className="mx-1">•</span>
                                                <span>{news.created_at ? new Date(news.created_at).toLocaleDateString() : ''}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                        {/* Animation keyframes */}
                        <style>{`
                            @keyframes fadeInUp {
                                from {
                                    opacity: 0;
                                    transform: translateY(40px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                            .animate-fadeInUp {
                                animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
                            }
                        `}</style>
                    </section>

                    {/* Trending News */}
                    <section className="mb-12">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Trending News</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {trendingNews.map((news, idx) => (
                                <a
                                    key={news.id}
                                    href={`/berita/${news.id}`}
                                    className="flex gap-4 rounded-lg p-2 group relative overflow-hidden bg-white shadow transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.025]"
                                    style={{
                                        animation: `fadeInUp 0.5s ${0.1 * idx + 0.1}s both`,
                                    }}
                                >
                                    <img
                                        src={news.image ? `/storage/images/news/${news.image}` : `https://picsum.photos/1920/1080?random`}
                                        alt={news.title}
                                        className="h-24 w-24 rounded-md object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
                                    />
                                    <div className="flex flex-col justify-between flex-1">
                                        <span className="inline-block w-fit rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white transition-colors duration-300 group-hover:bg-blue-700">
                                            {news.subcategory?.name || 'NEWS'}
                                        </span>
                                        <h3 className="text-md mt-1 leading-snug font-bold transition-colors duration-300 group-hover:text-blue-700">
                                            {news.title}
                                        </h3>
                                        <p className="mt-2 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-700">
                                            {news.author.name}
                                        </p>
                                    </div>
                                    {/* Animated overlay on hover */}
                                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </a>
                            ))}
                        </div>
                        {/* Keyframes for fadeInUp animation */}
                        <style>{`
                            @keyframes fadeInUp {
                                from {
                                    opacity: 0;
                                    transform: translateY(30px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                        `}</style>
                    </section>

                    {/* Video Section */}
                    <section className="mb-12 bg-gray-900 p-6 text-white">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Videos</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Video besar */}
                            {videoGalleries[0] && (
                                <div className="relative col-span-2 h-96 overflow-hidden rounded-2xl bg-gray-700">
                                    <video
                                        src={
                                            videoGalleries[0].videos[0]?.video_url
                                                ? `/storage/gallery/videos/${videoGalleries[0].videos[0].video_url}`
                                                : undefined
                                        }
                                        autoPlay
                                        loop
                                        className="h-full w-full bg-black object-cover"
                                        poster="https://youtu.be/-HkQo4wfmi8?si=W08bZBvLdZh5xebd"
                                    />
                                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <span className="inline-block rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                                            VIDEO | {videoGalleries[0].subcategory.name || 'Category'}
                                        </span>
                                        <h3 className="mt-2 text-2xl leading-snug font-bold">{videoGalleries[0].title}</h3>
                                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-300">
                                            <span>{videoGalleries[0].author.name}</span>
                                            <span>
                                                {videoGalleries[0].videos[0]?.created_at
                                                    ? new Date(videoGalleries[0].videos[0].created_at).toLocaleDateString()
                                                    : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* List video kecil */}
                            <div className="flex flex-col gap-6">
                                {videoGalleries.slice(1, 5).map((video) => (
                                    <div key={video.id} className="flex gap-4">
                                        <video
                                            src={video.videos[0]?.video_url ? `/storage/gallery/videos/${video.videos[0].video_url}` : undefined}
                                            className="h-20 w-20 rounded-md bg-gray-500 object-cover"
                                            poster={video.videos[0]?.video_url ? undefined : 'https://via.placeholder.com/80x80?text=No+Video'}
                                            preload="metadata"
                                            muted
                                        />
                                        <div className="flex flex-col justify-center text-white">
                                            <span className="text-xs text-gray-400">{video.subcategory?.name || 'Category'}</span>
                                            <h4 className="text-md leading-tight font-semibold">{video.title}</h4>
                                            <p className="mt-1 text-xs text-gray-400">{video.author.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Latest News Section with Intersection Observer for Animation on Scroll */}
                    <section className="mb-12">
                        <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Latest News</h2>
                        <div className="flex flex-col items-center gap-12">
                            {recentNews.slice(5, 10).map((news, idx) => {
                                // Use React ref and state for intersection observer
                                const ref = React.useRef<HTMLAnchorElement>(null);
                                const [visible, setVisible] = React.useState(false);

                                React.useEffect(() => {
                                    const node = ref.current;
                                    if (!node) return;
                                    const observer = new window.IntersectionObserver(
                                        ([entry]) => {
                                            if (entry.isIntersecting) {
                                                setVisible(true);
                                                observer.disconnect();
                                            }
                                        },
                                        { threshold: 0.2 }
                                    );
                                    observer.observe(node);
                                    return () => observer.disconnect();
                                }, []);

                                return (
                                    <a
                                        key={news.id}
                                        ref={ref}
                                        href={`/berita/${news.id}`}
                                        className={`flex w-full max-w-6xl gap-8 rounded-xl p-2 bg-white shadow transition-all duration-300 ease-in-out group relative overflow-hidden
                                            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                            hover:shadow-lg hover:scale-[1.025]'
                                        `}
                                        style={{
                                            transitionDelay: visible ? `${0.1 * idx + 0.1}s` : '0s',
                                            transitionProperty: 'opacity, transform, background, box-shadow',
                                            animation: visible ? `fadeInUp 0.5s ${0.1 * idx + 0.1}s both` : undefined,
                                        }}
                                    >
                                        {/* Animated background overlay on hover */}
                                        <div className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-600/10" />
                                        {/* Gambar thumbnail */}
                                        <div className="relative z-10">
                                            <img
                                                src={news.image ? `/storage/images/news/${news.image}` : 'https://picsum.photos/1920/1080?random'}
                                                alt={news.title}
                                                className="h-48 w-96 rounded-xl bg-gray-200 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            {/* Subtle image overlay on hover */}
                                            <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        {/* Konten berita */}
                                        <div className="flex flex-col justify-between transition-colors duration-300 ease-in-out group-hover:text-black z-10 flex-1">
                                            <div>
                                                <span className="inline-block rounded bg-blue-600 px-3 py-1 text-sm font-bold text-white transition-all duration-300 group-hover:bg-blue-700 group-hover:scale-105 group-hover:shadow">
                                                    {news.subcategory?.name || 'KATEGORI'}
                                                </span>
                                                <h3 className="mt-2 text-lg leading-snug font-bold transition-colors duration-300 group-hover:text-blue-700 group-hover:underline group-hover:underline-offset-2">
                                                    {news.title}
                                                </h3>
                                                <p className="mt-2 text-base text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                                                    {news.content.slice(0, 100)}...
                                                </p>
                                            </div>
                                            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-700">
                                                <span className="transition-transform duration-300 group-hover:-translate-y-1">{news.author.name}</span>
                                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                                    {news.created_at ? new Date(news.created_at).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Loading shimmer while not visible */}
                                        {!visible && (
                                            <div className="absolute inset-0 z-20 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-xl" />
                                        )}
                                    </a>
                                );
                            })}
                        </div>
                        {/* Keyframes for fadeInUp animation */}
                        <style>{`
                            @keyframes fadeInUp {
                                from {
                                    opacity: 0;
                                    transform: translateY(30px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                            .opacity-0 { opacity: 0; }
                            .opacity-100 { opacity: 1; }
                            .translate-y-10 { transform: translateY(40px); }
                            .translate-y-0 { transform: translateY(0); }
                        `}</style>
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
