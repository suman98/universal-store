<?php

namespace Database\Factories;

use App\Models\CsColumn;
use App\Models\CsTable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CsColumn>
 */
class CsColumnFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'display_name' => fake()->words(2, true),
            'table_id' => CsTable::factory(),
            'type' => fake()->randomElement(['string', 'number', 'date', 'boolean', 'json', 'text']),
            'position' => 0,
        ];
    }
}
