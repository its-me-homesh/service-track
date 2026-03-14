<?php

namespace App\Support\Calculators;

use Carbon\Carbon;

class NextServiceDateCalculator
{
    public function calculate(int $intervalInDays, ?string $baseDateString = null): string
    {
        $date = $baseDateString ? Carbon::createFromFormat('Y-m-d', $baseDateString) : Carbon::today();

        return $date->addDays($intervalInDays)->format('Y-m-d');
    }
}
