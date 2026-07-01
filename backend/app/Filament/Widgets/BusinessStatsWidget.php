<?php

namespace App\Filament\Widgets;

use App\Modules\Catalog\Models\Product;
use App\Modules\CustomOrders\Enums\CustomOrderStatus;
use App\Modules\CustomOrders\Models\CustomOrderRequest;
use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Models\Order;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class BusinessStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = -3;

    protected function getStats(): array
    {
        $revenue = Order::query()
            ->whereIn('status', [
                OrderStatus::Confirmed->value,
                OrderStatus::Preparing->value,
                OrderStatus::ReadyToShip->value,
                OrderStatus::Shipped->value,
                OrderStatus::Delivered->value,
            ])
            ->sum('total');

        return [
            Stat::make('Revenue (confirmed+)', number_format((float) $revenue, 0).' EGP')
                ->description('Excludes pending/cancelled')
                ->color('success'),
            Stat::make('Total orders', (string) Order::count()),
            Stat::make('Pending orders', (string) Order::where('status', OrderStatus::Pending->value)->count())
                ->color('warning'),
            Stat::make('Custom requests pending', (string) CustomOrderRequest::where('status', CustomOrderStatus::Pending->value)->count())
                ->color('warning'),
            Stat::make('Low stock (≤5)', (string) Product::where('stock_quantity', '<=', 5)->where('is_active', true)->count())
                ->color('danger'),
        ];
    }
}
