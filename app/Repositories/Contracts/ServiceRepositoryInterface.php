<?php

namespace App\Repositories\Contracts;

use App\Models\Service;
use Illuminate\Pagination\LengthAwarePaginator;

interface ServiceRepositoryInterface
{
    public function paginate(array $params): LengthAwarePaginator;

    public function findById(int $id, bool $trashed = false): ?Service;

    public function create(array $data): Service;

    public function update(Service $service, array $data): ?Service;

    public function delete(Service $service, bool $hardDelete = false): bool;

    public function restore(Service $service): bool;
}
