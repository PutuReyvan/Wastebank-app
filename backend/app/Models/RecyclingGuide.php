<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecyclingGuide extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'excerpt', 'content', 'waste_type_id',
        'cover_image_url', 'published_at',
    ];

    protected $casts = ['published_at' => 'datetime'];

    public function wasteType(): BelongsTo
    {
        return $this->belongsTo(WasteType::class);
    }
}
