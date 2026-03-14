<?php

namespace App\Actions\Customer;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Support\Calculators\NextServiceDateCalculator;

class CreateCustomerAction
{

    public function __construct(
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly NextServiceDateCalculator   $nextServiceDateCalculator
    )
    {

    }

    public function execute(array $data): Customer
    {
        $interval = $data['serviceInterval'] ?? 365;
        $baseDateString = $data['lastServiceDate'] ?? $data['installationDate'] ?? null;
        if ($data['autoCalculateNextServiceDate']) {
            $nextServiceDate = $this->nextServiceDateCalculator->calculate($interval, $baseDateString);
        } else {
            $nextServiceDate = $data['nextServiceDate'] ?? null;
        }

        return $this->customerRepository->create([
            'name' => $data['name'],
            'contact_number' => $data['contactNumber'],
            'alternate_contact_number' => $data['alternateContactNumber'] ?? null,
            'email' => $data['email'],
            'address' => $data['address'],
            'product_model' => $data['productModel'],
            'installation_date' => $data['installationDate'],
            'service_interval' => $interval,
            'notes' => $data['notes'] ?? null,
            'last_service_date' => $data['lastServiceDate'] ?? null,
            'next_service_date' => $nextServiceDate,
        ]);
    }
}
