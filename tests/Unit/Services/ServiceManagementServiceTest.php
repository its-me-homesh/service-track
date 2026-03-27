<?php

use App\Actions\Service\CreateServiceAction;
use App\Actions\Service\DeleteServiceAction;
use App\Actions\Service\RestoreServiceAction;
use App\Actions\Service\UpdateServiceAction;
use App\Actions\Service\UpdateServiceStatusAction;
use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Services\ServiceManagementService;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery as M;

it('filters invalid relations during pagination', function () {
    $repository = M::mock(ServiceRepositoryInterface::class);
    $repository->shouldReceive('paginate')
        ->once()
        ->with(M::on(fn (array $params) => $params['with'] === ['customer']))
        ->andReturn(new LengthAwarePaginator([], 0, 15));

    $service = new ServiceManagementService(
        M::mock(CreateServiceAction::class),
        M::mock(UpdateServiceAction::class),
        M::mock(DeleteServiceAction::class),
        M::mock(UpdateServiceStatusAction::class),
        M::mock(RestoreServiceAction::class),
        $repository
    );

    $service->pagination(['with' => ['customer', 'nope']]);
});

it('loads missing relations when finding by id', function () {
    $model = M::mock(Service::class);
    $model->shouldReceive('loadMissing')
        ->once()
        ->with(['customer'])
        ->andReturnSelf();

    $repository = M::mock(ServiceRepositoryInterface::class);
    $repository->shouldReceive('findById')
        ->once()
        ->with(5, true)
        ->andReturn($model);

    $service = new ServiceManagementService(
        M::mock(CreateServiceAction::class),
        M::mock(UpdateServiceAction::class),
        M::mock(DeleteServiceAction::class),
        M::mock(UpdateServiceStatusAction::class),
        M::mock(RestoreServiceAction::class),
        $repository
    );

    $result = $service->findById(5, ['customer']);

    expect($result)->toBe($model);
});

it('delegates status updates to the action', function () {
    $model = M::mock(Service::class);

    $updateStatusAction = M::mock(UpdateServiceStatusAction::class);
    $updateStatusAction->shouldReceive('execute')
        ->once()
        ->with($model, ['status' => 'completed'])
        ->andReturn($model);

    $service = new ServiceManagementService(
        M::mock(CreateServiceAction::class),
        M::mock(UpdateServiceAction::class),
        M::mock(DeleteServiceAction::class),
        $updateStatusAction,
        M::mock(RestoreServiceAction::class),
        M::mock(ServiceRepositoryInterface::class)
    );

    $result = $service->updateServiceStatus($model, ['status' => 'completed']);

    expect($result)->toBe($model);
});
