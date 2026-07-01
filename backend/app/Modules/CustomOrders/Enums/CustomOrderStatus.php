<?php

namespace App\Modules\CustomOrders\Enums;

use App\Support\Enums\HasLabels;
use Filament\Support\Contracts\HasLabel;

enum CustomOrderStatus: string implements HasLabel
{
    use HasLabels;

    public function getLabel(): string
    {
        return $this->label();
    }


    case Pending = 'pending';
    case UnderReview = 'under_review';
    case MoreDetailsNeeded = 'more_details_needed';
    case Quoted = 'quoted';
    case CustomerAccepted = 'customer_accepted';
    case CustomerRejected = 'customer_rejected';
    case Approved = 'approved';
    case ConvertedToOrder = 'converted_to_order';
    case Rejected = 'rejected';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::UnderReview => 'Under Review',
            self::MoreDetailsNeeded => 'More Details Needed',
            self::Quoted => 'Quoted',
            self::CustomerAccepted => 'Customer Accepted',
            self::CustomerRejected => 'Customer Rejected',
            self::Approved => 'Approved',
            self::ConvertedToOrder => 'Converted to Order',
            self::Rejected => 'Rejected',
            self::Cancelled => 'Cancelled',
        };
    }
}
