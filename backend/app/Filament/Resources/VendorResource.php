<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VendorResource\Pages;
use App\Models\Vendor;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class VendorResource extends Resource
{
    protected static ?string $model = Vendor::class;

    protected static ?string $navigationIcon = 'heroicon-o-truck';
    protected static ?string $navigationGroup = 'Direktori';
    protected static ?string $navigationLabel = 'Vendor Pickup';
    protected static ?string $modelLabel = 'Vendor';
    protected static ?string $pluralModelLabel = 'Vendor Pickup';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->columns(12)
            ->schema([
                Forms\Components\Section::make('Profil vendor')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(7),
                        Forms\Components\Select::make('type')
                            ->label('Tipe')
                            ->options([
                                'business' => 'Bisnis',
                                'ngo' => 'NGO / Komunitas',
                            ])
                            ->required()
                            ->columnSpan(3),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif')
                            ->required()
                            ->inline(false)
                            ->columnSpan(2),
                        Forms\Components\Textarea::make('description')
                            ->label('Deskripsi')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),
                Forms\Components\Section::make('Area dan kontak')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('service_area')
                            ->label('Area layanan')
                            ->placeholder('Jakarta Barat, Tangerang')
                            ->columnSpan(6),
                        Forms\Components\TextInput::make('phone')
                            ->label('Telepon')
                            ->tel()
                            ->columnSpan(3),
                        Forms\Components\TextInput::make('whatsapp')
                            ->label('WhatsApp')
                            ->tel()
                            ->columnSpan(3),
                        Forms\Components\TextInput::make('photo_url')
                            ->label('URL foto')
                            ->url()
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Vendor')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold')
                    ->description(fn (Vendor $record): ?string => $record->description),
                Tables\Columns\TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => $state === 'ngo' ? 'NGO' : 'Bisnis')
                    ->color(fn (?string $state): string => $state === 'ngo' ? 'info' : 'success'),
                Tables\Columns\TextColumn::make('service_area')
                    ->label('Area')
                    ->searchable()
                    ->limit(36),
                Tables\Columns\TextColumn::make('whatsapp')
                    ->label('WhatsApp')
                    ->copyable()
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Update')
                    ->since()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->label('Tipe')
                    ->options([
                        'business' => 'Bisnis',
                        'ngo' => 'NGO / Komunitas',
                    ]),
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
            'index' => Pages\ListVendors::route('/'),
            'create' => Pages\CreateVendor::route('/create'),
            'edit' => Pages\EditVendor::route('/{record}/edit'),
        ];
    }
}
