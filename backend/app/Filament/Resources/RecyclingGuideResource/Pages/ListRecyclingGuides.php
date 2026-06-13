<?php

namespace App\Filament\Resources\RecyclingGuideResource\Pages;

use App\Filament\Resources\RecyclingGuideResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListRecyclingGuides extends ListRecords
{
    protected static string $resource = RecyclingGuideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
