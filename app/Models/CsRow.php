<?php

namespace App\Models;

use Database\Factories\CsRowFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CsRow extends Model
{
    /** @use HasFactory<CsRowFactory> */
    use HasFactory;

    protected $table = 'cs_rows';

    protected $fillable = [
        'table_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(CsTable::class, 'table_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function values(): HasMany
    {
        return $this->hasMany(CsCellValue::class, 'row_id');
    }
}
