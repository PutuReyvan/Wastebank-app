<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class WasteBankUser extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'waste_bank_users';

    protected $fillable = ['waste_bank_id', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];
    protected function casts(): array
    {
        return ['password' => 'hashed'];
    }

    public function wasteBank(): BelongsTo
    {
        return $this->belongsTo(WasteBank::class);
    }
}
