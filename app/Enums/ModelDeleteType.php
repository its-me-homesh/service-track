<?php

namespace App\Enums;

enum ModelDeleteType: string {
    case PERMANENTLY = 'permanent';
    case SOFT_DELETE = 'soft';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
