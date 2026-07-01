<?php

namespace App\Filament\Resources\CustomOrderRequests\Pages;

use App\Filament\Resources\CustomOrderRequests\CustomOrderRequestResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCustomOrderRequest extends EditRecord
{
    protected static string $resource = CustomOrderRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
