<?php

use App\Actions\User\CreateUserAction;
use App\Actions\User\DeleteUserAction;
use App\Actions\User\RestoreUserAction;
use App\Actions\User\UpdateUserAction;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\UserService;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery as M;

it('filters invalid relations during pagination', function () {
    $repository = M::mock(UserRepositoryInterface::class);
    $repository->shouldReceive('paginate')
        ->once()
        ->with(M::on(fn (array $params) => $params['with'] === ['createdBy']))
        ->andReturn(new LengthAwarePaginator([], 0, 15));

    $service = new UserService(
        M::mock(CreateUserAction::class),
        M::mock(UpdateUserAction::class),
        M::mock(DeleteUserAction::class),
        M::mock(RestoreUserAction::class),
        $repository
    );

    $service->pagination(['with' => ['createdBy', 'nope']]);
});

it('loads missing relations when finding by id', function () {
    $model = M::mock(User::class);
    $model->shouldReceive('loadMissing')
        ->once()
        ->with(['updatedBy'])
        ->andReturnSelf();

    $repository = M::mock(UserRepositoryInterface::class);
    $repository->shouldReceive('findById')
        ->once()
        ->with(2, true)
        ->andReturn($model);

    $service = new UserService(
        M::mock(CreateUserAction::class),
        M::mock(UpdateUserAction::class),
        M::mock(DeleteUserAction::class),
        M::mock(RestoreUserAction::class),
        $repository
    );

    $result = $service->findById(2, ['updatedBy']);

    expect($result)->toBe($model);
});
