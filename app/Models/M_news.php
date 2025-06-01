<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class M_news extends Model
{
    use HasFactory;

    // UUID sebagai primary key
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'news';

    protected $fillable = [
        'id',
        'author',
        'subcategory_id',
        'title',
        'content',
        'image',
        'status',
        'views_count',
        'likes_count',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'views_count' => 'integer',
        'likes_count' => 'integer',
    ];

    // Auto-generate UUID saat membuat model baru
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
     * Relasi ke model User (author).
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author');
    }

    /**
     * Relasi ke model SubCategory.
     */
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(M_sub_categories::class, 'subcategory_id', 'id');
    }

    /**
     * Mengambil semua berita.
     */

    public function getAllNews()
    {
        return $this->with([
            'subcategory:id,name',
            'author:id,name'
        ])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();
    }

    public function getNews($id)
    {
        return $this->with([
            'subcategory:id,name',
            'author:id,name'
        ])
            ->where('status', 'published')
            ->findOrFail($id);
    }

    public function getTopNews()
    {
        return $this->with([
            'subcategory:id,name',
            'author:id,name'
        ])
            ->where('status', 'published')
            ->orderBy('views_count', 'desc')
            ->take(6)
            ->get();
    }

    public function getRecentNews()
    {
        return $this->with([
            'subcategory:id,name',
            'author:id,name'
        ])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
    }

    public function getTrendingNews()
    {
        return $this->with([
            'subcategory:id,name',
            'author:id,name'
        ])
            ->where('status', 'published')
            ->orderBy('likes_count', 'desc')
            ->take(6)
            ->get();
    }

    public function getAlsoReadNews($id_subcategory, $news_id)
    {
        return $this->with([
            'subcategory:id,name',
            'author:id,name'
        ])
            ->where('status', 'published')
            ->where('subcategory_id', $id_subcategory)
            ->where('id', '!=', $news_id)
            ->inRandomOrder()
            ->take(4)
            ->get();
    }
}
