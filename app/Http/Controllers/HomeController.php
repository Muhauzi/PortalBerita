<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Response;


use App\Models\M_news;
use App\Models\M_main_categories;
use App\Models\M_sub_categories;
use App\Models\M_galleries;
use App\Models\M_gallery_photos;
use App\Models\M_gallery_videos;
use App\Models\M_news_comments;
use Inertia\Inertia;
use \Illuminate\Support\Facades\Auth;


class HomeController extends Controller
{
    protected $subCategoryModel, $mainCategoryModel, $newsModel, $galleryModel, $galleryPhotoModel, $galleryVideoModel;

    public function __construct(M_sub_categories $subCategoryModel, M_main_categories $mainCategoryModel, M_news $newsModel, M_galleries $galleryModel, M_gallery_photos $galleryPhotoModel, M_gallery_videos $galleryVideoModel)
    {
        $this->subCategoryModel = $subCategoryModel;
        $this->mainCategoryModel = $mainCategoryModel;
        $this->newsModel = $newsModel;
        $this->galleryModel = $galleryModel;
        $this->galleryPhotoModel = $galleryPhotoModel;
        $this->galleryVideoModel = $galleryVideoModel;
    }

    public function index(Request $request)
    {
        // Paginate news, karena frontend mengharapkan pagination
        $topNews = $this->newsModel->getTopNews();
        $recentNews = $this->newsModel->getRecentNews();
        $trendingNews = $this->newsModel->getTrendingNews();

        // dd($topNews, $recentNews, $trendingNews);

        $mainCategories = $this->mainCategoryModel->select('id', 'name')
            ->orderBy('created_at', 'desc')
            ->get();

        $subCategories = $this->subCategoryModel->select('id', 'name', 'id_main_categories')
            ->orderBy('created_at', 'desc')
            ->get();

        $videos = $this->galleryModel->getVideosGalleries();
        // dd($videos);

        // dd($mainCategories, $subCategories);



        return Inertia::render('Home/Index', [
            'topNews' => $topNews,
            'recentNews' => $recentNews,
            'trendingNews' => $trendingNews,
            'mainCategories' => $mainCategories,
            'subCategories' => $subCategories,
            'videoGalleries' => $videos,
        ])->with([
            'flash' => [
                'message' => session('message'),
                'type' => session('type'),
            ],
        ]);
    }

    public function news($slug)
    {
        $news = $this->newsModel->getNews($slug);
        // dd($news);
        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }


        $recentNews = $this->newsModel->getRecentNews();
        $alsoRead = $this->newsModel->getAlsoReadNews($news->subcategory_id, $slug);
        // dd($alsoRead);

        $mainCategories = $this->mainCategoryModel->select('id', 'name')
            ->orderBy('created_at', 'desc')
            ->get();

        $subCategories = $this->subCategoryModel->select('id', 'name', 'id_main_categories')
            ->orderBy('created_at', 'desc')
            ->get();

        $comments = M_news_comments::where('news_id', $news->id)
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $statusLogin = Auth::check();

        return Inertia::render('Home/Show', [
            'mainArticle' => $news,
            'recentNews' => $recentNews,
            'alsoRead' => $alsoRead,
            'mainCategories' => $mainCategories,
            'subCategories' => $subCategories,
            'statusLogin' => $statusLogin,
            'comments' => $comments,
        ])->with([
            'flash' => [
                'message' => session('message'),
                'type' => session('type'),
            ],
        ]);
    }

    public function newsByCategory(M_main_categories $M_main_categories)
    {
        // dd($M_main_categories);
        // Data category sudah otomatis ter-bind, jadi ga perlu query slug manual
        $news = $this->newsModel->getNewsByMainCategory($M_main_categories->id);

        if ($news->isEmpty()) {
            return response()->json(['message' => 'No news found for this category'], 404);
        }

        $mainCategories = $this->mainCategoryModel->select('id', 'name')->orderBy('created_at', 'desc')->get();
        $subCategories = $this->subCategoryModel->select('id', 'name', 'id_main_categories')->orderBy('created_at', 'desc')->get();
        $recentNews = $this->newsModel->getRecentNews();

        return Inertia::render('Home/NewsByCategory', [
            'catName' => $M_main_categories->name,
            'news' => $news,
            'mainCategories' => $mainCategories,
            'subCategories' => $subCategories,
            'recentNews' => $recentNews,
        ]);
    }

    public function newsBySubCategory(M_main_categories $M_main_categories, M_sub_categories $M_sub_categories)
    {
        // Pastikan subcategory belong to main category kalau mau validasi strict
        if ($M_sub_categories->id_main_categories !== $M_main_categories->id) {
            abort(404, 'Subcategory does not belong to this main category');
        }

        $news = $this->newsModel->getNewsBySubCategory($M_sub_categories->id);

        if ($news->isEmpty()) {
            abort(404, 'No news found for this subcategory');
        }

        $mainCategories = $this->mainCategoryModel->select('id', 'name')->orderBy('created_at', 'desc')->get();
        $subCategories = $this->subCategoryModel->select('id', 'name', 'id_main_categories')->orderBy('created_at', 'desc')->get();
        $recentNews = $this->newsModel->getRecentNews();

        return Inertia::render('Home/SubCategoryNewsPage', [
            'news' => $news,
            'mainCategories' => $mainCategories,
            'subCategories' => $subCategories,
            'mainCategoryName' => $M_main_categories->name,
            'subCategoryName' => $M_sub_categories->name,
            'recentNews' => $recentNews,
        ]);
    }


    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    public function storeComment(Request $request)
    {
        $validated = $request->validate([
            'news_id' => 'required|exists:news,id',
            'comment' => 'required|string|max:1000',
        ]);

        $comment = new M_news_comments();
        $comment->news_id = $validated['news_id'];
        $comment->user_id = Auth::id();
        $comment->comment = $validated['comment'];
        $comment->save();

        return redirect()->back()->with('message', 'Komentar berhasil ditambahkan!');
    }

    public function deleteComment($id)
    {
        $comment = M_news_comments::find($id);

        if (!$comment) {
            return redirect()->back()->with('message', 'Komentar tidak ditemukan!');
        }

        if ($comment->user_id !== Auth::id()) {
            return redirect()->back()->with('message', 'Anda tidak memiliki izin untuk menghapus komentar ini!');
        }

        $comment->delete();

        return redirect()->back()->with('message', 'Komentar berhasil dihapus!');
    }

    public function test()
    {
        $mainCategories = $this->mainCategoryModel->select('id', 'name')
            ->orderBy('created_at', 'desc')
            ->get();

        $subCategories = $this->subCategoryModel->select('id', 'name', 'id_main_categories')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Home/Show', [
            'mainCategories' => $mainCategories,
            'subCategories' => $subCategories,
        ]);
    }
}
