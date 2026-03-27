<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Role;

interface RoleRepositoryInterface
{
    public function all(array $params): Collection;

    public function findById(int $id): ?Role;

    public function create(array $data): Role;

    public function update(Role $role, array $data): ?Role;

    public function delete(Role $role): bool;

    public function permissions(): Collection;

    public function syncPermissions(Role $role, array $permissions): ?Role;
}
