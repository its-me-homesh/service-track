<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function creating(User $model): void
    {
        $model->created_by_id = auth()->id();
        $model->updated_by_id = auth()->id();
    }

    public function updating(User $model): void
    {
        $model->updated_by_id = auth()->id();
    }

    public function deleting(User $model): void
    {
        if (!$model->isForceDeleting()) {
            $model->deleted_by_id = auth()->id();
            $model->saveQuietly();
        }
    }

    public function restoring(User $model): void
    {
        $model->deleted_by_id = null;
    }
}
