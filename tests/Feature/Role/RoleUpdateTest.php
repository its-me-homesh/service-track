<?php

use App\Enums\Permissions\RolePermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

function grantRoleUpdatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(RolePermission::UPDATE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    app(PermissionRegistrar::class)->forgetCachedPermissions();
});

it('forbids update for users without update permission', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'Original']);
    $permission = Permission::findOrCreate('customer.view-any', 'web');

    $response = $this->actingAs($user)->put(route('roles.update', $role->id), [
        'name' => 'Updated',
        'permissions' => [$permission->id],
    ]);

    $response->assertForbidden();
});

it('updates role and permissions for authorized users', function () {
    $admin = User::factory()->create();
    grantRoleUpdatePermission($admin);

    $role = Role::create(['name' => 'Original']);
    $permission = Permission::findOrCreate('customer.view-any', 'web');
    $role->syncPermissions([$permission->id]);

    $newPermission = Permission::findOrCreate('customer.create', 'web');

    $payload = [
        'name' => 'Updated',
        'permissions' => [$newPermission->id],
    ];

    $response = $this->actingAs($admin)->put(route('roles.update', $role->id), $payload);

    $response->assertRedirect();

    $role->refresh();

    expect($role->name)->toBe('Updated');
    expect($role->hasPermissionTo($newPermission))->toBeTrue();
});
