<?php

return [
    'store' => [
        'name' => env('STORE_NAME', 'Fidda Silver'),
        'business_type' => env('STORE_BUSINESS_TYPE', 'jewelry'),
        'slogan' => env('STORE_SLOGAN', 'Egyptian, Italian & Turkish silver — and bespoke pieces made for you.'),
        'currency' => env('STORE_CURRENCY', 'EGP'),
        'locale' => env('STORE_LOCALE', 'en'),
        'direction' => env('STORE_DIRECTION', 'ltr'),
        'logo' => env('STORE_LOGO_PATH', '/brand/logo.svg'),
        'favicon' => env('STORE_FAVICON_PATH', '/favicon.ico'),
    ],

    'contact' => [
        'phone' => env('STORE_PHONE', '+20 100 000 0000'),
        'whatsapp' => env('STORE_WHATSAPP', '+20 100 000 0000'),
        'email' => env('STORE_EMAIL', 'care@fidda-silver.test'),
        'address' => env('STORE_ADDRESS', 'Cairo, Egypt'),
        'working_hours' => env('STORE_WORKING_HOURS', 'Sat–Thu 11:00–21:00'),
        'social_links' => [
            'instagram' => env('STORE_INSTAGRAM_URL'),
            'facebook' => env('STORE_FACEBOOK_URL'),
            'tiktok' => env('STORE_TIKTOK_URL'),
            'x' => env('STORE_X_URL'),
        ],
    ],

    'theme' => [
        'active_preset' => env('STORE_THEME_PRESET', 'silver-luxury'),
        'presets' => [
            'silver-luxury',
            'luxury-gold',
            'minimal-modern',
            'dark-luxury',
        ],
    ],

    'seo' => [
        'title' => env('STORE_SEO_TITLE', 'Fidda Silver — Fine & Custom Silver Jewelry'),
        'description' => env('STORE_SEO_DESCRIPTION', 'Shop Egyptian, Italian, Turkish and local silver jewelry, or request a custom-made piece. Secure checkout, custom design, fast delivery across Egypt.'),
        'keywords' => array_filter(explode(',', env('STORE_SEO_KEYWORDS', 'silver jewelry,egyptian silver,italian silver,turkish silver,custom silver'))),
        'robots' => env('STORE_SEO_ROBOTS', 'index,follow'),
    ],

    'integrations' => [
        'public' => [
            'live_chat_enabled' => env('LIVE_CHAT_ENABLED', false),
            'analytics_enabled' => env('ANALYTICS_ENABLED', false),
            'courier_tracking_enabled' => env('COURIER_TRACKING_ENABLED', false),
        ],
    ],
];
