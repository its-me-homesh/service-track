<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerUpdateServiceSchedulePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::UPDATE_SERVICE_SCHEDULE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('forbids schedule updates for users without permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create([
        'created_by_id' => $user->id,
        'service_interval' => 30,
        'installation_date' => '2026-03-01',
    ]);

    $response = $this->actingAs($user)->patch(route('customers.update-service-schedule', $customer->id), [
        'lastServiceDate' => '2026-03-10',
        'autoCalculateNextServiceDate' => true,
        'nextServiceDate' => null,
    ]);

    $response->assertForbidden();
});

it('auto calculates next_service_date when enabled', function () {
    $user = User::factory()->create();
    grantCustomerUpdateServiceSchedulePermission($user);

    $customer = Customer::factory()->create([
        'created_by_id' => $user->id,
        'service_interval' => 30,
        'installation_date' => '2026-03-01',
    ]);

    $payload = [
        'lastServiceDate' => '2026-03-10',
        'autoCalculateNextServiceDate' => true,
        'nextServiceDate' => null,
    ];

    $response = $this->actingAs($user)->patch(route('customers.update-service-schedule', $customer->id), $payload);

    $response->assertRedirect();

    $expectedNextServiceDate = Carbon::createFromFormat('Y-m-d', $payload['lastServiceDate'])
        ->addDays($customer->service_interval)
        ->format('Y-m-d');

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'last_service_date' => $payload['lastServiceDate'],
        'next_service_date' => $expectedNextServiceDate,
    ]);
});

it('requires nextServiceDate when auto calculation is disabled', function () {
    $user = User::factory()->create();
    grantCustomerUpdateServiceSchedulePermission($user);

    $customer = Customer::factory()->create([
        'created_by_id' => $user->id,
        'service_interval' => 30,
        'installation_date' => '2026-03-01',
    ]);

    $response = $this->actingAs($user)->patch(route('customers.update-service-schedule', $customer->id), [
        'lastServiceDate' => '2026-03-10',
        'autoCalculateNextServiceDate' => false,
        'nextServiceDate' => null,
    ]);

    $response->assertSessionHasErrors('nextServiceDate');
});

it('updates next_service_date when auto calculation is disabled', function () {
    $user = User::factory()->create();
    grantCustomerUpdateServiceSchedulePermission($user);

    $customer = Customer::factory()->create([
        'created_by_id' => $user->id,
        'service_interval' => 30,
        'installation_date' => '2026-03-01',
    ]);

    $payload = [
        'lastServiceDate' => '2026-03-10',
        'autoCalculateNextServiceDate' => false,
        'nextServiceDate' => '2026-04-01',
    ];

    $response = $this->actingAs($user)->patch(route('customers.update-service-schedule', $customer->id), $payload);

    $response->assertRedirect();

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'last_service_date' => $payload['lastServiceDate'],
        'next_service_date' => $payload['nextServiceDate'],
    ]);
});
