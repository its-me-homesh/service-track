<?php

namespace App\Actions\Customer;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Support\Calculators\NextServiceDateCalculator;

class UpdateServiceScheduleAction
{
    public function __construct(
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly NextServiceDateCalculator   $nextServiceDateCalculator
    )
    {

    }

    public function execute(int $id, array $data): ?Customer
    {
        $customer = $this->customerRepository->findById($id, true);

        $interval = $customer->service_interval ?? 365;
        $baseDateString = $data['lastServiceDate'] ?? $customer->installation_date ?? null;
        if ($data['autoCalculateNextServiceDate']) {
            $nextServiceDate = $this->nextServiceDateCalculator->calculate($interval, $baseDateString);
        } else {
            $nextServiceDate = $data['nextServiceDate'] ?? null;
        }

        return $this->customerRepository->updateById($id, [
            'last_service_date' => $data['lastServiceDate'] ?? null,
            'next_service_date' => $nextServiceDate
        ]);
    }
}
