<?php

use App\Enums\Permissions\ServicePermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantServicePermission(User $user, ServicePermission $permission): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate($permission->key(), 'web');
    $user->givePermissionTo($perm);
}

it('redirects guests from index to login', function () {
    $response = $this->get(route('services.index'));

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids index for users without view permission', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('services.index'));

    $response->assertForbidden();
});

it('shows index for authorized users', function () {
    $user = User::factory()->create();
    grantServicePermission($user, ServicePermission::VIEW_ANY);

    $response = $this->actingAs($user)->get(route('services.index'));

    $response->assertOk();
});
