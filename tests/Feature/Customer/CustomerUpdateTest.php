<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\User;
use App\Services\CustomerService;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function grantCustomerUpdatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $perm = Permission::findOrCreate(CustomerPermission::UPDATE->value, 'web');
    $user->givePermissionTo($perm);
}

function customerUpdatePayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Jane Doe',
        'contactNumber' => '1234567890',
        'email' => 'jane@example.com',
        'address' => '123 Main St',
        'productModel' => 'ABC-123',
        'installationDate' => '2026-03-01',
        'serviceInterval' => 30,
        'lastServiceDate' => null,
        'nextServiceDate' => null,
        'resetServiceDate' => false,
    ], $overrides);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('forbids update for users without update permission', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->put(route('customers.update', 123), customerUpdatePayload());

    $response->assertForbidden();
});

it('updates customer for authorized users', function () {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $payload = customerUpdatePayload();

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldReceive('update')
        ->once()
        ->with(123, $payload)
        ->andReturn(null);
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->put(route('customers.update', 123), $payload);

    $response->assertRedirect();
});

it('allows nullable email on update', function () {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $payload = customerUpdatePayload(['email' => null]);

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldReceive('update')
        ->once()
        ->with(123, $payload)
        ->andReturn(null);
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->put(route('customers.update', 123), $payload);

    $response->assertRedirect();
});

it('validates required fields on update', function (string $field) {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $payload = customerUpdatePayload();
    $payload[$field] = null;

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldNotReceive('update');
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->put(route('customers.update', 123), $payload);

    $response->assertSessionHasErrors($field);
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

    $payload = customerUpdatePayload(['serviceInterval' => $value]);

    $mock = \Mockery::mock(CustomerService::class);
    if ($isValid) {
        $mock->shouldReceive('update')
            ->once()
            ->with(123, $payload)
            ->andReturn(null);
    } else {
        $mock->shouldNotReceive('update');
    }
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->put(route('customers.update', 123), $payload);

    if ($isValid) {
        $response->assertSessionDoesntHaveErrors('serviceInterval');
    } else {
        $response->assertSessionHasErrors('serviceInterval');
    }
})->with([
    [1, true],
    [365, true],
    [0, false],
    [366, false],
    ['abc', false],
]);

it('validates lastServiceDate format on update', function () {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $payload = customerUpdatePayload(['lastServiceDate' => '03/02/2026']);

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldNotReceive('update');
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->put(route('customers.update', 123), $payload);

    $response->assertSessionHasErrors('lastServiceDate');
});

it('validates nextServiceDate format on update', function () {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $payload = customerUpdatePayload(['nextServiceDate' => '2026-3-2']);

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldNotReceive('update');
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->put(route('customers.update', 123), $payload);

    $response->assertSessionHasErrors('nextServiceDate');
});

it('validates resetServiceDate as boolean on update', function () {
    $user = User::factory()->create();
    grantCustomerUpdatePermission($user);

    $payload = customerUpdatePayload(['resetServiceDate' => 'yes']);

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldNotReceive('update');
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->put(route('customers.update', 123), $payload);

    $response->assertSessionHasErrors('resetServiceDate');
});
