<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Catalog\Models\Product;
use App\Modules\CustomOrders\Actions\ConvertToOrder;
use App\Modules\CustomOrders\Models\CustomOrderRequest;
use App\Modules\Orders\Enums\PaymentStatus;
use App\Modules\Payments\Models\PaymentMethod;
use Database\Seeders\CategorySeeder;
use Database\Seeders\PaymentMethodSeeder;
use Database\Seeders\ProductSeeder;
use Database\Seeders\SilverTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccountAndWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([SilverTypeSeeder::class, CategorySeeder::class, ProductSeeder::class, PaymentMethodSeeder::class]);
    }

    public function test_register_login_me(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Nour', 'email' => 'nour@test.dev',
            'password' => 'password123', 'password_confirmation' => 'password123',
        ])->assertCreated()->assertJsonStructure(['data' => ['token', 'user' => ['email']]]);

        $login = $this->postJson('/api/v1/auth/login', ['email' => 'nour@test.dev', 'password' => 'password123'])
            ->assertOk();
        $token = $login->json('data.token');

        // No token → unauthorized.
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();

        // With token → the current user.
        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me')->assertOk()->assertJsonPath('data.email', 'nour@test.dev');
    }

    public function test_profile_and_password(): void
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['name' => 'Renamed', 'email' => $user->email, 'phone' => '0100'])
            ->assertOk()->assertJsonPath('data.name', 'Renamed');

        $this->patchJson('/api/v1/profile/password', [
            'current_password' => 'oldpassword', 'password' => 'newpassword1', 'password_confirmation' => 'newpassword1',
        ])->assertOk();
    }

    public function test_address_crud_blocks_other_users(): void
    {
        $a = User::factory()->create();
        $b = User::factory()->create();

        Sanctum::actingAs($a);
        $address = $this->postJson('/api/v1/addresses', [
            'full_name' => 'A', 'phone' => '0100', 'city' => 'Cairo', 'address_line' => '1 St',
        ])->assertCreated()->json('data.id');

        $this->getJson('/api/v1/addresses')->assertOk()->assertJsonCount(1, 'data');

        // User B cannot delete A's address (IDOR).
        Sanctum::actingAs($b);
        $this->deleteJson("/api/v1/addresses/{$address}")->assertNotFound();
    }

    public function test_wishlist_add_and_remove(): void
    {
        $user = User::factory()->create();
        $product = Product::first();
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/wishlist/{$product->id}")->assertCreated();
        $this->getJson('/api/v1/wishlist')->assertOk()->assertJsonCount(1, 'data');
        $this->deleteJson("/api/v1/wishlist/{$product->id}")->assertOk();
        $this->getJson('/api/v1/wishlist')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_payment_proof_upload_marks_proof_uploaded(): void
    {
        Storage::fake('public');
        $product = Product::first();
        $method = PaymentMethod::where('code', 'vodafone_cash')->first();

        $code = $this->postJson('/api/v1/checkout/place-order', [
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
            'customer_name' => 'X', 'customer_phone' => '01000000000',
            'payment_method_id' => $method->id,
            'shipping_address' => ['full_name' => 'X', 'phone' => '01000000000', 'city' => 'Cairo', 'address_line' => 'A'],
        ])->assertCreated()->json('data.order_code');

        $this->postJson("/api/v1/orders/{$code}/payment-proof", [
            'phone' => '01000000000',
            'file' => UploadedFile::fake()->image('proof.jpg'),
        ])->assertCreated();

        $this->postJson('/api/v1/orders/track', ['order_code' => $code, 'phone' => '01000000000'])
            ->assertOk()->assertJsonPath('data.payment_status.value', PaymentStatus::ProofUploaded->value);
    }

    public function test_customer_accepts_quote(): void
    {
        $request = CustomOrderRequest::create([
            'request_code' => 'CR-TEST-00001', 'name' => 'Mona', 'phone' => '01111111111',
            'description' => 'A ring', 'status' => 'quoted',
        ]);
        $request->quote()->create(['final_quote' => 1500, 'status' => 'sent']);

        $this->postJson('/api/v1/custom-requests/CR-TEST-00001/accept-quote', ['phone' => '01111111111'])
            ->assertOk()->assertJsonPath('data.status.value', 'customer_accepted');

        $this->assertDatabaseHas('custom_order_quotes', ['custom_order_request_id' => $request->id, 'status' => 'accepted']);
    }

    public function test_admin_converts_request_to_order(): void
    {
        $request = CustomOrderRequest::create([
            'request_code' => 'CR-TEST-00002', 'name' => 'Ali', 'phone' => '01222222222',
            'description' => 'A bracelet', 'status' => 'approved',
        ]);
        $request->quote()->create(['final_quote' => 2200, 'status' => 'accepted']);

        $order = app(ConvertToOrder::class)->handle($request->fresh(['quote']));

        $this->assertEquals(2200, (float) $order->total);
        $this->assertDatabaseHas('custom_order_requests', ['id' => $request->id, 'order_id' => $order->id, 'status' => 'converted_to_order']);
        $this->assertDatabaseCount('order_items', 1);
    }
}
