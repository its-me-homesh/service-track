<?php

namespace App\Actions\Service;

use App\Actions\ServiceHistory\CreateServiceHistoryAction;
use App\Enums\ServiceHistoryEventType;
use App\Enums\ServiceStatus;
use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Support\Comparisons\ChangeSetBuilder;
use App\Support\Validators\ServiceStatusTransitionValidator;
use Illuminate\Validation\ValidationException;

class UpdateServiceAction
{
    public function __construct(
        private readonly ServiceRepositoryInterface       $serviceRepository,
        private readonly CreateServiceHistoryAction       $createServiceHistoryAction,
        private readonly ServiceStatusTransitionValidator $serviceStatusTransitionValidator,
        private readonly ChangeSetBuilder                 $serviceChangeBuilder,
    )
    {}

    public function execute(Service $service, array $data): ?Service
    {
        $status = ServiceStatus::from($service->status);
        if ($data['changeStatus']) {
            $currentStatus = $service->status instanceof ServiceStatus ? $service->status : ServiceStatus::from($service->status);
            $status = ServiceStatus::from($data['status']);
            try {
                $this->serviceStatusTransitionValidator->validateOrFail($currentStatus, $status);
            } catch (\DomainException $e) {
                throw ValidationException::withMessages([
                    'status' => $e->getMessage(),
                ]);
            }
        }

        $oldValues = [
            'service_date' => $service->service_date,
            'notes' => $service->notes,
            'cost' => $service->cost,
            'status' => $service->status,
        ];

        $updatedService = $this->serviceRepository->update($service, [
            'service_date' => $data['serviceDate'],
            'notes' => $data['notes'] ?? null,
            'cost' => $data['cost'] ?? null,
            'status' => $status,
        ]);

        $newValues = [
            'service_date' => $updatedService->service_date,
            'notes' => $updatedService->notes,
            'cost' => $updatedService->cost,
            'status' => $updatedService->status,
        ];

        $changes = $this->serviceChangeBuilder->buildFrom($oldValues, $newValues);

        if ($changes) {
            $this->createServiceHistoryAction->execute(
                $updatedService,
                ServiceHistoryEventType::UPDATED->value,
                ServiceHistoryEventType::UPDATED->description(),
                $changes,
            );
        }

        return $updatedService;
    }
}
