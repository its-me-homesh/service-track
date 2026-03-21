<?php

namespace App\Enums;
enum ServiceHistoryEventType: string
{
    case CREATED = 'created';
    case STATUS_CHANGED = 'status_changed';
    case UPDATED = 'updated';
    case DELETED = 'deleted';
    case RESTORED = 'restored';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::CREATED => 'Created',
            self::STATUS_CHANGED => 'Status Changed',
            self::UPDATED => 'Updated',
            self::DELETED => 'Deleted',
            self::RESTORED => 'Restored',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::CREATED => 'Service Created',
            self::STATUS_CHANGED => 'Service Status Changed',
            self::UPDATED => 'Service Details Updated',
            self::DELETED => 'Service Deleted',
            self::RESTORED => 'Service Restored',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::CREATED => 'sky',
            self::STATUS_CHANGED => 'amber',
            self::UPDATED => 'slate',
            self::DELETED => 'red',
            self::RESTORED => 'emerald',
        };
    }
}
