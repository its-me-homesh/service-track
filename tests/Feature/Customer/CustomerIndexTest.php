<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerPermission(User $user, CustomerPermission $permission): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate($permission->key(), 'web');
    $user->givePermissionTo($perm);
}

it('redirects guests from index to login', function () {
    $response = $this->get(route('customers.index'));

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids index for users without view permission', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('customers.index'));

    $response->assertForbidden();
});

it('shows index for authorized users', function () {
    $user = User::factory()->create();
    grantCustomerPermission($user, CustomerPermission::VIEW_ANY);

    $response = $this->actingAs($user)->get(route('customers.index'));

    $response->assertOk();
});
