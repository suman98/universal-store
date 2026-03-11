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
        Schema::create('cs_columns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('display_name');
            $table->foreignId('table_id')->constrained('cs_tables');
            $table->enum('type', ['string', 'number', 'date', 'boolean', 'json', 'text']);
            $table->integer('position')->default(0);
            $table->timestamps();
            $table->unique(['name', 'table_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cs_columns');
    }
};
