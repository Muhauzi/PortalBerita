<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class M_news_comments extends Model
{
    use HasFactory;

    protected $table = 'news_comments';

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // Karena hanya menggunakan created_at

    protected $fillable = [
        'id',
        'user_id',
        'news_id',
        'comment',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        // Generate UUID saat membuat komentar baru
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Relasi ke model User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke model News.
     */
    public function news(): BelongsTo
    {
        return $this->belongsTo(M_news::class, 'news_id');
    }
}
