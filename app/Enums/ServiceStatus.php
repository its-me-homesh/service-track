<?php

namespace App\Enums;
enum ServiceStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case ON_HOLD = 'on_hold';

    case RESCHEDULED = 'rescheduled';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';


    //These statuses are for future use
    //case ASSIGNED = 'assigned';
    //case EN_ROUTE = 'en_route';
    //case CLOSED = 'closed';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::IN_PROGRESS => 'In Progress',
            self::ON_HOLD => 'On Hold',
            self::RESCHEDULED => 'Rescheduled',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'amber',
            self::IN_PROGRESS => 'blue',
            self::ON_HOLD => 'violet',
            self::RESCHEDULED => 'orange',
            self::COMPLETED => 'green',
            self::CANCELLED => 'red',
        };
    }

    public function transitionAllowedTo(self $nextStatus): bool
    {
        return match ($this) {
            self::PENDING => in_array($nextStatus, [
                self::IN_PROGRESS,
                self::ON_HOLD,
                self::RESCHEDULED,
                self::CANCELLED
            ]),
            self::IN_PROGRESS => in_array($nextStatus, [
                self::ON_HOLD,
                self::RESCHEDULED,
                self::COMPLETED,
                self::CANCELLED
            ]),
            self::ON_HOLD => in_array($nextStatus, [
                self::IN_PROGRESS,
                self::RESCHEDULED,
                self::CANCELLED
            ]),
            self::RESCHEDULED => in_array($nextStatus, [
                self::PENDING,
                self::IN_PROGRESS,
                self::ON_HOLD,
                self::CANCELLED
            ]),
            self::COMPLETED => false,
            self::CANCELLED => false,
        };
    }

}
