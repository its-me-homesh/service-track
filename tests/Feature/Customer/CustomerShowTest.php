<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\Customer;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerViewPermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::VIEW->key(), 'web');
    $user->givePermissionTo($perm);
}

it('redirects guests from show to login', function () {
    $response = $this->get(route('customers.view', 1));

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids show for users without view permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('customers.view', $customer->id));

    $response->assertForbidden();
});

it('shows customer for authorized users', function () {
    $user = User::factory()->create();
    grantCustomerViewPermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('customers.view', $customer->id));

    $response->assertOk();
});
