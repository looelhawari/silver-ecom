<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Renders every Filament resource list + create page as the super-admin to catch
 * form/table/schema configuration errors (which route:list cannot detect).
 */
class AdminPanelSmokeTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.dev',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('super-admin');

        return $admin;
    }

    public function test_dashboard_and_resource_list_pages_render(): void
    {
        $this->actingAs($this->admin());

        $lists = [
            '/admin',
            '/admin/products', '/admin/categories', '/admin/silver-types',
            '/admin/orders', '/admin/custom-order-requests', '/admin/payment-methods',
            '/admin/users', '/admin/support-messages',
            '/admin/pages', '/admin/faqs', '/admin/banners',
            '/admin/audit-logs', '/admin/manage-store-settings',
        ];

        foreach ($lists as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_customer_edit_page_with_relations_renders(): void
    {
        $this->actingAs($this->admin());

        $customer = User::create([
            'name' => 'Customer',
            'email' => 'c@test.dev',
            'password' => Hash::make('password'),
        ]);

        // Renders the Users form + Orders/CustomRequests/AdminNotes relation managers.
        $this->get("/admin/users/{$customer->id}/edit")->assertOk();
    }

    public function test_resource_create_forms_render(): void
    {
        $this->actingAs($this->admin());

        $creates = [
            '/admin/products/create', '/admin/categories/create', '/admin/silver-types/create',
            '/admin/payment-methods/create', '/admin/custom-order-requests/create',
            '/admin/pages/create', '/admin/faqs/create', '/admin/banners/create',
        ];

        foreach ($creates as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_customer_cannot_access_admin(): void
    {
        $customer = User::create([
            'name' => 'Customer',
            'email' => 'customer@test.dev',
            'password' => Hash::make('password'),
        ]);

        $this->actingAs($customer)->get('/admin')->assertForbidden();
    }
}
