<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceScheduleRequest extends FormRequest
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
            'lastServiceDate' => 'nullable|date|date_format:Y-m-d',
            'autoCalculateNextServiceDate' => 'nullable|boolean',
            'nextServiceDate' => [
                'nullable',
                'date_format:Y-m-d',
                Rule::requiredIf(
                    fn () => !$this->boolean('autoCalculateNextServiceDate')
                ),
            ],
        ];
    }
}
