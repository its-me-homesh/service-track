<?php

namespace App\Http\Resources\ServiceHistories;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ServiceHistoryCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request)
    {
        return $this->collection->map(fn($serviceHistory) => [
            'id' => $serviceHistory->id,
            'serviceId' => $serviceHistory->service_id,
            'eventType' => $serviceHistory->event_type,
            'description' => $serviceHistory->description,
            'changes' => $serviceHistory->changes,
            'createdAt' => $serviceHistory->created_at,
            'createdById' => $serviceHistory->created_by_id,
            'createdBy' => $serviceHistory->relationLoaded('createdBy')
                ? $serviceHistory->createdBy?->only(['id', 'name'])
                : null,
            'updatedAt' => $serviceHistory->updated_at,
        ]);
    }
}
