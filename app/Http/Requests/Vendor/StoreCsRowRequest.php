<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCsRowRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'values' => 'required|array',
            'values.*.value_string' => 'nullable|string',
            'values.*.value_number' => 'nullable|numeric',
            'values.*.value_date' => 'nullable|date',
            'values.*.value_boolean' => 'nullable|boolean',
            'values.*.value_json' => 'nullable|json',
            'values.*.value_text' => 'nullable|string',
        ];
    }
}
