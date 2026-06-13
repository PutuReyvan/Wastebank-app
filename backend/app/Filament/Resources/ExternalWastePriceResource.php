<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExternalWastePriceResource\Pages;
use App\Models\ExternalWastePrice;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ExternalWastePriceResource extends Resource
{
    protected static ?string $model = ExternalWastePrice::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';
    protected static ?string $navigationGroup = 'Harga Eksternal';
    protected static ?string $navigationLabel = 'Item Harga';
    protected static ?string $modelLabel = 'Item Harga';
    protected static ?string $pluralModelLabel = 'Item Harga Eksternal';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->columns(12)
            ->schema([
                Forms\Components\Section::make('Harga eksternal')
                    ->columns(12)
                    ->schema([
                        Forms\Components\Select::make('price_source_id')
                            ->label('Sumber')
                            ->relationship('source', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('external_code')
                            ->label('Kode eksternal')
                            ->columnSpan(2),
                        Forms\Components\TextInput::make('external_id')
                            ->label('ID eksternal')
                            ->columnSpan(2),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif')
                            ->inline(false)
                            ->required()
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('category')
                            ->label('Kategori')
                            ->required()
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('item_name')
                            ->label('Nama item')
                            ->required()
                            ->columnSpan(5),
                        Forms\Components\TextInput::make('price')
                            ->label('Harga')
                            ->prefix('Rp')
                            ->numeric()
                            ->required()
                            ->columnSpan(2),
                        Forms\Components\TextInput::make('unit')
                            ->label('Satuan')
                            ->required()
                            ->columnSpan(1),
                        Forms\Components\TextInput::make('image_url')
                            ->label('URL gambar')
                            ->url()
                            ->columnSpan(8),
                        Forms\Components\DateTimePicker::make('source_updated_at')
                            ->label('Update dari sumber')
                            ->seconds(false)
                            ->columnSpan(4),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('updated_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('source.name')
                    ->label('Sumber')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('item_name')
                    ->label('Item')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold')
                    ->description(fn (ExternalWastePrice $record): ?string => $record->external_code),
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->alignEnd()
                    ->sortable()
                    ->formatStateUsing(fn ($state): string => 'Rp ' . number_format((float) $state, 0, ',', '.')),
                Tables\Columns\TextColumn::make('unit')
                    ->label('Satuan')
                    ->badge(),
                Tables\Columns\TextColumn::make('source_updated_at')
                    ->label('Update sumber')
                    ->date('d M Y')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('price_source_id')
                    ->label('Sumber')
                    ->relationship('source', 'name')
                    ->searchable()
                    ->preload(),
                Tables\Filters\SelectFilter::make('category')
                    ->label('Kategori')
                    ->options(fn (): array => ExternalWastePrice::query()
                        ->whereNotNull('category')
                        ->orderBy('category')
                        ->pluck('category', 'category')
                        ->all()),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status aktif'),
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
            'index' => Pages\ListExternalWastePrices::route('/'),
            'create' => Pages\CreateExternalWastePrice::route('/create'),
            'edit' => Pages\EditExternalWastePrice::route('/{record}/edit'),
        ];
    }
}
