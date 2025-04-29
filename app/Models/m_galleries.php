<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class M_galleries extends Model
{
    use HasFactory;

    protected $table = 'galleries';

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // created_at dan update_at ditangani manual

    protected $fillable = [
        'id',
        'author_id',
        'type',
        'title',
        'description',
        'subcategory_id',
        'created_at',
        'update_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'update_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Relasi ke User sebagai author.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Relasi ke SubCategory.
     */
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(M_sub_categories::class, 'subcategory_id');
    }
}
