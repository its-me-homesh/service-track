<?php

use App\Enums\Permissions\ServicePermission;
use App\Enums\ServiceHistoryEventType;
use App\Enums\ServiceStatus;
use App\Models\Customer;
use App\Models\Service;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantServiceUpdatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(ServicePermission::UPDATE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('forbids update for users without update permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->put(route('services.update', $service->id), [
        'serviceDate' => '2026-03-12',
    ]);

    $response->assertForbidden();
});

it('updates service details and logs history', function () {
    $user = User::factory()->create();
    grantServiceUpdatePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
        'service_date' => '2026-03-01',
        'notes' => 'Old notes',
        'cost' => 100,
        'status' => ServiceStatus::PENDING->value,
    ]);

    $payload = [
        'serviceDate' => '2026-03-15',
        'notes' => 'Updated notes',
        'cost' => 200,
        'changeStatus' => false,
    ];

    $response = $this->actingAs($user)->put(route('services.update', $service->id), $payload);

    $response->assertRedirect();

    $this->assertDatabaseHas('services', [
        'id' => $service->id,
        'service_date' => $payload['serviceDate'],
        'notes' => $payload['notes'],
        'cost' => $payload['cost'],
    ]);

    $this->assertDatabaseHas('service_histories', [
        'service_id' => $service->id,
        'event_type' => ServiceHistoryEventType::UPDATED->value,
        'created_by_id' => $user->id,
    ]);
});

it('rejects invalid status transitions during update', function () {
    $user = User::factory()->create();
    grantServiceUpdatePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
        'status' => ServiceStatus::PENDING->value,
    ]);

    $response = $this->actingAs($user)->put(route('services.update', $service->id), [
        'serviceDate' => '2026-03-12',
        'changeStatus' => true,
        'status' => ServiceStatus::COMPLETED->value,
    ]);

    $response->assertSessionHasErrors('status');
});
