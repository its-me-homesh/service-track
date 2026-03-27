<?php

use App\Enums\Permissions\ServicePermission;
use App\Enums\ServiceHistoryEventType;
use App\Models\Customer;
use App\Models\Service;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function serviceStorePayload(array $overrides = []): array
{
    return array_merge([
        'customerId' => null,
        'serviceDate' => '2026-03-10',
        'notes' => 'Routine service',
        'cost' => 199.50,
    ], $overrides);
}

function grantServiceCreatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(ServicePermission::CREATE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('redirects guests to login', function () {
    $response = $this->post(route('services.store'), serviceStorePayload(['customerId' => 1]));

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids authenticated users without create permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $response = $this->actingAs($user)->post(route('services.store'), serviceStorePayload([
        'customerId' => $customer->id,
    ]));

    $response->assertForbidden();
});

it('stores a service for authorized users', function () {
    $user = User::factory()->create();
    grantServiceCreatePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $payload = serviceStorePayload([
        'customerId' => $customer->id,
        'serviceDate' => '2026-03-11',
        'notes' => 'Initial setup',
        'cost' => 250,
    ]);

    $response = $this->actingAs($user)->post(route('services.store'), $payload);

    $response->assertRedirect();

    $this->assertDatabaseHas('services', [
        'customer_id' => $customer->id,
        'service_date' => $payload['serviceDate'],
        'notes' => $payload['notes'],
        'cost' => $payload['cost'],
        'created_by_id' => $user->id,
    ]);

    $service = Service::where('customer_id', $customer->id)->first();

    $this->assertDatabaseHas('service_histories', [
        'service_id' => $service->id,
        'event_type' => ServiceHistoryEventType::CREATED->value,
        'created_by_id' => $user->id,
    ]);
});

it('rejects invalid customer ids', function () {
    $user = User::factory()->create();
    grantServiceCreatePermission($user);

    $payload = serviceStorePayload(['customerId' => 999999]);

    $response = $this->actingAs($user)->post(route('services.store'), $payload);

    $response->assertSessionHasErrors('customerId');
    expect(Service::count())->toBe(0);
});
