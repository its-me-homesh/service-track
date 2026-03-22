import AppLayout from '@/layouts/app-layout';
import { index as customersIndex } from '@/routes/customers';
import { type BreadcrumbItem, Customer, Service, ServiceStatus } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index as servicesIndex } from '@/routes/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CustomerFormCard from '@/components/customers/customer-form-card';
import CustomerAdvancedServiceSettingsForm from '@/components/customers/advance-service-settings-form';
import CustomerActionsDropdown from '@/components/customers/actions-dropdown';
import ServiceActionsDropdown from '@/components/services/actions-dropdown';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import moment from 'moment/moment';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import ServiceFormDialog from '@/components/services/service-form-dialog';
import ChangeStatusFormDialog from '@/components/services/change-status-form-dialog';
import ServiceDetailsCard from '@/components/customers/service-details-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: customersIndex().url,
    },
    {
        title: 'Customer Details & Recent Services',
        href: customersIndex().url,
    },
];

export default function CustomerDetails({
    customer,
    serviceStatuses,
}: {
    customer: Customer;
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

    const columns: DataTableColumn<Service>[] = [
        {
            key: 'service_date',
            header: 'Service Date',
            accessorKey: 'serviceDate',
            cell: (service) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {service.serviceDate
                            ? moment(service.serviceDate).format('ll')
                            : null}
                    </span>
                    <small>
                        {service.serviceDate
                            ? moment(service.serviceDate).fromNow()
                            : null}
                    </small>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            accessorKey: 'status',
            cell: (service) => (
                <Badge
                    color={service.statusDetail?.color}
                    className="cursor-pointer"
                >
                    {service.statusDetail?.label}
                </Badge>
            ),
        },
        {
            key: 'created_at',
            header: 'Created',
            accessorKey: 'createdAt',
            cell: (service) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {service.createdAt
                            ? moment(service.createdAt).format('lll')
                            : null}
                    </span>
                    <small>{service?.createdBy?.name}</small>
                </div>
            ),
        },
        {
            key: 'updated_at',
            header: 'Updated',
            accessorKey: 'updatedAt',
            cell: (service) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {service.updatedAt
                            ? moment(service.updatedAt).format('lll')
                            : null}
                    </span>
                    <small>{service?.updatedBy?.name}</small>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            cell: (service) => (
                <ServiceActionsDropdown
                    service={service}
                    onOpenForm={handleOpenServiceForm}
                    onOpenStatusForm={handleOpenStatusForm}
                />
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Details & Recent Services" />
            {serviceFormOpened && (
                <ServiceFormDialog
                    open={serviceFormOpened}
                    onOpenChange={setServiceFormOpened}
                    onClose={handleCloseServiceForm}
                    selectedService={selectedService}
                    statuses={serviceStatuses}
                    customer={selectedService ? null : customer}
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
                        <CustomerActionsDropdown
                            customer={customer}
                            context="details"
                        />
                        <Button
                            variant="default"
                            onClick={() => handleOpenServiceForm()}
                        >
                            Add Service
                        </Button>
                    </div>

                    <div className="mt-2 px-1">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <CustomerFormCard
                                className="col-span-1 lg:col-span-2"
                                selectedCustomer={customer}
                            />
                            <div className="col-span-1 flex h-full flex-col gap-2">
                                <Card className="flex-1 py-0">
                                    <Tabs
                                        defaultValue="advanced-service-settings"
                                        className="flex h-full flex-col"
                                    >
                                        <TabsList className="rounded-b-none">
                                            <TabsTrigger value="advanced-service-settings">
                                                Advanced Service Settings
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent
                                            value="advanced-service-settings"
                                            className="flex-1"
                                        >
                                            <CustomerAdvancedServiceSettingsForm
                                                selectedCustomer={customer}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </Card>
                                {customer.lastService && (
                                    <ServiceDetailsCard
                                        className="mt-2"
                                        onOpenForm={handleOpenServiceForm}
                                        onOpenStatusForm={() =>
                                            handleOpenStatusForm(
                                                customer.lastService!,
                                            )
                                        }
                                        service={customer.lastService}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-2 rounded-sm">
                        <div className="px-1 py-2">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-sm">Recent Services</div>

                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={`${servicesIndex().url}?customerId[]=${customer.id}`}
                                        className="flex items-center justify-end gap-2 text-sm text-sky-600 uppercase"
                                    >
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <ExternalLink className="h-4 w-4" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Click this link to view all
                                                services for this customer.
                                            </TooltipContent>
                                        </Tooltip>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <DataTable
                            columns={columns}
                            data={customer?.recentServices}
                            rowClassName={(_, index) =>
                                index % 2 === 0 ? 'bg-sidebar' : 'bg-background'
                            }
                            getRowKey={(service) => service.id}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
