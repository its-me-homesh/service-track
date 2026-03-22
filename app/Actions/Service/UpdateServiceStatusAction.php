<?php

namespace App\Actions\Service;

use App\Actions\Customer\UpdateServiceScheduleAction;
use App\Actions\ServiceHistory\CreateServiceHistoryAction;
use App\Enums\ServiceHistoryEventType;
use App\Enums\ServiceStatus;
use App\Models\Service;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Support\Comparisons\ChangeSetBuilder;
use App\Support\Validators\ServiceStatusTransitionValidator;
use Illuminate\Validation\ValidationException;

class UpdateServiceStatusAction
{
    public function __construct(
        private readonly ServiceRepositoryInterface       $serviceRepository,
        private readonly ServiceStatusTransitionValidator $serviceStatusTransitionValidator,
        private readonly CreateServiceHistoryAction       $createServiceHistoryAction,
        private readonly ChangeSetBuilder                 $serviceChangeBuilder,
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly UpdateServiceScheduleAction $updateServiceScheduleAction
    )
    {

    }

    public function execute(Service $service, array $data): ?Service
    {
        $currentStatus = $service->status instanceof ServiceStatus ? $service->status : ServiceStatus::from($service->status);
        $status = ServiceStatus::from($data['status']);
        try {
            $this->serviceStatusTransitionValidator->validateOrFail($currentStatus, $status);
        } catch (\DomainException $e) {
            throw ValidationException::withMessages([
                'status' => $e->getMessage(),
            ]);
        }

        $oldValues = [
            'notes' => $service->notes,
            'status' => $currentStatus->label(),
        ];

        $updatedService = $this->serviceRepository->update($service, [
            'status' => $status,
            'notes' => $data['notes'] ?? $service->notes,
        ]);

        if ($currentStatus !== $status && $updatedService->status === ServiceStatus::COMPLETED) {
            $customer = $this->customerRepository->findByIdOrNull($updatedService->customer_id, true);
            if ($customer) {
                $this->updateServiceScheduleAction->execute($customer, [
                    'autoCalculateNextServiceDate' => true,
                    'lastServiceDate' => $updatedService->service_date,
                ]);
            }
        }

        $newValues = [
            'notes' => $updatedService->notes,
            'status' => $status->label(),
        ];

        $changes = $this->serviceChangeBuilder->buildFrom($oldValues, $newValues);

        if ($changes) {
            $this->createServiceHistoryAction->execute(
                $updatedService,
                ServiceHistoryEventType::STATUS_CHANGED->value,
                ServiceHistoryEventType::STATUS_CHANGED->description(),
                $changes,
            );
        }

        return $updatedService;
    }
}
