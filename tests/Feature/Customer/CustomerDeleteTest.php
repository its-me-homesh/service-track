<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\Customer;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::DELETE->key(), 'web');
    $user->givePermissionTo($perm);
}

function grantCustomerForceDeletePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::FORCE_DELETE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('soft deletes customer when type is soft', function () {
    $user = User::factory()->create();
    grantCustomerDeletePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $response = $this->actingAs($user)->delete(route('customers.delete', $customer->id), [
        'type' => 'soft',
    ]);

    $response->assertRedirect();

    $this->assertSoftDeleted('customers', ['id' => $customer->id]);
    expect(Customer::withTrashed()->find($customer->id)->deleted_by_id)->toBe($user->id);
});

it('force deletes customer when type is permanent', function () {
    $user = User::factory()->create();
    grantCustomerDeletePermission($user);
    grantCustomerForceDeletePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $response = $this->actingAs($user)->delete(route('customers.delete', $customer->id), [
        'type' => 'permanent',
    ]);

    $response->assertRedirect(route('customers.index'));

    $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
});

it('forbids permanent deletion without force delete permission', function () {
    $user = User::factory()->create();
    grantCustomerDeletePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $response = $this->actingAs($user)->delete(route('customers.delete', $customer->id), [
        'type' => 'permanent',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseHas('customers', ['id' => $customer->id]);
});
