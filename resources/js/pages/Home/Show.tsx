// resources/js/Pages/News/Show.tsx

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
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
    content: string; // HTML string
    image: string; // URL ke gambar
    created_at: string; // ISO string
    updated_at: string;
    status: string;
    views_count: number;
    likes_count: number;
}

interface Props {
    mainCategories: MainCategory[];
    subCategories: SubCategory[];
    mainArticle: NewsItem;
    recentNews: NewsItem[];
    alsoRead: NewsItem[];
}

const Show: React.FC<Props> = ({ mainCategories, subCategories, mainArticle, recentNews, alsoRead }) => {
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

    // Format tanggal (misal: 28 Mei 2025)
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <HomeLayout navItems={navItems}>
                <div className="container mx-auto px-4 py-8">
                    {/* GRID UTAMA: Konten Artikel (kiri) + Sidebar Recent News (kanan) */}
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Bagian Konten Utama */}
                        <article className="flex-1 space-y-6">
                            {/* Judul */}
                            <h1 className="text-3xl font-semibold text-slate-900">{mainArticle.title}</h1>

                            {/* Info Author + Tanggal + Subkategori */}
                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{mainArticle.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{mainArticle.author.name}</span>
                                <span>·</span>
                                <span>{formatDate(mainArticle.created_at)}</span>
                                <span>·</span>
                                <Badge variant="outline">{mainArticle.subcategory.name}</Badge>
                            </div>

                            {/* Gambar Utama */}
                            <div className="h-64 w-full overflow-hidden rounded-lg bg-slate-100">
                                <img
                                    src={mainArticle.image ? `/storage/images/news/${mainArticle.image}` : 'https://picsum.photos/1920/1080?random'}
                                    // src='https://picsum.photos/1920/1080?random'
                                    alt={mainArticle.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Konten (HTML) */}
                            <div
                                className="prose prose-slate max-w-none whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: mainArticle.content }}
                            ></div>

                            {/* Statistik: Views & Likes */}
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span>{mainArticle.views_count} views</span>
                                <span>·</span>
                                <span>{mainArticle.likes_count} likes</span>
                            </div>

                            {/* Contoh Seksi Konten Tambahan (jika diperlukan) */}
                            {/* <div className="flex flex-col md:flex-row md:items-start gap-6 mt-8">
                                    <div className="flex-1 space-y-4">
                                    <p>
                                    {mainArticle.content}
                                    </p>
                                    </div>
                                </div> */}

                            {/* Bagian “Komentar” di Bawah Artikel */}
                            <section className="mt-12">
                                <h2 className="mb-6 text-2xl font-semibold text-slate-900">Komentar</h2>
                                <div className="rounded-lg bg-white p-6 shadow">
                                    <form className="space-y-4">
                                        <textarea
                                            className="w-full rounded border p-2 focus:ring focus:outline-none"
                                            rows={3}
                                            placeholder="Tulis komentar Anda..."
                                        />
                                        <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                            Kirim
                                        </button>
                                    </form>
                                    {/* Daftar komentar (dummy) */}
                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-slate-800">User Dummy</div>
                                                <div className="text-sm text-slate-700">Artikel ini sangat bermanfaat, terima kasih!</div>
                                                <div className="mt-1 text-xs text-slate-500">1 jam yang lalu</div>
                                            </div>
                                        </div>
                                        {/* Tambahkan komentar lain di sini */}
                                    </div>
                                </div>
                            </section>
                        </article>

                        {/* Bagian Sidebar “Recent News” */}
                        <aside className="w-full space-y-6 lg:w-1/3">
                            <div className="space-y-4 rounded-lg border-2 border-slate-200 bg-white p-4">
                                <h2 className="text-xl font-medium text-slate-800">Recent News</h2>
                                {recentNews
                                    .filter((news) => news.id !== mainArticle.id)
                                    .slice(0, 5)
                                    .map((news) => (
                                        <Card
                                            key={news.id}
                                            className="p-2 transition-shadow duration-200 hover:shadow-lg hover:border-indigo-400 border border-transparent relative group"
                                        >
                                            <div className="flex flex-row gap-4">
                                                {/* Kolom kiri: Thumbnail */}
                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                    <img
                                                        src={
                                                            news.image
                                                                ? `/storage/images/news/${news.image}`
                                                                : 'https://picsum.photos/1920/1080?random'
                                                        }
                                                        alt={news.title}
                                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    />
                                                </div>
                                                {/* Kolom kanan: Info */}
                                                <div className="flex flex-1 flex-col justify-between">
                                                    <div>
                                                        <Badge variant="default" className="mb-1 px-2 py-1 text-xs">
                                                            {news.subcategory.name ?? 'Berita'}
                                                        </Badge>
                                                        <CardTitle>
                                                            <Link
                                                                href={`/berita/${news.id}`}
                                                                className="line-clamp-2 text-sm leading-snug font-bold text-slate-900 hover:underline transition-colors duration-200"
                                                            >
                                                                {news.title}
                                                            </Link>
                                                        </CardTitle>
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-500">{news.author.name}</p>
                                                </div>
                                            </div>
                                            {/* Floating effect on hover */}
                                            <div className="absolute inset-0 rounded-xl pointer-events-none transition-transform duration-200 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-2xl"></div>
                                        </Card>
                                    ))}
                            </div>
                        </aside>
                    </div>

                    {/* Bagian “Also Read” di Bawah Artikel */}
                    <section className="mt-12">
                        <h2 className="mb-6 text-2xl font-semibold text-slate-900">Also Read</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                            {alsoRead.map((item) => (
                                <Card key={item.id} className="space-y-3 p-4 transition-shadow duration-200 hover:shadow-lg">
                                    <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-100">
                                        <img
                                            src={item.image ? `/storage/images/news/${item.image}` : 'https://picsum.photos/1920/1080?random'}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-0">
                                        <CardTitle>
                                            <Link href={`/news/${item.id}`} className="block text-base font-medium text-slate-900 hover:underline">
                                                {item.title}
                                            </Link>
                                        </CardTitle>
                                        {/* Line clamp untuk excerpt: ambil 2 baris pertama dari content */}
                                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                            {/* Jika content HTML panjang, kamu bisa memotong 100 karakter pertama saja */}
                                            {item.content.replace(/<[^>]*>/g, '').slice(0, 100) + '...'}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-0">
                                        <Link href={`/news/${item.id}`} className="text-sm text-indigo-600 hover:underline">
                                            Read more →
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </HomeLayout>
        </>
    );
};

export default Show;
