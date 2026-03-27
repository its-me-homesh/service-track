<?php

use App\Enums\Permissions\UserPermission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

function userStorePayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'New User',
        'email' => 'new-user@example.com',
        'password' => 'secret-password',
        'roles' => [],
    ], $overrides);
}

function grantUserCreatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(UserPermission::CREATE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('redirects guests to login', function () {
    $response = $this->post(route('users.store'), userStorePayload());

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids authenticated users without create permission', function () {
    $user = User::factory()->create();

    $role = Role::create(['name' => 'Member']);

    $response = $this->actingAs($user)->post(route('users.store'), userStorePayload([
        'roles' => [$role->id],
    ]));

    $response->assertForbidden();
});

it('stores a user with roles for authorized users', function () {
    $admin = User::factory()->create();
    grantUserCreatePermission($admin);

    $role = Role::create(['name' => 'Member']);

    $payload = userStorePayload([
        'roles' => [$role->id],
    ]);

    $response = $this->actingAs($admin)->post(route('users.store'), $payload);

    $response->assertRedirect();

    $created = User::where('email', $payload['email'])->first();

    expect($created)->not->toBeNull();
    expect(Hash::check($payload['password'], $created->password))->toBeTrue();
    expect($created->hasRole($role))->toBeTrue();
});

it('validates required fields', function (string $field) {
    $admin = User::factory()->create();
    grantUserCreatePermission($admin);

    $role = Role::create(['name' => 'Member']);

    $payload = userStorePayload(['roles' => [$role->id]]);
    $payload[$field] = null;

    $response = $this->actingAs($admin)->post(route('users.store'), $payload);

    $response->assertSessionHasErrors($field);
})->with([
    'name',
    'email',
    'password',
    'roles',
]);
