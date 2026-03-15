<?php

namespace App\Policies;

use App\Enums\Permissions\CustomerPermission;
use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(CustomerPermission::VIEW_ANY->key());
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Customer $customer): bool
    {
        return $user->can(CustomerPermission::VIEW->key());
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(CustomerPermission::CREATE->key());
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Customer $customer): bool
    {
        return $user->can(CustomerPermission::UPDATE->key());
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Customer $customer): bool
    {
        return $user->can(CustomerPermission::DELETE->key());
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Customer $customer): bool
    {
        return $user->can(CustomerPermission::RESTORE->key());
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Customer $customer): bool
    {
        return $user->can(CustomerPermission::FORCE_DELETE->key());
    }

    public function updateServiceSchedule(User $user, Customer $customer): bool
    {
        return $user->can(CustomerPermission::UPDATE_SERVICE_SCHEDULE->key());
    }
}
