<?php

namespace App\Repositories\Concerns;

use Illuminate\Support\Facades\DB;

trait HandlesDatabaseOperators
{
    private ?string $likeOperator = null;

    protected function likeOperator(): string
    {
        return $this->likeOperatorCache ??= (DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like');
    }
}
