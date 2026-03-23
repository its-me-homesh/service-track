<?php

namespace App\Services;

use App\Models\Service;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class DashboardService
{

    public function __construct(
        private readonly ServiceRepositoryInterface  $serviceRepository,
        private readonly CustomerRepositoryInterface $customerRepository,
    )
    {
    }

    public function counts(): array
    {
        return [
            'totalCustomers' => $this->customerRepository->count(),
            'activeServices' => $this->serviceRepository->active(true),
            'serviceOverdueCustomers' => $this->customerRepository->serviceOverdue(true),
            'todayServices' => $this->serviceRepository->today(true),
            'serviceUpcomingCustomers' => $this->customerRepository->serviceUpcoming(true),
            'completedThisMonthServices' => $this->serviceRepository->completedThisMonthCount()
        ];
    }

    public function serviceOverdueCustomers(): ?Collection
    {
        return $this->customerRepository->serviceOverdue();
    }

    public function serviceUpcomingCustomers(): ?Collection
    {
        return $this->customerRepository->serviceUpcoming();
    }

    public function activeServices(): ?Collection
    {
        return $this->serviceRepository->active(false, [
            'with' => ['customer']
        ]);
    }
}
