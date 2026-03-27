<?php

namespace App\Actions\User;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class RestoreUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    )
    {
    }

    public function execute(User $user, bool $forceDelete = false): bool
    {
        return $this->userRepository->restore($user);
    }
}
