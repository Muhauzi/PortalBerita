// resources/js/Pages/Home/Index.tsx

import React from 'react';

interface News {
  id: string;
  author: {
    name: string;
  };
  title: string;
  image: string;
  status: string;
  description: string;
  created_at: string;
}

interface MainCategory {
  id: number;
  name: string;
  description: string;
}

interface GalleryVideo {
  id: string;
  video_url: string;
  thumbnail: string;
  created_at: string;
}

interface Props {
  news: News[];
  mainCategories: MainCategory[];
  galleries: GalleryVideo[];
}

const Index: React.FC<Props> = ({ news, mainCategories, galleries }) => {
  const topNews = news[0];
  const recentNews = news.slice(1, 4);
  const latestNews = news.slice(4);

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-black px-6 py-2 text-sm text-white">
        <div className="font-medium">{new Date().toLocaleDateString()}</div>
        <div className="flex space-x-4">
          <a href="#" className="transition hover:text-gray-300">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="transition hover:text-gray-300">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="transition hover:text-gray-300">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="transition hover:text-gray-300">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl font-bold">SITE NAME</div>
          <div className="hidden space-x-8 md:flex">
            {mainCategories.map((category) => (
              <div className="font-medium hover:text-gray-700" key={category.id}>
                {category.name}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Main News Sections */}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Top News Section */}
          <section className="mb-12">
            <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Top News</h2>
            {topNews && (
              <div className="relative col-span-2 h-[30rem] overflow-hidden rounded-xl">
                <img src={topNews.image} alt={topNews.title} className="h-full w-full object-cover" />
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-6">
                  <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">TOP STORY</span>
                  <h2 className="mt-2 text-3xl font-bold text-white">{topNews.title}</h2>
                  <p className="mt-2 text-gray-200">{topNews.description}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-300">
                    <span>By {topNews.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(topNews.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Recent News Section */}
          <section className="mb-12">
            <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Recent News</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {recentNews.map((item) => (
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm" key={item.id}>
                  <h3 className="mt-1 font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Videos Section */}
          <section className="mb-12">
            <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Videos</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {galleries.map((video) => (
                <div className="relative col-span-2 h-96 overflow-hidden rounded-2xl bg-gray-700" key={video.id}>
                  <img src={video.thumbnail} alt="Video Thumbnail" className="h-full w-full object-cover" />
                  <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <span className="inline-block rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white">VIDEO</span>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-300">
                      <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Latest News Section */}
          <section className="mb-12">
            <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Latest News</h2>
            <div className="flex flex-col items-center gap-12">
              {latestNews.map((item) => (
                <div key={item.id} className="flex w-full max-w-6xl gap-8">
                  <img src={item.image} alt={item.title} className="h-48 w-96 rounded-xl bg-gray-200 object-cover" />
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="mt-2 text-lg leading-snug font-bold">{item.title}</h3>
                      <p className="mt-2 text-base text-gray-600">{item.description}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                      <span>{item.author.name}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
