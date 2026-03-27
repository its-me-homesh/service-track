<?php

use App\Actions\Role\CreateRoleAction;
use App\Actions\Role\DeleteRoleAction;
use App\Actions\Role\UpdateRoleAction;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Services\RoleService;
use Illuminate\Database\Eloquent\Collection;
use Mockery as M;
use Spatie\Permission\Models\Role;

it('filters invalid relations when fetching all roles', function () {
    $repository = M::mock(RoleRepositoryInterface::class);
    $repository->shouldReceive('all')
        ->once()
        ->with(M::on(fn (array $params) => $params['with'] === ['permissions']))
        ->andReturn(new Collection());

    $service = new RoleService(
        M::mock(CreateRoleAction::class),
        M::mock(UpdateRoleAction::class),
        M::mock(DeleteRoleAction::class),
        $repository
    );

    $service->all(['with' => ['permissions', 'nope']]);
});

it('loads missing relations when finding by id', function () {
    $role = M::mock(Role::class);
    $role->shouldReceive('loadMissing')
        ->once()
        ->with(['permissions'])
        ->andReturnSelf();

    $repository = M::mock(RoleRepositoryInterface::class);
    $repository->shouldReceive('findById')
        ->once()
        ->with(3)
        ->andReturn($role);

    $service = new RoleService(
        M::mock(CreateRoleAction::class),
        M::mock(UpdateRoleAction::class),
        M::mock(DeleteRoleAction::class),
        $repository
    );

    $result = $service->findById(3, ['permissions']);

    expect($result)->toBe($role);
});

it('returns permissions from the repository', function () {
    $permissions = new Collection();

    $repository = M::mock(RoleRepositoryInterface::class);
    $repository->shouldReceive('permissions')
        ->once()
        ->andReturn($permissions);

    $service = new RoleService(
        M::mock(CreateRoleAction::class),
        M::mock(UpdateRoleAction::class),
        M::mock(DeleteRoleAction::class),
        $repository
    );

    $result = $service->permissions();

    expect($result)->toBe($permissions);
});
