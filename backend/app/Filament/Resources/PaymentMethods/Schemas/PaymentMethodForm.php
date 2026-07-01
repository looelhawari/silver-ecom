<?php

namespace App\Filament\Resources\PaymentMethods\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PaymentMethodForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Payment method')->columns(2)->schema([
                TextInput::make('code')->required()->maxLength(40)
                    ->helperText('Machine code, e.g. cod, vodafone_cash, instapay, bank_transfer')
                    ->unique(ignoreRecord: true),
                TextInput::make('name')->required()->maxLength(120),
                TextInput::make('name_ar')->label('Name (Arabic)')->maxLength(120),
                TextInput::make('account_details')->maxLength(255)
                    ->helperText('Wallet/bank number shown to the customer.'),
                Textarea::make('instructions')->columnSpanFull()->rows(3),
                Textarea::make('instructions_ar')->label('Instructions (Arabic)')->columnSpanFull()->rows(3),
                Toggle::make('requires_proof')->helperText('Customer must upload a payment proof.'),
                Toggle::make('is_active')->default(true),
                TextInput::make('sort_order')->numeric()->default(0),
            ]),
        ]);
    }
}
