<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use App\Models\M_news;
use App\Models\M_main_categories;
use App\Models\M_sub_categories;
use App\Models\M_galleries;
use App\Models\M_gallery_photos;
use App\Models\M_gallery_videos;

use Inertia\Inertia;

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

    public function news($id)
    {
        // $news = $this->newsModel->find($id);
        // dd($news);
        // if (!$news) {
        //     return response()->json(['message' => 'News not found'], 404);
        // }
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
