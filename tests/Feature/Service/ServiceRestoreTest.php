<?php

use App\Enums\Permissions\ServicePermission;
use App\Enums\ServiceHistoryEventType;
use App\Models\Customer;
use App\Models\Service;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantServiceRestorePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(ServicePermission::RESTORE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('restores service for authorized users', function () {
    $user = User::factory()->create();
    grantServiceRestorePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user);
    $service->delete();

    $response = $this->actingAs($user)->patch(route('services.restore', $service->id));

    $response->assertRedirect();

    $this->assertDatabaseHas('services', [
        'id' => $service->id,
        'deleted_at' => null,
    ]);

    $this->assertDatabaseHas('service_histories', [
        'service_id' => $service->id,
        'event_type' => ServiceHistoryEventType::RESTORED->value,
        'created_by_id' => $user->id,
    ]);
});

it('forbids restore without permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user);
    $service->delete();

    $response = $this->actingAs($user)->patch(route('services.restore', $service->id));

    $response->assertForbidden();
    $this->assertSoftDeleted('services', ['id' => $service->id]);
});
