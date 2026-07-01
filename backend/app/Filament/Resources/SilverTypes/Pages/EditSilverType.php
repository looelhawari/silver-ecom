<?php

namespace App\Filament\Resources\SilverTypes\Pages;

use App\Filament\Resources\SilverTypes\SilverTypeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSilverType extends EditRecord
{
    protected static string $resource = SilverTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
