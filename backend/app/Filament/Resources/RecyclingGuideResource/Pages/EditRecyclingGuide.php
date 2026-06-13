<?php

namespace App\Filament\Resources\RecyclingGuideResource\Pages;

use App\Filament\Resources\RecyclingGuideResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditRecyclingGuide extends EditRecord
{
    protected static string $resource = RecyclingGuideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
