<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RecyclingGuideResource\Pages;
use App\Models\RecyclingGuide;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class RecyclingGuideResource extends Resource
{
    protected static ?string $model = RecyclingGuide::class;

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';
    protected static ?string $navigationGroup = 'Konten';
    protected static ?string $navigationLabel = 'Panduan';
    protected static ?string $modelLabel = 'Panduan';
    protected static ?string $pluralModelLabel = 'Panduan Daur Ulang';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->columns(12)
            ->schema([
                Forms\Components\Section::make('Artikel panduan')
                    ->description('Konten edukasi yang muncul di halaman Panduan.')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Judul')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(8),
                        Forms\Components\Select::make('waste_type_id')
                            ->label('Jenis sampah terkait')
                            ->relationship('wasteType', 'name')
                            ->searchable()
                            ->preload()
                            ->columnSpan(4),
                        Forms\Components\Textarea::make('excerpt')
                            ->label('Ringkasan')
                            ->rows(3)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('content')
                            ->label('Isi artikel')
                            ->rows(12)
                            ->columnSpanFull(),
                    ]),
                Forms\Components\Section::make('Publikasi')
                    ->columns(12)
                    ->schema([
                        Forms\Components\TextInput::make('cover_image_url')
                            ->label('URL cover')
                            ->url()
                            ->columnSpan(8),
                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Tanggal publikasi')
                            ->seconds(false)
                            ->columnSpan(4),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('published_at', 'desc')
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image_url')
                    ->label('')
                    ->height(48)
                    ->width(72),
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold')
                    ->description(fn (RecyclingGuide $record): ?string => $record->excerpt),
                Tables\Columns\TextColumn::make('wasteType.name')
                    ->label('Jenis Sampah')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('published_at')
                    ->label('Terbit')
                    ->date('d M Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Update')
                    ->since()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('waste_type_id')
                    ->label('Jenis sampah')
                    ->relationship('wasteType', 'name')
                    ->searchable()
                    ->preload(),
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
            'index' => Pages\ListRecyclingGuides::route('/'),
            'create' => Pages\CreateRecyclingGuide::route('/create'),
            'edit' => Pages\EditRecyclingGuide::route('/{record}/edit'),
        ];
    }
}
