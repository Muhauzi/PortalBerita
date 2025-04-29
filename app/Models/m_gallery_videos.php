<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class M_gallery_videos extends Model
{
    use HasFactory;

    protected $table = 'gallery_videos';

    public $timestamps = false; // karena hanya ada 'created_at'

    protected $fillable = [
        'gallery_id',
        'video_url',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Relasi ke model Gallery.
     */
    public function gallery(): BelongsTo
    {
        return $this->belongsTo(M_galleries::class, 'gallery_id');
    }
}
