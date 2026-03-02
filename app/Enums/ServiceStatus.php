<?php

namespace App\Enums;
enum ServiceStatus: string
{
    case PENDING = 'Pending';
    case ASSIGNED = 'Assigned';
    case IN_PROGRESS = 'In Progress';
    case COMPLETED = 'Completed';
}
