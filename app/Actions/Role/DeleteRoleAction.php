<?php

namespace App\Actions\Role;

use App\Models\User;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Spatie\Permission\Models\Role;

class DeleteRoleAction
{
    public function __construct(
        private readonly RoleRepositoryInterface $roleRepository
    )
    {
    }

    public function execute(Role $role): bool
    {
        return $this->roleRepository->delete($role);
    }
}
