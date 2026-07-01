<?php

namespace App\Modules\Orders\Enums;

use App\Support\Enums\HasLabels;
use Filament\Support\Contracts\HasLabel;

enum PaymentStatus: string implements HasLabel
{
    use HasLabels;

    public function getLabel(): string
    {
        return $this->label();
    }


    case Unpaid = 'unpaid';
    case AwaitingProof = 'awaiting_proof';
    case ProofUploaded = 'proof_uploaded';
    case UnderReview = 'under_review';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Paid = 'paid';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'Unpaid',
            self::AwaitingProof => 'Awaiting Proof',
            self::ProofUploaded => 'Proof Uploaded',
            self::UnderReview => 'Under Review',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
            self::Paid => 'Paid',
            self::Refunded => 'Refunded',
        };
    }
}
