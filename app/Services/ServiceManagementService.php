<?php

namespace App\Services;

use App\Actions\Service\CreateServiceAction;
use App\Actions\Service\DeleteServiceAction;
use App\Actions\Service\RestoreServiceAction;
use App\Actions\Service\UpdateServiceAction;
use App\Actions\Service\UpdateServiceStatusAction;
use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ServiceManagementService
{

    public function __construct(
        private readonly CreateServiceAction        $createServiceAction,
        private readonly UpdateServiceAction        $updateServiceAction,
        private readonly DeleteServiceAction        $deleteServiceAction,
        private readonly UpdateServiceStatusAction $updateServiceStatusAction,
        private readonly RestoreServiceAction       $restoreServiceAction,
        private readonly ServiceRepositoryInterface  $serviceRepository
    )
    {
    }

    public function pagination(array $params = []): LengthAwarePaginator
    {
        $params['with'] = collect($params['with'] ?? [])->filter(function ($relation) {
            return method_exists(Service::class, $relation);
        })->toArray();

        return $this->serviceRepository->paginate($params);
    }

    public function create(array $data): Service
    {
        return $this->createServiceAction->execute($data);
    }

    public function update(Service $service, array $data): ?Service
    {
        return $this->updateServiceAction->execute($service, $data);
    }

    public function delete(Service $service, bool $forceDelete = false): bool
    {
        return $this->deleteServiceAction->execute($service, $forceDelete);
    }

    public function restore(Service $service): bool
    {
        return $this->restoreServiceAction->execute($service);
    }

    public function findById(int $id, array $with = [], $trashed = true): ?Service
    {
        return $this->serviceRepository->findById($id, $trashed)->loadMissing($with);
    }

    public function updateServiceStatus(Service $service, array $data): ?Service
    {
        return $this->updateServiceStatusAction->execute($service, $data);
    }
}
