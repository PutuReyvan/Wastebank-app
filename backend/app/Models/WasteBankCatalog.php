<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteBankCatalog extends Model
{
    protected $table = 'waste_bank_catalog';

    protected $fillable = [
        'waste_bank_id',
        'waste_type_id',
        'price_per_kg',
    ];

    protected $casts = [
        'price_per_kg' => 'decimal:2',
    ];

    public function wasteBank(): BelongsTo
    {
        return $this->belongsTo(WasteBank::class);
    }

    public function wasteType(): BelongsTo
    {
        return $this->belongsTo(WasteType::class);
    }
}
