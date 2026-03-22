<?php

namespace App\Models;

use App\Observers\CustomerObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy(CustomerObserver::class)]
class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'contact_number',
        'alternate_contact_number',
        'email',
        'address',
        'product_model',
        'installation_date',
        'service_interval',
        'notes',
        'last_service_date',
        'next_service_date',
        'created_by_id',
        'updated_by_id',
        'deleted_by_id',
    ];

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

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function recentServices(): HasMany
    {
        return $this->hasMany(Service::class)->latest('service_date')->limit(10);
    }

    public function lastService(): HasOne
    {
        return $this->hasOne(Service::class)->latest('updated_at');
    }
}
