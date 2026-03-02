<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\User;
use App\Services\CustomerService;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::DELETE->value, 'web');
    $user->givePermissionTo($perm);
}

function grantCustomerForceDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::FORCE_DELETE->value, 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('soft deletes customer when type is soft', function () {
    $user = User::factory()->create();
    grantCustomerDeletePermission($user);

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldReceive('delete')
        ->once()
        ->with(123, false)
        ->andReturn(true);
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->delete(route('customers.delete', 123), [
        'type' => 'soft',
    ]);

    $response->assertRedirect();
});

it('force deletes customer when type is permanent', function () {
    $user = User::factory()->create();
    grantCustomerDeletePermission($user);
    grantCustomerForceDeletePermission($user);

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldReceive('delete')
        ->once()
        ->with(123, true)
        ->andReturn(true);
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->delete(route('customers.delete', 123), [
        'type' => 'permanent',
    ]);

    $response->assertRedirect();
});
