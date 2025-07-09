// resources/js/Pages/News/Show.tsx

import { Badge } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import HomeLayout from '@/layouts/home-layout';
import { Link } from '@inertiajs/react';
import React from 'react';

interface MainCategory {
    id: number;
    name: string;
}

interface SubCategory {
    id: number;
    name: string;
    id_main_categories: number;
}

interface NewsItem {
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
    slug: string; // Slug untuk URL berita
    content: string; // HTML string
    image: string; // URL ke gambar
    created_at: string; // ISO string
    updated_at: string;
    status: string;
    views_count: number;
    likes_count: number;
}

interface Props {
    catName: string; // Nama kategori utama
    mainCategories: MainCategory[];
    subCategories: SubCategory[];
    news: NewsItem[];
    recentNews: NewsItem[]; // Daftar berita terbaru untuk sidebar
}

const SubCategoryNewsPage: React.FC<Props> = ({ mainCategories, subCategories, news, catName, recentNews }) => {
    // Bangun navItems untuk HomeLayout dari mainCategories + subCategories
    const navItems = mainCategories.map((cat) => ({
        name: cat.name,
        href: `/category/${cat.id}`,
        subcategories: subCategories
            .filter((sub) => sub.id_main_categories === cat.id)
            .map((sub) => ({
                name: sub.name,
                href: `/category/${cat.id}/${sub.id}`,
            })),
    }));

    return (
        <>
            <HomeLayout navItems={navItems}>
                <div className="container mx-auto px-4 py-8">
                    {/* GRID UTAMA: Konten Artikel (kiri) + Sidebar Recent News (kanan) */}
                    <div className="flex flex-col gap-8 lg:flex-row">
                        <main className="flex-grow">
                            <div className="mx-auto max-w-7xl px-6 py-8">
                                
                                {/* Latest News Section with Intersection Observer for Animation on Scroll */}
                                <section className="mb-12">
                                    <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">{catName} News</h2>
                                    <div className="flex flex-col items-center gap-12">
                                        {news.slice(0, 5).map((news, idx) => (
                                            <LatestNewsCard key={news.id} news={news} idx={idx} />
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
                            .opacity-0 { opacity: 0; }
                            .opacity-100 { opacity: 1; }
                            .translate-y-10 { transform: translateY(40px); }
                            .translate-y-0 { transform: translateY(0); }
                        `}</style>
                                </section>

                                {/* You can replicate the structure above for other sections */}
                            </div>
                        </main>

                        {/* Bagian Sidebar “Recent News” */}
                        <aside className="w-full space-y-6 lg:w-1/3">
                            <div className="space-y-4 rounded-lg border-2 border-slate-200 bg-white p-4">
                                <h2 className="text-xl font-medium text-slate-800">Recent News</h2>
                                {recentNews.slice(0, 7).map((item) => (
                                    <Card
                                        key={item.id}
                                        className="group relative border border-transparent p-2 transition-shadow duration-200 hover:border-indigo-400 hover:shadow-lg"
                                    >
                                        <div className="flex flex-row gap-4">
                                            {/* Kolom kiri: Thumbnail */}
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                <img
                                                    src={item.image ? `/storage/images/news/${item.image}` : 'https://picsum.photos/1920/1080?random'}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                />
                                            </div>
                                            {/* Kolom kanan: Info */}
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <Badge variant="default" className="mb-1 px-2 py-1 text-xs">
                                                        {item.subcategory?.name ?? 'Berita'}
                                                    </Badge>
                                                    <CardTitle>
                                                        <Link
                                                            href={`/berita/baca/${item.slug}`}
                                                            className="line-clamp-2 text-sm leading-snug font-bold text-slate-900 transition-colors duration-200 hover:underline"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </CardTitle>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500">{item.author.name}</p>
                                            </div>
                                        </div>
                                        {/* Floating effect on hover */}
                                        <div className="pointer-events-none absolute inset-0 rounded-xl transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-2xl"></div>
                                    </Card>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </HomeLayout>
        </>
    );
};
interface LatestNewsCardProps {
    news: NewsItem;
    idx: number;
}

const LatestNewsCard: React.FC<LatestNewsCardProps> = ({ news, idx }) => {
    const [visible, setVisible] = React.useState(false);
    const ref = React.useRef<HTMLAnchorElement | null>(null);

    React.useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new window.IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.2 },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <a
            ref={ref}
            href={`/berita/baca/${news.slug}`}
            className={`group relative flex w-full max-w-6xl gap-8 overflow-hidden rounded-xl bg-white p-2 shadow transition-all duration-300 ease-in-out
                flex-col sm:flex-row
                ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                hover:scale-[1.025] hover:shadow-lg`}
            style={{
                transitionDelay: visible ? `${0.1 * idx + 0.1}s` : '0s',
                transitionProperty: 'opacity, transform, background, box-shadow',
                animation: visible ? `fadeInUp 0.5s ${0.1 * idx + 0.1}s both` : undefined,
            }}
        >
            {/* Animated background overlay on hover */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-blue-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Gambar thumbnail */}
            <div className="relative z-10 w-full sm:w-auto">
                <img
                    src={news.image ? `/storage/images/news/${news.image}` : 'https://picsum.photos/1920/1080?random'}
                    alt={news.title}
                    className="h-48 w-full sm:w-96 rounded-xl bg-gray-200 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    loading="lazy"
                />
                {/* Subtle image overlay on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            {/* Konten berita */}
            <div className="z-10 flex flex-1 flex-col justify-between transition-colors duration-300 ease-in-out group-hover:text-black mt-4 sm:mt-0">
                <div>
                    <span className="inline-block rounded bg-blue-600 px-3 py-1 text-sm font-bold text-white transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-700 group-hover:shadow">
                        {news.subcategory?.name || 'KATEGORI'}
                    </span>
                    <h3 className="mt-2 text-lg leading-snug font-bold transition-colors duration-300 group-hover:text-blue-700 group-hover:underline group-hover:underline-offset-2">
                        {news.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-600 transition-colors duration-300 group-hover:text-gray-800 line-clamp-3">
                        {news.content.slice(0, 100)}...
                    </p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-700">
                    <span className="transition-transform duration-300 group-hover:-translate-y-1">{news.author.name}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                        {news.created_at ? new Date(news.created_at).toLocaleDateString() : ''}
                    </span>
                </div>
            </div>
            {/* Loading shimmer while not visible */}
            {!visible && <div className="absolute inset-0 z-20 animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />}
        </a>
    );
};

export default SubCategoryNewsPage;
