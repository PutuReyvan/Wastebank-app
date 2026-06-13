<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class WasteType extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'is_eligible',
        'reference_price_per_kg',
        'reference_unit',
        'description',
        'icon_url',
        'external_id',
        'external_code',
        'source_name',
        'source_url',
        'source_updated_at',
    ];

    protected $casts = [
        'is_eligible' => 'boolean',
        'reference_price_per_kg' => 'decimal:2',
        'source_updated_at' => 'datetime',
    ];

    public function catalog(): HasMany
    {
        return $this->hasMany(WasteBankCatalog::class);
    }

    public function vendors(): BelongsToMany
    {
        return $this->belongsToMany(Vendor::class, 'vendor_waste_types');
    }

    public function guides(): HasMany
    {
        return $this->hasMany(RecyclingGuide::class);
    }
}
