<?php

namespace App\Filament\Widgets;

use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Models\Order;
use Filament\Widgets\ChartWidget;

class OrdersByStatusChart extends ChartWidget
{
    protected static ?int $sort = -2;

    protected ?string $heading = 'Orders by status';

    protected function getData(): array
    {
        $counts = Order::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $labels = [];
        $data = [];
        foreach (OrderStatus::cases() as $status) {
            $count = (int) ($counts[$status->value] ?? 0);
            if ($count > 0) {
                $labels[] = $status->label();
                $data[] = $count;
            }
        }

        return [
            'datasets' => [[
                'label' => 'Orders',
                'data' => $data,
            ]],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
