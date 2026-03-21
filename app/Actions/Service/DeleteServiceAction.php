<?php

namespace App\Actions\Service;

use App\Actions\ServiceHistory\CreateServiceHistoryAction;
use App\Enums\ServiceHistoryEventType;
use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;

class DeleteServiceAction
{
    public function __construct(
        private readonly ServiceRepositoryInterface $serviceRepository,
        private readonly CreateServiceHistoryAction $createServiceHistoryAction
    )
    {
    }

    public function execute(Service $service, bool $forceDelete = false): bool
    {
        $deleted = $this->serviceRepository->delete($service, $forceDelete);
        if (!$forceDelete) {
            $this->createServiceHistoryAction->execute(
                $service,
                ServiceHistoryEventType::DELETED->value,
                ServiceHistoryEventType::DELETED->description(),
                [],
            );
        }

        return $deleted;
    }
}
