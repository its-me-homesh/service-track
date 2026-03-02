<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\User;
use App\Services\CustomerService;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerRestorePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::RESTORE->value, 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('restores customer for authorized users', function () {
    $user = User::factory()->create();
    grantCustomerRestorePermission($user);

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldReceive('restore')
        ->once()
        ->with(123)
        ->andReturn(true);
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->patch(route('customers.restore', 123));

    $response->assertRedirect();
});
