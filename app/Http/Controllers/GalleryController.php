<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use App\Models\M_galleries;
use App\Models\M_gallery_photos;
use App\Models\M_gallery_videos;
use App\Models\M_main_categories;
use App\Models\M_sub_categories;



class GalleryController extends Controller
{
    protected $subCategoryModel, $mainCategoryModel, $galleryModel, $galleryPhotoModel, $galleryVideoModel;

    public function __construct(M_sub_categories $subCategoryModel, M_main_categories $mainCategoryModel, M_galleries $galleryModel, M_gallery_photos $galleryPhotoModel, M_gallery_videos $galleryVideoModel)
    {
        $this->subCategoryModel = $subCategoryModel;
        $this->mainCategoryModel = $mainCategoryModel;
        $this->galleryModel = $galleryModel;
        $this->galleryPhotoModel = $galleryPhotoModel;
        $this->galleryVideoModel = $galleryVideoModel;
    }

    public function index()
    {
        $galleries = $this->galleryModel->with(['author', 'subcategory'])->get();
        return response()->json($galleries);
    }

    public function show($id)
    {
        $gallery = $this->galleryModel->with(['author', 'subcategory'])->find($id);
        if (!$gallery) {
            return response()->json(['message' => 'Gallery not found'], 404);
        }
        return response()->json($gallery);
    }


    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subcategory_id' => 'required|exists:sub_categories,id',
            'file' => 'required|array',
            'file.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,mkv,webm|max:20480',
        ]);

        DB::beginTransaction();

        try {
            // Deteksi tipe berdasarkan file
            $hasImage = false;
            $hasVideo = false;

            foreach ($request->file('file') as $uploadedFile) {
                $mime = $uploadedFile->getMimeType();
                if (str_starts_with($mime, 'image/')) {
                    $hasImage = true;
                } elseif (str_starts_with($mime, 'video/')) {
                    $hasVideo = true;
                }
            }

            // Tentukan type
            if ($hasImage && $hasVideo) {
                $type = 'mixed';
            } elseif ($hasImage) {
                $type = 'photo';
            } elseif ($hasVideo) {
                $type = 'video';
            } else {
                return response()->json(['message' => 'File tidak valid'], 422);
            }

            // Simpan galeri utama
            $gallery = $this->galleryModel->create([
                'author_id' => $request->author_id,
                'title' => $request->title,
                'description' => $request->description,
                'subcategory_id' => $request->subcategory_id,
                'type' => $type,
            ]);

            $hasSavedFile = false;

            if ($request->hasFile('file')) {
                foreach ($request->file('file') as $uploadedFile) {
                    $mime = $uploadedFile->getMimeType();
                    $fileName = time() . '_' . $uploadedFile->getClientOriginalName();

                    if (str_starts_with($mime, 'image/')) {
                        $uploadedFile->storeAs('gallery/photos', $fileName, 'public');
                        $this->galleryPhotoModel->create([
                            'gallery_id' => $gallery->id,
                            'photo_path' => $fileName,
                            'created_at' => now(),
                        ]);
                        $hasSavedFile = true;
                    } elseif (str_starts_with($mime, 'video/')) {
                        $uploadedFile->storeAs('gallery/videos', $fileName, 'public');
                        $this->galleryVideoModel->create([
                            'gallery_id' => $gallery->id,
                            'video_url' => $fileName,
                            'created_at' => now(),
                        ]);
                        $hasSavedFile = true;
                    }
                }
            }

            if (!$hasSavedFile) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Tidak ada file yang valid disimpan. Harus berupa gambar atau video yang valid.',
                ], 422);
            }

            DB::commit();
            return response()->json($gallery, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Gagal menyimpan galeri',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function edit(string $id)
    {
        $gallery = M_galleries::with(['photos', 'videos'])->findOrFail($id);
    
        $subcategories = M_sub_categories::all();
    
        return Inertia::render('Galleries/EditGalleryForm', [
            'gallery' => $gallery,
            'photos' => $gallery->photos ?? [],
            'videos' => $gallery->videos ?? [],
            'subcategories' => $subcategories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'subcategory_id' => 'sometimes|required|exists:sub_categories,id',
            'file' => 'nullable|array',
            'file.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,mkv,webm|max:20480',
        ]);

        DB::beginTransaction();

        try {
            $gallery = $this->galleryModel->findOrFail($id);

            // Update data dasar galeri
            $gallery->update([
                'title' => $request->has('title') ? $request->title : $gallery->title,
                'description' => $request->has('description') ? $request->description : $gallery->description,
                'subcategory_id' => $request->has('subcategory_id') ? $request->subcategory_id : $gallery->subcategory_id,
            ]);

            $hasImage = false;
            $hasVideo = false;
            $hasNewFile = false;

            if ($request->hasFile('file')) {
                foreach ($request->file('file') as $uploadedFile) {
                    $mime = $uploadedFile->getMimeType();
                    $fileName = time() . '_' . $uploadedFile->getClientOriginalName();

                    if (str_starts_with($mime, 'image/')) {
                        $uploadedFile->storeAs('gallery/photos', $fileName, 'public');
                        $this->galleryPhotoModel->create([
                            'gallery_id' => $gallery->id,
                            'photo_path' => $fileName,
                            'created_at' => now(),
                        ]);
                        $hasImage = true;
                        $hasNewFile = true;
                    } elseif (str_starts_with($mime, 'video/')) {
                        $uploadedFile->storeAs('gallery/videos', $fileName, 'public');
                        $this->galleryVideoModel->create([
                            'gallery_id' => $gallery->id,
                            'video_url' => $fileName,
                            'created_at' => now(),
                        ]);
                        $hasVideo = true;
                        $hasNewFile = true;
                    }
                }

                // Update tipe galeri jika ada file baru
                if ($hasNewFile) {
                    $existingPhotos = $this->galleryPhotoModel->where('gallery_id', $gallery->id)->exists();
                    $existingVideos = $this->galleryVideoModel->where('gallery_id', $gallery->id)->exists();

                    if ($existingPhotos && $existingVideos) {
                        $gallery->update(['type' => 'mixed']);
                    } elseif ($existingPhotos) {
                        $gallery->update(['type' => 'photo']);
                    } elseif ($existingVideos) {
                        $gallery->update(['type' => 'video']);
                    } else {
                        // Tidak ada file yang valid
                        DB::rollBack();
                        return response()->json([
                            'message' => 'Tidak ada file valid ditemukan pada galeri ini.',
                        ], 422);
                    }
                }
            }

            DB::commit();
            return response()->json($gallery, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Gagal mengupdate galeri',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
