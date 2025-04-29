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
    protected $fillable = [
        'id_main_categories',
        'name',
        'description',
    ];
    public $timestamps = false;

    /**
     * Relasi ke model MainCategory.
     */
    public function mainCategory()
    {
        return $this->belongsTo(M_main_categories::class, 'id_main_categories');
    }
}

