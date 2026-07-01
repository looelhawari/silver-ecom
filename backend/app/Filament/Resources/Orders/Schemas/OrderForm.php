<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Enums\PaymentStatus;
use App\Modules\Orders\Enums\ShippingStatus;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Customer')->columns(2)->schema([
                TextInput::make('order_code')->disabled(),
                TextInput::make('customer_name')->disabled(),
                TextInput::make('customer_phone')->disabled(),
                TextInput::make('customer_whatsapp')->disabled(),
                TextInput::make('customer_email')->disabled(),
            ]),

            Section::make('Statuses')->columns(3)->schema([
                Select::make('status')->options(OrderStatus::class)->required(),
                Select::make('payment_status')->options(PaymentStatus::class)->required(),
                Select::make('shipping_status')->options(ShippingStatus::class)->required(),
            ]),

            Section::make('Shipping & totals')->columns(2)->schema([
                TextInput::make('shipping_cost')->numeric()->prefix('EGP')->minValue(0),
                TextInput::make('total')->numeric()->prefix('EGP')->minValue(0)
                    ->helperText('Editable if you adjust the order manually.'),
                TextInput::make('tracking_number')->maxLength(120),
                TextInput::make('courier_name')->maxLength(120),
                Textarea::make('shipping_note')->label('Customer-visible shipping note')->columnSpanFull()->rows(2),
            ]),

            Section::make('Payment proof')
                ->visible(fn ($record) => $record?->paymentProof !== null)
                ->schema([
                    Group::make()->relationship('paymentProof')->columns(2)->schema([
                        FileUpload::make('file_path')->label('Uploaded proof')->disk('public')
                            ->disabled()->columnSpanFull(),
                        Select::make('status')->options([
                            'pending' => 'Pending', 'approved' => 'Approved', 'rejected' => 'Rejected',
                        ])->helperText('Approve, then set the order Payment status accordingly.'),
                        Textarea::make('note')->rows(2),
                    ]),
                ]),

            Section::make('Notes')->columns(2)->schema([
                Textarea::make('admin_notes')->label('Internal notes')->rows(3),
                Textarea::make('notes')->label('Customer order notes')->rows(3)->disabled(),
            ]),

            Section::make('Items')->collapsed()->schema([
                Repeater::make('items')->relationship()->hiddenLabel()->schema([
                    TextInput::make('product_name')->disabled(),
                    TextInput::make('variant_label')->disabled(),
                    TextInput::make('quantity')->disabled(),
                    TextInput::make('unit_price')->prefix('EGP')->disabled(),
                    TextInput::make('line_total')->prefix('EGP')->disabled(),
                ])->columns(3)->deletable(false)->addable(false)->reorderable(false),
            ]),
        ]);
    }
}
