<?php

namespace App\Models;

use App\Enums\ServiceStatus;
use App\Observers\ServiceObserver;
use App\Repositories\Concerns\HandlesDatabaseOperators;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy(ServiceObserver::class)]
class Service extends Model
{
    use SoftDeletes, HasFactory;
    use HandlesDatabaseOperators;

    protected $fillable = [
        'customer_id',
        'assigned_to_id',
        'service_date',
        'notes',
        'cost',
        'status',
        'created_by_id',
        'updated_by_id',
        'deleted_by_id',
    ];

    public const SORTABLE_COLUMNS = [
        'id',
        'customer_id',
        'assigned_to_id',
        'service_date',
        'cost',
        'status',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public const ALLOWED_INCLUDES = [
        'customer',
        'assignedTo',
        'createdBy',
        'updatedBy',
        'deletedBy',
        'histories'
    ];

    public function scopeSearch(Builder $query, ?string $searchTerm): Builder
    {
        $likeOperator = $this->likeOperator();
        return $query->when($searchTerm, fn ($query) =>
        $query->where(fn ($q) => $q->whereAny(['status', 'cost', 'service_date'], $likeOperator, "%{$searchTerm}%")
                ->orWhereHas('customer', fn ($customerQuery) =>
                    $customerQuery->whereAny(['name', 'contact_number', 'email'], $likeOperator, "%{$searchTerm}%")
                )
            )
        );
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', [
            ServiceStatus::PENDING->value,
            ServiceStatus::IN_PROGRESS->value,
            ServiceStatus::ON_HOLD->value,
            ServiceStatus::RESCHEDULED->value
        ]);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_id');
    }

    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by_id');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(ServiceHistory::class)->latest();
    }
}
