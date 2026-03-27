<?php

namespace App\Http\Requests\User;

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
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'roles' => ['required', 'array'],
            'roles.*' => ['integer'],

            'changePassword' => 'nullable', 'boolean',
            'password' => [
                'nullable',
                'string',
                Rule::requiredIf(
                    fn() => $this->boolean('changePassword')
                )
            ],
        ];
    }
}
