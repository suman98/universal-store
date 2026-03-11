<?php

use App\Models\CsColumn;
use App\Models\CsRow;
use App\Models\CsTable;
use App\Models\Organization;
use App\Models\User;

test('user can see tables list', function () {
    $user = User::factory()->create();
    $org = Organization::factory()->create(['owner_id' => $user->id]);
    $table = CsTable::factory()->create(['org_id' => $org->id]);

    $response = $this->actingAs($user)->get(route('vendor.tables.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Vendor/Tables/Index')
        ->has('tables')
    );
});

test('user can create a new table with fields', function () {
    $user = User::factory()->create();
    $org = Organization::factory()->create(['owner_id' => $user->id]);

    $response = $this->actingAs($user)->post(route('vendor.tables.store'), [
        'name' => 'products',
        'display_name' => 'Products',
        'description' => 'Product table',
        'fields' => [
            ['name' => 'name', 'display_name' => 'Product Name', 'type' => 'string'],
            ['name' => 'price', 'display_name' => 'Price', 'type' => 'number'],
        ],
    ]);

    expect(CsTable::where('name', 'products')->exists())->toBeTrue();
    expect(CsTable::where('name', 'products')->first()->columns->count())->toBe(2);
});

test('user can view a table with its data', function () {
    $user = User::factory()->create();
    $org = Organization::factory()->create(['owner_id' => $user->id]);
    $table = CsTable::factory()->create(['org_id' => $org->id]);
    $column = CsColumn::factory()->create(['table_id' => $table->id, 'type' => 'string']);
    $row = CsRow::factory()->create(['table_id' => $table->id, 'created_by' => $user->id]);

    $response = $this->actingAs($user)->get(route('vendor.tables.show', $table->id));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Vendor/Tables/Show')
        ->has('table')
        ->has('columns')
        ->has('rows')
    );
});

test('user can add a new row to a table', function () {
    $user = User::factory()->create();
    $org = Organization::factory()->create(['owner_id' => $user->id]);
    $table = CsTable::factory()->create(['org_id' => $org->id]);
    $column = CsColumn::factory()->create(['table_id' => $table->id, 'type' => 'string']);

    $response = $this->actingAs($user)->post(route('vendor.rows.store', $table->id), [
        'values' => [
            $column->id => ['value_string' => 'Test Value'],
        ],
    ]);

    expect(CsRow::where('table_id', $table->id)->count())->toBe(1);
});

test('user can update table details', function () {
    $user = User::factory()->create();
    $org = Organization::factory()->create(['owner_id' => $user->id]);
    $table = CsTable::factory()->create(['org_id' => $org->id]);

    $response = $this->actingAs($user)->put(route('vendor.tables.update', $table->id), [
        'display_name' => 'Updated Table Name',
        'description' => 'Updated description',
    ]);

    expect($table->fresh()->display_name)->toBe('Updated Table Name');
});

test('user can delete a table', function () {
    $user = User::factory()->create();
    $org = Organization::factory()->create(['owner_id' => $user->id]);
    $table = CsTable::factory()->create(['org_id' => $org->id]);

    $this->actingAs($user)->delete(route('vendor.tables.destroy', $table->id));

    expect(CsTable::find($table->id))->toBeNull();
});

