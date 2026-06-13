<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PriceSourceResource\Pages;
use App\Models\PriceSource;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PriceSourceResource extends Resource
{
    protected static ?string $model = PriceSource::class;

    protected static ?string $navigationIcon = 'heroicon-o-link';
    protected static ?string $navigationGroup = 'Harga Eksternal';
    protected static ?string $navigationLabel = 'Sumber Harga';
    protected static ?string $modelLabel = 'Sumber Harga';
    protected static ?string $pluralModelLabel = 'Sumber Harga';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->columns(12)
            ->schema([
                Forms\Components\Section::make('Identitas sumber')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(6),
                        Forms\Components\Select::make('type')
                            ->label('Tipe')
                            ->options([
                                'vendor' => 'Vendor',
                                'official' => 'Pemerintah / resmi',
                                'manual' => 'Input manual',
                            ])
                            ->required()
                            ->columnSpan(3),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif')
                            ->inline(false)
                            ->required()
                            ->columnSpan(3),
                        Forms\Components\TextInput::make('url')
                            ->label('URL')
                            ->url()
                            ->columnSpan(8),
                        Forms\Components\TextInput::make('area')
                            ->label('Area')
                            ->columnSpan(4),
                        Forms\Components\Textarea::make('notes')
                            ->label('Catatan')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),
                Forms\Components\Section::make('Pengecekan')
                    ->schema([
                        Forms\Components\DateTimePicker::make('last_checked_at')
                            ->label('Terakhir dicek')
                            ->seconds(false),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Sumber')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold')
                    ->description(fn (PriceSource $record): ?string => $record->url),
                Tables\Columns\TextColumn::make('type')
                    ->label('Tipe')
                    ->badge(),
                Tables\Columns\TextColumn::make('area')
                    ->label('Area')
                    ->searchable(),
                Tables\Columns\TextColumn::make('prices_count')
                    ->label('Item')
                    ->counts('prices')
                    ->alignEnd()
                    ->sortable(),
                Tables\Columns\TextColumn::make('last_checked_at')
                    ->label('Dicek')
                    ->since()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('Edit'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()->label('Hapus'),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPriceSources::route('/'),
            'create' => Pages\CreatePriceSource::route('/create'),
            'edit' => Pages\EditPriceSource::route('/{record}/edit'),
        ];
    }
}
