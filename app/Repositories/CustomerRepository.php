<?php

namespace App\Repositories;

use App\Enums\ServiceStatus;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function search(array $params = []): Collection
    {
        $searchTerm = $params['term'] ?? '';
        $includeTrashed = $params['includeTrashed'] ?? false;
        $onlyTrashed = $params['onlyTrashed'] ?? false;
        return Customer::when($searchTerm, fn($query) => $query->whereAny(['name', 'contact_number', 'email'], 'ilike', '%' . $searchTerm . '%'))
            ->when($includeTrashed, fn($query) => $query->withTrashed())
            ->when($onlyTrashed, fn($query) => $query->onlyTrashed())
            ->when(empty($searchTerm), fn($query) => $query->take(10))
            ->get();
    }

    public function paginate(array $params): LengthAwarePaginator
    {
        $searchTerm = $params['term'] ?? '';
        $orderBy = $params['orderBy'] ?? null;
        $order = $params['order'] ?? 'desc';
        $perPage = (int)($params['perPage'] ?? 15);
        $page = (int)($params['page'] ?? 1);
        $with = $params['with'] ?? [];

        $includeTrashed = (bool)($params['includeTrashed'] ?? false);
        $onlyTrashed = (bool)($params['onlyTrashed'] ?? false);
        $serviceOverdue = (bool)($params['serviceOverdue'] ?? false);
        $serviceDue = (bool)($params['serviceDue'] ?? false);

        $orderBy = in_array($orderBy, Customer::SORTABLE_COLUMNS, true) ? $orderBy : 'updated_at';


        Paginator::currentPageResolver(fn() => $page);

        return Customer::query()
            ->when($searchTerm, fn($query) => $query->whereAny(['name', 'contact_number', 'email'], 'ilike', '%' . $searchTerm . '%'))
            ->when($includeTrashed, fn($q) => $q->withTrashed())
            ->when($onlyTrashed, fn($q) => $q->onlyTrashed())
            ->when($serviceOverdue, fn($q) => $q->where('next_service_date', '<=', now()->toDateString()))
            ->when($serviceDue, fn($q) => $q->whereBetween('next_service_date', [
                now()->toDateString(),
                now()->addDays(7)->toDateString()
            ]))
            ->when(!blank($with), fn($q) => $q->with($with))
            ->orderBy($orderBy, $order)
            ->paginate($perPage);
    }

    public function findById(int $id, bool $trashed = false): Customer
    {
        return Customer::when($trashed, fn($q) => $q->withTrashed())->findOrFail($id);
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): ?Customer
    {
        $customer->update($data);
        return $customer->fresh();
    }

    public function delete(Customer $customer, bool $hardDelete = false): bool
    {

        return $hardDelete ? $customer->forceDelete() : $customer->delete();
    }

    public function restore(Customer $customer): bool
    {
        return $customer->restore();
    }

    public function findByIdOrNull(int $id, bool $trashed = false): ?Customer
    {
        return Customer::when($trashed, fn($q) => $q->withTrashed())->find($id);
    }

    public function count(bool $trashed = false): int
    {
        return Customer::when($trashed, fn($q) => $q->withTrashed())->count();
    }

    public function serviceOverdue(bool $count = false, array $params = [], bool $trashed = false): Collection|int
    {
        $with = $params['with'] ?? [];
        $query = Customer::where('next_service_date', "<=", now()->toDateString())
            ->where(function ($query) {
                $query->whereDoesntHave('lastService')
                    ->orWhereHas('lastService', function ($query) {
                        $query->whereIn('status', [
                            ServiceStatus::COMPLETED->value,
                            ServiceStatus::CANCELLED->value,
                        ]);
                    });
            })
            ->when($trashed, fn($q) => $q->withTrashed())
            ->when(!blank($with), fn($q) => $q->with($with));
        return $count ? $query->count() : $query->orderBy('next_service_date')->get();
    }

    public function serviceUpcoming(bool $count = false, array $params = [], bool $trashed = false): Collection|int
    {
        $with = $params['with'] ?? [];
        $query = Customer::whereBetween('next_service_date', [
            now()->toDateString(),
            now()->addDays(7)->toDateString()
        ])
            ->where(function ($query) {
                $query->whereDoesntHave('lastService')
                    ->orWhereHas('lastService', function ($query) {
                        $query->whereIn('status', [
                            ServiceStatus::COMPLETED->value,
                            ServiceStatus::CANCELLED->value,
                        ]);
                    });
            })
            ->when($trashed, fn($q) => $q->withTrashed())
            ->when(!blank($with), fn($q) => $q->with($with));
        return $count ? $query->count() : $query->get();
    }
}
