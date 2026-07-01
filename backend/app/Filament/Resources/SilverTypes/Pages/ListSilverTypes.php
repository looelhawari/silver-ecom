<?php

namespace App\Filament\Resources\SilverTypes\Pages;

use App\Filament\Resources\SilverTypes\SilverTypeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSilverTypes extends ListRecords
{
    protected static string $resource = SilverTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
