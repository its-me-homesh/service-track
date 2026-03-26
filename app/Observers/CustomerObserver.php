<?php

namespace App\Observers;

use App\Models\Customer;

class CustomerObserver
{
    public function creating(Customer $model): void
    {
        $model->created_by_id = auth()->id();
        $model->updated_by_id = auth()->id();
    }

    public function updating(Customer $model): void
    {
        $model->updated_by_id = auth()->id();
    }

    public function deleting(Customer $model): void
    {
        if (!$model->isForceDeleting()) {
            $model->deleted_by_id = auth()->id();
            $model->saveQuietly();
        }
    }

    public function restoring(Customer $model): void
    {
        $model->deleted_by_id = null;
    }
}
