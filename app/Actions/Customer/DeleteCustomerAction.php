<?php

namespace App\Actions\Customer;

use App\Repositories\Contracts\CustomerRepositoryInterface;

class DeleteCustomerAction
{
    public function __construct(private readonly CustomerRepositoryInterface $customerRepository)
    {

    }

    public function execute(int $id, bool $forceDelete = false): bool
    {
        return $this->customerRepository->deleteById($id, $forceDelete);
    }
}
