<?php

namespace App\Services;

use App\Actions\User\CreateUserAction;
use App\Actions\User\DeleteUserAction;
use App\Actions\User\RestoreUserAction;
use App\Actions\User\UpdateUserAction;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    public function __construct(
        private readonly CreateUserAction        $createUserAction,
        private readonly UpdateUserAction        $updateUserAction,
        private readonly DeleteUserAction        $deleteUserAction,
        private readonly RestoreUserAction       $restoreUserAction,
        private readonly UserRepositoryInterface $userRepository
    )
    {
    }

    public function pagination(array $params = []): LengthAwarePaginator
    {
        $params['with'] = collect($params['with'] ?? [])->filter(function ($relation) {
            return method_exists(User::class, $relation);
        })->toArray();

        return $this->userRepository->paginate($params);
    }

    public function create(array $data): User
    {
        return $this->createUserAction->execute($data);
    }

    public function update(User $user, array $data): ?User
    {
        return $this->updateUserAction->execute($user, $data);
    }

    public function delete(User $user, bool $forceDelete = false): bool
    {
        return $this->deleteUserAction->execute($user, $forceDelete);
    }

    public function restore(User $user): bool
    {
        return $this->restoreUserAction->execute($user);
    }

    public function findById(int $id, array $with = [], $trashed = true): ?User
    {
        return $this->userRepository->findById($id, $trashed)->loadMissing($with);
    }
}
