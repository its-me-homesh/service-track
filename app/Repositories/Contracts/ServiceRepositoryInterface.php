<?php

namespace App\Repositories\Contracts;

use App\Models\Service;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ServiceRepositoryInterface
{
    public function paginate(array $params): LengthAwarePaginator;

    public function findById(int $id, bool $trashed = false): ?Service;

    public function create(array $data): Service;

    public function update(Service $service, array $data): ?Service;

    public function delete(Service $service, bool $hardDelete = false): bool;

    public function restore(Service $service): bool;

    public function active(bool $count = false, array $params = [], bool $trashed = false): Collection|int;

    public function today(bool $count = false, array $params = [], bool $trashed = false): Collection|int;

    public function completedThisMonthCount(bool $trashed = false): int;
}
