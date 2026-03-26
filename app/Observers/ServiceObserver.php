<?php

namespace App\Observers;

use App\Models\Service;

class ServiceObserver
{
    public function creating(Service $model): void
    {
        $model->created_by_id = auth()->id();
        $model->updated_by_id = auth()->id();
    }

    public function updating(Service $model): void
    {
        $model->updated_by_id = auth()->id();
    }

    public function deleting(Service $model): void
    {
        if (!$model->isForceDeleting()) {
            $model->deleted_by_id = auth()->id();
            $model->saveQuietly();
        }
    }

    public function restoring(Service $model): void
    {
        $model->deleted_by_id = null;
    }
}
