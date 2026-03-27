<?php

use App\Enums\Permissions\ServicePermission;
use App\Models\Customer;
use App\Models\Service;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantServiceViewPermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(ServicePermission::VIEW->key(), 'web');
    $user->givePermissionTo($perm);
}

it('redirects guests from show to login', function () {
    $response = $this->get(route('services.view', 1));

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids show for users without view permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->get(route('services.view', $service->id));

    $response->assertForbidden();
});

it('shows service for authorized users', function () {
    $user = User::factory()->create();
    grantServiceViewPermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $service = Service::factory()->create([
        'customer_id' => $customer->id,
        'created_by_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->get(route('services.view', $service->id));

    $response->assertOk();
});
