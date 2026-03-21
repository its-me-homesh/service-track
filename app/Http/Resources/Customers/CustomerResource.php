<?php

namespace App\Http\Resources\Customers;

use App\Http\Resources\Services\ServiceCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'contactNumber' => $this->contact_number,
            'alternateContactNumber' => $this->alternate_contact_number,
            'email' => $this->email,
            'address' => $this->address,
            'productModel' => $this->product_model,
            'installationDate' => $this->installation_date,
            'serviceInterval' => $this->service_interval,
            'notes' => $this->notes,
            'lastServiceDate' => $this->last_service_date,
            'nextServiceDate' => $this->next_service_date,
            'createdAt' => $this->created_at->format('Y-m-d H:i:s'),
            'updatedAt' => $this->updated_at->format('Y-m-d H:i:s'),
            'deletedAt' => $this->deleted_at?->format('Y-m-d H:i:s'),
            'services' => $this->whenLoaded('services'),
            'recentServices' => $this->whenLoaded('recentServices', fn() => ServiceCollection::make($this->recentServices)->resolve()),
        ];
    }
}
