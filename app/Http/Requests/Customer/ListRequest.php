<?php

namespace App\Http\Requests\Customer;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListRequest extends FormRequest
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
            'term' => ['nullable', 'string'],
            'orderBy' => ['nullable', 'string', Rule::in(Customer::SORTABLE_COLUMNS)],
            'order' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'perPage' => ['nullable', 'integer'],
            'page' => ['nullable', 'integer'],
            'includeTrashed' => ['nullable', 'boolean'],
            'onlyTrashed' => ['nullable', 'boolean'],
            'serviceOverdue' => ['nullable', 'boolean'],
            'serviceDue' => ['nullable', 'boolean'],
            'with' => ['nullable', 'array'],
            'with.*' => ['nullable', 'string', Rule::in(Customer::ALLOWED_INCLUDES)],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'includeTrashed' => filter_var(
                $this->query('includeTrashed'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),
            'onlyTrashed' => filter_var(
                $this->query('onlyTrashed'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),
            'serviceOverdue' => filter_var(
                $this->query('serviceOverdue'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),
            'serviceDue' => filter_var(
                $this->query('serviceDue'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),
        ]);
    }
}
