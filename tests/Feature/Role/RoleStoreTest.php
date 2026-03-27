<?php

use App\Enums\Permissions\RolePermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

function roleStorePayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Support',
        'permissions' => [],
    ], $overrides);
}

function grantRoleCreatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(RolePermission::CREATE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('redirects guests to login', function () {
    $response = $this->post(route('roles.store'), roleStorePayload());

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids authenticated users without create permission', function () {
    $user = User::factory()->create();
    $permission = Permission::findOrCreate('customer.view-any', 'web');

    $response = $this->actingAs($user)->post(route('roles.store'), roleStorePayload([
        'permissions' => [$permission->id],
    ]));

    $response->assertForbidden();
});

it('stores a role with permissions for authorized users', function () {
    $admin = User::factory()->create();
    grantRoleCreatePermission($admin);

    $permission = Permission::findOrCreate('customer.view-any', 'web');

    $payload = roleStorePayload([
        'name' => 'Support',
        'permissions' => [$permission->id],
    ]);

    $response = $this->actingAs($admin)->post(route('roles.store'), $payload);

    $response->assertRedirect();

    $role = Role::where('name', $payload['name'])->first();

    expect($role)->not->toBeNull();
    expect($role->hasPermissionTo($permission))->toBeTrue();
});

it('validates required fields', function (string $field) {
    $admin = User::factory()->create();
    grantRoleCreatePermission($admin);

    $permission = Permission::findOrCreate('customer.view-any', 'web');

    $payload = roleStorePayload(['permissions' => [$permission->id]]);
    $payload[$field] = null;

    $response = $this->actingAs($admin)->post(route('roles.store'), $payload);

    $response->assertSessionHasErrors($field);
})->with([
    'name',
    'permissions',
]);
