<?php

namespace App\Http\Requests\Service;

use App\Enums\ServiceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
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
            'serviceDate' => 'required', 'date_format:Y-m-d',
            'notes' => 'nullable', 'string',
            'cost' => 'nullable', 'numeric',
            'changeStatus' => 'nullable', 'boolean',
            'status' => [
                'nullable',
                'string',
                Rule::requiredIf(
                    fn() => $this->boolean('changeStatus')
                ),
                Rule::enum(ServiceStatus::class)
            ],
        ];
    }
}
