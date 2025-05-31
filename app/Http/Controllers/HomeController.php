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
        $news = $this->newsModel->with(['subcategory', 'author'])
            ->orderBy('created_at', 'desc')
            ->paginate(10); // atau jumlah item per halaman sesuai kebutuhan

        $mainCategories = $this->mainCategoryModel->select('id', 'name')
            ->orderBy('created_at', 'desc')
            ->get();

        $subCategories = $this->subCategoryModel->select('id', 'name', 'id_main_categories')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Home/Index', [
            'newsData' => $news, // Sesuai dengan views
            'mainCategories' => $mainCategories,
            'subCategories' => $subCategories,
        ])->with([
            'flash' => [
                'message' => session('message'),
                'type' => session('type'),
            ],
        ]);
    }
}
