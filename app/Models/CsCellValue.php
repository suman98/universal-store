<?php

namespace App\Models;

use Database\Factories\CsCellValueFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CsCellValue extends Model
{
    /** @use HasFactory<CsCellValueFactory> */
    use HasFactory;

    protected $table = 'cs_cell_values';

    protected $fillable = [
        'row_id',
        'column_id',
        'value_string',
        'value_number',
        'value_date',
        'value_boolean',
        'value_json',
        'value_text',
    ];

    protected function casts(): array
    {
        return [
            'value_number' => 'decimal:2',
            'value_date' => 'date',
            'value_boolean' => 'boolean',
            'value_json' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function row(): BelongsTo
    {
        return $this->belongsTo(CsRow::class, 'row_id');
    }

    public function column(): BelongsTo
    {
        return $this->belongsTo(CsColumn::class, 'column_id');
    }
}
