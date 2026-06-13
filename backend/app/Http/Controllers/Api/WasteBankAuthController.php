<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WasteBank;
use App\Models\WasteBankCatalog;
use App\Models\WasteBankUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class WasteBankAuthController extends Controller
{
    public function login(Request $req)
    {
        $req->validate(['email' => 'required|email', 'password' => 'required']);
        $user = WasteBankUser::where('email', $req->input('email'))->first();
        if (!$user || !Hash::check($req->input('password'), $user->password)) {
            throw ValidationException::withMessages(['email' => 'Email atau kata sandi salah']);
        }
        $token = $user->createToken('waste_bank')->plainTextToken;
        $bank = WasteBank::with('catalog.wasteType')->find($user->waste_bank_id);
        return response()->json([
            'data' => [
                'token' => $token,
                'waste_bank_id' => $user->waste_bank_id,
                'bank' => app(PublicController::class)->wasteBank($user->waste_bank_id)->getData()->data,
            ],
        ]);
    }

    public function logout(Request $req)
    {
        $req->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function profile(Request $req)
    {
        $user = $req->user();
        $bank = WasteBank::findOrFail($user->waste_bank_id);
        $bank->fill($req->only([
            'name', 'address', 'kelurahan', 'kecamatan', 'kota',
            'lat', 'lng', 'phone', 'whatsapp', 'operating_hours', 'photo_url',
        ]));
        $bank->save();
        return response()->json(['data' => app(PublicController::class)->wasteBank($bank->id)->getData()->data]);
    }

    public function catalog(Request $req)
    {
        $req->validate([
            'catalog' => 'array',
            'catalog.*.waste_type_id' => 'required|integer',
            'catalog.*.price_per_kg' => 'required|numeric|min:0',
        ]);
        $user = $req->user();
        $bankId = $user->waste_bank_id;

        // Replace strategy: delete all then re-create
        WasteBankCatalog::where('waste_bank_id', $bankId)->delete();
        foreach ($req->input('catalog', []) as $row) {
            WasteBankCatalog::create([
                'waste_bank_id' => $bankId,
                'waste_type_id' => $row['waste_type_id'],
                'price_per_kg' => $row['price_per_kg'],
            ]);
        }
        return response()->json(['data' => app(PublicController::class)->wasteBank($bankId)->getData()->data]);
    }
}
