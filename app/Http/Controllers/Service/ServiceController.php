<?php

namespace App\Http\Controllers\Service;

use App\Enums\ModelDeleteType;
use App\Enums\Permissions\ServicePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\DeleteRequest;
use App\Http\Requests\Service\ListRequest;
use App\Http\Requests\Service\StoreRequest;
use App\Http\Requests\Service\UpdateRequest;
use App\Http\Requests\Service\UpdateServiceStatusRequest;
use App\Http\Resources\Services\ServiceCollection;
use App\Http\Resources\Services\ServiceResource;
use App\Models\Service;
use App\Services\ServiceManagementService;
use Inertia\Inertia;

class ServiceController extends Controller
{

    public function __construct(private readonly ServiceManagementService $serviceManagementService)
    {
    }

    public function index(ListRequest $request)
    {
        $this->authorize(ServicePermission::VIEW_ANY->value, Service::class);
        $validatedRequest = $request->validated();
        $validatedRequest = array_merge($validatedRequest, ['with' => ['customer', 'createdBy', 'updatedBy']]);

        return Inertia::render('services/index',[
            'services' => new ServiceCollection($this->serviceManagementService->pagination($validatedRequest)->appends($validatedRequest)),
        ]);
    }

    public function store(StoreRequest $request)
    {

        $this->authorize(ServicePermission::CREATE->value, Service::class);
        $this->serviceManagementService->create($request->validated());
        return back()->with('success', 'Service created successfully.');
    }

    public function show(int $id)
    {
        $service = $this->serviceManagementService->findById($id);
        $this->authorize(ServicePermission::VIEW->value, $service);

        $service->loadMissing(['customer', 'createdBy', 'updatedBy', 'histories.createdBy']);
        return Inertia::render('services/show',[
            'service' => ServiceResource::make($service)->resolve(),
        ]);
    }

    public function update(UpdateRequest $request, int $id)
    {
        $service = $this->serviceManagementService->findById($id);

        $this->authorize(ServicePermission::UPDATE->value, $service);
        $this->serviceManagementService->update($service, $request->validated());
        return back()->with('success', 'Service details updated successfully.');
    }

    public function delete(DeleteRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $service = $this->serviceManagementService->findById($id);

        if (($validatedData['type'] ?? null) === ModelDeleteType::PERMANENTLY->value) {
            $this->authorize(ServicePermission::FORCE_DELETE->value, $service);
            $forceDelete = true;
        } else {
            $this->authorize(ServicePermission::DELETE->value, $service);
            $forceDelete = false;
        }

        $this->serviceManagementService->delete($service, $forceDelete);
        $message = 'Service deleted'.($validatedData['type'] === 'permanent' ? ' permanently' : '').' successfully.';
        return $forceDelete
            ? redirect()->route('services.index')->with('success', $message)
            : back()->with('success', $message);
    }

    public function restore(int $id)
    {
        $service = $this->serviceManagementService->findById($id);
        $this->authorize(ServicePermission::RESTORE->value, $service);
        $this->serviceManagementService->restore($service);
        return back()->with('success', 'Service record restored successfully.');
    }

    public function updateServiceStatus(UpdateServiceStatusRequest $request, int $id)
    {
        $service = $this->serviceManagementService->findById($id);
        $this->authorize(ServicePermission::UPDATE_STATUS->value, $service);
        $this->serviceManagementService->updateServiceStatus($service, $request->validated());
        return back()->with('success', 'Service status changed successfully.');
    }
}
