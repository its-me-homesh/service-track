<?php

namespace App\Policies;

use App\Enums\Permissions\CustomerPermission;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CustomerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('customer.'.CustomerPermission::LIST->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user): bool
    {
        return $user->can('customer.'.CustomerPermission::VIEW->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('customer.'.CustomerPermission::CREATE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user): bool
    {
        return $user->can('customer.'.CustomerPermission::UPDATE->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $user->can('customer.'.CustomerPermission::DELETE->value);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user): bool
    {
        return $user->can('customer.'.CustomerPermission::RESTORE->value);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user): bool
    {
        return $user->can('customer.'.CustomerPermission::FORCE_DELETE->value);
    }

    public function updateServiceSchedule(User $user): bool
    {
        return $user->can('customer.'.CustomerPermission::UPDATE_SERVICE_SCHEDULE->value);
    }
}
