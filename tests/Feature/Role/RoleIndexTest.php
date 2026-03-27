<?php

use App\Enums\Permissions\RolePermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantRolePermission(User $user, RolePermission $permission): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate($permission->key(), 'web');
    $user->givePermissionTo($perm);
}

it('redirects guests from index to login', function () {
    $response = $this->get(route('roles.index'));

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids index for users without view permission', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('roles.index'));

    $response->assertForbidden();
});

it('shows index for authorized users', function () {
    $user = User::factory()->create();
    grantRolePermission($user, RolePermission::VIEW_ANY);

    $response = $this->actingAs($user)->get(route('roles.index'));

    $response->assertOk();
});
