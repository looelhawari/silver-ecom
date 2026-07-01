<?php

namespace App\Support\Modules;

/**
 * Single source of truth for the modular-monolith module map.
 *
 * Modules with a non-null apiPrefix and an existing Routes/api.php file are
 * auto-registered under /api/v1/{prefix} by the ModuleServiceProvider. A null
 * prefix means the module has no public API routes yet (added in its phase).
 */
final class ModuleRegistry
{
    /**
     * @return array<int, ModuleDefinition>
     */
    public static function all(): array
    {
        $basePath = app_path('Modules');

        return [
            // Foundation
            new ModuleDefinition('Core', 'core', $basePath.'/Core', ''),
            new ModuleDefinition('Access Control', 'access-control', $basePath.'/AccessControl', null),
            new ModuleDefinition('Auth', 'auth', $basePath.'/Auth', null),
            new ModuleDefinition('Users', 'users', $basePath.'/Users', null),

            // Catalog & merchandising (public storefront routes at /api/v1/*)
            new ModuleDefinition('Catalog', 'catalog', $basePath.'/Catalog', ''),

            // Purchase flow
            new ModuleDefinition('Cart', 'cart', $basePath.'/Cart', null),
            new ModuleDefinition('Checkout', 'checkout', $basePath.'/Checkout', ''),
            new ModuleDefinition('Orders', 'orders', $basePath.'/Orders', ''),
            new ModuleDefinition('Payments', 'payments', $basePath.'/Payments', null),
            new ModuleDefinition('Shipping', 'shipping', $basePath.'/Shipping', null),

            // Silver-specific
            new ModuleDefinition('Custom Orders', 'custom-orders', $basePath.'/CustomOrders', ''),

            // Customer extras (optional)
            new ModuleDefinition('Wishlist', 'wishlist', $basePath.'/Wishlist', null),

            // Content, support & ops
            new ModuleDefinition('Content', 'content', $basePath.'/Content', ''),
            new ModuleDefinition('Support', 'support', $basePath.'/Support', ''),
            new ModuleDefinition('Media', 'media', $basePath.'/Media', null),
            new ModuleDefinition('Audit Logs', 'audit-logs', $basePath.'/AuditLogs', null),
            new ModuleDefinition('Settings', 'settings', $basePath.'/Settings', 'storefront'),
        ];
    }
}
