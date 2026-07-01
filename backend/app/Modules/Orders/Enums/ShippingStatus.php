<?php

namespace App\Modules\Orders\Enums;

use App\Support\Enums\HasLabels;
use Filament\Support\Contracts\HasLabel;

enum ShippingStatus: string implements HasLabel
{
    use HasLabels;

    public function getLabel(): string
    {
        return $this->label();
    }


    case NotStarted = 'not_started';
    case Preparing = 'preparing';
    case ReadyToShip = 'ready_to_ship';
    case Shipped = 'shipped';
    case OutForDelivery = 'out_for_delivery';
    case Delivered = 'delivered';
    case Failed = 'failed';
    case Returned = 'returned';

    public function label(): string
    {
        return match ($this) {
            self::NotStarted => 'Not Started',
            self::Preparing => 'Preparing',
            self::ReadyToShip => 'Ready to Ship',
            self::Shipped => 'Shipped',
            self::OutForDelivery => 'Out for Delivery',
            self::Delivered => 'Delivered',
            self::Failed => 'Failed',
            self::Returned => 'Returned',
        };
    }
}
