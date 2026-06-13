<?php

namespace App\Filament\Resources\ExternalWastePriceResource\Pages;

use App\Filament\Resources\ExternalWastePriceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListExternalWastePrices extends ListRecords
{
    protected static string $resource = ExternalWastePriceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Tambah Item'),
        ];
    }
}
