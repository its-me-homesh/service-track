<?php

namespace App\Http\Resources\Services;

use App\Enums\ServiceStatus;
use App\Http\Resources\Customers\CustomerResource;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ServiceCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request)
    {
        return $this->collection->map(fn($service) => [
            'id' => $service->id,
            'customerId' => $service->customer_id,
            'customer' => $service->whenLoaded('customer', fn () => CustomerResource::make($service->customer)->resolve()),
            'serviceDate' => $service->service_date,
            'notes' => $service->notes,
            'cost' => $service->cost,
            'status' => $service->status,
            'statusDetail' => [
                'value' => $service->status,
                'color' => ServiceStatus::from($service->status)->color(),
                'label' => ServiceStatus::from($service->status)->label(),
            ],
            'createdAt' => $service->created_at,
            'createdBy' => $service->whenLoaded('createdBy', fn () => $service->createdBy),
            'updatedAt' => $service->updated_at,
            'updatedBy' => $service->whenLoaded('updatedBy', fn () => $service->updatedBy),
            'deletedAt' => $service->deleted_at,
            'deletedBy' => $service->whenLoaded('deletedBy', fn () => $service->deletedBy),
        ]);
    }
}
