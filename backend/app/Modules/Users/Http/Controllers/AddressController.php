<?php

namespace App\Modules\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Users\Http\Requests\StoreAddressRequest;
use App\Modules\Users\Http\Resources\UserAddressResource;
use App\Modules\Users\Models\UserAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return UserAddressResource::collection($request->user()->addresses()->latest()->get());
    }

    public function store(StoreAddressRequest $request): UserAddressResource
    {
        $address = $request->user()->addresses()->create($request->validated());

        return UserAddressResource::make($address);
    }

    public function update(StoreAddressRequest $request, UserAddress $address): UserAddressResource
    {
        $this->authorizeOwner($request, $address);
        $address->update($request->validated());

        return UserAddressResource::make($address);
    }

    public function destroy(Request $request, UserAddress $address): JsonResponse
    {
        $this->authorizeOwner($request, $address);
        $address->delete();

        return response()->json(['message' => 'Address removed.']);
    }

    /** Prevent editing another customer's address (IDOR). */
    private function authorizeOwner(Request $request, UserAddress $address): void
    {
        abort_unless($address->user_id === $request->user()->id, 404);
    }
}
