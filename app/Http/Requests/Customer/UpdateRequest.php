<?php

namespace App\Http\Requests\Customer;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', Customer::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'contactNumber' => 'required|string|max:255',
            'email' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'productModel' => 'required|string|max:255',
            'installationDate' => 'required|string|max:255',
            'serviceInterval' => 'nullable|numeric|min:1|max:365',
            'lastServiceDate' => 'nullable|date_format:Y-m-d',
            'nextServiceDate' => 'nullable|date_format:Y-m-d',
            'resetServiceDate' => 'nullable|boolean',
        ];
    }
}
