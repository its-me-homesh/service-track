<?php

namespace App\Http\Controllers\User;

use App\Enums\Permissions\RolePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRequest;
use App\Http\Requests\Role\UpdateRequest;
use App\Http\Resources\Roles\PermissionCollection;
use App\Http\Resources\Roles\RoleCollection;
use App\Services\RoleService;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{

    public function __construct(
        private readonly RoleService $roleService
    )
    {
    }

    public function index()
    {
        $this->authorize(RolePermission::VIEW_ANY->value, Role::class);

        return Inertia::render('roles/index', [
            'roles' => RoleCollection::make($this->roleService->all(['with' => ['permissions']]))->resolve(),
            'permissions' => PermissionCollection::make($this->roleService->permissions())->resolve(),
        ]);
    }

    public function store(StoreRequest $request)
    {
        $this->authorize(RolePermission::CREATE->value, Role::class);
        $this->roleService->create($request->validated());
        return back()->with('success', 'Role created successfully.');
    }

    public function update(UpdateRequest $request, int $id)
    {
        $role = $this->roleService->findById($id);
        $this->authorize(RolePermission::UPDATE->value, $role);

        $this->roleService->update($role, $request->validated());
        return back()->with('success', 'Role details updated successfully.');
    }

    public function delete(int $id)
    {
        $role = $this->roleService->findById($id);

        $this->authorize(RolePermission::DELETE->value, $role);

        $this->roleService->delete($role);
        return back()->with('success', 'Role deleted successfully.');
    }
}
