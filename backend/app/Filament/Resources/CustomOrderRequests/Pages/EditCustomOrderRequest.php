<?php

namespace App\Filament\Resources\CustomOrderRequests\Pages;

use App\Filament\Resources\CustomOrderRequests\CustomOrderRequestResource;
use App\Modules\CustomOrders\Actions\ConvertToOrder;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Throwable;

class EditCustomOrderRequest extends EditRecord
{
    protected static string $resource = CustomOrderRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('convertToOrder')
                ->label('Convert to order')
                ->icon('heroicon-o-shopping-bag')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->order_id === null)
                ->action(function (): void {
                    try {
                        $order = app(ConvertToOrder::class)->handle($this->record);
                        Notification::make()
                            ->title("Order {$order->order_code} created")
                            ->success()
                            ->send();
                        $this->refreshFormData(['status', 'order_id']);
                    } catch (Throwable $e) {
                        Notification::make()->title($e->getMessage())->danger()->send();
                    }
                }),
            DeleteAction::make(),
        ];
    }
}
