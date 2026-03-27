<?php

namespace App\Actions\Role;

use App\Repositories\Contracts\RoleRepositoryInterface;
use Spatie\Permission\Models\Role;

class UpdateRoleAction
{
    public function __construct(
        private readonly RoleRepositoryInterface $roleRepository,
    )
    {
    }

    public function execute(Role $user, array $data): ?Role
    {
        $role = $this->roleRepository->update($user, [
            'name' => $data['name']
        ]);

        $this->roleRepository->syncPermissions($role, $data['permissions'] ?? []);

        return $role->fresh();
    }
}
