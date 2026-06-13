<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WasteBank extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'external_id', 'source_name', 'source_url', 'location_verified_at',
        'name', 'address', 'kelurahan', 'kecamatan', 'kota',
        'lat', 'lng', 'phone', 'whatsapp', 'operating_hours',
        'photo_url', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'lat' => 'float',
        'lng' => 'float',
        'location_verified_at' => 'datetime',
    ];

    public function catalog(): HasMany
    {
        return $this->hasMany(WasteBankCatalog::class);
    }

    public function user(): HasOne
    {
        return $this->hasOne(WasteBankUser::class);
    }
}
