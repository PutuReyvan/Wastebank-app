<?php

namespace App\Filament\Resources\WasteBankResource\Pages;

use App\Filament\Resources\WasteBankResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWasteBank extends EditRecord
{
    protected static string $resource = WasteBankResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
