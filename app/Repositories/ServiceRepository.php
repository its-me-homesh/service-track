<?php

namespace App\Repositories;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class ServiceRepository implements ServiceRepositoryInterface
{
    public function paginate(array $params): LengthAwarePaginator
    {
        $searchTerm = $params['term'] ?? '';
        $orderBy = $params['orderBy'] ?? null;
        $order = $params['order'] ?? 'desc';
        $perPage = (int)($params['perPage'] ?? 15);
        $page = (int)($params['page'] ?? 1);
        $with = $params['with'] ?? [];

        $status = $params['status'] ?? [];
        $customerId = $params['customerId'] ?? [];
        $includeTrashed = (bool)($params['includeTrashed'] ?? false);
        $onlyTrashed = (bool)($params['onlyTrashed'] ?? false);

        $orderBy = in_array($orderBy, Service::SORTABLE_COLUMNS, true) ? $orderBy : 'updated_at';

        Paginator::currentPageResolver(fn() => $page);

        return Service::query()
            ->search($searchTerm)
            ->when($includeTrashed, fn($q) => $q->withTrashed())
            ->when($onlyTrashed, fn($q) => $q->onlyTrashed())
            ->when($status, fn($q) => $q->when(!is_array($status),
                fn($q) => $q->where('status', $status),
                fn($q) => $q->whereIn('status', $status)
            ))
            ->when($customerId, fn($q) => $q->when(!is_array($customerId),
                fn($q) => $q->where('customer_id', $customerId),
                fn($q) => $q->whereIn('customer_id', $customerId)
            ))
            ->when(!blank($with), fn($q) => $q->with($with))
            ->orderBy($orderBy, $order)
            ->paginate($perPage);
    }

    public function findById(int $id, bool $trashed = false): Service
    {
        return Service::when($trashed, fn($q) => $q->withTrashed())->findOrFail($id);
    }

    public function create(array $data): Service
    {
        return Service::create($data);
    }

    public function update(Service $service, array $data): ?Service
    {
        $service->update($data);
        return $service;
    }

    public function delete(Service $service, bool $hardDelete = false): bool
    {

        return $hardDelete ? $service->forceDelete() : $service->delete();
    }

    public function restore(Service $service): bool
    {
        return $service->restore();
    }

    public function active(bool $count = false, array $params = [], bool $trashed = false): Collection|int
    {
        $with = $params['with'] ?? [];
        $query = Service::active()
            ->when($trashed, fn($q) => $q->withTrashed())
            ->when(!blank($with), fn($q) => $q->with($with));
        return $count ? $query->count() : $query->get();
    }

    public function today(bool $count = false, array $params = [], bool $trashed = false): Collection|int
    {
        $with = $params['with'] ?? [];
        $query = Service::whereDate('service_date', now()->format('Y-m-d'))
            ->when($trashed, fn($q) => $q->withTrashed())
            ->when(!blank($with), fn($q) => $q->with($with));
        return $count ? $query->count() : $query->get();
    }

    public function completedThisMonthCount(bool $trashed = false): int
    {
        return Service::whereMonth('updated_at', now()->month)
            ->when($trashed, fn($q) => $q->withTrashed())
            ->count();
    }
}
