<?php

namespace App\Modules\Orders\Enums;

use App\Support\Enums\HasLabels;
use Filament\Support\Contracts\HasLabel;

enum OrderStatus: string implements HasLabel
{
    use HasLabels;

    public function getLabel(): string
    {
        return $this->label();
    }


    case Pending = 'pending';
    case AwaitingConfirmation = 'awaiting_confirmation';
    case Confirmed = 'confirmed';
    case Preparing = 'preparing';
    case ReadyToShip = 'ready_to_ship';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
    case Rejected = 'rejected';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::AwaitingConfirmation => 'Awaiting Confirmation',
            self::Confirmed => 'Confirmed',
            self::Preparing => 'Preparing',
            self::ReadyToShip => 'Ready to Ship',
            self::Shipped => 'Shipped',
            self::Delivered => 'Delivered',
            self::Cancelled => 'Cancelled',
            self::Rejected => 'Rejected',
            self::Refunded => 'Refunded',
        };
    }
}
