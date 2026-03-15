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

    public function update(Customer $customer, array $data): ?Customer
    {
        return $this->updateCustomerAction->execute($customer, $data);
    }

    public function delete(Customer $customer, bool $forceDelete = false): bool
    {
        return $this->deleteCustomerAction->execute($customer, $forceDelete);
    }

    public function restore(Customer $customer): bool
    {
        return $this->customerRepository->restore($customer);
    }

    public function findById(int $id, array $with = [], $trashed = true): ?Customer
    {
        return $this->customerRepository->findById($id, $trashed)->loadMissing($with);
    }

    public function updateServiceSchedule(Customer $customer, array $data): ?Customer
    {
        return $this->updateServiceScheduleAction->execute($customer, $data);
    }
}
