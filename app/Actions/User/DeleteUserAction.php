<?php

namespace App\Actions\User;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class DeleteUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    )
    {
    }

    public function execute(User $user, bool $forceDelete = false): bool
    {
        return $this->userRepository->delete($user, $forceDelete);
    }
}
