<?php

namespace App\Http\Requests\Customer;

use App\Enums\ModelDeleteType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeleteRequest extends FormRequest
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
            'type' => [
                'nullable',
                'string',
                Rule::in(ModelDeleteType::values())
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'type' => $this->type ?? ModelDeleteType::SOFT_DELETE->value,
        ]);
    }
}
