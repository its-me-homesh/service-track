<?php

namespace App\Services;

use App\Actions\Role\CreateRoleAction;
use App\Actions\Role\DeleteRoleAction;
use App\Actions\Role\UpdateRoleAction;
use App\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function __construct(
        private readonly CreateRoleAction        $createRoleAction,
        private readonly UpdateRoleAction        $updateRoleAction,
        private readonly DeleteRoleAction        $deleteRoleAction,
        private readonly RoleRepositoryInterface $roleRepository
    )
    {
    }

    public function all(array $params = []): Collection
    {
        $params['with'] = collect($params['with'] ?? [])->filter(function ($relation) {
            return method_exists(Role::class, $relation);
        })->toArray();

        return $this->roleRepository->all($params);
    }

    public function create(array $data): Role
    {
        return $this->createRoleAction->execute($data);
    }

    public function update(Role $role, array $data): ?Role
    {
        return $this->updateRoleAction->execute($role, $data);
    }

    public function delete(Role $role): bool
    {
        return $this->deleteRoleAction->execute($role);
    }

    public function findById(int $id, array $with = []): ?Role
    {
        return $this->roleRepository->findById($id)->loadMissing($with);
    }

    public function permissions(): Collection
    {
        return $this->roleRepository->permissions();
    }
}
