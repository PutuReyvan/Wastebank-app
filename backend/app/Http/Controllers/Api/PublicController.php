<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RecyclingGuide;
use App\Models\ExternalWastePrice;
use App\Models\PriceSource;
use App\Models\WasteBank;
use App\Models\WasteType;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function wasteTypes(Request $request)
    {
        $query = WasteType::query();

        if ($request->filled('category') && $request->input('category') !== 'Semua') {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('is_eligible')) {
            $query->where('is_eligible', filter_var($request->input('is_eligible'), FILTER_VALIDATE_BOOL));
        }

        $items = $query->orderBy('category')->orderBy('name')->get();

        return response()->json([
            'data' => $items,
            'meta' => ['total' => $items->count()],
        ]);
    }

    public function wasteType($id)
    {
        return response()->json(['data' => WasteType::findOrFail($id)]);
    }

    public function calculator(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.waste_type_id' => 'required|integer',
            'items.*.weight_kg' => 'required|numeric|min:0',
        ]);

        $breakdown = [];
        $total = 0;

        foreach ($request->input('items') as $item) {
            $wasteType = WasteType::find($item['waste_type_id']);

            if (!$wasteType) {
                return response()->json([
                    'message' => "Tipe sampah ID {$item['waste_type_id']} tidak ditemukan",
                ], 422);
            }

            if (!$wasteType->is_eligible) {
                return response()->json([
                    'message' => "{$wasteType->name} tidak diterima bank sampah",
                ], 422);
            }

            $weight = (float) $item['weight_kg'];
            $price = (float) $wasteType->reference_price_per_kg;
            $subtotal = $weight * $price;

            $breakdown[] = [
                'waste_type_id' => $wasteType->id,
                'name' => $wasteType->name,
                'category' => $wasteType->category,
                'weight_kg' => $weight,
                'price_per_kg' => $price,
                'subtotal' => $subtotal,
            ];
            $total += $subtotal;
        }

        return response()->json([
            'data' => [
                'items' => $breakdown,
                'total_estimated' => $total,
            ],
        ]);
    }

    public function wasteBanks(Request $request)
    {
        $query = WasteBank::with(['catalog.wasteType'])->where('is_active', true);

        if ($request->filled('waste_type_id')) {
            $id = (int) $request->input('waste_type_id');
            $query->whereHas('catalog', fn ($catalog) => $catalog->where('waste_type_id', $id));
        }

        if ($request->filled('kecamatan') && $request->input('kecamatan') !== 'Semua') {
            $query->where('kecamatan', $request->input('kecamatan'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(fn ($bank) => $bank
                ->where('name', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%")
                ->orWhere('kecamatan', 'like', "%{$search}%"));
        }

        $banks = $query->orderBy('name')->get()->map(fn ($bank) => $this->serializeBank($bank));

        return response()->json([
            'data' => $banks,
            'meta' => ['total' => $banks->count()],
        ]);
    }

    public function wasteBank($id)
    {
        $bank = WasteBank::with(['catalog.wasteType'])->findOrFail($id);

        return response()->json(['data' => $this->serializeBank($bank)]);
    }

    public function guides(Request $req)
    {
        $q = RecyclingGuide::whereNotNull('published_at');
        if ($req->filled('waste_type_id')) {
            $q->where('waste_type_id', (int) $req->input('waste_type_id'));
        }
        $guides = $q->orderByDesc('published_at')->get();
        return response()->json(['data' => $guides, 'meta' => ['total' => $guides->count()]]);
    }

    public function guide($id)
    {
        $g = RecyclingGuide::findOrFail($id);
        return response()->json(['data' => $g]);
    }

    public function priceSources()
    {
        $sources = PriceSource::query()
            ->where('is_active', true)
            ->withCount(['prices' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $sources,
            'meta' => ['total' => $sources->count()],
        ]);
    }

    public function externalPrices(Request $request)
    {
        $query = ExternalWastePrice::with('source')
            ->where('is_active', true)
            ->whereHas('source', fn ($source) => $source->where('is_active', true));

        if ($request->filled('source')) {
            $source = $request->input('source');
            $query->whereHas('source', fn ($item) => $item->where('name', $source));
        }

        if ($request->filled('category') && $request->input('category') !== 'Semua') {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(fn ($price) => $price
                ->where('item_name', 'like', "%{$search}%")
                ->orWhere('external_code', 'like', "%{$search}%"));
        }

        $prices = $query->orderBy('category')->orderBy('item_name')->get()->map(fn ($price) => [
            'id' => $price->id,
            'source' => [
                'id' => $price->source?->id,
                'name' => $price->source?->name,
                'type' => $price->source?->type,
                'url' => $price->source?->url,
                'area' => $price->source?->area,
                'last_checked_at' => $price->source?->last_checked_at,
            ],
            'external_id' => $price->external_id,
            'external_code' => $price->external_code,
            'category' => $price->category,
            'item_name' => $price->item_name,
            'price' => (float) $price->price,
            'unit' => $price->unit,
            'image_url' => $price->image_url,
            'source_updated_at' => $price->source_updated_at,
        ]);

        return response()->json([
            'data' => $prices,
            'meta' => ['total' => $prices->count()],
        ]);
    }

    private function serializeBank(WasteBank $bank): array
    {
        return [
            'id' => $bank->id,
            'external_id' => $bank->external_id,
            'source_name' => $bank->source_name,
            'source_url' => $bank->source_url,
            'location_verified_at' => $bank->location_verified_at,
            'name' => $bank->name,
            'address' => $bank->address,
            'kelurahan' => $bank->kelurahan,
            'kecamatan' => $bank->kecamatan,
            'kota' => $bank->kota,
            'lat' => $bank->lat,
            'lng' => $bank->lng,
            'phone' => $bank->phone,
            'whatsapp' => $bank->whatsapp,
            'operating_hours' => $bank->operating_hours,
            'photo_url' => $bank->photo_url,
            'is_active' => $bank->is_active,
            'accepted_types' => $bank->catalog->map(fn ($catalog) => [
                'waste_type_id' => $catalog->waste_type_id,
                'name' => $catalog->wasteType?->name,
                'category' => $catalog->wasteType?->category,
                'price_per_kg' => (float) $catalog->price_per_kg,
                'updated_at' => $catalog->updated_at,
            ])->values(),
        ];
    }
}
