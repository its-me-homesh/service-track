import ActionsDropdown from '@/components/services/actions-dropdown';
import ServiceDetailsCard from '@/components/services/service-details-card';
import ChangeStatusFormDialog from '@/components/services/change-status-form-dialog';
import ServiceFormDialog from '@/components/services/service-form-dialog';
import AppLayout from '@/layouts/app-layout';
import { index as servicesIndex } from '@/routes/services';
import {
    type BreadcrumbItem,
    Service,
    ServiceStatus,
} from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ServiceTimelineCard from '@/components/services/service-timeline-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: servicesIndex().url,
    },
    {
        title: 'Service Details & Timeline',
        href: servicesIndex().url,
    },
];

export default function ServiceDetails({
    service,
    serviceStatuses
}: {
    service: Service;
    serviceStatuses: ServiceStatus[];
}) {
    const [serviceFormOpened, setServiceFormOpened] = useState<boolean>(false);

    const [statusFormOpened, setStatusFormOpened] = useState<boolean>(false);

    const [selectedService, setSelectedService] = useState<Service | null>(
        null,
    );

    const handleOpenServiceForm = (service?: Service) => {
        setSelectedService(service ?? null);
        setServiceFormOpened(true);
    };

    const handleCloseServiceForm = () => {
        setSelectedService(null);
        setServiceFormOpened(false);
    };

    const handleOpenStatusForm = (service: Service) => {
        setSelectedService(service);
        setStatusFormOpened(true);
    };

    const handleCloseStatusForm = () => {
        setSelectedService(null);
        setStatusFormOpened(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Service Details & Timeline" />
            {serviceFormOpened && (
                <ServiceFormDialog
                    open={serviceFormOpened}
                    onOpenChange={setServiceFormOpened}
                    onClose={handleCloseServiceForm}
                    selectedService={selectedService}
                    statuses={serviceStatuses}
                />
            )}

            {selectedService && statusFormOpened && (
                <ChangeStatusFormDialog
                    open={statusFormOpened}
                    onOpenChange={setStatusFormOpened}
                    onClose={handleCloseStatusForm}
                    selectedService={selectedService}
                    statuses={serviceStatuses}
                />
            )}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-end gap-2 px-1 py-1">
                        <ActionsDropdown
                            onOpenForm={handleOpenServiceForm}
                            onOpenStatusForm={handleOpenStatusForm}
                            service={service}
                            context="details"
                        />
                    </div>

                    <div className="mt-2 px-1">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <ServiceDetailsCard
                                className="col-span-2 h-full"
                                service={service}
                            />
                            {service.histories && (
                                <ServiceTimelineCard
                                    className="h-full"
                                    histories={service.histories}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
