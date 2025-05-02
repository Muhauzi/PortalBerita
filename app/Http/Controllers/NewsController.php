<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use App\Models\M_news;
use App\Models\M_main_categories;
use App\Models\M_sub_categories;

class NewsController extends Controller
{
    protected $subCategoryModel, $mainCategoryModel, $newsModel;
    public function __construct(M_sub_categories $subCategoryModel, M_main_categories $mainCategoryModel, M_news $newsModel)
    {
        $this->subCategoryModel = $subCategoryModel;
        $this->mainCategoryModel = $mainCategoryModel;
        $this->newsModel = $newsModel;
    }

    public function index()
    {
        $news = $this->newsModel->get();
        return response()->json($news);
    }

    public function show($id)
    {
        $news = $this->newsModel->find($id);
        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }
        return response()->json($news);
    }

    public function create()
    {
        $subCategories = $this->subCategoryModel->get();
        $mainCategories = $this->mainCategoryModel->get();
        return inertia('News/Create', [
            'subCategories' => $subCategories,
            'mainCategories' => $mainCategories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'subcategory_id' => 'required|exists:sub_categories,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $image = $request->file('image');
        if (!$image) {
            return response()->json(['message' => 'Image is required'], 422);
        }

        // Simpan file gambar
        $fileName = time() . '_' . $image->getClientOriginalName();
        $filePath = $image->storeAs('images', $fileName, 'public');

        $data = [
            'title' => $request->title,
            'content' => $request->content,
            'subcategory_id' => $request->subcategory_id,
            'image' => $fileName,
            'author' => $request->user_id,
            'status' => 'draft',
            'views_count' => 0,
            'likes_count' => 0,
        ];
        $news = $this->newsModel->create($data);
        if (!$news) {
            return response()->json(['message' => 'Failed to create news'], 500);
        }
        return response()->json($news, 201);
    }

    public function update(Request $request, $id)
    {
        // Cari news berdasarkan ID
        $news = $this->newsModel->find($id);

        // Jika tidak ditemukan, kembalikan error 404
        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        // Validasi data request
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'subcategory_id' => 'required|exists:sub_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $file = $request->file('image');
        if ($file) {
            // Hapus file lama jika ada
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            // Simpan file baru
            $filePath = $file->store('images', 'public');
        } else {
            $filePath = $news->image;
        }

        $data = [
            'title' => $request->title,
            'content' => $request->content,
            'subcategory_id' => $request->subcategory_id,
            'image' => $filePath,
            'status' => $request->status,
        ];

        // Update data news
        $news->update($data);

        return response()->json($news);
    }

    public function destroy($id)
    {
        // Cari news berdasarkan ID
        $news = $this->newsModel->find($id);

        // Jika tidak ditemukan, kembalikan error 404
        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        // Hapus data news
        $news->delete();

        return response()->json(['message' => 'News deleted successfully']);
    }

    public function getNewsBySubcategory($subcategoryId)
    {
        $news = $this->newsModel->where('subcategory_id', $subcategoryId)->get();
        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found for this subcategory'], 404);
        }
        return response()->json($news);
    }

    public function getNewsByCategory($categoryId)
    {
        $subCategories = $this->subCategoryModel->where('id_main_categories', $categoryId)->pluck('id');
        $news = $this->newsModel->whereIn('subcategory_id', $subCategories)->get();

        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found for this category'], 404);
        }
        return response()->json($news);
    }

    public function getNewsByAuthor($authorId)
    {
        $news = $this->newsModel->where('author', $authorId)->get();
        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found for this author'], 404);
        }
        return response()->json($news);
    }

    public function getNewsByStatus($status)
    {
        $news = $this->newsModel->where('status', $status)->get();
        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found with this status'], 404);
        }
        return response()->json($news);
    }

    public function getNewsByDate($date)
    {
        $news = $this->newsModel->whereDate('created_at', $date)->get();
        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found for this date'], 404);
        }
        return response()->json($news);
    }

    public function getNewsByViews($views)
    {
        $news = $this->newsModel->where('views_count', '>=', $views)->get();
        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found with this views count'], 404);
        }
        return response()->json($news);
    }

    public function getNewsByLikes($likes)
    {
        $news = $this->newsModel->where('likes_count', '>=', $likes)->get();
        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found with this likes count'], 404);
        }
        return response()->json($news);
    }

    public function getNewsByTitle($title)
    {
        $news = $this->newsModel->where('title', 'like', '%' . $title . '%')->get();
        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found with this title'], 404);
        }
        return response()->json($news);
    }
}