<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WasteBankResource\Pages;
use App\Models\WasteBank;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WasteBankResource extends Resource
{
    protected static ?string $model = WasteBank::class;

    protected static ?string $navigationIcon = 'heroicon-o-map-pin';
    protected static ?string $navigationGroup = 'Direktori';
    protected static ?string $navigationLabel = 'Bank Sampah';
    protected static ?string $modelLabel = 'Bank Sampah';
    protected static ?string $pluralModelLabel = 'Bank Sampah';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->columns(12)
            ->schema([
                Forms\Components\Section::make('Profil bank sampah')
                    ->description('Informasi utama yang ditampilkan di halaman publik.')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(8),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif')
                            ->required()
                            ->inline(false)
                            ->columnSpan(4),
                        Forms\Components\Textarea::make('address')
                            ->label('Alamat')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('kelurahan')
                            ->label('Kelurahan')
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('kecamatan')
                            ->label('Kecamatan')
                            ->required()
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('kota')
                            ->label('Kota')
                            ->required()
                            ->columnSpan(4),
                    ]),
                Forms\Components\Section::make('Kontak dan operasional')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('phone')
                            ->label('Telepon')
                            ->tel()
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('whatsapp')
                            ->label('WhatsApp')
                            ->tel()
                            ->helperText('Gunakan nomor tanpa spasi, contoh: 081234567890.')
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('operating_hours')
                            ->label('Jam operasional')
                            ->placeholder('Sen-Sab, 08.00-16.00')
                            ->columnSpan(4),
                        Forms\Components\TextInput::make('photo_url')
                            ->label('URL foto')
                            ->url()
                            ->columnSpanFull(),
                    ]),
                Forms\Components\Section::make('Lokasi peta')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('lat')
                            ->label('Latitude')
                            ->numeric()
                            ->columnSpan(6),
                        Forms\Components\TextInput::make('lng')
                            ->label('Longitude')
                            ->numeric()
                            ->columnSpan(6),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('name')
            ->columns([
                Tables\Columns\ImageColumn::make('photo_url')
                    ->label('')
                    ->circular()
                    ->defaultImageUrl('https://ui-avatars.com/api/?name=Bank+Sampah&background=2D6A4F&color=fff'),
                Tables\Columns\TextColumn::make('name')
                    ->label('Bank Sampah')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold')
                    ->description(fn (WasteBank $record): string => $record->address),
                Tables\Columns\TextColumn::make('kecamatan')
                    ->label('Kecamatan')
                    ->badge()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('whatsapp')
                    ->label('WhatsApp')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('operating_hours')
                    ->label('Jam')
                    ->toggleable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Update')
                    ->since()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('kecamatan')
                    ->label('Kecamatan')
                    ->options(fn (): array => WasteBank::query()
                        ->whereNotNull('kecamatan')
                        ->orderBy('kecamatan')
                        ->pluck('kecamatan', 'kecamatan')
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

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWasteBanks::route('/'),
            'create' => Pages\CreateWasteBank::route('/create'),
            'edit' => Pages\EditWasteBank::route('/{record}/edit'),
        ];
    }
}
