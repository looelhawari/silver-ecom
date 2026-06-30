<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seeds the admin role/permission taxonomy.
 *
 * super-admin additionally bypasses every gate (see AppServiceProvider), so it is
 * granted all permissions here only for clarity in the admin UI. Per-resource
 * permission checks are wired to Filament resources in Phase 3.
 */
class RolesAndPermissionsSeeder extends Seeder
{
    /** Coarse, domain-aligned permissions. Refined per-resource in Phase 3. */
    private const PERMISSIONS = [
        'products.manage',
        'categories.manage',
        'silver-types.manage',
        'orders.manage',
        'custom-orders.manage',
        'payments.manage',
        'shipping.manage',
        'customers.manage',
        'content.manage',
        'support.manage',
        'settings.manage',
        'users.manage',
        'roles.manage',
        'audit-logs.view',
        'reports.view',
    ];

    private const ROLE_PERMISSIONS = [
        'super-admin' => '*',
        'staff' => [
            'orders.manage', 'custom-orders.manage', 'support.manage',
            'customers.manage', 'reports.view',
        ],
        'order-manager' => [
            'orders.manage', 'custom-orders.manage', 'payments.manage',
            'shipping.manage', 'customers.manage', 'reports.view',
        ],
        'content-manager' => [
            'content.manage', 'support.manage',
        ],
        'product-manager' => [
            'products.manage', 'categories.manage', 'silver-types.manage',
        ],
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (self::PERMISSIONS as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // Refresh the registrar cache so freshly-created permissions resolve by name.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (self::ROLE_PERMISSIONS as $roleName => $permissions) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($permissions === '*' ? self::PERMISSIONS : $permissions);
        }
    }
}
