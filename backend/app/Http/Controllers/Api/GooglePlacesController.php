<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class GooglePlacesController extends Controller
{
    private const JAKARTA_BARAT_CENTER = [
        'latitude' => -6.1683,
        'longitude' => 106.7588,
    ];

    private const JAKARTA_BARAT_BOUNDS = [
        'low' => [
            'latitude' => -6.2550,
            'longitude' => 106.6750,
        ],
        'high' => [
            'latitude' => -6.0750,
            'longitude' => 106.8350,
        ],
    ];

    public function wasteBanks(Request $request)
    {
        $key = config('services.google_maps.key');
        if (! $key) {
            return response()->json([
                'message' => 'GOOGLE_MAPS_API_KEY is not configured on the backend.',
            ], 500);
        }

        $lat = $request->filled('lat') ? (float) $request->input('lat') : null;
        $lng = $request->filled('lng') ? (float) $request->input('lng') : null;
        $radius = min(max((int) $request->input('radius', 10000), 1000), 50000);
        $query = trim((string) $request->input('search', 'bank sampah'));
        $area = trim((string) $request->input('area', 'Jakarta Barat'));

        $payload = [
            'textQuery' => trim("{$query} {$area}"),
            'languageCode' => 'id',
            'regionCode' => 'ID',
            'maxResultCount' => 20,
        ];

        if ($lat !== null && $lng !== null) {
            $payload['locationBias'] = [
                'circle' => [
                    'center' => [
                        'latitude' => $lat,
                        'longitude' => $lng,
                    ],
                    'radius' => $radius,
                ],
            ];
        } else {
            $payload['locationRestriction'] = [
                'rectangle' => self::JAKARTA_BARAT_BOUNDS,
            ];
        }

        $caBundle = storage_path('app/certs/cacert.pem');

        try {
            $response = Http::timeout(12)
                ->when(is_file($caBundle), fn ($request) => $request->withOptions(['verify' => $caBundle]))
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-Goog-Api-Key' => $key,
                    'X-Goog-FieldMask' => implode(',', [
                        'places.id',
                        'places.displayName',
                        'places.formattedAddress',
                        'places.location',
                        'places.googleMapsUri',
                        'places.nationalPhoneNumber',
                        'places.rating',
                        'places.businessStatus',
                    ]),
                ])
                ->post('https://places.googleapis.com/v1/places:searchText', $payload);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Tidak bisa terhubung ke Google Places API.',
                'detail' => $exception->getMessage(),
            ], 502);
        }

        if (! $response->successful()) {
            return response()->json([
                'message' => 'Google Places request failed.',
                'status' => $response->status(),
                'google_response' => $response->json(),
            ], 502);
        }

        $places = collect($response->json('places', []))
            ->map(fn (array $place, int $index) => $this->serializePlace($place, $index, $lat, $lng))
            ->filter()
            ->filter(fn (array $place) => $this->isInsideWestJakartaBounds($place['lat'], $place['lng']))
            ->filter(fn (array $place) => $this->isRelevantWasteBank($place['name'], $place['address']))
            ->values();

        if ($lat !== null && $lng !== null) {
            $places = $places
                ->sortBy(fn ($place) => $place['distance_km'] ?? INF)
                ->values();
        } else {
            $places = $places
                ->sortBy(function ($place) {
                    $addressRank = $this->addressLooksLikeWestJakarta($place['address']) ? 0 : 1;
                    $centerDistance = $this->distanceKm(
                        self::JAKARTA_BARAT_CENTER['latitude'],
                        self::JAKARTA_BARAT_CENTER['longitude'],
                        $place['lat'],
                        $place['lng'],
                    );

                    return sprintf('%d-%09.4f', $addressRank, $centerDistance);
                })
                ->values();
        }

        return response()->json([
            'data' => $places,
            'meta' => [
                'total' => $places->count(),
                'source' => 'google_places',
                'query' => $payload['textQuery'],
                'area' => $area,
                'restricted_to' => 'Jakarta Barat',
                'radius' => $lat !== null && $lng !== null ? $radius : null,
            ],
        ]);
    }

    private function serializePlace(array $place, int $index, ?float $originLat, ?float $originLng): ?array
    {
        $location = $place['location'] ?? null;
        if (! isset($location['latitude'], $location['longitude'])) {
            return null;
        }

        $lat = (float) $location['latitude'];
        $lng = (float) $location['longitude'];
        $name = $place['displayName']['text'] ?? 'Bank Sampah';

        return [
            'id' => 'google-' . ($place['id'] ?? $index),
            'external_id' => $place['id'] ?? null,
            'source_name' => 'Google Places',
            'source_url' => $place['googleMapsUri'] ?? null,
            'name' => $name,
            'address' => $place['formattedAddress'] ?? '',
            'kelurahan' => null,
            'kecamatan' => $this->extractKecamatan($place['formattedAddress'] ?? ''),
            'kota' => 'Jakarta Barat',
            'lat' => $lat,
            'lng' => $lng,
            'phone' => $place['nationalPhoneNumber'] ?? null,
            'whatsapp' => null,
            'operating_hours' => $this->formatBusinessStatus($place['businessStatus'] ?? null),
            'photo_url' => null,
            'is_active' => ($place['businessStatus'] ?? null) !== 'CLOSED_PERMANENTLY',
            'rating' => $place['rating'] ?? null,
            'google_maps_uri' => $place['googleMapsUri'] ?? null,
            'distance_km' => $originLat !== null && $originLng !== null
                ? $this->distanceKm($originLat, $originLng, $lat, $lng)
                : null,
            'accepted_types' => [],
        ];
    }

    private function isInsideWestJakartaBounds(float $lat, float $lng): bool
    {
        return $lat >= self::JAKARTA_BARAT_BOUNDS['low']['latitude']
            && $lat <= self::JAKARTA_BARAT_BOUNDS['high']['latitude']
            && $lng >= self::JAKARTA_BARAT_BOUNDS['low']['longitude']
            && $lng <= self::JAKARTA_BARAT_BOUNDS['high']['longitude'];
    }

    private function addressLooksLikeWestJakarta(string $address): bool
    {
        $normalized = mb_strtolower($address);

        return str_contains($normalized, 'jakarta barat')
            || str_contains($normalized, 'west jakarta');
    }

    private function extractKecamatan(string $address): ?string
    {
        if (preg_match('/Kec\.\s*([^,]+)/i', $address, $matches)) {
            return trim($matches[1]);
        }

        if (preg_match('/Kecamatan\s+([^,]+)/i', $address, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    private function isRelevantWasteBank(string $name, string $address): bool
    {
        $text = mb_strtolower($name . ' ' . $address);
        $positiveKeywords = [
            'bank sampah',
            'banksampah',
            'bank-sampah',
            'tps 3r',
            'bsu ',
        ];
        $negativeKeywords = [
            'jual tempat sampah',
            'tong sampah',
            'tempat sampah',
            'trash bin',
        ];

        foreach ($negativeKeywords as $keyword) {
            if (str_contains($text, $keyword)) {
                return false;
            }
        }

        foreach ($positiveKeywords as $keyword) {
            if (str_contains($text, $keyword)) {
                return true;
            }
        }

        return false;
    }

    private function formatBusinessStatus(?string $status): string
    {
        return match ($status) {
            'OPERATIONAL' => 'Terdaftar di Google Maps',
            'CLOSED_TEMPORARILY' => 'Tutup sementara menurut Google Maps',
            'CLOSED_PERMANENTLY' => 'Tutup permanen menurut Google Maps',
            default => 'Jam operasional belum tersedia',
        };
    }

    private function distanceKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $radius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return $radius * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
