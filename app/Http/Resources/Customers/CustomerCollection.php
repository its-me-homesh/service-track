<?php

namespace App\Http\Resources\Customers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CustomerCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request)
    {
        return $this->collection->map(fn($customer) => [
            'id' => $customer->id,
            'name' => $customer->name,
            'contactNumber' => $customer->contact_number,
            'email' => $customer->email,
            'address' => $customer->address,
            'productModel' => $customer->product_model,
            'installationDate' => $customer->installation_date,
            'serviceInterval' => $customer->service_interval,
            'notes' => $customer->notes,
            'lastServiceDate' => $customer->last_service_date,
            'nextServiceDate' => $customer->next_service_date,
            'createdAt' => $customer->created_at->format('Y-m-d H:i:s'),
            'updatedAt' => $customer->updated_at->format('Y-m-d H:i:s'),
            'deletedAt' => $customer->deleted_at?->format('Y-m-d H:i:s'),
        ]);
    }
}
