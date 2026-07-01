<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Details')->columns(2)->schema([
                TextInput::make('name')->required()->maxLength(160)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('name_ar')->label('Name (Arabic)')->maxLength(160),
                TextInput::make('slug')->required()->maxLength(180)->unique(ignoreRecord: true),
                TextInput::make('sku')->label('SKU')->maxLength(60)->unique(ignoreRecord: true),
                Select::make('category_id')->relationship('category', 'name')->searchable()->preload()->required(),
                Select::make('silver_type_id')->relationship('silverType', 'name')->searchable()->preload(),
                Textarea::make('description')->columnSpanFull()->rows(3),
                Textarea::make('description_ar')->label('Description (Arabic)')->columnSpanFull()->rows(3),
                Textarea::make('care_instructions')->columnSpanFull()->rows(2),
                TagsInput::make('tags')->columnSpanFull(),
            ]),

            Section::make('Pricing (EGP)')->columns(2)
                ->description('Prices are recalculated server-side on save. A manual override takes precedence over everything.')
                ->schema([
                    Select::make('pricing_type')->options([
                        'calculated' => 'Calculated (gram price × weight + workmanship)',
                        'fixed' => 'Fixed price',
                    ])->default('calculated')->live()->required(),
                    TextInput::make('fixed_price')->numeric()->prefix('EGP')->minValue(0)
                        ->visible(fn (Get $get) => $get('pricing_type') === 'fixed'),
                    TextInput::make('weight_in_grams')->numeric()->suffix('g')->minValue(0)
                        ->visible(fn (Get $get) => $get('pricing_type') === 'calculated'),
                    TextInput::make('workmanship_fee')->numeric()->prefix('EGP')->default(0)->minValue(0),
                    TextInput::make('extra_markup')->numeric()->prefix('EGP')->default(0)->minValue(0),
                    TextInput::make('discount_amount')->numeric()->prefix('EGP')->default(0)->minValue(0),
                    TextInput::make('discount_percentage')->numeric()->suffix('%')->minValue(0)->maxValue(100),
                    TextInput::make('manual_price_override')->numeric()->prefix('EGP')->minValue(0)
                        ->helperText('When set, this exact price is used.'),
                    Toggle::make('show_workmanship_fee_publicly'),
                    Placeholder::make('final_price')->label('Current final price')
                        ->content(fn ($record) => $record
                            ? number_format((float) $record->final_price, 2).' EGP'
                            : 'Calculated on save'),
                ]),

            Section::make('Inventory & visibility')->columns(3)->schema([
                TextInput::make('stock_quantity')->numeric()->default(0)->minValue(0)->required(),
                Toggle::make('is_active')->default(true),
                Toggle::make('is_featured'),
                Toggle::make('is_best_seller'),
            ]),

            Section::make('Images')->schema([
                Repeater::make('images')->relationship()->hiddenLabel()->schema([
                    FileUpload::make('path')->label('Image')->image()->disk('public')
                        ->directory('products')->imageEditor()->required(),
                    TextInput::make('alt')->maxLength(160),
                    Toggle::make('is_main')->label('Main image'),
                    TextInput::make('sort_order')->numeric()->default(0),
                ])->columns(2)->collapsible()->defaultItems(0)->addActionLabel('Add image'),
            ]),

            Section::make('Variants')->collapsed()->schema([
                Repeater::make('variants')->relationship()->hiddenLabel()->schema([
                    Select::make('type')->options([
                        'ring_size' => 'Ring size',
                        'chain_length' => 'Chain length',
                        'bracelet_size' => 'Bracelet size',
                        'finish' => 'Finish',
                        'color' => 'Color',
                    ])->required(),
                    TextInput::make('label')->required()->maxLength(80),
                    TextInput::make('value')->maxLength(80),
                    TextInput::make('price_adjustment')->numeric()->prefix('EGP')->default(0),
                    TextInput::make('sort_order')->numeric()->default(0),
                ])->columns(2)->collapsible()->defaultItems(0)->addActionLabel('Add variant'),
            ]),

            Section::make('SEO')->columns(2)->collapsed()->schema([
                TextInput::make('seo_title')->maxLength(160),
                TextInput::make('seo_description')->maxLength(300),
            ]),
        ]);
    }
}
