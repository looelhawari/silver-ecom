<?php

return [
    'public' => [
        'wishlist' => env('FEATURE_WISHLIST', true),
        'custom_orders' => env('FEATURE_CUSTOM_ORDERS', true),
        'guest_checkout' => env('FEATURE_GUEST_CHECKOUT', true),
        'order_tracking' => env('FEATURE_ORDER_TRACKING', true),
        'live_chat' => env('FEATURE_LIVE_CHAT', false),
        // Off-spec for the silver MVP — kept as flags for optional future use.
        'compare' => env('FEATURE_COMPARE', false),
        'reviews' => env('FEATURE_REVIEWS', false),
    ],

    'admin' => [
        'reports' => env('FEATURE_ADMIN_REPORTS', true),
        'audit_logs' => env('FEATURE_AUDIT_LOGS', true),
        'import_export' => env('FEATURE_IMPORT_EXPORT', false),
    ],
];
