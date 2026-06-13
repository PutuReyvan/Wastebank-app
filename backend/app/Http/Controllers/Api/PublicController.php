<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WasteType;
use App\Models\WasteBank;
use App\Models\Vendor;
use App\Models\RecyclingGuide;
use App\Models\ExternalWastePrice;
use App\Models\PriceSource;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function wasteTypes(Request $req)
    {
        $q = WasteType::query();
        if (WasteType::where('source_name', 'Kamibox')->exists()) {
            $q->where('source_name', 'Kamibox');
        }
        if ($req->filled('category') && $req->input('category') !== 'Semua') {
            $q->where('category', $req->input('category'));
        }
        if ($req->filled('is_eligible')) {
            $q->where('is_eligible', filter_var($req->input('is_eligible'), FILTER_VALIDATE_BOOL));
        }
        return response()->json([
            'data' => $q->orderBy('id')->get(),
            'meta' => ['total' => $q->count()],
        ]);
    }

    public function wasteType($id)
    {
        $q = WasteType::query();
        if (WasteType::where('source_name', 'Kamibox')->exists()) {
            $q->where('source_name', 'Kamibox');
        }
        $w = $q->findOrFail($id);
        return response()->json(['data' => $w]);
    }

    public function calculator(Request $req)
    {
        $req->validate([
            'items' => 'required|array|min:1',
            'items.*.waste_type_id' => 'required|integer',
            'items.*.weight_kg' => 'required|numeric|min:0',
        ]);
        $breakdown = [];
        $total = 0;
        foreach ($req->input('items') as $it) {
            $wt = WasteType::find($it['waste_type_id']);
            if (!$wt) {
                return response()->json(['message' => "Tipe sampah ID {$it['waste_type_id']} tidak ditemukan"], 422);
            }
            if (!$wt->is_eligible) {
                return response()->json(['message' => "{$wt->name} tidak diterima bank sampah"], 422);
            }
            $weight = (float) $it['weight_kg'];
            $price = (float) $wt->reference_price_per_kg;
            $subtotal = $weight * $price;
            $breakdown[] = [
                'waste_type_id' => $wt->id,
                'name' => $wt->name,
                'category' => $wt->category,
                'weight_kg' => $weight,
                'price_per_kg' => $price,
                'subtotal' => $subtotal,
            ];
            $total += $subtotal;
        }
        return response()->json([
            'data' => ['items' => $breakdown, 'total_estimated' => $total],
        ]);
    }

    public function wasteBanks(Request $req)
    {
        $q = WasteBank::with(['catalog.wasteType'])->where('is_active', true);

        if ($req->filled('waste_type_id')) {
            $id = (int) $req->input('waste_type_id');
            $q->whereHas('catalog', fn($x) => $x->where('waste_type_id', $id));
        }
        if ($req->filled('kecamatan') && $req->input('kecamatan') !== 'Semua') {
            $q->where('kecamatan', $req->input('kecamatan'));
        }
        if ($req->filled('search')) {
            $s = $req->input('search');
            $q->where(fn($x) => $x->where('name', 'like', "%{$s}%")
                ->orWhere('address', 'like', "%{$s}%")
                ->orWhere('kecamatan', 'like', "%{$s}%"));
        }

        $banks = $q->orderBy('name')->get()->map(fn($b) => $this->serializeBank($b));
        return response()->json(['data' => $banks, 'meta' => ['total' => $banks->count()]]);
    }

    public function wasteBank($id)
    {
        $bank = WasteBank::with(['catalog.wasteType'])->findOrFail($id);
        return response()->json(['data' => $this->serializeBank($bank)]);
    }

    public function vendors(Request $req)
    {
        $q = Vendor::with('wasteTypes')->where('is_active', true);
        if ($req->filled('type') && $req->input('type') !== 'Semua') {
            $q->where('type', $req->input('type'));
        }
        if ($req->filled('area') && $req->input('area') !== 'Semua') {
            $q->where('service_area', 'like', '%' . $req->input('area') . '%');
        }
        if ($req->filled('waste_type_id')) {
            $id = (int) $req->input('waste_type_id');
            $q->whereHas('wasteTypes', fn($x) => $x->where('waste_types.id', $id));
        }
        $vendors = $q->orderBy('name')->get()->map(fn($v) => $this->serializeVendor($v));
        return response()->json(['data' => $vendors, 'meta' => ['total' => $vendors->count()]]);
    }

    public function vendor($id)
    {
        $v = Vendor::with('wasteTypes')->findOrFail($id);
        return response()->json(['data' => $this->serializeVendor($v)]);
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
            ->withCount(['prices' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $sources,
            'meta' => ['total' => $sources->count()],
        ]);
    }

    public function externalPrices(Request $req)
    {
        $q = ExternalWastePrice::with('source')
            ->where('is_active', true)
            ->whereHas('source', fn ($source) => $source->where('is_active', true));

        if ($req->filled('source')) {
            $source = $req->input('source');
            $q->whereHas('source', fn ($x) => $x->where('name', $source));
        }
        if ($req->filled('category') && $req->input('category') !== 'Semua') {
            $q->where('category', $req->input('category'));
        }
        if ($req->filled('search')) {
            $s = $req->input('search');
            $q->where(fn ($x) => $x->where('item_name', 'like', "%{$s}%")
                ->orWhere('external_code', 'like', "%{$s}%"));
        }

        $prices = $q->orderBy('category')->orderBy('item_name')->get()->map(fn ($price) => [
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

    private function serializeBank(WasteBank $b): array
    {
        return [
            'id' => $b->id,
            'external_id' => $b->external_id,
            'source_name' => $b->source_name,
            'source_url' => $b->source_url,
            'location_verified_at' => $b->location_verified_at,
            'name' => $b->name,
            'address' => $b->address,
            'kelurahan' => $b->kelurahan,
            'kecamatan' => $b->kecamatan,
            'kota' => $b->kota,
            'lat' => $b->lat,
            'lng' => $b->lng,
            'phone' => $b->phone,
            'whatsapp' => $b->whatsapp,
            'operating_hours' => $b->operating_hours,
            'photo_url' => $b->photo_url,
            'is_active' => $b->is_active,
            'accepted_types' => $b->catalog->map(fn($c) => [
                'waste_type_id' => $c->waste_type_id,
                'name' => $c->wasteType?->name,
                'category' => $c->wasteType?->category,
                'price_per_kg' => (float) $c->price_per_kg,
                'updated_at' => $c->updated_at,
            ])->values(),
        ];
    }

    private function serializeVendor(Vendor $v): array
    {
        return [
            'id' => $v->id,
            'name' => $v->name,
            'type' => $v->type,
            'service_area' => $v->service_area,
            'phone' => $v->phone,
            'whatsapp' => $v->whatsapp,
            'description' => $v->description,
            'photo_url' => $v->photo_url,
            'is_active' => $v->is_active,
            'accepted_waste_types' => $v->wasteTypes->map(fn($w) => [
                'id' => $w->id,
                'name' => $w->name,
                'category' => $w->category,
            ])->values(),
        ];
    }
}
