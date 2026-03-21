<?php

namespace App\Policies;

use App\Enums\Permissions\ServicePermission;
use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(ServicePermission::VIEW_ANY->key());
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Service $service): bool
    {
        return $user->can(ServicePermission::VIEW->key());
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(ServicePermission::CREATE->key());
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Service $service): bool
    {
        return $user->can(ServicePermission::UPDATE->key());
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Service $service): bool
    {
        return $user->can(ServicePermission::DELETE->key());
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Service $service): bool
    {
        return $user->can(ServicePermission::RESTORE->key());
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Service $service): bool
    {
        return $user->can(ServicePermission::FORCE_DELETE->key());
    }

    public function updateStatus(User $user, Service $service): bool
    {
        return $user->can(ServicePermission::UPDATE_STATUS->key());
    }
}
