<?php

namespace App\Filament\Resources\Faqs\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FaqForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('FAQ')->columns(2)->schema([
                TextInput::make('question')->required()->maxLength(255)->columnSpanFull(),
                TextInput::make('question_ar')->label('Question (Arabic)')->maxLength(255)->columnSpanFull(),
                Textarea::make('answer')->required()->rows(3)->columnSpanFull(),
                Textarea::make('answer_ar')->label('Answer (Arabic)')->rows(3)->columnSpanFull(),
                Select::make('group')->options([
                    'silver' => 'Silver', 'delivery' => 'Delivery', 'payment' => 'Payment',
                    'custom' => 'Custom orders', 'returns' => 'Returns', 'care' => 'Care',
                ]),
                TextInput::make('sort_order')->numeric()->default(0),
                Toggle::make('is_active')->default(true),
            ]),
        ]);
    }
}
