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

class UpdateServiceStatusAction
{
    public function __construct(
        private readonly ServiceRepositoryInterface       $serviceRepository,
        private readonly ServiceStatusTransitionValidator $serviceStatusTransitionValidator,
        private readonly CreateServiceHistoryAction       $createServiceHistoryAction,
        private readonly ChangeSetBuilder                 $serviceChangeBuilder,
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
            'status' => $service->status,
        ];

        $updatedService = $this->serviceRepository->update($service, [
            'status' => $status,
            'notes' => $data['notes'] ?? $service->notes,
        ]);

        $newValues = [
            'notes' => $updatedService->notes,
            'status' => $updatedService->status,
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
