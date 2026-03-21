<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Arr;

class CustomerRepository implements CustomerRepositoryInterface
{
    /**
     * A whitelist of columns that are safe to be sorted by.
     * This prevents arbitrary sorting on sensitive or unindexed columns.
     * @var array
     */
    private array $sortable = [
        'id',
        'name',
        'contact_number',
        'alternate_contact_number',
        'email',
        'address',
        'product_model',
        'installation_date',
        'last_service_date',
        'next_service_date',
        'created_at',
        'updated_at',
    ];

    public function search(array $params = []): Collection{
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
        $searchTerm = Arr::get($params, 'term');
        $orderBy = Arr::get($params, 'orderBy');
        $order = Arr::get($params, 'order', 'desc');
        $limit = (int)Arr::get($params, 'limit', 15);
        $page = (int)Arr::get($params, 'page', 1);
        $includeTrashed = (bool)Arr::get($params, 'includeTrashed', false);
        $onlyTrashed = (bool)Arr::get($params, 'onlyTrashed', false);
        $serviceOverdue = (bool)Arr::get($params, 'serviceOverdue', false);
        $serviceDue = (bool)Arr::get($params, 'serviceDue', false);
        $with = Arr::get($params, 'with', []);

        $orderBy = in_array($orderBy, $this->sortable, true) ? $orderBy : 'updated_at';

        Paginator::currentPageResolver(fn() => $page);

        return Customer::query()
            ->when($searchTerm, fn($query) => $query->whereAny(['name', 'contact_number', 'email'], 'like', '%' . $searchTerm . '%'))
            ->when($includeTrashed, fn($q) => $q->withTrashed())
            ->when($onlyTrashed, fn($q) => $q->onlyTrashed())
            ->when($serviceOverdue, fn($q) => $q->where('next_service_date', '<=', now()))
            ->when($serviceDue, fn($q) => $q->whereBetween('next_service_date', [now(), now()->addDays(7)]))
            ->when(!blank($with), fn($q) => $q->with($with))
            ->orderBy($orderBy, $order)
            ->paginate($limit);
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
}
