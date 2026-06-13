<?php

namespace App\Filament\Resources\PriceSourceResource\Pages;

use App\Filament\Resources\PriceSourceResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPriceSource extends EditRecord
{
    protected static string $resource = PriceSourceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()->label('Hapus'),
        ];
    }
}
