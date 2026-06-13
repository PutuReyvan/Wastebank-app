<?php

namespace App\Filament\Resources\ExternalWastePriceResource\Pages;

use App\Filament\Resources\ExternalWastePriceResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditExternalWastePrice extends EditRecord
{
    protected static string $resource = ExternalWastePriceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()->label('Hapus'),
        ];
    }
}
