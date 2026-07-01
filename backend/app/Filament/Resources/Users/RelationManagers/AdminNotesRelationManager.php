<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Forms\Components\Textarea;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class AdminNotesRelationManager extends RelationManager
{
    protected static string $relationship = 'adminNotes';

    protected static ?string $title = 'Admin notes';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Textarea::make('note')->required()->rows(3)->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('note')->wrap(),
                TextColumn::make('author.name')->label('By')->placeholder('—'),
                TextColumn::make('created_at')->dateTime('d M Y, H:i'),
            ])
            ->headerActions([
                CreateAction::make()->mutateDataUsing(function (array $data): array {
                    $data['author_id'] = Auth::id();

                    return $data;
                }),
            ]);
    }
}
