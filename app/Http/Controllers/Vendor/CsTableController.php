<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreCsTableRequest;
use App\Http\Requests\Vendor\UpdateCsTableRequest;
use App\Models\CsColumn;
use App\Models\CsTable;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CsTableController extends Controller
{
    public function index()
    {
        $org = auth()->user()->organizations()->first();

        $tables = $org ? CsTable::where('org_id', $org->id)->with('organization')->get() : [];

        return Inertia::render('vendor/Tables/Index', [
            'tables' => $tables,
        ]);
    }

    public function create()
    {
        return Inertia::render('vendor/Tables/Create');
    }

    public function store(StoreCsTableRequest $request)
    {
        try {
            $org = auth()->user()->organizations()->first();

            if (! $org) {
                return back()->withErrors(['organization' => 'No organization found']);
            }

            $table = CsTable::create([
                'name' => $request->name,
                'display_name' => $request->display_name,
                'description' => $request->description,
                'org_id' => $org->id,
            ]);

            // Create columns
            if ($request->has('fields')) {
                foreach ($request->fields as $position => $field) {
                    CsColumn::create([
                        'name' => $field['name'],
                        'display_name' => $field['display_name'],
                        'table_id' => $table->id,
                        'type' => $field['type'],
                        'position' => $position,
                    ]);
                }
            }

            return redirect()->route('vendor.tables.show', $table)->with('success', 'Table created successfully');
        } catch (\Exception $e) {
            Log::error('Error creating table: '.$e->getMessage());

            return back()->with('error', 'Error creating table: '.$e->getMessage());
        }
    }

    public function show(CsTable $table)
    {
        $table->load('columns', 'rows.values');

        return Inertia::render('vendor/Tables/Show', [
            'table' => $table,
            'columns' => $table->columns,
            'rows' => $table->rows()->with('values')->get(),
        ]);
    }

    public function edit(CsTable $table)
    {
        return Inertia::render('vendor/Tables/Edit', [
            'table' => $table->load('columns'),
        ]);
    }

    public function update(UpdateCsTableRequest $request, CsTable $table)
    {
        try {
            $table->update([
                'display_name' => $request->display_name,
                'description' => $request->description,
            ]);

            return redirect()->route('vendor.tables.show', $table)->with('success', 'Table updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating table: '.$e->getMessage());

            return back()->with('error', 'Error updating table: '.$e->getMessage());
        }
    }

    public function destroy(CsTable $table)
    {
        try {
            $table->delete();

            return redirect()->route('vendor.tables.index')->with('success', 'Table deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting table: '.$e->getMessage());

            return back()->with('error', 'Error deleting table: '.$e->getMessage());
        }
    }
}
