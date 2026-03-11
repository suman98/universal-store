<?php

namespace Database\Factories;

use App\Models\CsTable;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CsTable>
 */
class CsTableFactory extends Factory
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
            'description' => fake()->sentence(),
            'org_id' => Organization::factory(),
        ];
    }
}
