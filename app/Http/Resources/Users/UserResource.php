<?php

namespace App\Http\Resources\Users;

use App\Http\Resources\Roles\RoleCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'createdAt' => $this->created_at->format('Y-m-d H:i:s'),
            'createdBy' => $this->whenLoaded('createdBy', function () {
                return $this->createdBy->only(['id', 'name']);
            }),
            'updatedAt' => $this->updated_at->format('Y-m-d H:i:s'),
            'updatedBy' => $this->whenLoaded('updatedBy', function () {
                return $this->updatedBy->only(['id', 'name']);
            }),
            'deletedAt' => $this->deleted_at?->format('Y-m-d H:i:s'),
            'deletedBy' => $this->whenLoaded('deletedBy', function () {
                return $this->deletedBy->only(['id', 'name']);
            }),
            'roles' => $this->whenLoaded('roles', fn() => RoleCollection::make($model->roles)->resolve($this->roles)),
        ];
    }
}
