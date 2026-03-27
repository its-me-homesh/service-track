<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function paginate(array $params): LengthAwarePaginator;

    public function findById(int $id, bool $trashed = false): ?User;

    public function create(array $data): User;

    public function update(User $user, array $data): ?User;

    public function delete(User $user, bool $hardDelete = false): bool;

    public function restore(User $user): bool;

    public function syncRoles(User $user, array $roles): ?User;
}
