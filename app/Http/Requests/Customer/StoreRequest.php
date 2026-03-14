<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'alternateContactNumber' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'productModel' => 'required|string|max:255',
            'installationDate' => 'required|date_format:Y-m-d',
            'serviceInterval' => 'nullable|numeric|min:1|max:1826',
            'notes' => 'nullable|string',
            'lastServiceDate' => 'nullable|date_format:Y-m-d',
            'advanceServiceSettings' => 'nullable|boolean',
            'autoCalculateNextServiceDate' => 'nullable|boolean',
            'nextServiceDate' => [
                'nullable',
                'date_format:Y-m-d',
                Rule::requiredIf(
                    fn () => $this->boolean('advanceServiceSettings')
                        && !$this->boolean('autoCalculateNextServiceDate')
                ),
            ],
        ];
    }
}
