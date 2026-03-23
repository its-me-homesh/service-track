<?php

namespace App\Repositories\Contracts;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface
{
    public function search(array $params = []): Collection;

    public function paginate(array $params): LengthAwarePaginator;

    public function findById(int $id, bool $trashed = false): ?Customer;

    public function create(array $data): Customer;

    public function update(Customer $customer, array $data): ?Customer;

    public function delete(Customer $customer, bool $hardDelete = false): bool;

    public function restore(Customer $customer): bool;

    public function findByIdOrNull(int $id, bool $trashed = false): ?Customer;

    public function count(bool $trashed = false): int;

    public function serviceOverdue(bool $count = false, array $params = [], bool $trashed = false): Collection|int;

    public function serviceUpcoming(bool $count = false, array $params = [], bool $trashed = false): Collection|int;
}
