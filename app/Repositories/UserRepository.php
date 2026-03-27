<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Concerns\HandlesDatabaseOperators;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class UserRepository implements UserRepositoryInterface
{
    use HandlesDatabaseOperators;

    public function paginate(array $params): LengthAwarePaginator
    {
        $searchTerm = $params['term'] ?? '';
        $orderBy = $params['orderBy'] ?? null;
        $order = $params['order'] ?? 'desc';
        $perPage = (int)($params['perPage'] ?? 15);
        $page = (int)($params['page'] ?? 1);
        $with = $params['with'] ?? [];

        $roles = $params['roles'] ?? [];
        $includeTrashed = (bool)($params['includeTrashed'] ?? false);
        $onlyTrashed = (bool)($params['onlyTrashed'] ?? false);

        $orderBy = in_array($orderBy, User::SORTABLE_COLUMNS, true) ? $orderBy : 'updated_at';

        $likeOperator = $this->likeOperator();

        Paginator::currentPageResolver(fn() => $page);

        return User::query()
            ->when($searchTerm, fn($query) => $query->whereAny(['name', 'email'], $likeOperator, '%' . $searchTerm . '%'))
            ->when($includeTrashed, fn($q) => $q->withTrashed())
            ->when($onlyTrashed, fn($q) => $q->onlyTrashed())
            ->when(!blank($with), fn($q) => $q->with($with))
            ->when(!blank($roles), fn($q) => $q->whereHas('roles', fn($subQuery) => $subQuery->whereIn('id', $roles)))
            ->orderBy($orderBy, $order)
            ->paginate($perPage);
    }

    public function findById(int $id, bool $trashed = false): User
    {
        return User::when($trashed, fn($q) => $q->withTrashed())->findOrFail($id);
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): ?User
    {
        $user->update($data);
        return $user;
    }

    public function delete(User $user, bool $hardDelete = false): bool
    {

        return $hardDelete ? $user->forceDelete() : $user->delete();
    }

    public function restore(User $user): bool
    {
        return $user->restore();
    }

    public function syncRoles(User $user, array $roles): ?User
    {
        $user->syncRoles($roles);
        return $user;
    }
}
