<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
    ];

    protected $casts = [
        'is_eligible' => 'boolean',
        'reference_price_per_kg' => 'decimal:2',
    ];
}
