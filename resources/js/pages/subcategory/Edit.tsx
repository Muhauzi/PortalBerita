import AppLayout from '@/layouts/app-layout';
import { Button } from '@headlessui/react';
import { router, useForm, usePage } from '@inertiajs/react';

interface Props {
    idMainCategory: number;
    idSubCategory: number;
    initialData: {
        name: string;
        description: string;
    };
}

const EditSubCategory: React.FC<Props> = ({ idMainCategory, idSubCategory, initialData }) => {
    const { data, setData, processing, errors } = useForm({
        idMainCategory: idMainCategory,
        name: initialData.name,
        description: initialData.description,
    });

    const { props } = usePage<{ flash?: { message?: string } }>();
    const message = props.flash?.message;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('idMainCategory', String(data.idMainCategory));
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('_method', 'PUT'); // Specify the method as PUT for update
        router.post('/category/sub/update/' + idMainCategory + '/' + idSubCategory, formData, {
            onSuccess: () => {
                router.get('/category/sub/' + idMainCategory);
            },
        });
        
    };

    return (
        <AppLayout>
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-10 shadow-xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">Edit Sub Category</h1>

                    {/* Error Message Section */}
                    {message && (
                        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="idMainCategory" value={idMainCategory} />
                        <div>
                            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    errors.name ? 'border-red-500' : ''
                                }`}
                                placeholder="Enter category name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    errors.description ? 'border-red-500' : ''
                                }`}
                                rows={5}
                                placeholder="Enter category description"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
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
                                onClick={() => router.get('/category/sub/' + idMainCategory)}
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

export default EditSubCategory;
