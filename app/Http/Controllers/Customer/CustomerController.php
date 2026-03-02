<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\DeleteRequest;
use App\Http\Requests\Customer\StoreRequest;
use App\Http\Requests\Customer\UpdateRequest;
use App\Http\Resources\Customers\CustomerCollection;
use App\Models\Customer;
use App\Services\CustomerService;
use Inertia\Inertia;

class CustomerController extends Controller
{

    public function __construct(private CustomerService $customerService)
    {
    }

    public function index()
    {
        \Gate::authorize('viewAny', Customer::class);
        $customers = new CustomerCollection($this->customerService->pagination(request()->all())->appends(request()->all()));

        return Inertia::render('customers/index',[
            'customers' => $customers
        ]);
    }

    public function store(StoreRequest $request)
    {
        \Gate::authorize('create', Customer::class);
        $this->customerService->create($request->validated());
        return back();
    }

    public function update(UpdateRequest $request, int $id)
    {
        \Gate::authorize('update', Customer::class);
        $this->customerService->update($id, $request->validated());
        return back();
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
        return back();
    }

    public function restore(int $id)
    {
        \Gate::authorize('restore', Customer::class);
        $this->customerService->restore($id);
        return back();
    }
}
