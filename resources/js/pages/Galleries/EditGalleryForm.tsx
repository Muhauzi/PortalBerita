import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Transition } from '@headlessui/react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';

import type { BreadcrumbItem } from '@/types';

type Gallery = {
  id: number;
  title: string;
  description: string | null;
  subcategory_id: number;
};

type GalleryPhoto = {
  id: number;
  photo_path: string;
};

type GalleryVideo = {
  id: number;
  video_url: string;
};

type SubCategory = {
  id: number;
  name: string;
};

type Props = {
  gallery: Gallery;
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
  subcategories: SubCategory[];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Galleries', href: '/galleries' },
  { title: 'Edit Gallery', href: '#' },
];

export default function EditGallery({ gallery, photos, videos, subcategories }: Props) {
  const [existingPhotos, setExistingPhotos] = useState(photos);
  const [existingVideos, setExistingVideos] = useState(videos);

  const {
    data,
    setData,
    post,
    errors,
    processing,
    recentlySuccessful,
    progress,
  } = useForm({
    _method: 'PUT',
    title: gallery.title,
    description: gallery.description || '',
    subcategory_id: gallery.subcategory_id,
    file: [] as File[],
    delete_files: [] as string[],
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('galleries.update', gallery.id), { preserveScroll: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setData('file', Array.from(e.target.files));
    }
  };

  const handleDeleteOldFile = (filePath: string) => {
    setData('delete_files', [...data.delete_files, filePath]);
    setExistingPhotos(existingPhotos.filter(p => p.photo_path !== filePath));
    setExistingVideos(existingVideos.filter(v => v.video_url !== filePath));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Gallery" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Edit Gallery" description="Update your gallery’s content and metadata." />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="Enter gallery title"
              />
              <InputError message={errors.title} className="mt-2" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter description"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subcategory_id">Subcategory</Label>
              <select
                id="subcategory_id"
                value={data.subcategory_id}
                onChange={(e) => setData('subcategory_id', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">-- Select Subcategory --</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <InputError message={errors.subcategory_id} className="mt-2" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="file">Upload New Files</Label>
              <Input
                id="file"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
              />
              <InputError message={errors.file} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {existingPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={`/storage/gallery/photos/${photo.photo_path}`}
                    alt=""
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteOldFile(photo.photo_path)}
                    className="absolute top-1 right-1 text-xs bg-red-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    Hapus
                  </button>
                </div>
              ))}

              {existingVideos.map((video) => (
                <div key={video.id} className="relative group">
                  <video controls className="w-full h-40 rounded-lg">
                    <source src={`/storage/gallery/videos/${video.video_url}`} />
                  </video>
                  <button
                    type="button"
                    onClick={() => handleDeleteOldFile(video.video_url)}
                    className="absolute top-1 right-1 text-xs bg-red-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button disabled={processing}>Simpan Perubahan</Button>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Tersimpan</p>
              </Transition>
            </div>

            {progress && (
              <p className="text-sm text-gray-500">Mengunggah: {progress.percentage}%</p>
            )}
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
