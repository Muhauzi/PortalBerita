import AppLayout from '@/layouts/app-layout';
import { Button } from '@headlessui/react';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Props {
    maincategories: { id: number; name: string }[];
    subcategories: { id: number; name: string; id_main_categories: number }[];
    gallery: {
        id: number;
        id_main_categories: number;
        subcategory_id: number;
        author_id: string;
        type: string;
        title: string;
        description: string;
        files: string[]; // URLs of existing files
    };
}

const EditGallery: React.FC<Props> = ({ maincategories, subcategories, gallery }) => {
    const { data, setData, processing, errors } = useForm({
        id_main_categories: gallery.id_main_categories.toString(),
        author_id: gallery.author_id,
        type: gallery.type,
        title: gallery.title,
        description: gallery.description,
        subcategory_id: gallery.subcategory_id.toString(),
        files: [] as File[],
    });

    const [filteredSubcategories, setFilteredSubcategories] = useState<{ id: number; name: string }[]>([]);
    const [previewFiles, setPreviewFiles] = useState<string[]>(gallery.files);
    const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

    useEffect(() => {
        if (data.id_main_categories) {
            const filtered = subcategories.filter((subcategory) => subcategory.id_main_categories === Number(data.id_main_categories));
            setFilteredSubcategories(filtered);
        } else {
            setFilteredSubcategories([]);
        }
    }, [data.id_main_categories, subcategories]);

    const handleMainCategoryChange = (maincategoryId: string) => {
        setData('id_main_categories', maincategoryId);
        setData('subcategory_id', ''); // Reset subcategory selection
    };

    const handleTypeChange = (type: string) => {
        setData('type', type);
        setData('files', []); // Clear uploaded files
        setPreviewFiles(gallery.files); // Reset to existing files
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setData('files', [...data.files, ...fileArray]);

            const previews = fileArray.map((file) => URL.createObjectURL(file));
            setPreviewFiles((prev) => [...prev, ...previews]);
        }
    };

    const removeFile = (index: number) => {
        const fileToRemove = previewFiles[index];

        Swal.fire({
            title: 'Are you sure?',
            text: 'This file will be removed from this gallery.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                if (gallery.files.includes(fileToRemove)) {
                    setDeletedFiles((prev) => [...prev, fileToRemove]);
                } else {
                    setData(
                        'files',
                        data.files.filter((_, i) => i !== index - gallery.files.length + deletedFiles.length),
                    );
                }

                setPreviewFiles(previewFiles.filter((_, i) => i !== index));
                Swal.fire('Deleted!', 'The file has been removed.', 'success');
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('author_id', data.author_id);
        formData.append('type', data.type);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('subcategory_id', data.subcategory_id);
        data.files.forEach((file) => formData.append('files[]', file));
        deletedFiles.forEach((fileUrl) => formData.append('deleted_files[]', fileUrl));
        formData.append('_method', 'PUT');

        router.post(`/gallery/${gallery.id}/update`, formData);
    };

    const [modalContent, setModalContent] = useState<{ type: 'photo' | 'video'; src: string } | null>(null);

    return (
        <AppLayout>
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-10 shadow-xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">Edit Gallery</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="type" className="block text-lg font-medium text-gray-700">
                                Type
                            </label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className={`mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    errors.type ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">Select type</option>
                                <option value="photo">Photo</option>
                                <option value="video">Video</option>
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
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
                                placeholder="Enter gallery title"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
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
                                placeholder="Enter gallery description"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

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
                            {errors.id_main_categories && <p className="mt-1 text-sm text-red-500">{errors.id_main_categories}</p>}
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
                            >
                                <option value="">Select a subcategory</option>
                                {filteredSubcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subcategory_id && <p className="mt-1 text-sm text-red-500">{errors.subcategory_id}</p>}
                        </div>

                        <div>
                            <label htmlFor="files" className="block text-lg font-medium text-gray-700">
                                {data.type === 'photo' ? 'Photos' : 'Videos'}
                            </label>
                            <input
                                type="file"
                                id="files"
                                accept={data.type === 'photo' ? 'image/*' : 'video/*'}
                                multiple
                                onChange={handleFileChange}
                                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {previewFiles.map((file, index) => (
                                    <div key={index} className="relative">
                                        {data.type === 'photo' ? (
                                            <img
                                                src={file}
                                                alt={`Preview ${index}`}
                                                className="h-32 w-full cursor-pointer rounded-lg object-cover"
                                                onClick={() => setModalContent({ type: 'photo', src: file })}
                                            />
                                        ) : (
                                            <video
                                                src={file}
                                                controls
                                                className="h-32 w-full cursor-pointer rounded-lg object-cover"
                                                onClick={() => setModalContent({ type: 'video', src: file })}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {modalContent && (
                                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                                    <div className="relative rounded-lg bg-white p-4 shadow-lg">
                                        <button
                                            type="button"
                                            onClick={() => setModalContent(null)}
                                            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white"
                                        >
                                            ✕
                                        </button>
                                        {modalContent.type === 'photo' ? (
                                            <img src={modalContent.src} alt="Modal Preview" className="max-h-[80vh] max-w-[80vw] rounded-lg" />
                                        ) : (
                                            <video src={modalContent.src} controls className="max-h-[80vh] max-w-[80vw] rounded-lg" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>

                            <Button
                                type="button"
                                className="ml-4 rounded-lg bg-gray-300 px-6 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                onClick={() => router.get('/gallery')}
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

export default EditGallery;
