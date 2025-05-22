import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface Props {
    maincategories: { id: number; name: string }[];
    subcategories: { id: number; name: string; id_main_categories: number }[];
    news: {
        id: number;
        subcategory_id: number;
        title: string;
        content: string;
        image: string;
        status: string;
    };
}

const ShowNews: React.FC<Props> = ({ maincategories, subcategories, news }) => {
    const { props } = usePage<{ flash?: { message?: string } }>();
    const message = props.flash?.message;

    const mainCategory = maincategories.find((category) =>
        subcategories.some(
            (subcategory) =>
                subcategory.id === news.subcategory_id &&
                subcategory.id_main_categories === category.id
        )
    );

    const subcategory = subcategories.find(
        (subcategory) => subcategory.id === news.subcategory_id
    );

    return (
        <AppLayout>
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-10 shadow-xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">News Detail</h1>

                    {message && (
                        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                            {message}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-700">Main Category</h2>
                            <p className="mt-2 text-base text-gray-800">
                                {mainCategory ? mainCategory.name : 'N/A'}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-700">Subcategory</h2>
                            <p className="mt-2 text-base text-gray-800">
                                {subcategory ? subcategory.name : 'N/A'}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-700">Title</h2>
                            <p className="mt-2 text-base text-gray-800">{news.title}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-700">Content</h2>
                            <p className="mt-2 text-base text-gray-800">{news.content}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-700">Image</h2>
                            {news.image ? (
                                <img
                                    src={`/storage/images/news/${news.image}`}
                                    alt="News"
                                    className="mt-4 h-32 w-32 object-cover"
                                />
                            ) : (
                                <p className="mt-2 text-base text-gray-800">No image available</p>
                            )}
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-700">Status</h2>
                            <p className="mt-2 text-base text-gray-800">
                                <button
                                    type="button"
                                    className={`rounded-lg px-6 py-3 text-base font-semibold text-white focus:outline-none ${
                                        news.status === 'published'
                                            ? 'bg-green-500 cursor-not-allowed'
                                            : 'bg-yellow-500 cursor-not-allowed'
                                    }`}
                                    disabled
                                >
                                    {news.status === 'published' ? 'Published' : 'Draft'}
                                </button>
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="rounded-lg bg-gray-300 px-6 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                onClick={() => history.back()}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ShowNews;
