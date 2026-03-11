<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\CsCellValue;
use App\Models\CsRow;
use Illuminate\Http\Request;

class CsCellValueController extends Controller
{
    public function update(Request $request, CsRow $row, CsCellValue $cellValue)
    {
        $request->validate([
            'value_string' => 'nullable|string',
            'value_number' => 'nullable|numeric',
            'value_date' => 'nullable|date',
            'value_boolean' => 'nullable|boolean',
            'value_json' => 'nullable|json',
            'value_text' => 'nullable|string',
        ]);

        $cellValue->update($request->only([
            'value_string',
            'value_number',
            'value_date',
            'value_boolean',
            'value_json',
            'value_text',
        ]));

        return response()->json(['message' => 'Cell updated successfully']);
    }
}
