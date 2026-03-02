<?php

namespace App\Enums\Permissions;

enum CustomerPermission: string
{
    case CREATE = 'customer.create';
    case UPDATE = 'customer.update';
    case LIST = 'customer.list';
    case VIEW = 'customer.view';
    case DELETE = 'customer.delete';
    case FORCE_DELETE = 'customer.force-delete';
    case RESTORE = 'customer.restore';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
