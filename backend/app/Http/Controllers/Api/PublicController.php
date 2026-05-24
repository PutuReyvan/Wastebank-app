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
}
