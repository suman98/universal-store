<?php

namespace Database\Factories;

use App\Models\CsRow;
use App\Models\CsTable;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CsRow>
 */
class CsRowFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'table_id' => CsTable::factory(),
            'created_by' => User::factory(),
        ];
    }
}
