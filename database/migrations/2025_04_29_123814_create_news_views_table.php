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

        Schema::create('news_views', function (Blueprint $table) {
            $table->id();
            $table->uuid('news_id');
            $table->foreign('news_id')->references('id')->on('news');
            $table->uuid('id_users')->nullable();
            $table->foreign('id_users')->references('id')->on('users');
            $table->string('device_id');
            $table->timestamp('created_at');
            $table->index(['id_users', 'news_id']);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_views');
    }
};
