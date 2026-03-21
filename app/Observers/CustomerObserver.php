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

    public function deleting(Customer $type): void
    {
        if (!$type->isForceDeleting()) {
            $type->deleted_by_id = auth()->id();
            $type->saveQuietly();
        }
    }

    public function restoring(Customer $type): void
    {
        $type->deleted_by_id = null;
    }
}
