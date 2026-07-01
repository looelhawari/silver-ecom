<?php

namespace Tests\Feature;

use App\Modules\Catalog\Models\Product;
use App\Modules\Payments\Models\PaymentMethod;
use Database\Seeders\CategorySeeder;
use Database\Seeders\PaymentMethodSeeder;
use Database\Seeders\ProductSeeder;
use Database\Seeders\SilverTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([SilverTypeSeeder::class, CategorySeeder::class, ProductSeeder::class, PaymentMethodSeeder::class]);
    }

    public function test_products_list_is_paginated(): void
    {
        $this->getJson('/api/v1/products')
            ->assertOk()
            ->assertJsonStructure(['data' => [['id', 'name', 'slug', 'price', 'in_stock']], 'meta' => ['total', 'current_page']]);
    }

    public function test_product_detail_returns_related(): void
    {
        $product = Product::first();

        $this->getJson("/api/v1/products/{$product->slug}")
            ->assertOk()
            ->assertJsonPath('data.slug', $product->slug)
            ->assertJsonStructure(['data' => ['id', 'name', 'price', 'variants', 'images'], 'meta' => ['related']]);
    }

    public function test_checkout_validate_computes_totals_server_side(): void
    {
        $product = Product::first();

        $response = $this->postJson('/api/v1/checkout/validate', [
            'items' => [['product_id' => $product->id, 'quantity' => 2]],
        ])->assertOk()->assertJsonPath('data.currency', 'EGP');

        $this->assertEqualsWithDelta(
            round((float) $product->final_price * 2, 2),
            (float) $response->json('data.subtotal'),
            0.01,
        );
    }

    public function test_place_order_and_track(): void
    {
        $product = Product::first();
        $method = PaymentMethod::where('code', 'cod')->first();

        $response = $this->postJson('/api/v1/checkout/place-order', [
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
            'customer_name' => 'Test Buyer',
            'customer_phone' => '01000000000',
            'payment_method_id' => $method->id,
            'shipping_address' => [
                'full_name' => 'Test Buyer', 'phone' => '01000000000',
                'city' => 'Cairo', 'address_line' => '1 Nile St',
            ],
        ])->assertCreated();

        $code = $response->json('data.order_code');
        $this->assertNotEmpty($code);

        // Correct phone succeeds.
        $this->postJson('/api/v1/orders/track', ['order_code' => $code, 'phone' => '01000000000'])
            ->assertOk()
            ->assertJsonPath('data.order_code', $code);

        // Wrong phone is rejected (no IDOR via order code alone).
        $this->postJson('/api/v1/orders/track', ['order_code' => $code, 'phone' => '09999999999'])
            ->assertNotFound();
    }

    public function test_place_order_rejects_out_of_stock(): void
    {
        $product = Product::first();
        $product->update(['stock_quantity' => 1]);
        $method = PaymentMethod::where('code', 'cod')->first();

        $this->postJson('/api/v1/checkout/place-order', [
            'items' => [['product_id' => $product->id, 'quantity' => 5]],
            'customer_name' => 'X', 'customer_phone' => '01000000000',
            'payment_method_id' => $method->id,
            'shipping_address' => ['full_name' => 'X', 'phone' => '01000000000', 'city' => 'Cairo', 'address_line' => 'A'],
        ])->assertStatus(422);
    }

    public function test_custom_request_submit_and_track(): void
    {
        $response = $this->postJson('/api/v1/custom-requests', [
            'name' => 'Mona', 'phone' => '01111111111',
            'description' => 'A custom name necklace in Italian silver.',
        ])->assertCreated();

        $code = $response->json('data.request_code');

        $this->postJson('/api/v1/custom-requests/track', ['request_code' => $code, 'phone' => '01111111111'])
            ->assertOk()
            ->assertJsonPath('data.request_code', $code);

        $this->postJson('/api/v1/custom-requests/track', ['request_code' => $code, 'phone' => '02222222222'])
            ->assertNotFound();
    }

    public function test_contact_message_is_stored(): void
    {
        $this->postJson('/api/v1/contact', ['name' => 'Sara', 'message' => 'Do you ship to Alexandria?'])
            ->assertCreated();

        $this->assertDatabaseHas('support_messages', ['name' => 'Sara', 'status' => 'new']);
    }
}
