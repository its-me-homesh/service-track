<?php

namespace App\Repositories;

use App\Models\ServiceHistory;
use App\Repositories\Contracts\ServiceHistoryRepositoryInterface;

class ServiceHistoryRepository implements ServiceHistoryRepositoryInterface
{
    public function create(array $data): ServiceHistory
    {
        return ServiceHistory::create($data);
    }
}
