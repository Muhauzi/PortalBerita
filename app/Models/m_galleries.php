<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class M_galleries extends Model
{
    use HasFactory;

    protected $table = 'galleries';

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = true; // created_at dan update_at ditangani manual

    protected $fillable = [
        'id',
        'author_id',
        'type',
        'title',
        'description',
        'subcategory_id',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    /**
     * Relasi ke SubCategory.
     */
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(M_sub_categories::class, 'subcategory_id', 'id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(M_gallery_photos::class, 'gallery_id', 'id');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(M_gallery_videos::class, 'gallery_id', 'id');
    }


    /**
     * Mengambil semua galeri.
     */
    public function getVideosGalleries()
    {
        return $this->with('videos', 'author:id,name', 'subcategory:id,name')
            ->where('type', 'video')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
