<?php

namespace App\Enums\Permissions;

enum RolePermission: string
{
    case CREATE = 'create';
    case UPDATE = 'update';
    case VIEW_ANY = 'view-any';
    case VIEW = 'view';
    case DELETE = 'delete';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function key(): string
    {
        return 'role.'.$this->value;
    }
}
