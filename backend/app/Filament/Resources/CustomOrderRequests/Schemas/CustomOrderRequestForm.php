<?php

namespace App\Filament\Resources\CustomOrderRequests\Schemas;

use App\Modules\CustomOrders\Enums\CustomOrderStatus;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CustomOrderRequestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Request')->columns(2)->schema([
                TextInput::make('request_code')->disabled(),
                Select::make('status')->options(CustomOrderStatus::class)->required(),
                TextInput::make('name')->disabled(),
                TextInput::make('phone')->disabled(),
                TextInput::make('whatsapp')->disabled(),
                TextInput::make('email')->disabled(),
                Select::make('silver_type_id')->relationship('silverType', 'name')->disabled(),
                TextInput::make('expected_weight_grams')->suffix('g')->disabled(),
                TextInput::make('size')->disabled(),
                Textarea::make('description')->columnSpanFull()->rows(3)->disabled(),
            ]),

            Section::make('Reference images')->schema([
                Repeater::make('images')->relationship()->hiddenLabel()
                    ->schema([
                        FileUpload::make('path')->image()->disk('public')->disabled()->hiddenLabel(),
                    ])
                    ->addable(false)->deletable(false)->reorderable(false)->columns(3),
            ]),

            Section::make('Admin review')->columns(1)->schema([
                Textarea::make('admin_notes')->label('Internal notes')->rows(3),
                Textarea::make('customer_message')->label('Message to customer')->rows(3),
            ]),

            Section::make('Quote')->description('Fill and set the quote status to "sent" to share it with the customer.')
                ->schema([
                    Group::make()->relationship('quote')->columns(2)->schema([
                        TextInput::make('estimated_weight_grams')->numeric()->suffix('g'),
                        Select::make('silver_type_id')->relationship('silverType', 'name')->searchable(),
                        TextInput::make('gram_price')->numeric()->prefix('EGP'),
                        TextInput::make('workmanship_fee')->numeric()->prefix('EGP'),
                        TextInput::make('extra_cost')->numeric()->prefix('EGP'),
                        TextInput::make('final_quote')->numeric()->prefix('EGP'),
                        Select::make('status')->options([
                            'draft' => 'Draft',
                            'sent' => 'Sent',
                            'accepted' => 'Accepted',
                            'rejected' => 'Rejected',
                        ])->default('draft'),
                        Textarea::make('message')->columnSpanFull()->rows(2),
                    ]),
                ]),
        ]);
    }
}
