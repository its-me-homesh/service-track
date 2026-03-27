<?php

use App\Enums\Permissions\UserPermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantUserDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(UserPermission::DELETE->key(), 'web');
    $user->givePermissionTo($perm);
}

function grantUserForceDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(UserPermission::FORCE_DELETE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('soft deletes user when type is soft', function () {
    $admin = User::factory()->create();
    grantUserDeletePermission($admin);

    $target = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.delete', $target->id), [
        'type' => 'soft',
    ]);

    $response->assertRedirect();

    $this->assertSoftDeleted('users', ['id' => $target->id]);
    expect(User::withTrashed()->find($target->id)->deleted_by_id)->toBe($admin->id);
});

it('force deletes user when type is permanent', function () {
    $admin = User::factory()->create();
    grantUserDeletePermission($admin);
    grantUserForceDeletePermission($admin);

    $target = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.delete', $target->id), [
        'type' => 'permanent',
    ]);

    $response->assertRedirect(route('users.index'));

    $this->assertDatabaseMissing('users', ['id' => $target->id]);
});

it('forbids permanent deletion without force delete permission', function () {
    $admin = User::factory()->create();
    grantUserDeletePermission($admin);

    $target = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.delete', $target->id), [
        'type' => 'permanent',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseHas('users', ['id' => $target->id]);
});
