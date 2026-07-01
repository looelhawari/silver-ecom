<?php

namespace App\Filament\Resources\CustomOrderRequests\Pages;

use App\Filament\Resources\CustomOrderRequests\CustomOrderRequestResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCustomOrderRequests extends ListRecords
{
    protected static string $resource = CustomOrderRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
