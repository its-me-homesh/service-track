<?php

namespace App\Http\Resources\Users;

use App\Http\Resources\Roles\RoleCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
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
            'email' => $model->email,
            'createdAt' => $model->created_at,
            'createdBy' => $model->whenLoaded('createdBy', fn () => $model->createdBy),
            'updatedAt' => $model->updated_at,
            'updatedBy' => $model->whenLoaded('updatedBy', fn () => $model->updatedBy),
            'deletedAt' => $model->deleted_at,
            'deletedBy' => $model->whenLoaded('deletedBy', fn () => $model->deletedBy),
            'roles' => $model->whenLoaded('roles', fn() => RoleCollection::make($model->roles)->resolve()),
        ]);
    }
}
