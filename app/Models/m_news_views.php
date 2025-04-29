<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class M_news_views extends Model
{
    use HasFactory;

    protected $table = 'news_views';

    public $timestamps = false; // Karena hanya ada 'created_at'

    protected $fillable = [
        'news_id',
        'id_users',
        'device_id',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Relasi ke model News.
     */
    public function news(): BelongsTo
    {
        return $this->belongsTo(M_news::class, 'news_id');
    }

    /**
     * Relasi ke model User (nullable).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_users');
    }
}
