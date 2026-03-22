import AppLayout from '@/layouts/app-layout';
import {
    index as customersIndex,
} from '@/routes/customers';
import { type BreadcrumbItem, Customer, PaginatedData } from '@/types';
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
import ActionsDropdown from '@/components/customers/actions-dropdown';
import CustomerFormCard from '@/components/customers/customer-form-card';
import Filters from '@/components/customers/filters';
import moment from 'moment/moment';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: customersIndex().url,
    },
];

export default function Customers({
    customers,
}: {
    customers: PaginatedData<Customer>;
}) {
    const { data, meta } = customers;
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);

    const [customerFormOpened, setCustomerFormOpened] = useState<boolean>(false);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );

    const handleCustomerFormOpen = (customer?: Customer) => {
        setSelectedCustomer(customer ?? null);
        setCustomerFormOpened(true);
    };

    const handleOpenCustomerForm = (customer?: Customer) => {
        setSelectedCustomer(customer ?? null);
        setCustomerFormOpened(true);
    }

    const handleCloseCustomerForm = () => {
        setSelectedCustomer(null);
        setCustomerFormOpened(false);
    }

    const sortableKeys = new Set([
        'contact_number',
        'name',
        'installation_date',
        'last_service_date',
        'next_service_date',
    ]);

    const orderByParam = params.get('orderBy');
    const orderParam = params.get('order');
    const sortDirection: DataTableSortDirection =
        orderParam === 'desc' ? 'desc' : 'asc';
    const sortState: DataTableSortState =
        orderByParam && sortableKeys.has(orderByParam)
            ? { key: orderByParam, direction: sortDirection }
            : null;

    const columns: DataTableColumn<Customer>[] = [
        {
            key: 'name',
            header: 'Customer',
            accessorKey: 'name',
            cellClassName: 'text-heading whitespace-nowrap',
            isRowHeader: true,
            sortable: true,
        },
        {
            key: 'contact_number',
            header: 'Contact',
            cell: (customer) => (
                <HoverCard>
                    <HoverCardTrigger>
                        <div className="flex cursor-help items-center justify-start gap-2">
                            <span>{customer.contactNumber}</span>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 space-y-2">
                        {customer.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="text-sm break-all">
                                    {customer.email}
                                </span>
                            </div>
                        )}

                        {customer.address && (
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="text-sm leading-snug">
                                    {customer.address}
                                </span>
                            </div>
                        )}
                        {customer.notes && (
                            <div className="flex items-start gap-2">
                                <NotebookPen className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="text-sm leading-snug">
                                    {customer.notes}
                                </span>
                            </div>
                        )}
                    </HoverCardContent>
                </HoverCard>
            ),
            sortable: true,
        },
        {
            key: 'installation_date',
            header: 'Installation Date',
            accessorKey: 'installationDate',
            sortable: true,
            cell: (customer) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {customer.installationDate
                            ? moment(customer.installationDate).format('ll')
                            : null}
                    </span>
                    <small>
                        {customer.installationDate
                            ? moment(customer.installationDate).fromNow()
                            : null}
                    </small>
                </div>
            ),
        },
        {
            key: 'last_service_date',
            header: 'Last Service Date',
            accessorKey: 'lastServiceDate',
            sortable: true,
            cell: (customer) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {customer.lastServiceDate
                            ? moment(customer.lastServiceDate).format('ll')
                            : null}
                    </span>
                    <small>
                        {customer.lastServiceDate
                            ? moment(customer.lastServiceDate).fromNow()
                            : null}
                    </small>
                </div>
            ),
        },
        {
            key: 'next_service_date',
            header: 'Next Service Date',
            accessorKey: 'nextServiceDate',
            sortable: true,
            cell: (customer) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {customer.nextServiceDate
                            ? moment(customer.nextServiceDate).format('ll')
                            : null}
                    </span>
                    <small>
                        {customer.nextServiceDate
                            ? moment(customer.nextServiceDate).fromNow()
                            : null}
                    </small>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            cell: (customer) => (
                <ActionsDropdown
                    customer={customer}
                    onFormOpen={handleCustomerFormOpen}
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

        router.get(customersIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-end gap-2 px-1 py-1">
                        {customerFormOpened && (
                            <Button
                                variant="secondary"
                                onClick={handleCloseCustomerForm}
                            >
                                Close
                            </Button>
                        )}
                        {!customerFormOpened && (
                            <Button
                                variant="default"
                                onClick={() => handleOpenCustomerForm()}
                            >
                                Add New Customer
                            </Button>
                        )}
                    </div>

                    {customerFormOpened && (
                        <div className="mt-2 px-1">
                            <CustomerFormCard
                                onClose={handleCloseCustomerForm}
                                selectedCustomer={selectedCustomer}
                            />
                        </div>
                    )}

                    <div className="relative rounded-sm">
                        <div className="px-1 py-2">
                            <Filters />
                        </div>
                        <DataTable
                            columns={columns}
                            data={data}
                            getRowKey={(customer) => customer.id}
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
