<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\Customer;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerUpdatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::UPDATE->key(), 'web');
    $user->givePermissionTo($perm);
}

function customerUpdatePayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Jane Doe',
        'contactNumber' => '1234567890',
        'alternateContactNumber' => null,
        'email' => 'jane@example.com',
        'address' => '123 Main St',
        'productModel' => 'ABC-123',
        'installationDate' => '2026-03-01',
        'serviceInterval' => 30,
        'notes' => null,
    ], $overrides);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('forbids update for users without update permission', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $response = $this->actingAs($user)->put(route('customers.update', $customer->id), customerUpdatePayload());

    $response->assertForbidden();
});

it('updates customer for authorized users', function () {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $payload = customerUpdatePayload([
        'name' => 'Updated Name',
        'contactNumber' => '9999999999',
        'alternateContactNumber' => '8888888888',
        'email' => 'updated@example.com',
        'address' => '456 Main St',
        'productModel' => 'XYZ-789',
        'installationDate' => '2026-03-05',
        'serviceInterval' => 45,
        'notes' => 'Updated notes',
    ]);

    $response = $this->actingAs($user)->put(route('customers.update', $customer->id), $payload);

    $response->assertRedirect();

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'name' => $payload['name'],
        'contact_number' => $payload['contactNumber'],
        'alternate_contact_number' => $payload['alternateContactNumber'],
        'email' => $payload['email'],
        'address' => $payload['address'],
        'product_model' => $payload['productModel'],
        'installation_date' => $payload['installationDate'],
        'service_interval' => $payload['serviceInterval'],
        'notes' => $payload['notes'],
    ]);
});

it('allows nullable email on update', function () {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);

    $payload = customerUpdatePayload(['email' => null]);

    $response = $this->actingAs($user)->put(route('customers.update', $customer->id), $payload);

    $response->assertRedirect();

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'email' => null,
    ]);
});

it('validates required fields on update', function (string $field) {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $originalName = $customer->name;

    $payload = customerUpdatePayload();
    $payload[$field] = null;

    $response = $this->actingAs($user)->put(route('customers.update', $customer->id), $payload);

    $response->assertSessionHasErrors($field);
    expect($customer->refresh()->name)->toBe($originalName);
})->with([
    'name',
    'contactNumber',
    'address',
    'productModel',
    'installationDate',
]);

it('validates serviceInterval boundaries on update', function ($value, bool $isValid) {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $originalInterval = $customer->service_interval;

    $payload = customerUpdatePayload(['serviceInterval' => $value]);

    $response = $this->actingAs($user)->put(route('customers.update', $customer->id), $payload);

    if ($isValid) {
        $response->assertSessionDoesntHaveErrors('serviceInterval');
        expect($customer->refresh()->service_interval)->toBe((int) $value);
    } else {
        $response->assertSessionHasErrors('serviceInterval');
        expect($customer->refresh()->service_interval)->toBe($originalInterval);
    }
})->with([
    [1, true],
    [1826, true],
    [0, false],
    [1827, false],
    ['abc', false],
]);

it('validates installationDate format on update', function () {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $customer = Customer::factory()->create(['created_by_id' => $user->id]);
    $originalInstallationDate = $customer->installation_date;

    $payload = customerUpdatePayload(['installationDate' => '2026-3-2']);

    $response = $this->actingAs($user)->put(route('customers.update', $customer->id), $payload);

    $response->assertSessionHasErrors('installationDate');
    expect($customer->refresh()->installation_date)->toBe($originalInstallationDate);
});
