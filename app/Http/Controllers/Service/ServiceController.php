<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $serviceDueInNextSeveralDays = Customer::take(10)->get();

        return Inertia::render('services/index',[
            'serviceDueInNextSeveralDays' => $serviceDueInNextSeveralDays
        ]);
    }
}
