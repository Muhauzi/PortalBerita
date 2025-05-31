<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use function Pest\Laravel\get;

class M_main_categories extends Model
{
    use HasFactory;

    protected $table = 'main_categories';

    protected $fillable = [
        'name',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke model SubCategory.
     */
    public function subCategories()
    {
        return $this->hasMany(M_sub_categories::class, 'id_main_categories');
    }
    /**
     * Relasi ke model Gallery.
     */
    public function galleries()
    {
        return $this->hasMany(M_galleries::class, 'subcategory_id');
    }

    /**
     * Mengambil semua Main Category.
     */
    public function getAllMainCategories()
    {
        return $this->with('subCategories')->get();
    }

    /**
     * Menambahkan Main Category baru.
     */
    public function addMainCategory($data)
    {
        return $this->create($data);
    }

    /**
     * Memeriksa Apakah Main Category Digunakan Atau Tidak untuk Dihapus.
     */
    public function isUsed($id)
    {
        $isUsed = $this->subCategories()->where('id_main_categories', $id)->exists();
        return $isUsed;
        
    }




}
