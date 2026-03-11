<?php

namespace App\Models;

use Database\Factories\CsColumnFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CsColumn extends Model
{
    /** @use HasFactory<CsColumnFactory> */
    use HasFactory;

    protected $table = 'cs_columns';

    protected $fillable = [
        'name',
        'display_name',
        'table_id',
        'type',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
        ];
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(CsTable::class, 'table_id');
    }

    public function values(): HasMany
    {
        return $this->hasMany(CsCellValue::class, 'column_id');
    }
}
