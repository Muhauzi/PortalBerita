<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'update_at' => 'datetime',
    ];

    // Jika ingin relasi ke subcategories bisa ditambahkan
    public function subcategories()
    {
        return $this->hasMany(M_sub_categories::class);
    }
}
