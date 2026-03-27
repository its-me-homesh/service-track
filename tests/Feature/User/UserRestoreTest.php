<?php

use App\Enums\Permissions\UserPermission;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantUserRestorePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(UserPermission::RESTORE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('restores user for authorized users', function () {
    $admin = User::factory()->create();
    grantUserRestorePermission($admin);

    $target = User::factory()->create();

    $this->actingAs($admin);
    $target->delete();

    $response = $this->actingAs($admin)->patch(route('users.restore', $target->id));

    $response->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $target->id,
        'deleted_at' => null,
    ]);
});

it('forbids restore without permission', function () {
    $admin = User::factory()->create();
    $target = User::factory()->create();

    $this->actingAs($admin);
    $target->delete();

    $response = $this->actingAs($admin)->patch(route('users.restore', $target->id));

    $response->assertForbidden();
    $this->assertSoftDeleted('users', ['id' => $target->id]);
});
