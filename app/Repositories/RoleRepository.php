<?php

namespace App\Repositories;

use App\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleRepository implements RoleRepositoryInterface
{
    public function all(array $params): Collection
    {
        $searchTerm = $params['term'] ?? '';
        $with = $params['with'] ?? [];

        return Role::when($searchTerm, fn($query) => $query->where('name', 'ilike', '%' . $searchTerm . '%'))
            ->when(!blank($with), fn($q) => $q->with($with))
            ->get();
    }

    public function findById(int $id): Role
    {
        return Role::findOrFail($id);
    }

    public function create(array $data): Role
    {
        return Role::create($data);
    }

    public function update(Role $role, array $data): ?Role
    {
        $role->update($data);
        return $role;
    }

    public function delete(Role $role, bool $hardDelete = false): bool
    {
        return $role->delete();
    }

    public function permissions(): Collection
    {
        return Permission::get();
    }

    public function syncPermissions(Role $role, array $permissions): ?Role
    {
        $role->syncPermissions($permissions);
        return $role;
    }
}
