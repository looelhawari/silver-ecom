<?php

namespace App\Modules\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CustomOrders\Http\Resources\CustomOrderRequestResource;
use App\Modules\Orders\Http\Resources\OrderResource;
use App\Modules\Users\Http\Requests\UpdatePasswordRequest;
use App\Modules\Users\Http\Requests\UpdateProfileRequest;
use App\Modules\Users\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request): UserResource
    {
        return UserResource::make($request->user());
    }

    public function update(UpdateProfileRequest $request): UserResource
    {
        $request->user()->update($request->validated());

        return UserResource::make($request->user());
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $request->user()->update(['password' => Hash::make($request->validated()['password'])]);

        return response()->json(['message' => 'Password updated.']);
    }

    public function orders(Request $request)
    {
        $orders = $request->user()->orders()
            ->with(['items', 'paymentMethod', 'statusHistory'])
            ->latest()
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    public function customRequests(Request $request)
    {
        $requests = $request->user()->customOrderRequests()
            ->with(['silverType', 'quote', 'images'])
            ->latest()
            ->paginate(10);

        return CustomOrderRequestResource::collection($requests);
    }
}
