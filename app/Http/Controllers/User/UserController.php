<?php

namespace App\Http\Controllers\User;

use App\Enums\ModelDeleteType;
use App\Enums\Permissions\UserPermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\DeleteRequest;
use App\Http\Requests\User\ListRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Http\Resources\Roles\RoleCollection;
use App\Http\Resources\Users\UserCollection;
use App\Models\User;
use App\Services\RoleService;
use App\Services\UserService;
use Inertia\Inertia;

class UserController extends Controller
{

    public function __construct(
        private readonly UserService $userService,
        private readonly RoleService $roleService
    )
    {
    }

    public function index(ListRequest $request)
    {
        $this->authorize(UserPermission::VIEW_ANY->value, User::class);
        $validatedRequest = $request->validated();
        $validatedRequest = array_merge($validatedRequest, ['with' => ['roles', 'createdBy', 'updatedBy']]);

        return Inertia::render('users/index', [
            'users' => new UserCollection($this->userService->pagination($validatedRequest)->appends($validatedRequest)),
            'roles' => RoleCollection::make($this->roleService->all())->resolve(),
        ]);
    }

    public function store(StoreRequest $request)
    {
        $this->authorize(UserPermission::CREATE->value, User::class);
        $this->userService->create($request->validated());
        return back()->with('success', 'User created successfully.');
    }

    public function update(UpdateRequest $request, int $id)
    {
        $user = $this->userService->findById($id);
        $this->authorize(UserPermission::UPDATE->value, $user);

        $this->userService->update($user, $request->validated());
        return back()->with('success', 'User details updated successfully.');
    }

    public function delete(DeleteRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $user = $this->userService->findById($id);

        if (($validatedData['type'] ?? null) === ModelDeleteType::PERMANENTLY->value) {
            $this->authorize(UserPermission::FORCE_DELETE->value, $user);
            $forceDelete = true;
        } else {
            $this->authorize(UserPermission::DELETE->value, $user);
            $forceDelete = false;
        }

        $this->userService->delete($user, $forceDelete);
        $message = 'User deleted' . ($validatedData['type'] === 'permanent' ? ' permanently' : '') . ' successfully.';
        return $forceDelete
            ? redirect()->route('users.index')->with('success', $message)
            : back()->with('success', $message);
    }

    public function restore(int $id)
    {
        $user = $this->userService->findById($id);
        $this->authorize(UserPermission::RESTORE->value, $user);
        $this->userService->restore($user);
        return back()->with('success', 'User record restored successfully.');
    }
}
