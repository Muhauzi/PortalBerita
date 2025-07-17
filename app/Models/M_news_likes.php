<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class M_news_likes extends Model
{
    use HasFactory;

    protected $table = 'news_likes';

    public $timestamps = false; // karena hanya ada 'created_at', bukan 'updated_at'

    protected $fillable = [
        'news_id',
        'client_id',
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
     * Relasi ke model User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_users');
    }
}

