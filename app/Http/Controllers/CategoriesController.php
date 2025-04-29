<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\M_main_categories;
use App\Models\M_sub_categories;

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
        $mainCategories = $this->mainCategoryModel->with('subcategories')->get();
        return response()->json($mainCategories);
    }

    public function show($id)
    {
        $mainCategory = $this->mainCategoryModel->with('subcategories')->find($id);
        if (!$mainCategory) {
            return response()->json(['message' => 'Main category not found'], 404);
        }
        return response()->json($mainCategory);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $mainCategory = $this->mainCategoryModel->create($request->all());
        return response()->json($mainCategory, 201);
    }

    public function update(Request $request, $id)
    {
        $mainCategory = $this->mainCategoryModel->find($id);
        if (!$mainCategory) {
            return response()->json(['message' => 'Main category not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $mainCategory->update($request->all());
        return response()->json($mainCategory);
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
