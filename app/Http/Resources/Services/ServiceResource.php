<?php

namespace App\Http\Resources\Services;

use App\Enums\ServiceStatus;
use App\Http\Resources\Customers\CustomerResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'customerId' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', function () {
                return new CustomerResource($this->customer);
            }),
            'serviceDate' => $this->service_date,
            'notes' => $this->notes,
            'cost' => $this->cost,
            'status' => $this->status,
            'statusDetail' => [
                'value' => $this->status,
                'color' => ServiceStatus::from($this->status)->color(),
                'label' => ServiceStatus::from($this->status)->label(),
            ],
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
        ];
    }
}
