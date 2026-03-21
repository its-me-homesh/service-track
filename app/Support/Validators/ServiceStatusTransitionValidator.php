<?php

namespace App\Support\Validators;

use App\Enums\ServiceStatus;

class ServiceStatusTransitionValidator
{
    public function isValid(ServiceStatus $currentStatus, ServiceStatus $nextStatus): bool
    {
        return $currentStatus->transitionAllowedTo($nextStatus);
    }

    public function message(ServiceStatus $currentStatus, ServiceStatus $nextStatus): string
    {
        return "The status cannot be changed from {$currentStatus->label()} to {$nextStatus->label()}.";
    }

    public function validateOrFail(ServiceStatus $currentStatus, ServiceStatus $nextStatus): void
    {
        if (!$this->isValid($currentStatus, $nextStatus)) {
            throw new \DomainException(
                $this->message($currentStatus, $nextStatus)
            );
        }
    }
}
