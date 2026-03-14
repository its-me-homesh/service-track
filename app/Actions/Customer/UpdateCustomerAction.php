<?php

namespace App\Actions\Customer;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;

class UpdateCustomerAction
{
    public function __construct(
        private readonly CustomerRepositoryInterface $customerRepository
    )
    {

    }

    public function execute(int $id, array $data): ?Customer
    {
        $interval = $data['serviceInterval'] ?? 365;

        return $this->customerRepository->updateById($id, [
            'name' => $data['name'],
            'contact_number' => $data['contactNumber'],
            'alternate_contact_number' => $data['alternateContactNumber'] ?? null,
            'email' => $data['email'] ?? null,
            'address' => $data['address'],
            'product_model' => $data['productModel'],
            'installation_date' => $data['installationDate'],
            'service_interval' => $interval,
            'notes' => $data['notes'] ?? null,
        ]);
    }
}
