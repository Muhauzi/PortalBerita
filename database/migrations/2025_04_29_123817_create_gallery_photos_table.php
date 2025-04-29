<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('gallery_photos', function (Blueprint $table) {
            $table->id();
            $table->uuid('gallery_id');
            $table->foreign('gallery_id')->references('id')->on('galleries');
            $table->string('photo_path');
            $table->timestamp('created_at');
            $table->index('gallery_id');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_photos');
    }
};
