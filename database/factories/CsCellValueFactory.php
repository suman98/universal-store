<?php

namespace Database\Factories;

use App\Models\CsCellValue;
use App\Models\CsColumn;
use App\Models\CsRow;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CsCellValue>
 */
class CsCellValueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'row_id' => CsRow::factory(),
            'column_id' => CsColumn::factory(),
            'value_string' => fake()->word(),
        ];
    }
}
