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

    public function deleting(Service $type): void
    {
        if (!$type->isForceDeleting()) {
            $type->deleted_by_id = auth()->id();
            $type->saveQuietly();
        }
    }

    public function restoring(Service $type): void
    {
        $type->deleted_by_id = null;
    }
}
