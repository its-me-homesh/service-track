<?php

namespace App\Services;

use App\Actions\Customer\CreateCustomerAction;
use App\Actions\Customer\DeleteCustomerAction;
use App\Actions\Customer\UpdateCustomerAction;
use App\Actions\Customer\UpdateServiceScheduleAction;
use App\Models\Customer;
use App\Repositories\CustomerRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class CustomerService
{

    public function __construct(
        private readonly CreateCustomerAction        $createCustomerAction,
        private readonly UpdateCustomerAction        $updateCustomerAction,
        private readonly DeleteCustomerAction        $deleteCustomerAction,
        private readonly UpdateServiceScheduleAction $updateServiceScheduleAction,
        private readonly CustomerRepository          $customerRepository
    )
    {
    }

    public function pagination(array $params = []): LengthAwarePaginator
    {
        $params['with'] = collect($params['with'] ?? [])->filter(function ($relation) {
            return method_exists(Customer::class, $relation);
        })->toArray();

        return $this->customerRepository->paginate($params);
    }

    public function create(array $data): Customer
    {
        return $this->createCustomerAction->execute($data);
    }

    public function update(int $id, array $data): ?Customer
    {
        return $this->updateCustomerAction->execute($id, $data);
    }

    public function delete(int $id, bool $forceDelete = false): bool
    {
        return $this->deleteCustomerAction->execute($id, $forceDelete);
    }

    public function restore(int $id): bool
    {
        return $this->customerRepository->restoreById($id);
    }

    public function find(int $id, array $with = []): ?Customer
    {
        return $this->customerRepository->findById($id, true)->loadMissing($with);
    }

    public function updateServiceSchedule(int $id, array $data): ?Customer
    {
        return $this->updateServiceScheduleAction->execute($id, $data);
    }
}
