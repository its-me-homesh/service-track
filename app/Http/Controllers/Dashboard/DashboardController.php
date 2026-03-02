<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\ServiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Customers\CustomerCollection;
use App\Models\Customer;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function __invoke()
    {
        $serviceCounts = Service::selectRaw(
            "COUNT(CASE WHEN status = ? THEN 1 ELSE NULL END) AS pending,
            COUNT(CASE WHEN status = ? THEN 1 ELSE NULL END) AS assigned,
            COUNT(CASE WHEN status = ? THEN 1 ELSE NULL END) AS in_progress,
            COUNT(CASE WHEN status = ? THEN 1 ELSE NULL END) AS completed",
            [ServiceStatus::PENDING->value, ServiceStatus::ASSIGNED->value, ServiceStatus::IN_PROGRESS->value, ServiceStatus::COMPLETED->value]
        )->first();


        $serviceCounts = Cache::remember('dashboard.serviceCounts', now()->addHours(4), function () {
            $serviceCounts = Service::selectRaw(
                "COUNT(CASE WHEN status = ? THEN 1 ELSE NULL END) AS pending,
            COUNT(CASE WHEN status = ? THEN 1 ELSE NULL END) AS assigned,
            COUNT(CASE WHEN status = ? THEN 1 ELSE NULL END) AS in_progress,
            COUNT(CASE WHEN status = ? THEN 1 ELSE NULL END) AS completed",
                [ServiceStatus::PENDING->value, ServiceStatus::ASSIGNED->value, ServiceStatus::IN_PROGRESS->value, ServiceStatus::COMPLETED->value]
            )->first();
            return [
                'pending' => $serviceCounts->pending ?? 0,
                'assigned' => $serviceCounts->assigned ?? 0,
                'inProgress' => $serviceCounts->in_progress ?? 0,
                'completed' => $serviceCounts->completed ?? 0,
            ];
        });

        $serviceDueInNextSevenDaysCustomers = Cache::remember('dashboard.serviceDueInNextSevenDaysCustomers', now()->addHours(4), function () {
            return Customer::whereBetween('next_service_date', [
                now(),
                now()->addDays(6)
            ])
                ->take(10)
                ->get();
        });



        $serviceOverdueCustomers = Cache::remember('dashboard.serviceOverdueCustomers', now()->addHours(4), function () {
            return Customer::where('next_service_date', ">=", now())->take(10)->get();
        });

        return Inertia::render('dashboard',[
            'serviceDueInNextSevenDaysCustomers' => $serviceDueInNextSevenDaysCustomers,
            'serviceOverdueCustomers' => $serviceOverdueCustomers,
            'serviceCounts' => $serviceCounts,
        ]);
    }
}
