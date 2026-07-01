<?php

namespace App\Filament\Resources\CustomOrderRequests\Pages;

use App\Filament\Resources\CustomOrderRequests\CustomOrderRequestResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCustomOrderRequest extends CreateRecord
{
    protected static string $resource = CustomOrderRequestResource::class;
}
