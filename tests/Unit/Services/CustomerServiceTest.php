<?php

use App\Actions\Customer\CreateCustomerAction;
use App\Actions\Customer\DeleteCustomerAction;
use App\Actions\Customer\UpdateCustomerAction;
use App\Actions\Customer\UpdateServiceScheduleAction;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Services\CustomerService;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery as M;

it('filters invalid relations during pagination', function () {
    $repository = M::mock(CustomerRepositoryInterface::class);
    $repository->shouldReceive('paginate')
        ->once()
        ->with(M::on(fn (array $params) => $params['with'] === ['services']))
        ->andReturn(new LengthAwarePaginator([], 0, 15));

    $service = new CustomerService(
        M::mock(CreateCustomerAction::class),
        M::mock(UpdateCustomerAction::class),
        M::mock(DeleteCustomerAction::class),
        M::mock(UpdateServiceScheduleAction::class),
        $repository
    );

    $service->pagination(['with' => ['services', 'nope']]);
});

it('loads missing relations when finding by id', function () {
    $customer = M::mock(Customer::class);
    $customer->shouldReceive('loadMissing')
        ->once()
        ->with(['createdBy'])
        ->andReturnSelf();

    $repository = M::mock(CustomerRepositoryInterface::class);
    $repository->shouldReceive('findById')
        ->once()
        ->with(10, true)
        ->andReturn($customer);

    $service = new CustomerService(
        M::mock(CreateCustomerAction::class),
        M::mock(UpdateCustomerAction::class),
        M::mock(DeleteCustomerAction::class),
        M::mock(UpdateServiceScheduleAction::class),
        $repository
    );

    $result = $service->findById(10, ['createdBy']);

    expect($result)->toBe($customer);
});
