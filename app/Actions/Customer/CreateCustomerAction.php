<?php

namespace App\Actions\Customer;

use App\Models\Customer;
use App\Repositories\Contacts\CustomerRepositoryInterface;
use Carbon\Carbon;

class CreateCustomerAction
{

    public function __construct(private CustomerRepositoryInterface $customerRepository)
    {

    }

    private function calculateNextServiceDate(int $days, Carbon|string|null $date = null): string
    {
        return $date ? Carbon::parse($date)->addDays($days) : Carbon::now()->addDays($days);
    }

    public function execute(array $data): Customer
    {
        $interval = $data['serviceInterval'] ?? 365;
        return $this->customerRepository->create([
            'name' => $data['name'],
            'contact_number' => $data['contactNumber'],
            'email' => $data['email'],
            'address' => $data['address'],
            'product_model' => $data['productModel'],
            'installation_date' => $data['installationDate'],
            'service_interval' => $interval,
            'last_service_date' => $data['lastServiceDate'] ?? null,
            'next_service_date' => $data['nextServiceDate'] ?? $this->calculateNextServiceDate($interval, $data['installationDate']),
        ]);
    }
}
