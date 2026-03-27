<?php

namespace App\Actions\User;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class UpdateUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    )
    {
    }

    public function execute(User $user, array $data): ?User
    {
        $password = $user->password;
        if ($data['changePassword']) {
            $password = Hash::make($data['password']);
        }

        $user = $this->userRepository->update($user, [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $password,
        ]);

        $this->userRepository->syncRoles($user, $data['roles'] ?? []);

        return $user->fresh();
    }
}
