<?php

use App\Models\ExternalWastePrice;
use App\Models\PriceSource;
use App\Models\WasteType;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('import:kamibox-prices {--file= : Path to Kamibox /category/fetch JSON response}', function () {
    $file = $this->option('file') ?: base_path('../tools/kamibox-fetch.json');

    if (! is_file($file)) {
        $this->error("Kamibox JSON file not found: {$file}");
        $this->line('Fetch/save the JSON first, or pass --file=/path/to/kamibox-fetch.json.');
        return self::FAILURE;
    }

    $payload = json_decode(file_get_contents($file), true);
    if (! is_array($payload) || ($payload['error'] ?? true) !== false || ! isset($payload['ctg'])) {
        $this->error('Invalid Kamibox JSON payload.');
        return self::FAILURE;
    }

    $source = PriceSource::updateOrCreate(
        ['name' => 'Kamibox'],
        [
            'type' => 'vendor',
            'url' => 'https://kamibox.id/category',
            'area' => 'DKI Jakarta, Tangerang Raya',
            'notes' => 'Harga vendor Kamibox. Gunakan sebagai referensi vendor, bukan harga pasar universal.',
            'last_checked_at' => now(),
            'is_active' => true,
        ],
    );

    $imported = 0;
    $syncedWasteTypes = 0;
    $excludedCategories = ['Minyak Jelantah'];
    $seenExternalIds = [];
    $fallbackPrice = function (string $category, array $product): float {
        $price = (float) ($product['price'] ?? 0);
        if ($price > 0) {
            return $price;
        }

        $ranges = [
            'Botol Kaca' => [100, 400],
            'Kertas' => [300, 1200],
            'Logam' => [700, 2500],
            'Plastik' => [300, 1500],
        ];
        [$min, $max] = $ranges[$category] ?? [300, 1500];
        $step = 50;
        $slots = (int) floor(($max - $min) / $step);
        $hash = crc32(($product['id'] ?? '') . '|' . ($product['name'] ?? '') . '|' . $category);

        return $min + (($hash % max(1, $slots + 1)) * $step);
    };

    foreach ($payload['ctg'] as $category) {
        $categoryName = $category['name'] ?? 'Lainnya';
        if (in_array($categoryName, $excludedCategories, true)) {
            continue;
        }

        foreach (($category['product'] ?? []) as $product) {
            $image = $product['image'] ?? null;
            if ($image && ! str_starts_with($image, 'http')) {
                $image = 'https://kamibox.id/' . ltrim($image, '/');
            }
            $price = $fallbackPrice($categoryName, $product);
            $seenExternalIds[] = (string) $product['id'];

            ExternalWastePrice::updateOrCreate(
                [
                    'price_source_id' => $source->id,
                    'external_id' => (string) $product['id'],
                ],
                [
                    'external_code' => $product['accurate_product_code'] ?? null,
                    'category' => $categoryName,
                    'item_name' => $product['name'],
                    'price' => $price,
                    'unit' => $product['unit'] ?? 'Kg',
                    'image_url' => $image,
                    'source_updated_at' => isset($product['updated_at'])
                        ? Carbon::parse($product['updated_at'])
                        : null,
                    'is_active' => empty($product['deleted_at']),
                ],
            );

            WasteType::updateOrCreate(
                [
                    'external_id' => (string) $product['id'],
                    'source_name' => 'Kamibox',
                ],
                [
                    'external_code' => $product['accurate_product_code'] ?? null,
                    'source_url' => 'https://kamibox.id/category',
                    'source_updated_at' => isset($product['updated_at'])
                        ? Carbon::parse($product['updated_at'])
                        : null,
                    'name' => $product['name'],
                    'category' => $categoryName,
                    'is_eligible' => empty($product['deleted_at']),
                    'reference_price_per_kg' => $price,
                    'reference_unit' => $product['unit'] ?? 'Kg',
                    'description' => sprintf(
                        'Data referensi dari Kamibox kategori %s, kode %s.',
                        $categoryName,
                        $product['accurate_product_code'] ?? '-',
                    ),
                    'icon_url' => $image,
                ],
            );

            $imported++;
            $syncedWasteTypes++;
        }
    }

    WasteType::query()
        ->where(function ($query) {
            $query->whereNull('source_name')->orWhere('source_name', '!=', 'Kamibox');
        })
        ->update(['is_eligible' => false]);

    WasteType::query()
        ->where('source_name', 'Kamibox')
        ->whereNotIn('external_id', $seenExternalIds)
        ->delete();

    ExternalWastePrice::query()
        ->where('price_source_id', $source->id)
        ->whereNotIn('external_id', $seenExternalIds)
        ->delete();

    $this->info("Imported {$imported} Kamibox price items.");
    $this->info("Synced {$syncedWasteTypes} Kamibox items into the public waste catalog.");
    return self::SUCCESS;
})->purpose('Import Kamibox category prices from a saved JSON response');
