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
        Schema::create('cs_cell_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('row_id')->constrained('cs_rows');
            $table->foreignId('column_id')->constrained('cs_columns');
            $table->string('value_string')->nullable();
            $table->decimal('value_number', 15, 2)->nullable();
            $table->date('value_date')->nullable();
            $table->boolean('value_boolean')->nullable();
            $table->json('value_json')->nullable();
            $table->longText('value_text')->nullable();
            $table->timestamps();
            $table->unique(['row_id', 'column_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cs_cell_values');
    }
};
