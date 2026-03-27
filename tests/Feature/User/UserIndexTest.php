<?php

use App\Enums\Permissions\UserPermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantUserPermission(User $user, UserPermission $permission): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate($permission->key(), 'web');
    $user->givePermissionTo($perm);
}

it('redirects guests from index to login', function () {
    $response = $this->get(route('users.index'));

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids index for users without view permission', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('users.index'));

    $response->assertForbidden();
});

it('shows index for authorized users', function () {
    $user = User::factory()->create();
    grantUserPermission($user, UserPermission::VIEW_ANY);

    $response = $this->actingAs($user)->get(route('users.index'));

    $response->assertOk();
});
