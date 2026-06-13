<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Vendor extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'type', 'service_area', 'phone', 'whatsapp',
        'description', 'photo_url', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function wasteTypes(): BelongsToMany
    {
        return $this->belongsToMany(WasteType::class, 'vendor_waste_types');
    }
}
