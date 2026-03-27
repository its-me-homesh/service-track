<?php

use App\Enums\Permissions\UserPermission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

function grantUserUpdatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(UserPermission::UPDATE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    app(PermissionRegistrar::class)->forgetCachedPermissions();
});

it('forbids update for users without update permission', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();
    $role = Role::create(['name' => 'Original']);

    $response = $this->actingAs($user)->put(route('users.update', $target->id), [
        'name' => 'Updated User',
        'email' => 'updated@example.com',
        'roles' => [$role->id],
    ]);

    $response->assertForbidden();
});

it('updates user details and roles', function () {
    $admin = User::factory()->create();
    grantUserUpdatePermission($admin);

    $target = User::factory()->create();
    $role = Role::create(['name' => 'Manager']);

    $payload = [
        'name' => 'Updated User',
        'email' => 'updated@example.com',
        'roles' => [$role->id],
        'changePassword' => false,
    ];

    $response = $this->actingAs($admin)->put(route('users.update', $target->id), $payload);

    $response->assertRedirect();

    $target->refresh();

    expect($target->name)->toBe($payload['name']);
    expect($target->email)->toBe($payload['email']);
    expect($target->hasRole($role))->toBeTrue();
});

it('updates password when changePassword is true', function () {
    $admin = User::factory()->create();
    grantUserUpdatePermission($admin);

    $target = User::factory()->create();
    $oldPassword = $target->password;
    $role = Role::create(['name' => 'Manager']);

    $payload = [
        'name' => $target->name,
        'email' => $target->email,
        'roles' => [$role->id],
        'changePassword' => true,
        'password' => 'new-secret',
    ];

    $response = $this->actingAs($admin)->put(route('users.update', $target->id), $payload);

    $response->assertRedirect();

    $target->refresh();

    expect($target->password)->not->toBe($oldPassword);
    expect(Hash::check('new-secret', $target->password))->toBeTrue();
});
