import AppLayout from '@/layouts/app-layout';
import { Button } from '@headlessui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect  } from 'react';

interface Props {
    maincategories: { id: number; name: string }[];
    subcategories: { id: number; name: string; id_main_categories: number }[];
}


const CreateNews: React.FC<Props> = ({ maincategories, subcategories }) => {
    const { data, setData, processing, errors } = useForm({
        id_main_categories: '',
        subcategory_id: '',
        title: '',
        content: '',
        image: null as File | null,
    });

    const [filteredSubcategories, setFilteredSubcategories] = useState<
        { id: number; name: string }[]
    >([]);

    useEffect(() => {
        if (data.id_main_categories) {
            const filtered = subcategories.filter(
                (subcategory) => subcategory.id_main_categories === Number(data.id_main_categories)
            );
            setFilteredSubcategories(filtered);
        } else {
            setFilteredSubcategories([]);
        }
    }, [data.id_main_categories, subcategories]);
    // HAPUS bagian filter manual disini    

    const { props } = usePage<{ flash?: { message?: string } }>();
    const message = props.flash?.message;

    const handleMainCategoryChange = (maincategoryId: string) => {
        setData('id_main_categories', maincategoryId);
        setData('subcategory_id', ''); // Reset subcategory selection
        // HAPUS bagian filter manual disini
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id_main_categories', data.id_main_categories);
        formData.append('subcategory_id', data.subcategory_id);
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.image) {
            formData.append('image', data.image);
        }
        router.post('/news/store', formData);
    };

    return (
        <AppLayout>
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-10 shadow-xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">Create News</h1>

                    {message && (
                        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="id_main_categories" className="block text-lg font-medium text-gray-700">
                                Main Category
                            </label>
                            <select
                                id="id_main_categories"
                                value={data.id_main_categories}
                                onChange={(e) => handleMainCategoryChange(e.target.value)}
                                className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    errors.id_main_categories ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">Select a main category</option>
                                {maincategories.map((maincategory) => (
                                    <option key={maincategory.id} value={maincategory.id}>
                                        {maincategory.name}
                                    </option>
                                ))}
                            </select>
                            {errors.id_main_categories && (
                                <p className="mt-1 text-sm text-red-500">{errors.id_main_categories}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="subcategory_id" className="block text-lg font-medium text-gray-700">
                                Subcategory
                            </label>
                            <select
                                id="subcategory_id"
                                value={data.subcategory_id}
                                onChange={(e) => setData('subcategory_id', e.target.value)}
                                className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    errors.subcategory_id ? 'border-red-500' : ''
                                }`}
                                disabled={!filteredSubcategories.length}
                            >
                                <option value="">Select a subcategory</option>
                                {filteredSubcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subcategory_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.subcategory_id}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    errors.title ? 'border-red-500' : ''
                                }`}
                                placeholder="Enter news title"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-lg font-medium text-gray-700">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    errors.content ? 'border-red-500' : ''
                                }`}
                                rows={5}
                                placeholder="Enter news content"
                            />
                            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-lg font-medium text-gray-700">
                                Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept='image/*'
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    errors.image ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>

                            <Button
                                type="button"
                                className="ml-4 rounded-lg bg-gray-300 px-6 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                onClick={() => router.get('/news')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default CreateNews;
