<?php

namespace App\Repositories\Contracts;

use App\Models\ServiceHistory;

interface ServiceHistoryRepositoryInterface
{
    public function create(array $data): ServiceHistory;
}
