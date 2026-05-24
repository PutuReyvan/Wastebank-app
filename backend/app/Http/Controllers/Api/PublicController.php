<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
}
