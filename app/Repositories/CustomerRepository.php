<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Contacts\CustomerRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Arr;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function all(array $params = []): Collection{
        $searchTerm = $params['term'] ?? '';
        $withTrashed = $params['withTrashed'] ?? false;
        $onlyTrashed = $params['onlyTrashed'] ?? false;
        return Customer::when($searchTerm, function ($query) use ($searchTerm) {
            return $query->where('name', 'like', '%' . $searchTerm . '%')
                ->where('contact_number', 'like', '%' . $searchTerm . '%')
                ->where('email', 'like', '%' . $searchTerm . '%');
        })
            ->when($withTrashed, fn($query) => $query->withTrashed())
            ->when($onlyTrashed, fn($query) => $query->onlyTrashed())
            ->get();
    }

    public function paginate(array $params): LengthAwarePaginator
    {
        $searchTerm = Arr::get($params, 'term');
        $orderBy = Arr::get($params, 'orderBy', 'displayOrder');
        $order = Arr::get($params, 'order', 'asc');
        $limit = (int)Arr::get($params, 'limit', 10);
        $page = (int)Arr::get($params, 'page', 1);
        $withTrashed = (bool)Arr::get($params, 'withTrashed', false);
        $onlyTrashed = (bool)Arr::get($params, 'onlyTrashed', false);
        $with = Arr::get($params, 'with', []);

        Paginator::currentPageResolver(fn() => $page);

        return Customer::query()
            ->when($searchTerm, function ($query) use ($searchTerm) {
                return $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->where('contact_number', 'like', '%' . $searchTerm . '%')
                    ->where('email', 'like', '%' . $searchTerm . '%');
            })
            ->when($withTrashed, fn($q) => $q->withTrashed())
            ->when($onlyTrashed, fn($q) => $q->onlyTrashed())
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

    public function updateById(int $id, array $data): ?Customer
    {
        $customer = $this->findById($id);
        $customer->update($data);
        return $customer;
    }

    public function deleteById(int $id, bool $hardDelete = false): bool
    {
        $model = $this->findById($id, true);
        if (!$model) {
            return false;
        }
        if (!$hardDelete) {
            return $model->delete();
        }

        return $model->forceDelete();
    }

    public function restoreById(int $id): bool
    {
        $model = $this->findById($id, true);
        if (!$model) {
            return false;
        }
        return $model->restore();
    }
}
