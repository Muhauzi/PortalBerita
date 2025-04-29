<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     */
    protected $except = [
        'api/*', // Tambahkan ini untuk abaikan CSRF semua rute API
    ];
}
// Jika Anda ingin mengecualikan rute tertentu, Anda dapat menambahkannya di sini