<?php

use App\Enums\Permissions\CustomerPermission;
use App\Models\Customer;
use App\Models\User;
use App\Services\CustomerService;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

function customerStorePayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Jane Doe',
        'contactNumber' => '1234567890',
        'email' => 'jane@example.com',
        'address' => '123 Main St',
        'productModel' => 'ABC-123',
        'installationDate' => Carbon::now()->format('Y-m-d'),
        'serviceInterval' => 30,
        'lastServiceDate' => null,
        'nextServiceDate' => null,
    ], $overrides);
}

function grantCustomerCreatePermission(User $user): void
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $permission = Permission::findOrCreate(CustomerPermission::CREATE->value, 'web');
    $user->givePermissionTo($permission);
}

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

it('redirects guests to login', function () {
    $response = $this->post(route('customers.store'), customerStorePayload());

    $response->assertRedirect();
    $this->assertGuest();
});

it('forbids authenticated users without create permission', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('customers.store'), customerStorePayload());

    $response->assertForbidden();
});

it('stores a customer for authorized users and redirects back', function () {
    $user = User::factory()->create();
    grantCustomerCreatePermission($user);

    $payload = customerStorePayload([
        'serviceInterval' => 15,
        'installationDate' => '2026-03-01',
    ]);

    $response = $this->actingAs($user)->post(route('customers.store'), $payload);

    $response->assertRedirect();

    $this->assertDatabaseHas('customers', [
        'name' => $payload['name'],
        'contact_number' => $payload['contactNumber'],
        'email' => $payload['email'],
        'address' => $payload['address'],
        'product_model' => $payload['productModel'],
        'installation_date' => $payload['installationDate'],
        'service_interval' => $payload['serviceInterval'],
    ]);
});

it('calculates next_service_date when not provided', function () {
    $user = User::factory()->create();
    grantCustomerCreatePermission($user);

    $payload = customerStorePayload([
        'installationDate' => '2026-03-01',
        'serviceInterval' => 20,
        'nextServiceDate' => null,
    ]);

    $response = $this->actingAs($user)->post(route('customers.store'), $payload);

    $response->assertRedirect();

    $expectedNextServiceDate = Carbon::parse($payload['installationDate'])
        ->addDays($payload['serviceInterval'])
        ->startOfDay()
        ->toDateTimeString();

    $this->assertDatabaseHas('customers', [
        'installation_date' => $payload['installationDate'],
        'service_interval' => $payload['serviceInterval'],
        'next_service_date' => $expectedNextServiceDate,
    ]);
});

it('validates required fields', function (string $field) {
    $user = User::factory()->create();
    grantCustomerCreatePermission($user);

    $payload = customerStorePayload();
    $payload[$field] = null;

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldNotReceive('create');
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->post(route('customers.store'), $payload);
    $response->assertSessionHasErrors($field);
    expect(Customer::count())->toBe(0);
})->with([
    'name',
    'contactNumber',
    'address',
    'productModel',
    'installationDate',
]);

it('validates serviceInterval boundaries', function ($value, bool $isValid) {
    $user = User::factory()->create();
    grantCustomerCreatePermission($user);

    $payload = customerStorePayload(['serviceInterval' => $value]);

    $response = $this->actingAs($user)->post(route('customers.store'), $payload);

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

it('validates lastServiceDate format', function () {
    $user = User::factory()->create();
    grantCustomerCreatePermission($user);

    $payload = customerStorePayload(['lastServiceDate' => '03/02/2026']);

    $response = $this->actingAs($user)->post(route('customers.store'), $payload);

    $response->assertSessionHasErrors('lastServiceDate');
});

it('validates nextServiceDate format', function () {
    $user = User::factory()->create();
    grantCustomerCreatePermission($user);

    $payload = customerStorePayload(['nextServiceDate' => '2026-3-2']);

    $response = $this->actingAs($user)->post(route('customers.store'), $payload);

    $response->assertSessionHasErrors('nextServiceDate');
});

it('returns 500 when the service throws an exception', function () {
    $user = User::factory()->create();
    grantCustomerCreatePermission($user);

    $mock = \Mockery::mock(CustomerService::class);
    $mock->shouldReceive('create')
        ->once()
        ->andThrow(new RuntimeException('DB error'));
    app()->instance(CustomerService::class, $mock);

    $response = $this->actingAs($user)->post(route('customers.store'), customerStorePayload());

    $response->assertStatus(500);
});
