import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    id_main_categories: number;
}

interface Gallery {
    id: number;
    subcategory_id: number;
    title: string;
    description: string;
    type: string;
    status: string;
}

interface Photo {
    id: number;
    gallery_id: number;
    photo_path: string;
}

interface Video {
    id: number;
    gallery_id: number;
    video_url: string;
}

interface Props {
    maincategories: Category[];
    subcategories: Subcategory[];
    gallery: Gallery;
    photos: Photo[] | null;
    videos: Video[] | null;
}

const ShowGallery: React.FC<Props> = ({ maincategories, subcategories, gallery, photos, videos }) => {
    const { props } = usePage<{ flash?: { message?: string } }>();
    const message = props.flash?.message;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const closeModal = () => setSelectedImage(null);

    const mainCategory = maincategories.find((category) =>
        subcategories.some(
            (subcategory) =>
                subcategory.id === gallery.subcategory_id &&
                subcategory.id_main_categories === category.id
        )
    );

    const subcategory = subcategories.find(
        (subcategory) => subcategory.id === gallery.subcategory_id
    );

    return (
        <AppLayout>
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-10 shadow-xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">Gallery Detail</h1>

                    {message && (
                        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                            {message}
                        </div>
                    )}

                    <div className="space-y-6">
                        <Detail title="Main Category" value={mainCategory?.name ?? 'N/A'} />
                        <Detail title="Subcategory" value={subcategory?.name ?? 'N/A'} />
                        <Detail title="Title" value={gallery.title} />
                        <Detail title="Description" value={gallery.description} />

                        {gallery.type === 'photo' && photos && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-700">Photos</h2>
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {photos.map((photo) => (
                                        <img
                                            key={photo.id}
                                            src={`/storage/gallery/photos/${photo.photo_path}`}
                                            alt="Gallery Photo"
                                            className="h-32 w-full cursor-pointer rounded-lg object-cover transition hover:scale-105"
                                            onClick={() => setSelectedImage(`/storage/gallery/photos/${photo.photo_path}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {gallery.type === 'video' && videos && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-700">Videos</h2>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {videos.map((video) => (
                                        <div key={video.id} className="aspect-video w-full overflow-hidden rounded-lg shadow">
                                            <video
                                                src={`/storage/gallery/videos/${video.video_url}`}
                                                controls
                                                className="h-full w-full"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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

            {/* MODAL */}
            <Transition appear show={!!selectedImage} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="relative">
                                        <img
                                            src={selectedImage ?? ''}
                                            alt="Preview"
                                            className="w-full rounded-lg object-contain"
                                        />
                                        <button
                                            onClick={closeModal}
                                            className="absolute top-2 right-2 rounded-full bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AppLayout>
    );
};

const Detail = ({ title, value }: { title: string; value: string }) => (
    <div>
        <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        <p className="mt-2 text-base text-gray-800">{value}</p>
    </div>
);

export default ShowGallery;
