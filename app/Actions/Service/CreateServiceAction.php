<?php

namespace App\Actions\Service;

use App\Actions\ServiceHistory\CreateServiceHistoryAction;
use App\Enums\ServiceHistoryEventType;
use App\Models\Service;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CreateServiceAction
{
    public function __construct(
        private readonly ServiceRepositoryInterface  $serviceRepository,
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly CreateServiceHistoryAction  $createServiceHistoryAction
    )
    {
    }

    public function execute(array $data): Service
    {
        $customer = $this->customerRepository->findByIdOrNull($data['customerId']);
        if (!$customer) {
            throw ValidationException::withMessages([
                'customerId' => 'The selected customer is invalid.',
            ]);
        }
        $service = $this->serviceRepository->create([
            'customer_id' => $customer->id,
            'service_date' => $data['serviceDate'],
            'notes' => $data['notes'] ?? null,
            'cost' => $data['cost'] ?? null
        ]);

        $this->createServiceHistoryAction->execute(
            $service,
            ServiceHistoryEventType::CREATED->value,
            ServiceHistoryEventType::CREATED->description(),
            [
                'customer_id' => ['old' => null, 'new' => $service->customer_id],
                'service_date' => ['old' => null, 'new' => $service->service_date],
                'status' => ['old' => null, 'new' => $service->status],
                'cost' => ['old' => null, 'new' => $service->cost],
                'notes' => ['old' => null, 'new' => $service->notes],
            ],
        );

        return $service;
    }
}
