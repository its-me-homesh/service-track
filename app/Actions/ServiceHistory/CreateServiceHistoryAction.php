<?php

namespace App\Actions\ServiceHistory;

use App\Models\Service;
use App\Repositories\Contracts\ServiceHistoryRepositoryInterface;

class CreateServiceHistoryAction
{
    public function __construct(
        private readonly ServiceHistoryRepositoryInterface $serviceHistoryRepository,
    )
    {

    }

    public function execute(Service $service, string $eventType, ?string $description = null, ?array $changes = null): void {
        $this->serviceHistoryRepository->create([
            'service_id' => $service->id,
            'event_type' => $eventType,
            'description' => $description,
            'changes' => $changes ?: null,
            'created_by_id' => auth()->id(),
        ]);
    }
}
