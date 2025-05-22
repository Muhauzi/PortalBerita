import AppLayout from '@/layouts/app-layout';
import { router, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react';
import SwalNotification from '@/components/swalNotification';
import Swal from 'sweetalert2';

interface MainCategory {
    id: number;
    name: string;
    description: string;
}

interface Props {
    mainCategories: {
        data: MainCategory[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
        perPage: string;
    };
}

const Index: React.FC<Props> = ({ mainCategories, filters }) => {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || '10');

    const handleSearch = () => {
        router.get('/category/main', { search, perPage }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/category/main/${id}`);
                Swal.fire(
                    'Deleted!',
                    'The category has been deleted.',
                    'success'
                );
            }
        });
    };

    return (
        <AppLayout>
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800">Main Categories</h1>
                        <Link
                            href="/category/main/create"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
                        >
                            + Add Main Category
                        </Link>
                    </div>

                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="perPage" className="text-sm text-gray-600">Show</label>
                            <select
                                id="perPage"
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(e.target.value);
                                    router.get('/category/main', { search, perPage: e.target.value }, { preserveState: true });
                                }}
                                className="rounded-md border-gray-300 text-sm"
                            >
                                {[5, 10, 25, 50, 100].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            <span className="text-sm text-gray-600">entries</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm sm:w-64"
                            />
                            <button
                                onClick={handleSearch}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-md shadow">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {mainCategories.data.map((category, index) => (
                                    <tr key={category.id}>
                                        <td className="px-6 py-4 text-sm text-gray-700">{(mainCategories.current_page - 1) * parseInt(perPage) + index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{category.description}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <Link href={`/category/main/${category.id}`} className="text-blue-600 hover:text-blue-800">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link href={`/category/main/${category.id}/edit`} className="text-green-600 hover:text-green-800">
                                                    <Pencil size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {mainCategories.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-wrap items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {(mainCategories.current_page - 1) * parseInt(perPage) + 1} to{' '}
                            {Math.min(mainCategories.current_page * parseInt(perPage), mainCategories.total)} of{' '}
                            {mainCategories.total} entries
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {mainCategories.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => router.get(link.url || '', {}, { preserveState: true })}
                                    className={`px-3 py-1 rounded ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    } text-sm`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        <SwalNotification />
        </AppLayout>
    );
};

export default Index;
