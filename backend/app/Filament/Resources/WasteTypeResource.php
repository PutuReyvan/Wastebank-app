<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WasteTypeResource\Pages;
use App\Models\WasteType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WasteTypeResource extends Resource
{
    protected static ?string $model = WasteType::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationGroup = 'Data Master';
    protected static ?string $navigationLabel = 'Jenis Sampah';
    protected static ?string $modelLabel = 'Jenis Sampah';
    protected static ?string $pluralModelLabel = 'Jenis Sampah';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->columns(12)
            ->schema([
                Forms\Components\Section::make('Informasi jenis sampah')
                    ->description('Data ini muncul di katalog publik dan kalkulator harga.')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(7),
                        Forms\Components\Select::make('category')
                            ->label('Kategori')
                            ->options([
                                'Plastik' => 'Plastik',
                                'Kertas' => 'Kertas',
                                'Logam' => 'Logam',
                                'Kaca' => 'Kaca',
                                'Elektronik' => 'Elektronik',
                                'Organik' => 'Organik',
                            ])
                            ->searchable()
                            ->required()
                            ->columnSpan(5),
                        Forms\Components\TextInput::make('reference_price_per_kg')
                            ->label('Harga referensi / kg')
                            ->prefix('Rp')
                            ->numeric()
                            ->minValue(0)
                            ->step(100)
                            ->required()
                            ->default(0)
                            ->columnSpan(5),
                        Forms\Components\Toggle::make('is_eligible')
                            ->label('Diterima bank sampah')
                            ->helperText('Nonaktifkan untuk organik, styrofoam, atau sampah yang tidak umum diterima.')
                            ->required()
                            ->inline(false)
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('icon_url')
                            ->label('URL ikon')
                            ->url()
                            ->columnSpan(3),
                        Forms\Components\Textarea::make('description')
                            ->label('Deskripsi')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Jenis Sampah')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold')
                    ->description(fn (WasteType $record): ?string => $record->description),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_eligible')
                    ->label('Diterima')
                    ->boolean(),
                Tables\Columns\TextColumn::make('reference_price_per_kg')
                    ->label('Harga / kg')
                    ->alignEnd()
                    ->sortable()
                    ->formatStateUsing(fn ($state): string => 'Rp ' . number_format((float) $state, 0, ',', '.')),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Update')
                    ->since()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->label('Kategori')
                    ->options([
                        'Plastik' => 'Plastik',
                        'Kertas' => 'Kertas',
                        'Logam' => 'Logam',
                        'Kaca' => 'Kaca',
                        'Elektronik' => 'Elektronik',
                        'Organik' => 'Organik',
                    ]),
                Tables\Filters\TernaryFilter::make('is_eligible')
                    ->label('Diterima bank sampah'),
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

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWasteTypes::route('/'),
            'create' => Pages\CreateWasteType::route('/create'),
            'edit' => Pages\EditWasteType::route('/{record}/edit'),
        ];
    }
}
