<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreCsRowRequest;
use App\Models\CsCellValue;
use App\Models\CsRow;
use App\Models\CsTable;

class CsRowController extends Controller
{
    public function store(StoreCsRowRequest $request, CsTable $table)
    {
        $row = CsRow::create([
            'table_id' => $table->id,
            'created_by' => auth()->id(),
        ]);

        // Create cell values
        if ($request->has('values')) {
            foreach ($request->values as $columnId => $value) {
                CsCellValue::create([
                    'row_id' => $row->id,
                    'column_id' => $columnId,
                    'value_string' => $value['value_string'] ?? null,
                    'value_number' => $value['value_number'] ?? null,
                    'value_date' => $value['value_date'] ?? null,
                    'value_boolean' => $value['value_boolean'] ?? null,
                    'value_json' => $value['value_json'] ?? null,
                    'value_text' => $value['value_text'] ?? null,
                ]);
            }
        }

        return redirect()->route('vendor.tables.show', $table)->with('message', 'Row created successfully');
    }

    public function update(StoreCsRowRequest $request, CsTable $table, CsRow $row)
    {
        
        // Update cell values
        if ($request->has('values')) {
            foreach ($request->values as $columnId => $value) {
                CsCellValue::updateOrCreate(
                    ['row_id' => $row->id, 'column_id' => $columnId],
                    [
                        'value_string' => $value['value_string'] ?? null,
                        'value_number' => $value['value_number'] ?? null,
                        'value_date' => $value['value_date'] ?? null,
                        'value_boolean' => $value['value_boolean'] ?? null,
                        'value_json' => $value['value_json'] ?? null,
                        'value_text' => $value['value_text'] ?? null,
                    ]
                );
            }
        }

        return redirect()->route('vendor.tables.show', $table)->with('message', 'Row updated successfully');
    }

    public function destroy(CsTable $table, CsRow $row)
    {
        $row->delete();

        return redirect()->route('vendor.tables.show', $table)->with('message', 'Row deleted successfully');
    }
}
