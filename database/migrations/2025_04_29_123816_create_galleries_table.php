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

        Schema::create('galleries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('author_id');
            $table->foreign('author_id')->references('id')->on('users');
            $table->enum('type', [""]);
            $table->string('title');
            $table->text('description');
            $table->foreignId('subcategory_id')->constrained('sub_categories', 'id');
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->index(['subcategory_id', 'author_id']);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galleries');
    }
};
