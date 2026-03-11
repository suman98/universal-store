<?php

namespace App\Models;

use Database\Factories\CsTableFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CsTable extends Model
{
    /** @use HasFactory<CsTableFactory> */
    use HasFactory;

    protected $table = 'cs_tables';

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'org_id',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'org_id');
    }

    public function columns(): HasMany
    {
        return $this->hasMany(CsColumn::class, 'table_id')->orderBy('position');
    }

    public function rows(): HasMany
    {
        return $this->hasMany(CsRow::class, 'table_id');
    }
}
