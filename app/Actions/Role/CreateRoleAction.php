<?php

namespace App\Actions\Role;

use App\Repositories\Contracts\RoleRepositoryInterface;
use Spatie\Permission\Models\Role;

class CreateRoleAction
{
    public function __construct(
        private readonly RoleRepositoryInterface  $roleRepository,
    )
    {
    }

    public function execute(array $data): Role
    {
        $role = $this->roleRepository->create([
            'name' => $data['name']
        ]);

        $this->roleRepository->syncPermissions($role, $data['permissions'] ?? []);

        return $role;
    }
}
