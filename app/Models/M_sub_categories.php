<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class M_sub_categories extends Model
{
    use HasFactory;

    protected $table = 'sub_categories';
    protected $primaryKey = 'id';
    public $timestamps = true;
    protected $fillable = [
        'id_main_categories',
        'name',
        'description',
    ];

    public function getRouteKeyName()
    {
        return 'name'; // sama
    }

    /**
     * Relasi ke model MainCategory.
     */
    public function mainCategory()
    {
        return $this->belongsTo(M_main_categories::class, 'id_main_categories');
    }

    /**
     * Relasi ke model News.
     */
    public function news()
    {
        return $this->hasMany(M_news::class, 'subcategory_id');
    }

    public function addSubCategory($data)
    {
        return $this->create($data);
    }

    public function findSubCategory($id, $id_main_categories)
    {
        return $this->where('id', $id)->where('id_main_categories', $id_main_categories)->first();
    }

    public function isUsedInNews($id)
    {
        return $this->news()->where('subcategory_id', $id)->exists();
    }

    public function isUsedInGallery($id)
    {
        return $this->galleries()->where('subcategory_id', $id)->exists();
    }
}
