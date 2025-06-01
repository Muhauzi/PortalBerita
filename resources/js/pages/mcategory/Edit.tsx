import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';

interface MainCategory {
    id: number;
    name: string;
    description: string;
}

interface Props {
    mainCategory: MainCategory;
}

const Edit: React.FC<Props> = ({ mainCategory }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: mainCategory.name,
        description: mainCategory.description,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/category/main/${mainCategory.id}`);
    };

    return (
        <AppLayout>
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                errors.name ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                errors.description ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            {processing ? 'Saving...' : 'Update'}
                        </button>

                        <a
                            href="/category/main"
                            className="inline-block px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;
