<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\M_main_categories;
use App\Models\M_sub_categories;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    protected $mainCategoryModel;
    protected $subCategoryModel;

    public function __construct(M_main_categories $mainCategoryModel, M_sub_categories $subCategoryModel)
    {
        $this->mainCategoryModel = $mainCategoryModel;
        $this->subCategoryModel = $subCategoryModel;
    }

    public function index()
    {
        $mainCategories = $this->mainCategoryModel->get();
        return response()->json($mainCategories);
    }

    public function show($id)
    {
        $mainCategory = $this->mainCategoryModel->find($id);
        if (!$mainCategory) {
            return response()->json(['message' => 'Main category not found'], 404);
        }
        return response()->json($mainCategory);
    }

    public function create()
    {
        // Method ini tidak diperlukan untuk API
        return Inertia::render('categories/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $mainCategory = $this->mainCategoryModel->addMainCategory($request->all());
        if (!$mainCategory) {
            return response()->json(['message' => 'Failed to create main category'], 500);
        }
        return response()->json($mainCategory, 201);
    }

    public function update(Request $request, $id)
    {
        // Cari main category berdasarkan ID
        $mainCategory = $this->mainCategoryModel->find($id);

        // Jika tidak ditemukan, kembalikan error 404
        if (!$mainCategory) {
            return response()->json(['message' => 'Main category not found'], 404);
        }

        // Validasi data request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Perbarui main category menggunakan hanya data yang valid
        $mainCategory->update($validated);

        // Mengembalikan respons dengan status 200 dan data yang diperbarui
        return response()->json([
            'message' => 'Main category updated successfully',
            'data' => $mainCategory
        ]);
    }


    public function destroy($id)
    {
        $mainCategory = $this->mainCategoryModel->find($id);
        if (!$mainCategory) {
            return response()->json(['message' => 'Main category not found'], 404);
        }

        $mainCategory->delete();
        return response()->json(['message' => 'Main category deleted successfully']);
    }

    public function getSubcategories($id)
    {
        $subCategories = $this->subCategoryModel->where('id_main_categories', $id)->get();
        return response()->json($subCategories);
    }

    public function getSubcategory($id)
    {
        $subCategory = $this->subCategoryModel->find($id);
        if (!$subCategory) {
            return response()->json(['message' => 'Subcategory not found'], 404);
        }
        return response()->json($subCategory);
    }

    public function storeSubcategory(Request $request)
    {
        $request->validate([
            'id_main_categories' => 'required|exists:main_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $subCategory = $this->subCategoryModel->create($request->all());
        return response()->json($subCategory, 201);
    }

    public function updateSubcategory(Request $request, $id)
    {
        $subCategory = $this->subCategoryModel->find($id);
        if (!$subCategory) {
            return response()->json(['message' => 'Subcategory not found'], 404);
        }

        $request->validate([
            'id_main_categories' => 'required|exists:main_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $subCategory->update($request->all());
        return response()->json($subCategory);
    }

    public function destroySubcategory($id)
    {
        $subCategory = $this->subCategoryModel->find($id);
        if (!$subCategory) {
            return response()->json(['message' => 'Subcategory not found'], 404);
        }

        $subCategory->delete();
        return response()->json(['message' => 'Subcategory deleted successfully']);
    }
}
