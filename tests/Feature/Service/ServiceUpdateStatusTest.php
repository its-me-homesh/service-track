<?php

use App\Enums\Permissions\ServicePermission;
use App\Enums\ServiceHistoryEventType;
use App\Enums\ServiceStatus;
use App\Models\Customer;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantServiceUpdateStatusPermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(ServicePermission::UPDATE_STATUS->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('forbids status updates for users without permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->patch(route('services.update-service-status', $service->id), [
        'status' => ServiceStatus::COMPLETED->value,
    ]);

    $response->assertForbidden();
});

it('updates status and refreshes customer schedule when completed', function () {
    $user = User::factory()->create();
    grantServiceUpdateStatusPermission($user);

    $customer = Customer::factory()->create([
        'created_by_id' => $user->id,
        'service_interval' => 30,
        'installation_date' => '2026-03-01',
    ]);

    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
        'service_date' => '2026-03-10',
        'status' => ServiceStatus::IN_PROGRESS->value,
    ]);

    $response = $this->actingAs($user)->patch(route('services.update-service-status', $service->id), [
        'status' => ServiceStatus::COMPLETED->value,
        'notes' => 'Done',
    ]);

    $response->assertRedirect();

    $expectedNextServiceDate = Carbon::createFromFormat('Y-m-d', $service->service_date)
        ->addDays($customer->service_interval)
        ->format('Y-m-d');

    $this->assertDatabaseHas('services', [
        'id' => $service->id,
        'status' => ServiceStatus::COMPLETED->value,
        'notes' => 'Done',
    ]);

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'last_service_date' => $service->service_date,
        'next_service_date' => $expectedNextServiceDate,
    ]);

    $this->assertDatabaseHas('service_histories', [
        'service_id' => $service->id,
        'event_type' => ServiceHistoryEventType::STATUS_CHANGED->value,
        'created_by_id' => $user->id,
    ]);
});
