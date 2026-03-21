<?php

namespace App\Enums\Permissions;

enum ServicePermission: string
{
    case CREATE = 'create';
    case UPDATE = 'update';
    case VIEW_ANY = 'view-any';
    case VIEW = 'view';
    case DELETE = 'delete';
    case FORCE_DELETE = 'force-delete';
    case RESTORE = 'restore';
    case UPDATE_STATUS = 'update-status';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function key(): string
    {
        return 'service.'.$this->value;
    }
}
