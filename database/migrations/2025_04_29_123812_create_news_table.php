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

        Schema::create('news', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('author');
            $table->foreign('author')->references('id')->on('users');
            $table->foreignId('subcategory_id')->nullable()->constrained('sub_categories');
            $table->string('title');
            $table->text('content');
            $table->text('image');
            $table->enum('status', ["draft", "published", "archived"]);
            $table->bigInteger('views_count')->default(0);
            $table->bigInteger('likes_count')->default(0);
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->index(['subcategory_id', 'author']);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
