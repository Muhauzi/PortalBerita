<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\M_main_categories;
use App\Models\M_sub_categories;
use Inertia\Inertia;

use function Pest\Laravel\json;

class CategoriesController extends Controller
{
    protected $mainCategoryModel;
    protected $subCategoryModel;

    public function __construct()
    {
        $this->mainCategoryModel = new M_main_categories();
        $this->subCategoryModel = new M_sub_categories();
    }


    public function index(Request $request)
    {
        $query = $this->mainCategoryModel->newQuery();

        
        // Optional search
        if ($request->has('search') && $request->search !== null) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->input('perPage', 10); // Default to 10

        $mainCategories = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString(); // Preserves search & perPage in pagination links

        return Inertia::render('mcategory/Index', [
            'mainCategories' => $mainCategories,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    public function show($id)
    {
        $mainCategory = $this->mainCategoryModel->findOrFail($id);
        // Jika tidak ditemukan, kembalikan error 404
        if (!$mainCategory) {
            return response()->json(['message' => 'Main category not found'], 404);
        }

        return Inertia::render('mcategory/Show', [
            'mainCategory' => $mainCategory,
        ]);
    }

    public function create()
    {
        return Inertia::render('mcategory/Add');
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
        return redirect()->route('main.index')->with('success', 'Category created successfully.');
    }

    public function edit($id)
    {
        // Method ini tidak diperlukan untuk API
        $mainCategory = $this->mainCategoryModel->findOrFail($id);
        return Inertia::render('mcategory/Edit', [
            'mainCategory' => $mainCategory,
        ]);
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
        return redirect()->route('main.index')->with('success', 'Category created successfully.');
    }


    public function destroy($id)
    {
        $mainCategory = $this->mainCategoryModel->find($id);
        if (!$mainCategory) {
            return response()->json(['message' => 'Main category not found'], 404);
        }

        // Hapus subcategories terkait
        $subCategories = $this->subCategoryModel->where('id_main_categories', $id)->get();
        foreach ($subCategories as $subCategory) {
            $subCategory->delete();
        }

        $mainCategory->delete();

        return redirect()->route('main.index')->with('success', 'Category deleted successfully.');
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

    // sub category

    function indexSubCategory()
    {
        $mainCategories = $this->mainCategoryModel->getAllMainCategories();
        // dd($mainCategories, $subCategories);
        
        return Inertia::render('subcategory/ListMainCat', [
            'mainCategories' => $mainCategories
        ]);
    }

    function indexSub(Request $request, $category_id)
    {
        $query = $this->subCategoryModel->newQuery();

        // Optional search
        if ($request->has('search') && $request->search !== null) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->input('perPage', 10); // Default to 10

        $subCategories = $query->where('id_main_categories', $category_id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString(); // Preserves search & perPage in pagination links
        $mainCategoryId = $category_id;

        return Inertia::render('subcategory/Index', [
            'subCategories' => $subCategories,
            'filters' => $request->only('search', 'perPage'),
            'idMainCategory' => $mainCategoryId,
        ]);
    }

    public function showSub($category_id, $id)
    {
        $subCategory = $this->subCategoryModel->where('id_main_categories', $category_id)->findOrFail($id);
        $MainCategory = $this->mainCategoryModel->findOrFail($category_id);
        // Jika tidak ditemukan, kembalikan error 404
        if (!$subCategory) {
            return response()->json(['message' => 'Subcategory not found'], 404);
        }

        return Inertia::render('subcategory/Show', [
            'subCategory' => $subCategory,
            'mainCategory' => $MainCategory,
        ]);
    }

    public function createSub($category_id)
    {
        $mainCategory = $this->mainCategoryModel->findOrFail($category_id);
        $idMainCategory = $category_id;
        // dd($mainCategory);
        return Inertia::render('subcategory/Add', [
            'mainCategory' => $mainCategory,
            'idMainCategory' => $idMainCategory,
        ]);
    }

    public function storeSub(Request $request)
    {
        $request->validate([
            'idMainCategory' => 'required|exists:main_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category_id = $request->input('idMainCategory');

        $data = [
            'id_main_categories' => $category_id,
            'name' => $request->input('name'),
            'description' => $request->input('description'),
        ];

        $subCategory = $this->subCategoryModel->addSubCategory($data);
        if (!$subCategory) {
            return response()->json(['message' => 'Failed to create sub category'], 500);
        }
        return redirect()->route('sub.index', ['category_id' => $category_id])->with('success', 'Sub Category created successfully.');
    }

    public function editSub($category_id, $id)
    {
        // Method ini tidak diperlukan untuk API
        $subCategory = $this->subCategoryModel->where('id_main_categories', $category_id)->findOrFail($id);
        // Jika tidak ditemukan, kembalikan error 404
        if (!$subCategory) {
            return response()->json(['message' => 'Subcategory not found'], 404);
        }
        $mainCategory = $this->mainCategoryModel->findOrFail($category_id);
        $idSubCategory = $id;
        $idMainCategory = $category_id;
        return Inertia::render('subcategory/Edit', [
            'initialData' => $subCategory,
            'mainCategory' => $mainCategory,
            'idSubCategory' => $idSubCategory,
            'idMainCategory' => $idMainCategory,
        ]);
    }
    public function updateSub(Request $request, $category_id, $id)
    {
        // Cari sub category berdasarkan ID
        $subCategory = $this->subCategoryModel->findSubCategory($id, $category_id);

        // Jika tidak ditemukan, kembalikan error 404
        if (!$subCategory) {
            return response()->json(['message' => 'Sub category not found'], 404);
        }

        // Validasi data request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Perbarui sub category menggunakan hanya data yang valid
        $subCategory->update($validated);

        // Mengembalikan respons dengan status 200 dan data yang diperbarui
        return redirect()->route('sub.index', ['category_id' => $category_id])->with('success', 'Sub Category updated successfully.');
    }
    public function destroySub($category_id, $id)
    {
        $subCategory = $this->subCategoryModel->where('id_main_categories', $category_id)->find($id);
        if (!$subCategory) {
            return response()->json(['message' => 'Sub category not found'], 404);
        }

        $subCategory->delete();

        return redirect()->route('sub.index', ['category_id' => $category_id])->with('success', 'Sub Category deleted successfully.');
    }
    public function getSubcategoriesByMainCategory($category_id)
    {
        $subCategories = $this->subCategoryModel->where('id_main_categories', $category_id)->get();
        return response()->json($subCategories);
    }
    public function getSubcategoryByMainCategory($category_id, $id)
    {
        $subCategory = $this->subCategoryModel->where('id_main_categories', $category_id)->find($id);
        if (!$subCategory) {
            return response()->json(['message' => 'Subcategory not found'], 404);
        }
        return response()->json($subCategory);
    }

}
