<?php

namespace App\Http\Requests\Service;

use App\Enums\ServiceStatus;
use App\Models\Service;
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
            'customerId' => ['nullable', 'array'],
            'customerId.*' => ['integer'],
            'status' => ['nullable', 'array'],
            'status.*' => ['string', Rule::enum(ServiceStatus::class)],
            'term' => ['nullable', 'string'],
            'orderBy' => ['nullable', 'string', Rule::in(Service::SORTABLE_COLUMNS)],
            'order' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'perPage' => ['nullable', 'integer'],
            'page' => ['nullable', 'integer'],
            'includeTrashed' => ['nullable', 'boolean'],
            'onlyTrashed' => ['nullable', 'boolean'],
            'with' => ['nullable', 'array'],
            'with.*' => ['nullable', 'string', Rule::in(Service::ALLOWED_INCLUDES)],
        ];
    }

    protected function prepareForValidation(): void
    {
        $customerId = $this->query('customerId');
        $status = $this->query('status');
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
            'customerId' => is_null($customerId)
                ? null
                : (is_array($customerId) ? $customerId : [$customerId]),
            'status' => is_null($status)
                ? null
                : (is_array($status) ? $status : [$status]),
        ]);
    }
}
