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

    public function index(Request $request)
    {
        $query = $this->galleryModel->newQuery();
        // Optional search
        if ($request->has('search') && $request->search !== null) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->input('perPage', 10); // Default to 10

        $galleries = $query->with(['subcategory', 'author'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('galleries/Index', [
            'galleriesData' => $galleries,
            'filters' => $request->all(['search', 'perPage']),
        ]);
    }

    public function show($id)
    {
        $gallery = $this->galleryModel->with(['author', 'subcategory'])->find($id);        
        $maincategories = $this->mainCategoryModel->all();
        $subcategories = $this->subCategoryModel->with('mainCategory')->get();
        if (!$gallery) {
            return response()->json(['message' => 'Gallery not found'], 404);
        }
        if ($gallery) {
            if ($gallery->type == 'photo') {
                $photos = $this->galleryPhotoModel->where('gallery_id', $gallery->id)->get();
                $videos = null;

                return Inertia::render('galleries/Show', [
                    'gallery' => $gallery,
                    'photos' => $photos,
                    'videos' => $videos,
                    'maincategories' => $maincategories,
                    'subcategories' => $subcategories,
                ]);
            } elseif ($gallery->type == 'video') {
                $videos = $this->galleryVideoModel->where('gallery_id', $gallery->id)->get();
                $photos = null;

                return Inertia::render('galleries/Show', [
                    'gallery' => $gallery,
                    'photos' => $photos,
                    'videos' => $videos,
                    'maincategories' => $maincategories,
                    'subcategories' => $subcategories,
                ]);
            } else {
                $photos = $this->galleryPhotoModel->where('gallery_id', $gallery->id)->get();
                $videos = $this->galleryVideoModel->where('gallery_id', $gallery->id)->get();

                return Inertia::render('galleries/Show', [
                    'gallery' => $gallery,
                    'photos' => $photos,
                    'videos' => $videos,
                    'maincategories' => $maincategories,
                    'subcategories' => $subcategories,
                ]);
            }
        } else {
            $photos = null;
            $videos = null;
        }
        return response()->json($gallery);
    }

    public function create(Request $request)
    {
        $maincategories = $this->mainCategoryModel->all();
        $subcategories = $this->subCategoryModel->with('mainCategory')->get();
        return Inertia::render('galleries/Create', [
            'subcategories' => $subcategories,
            'maincategories' => $maincategories,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subcategory_id' => 'required|exists:sub_categories,id',
            'type' => 'nullable|string|in:photo,video,mixed',
            'files' => 'required|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,mkv,webm|max:20480',
        ]);

        DB::beginTransaction();

        try {
            // Deteksi tipe berdasarkan file
            $hasImage = false;
            $hasVideo = false;

            foreach ($request->file('files') as $uploadedFile) {
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
                'author_id' => Auth::user()->id,
                'title' => $request->title,
                'description' => $request->description,
                'subcategory_id' => $request->subcategory_id,
                'type' => $type,
            ]);

            $hasSavedFile = false;

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $uploadedFile) {
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
            return redirect('/gallery')->with('success', 'Gallery created successfully');
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
    
        $maincategories = M_main_categories::all();
        $subcategories = M_sub_categories::all();
    
        // Gabungkan paths foto dan video jadi satu array file
        $files = [];
    
        foreach ($gallery->photos ?? [] as $photo) {
            $files[] = asset("storage/gallery/photos/{$photo->photo_path}");
        }
    
        foreach ($gallery->videos ?? [] as $video) {
            $files[] = asset("storage/gallery/videos/{$video->video_url}");
        }
    
        return Inertia::render('galleries/Edit', [
            'gallery' => [
                'id' => $gallery->id,
                'id_main_categories' => $gallery->subcategory->id_main_categories ?? null,
                'subcategory_id' => $gallery->subcategory_id,
                'author_id' => $gallery->author_id,
                'type' => $gallery->type,
                'title' => $gallery->title,
                'description' => $gallery->description,
                'files' => $files,
            ],
            'maincategories' => $maincategories,
            'subcategories' => $subcategories,
        ]);
    }
    

    public function update(Request $request, $id)
    {
        // dd($request->all());
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'subcategory_id' => 'sometimes|required|exists:sub_categories,id',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,mkv,webm|max:20480',
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

            if ($request->has('deleted_files')) {
                foreach ($request->input('deleted_files') as $fileUrl) {
                    if (str_contains($fileUrl, 'photos')) {
                        $photo = $this->galleryPhotoModel->where('gallery_id', $gallery->id)->where('photo_path', basename($fileUrl))->first();
                        if ($photo) {
                            Storage::disk('public')->delete('gallery/photos/' . $photo->photo_path);
                            $photo->delete();
                        }
                    } elseif (str_contains($fileUrl, 'videos')) {
                        $video = $this->galleryVideoModel->where('gallery_id', $gallery->id)->where('video_url', basename($fileUrl))->first();
                        if ($video) {
                            Storage::disk('public')->delete('gallery/videos/' . $video->video_url);
                            $video->delete();
                        }
                    }
                }
            }
            

            $hasImage = false;
            $hasVideo = false;
            $hasNewFile = false;

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $uploadedFile) {
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
            return redirect('/gallery')->with('success', 'Gallery updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Gagal mengupdate galeri',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $gallery = $this->galleryModel->findOrFail($id);

            // Hapus foto
            foreach ($gallery->photos as $photo) {
                Storage::disk('public')->delete('gallery/photos/' . $photo->photo_path);
                $photo->delete();
            }

            // Hapus video
            foreach ($gallery->videos as $video) {
                Storage::disk('public')->delete('gallery/videos/' . $video->video_url);
                $video->delete();
            }

            // Hapus galeri
            $gallery->delete();

            DB::commit();
            return redirect('/gallery')->with('success', 'Gallery deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete gallery', 'message' => $e->getMessage()], 500);
        }
    }
}
