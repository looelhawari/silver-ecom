<?php

namespace App\Filament\Widgets;

use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Models\Order;
use Filament\Widgets\ChartWidget;

class RevenueChart extends ChartWidget
{
    protected static ?int $sort = 0;

    protected ?string $heading = 'Revenue (last 14 days, EGP)';

    protected function getData(): array
    {
        $start = now()->subDays(13)->startOfDay();

        $rows = Order::query()
            ->whereNotNull('placed_at')
            ->where('placed_at', '>=', $start)
            ->whereNotIn('status', [OrderStatus::Cancelled->value, OrderStatus::Rejected->value])
            ->selectRaw('DATE(placed_at) as day, SUM(total) as revenue')
            ->groupBy('day')
            ->pluck('revenue', 'day');

        $labels = [];
        $data = [];
        for ($i = 0; $i < 14; $i++) {
            $day = $start->copy()->addDays($i);
            $labels[] = $day->format('M j');
            $data[] = (float) ($rows[$day->format('Y-m-d')] ?? 0);
        }

        return [
            'datasets' => [['label' => 'Revenue', 'data' => $data, 'fill' => true]],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
