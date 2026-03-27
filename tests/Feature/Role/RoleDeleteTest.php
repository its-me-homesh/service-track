<?php

use App\Enums\Permissions\RolePermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

function grantRoleDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(RolePermission::DELETE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('deletes role for authorized users', function () {
    $admin = User::factory()->create();
    grantRoleDeletePermission($admin);

    $role = Role::create(['name' => 'ToDelete']);

    $response = $this->actingAs($admin)->delete(route('roles.delete', $role->id));

    $response->assertRedirect();

    $this->assertDatabaseMissing('roles', ['id' => $role->id]);
});

it('forbids delete without permission', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'ToDelete']);

    $response = $this->actingAs($user)->delete(route('roles.delete', $role->id));

    $response->assertForbidden();
    $this->assertDatabaseHas('roles', ['id' => $role->id]);
});
