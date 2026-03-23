<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\Customers\CustomerCollection;
use App\Http\Resources\Services\ServiceCollection;
use App\Services\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService)
    {
    }

    public function __invoke()
    {
        return Inertia::render('dashboard',[
            'counts' => $this->dashboardService->counts(),
            'serviceOverdueCustomers' => CustomerCollection::make($this->dashboardService->serviceOverdueCustomers())->resolve(),
            'serviceUpcomingCustomers' => CustomerCollection::make($this->dashboardService->serviceUpcomingCustomers())->resolve(),
            'activeServices' => ServiceCollection::make($this->dashboardService->activeServices())->resolve(),
        ]);
    }
}
