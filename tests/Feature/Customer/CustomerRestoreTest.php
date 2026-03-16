<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\Customer;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerRestorePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::RESTORE->key(), 'web');
    $user->givePermissionTo($perm);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('restores customer for authorized users', function () {
    $user = User::factory()->create();
    grantCustomerRestorePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $this->actingAs($user);
    $customer->delete();

    $response = $this->actingAs($user)->patch(route('customers.restore', $customer->id));

    $response->assertRedirect();

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'deleted_at' => null,
    ]);
});

it('forbids restore without permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $this->actingAs($user);
    $customer->delete();

    $response = $this->actingAs($user)->patch(route('customers.restore', $customer->id));

    $response->assertForbidden();
    $this->assertSoftDeleted('customers', ['id' => $customer->id]);
});
