<?php

namespace App\Http\Controllers\Customer;

use App\Enums\ModelDeleteType;
use App\Enums\Permissions\CustomerPermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\DeleteRequest;
use App\Http\Requests\Customer\ListRequest;
use App\Http\Requests\Customer\StoreRequest;
use App\Http\Requests\Customer\UpdateRequest;
use App\Http\Requests\Customer\UpdateServiceScheduleRequest;
use App\Http\Resources\Customers\CustomerCollection;
use App\Http\Resources\Customers\CustomerResource;
use App\Models\Customer;
use App\Services\CustomerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{

    public function __construct(private readonly CustomerService $customerService)
    {
    }

    public function index(ListRequest $request)
    {
        $this->authorize(CustomerPermission::VIEW_ANY->value, Customer::class);
        $validatedRequest = $request->validated();

        return Inertia::render('customers/index',[
            'customers' => new CustomerCollection($this->customerService->pagination($validatedRequest)->appends($validatedRequest))
        ]);
    }

    public function show(int $id)
    {
        $customer = $this->customerService->findById($id);
        $this->authorize(CustomerPermission::VIEW->value, $customer);
        $customer->loadMissing(['recentServices.createdBy', 'recentServices.updatedBy', 'lastService.updatedBy']);
        return Inertia::render('customers/show',[
            'customer' => CustomerResource::make($customer)->resolve()
        ]);
    }

    public function store(StoreRequest $request)
    {
        $this->authorize(CustomerPermission::CREATE->value, Customer::class);
        $this->customerService->create($request->validated());
        return back()
            ->with('success', 'Customer created successfully.');
    }

    public function update(UpdateRequest $request, int $id)
    {
        $customer = $this->customerService->findById($id);
        $this->authorize(CustomerPermission::UPDATE->value, $customer);
        $this->customerService->update($customer, $request->validated());
        return back()->with('success', 'Customer details updated successfully.');
    }

    public function delete(DeleteRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $customer = $this->customerService->findById($id);

        if (($validatedData['type'] ?? null) === ModelDeleteType::PERMANENTLY->value) {
            $this->authorize(CustomerPermission::FORCE_DELETE->value, $customer);
            $forceDelete = true;
        } else {
            $this->authorize(CustomerPermission::DELETE->value, $customer);
            $forceDelete = false;
        }

        $this->customerService->delete($customer, $forceDelete);
        $message = 'Customer deleted'.($validatedData['type'] === 'permanent' ? ' permanently' : '').' successfully.';
        return $forceDelete
            ? redirect()->route('customers.index')->with('success', $message)
            : back()->with('success', $message);
    }

    public function restore(int $id)
    {
        $customer = $this->customerService->findById($id);
        $this->authorize(CustomerPermission::RESTORE->value, $customer);
        $this->customerService->restore($customer);
        return back()->with('success', 'Customer record is restored successfully.');
    }

    public function updateServiceSchedule(UpdateServiceScheduleRequest $request, int $id)
    {
        $customer = $this->customerService->findById($id);
        $this->authorize(CustomerPermission::UPDATE_SERVICE_SCHEDULE->value, $customer);
        $this->customerService->updateServiceSchedule($customer, $request->validated());
        return back()->with('success', 'Customer service schedule settings updated successfully.');
    }

    public function search(Request $request)
    {
        return CustomerCollection::make($this->customerService->search($request->all()))->resolve();
    }
}
