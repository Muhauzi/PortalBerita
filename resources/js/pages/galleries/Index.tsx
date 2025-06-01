import AppLayout from '@/layouts/app-layout';
import { router, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import SwalNotification from '@/components/swal-notification';
import Swal from 'sweetalert2';

interface galleries {
    id: string;
    author: {
        name: string;
    };
    type: string;
    title: string;
    description: string;
}

interface Props {
    galleriesData: {
        data: galleries[];
        current_page: number;
        last_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        search: string;
        perPage: string;
    };
}

const Index: React.FC<Props> = ({ galleriesData, filters }) => {
    const { props } = usePage();
    console.log('Inertia props flash:', props.flash);
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || '10');

    const handleSearch = () => {
        router.get('/gallery', { search, perPage }, { preserveState: true });
    };

    const handleDelete = (id: string) => {
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
                router.delete(`/gallery/${id}`);
                Swal.fire('Deleted!', 'The gallery item has been deleted.', 'success');
            }
        });
    };

    return (
        <AppLayout>
            <SwalNotification />
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
                        <Link
                            href="/gallery/create"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
                        >
                            + Add Gallery
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
                                    router.get('/gallery', { search, perPage: e.target.value }, { preserveState: true });
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
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Author</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {galleriesData.data.map((gallery, index) => (
                                    <tr key={gallery.id}>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {(galleriesData.current_page - 1) * parseInt(perPage) + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{gallery.author?.name ?? '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{gallery.type}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{gallery.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {gallery.description.length > 50
                                                ? `${gallery.description.slice(0, 50)}...`
                                                : gallery.description}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <Link href={`/gallery/${gallery.id}`} className="text-blue-600 hover:text-blue-800">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link href={`/gallery/${gallery.id}/edit`} className="text-green-600 hover:text-green-800">
                                                    <Pencil size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(gallery.id)} className="text-red-600 hover:text-red-800">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {galleriesData.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            No gallery items found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-wrap items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {(galleriesData.current_page - 1) * parseInt(perPage) + 1} to{' '}
                            {Math.min(galleriesData.current_page * parseInt(perPage), galleriesData.total)} of{' '}
                            {galleriesData.total} entries
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {galleriesData.links.map((link, i) => (
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
        </AppLayout>
    );
};

export default Index;
