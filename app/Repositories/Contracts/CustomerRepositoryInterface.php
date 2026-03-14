<?php

namespace App\Repositories\Contracts;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface
{
    public function all(array $params = []): Collection;

    public function paginate(array $params): LengthAwarePaginator;

    public function findById(int $id, bool $trashed = false): ?Customer;

    public function create(array $data): Customer;

    public function updateById(int $id, array $data): ?Customer;

    public function deleteById(int $id, bool $hardDelete = false): bool;

    public function restoreById(int $id): bool;
}
