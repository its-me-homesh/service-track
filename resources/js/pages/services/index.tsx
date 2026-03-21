import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    PaginatedData,
    Service,
    ServiceStatus,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import { Pagination } from '@/components/ui/Pagination/pagination';
import { Mail, MapPin, NotebookPen } from 'lucide-react';

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Button } from '@/components/ui/button';
import {
    DataTable,
    DataTableColumn,
    DataTableSortDirection,
    DataTableSortState,
} from '@/components/ui/data-table';
import { useState } from 'react';
import Filters from '@/components/services/filters';
import { index as servicesIndex } from '@/routes/services';
import ActionsDropdown from '@/components/services/actions-dropdown';
import ServiceFormDialog from '@/components/services/service-form-dialog';
import { Badge } from '@/components/ui/badge';
import ChangeStatusFormDialog from '@/components/services/change-status-form-dialog';
import moment from 'moment';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: servicesIndex().url,
    },
];

export default function Services({
    services,
    serviceStatuses,
}: {
    services: PaginatedData<Service>;
    serviceStatuses: ServiceStatus[];
}) {
    const { data, meta } = services;
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);

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

    const sortableKeys = new Set([
        'customer_id',
        'service_date',
        'status',
        'created_at',
        'updated_at',
    ]);

    const orderByParam = params.get('orderBy');
    const orderParam = params.get('order');
    const sortDirection: DataTableSortDirection =
        orderParam === 'desc' ? 'desc' : 'asc';
    const sortState: DataTableSortState =
        orderByParam && sortableKeys.has(orderByParam)
            ? { key: orderByParam, direction: sortDirection }
            : null;

    const columns: DataTableColumn<Service>[] = [
        {
            key: 'customer_id',
            header: 'Customer',
            accessorKey: 'customerId',
            cellClassName: 'text-heading whitespace-nowrap',
            isRowHeader: true,
            sortable: true,
            cell: (service) => (
                <HoverCard>
                    <HoverCardTrigger>
                        <div className="flex cursor-help flex-col items-start justify-start gap-0.5">
                            <span>{service?.customer?.name}</span>
                            <small>{service?.customer?.contactNumber}</small>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 space-y-2">
                        {service?.customer?.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="text-sm break-all">
                                    {service?.customer?.email}
                                </span>
                            </div>
                        )}

                        {service?.customer?.address && (
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="text-sm leading-snug">
                                    {service?.customer?.address}
                                </span>
                            </div>
                        )}
                        {service?.customer?.notes && (
                            <div className="flex items-start gap-2">
                                <NotebookPen className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="text-sm leading-snug">
                                    {service?.customer?.notes}
                                </span>
                            </div>
                        )}
                    </HoverCardContent>
                </HoverCard>
            ),
        },
        {
            key: 'service_date',
            header: 'Service Date',
            accessorKey: 'serviceDate',
            sortable: true,
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
            sortable: true,
            cell: (service) => (
                <Badge
                    color={service.statusDetail?.color}
                    className="cursor-pointer"
                    onClick={() => handleOpenStatusForm(service)}
                >
                    {service.statusDetail?.label}
                </Badge>
            ),
        },
        {
            key: 'created_at',
            header: 'Created',
            accessorKey: 'createdAt',
            sortable: true,
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
            sortable: true,
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
                <ActionsDropdown
                    service={service}
                    onOpenForm={handleOpenServiceForm}
                    onOpenStatusForm={handleOpenStatusForm}
                />
            ),
        },
    ];

    const handleSortChange = (columnKey: string) => {
        const nextDirection: DataTableSortDirection | null =
            sortState?.key === columnKey
                ? sortState.direction === 'asc'
                    ? 'desc'
                    : null
                : 'asc';

        const query = Object.fromEntries(params.entries());

        if (nextDirection) {
            query.orderBy = columnKey;
            query.order = nextDirection;
        } else {
            delete query.orderBy;
            delete query.order;
        }

        delete query.page;

        router.get(servicesIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-end gap-2 px-1 py-1">
                        <Button
                            variant="default"
                            onClick={() => handleOpenServiceForm()}
                        >
                            Add New Service
                        </Button>
                    </div>

                    <ServiceFormDialog
                        open={serviceFormOpened}
                        onOpenChange={setServiceFormOpened}
                        onClose={handleCloseServiceForm}
                        selectedService={selectedService}
                        statuses={serviceStatuses}
                    />
                    {selectedService && (
                        <ChangeStatusFormDialog
                            open={statusFormOpened}
                            onOpenChange={setStatusFormOpened}
                            onClose={handleCloseStatusForm}
                            selectedService={selectedService}
                            statuses={serviceStatuses}
                        />
                    )}

                    <div className="relative mt-2 rounded-sm">
                        <div className="px-1 py-2">
                            <Filters statuses={serviceStatuses} />
                        </div>
                        <DataTable
                            columns={columns}
                            data={data}
                            getRowKey={(service) => service.id}
                            rowClassName={(_, index) =>
                                index % 2 === 0 ? 'bg-sidebar' : 'bg-background'
                            }
                            sortState={sortState}
                            onSortChange={handleSortChange}
                        />
                    </div>
                    <Pagination meta={meta} />
                </div>
            </div>
        </AppLayout>
    );
}
