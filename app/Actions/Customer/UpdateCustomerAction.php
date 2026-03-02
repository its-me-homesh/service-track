<?php

namespace App\Actions\Customer;

use App\Models\Customer;
use App\Repositories\Contacts\CustomerRepositoryInterface;
use Carbon\Carbon;

class UpdateCustomerAction
{

    public function __construct(private CustomerRepositoryInterface $customerRepository)
    {

    }

    private function calculateNextServiceDate(int $days, Carbon|string|null $date = null): string
    {
        return $date ? Carbon::parse($date)->addDays($days) : Carbon::now()->addDays($days);
    }

    public function execute(int $id, array $data): ?Customer
    {
        $customer = $this->customerRepository->findById($id);
        $interval = $data['serviceInterval'] ?? $customer->service_interval;

        if ($data['resetServiceDate'] === true) {
            $data['nextServiceDate'] = $this->calculateNextServiceDate($interval, $data['installationDate']);
        }

        return $this->customerRepository->updateById($id, [
            'name' => $data['name'],
            'contact_number' => $data['contactNumber'],
            'email' => $data['email'] ?? null,
            'address' => $data['address'],
            'product_model' => $data['productModel'],
            'installation_date' => $data['installationDate'],
            'service_interval' => $interval,
            'last_service_date' => $data['lastServiceDate'] ?? null,
            'next_service_date' => $data['nextServiceDate'] ?: ($data['resetServiceDate'] === true ? $this->calculateNextServiceDate($interval, $data['installationDate']) : null),
        ]);
    }
}
