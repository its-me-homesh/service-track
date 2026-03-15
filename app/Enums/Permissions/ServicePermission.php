<?php

namespace App\Enums\Permissions;

enum ServicePermission: string
{
    case CREATE = 'create';
    case UPDATE = 'update';
    case LIST = 'list';
    case VIEW = 'view';
    case DELETE = 'delete';
    case FORCE_DELETE = 'force-delete';
    case RESTORE = 'restore';
    case UPDATE_SERVICE_SCHEDULE = 'update-status';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
