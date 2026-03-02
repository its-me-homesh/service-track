<?php

namespace App\Actions\Customer;

use App\Models\Customer;
use App\Repositories\Contacts\CustomerRepositoryInterface;
use Carbon\Carbon;

class DeleteCustomerAction
{

    public function __construct(private CustomerRepositoryInterface $customerRepository)
    {

    }

    private function deletePermanently(int $id): bool
    {
        return true;
    }

    private function delete(int $id): bool
    {
        return true;
    }

    public function execute(int $id, bool $forceDelete = false): bool
    {
        return $forceDelete ? $this->deletePermanently($id) : $this->delete($id);
    }
}
