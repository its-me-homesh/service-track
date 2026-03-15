<?php

namespace App\Actions\Customer;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;

class DeleteCustomerAction
{
    public function __construct(private readonly CustomerRepositoryInterface $customerRepository)
    {

    }

    public function execute(Customer $customer, bool $forceDelete = false): bool
    {
        return $this->customerRepository->delete($customer, $forceDelete);
    }
}
