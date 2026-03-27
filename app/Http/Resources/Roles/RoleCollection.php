<?php

namespace App\Http\Resources\Roles;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RoleCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request)
    {
        return $this->collection->map(fn($model) => [
            'id' => $model->id,
            'name' => $model->name,
            'guardName' => $model->guard_name,
            'createdAt' => $model->created_at,
            'updatedAt' => $model->updated_at,
            'permissions' => $model->relationLoaded('permissions', fn() => PermissionCollection::make($model->permissions)->resolve())
        ]);
    }
}
