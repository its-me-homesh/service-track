<?php

use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Services\DashboardService;
use Mockery as M;

it('returns aggregated counts from repositories', function () {
    $serviceRepo = M::mock(ServiceRepositoryInterface::class);
    $customerRepo = M::mock(CustomerRepositoryInterface::class);

    $customerRepo->shouldReceive('count')->once()->andReturn(10);
    $serviceRepo->shouldReceive('active')->once()->with(true)->andReturn(4);
    $customerRepo->shouldReceive('serviceOverdue')->once()->with(true)->andReturn(2);
    $serviceRepo->shouldReceive('today')->once()->with(true)->andReturn(1);
    $customerRepo->shouldReceive('serviceUpcoming')->once()->with(true)->andReturn(3);
    $serviceRepo->shouldReceive('completedThisMonthCount')->once()->andReturn(5);

    $service = new DashboardService($serviceRepo, $customerRepo);

    $counts = $service->counts();

    expect($counts)->toBe([
        'totalCustomers' => 10,
        'activeServices' => 4,
        'serviceOverdueCustomers' => 2,
        'todayServices' => 1,
        'serviceUpcomingCustomers' => 3,
        'completedThisMonthServices' => 5,
    ]);
});
