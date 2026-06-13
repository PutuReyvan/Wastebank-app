<?php

return [
    'defaults' => [
        'guard' => env('AUTH_GUARD', 'admin'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'admins'),
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'admins',
        ],
        'admin' => [
            'driver' => 'session',
            'provider' => 'admins',
        ],
        'admin_sanctum' => [
            'driver' => 'sanctum',
            'provider' => 'admins',
        ],
        'waste_bank' => [
            'driver' => 'sanctum',
            'provider' => 'waste_bank_users',
        ],
    ],

    'providers' => [
        'admins' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', App\Models\Admin::class),
        ],
        'waste_bank_users' => [
            'driver' => 'eloquent',
            'model' => App\Models\WasteBankUser::class,
        ],
    ],

    'passwords' => [
        'admins' => [
            'provider' => 'admins',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),
];
