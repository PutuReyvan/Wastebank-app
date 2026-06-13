<?php

namespace App\Filament\Resources\PriceSourceResource\Pages;

use App\Filament\Resources\PriceSourceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPriceSources extends ListRecords
{
    protected static string $resource = PriceSourceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Tambah Sumber'),
        ];
    }
}
