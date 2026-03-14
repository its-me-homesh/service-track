<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\DeleteRequest;
use App\Http\Requests\Customer\StoreRequest;
use App\Http\Requests\Customer\UpdateRequest;
use App\Http\Requests\Customer\UpdateServiceScheduleRequest;
use App\Http\Resources\Customers\CustomerCollection;
use App\Http\Resources\Customers\CustomerResource;
use App\Models\Customer;
use App\Services\CustomerService;
use Inertia\Inertia;

class CustomerController extends Controller
{

    public function __construct(private readonly CustomerService $customerService)
    {
    }

    public function index()
    {
        \Gate::authorize('view-any', Customer::class);
        $customers = new CustomerCollection($this->customerService->pagination(request()->all())->appends(request()->all()));

        return Inertia::render('customers/index',[
            'customers' => $customers
        ]);
    }

    public function show(int $id)
    {
        \Gate::authorize('view', Customer::class);
        $customer = CustomerResource::make($this->customerService->find($id))->resolve();
        return Inertia::render('customers/show',[
            'customer' => $customer
        ]);
    }

    public function store(StoreRequest $request)
    {
        \Gate::authorize('create', Customer::class);
        $this->customerService->create($request->validated());
        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function update(UpdateRequest $request, int $id)
    {
        \Gate::authorize('update', Customer::class);
        $this->customerService->update($id, $request->validated());
        return back()->with('success', 'Customer details updated successfully.');
    }

    public function delete(DeleteRequest $request, int $id)
    {
        $validatedData = $request->validated();

        if (($validatedData['type'] ?? null) === 'permanent') {
            \Gate::authorize('force-delete', Customer::class);
            $forceDelete = true;
        } else {
            \Gate::authorize('delete', Customer::class);
            $forceDelete = false;
        }

        $this->customerService->delete($id, $forceDelete);
        $message = 'Customer deleted'.($validatedData['type'] === 'permanent' ? ' permanently' : '').' successfully.';
        return $forceDelete
            ? redirect()->route('customers.index')->with('success', $message)
            : back()->with('success', $message);
    }

    public function restore(int $id)
    {
        \Gate::authorize('restore', Customer::class);
        $this->customerService->restore($id);
        return back()->with('success', 'Customer record is restored successfully.');
    }

    public function updateServiceSchedule(UpdateServiceScheduleRequest $request, int $id)
    {
        \Gate::authorize('update-service-schedule', Customer::class);
        $this->customerService->updateServiceSchedule($id, $request->validated());
        return back()->with('success', 'Customer service schedule settings updated successfully.');
    }
}
