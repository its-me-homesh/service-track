<?php

namespace App\Actions\Service;

use App\Actions\ServiceHistory\CreateServiceHistoryAction;
use App\Enums\ServiceHistoryEventType;
use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;

class RestoreServiceAction
{
    public function __construct(
        private readonly ServiceRepositoryInterface $serviceRepository,
        private readonly CreateServiceHistoryAction $createServiceHistoryAction
    )
    {
    }

    public function execute(Service $service, bool $forceDelete = false): bool
    {
        $restored = $this->serviceRepository->restore($service);
        if (!$forceDelete) {
            $this->createServiceHistoryAction->execute(
                $service,
                ServiceHistoryEventType::RESTORED->value,
                ServiceHistoryEventType::RESTORED->description(),
                [],
            );
        }

        return $restored;
    }
}
