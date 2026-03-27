<?php

use App\Enums\Permissions\ServicePermission;
use App\Enums\ServiceHistoryEventType;
use App\Models\Customer;
use App\Models\Service;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantServiceDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(ServicePermission::DELETE->key(), 'web');
    $user->givePermissionTo($perm);
}

function grantServiceForceDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(ServicePermission::FORCE_DELETE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('soft deletes service when type is soft', function () {
    $user = User::factory()->create();
    grantServiceDeletePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->delete(route('services.delete', $service->id), [
        'type' => 'soft',
    ]);

    $response->assertRedirect();

    $this->assertSoftDeleted('services', ['id' => $service->id]);
    expect(Service::withTrashed()->find($service->id)->deleted_by_id)->toBe($user->id);

    $this->assertDatabaseHas('service_histories', [
        'service_id' => $service->id,
        'event_type' => ServiceHistoryEventType::DELETED->value,
        'created_by_id' => $user->id,
    ]);
});

it('force deletes service when type is permanent', function () {
    $user = User::factory()->create();
    grantServiceDeletePermission($user);
    grantServiceForceDeletePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->delete(route('services.delete', $service->id), [
        'type' => 'permanent',
    ]);

    $response->assertRedirect(route('services.index'));

    $this->assertDatabaseMissing('services', ['id' => $service->id]);
    $this->assertDatabaseMissing('service_histories', [
        'service_id' => $service->id,
        'event_type' => ServiceHistoryEventType::DELETED->value,
    ]);
});

it('forbids permanent deletion without force delete permission', function () {
    $user = User::factory()->create();
    grantServiceDeletePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->delete(route('services.delete', $service->id), [
        'type' => 'permanent',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseHas('services', ['id' => $service->id]);
});
