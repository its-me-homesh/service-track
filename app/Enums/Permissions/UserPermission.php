<?php

namespace App\Enums\Permissions;

enum UserPermission: string
{
    case CREATE = 'create';
    case UPDATE = 'update';
    case VIEW_ANY = 'view-any';
    case VIEW = 'view';
    case DELETE = 'delete';
    case FORCE_DELETE = 'force-delete';
    case RESTORE = 'restore';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function key(): string
    {
        return 'user.'.$this->value;
    }
}
